//! File Watcher Module - Monitors game save directories and triggers automatic backups.
//!
//! When the file watcher is enabled:
//! 1. It watches all known save paths from the scan cache.
//! 2. When a save file is modified, it marks the game as "dirty".
//! 3. A background thread periodically checks if the game process has exited.
//! 4. Once the game exits, it performs a silent backup and shows a Windows notification.

use notify::{Event, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use std::collections::{HashMap, HashSet};
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
use std::time::Duration;
use sysinfo::System;
use tauri::Emitter;

/// Holds the state of the background file watcher.
pub struct WatcherState {
    /// The underlying filesystem watcher (if active).
    _watcher: Option<RecommendedWatcher>,
    /// Maps watched directory paths to game titles.
    path_to_game: HashMap<PathBuf, String>,
    /// Set of game titles that have pending (dirty) save changes.
    dirty_games: Arc<Mutex<HashSet<String>>>,
    /// Whether the watcher is currently active.
    enabled: bool,
}

impl Default for WatcherState {
    fn default() -> Self {
        Self::new()
    }
}

impl WatcherState {
    pub fn new() -> Self {
        Self {
            _watcher: None,
            path_to_game: HashMap::new(),
            dirty_games: Arc::new(Mutex::new(HashSet::new())),
            enabled: false,
        }
    }
}

/// Global watcher state, protected by a mutex.
static WATCHER_STATE: std::sync::LazyLock<Mutex<WatcherState>> =
    std::sync::LazyLock::new(|| Mutex::new(WatcherState::new()));

/// Loads the file watcher enabled setting from ludocard.json in the app data directory.
pub fn load_file_watcher_setting(app_data_dir: &Path) -> bool {
    let config_path = app_data_dir.join("ludocard.json");
    if let Ok(content) = std::fs::read_to_string(&config_path)
        && let Ok(json) = serde_json::from_str::<serde_json::Value>(&content) {
            return json.get("file_watcher").and_then(|v| v.as_bool()).unwrap_or(false);
        }
    false
}

/// Saves the file watcher enabled setting to ludocard.json in the app data directory.
pub fn save_file_watcher_setting(app_data_dir: &Path, enabled: bool) {
    let config_path = app_data_dir.join("ludocard.json");

    // Read existing config or create new
    let mut json: serde_json::Value = if let Ok(content) = std::fs::read_to_string(&config_path) {
        serde_json::from_str(&content).unwrap_or(serde_json::json!({}))
    } else {
        serde_json::json!({})
    };

    json["file_watcher"] = serde_json::json!(enabled);

    let _ = std::fs::create_dir_all(app_data_dir);
    let _ = std::fs::write(&config_path, serde_json::to_string_pretty(&json).unwrap_or_default());
}

/// Shows a native OS toast notification.
pub fn show_notification(title: &str, body: &str) {
    let result = notify_rust::Notification::new()
        .summary(title)
        .body(body)
        .appname("Ludocard")
        .timeout(notify_rust::Timeout::Milliseconds(5000))
        .show();

    if let Err(e) = result {
        log::warn!("Failed to show notification: {}", e);
    }
}

/// Checks if a game executable is likely running by searching active processes.
///
/// Strategy: Check if any running process has an exe path located inside
/// one of the configured game root directories.
fn is_game_likely_running(game_title: &str) -> bool {
    let sys = System::new_all();
    let game_lower = game_title.to_lowercase();

    for process in sys.processes().values() {
        if let Some(exe_path) = process.exe() {
            let exe_str = exe_path.to_string_lossy().to_lowercase();
            // Check if the executable path contains the game name (or a slugified version)
            let slug = game_lower
                .chars()
                .map(|c| if c.is_alphanumeric() { c } else { '-' })
                .collect::<String>();

            if exe_str.contains(&game_lower) || exe_str.contains(&slug) {
                return true;
            }
        }
    }
    false
}

/// Performs a silent backup for a single game using the Ludusavi API.
fn backup_game_silent(game_title: &str) -> Result<(), String> {
    use ludusavi::{
        api::Ludusavi,
        prelude::{Finality, SyncDirection},
    };

    let mut api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

    api.back_up(ludusavi::api::parameters::BackUp {
        games: vec![game_title.to_string()],
        finality: Finality::Final,
        resolve_cloud_conflict: Some(SyncDirection::Upload),
        wine_prefix: None,
        include_disabled: true,
        skip_downgrade: false,
    })
    .map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

    Ok(())
}

/// Finds the game title whose save path contains the given modified path.
fn find_game_for_path(path: &Path, path_to_game: &HashMap<PathBuf, String>) -> Option<String> {
    let path_str = path.to_string_lossy().to_lowercase();

    for (watched_dir, game_title) in path_to_game {
        let watched_str = watched_dir.to_string_lossy().to_lowercase();
        if path_str.starts_with(&watched_str) {
            return Some(game_title.clone());
        }
    }
    None
}

/// Starts or restarts the file watcher based on current scan cache data.
/// Call this after scan_games completes or when the setting is toggled on.
pub fn start_file_watcher(app: &tauri::AppHandle) {
    use tauri::Manager;

    let app_data_dir = match app.path().app_data_dir() {
        Ok(dir) => dir,
        Err(_) => return,
    };

    let enabled = load_file_watcher_setting(&app_data_dir);
    if !enabled {
        stop_file_watcher();
        return;
    }

    // Load scan cache to know which directories to watch
    let mut scan_cache = crate::commands::get_scan_cache();
    if scan_cache.is_empty() {
        scan_cache = crate::commands::load_scan_cache(&app_data_dir);
    }
    if scan_cache.is_empty() {
        log::info!("[FileWatcher] No scan cache available, nothing to watch.");
        return;
    }

    // Build the path-to-game mapping
    let mut path_to_game: HashMap<PathBuf, String> = HashMap::new();
    for (game_title, info) in &scan_cache {
        let save_path_str = &info.save_path;
        if save_path_str.is_empty() {
            continue;
        }
        let save_path = PathBuf::from(save_path_str);
        // Watch the parent directory of the save file (or the dir itself)
        let watch_dir = if save_path.is_file() || (save_path.extension().is_some() && save_path.parent().is_some()) {
            save_path.parent().unwrap_or(&save_path).to_path_buf()
        } else {
            save_path
        };

        if watch_dir.exists() {
            path_to_game.insert(watch_dir, game_title.clone());
        }
    }

    if path_to_game.is_empty() {
        log::info!("[FileWatcher] No valid save paths found to watch.");
        return;
    }

    log::info!(
        "[FileWatcher] Setting up watchers for {} game save directories.",
        path_to_game.len()
    );

    let dirty_games = Arc::new(Mutex::new(HashSet::<String>::new()));
    let dirty_games_for_watcher = dirty_games.clone();
    let path_map_for_watcher = path_to_game.clone();

    // Create the filesystem watcher
    let watcher_result = notify::recommended_watcher(move |res: Result<Event, notify::Error>| {
        match res {
            Ok(event) => {
                // Only care about data modifications and creations
                match event.kind {
                    EventKind::Modify(_) | EventKind::Create(_) => {
                        for path in &event.paths {
                            if let Some(game_title) = find_game_for_path(path, &path_map_for_watcher) {
                                log::info!("[FileWatcher] Save change detected for '{}': {:?}", game_title, path);
                                let mut dirty = dirty_games_for_watcher.lock().unwrap();
                                dirty.insert(game_title);
                            }
                        }
                    }
                    _ => {}
                }
            }
            Err(e) => {
                log::warn!("[FileWatcher] Watch error: {:?}", e);
            }
        }
    });

    let mut watcher = match watcher_result {
        Ok(w) => w,
        Err(e) => {
            log::error!("[FileWatcher] Failed to create watcher: {:?}", e);
            return;
        }
    };

    // Add all save directories to the watcher
    for dir in path_to_game.keys() {
        if let Err(e) = watcher.watch(dir, RecursiveMode::Recursive) {
            log::warn!("[FileWatcher] Failed to watch {:?}: {:?}", dir, e);
        } else {
            log::info!("[FileWatcher] Watching: {:?}", dir);
        }
    }

    // Store the state
    {
        let mut state = WATCHER_STATE.lock().unwrap();
        state._watcher = Some(watcher);
        state.path_to_game = path_to_game;
        state.dirty_games = dirty_games.clone();
        state.enabled = true;
    }

    // Emit event to frontend
    let _ = app.emit("file-watcher-status", serde_json::json!({ "active": true }));

    // Start the background checker thread
    let app_handle = app.clone();
    std::thread::spawn(move || {
        log::info!("[FileWatcher] Background checker thread started.");
        loop {
            std::thread::sleep(Duration::from_secs(10));

            // Check if watcher is still enabled
            {
                let state = WATCHER_STATE.lock().unwrap();
                if !state.enabled {
                    log::info!("[FileWatcher] Watcher disabled, stopping checker thread.");
                    break;
                }
            }

            // Get dirty games snapshot
            let dirty_snapshot: Vec<String> = {
                let dirty = dirty_games.lock().unwrap();
                dirty.iter().cloned().collect()
            };

            if dirty_snapshot.is_empty() {
                continue;
            }

            for game_title in &dirty_snapshot {
                if is_game_likely_running(game_title) {
                    log::info!(
                        "[FileWatcher] '{}' has pending changes but game is still running.",
                        game_title
                    );
                    continue;
                }

                // Game has exited and has pending changes — perform backup
                log::info!(
                    "[FileWatcher] '{}' - game exited with pending changes. Starting silent backup...",
                    game_title
                );

                match backup_game_silent(game_title) {
                    Ok(()) => {
                        log::info!("[FileWatcher] '{}' - backup completed successfully.", game_title);
                        show_notification(
                            "Ludocard - Backup automático",
                            &format!("Save de \"{}\" salvo com sucesso! ✅", game_title),
                        );

                        // Notify frontend
                        let _ = app_handle.emit(
                            "file-watcher-backup",
                            serde_json::json!({
                                "game": game_title,
                                "success": true,
                            }),
                        );
                    }
                    Err(e) => {
                        log::error!("[FileWatcher] '{}' - backup failed: {}", game_title, e);
                        show_notification(
                            "Ludocard - Falha no backup",
                            &format!("Erro ao salvar \"{}\": {}", game_title, e),
                        );

                        let _ = app_handle.emit(
                            "file-watcher-backup",
                            serde_json::json!({
                                "game": game_title,
                                "success": false,
                                "error": e,
                            }),
                        );
                    }
                }

                // Remove from dirty set
                {
                    let mut dirty = dirty_games.lock().unwrap();
                    dirty.remove(game_title);
                }
            }
        }
    });
}

/// Stops the file watcher and cleans up resources.
pub fn stop_file_watcher() {
    let mut state = WATCHER_STATE.lock().unwrap();
    state._watcher = None;
    state.path_to_game.clear();
    state.dirty_games.lock().unwrap().clear();
    state.enabled = false;
    log::info!("[FileWatcher] Stopped.");
}

/// Sets up the file watcher during Tauri app initialization.
/// Called from main.rs in the `.setup()` hook.
pub fn setup_watcher(app: &tauri::AppHandle) {
    use tauri::Manager;

    let app_data_dir = match app.path().app_data_dir() {
        Ok(dir) => dir,
        Err(_) => return,
    };

    let enabled = load_file_watcher_setting(&app_data_dir);
    if !enabled {
        log::info!("[FileWatcher] File watcher is disabled in settings. Skipping setup.");
        return;
    }

    log::info!("[FileWatcher] Initializing file watcher on startup...");
    start_file_watcher(app);
}
