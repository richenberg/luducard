use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{LazyLock, Mutex};
use std::path::{Path, PathBuf};
use std::io::Read;
use base64::Engine;
use tauri::Emitter;
use tauri::Manager;
use walkdir::WalkDir;
use ludusavi::{
    api::{Ludusavi, parameters},
    prelude::{Finality, SyncDirection, StrictPath},
    report::ApiGame,
    resource::{SaveableResourceFile, config::Root, manifest::Store},
};

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FrontendBackupVersion {
    pub id: String,
    pub date: String,
    pub time: String,
    pub kind: String,
    #[serde(rename = "sizeMB")]
    pub size_mb: f64,
    pub cloud: bool,
    pub locked: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FrontendGame {
    pub id: String,
    pub title: String,
    pub cover: String,
    pub platform: String,
    pub save_path: String,
    #[serde(rename = "sizeMB")]
    pub size_mb: f64,
    pub last_backup: String,
    pub status: String, // "ok" | "pending" | "never"
    pub auto_backup: bool,
    pub cloud_sync: bool,
    pub backups: Vec<FrontendBackupVersion>,
    #[serde(rename = "backupsSizeMB")]
    pub backups_size_mb: f64,
    pub installed: bool,
    pub last_played: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FrontendSettings {
    pub backup_path: String,
    pub rclone_path: String,
    pub cloud_path: String,
    pub cloud_sync: bool,
    pub rclone_arguments: String,
    pub file_watcher: bool,
    pub system_tray: bool,
    pub start_with_windows: bool,
    pub portable: bool,
    pub supabase_url: String,
    pub supabase_anon_key: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FrontendRoot {
    pub id: String,
    pub path: String,
    pub store: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LudocardMetadata {
    pub game_title: String,
    pub game_id: String,
    pub checkpoint_title: String,
    pub description: String,
    pub original_files: Vec<String>,
    pub created_at: String,
    pub total_size_bytes: u64,
    pub compressed_size_bytes: u64,
    pub client_uuid: String,
}

/// Get or create a persistent anonymous client UUID stored in ludocard.json.
/// This UUID is used for community repository quota enforcement.
fn get_or_create_client_uuid(app_data_dir: &Path) -> String {
    let config_path = app_data_dir.join("ludocard.json");
    let mut json: serde_json::Value = if let Ok(content) = std::fs::read_to_string(&config_path) {
        serde_json::from_str(&content).unwrap_or(serde_json::json!({}))
    } else {
        serde_json::json!({})
    };

    if let Some(uuid_str) = json.get("client_uuid").and_then(|v| v.as_str()) {
        return uuid_str.to_string();
    }

    // Generate a new UUID v4
    let new_uuid = uuid::Uuid::new_v4().to_string();
    json["client_uuid"] = serde_json::json!(new_uuid);
    let _ = std::fs::create_dir_all(app_data_dir);
    let _ = std::fs::write(&config_path, serde_json::to_string_pretty(&json).unwrap_or_default());
    new_uuid
}

// --- Scan cache: stores results of the last full filesystem scan ---
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CachedScanInfo {
    pub save_path: String,
    pub size_bytes: u64,
    pub has_changes: bool,
    #[serde(default)]
    pub install_dir: Option<String>,
}

static SCAN_CACHE: LazyLock<Mutex<HashMap<String, CachedScanInfo>>> =
    LazyLock::new(|| Mutex::new(HashMap::new()));

/// Returns a snapshot of the current scan cache (used by the file watcher module).
pub fn get_scan_cache() -> HashMap<String, CachedScanInfo> {
    SCAN_CACHE.lock().unwrap().clone()
}

fn save_scan_cache(app_dir: &Path, cache: &HashMap<String, CachedScanInfo>) {
    let path = app_dir.join("scan_cache.json");
    if let Ok(content) = serde_json::to_string(cache) {
        let _ = std::fs::write(path, content);
    }
}

pub fn load_scan_cache(app_dir: &Path) -> HashMap<String, CachedScanInfo> {
    let path = app_dir.join("scan_cache.json");
    if let Ok(content) = std::fs::read_to_string(path) {
        if let Ok(cache) = serde_json::from_str(&content) {
            return cache;
        }
    }
    HashMap::new()
}

static COVER_CACHE: LazyLock<Mutex<HashMap<String, String>>> =
    LazyLock::new(|| Mutex::new(HashMap::new()));

fn slugify(name: &str) -> String {
    name.to_lowercase()
        .chars()
        .map(|c| if c.is_alphanumeric() { c } else { '-' })
        .collect::<String>()
        .split('-')
        .filter(|s| !s.is_empty())
        .collect::<Vec<_>>()
        .join("-")
}

fn get_game_cover(app_data_dir: Option<&Path>, slug: &str) -> String {
    let mock_slugs = [
        "aether-frontier",
        "ironclad-legion",
        "neon-drift",
        "hollow-pines",
        "starforge",
        "shadowveil",
        "pixel-knights",
    ];
    if mock_slugs.contains(&slug) {
        return format!("/covers/{}.png", slug);
    }

    {
        let cache = COVER_CACHE.lock().unwrap();
        if let Some(cached) = cache.get(slug) {
            return cached.clone();
        }
    }

    if let Some(dir) = app_data_dir {
        for ext in &["jpg", "png"] {
            let file_path = dir.join("covers").join(format!("{}.{}", slug, ext));
            if file_path.exists() {
                if let Ok(bytes) = std::fs::read(&file_path) {
                    let encoded = base64::engine::general_purpose::STANDARD.encode(&bytes);
                    let mime = if *ext == "png" { "image/png" } else { "image/jpeg" };
                    let base64_uri = format!("data:{};base64,{}", mime, encoded);

                    let mut cache = COVER_CACHE.lock().unwrap();
                    cache.insert(slug.to_string(), base64_uri.clone());
                    return base64_uri;
                }
            }
        }
    }

    "/placeholder.svg".to_string()
}

fn search_steam_app_id(client: &reqwest::blocking::Client, title: &str) -> Result<u32, String> {
    let resp = client
        .get("https://store.steampowered.com/api/storesearch/")
        .query(&[("term", title), ("l", "english"), ("cc", "US")])
        .send()
        .map_err(|e| e.to_string())?;

    if !resp.status().is_success() {
        return Err("Steam API search failed".to_string());
    }

    #[derive(Deserialize)]
    struct SteamSearchItem {
        id: u32,
    }

    #[derive(Deserialize)]
    struct SteamSearchResponse {
        items: Vec<SteamSearchItem>,
    }

    let result: SteamSearchResponse = resp.json().map_err(|e| e.to_string())?;
    if let Some(first) = result.items.first() {
        Ok(first.id)
    } else {
        Err("No matching steam game found".to_string())
    }
}

fn start_cover_downloads(
    app: &tauri::AppHandle,
    games_to_download: Vec<(String, String, Option<u32>)>,
) {
    if games_to_download.is_empty() {
        return;
    }

    static IS_DOWNLOADING: LazyLock<Mutex<bool>> = LazyLock::new(|| Mutex::new(false));

    let mut is_downloading = IS_DOWNLOADING.lock().unwrap();
    if *is_downloading {
        return;
    }
    *is_downloading = true;

    let app = app.clone();
    tokio::task::spawn_blocking(move || {
        let total = games_to_download.len();

        let _ = app.emit(
            "cover-download-progress",
            serde_json::json!({
                "downloading": true,
                "current": 0,
                "total": total,
                "percentage": 0,
            }),
        );

        let app_data_dir = match app.path().app_data_dir() {
            Ok(p) => p,
            Err(_) => {
                let mut active = IS_DOWNLOADING.lock().unwrap();
                *active = false;
                return;
            }
        };

        let covers_dir = app_data_dir.join("covers");
        if let Err(e) = std::fs::create_dir_all(&covers_dir) {
            println!("Failed to create covers dir: {:?}", e);
            let mut active = IS_DOWNLOADING.lock().unwrap();
            *active = false;
            return;
        }

        let client = reqwest::blocking::Client::builder()
            .timeout(std::time::Duration::from_secs(10))
            .build()
            .unwrap_or_default();

        for (i, (slug, title, steam_id)) in games_to_download.iter().enumerate() {
            let mut app_id = *steam_id;
            if app_id.is_none() {
                if let Ok(search_res) = search_steam_app_id(&client, title) {
                    app_id = Some(search_res);
                }
            }

            let mut downloaded = false;
            let mut base64_uri = String::new();

            if let Some(id) = app_id {
                let url = format!(
                    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/{}/library_600x900.jpg",
                    id
                );
                if let Ok(resp) = client.get(&url).send() {
                    if resp.status().is_success() {
                        if let Ok(bytes) = resp.bytes() {
                            if bytes.len() > 1000 {
                                let file_path = covers_dir.join(format!("{}.jpg", slug));
                                if std::fs::write(&file_path, &bytes).is_ok() {
                                    let encoded = base64::engine::general_purpose::STANDARD.encode(&bytes);
                                    base64_uri = format!("data:image/jpeg;base64,{}", encoded);

                                    let mut cache = COVER_CACHE.lock().unwrap();
                                    cache.insert(slug.clone(), base64_uri.clone());
                                    downloaded = true;
                                }
                            }
                        }
                    }
                }
            }

            if downloaded {
                let _ = app.emit(
                    "cover-downloaded",
                    serde_json::json!({
                        "gameId": slug,
                        "cover": base64_uri,
                    }),
                );
            }

            let current = i + 1;
            let percentage = (current * 100) / total;
            let _ = app.emit(
                "cover-download-progress",
                serde_json::json!({
                    "downloading": current < total,
                    "current": current,
                    "total": total,
                    "percentage": percentage,
                }),
            );
        }

        let mut active = IS_DOWNLOADING.lock().unwrap();
        *active = false;
    });
}

fn sanitize_game_title(title: &str) -> String {
    title
        .chars()
        .map(|c| match c {
            ':' | '*' | '?' | '"' | '<' | '>' | '|' | '/' | '\\' => '_',
            _ => c,
        })
        .collect()
}

fn normalize_name(name: &str) -> String {
    name.chars()
        .filter(|c| c.is_alphanumeric())
        .collect::<String>()
        .to_lowercase()
}

fn find_game_install_dir(
    root_path: &Path,
    game_title: &str,
    candidate_dirs: &[String],
) -> Option<PathBuf> {
    if !root_path.is_dir() {
        return None;
    }

    // 1. Direct match for any candidate
    for candidate in candidate_dirs {
        let path = root_path.join(candidate);
        if path.is_dir() {
            return Some(path);
        }
    }

    // 2. Normalize and check subdirectories (1 level deep)
    let normalized_game = normalize_name(game_title);
    if normalized_game.len() < 3 {
        return None;
    }

    let mut candidates_normalized: Vec<String> = candidate_dirs
        .iter()
        .map(|c| normalize_name(c))
        .filter(|c| c.len() >= 3)
        .collect();
    candidates_normalized.push(normalized_game.clone());

    if let Ok(entries) = std::fs::read_dir(root_path) {
        for entry in entries.filter_map(|e| e.ok()) {
            if let Ok(file_type) = entry.file_type() {
                if file_type.is_dir() {
                    let folder_name = entry.file_name().to_string_lossy().to_string();
                    let normalized_folder = normalize_name(&folder_name);

                    // Match if normalized folder contains any normalized candidate (or vice versa)
                    for cn in &candidates_normalized {
                        if normalized_folder.contains(cn) || cn.contains(&normalized_folder) {
                            return Some(entry.path());
                        }
                    }
                }
            }
        }
    }

    None
}

/// Check if a game's installation directory exists and contains at least one executable.
/// This is a lightweight check that avoids false positives from leftover save files.
fn check_if_game_installed(
    api: &Ludusavi,
    name: &str,
) -> bool {
    let game_meta = match api.manifest.0.get(name) {
        Some(meta) => meta,
        None => return false,
    };

    // Collect candidate install dir names from the manifest
    let mut candidate_dirs: Vec<String> = game_meta.install_dir.keys().cloned().collect();
    candidate_dirs.push(name.to_string());

    for root in &api.config.roots {
        let games_path = root.games_path();
        let games_path_str = games_path.render();
        let games_dir = Path::new(&games_path_str);

        if !games_dir.is_dir() {
            continue;
        }

        let install_path = match find_game_install_dir(games_dir, name, &candidate_dirs) {
            Some(p) => p,
            None => continue,
        };

        // Check if this directory contains at least one .exe file (Windows)
        // or any regular file (non-Windows) - lightweight shallow scan
        let has_executable = WalkDir::new(&install_path)
            .max_depth(3) // Only check top-level and 2 levels down
            .into_iter()
            .filter_map(|e| e.ok())
            .any(|entry| {
                if !entry.file_type().is_file() {
                    return false;
                }
                if cfg!(windows) {
                    entry
                        .path()
                        .extension()
                        .is_some_and(|ext| ext.eq_ignore_ascii_case("exe"))
                } else {
                    // On Linux/Mac, any file in the install dir is a good indicator
                    true
                }
            });

        if has_executable {
            return true;
        }
    }

    false
}

/// Get the latest modification time from save files on disk.
/// Returns an ISO 8601 string if found, None otherwise.
fn get_latest_modified_time(save_path: &str) -> Option<String> {
    if save_path.is_empty() {
        return None;
    }

    let path = Path::new(save_path);

    // If save_path points to a file, check its parent directory
    let dir_to_scan = if path.is_file() {
        path.parent()?
    } else if path.is_dir() {
        path
    } else {
        return None;
    };

    let mut latest: Option<std::time::SystemTime> = None;

    // Shallow scan (max_depth 3) to avoid traversing huge trees
    for entry in WalkDir::new(dir_to_scan)
        .max_depth(3)
        .into_iter()
        .filter_map(|e| e.ok())
    {
        if !entry.file_type().is_file() {
            continue;
        }
        if let Ok(metadata) = entry.metadata() {
            if let Ok(modified) = metadata.modified() {
                match latest {
                    Some(current) if modified > current => latest = Some(modified),
                    None => latest = Some(modified),
                    _ => {}
                }
            }
        }
    }

    latest.map(|t| {
        let datetime: chrono::DateTime<chrono::Local> = t.into();
        datetime.to_rfc3339()
    })
}

/// Build a FrontendGame from a combination of scan data, backup data, and cached scan info.
fn build_frontend_game(
    app_data_dir: Option<&Path>,
    api: &Ludusavi,
    name: &str,
    scan_game: Option<&ApiGame>,
    backup_game: Option<&ApiGame>,
    cached_scan: Option<&CachedScanInfo>,
) -> FrontendGame {
    let display_title = api.config.display_name(name).to_string();
    let slug = slugify(name);

    let mut save_path = String::new();
    let mut size_bytes = 0u64;
    let mut has_changes = false;

    // Priority: live scan data > cached scan data
    if let Some(ApiGame::Operative { change, files, .. }) = scan_game {
        has_changes = change.is_changed();
        if let Some(first_path) = files.keys().next() {
            save_path = first_path.clone();
        }
        size_bytes = files.values().map(|f| f.bytes).sum();
    } else if let Some(cached) = cached_scan {
        save_path = cached.save_path.clone();
        size_bytes = cached.size_bytes;
        has_changes = cached.has_changes;
    }

    let mut backups_list = Vec::new();

    if let Some(ApiGame::Stored { backups, .. }) = backup_game {
        for b in backups {
            let local_time = b.when.with_timezone(&chrono::Local);
            let date_str = local_time.format("%d %b %Y").to_string();
            let time_str = local_time.format("%H:%M").to_string();

            backups_list.push(FrontendBackupVersion {
                id: b.name.clone(),
                date: date_str,
                time: time_str,
                kind: if b.locked { "Manual (Bloqueado)" } else { "Automático" }.to_string(),
                size_mb: (b.size_bytes as f64) / (1024.0 * 1024.0),
                cloud: api.config.cloud.synchronize,
                locked: b.locked,
            });
        }
    }

    // Sort backups: latest first
    backups_list.reverse();

    let last_backup_str = if let Some(latest) = backups_list.first() {
        format!("{}, {}", latest.date, latest.time)
    } else {
        "Nunca".to_string()
    };

    let cover_path = get_game_cover(app_data_dir, &slug);

    // Determine platform from manifest metadata
    let game_meta = api.manifest.0.get(name);
    let mut platform = "Steam".to_string();
    if let Some(meta) = game_meta {
        if meta.steam.id.is_some() {
            platform = "Steam".to_string();
        } else if meta.gog.id.is_some() {
            platform = "GOG".to_string();
        } else if !meta.files.is_empty() {
            platform = "Epic".to_string();
        }
    }

    let auto_backup = api.config.is_game_enabled_for_backup(name);
    let cloud_sync = api.config.cloud.synchronize;

    let status = if backups_list.is_empty() {
        "never".to_string()
    } else if has_changes {
        "pending".to_string()
    } else {
        "ok".to_string()
    };

    // Determine installed status:
    // For known platforms (Steam/GOG/Epic/etc.), check if the install directory
    // actually contains an executable. For other/custom games, fall back to
    // checking if save files exist (old behavior).
    let has_known_store = game_meta.map(|m| m.steam.id.is_some() || m.gog.id.is_some()).unwrap_or(false)
        || matches!(platform.as_str(), "Steam" | "GOG" | "Epic" | "Origin" | "Ea" | "Uplay");

    let installed = if has_known_store {
        check_if_game_installed(api, name)
    } else {
        !save_path.is_empty()
    };

    // Calculate last_played from save file modification times
    let last_played = get_latest_modified_time(&save_path);

    let backups_size_mb = backups_list.iter().map(|b| b.size_mb).sum::<f64>();

    FrontendGame {
        id: slug,
        title: display_title,
        cover: cover_path,
        platform,
        save_path,
        size_mb: (size_bytes as f64) / (1024.0 * 1024.0),
        last_backup: last_backup_str,
        status,
        auto_backup,
        cloud_sync,
        backups: backups_list,
        backups_size_mb,
        installed,
        last_played,
    }
}

/// Fast load: only reads backup directory structure + merges cached scan data.
/// Does NOT scan the filesystem for saves (that's what scan_games does).
#[tauri::command]
pub async fn get_games(app: tauri::AppHandle) -> Result<Vec<FrontendGame>, String> {
    tokio::task::spawn_blocking(move || {
        let api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

        let backups_output = api
            .list_backups(parameters::ListBackups { games: vec![] })
            .map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

        let app_data_dir = app.path().app_data_dir().ok();
        let mut cache = SCAN_CACHE.lock().unwrap();
        if cache.is_empty() {
            if let Some(ref dir) = app_data_dir {
                *cache = load_scan_cache(dir);
            }
        }

        // Collect all known game names from backups + scan cache
        let mut all_names: std::collections::BTreeSet<String> = std::collections::BTreeSet::new();
        for name in backups_output.games.keys() {
            all_names.insert(name.clone());
        }
        for name in cache.keys() {
            all_names.insert(name.clone());
        }

        let mut frontend_games = Vec::new();
        let mut games_to_download = Vec::new();

        for name in &all_names {
            let backup_game = backups_output.games.get(name);
            let cached_scan = cache.get(name);
            let fg = build_frontend_game(
                app_data_dir.as_deref(),
                &api,
                name,
                None, // no live scan data
                backup_game,
                cached_scan,
            );

            if fg.cover == "/placeholder.svg" {
                let mut steam_id = None;
                if let Some(game_meta) = api.manifest.0.get(name) {
                    if let Some(sid) = game_meta.steam.id {
                        steam_id = Some(sid);
                    }
                }
                games_to_download.push((fg.id.clone(), name.clone(), steam_id));
            }

            frontend_games.push(fg);
        }

        if !games_to_download.is_empty() {
            start_cover_downloads(&app, games_to_download);
        }

        Ok(frontend_games)
    })
    .await
    .map_err(|e| e.to_string())?
}

/// Full filesystem scan: scans all save paths from the manifest.
/// Caches scan results and returns the merged game list.
/// This is the slow operation - only call on user demand.
#[tauri::command]
pub async fn scan_games(app: tauri::AppHandle) -> Result<Vec<FrontendGame>, String> {
    tokio::task::spawn_blocking(move || {
        let mut api =
            Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

        // Full preview backup scan (reads all save paths on disk)
        let scan_output = api
            .back_up(parameters::BackUp {
                games: vec![],
                finality: Finality::Preview,
                resolve_cloud_conflict: None,
                wine_prefix: None,
                include_disabled: true,
                skip_downgrade: false,
            })
            .map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

        // Also get backup info
        let backups_output = api
            .list_backups(parameters::ListBackups { games: vec![] })
            .map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

        let app_data_dir = app.path().app_data_dir().ok();

        // Update the scan cache with live data
        {
            let mut cache = SCAN_CACHE.lock().unwrap();
            cache.clear();
            for (name, game_data) in &scan_output.games {
                if let ApiGame::Operative {
                    change, files, ..
                } = game_data
                {
                    let first_path = files.keys().next().cloned().unwrap_or_default();
                    let total_bytes: u64 = files.values().map(|f| f.bytes).sum();
                    cache.insert(
                        name.clone(),
                        CachedScanInfo {
                            save_path: first_path,
                            size_bytes: total_bytes,
                            has_changes: change.is_changed(),
                            install_dir: None,
                        },
                    );
                }
            }
            if let Some(ref dir) = app_data_dir {
                save_scan_cache(dir, &cache);
            }
        }

        // Build combined results
        let mut all_names: std::collections::BTreeSet<String> = std::collections::BTreeSet::new();
        for name in scan_output.games.keys() {
            all_names.insert(name.clone());
        }
        for name in backups_output.games.keys() {
            all_names.insert(name.clone());
        }

        let cache = SCAN_CACHE.lock().unwrap();
        let mut frontend_games = Vec::new();
        let mut games_to_download = Vec::new();

        for name in &all_names {
            let scan_game = scan_output.games.get(name);
            let backup_game = backups_output.games.get(name);
            let cached_scan = cache.get(name);
            let fg = build_frontend_game(
                app_data_dir.as_deref(),
                &api,
                name,
                scan_game,
                backup_game,
                cached_scan,
            );

            if fg.cover == "/placeholder.svg" {
                let mut steam_id = None;
                if let Some(game_meta) = api.manifest.0.get(name) {
                    if let Some(sid) = game_meta.steam.id {
                        steam_id = Some(sid);
                    }
                }
                games_to_download.push((fg.id.clone(), name.clone(), steam_id));
            }

            frontend_games.push(fg);
        }

        if !games_to_download.is_empty() {
            start_cover_downloads(&app, games_to_download);
        }

        // Reload the file watcher after a full scan so it picks up new/changed save paths
        crate::watcher::start_file_watcher(&app);

        Ok(frontend_games)
    })
    .await
    .map_err(|e| e.to_string())?
}

/// Fetch detailed info for a single game. Runs a targeted scan (very fast).
#[tauri::command]
pub async fn get_game_details(app: tauri::AppHandle, game_title: String) -> Result<Option<FrontendGame>, String> {
    tokio::task::spawn_blocking(move || {
        let mut api =
            Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

        // Scan only this specific game (fast, ~100ms)
        let scan_output = api
            .back_up(parameters::BackUp {
                games: vec![game_title.clone()],
                finality: Finality::Preview,
                resolve_cloud_conflict: None,
                wine_prefix: None,
                include_disabled: true,
                skip_downgrade: false,
            })
            .ok();

        let backups_output = api
            .list_backups(parameters::ListBackups {
                games: vec![game_title],
            })
            .ok();

        // Find the resolved game name from either output
        let name = scan_output
            .as_ref()
            .and_then(|o| o.games.keys().next())
            .or_else(|| backups_output.as_ref().and_then(|o| o.games.keys().next()));

        let Some(name) = name else {
            return Ok(None);
        };

        let name = name.clone();
        let scan_game = scan_output.as_ref().and_then(|o| o.games.get(&name));
        let backup_game = backups_output.as_ref().and_then(|o| o.games.get(&name));

        let app_data_dir = app.path().app_data_dir().ok();

        let fg = build_frontend_game(
            app_data_dir.as_deref(),
            &api,
            &name,
            scan_game,
            backup_game,
            None,
        );

        if fg.cover == "/placeholder.svg" {
            let mut steam_id = None;
            if let Some(game_meta) = api.manifest.0.get(&name) {
                if let Some(sid) = game_meta.steam.id {
                    steam_id = Some(sid);
                }
            }
            start_cover_downloads(&app, vec![(fg.id.clone(), name.clone(), steam_id)]);
        }

        Ok(Some(fg))
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn backup_game(game_title: String) -> Result<String, String> {
    tokio::task::spawn_blocking(move || {
        let mut api =
            Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

        let result = api
            .back_up(parameters::BackUp {
                games: vec![game_title],
                finality: Finality::Final,
                resolve_cloud_conflict: Some(SyncDirection::Upload),
                wine_prefix: None,
                include_disabled: true,
                skip_downgrade: false,
            })
            .map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

        Ok(serde_json::to_string(&result).unwrap_or_default())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn restore_game(game_title: String, backup_id: Option<String>) -> Result<String, String> {
    tokio::task::spawn_blocking(move || {
        let mut api =
            Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

        let result = api
            .restore(parameters::Restore {
                games: vec![game_title],
                finality: Finality::Final,
                backup: backup_id,
                resolve_cloud_conflict: Some(SyncDirection::Download),
                include_disabled: true,
                skip_downgrade: false,
            })
            .map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

        Ok(serde_json::to_string(&result).unwrap_or_default())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn toggle_backup_locked(
    game_title: String,
    backup_id: String,
    locked: bool,
) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        let mut api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;
        api.set_backup_locked(&game_title, &backup_id, locked)
            .map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;
        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

pub fn load_system_tray_setting(app_data_dir: &Path) -> bool {
    let config_path = app_data_dir.join("ludocard.json");
    if let Ok(content) = std::fs::read_to_string(&config_path) {
        if let Ok(json) = serde_json::from_str::<serde_json::Value>(&content) {
            return json.get("system_tray")
                .and_then(|v| v.as_bool())
                .unwrap_or(true);
        }
    }
    true
}

pub fn save_system_tray_setting(app_data_dir: &Path, enabled: bool) {
    let config_path = app_data_dir.join("ludocard.json");
    let mut json: serde_json::Value = if let Ok(content) = std::fs::read_to_string(&config_path) {
        serde_json::from_str(&content).unwrap_or(serde_json::json!({}))
    } else {
        serde_json::json!({})
    };
    json["system_tray"] = serde_json::json!(enabled);
    let _ = std::fs::create_dir_all(app_data_dir);
    let _ = std::fs::write(&config_path, serde_json::to_string_pretty(&json).unwrap_or_default());
}

const DEFAULT_SUPABASE_URL: &str = "https://iwqqbssramgfkyhltblx.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY: &str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3cXFic3NyYW1nZmt5aGx0Ymx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1MDcxMjYsImV4cCI6MjA5ODA4MzEyNn0.Nw8rarl_2LVpw4O4gADA0zaM3-6MIlEv7z_U-gunUxc";

pub fn load_supabase_settings(app_data_dir: &Path) -> (String, String) {
    let config_path = app_data_dir.join("ludocard.json");
    if let Ok(content) = std::fs::read_to_string(&config_path) {
        if let Ok(json) = serde_json::from_str::<serde_json::Value>(&content) {
            let url = json.get("supabase_url")
                .and_then(|v| v.as_str())
                .filter(|s| !s.is_empty())
                .unwrap_or(DEFAULT_SUPABASE_URL)
                .to_string();
            let key = json.get("supabase_anon_key")
                .and_then(|v| v.as_str())
                .filter(|s| !s.is_empty())
                .unwrap_or(DEFAULT_SUPABASE_ANON_KEY)
                .to_string();
            return (url, key);
        }
    }
    (DEFAULT_SUPABASE_URL.to_string(), DEFAULT_SUPABASE_ANON_KEY.to_string())
}

pub fn save_supabase_settings(app_data_dir: &Path, url: &str, key: &str) {
    let config_path = app_data_dir.join("ludocard.json");
    let mut json: serde_json::Value = if let Ok(content) = std::fs::read_to_string(&config_path) {
        serde_json::from_str(&content).unwrap_or(serde_json::json!({}))
    } else {
        serde_json::json!({})
    };
    json["supabase_url"] = serde_json::json!(url);
    json["supabase_anon_key"] = serde_json::json!(key);
    let _ = std::fs::create_dir_all(app_data_dir);
    let _ = std::fs::write(&config_path, serde_json::to_string_pretty(&json).unwrap_or_default());
}


#[cfg(target_os = "windows")]
pub fn is_autostart_enabled() -> bool {
    use winreg::enums::HKEY_CURRENT_USER;
    use winreg::RegKey;
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    if let Ok(run_key) = hkcu.open_subkey("Software\\Microsoft\\Windows\\CurrentVersion\\Run") {
        if let Ok(val) = run_key.get_value::<String, _>("Ludocard") {
            if let Ok(exe) = std::env::current_exe() {
                let exe_str = exe.to_string_lossy();
                return val.contains(&*exe_str);
            }
        }
    }
    false
}

#[cfg(not(target_os = "windows"))]
pub fn is_autostart_enabled() -> bool {
    false
}

#[cfg(target_os = "windows")]
pub fn set_autostart(enabled: bool) -> Result<(), String> {
    use winreg::enums::{HKEY_CURRENT_USER, KEY_WRITE, KEY_READ};
    use winreg::RegKey;
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let run_key = hkcu.open_subkey_with_flags("Software\\Microsoft\\Windows\\CurrentVersion\\Run", KEY_WRITE | KEY_READ)
        .map_err(|e| format!("Failed to open Run registry key: {}", e))?;

    if enabled {
        let exe = std::env::current_exe()
            .map_err(|e| format!("Failed to get current executable path: {}", e))?;
        let exe_str = exe.to_string_lossy();
        let value = format!("\"{}\" --minimized", exe_str);
        run_key.set_value("Ludocard", &value)
            .map_err(|e| format!("Failed to set Registry value: {}", e))?;
    } else {
        if run_key.get_value::<String, _>("Ludocard").is_ok() {
            run_key.delete_value("Ludocard")
                .map_err(|e| format!("Failed to delete Registry value: {}", e))?;
        }
    }
    Ok(())
}

#[cfg(not(target_os = "windows"))]
pub fn set_autostart(_enabled: bool) -> Result<(), String> {
    Ok(())
}

#[tauri::command]
pub async fn get_settings(app: tauri::AppHandle) -> Result<FrontendSettings, String> {
    tokio::task::spawn_blocking(move || {
        let api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;
 
        let file_watcher = app.path().app_data_dir()
            .map(|dir| crate::watcher::load_file_watcher_setting(&dir))
            .unwrap_or(false);
 
        let system_tray = app.path().app_data_dir()
            .map(|dir| load_system_tray_setting(&dir))
            .unwrap_or(true);
 
        let (supabase_url, supabase_anon_key) = match app.path().app_data_dir() {
            Ok(dir) => {
                let res = load_supabase_settings(&dir);
                println!("DEBUG: Supabase loaded from AppData ({}): URL = '{}', KEY = '{}'", dir.display(), res.0, res.1);
                res
            }
            Err(e) => {
                println!("DEBUG: Failed to get AppData dir: {:?}", e);
                ("".to_string(), "".to_string())
            }
        };

        let start_with_windows = is_autostart_enabled();
        let portable = ludusavi::prelude::is_portable();
 
        Ok(FrontendSettings {
            backup_path: api.config.backup.path.raw().to_string(),
            rclone_path: api.config.apps.rclone.path.raw().to_string(),
            cloud_path: api.config.cloud.path.clone(),
            cloud_sync: api.config.cloud.synchronize,
            rclone_arguments: api.config.apps.rclone.arguments.clone(),
            file_watcher,
            system_tray,
            start_with_windows,
            portable,
            supabase_url,
            supabase_anon_key,
        })
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn save_settings(app: tauri::AppHandle, settings: FrontendSettings) -> Result<(), String> {
    let file_watcher_enabled = settings.file_watcher;
    let system_tray_enabled = settings.system_tray;
    let start_with_windows_enabled = settings.start_with_windows;
    let app_clone = app.clone();

    tokio::task::spawn_blocking(move || {
        let mut api =
            Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

        api.config.backup.path = StrictPath::new(settings.backup_path);
        api.config.apps.rclone.path = StrictPath::new(settings.rclone_path);
        api.config.cloud.path = settings.cloud_path;
        api.config.cloud.synchronize = settings.cloud_sync;
        api.config.apps.rclone.arguments = settings.rclone_arguments;

        api.config.save();

        // Save settings to ludocard.json
        if let Ok(dir) = app_clone.path().app_data_dir() {
            crate::watcher::save_file_watcher_setting(&dir, file_watcher_enabled);
            save_system_tray_setting(&dir, system_tray_enabled);
            save_supabase_settings(&dir, &settings.supabase_url, &settings.supabase_anon_key);
        }

        // Configure autostart
        let _ = set_autostart(start_with_windows_enabled);

        // Start or stop the file watcher based on the new setting
        if file_watcher_enabled {
            crate::watcher::start_file_watcher(&app_clone);
        } else {
            crate::watcher::stop_file_watcher();
        }

        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn get_roots() -> Result<Vec<FrontendRoot>, String> {
    tokio::task::spawn_blocking(|| {
        let mut api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;
        
        // Autodetect roots if the list is empty
        if api.config.roots.is_empty() {
            let detected = autodetect_launchers();
            if !detected.is_empty() {
                for (path, store) in detected {
                    api.config.roots.push(Root::new(path, store));
                }
                let _ = api.config.save();
            }
        }

        let mut roots = Vec::new();
        for (i, r) in api.config.roots.iter().enumerate() {
            roots.push(FrontendRoot {
                id: format!("r{}", i),
                path: r.path().raw().to_string(),
                store: format!("{:?}", r.store()),
            });
        }
        Ok(roots)
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn open_game_folder(
    game_title: String,
    folder_type: String,
    save_path: String,
) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        let api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;
        
        let path_to_open = match folder_type.as_str() {
            "save" => {
                if save_path.is_empty() {
                    return Err("Nenhum caminho de save disponível para abrir.".to_string());
                }
                let path = PathBuf::from(save_path);
                if path.is_file() || (path.extension().is_some() && path.parent().is_some()) {
                    path.parent().map(|p| p.to_path_buf()).unwrap_or(path)
                } else {
                    path
                }
            }
            "backup" => {
                let backup_base = api.config.backup.path.raw();
                if backup_base.is_empty() {
                    return Err("Diretório de backup não configurado.".to_string());
                }
                // Ludosavi stores game backups directly in {backup_base}/{sanitized_game_title}
                let game_backup_path = Path::new(&backup_base).join(sanitize_game_title(&game_title));
                game_backup_path
            }
            "game" => {
                let mut resolved_path = None;
                
                // Heuristic A: check configured roots
                let game_meta = api.manifest.0.get(&game_title);
                let mut candidate_dirs: Vec<String> = if let Some(meta) = game_meta {
                    meta.install_dir.keys().cloned().collect()
                } else {
                    Vec::new()
                };
                candidate_dirs.push(game_title.clone());

                for root in &api.config.roots {
                    let games_path = root.games_path();
                    let games_path_str = games_path.render();
                    let games_dir = Path::new(&games_path_str);
                    
                    if let Some(p) = find_game_install_dir(games_dir, &game_title, &candidate_dirs) {
                        resolved_path = Some(p);
                        break;
                    }
                }
                
                // Heuristic B: Check Steam Registry (Windows only)
                if resolved_path.is_none() {
                    #[cfg(target_os = "windows")]
                    {
                        use winreg::enums::*;
                        use winreg::RegKey;
                        let hkcu = RegKey::predef(HKEY_CURRENT_USER);
                        if let Ok(steam_key) = hkcu.open_subkey("Software\\Valve\\Steam") {
                            if let Ok(steam_path) = steam_key.get_value::<String, _>("SteamPath") {
                                let steam_common = Path::new(&steam_path).join("steamapps").join("common");
                                if let Some(p) = find_game_install_dir(&steam_common, &game_title, &candidate_dirs) {
                                    resolved_path = Some(p);
                                }
                            }
                        }
                    }
                }
                
                match resolved_path {
                    Some(p) => p,
                    None => return Err(format!("Não foi possível localizar a pasta de instalação para: {}.", game_title)),
                }
            }
            _ => return Err("Tipo de pasta inválido.".to_string()),
        };
        
        if !path_to_open.exists() {
            return Err(format!("O diretório especificado não existe ou ainda não foi criado: {:?}", path_to_open));
        }
        
        opener::open(&path_to_open).map_err(|e| e.to_string())?;
        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

fn autodetect_launchers() -> Vec<(StrictPath, Store)> {
    let mut detected = Vec::new();

    #[cfg(target_os = "windows")]
    {
        use winreg::enums::*;
        use winreg::RegKey;

        // 1. Steam
        let hkcu = RegKey::predef(HKEY_CURRENT_USER);
        if let Ok(steam_key) = hkcu.open_subkey("Software\\Valve\\Steam") {
            if let Ok(steam_path) = steam_key.get_value::<String, _>("SteamPath") {
                let path = Path::new(&steam_path).join("steamapps").join("common");
                if path.exists() {
                    detected.push((StrictPath::new(path.to_string_lossy().to_string()), Store::Steam));
                }
            }
        }

        // 2. GOG Galaxy
        let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
        if let Ok(gog_key) = hklm.open_subkey("SOFTWARE\\WOW6432Node\\GOG.com\\GalaxyClient\\paths") {
            if let Ok(gog_path) = gog_key.get_value::<String, _>("client") {
                let path = Path::new(&gog_path);
                if path.exists() {
                    detected.push((StrictPath::new(path.to_string_lossy().to_string()), Store::Gog));
                }
            }
        }

        for path in &["C:\\Program Files (x86)\\GOG Galaxy\\Games", "C:\\GOG Games"] {
            let p = Path::new(path);
            if p.exists() {
                detected.push((StrictPath::new(p.to_string_lossy().to_string()), Store::Gog));
            }
        }

        // 3. Epic Games
        for path in &["C:\\Program Files\\Epic Games", "C:\\Program Files (x86)\\Epic Games"] {
            let p = Path::new(path);
            if p.exists() {
                detected.push((StrictPath::new(p.to_string_lossy().to_string()), Store::Epic));
            }
        }
    }

    detected
}

#[tauri::command]
pub async fn add_root(path: String) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        let mut api =
            Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;
        let strict_path = StrictPath::new(path);
        let new_root = Root::new(strict_path, Store::Other);
        api.config.roots.push(new_root);
        api.config.save();
        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn remove_root(path: String) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        let mut api =
            Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;
        api.config.roots.retain(|r| r.path().raw() != path);
        api.config.save();
        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

/// Opens the native OS folder picker dialog.
/// Uses a dedicated OS thread (not the Tokio runtime) to ensure proper
/// COM STA (Single Threaded Apartment) threading on Windows.
#[tauri::command]
pub async fn select_folder() -> Result<Option<String>, String> {
    let handle = std::thread::spawn(|| rfd::FileDialog::new().pick_folder());
    let result = handle
        .join()
        .map_err(|_| "Falha ao abrir o seletor de pastas".to_string())?;
    Ok(result.map(|f| f.to_string_lossy().to_string()))
}

#[tauri::command]
pub async fn toggle_portable_mode(app: tauri::AppHandle, enable: bool) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        let exe_path = std::env::current_exe().map_err(|e| format!("Failed to get current executable path: {}", e))?;
        let exe_dir = exe_path.parent().ok_or("Failed to get executable directory")?;
        
        let flag_path = exe_dir.join("ludocard.portable");
        
        if enable {
            // 1. Verify write permission in the executable folder.
            let test_file = exe_dir.join(".ludocard_write_test");
            if std::fs::write(&test_file, "").is_err() {
                return Err("Não foi possível escrever na pasta do executável. Verifique as permissões de gravação ou execute como Administrador.".to_string());
            }
            let _ = std::fs::remove_file(test_file);
            
            // 2. Create the flag file
            std::fs::write(&flag_path, "").map_err(|e| format!("Falha ao criar o arquivo flag de portabilidade: {}", e))?;
            
            // 3. Migrate settings: copy config files from standard appDataDir to portable folder (exe_dir)
            let standard_app_dir = app.path().app_data_dir()
                .map_err(|e| format!("Failed to locate app data dir: {}", e))?;
            
            let files_to_migrate = vec!["config.yaml", "manifest.yaml", "cache.yaml", "ludocard.json"];
            for file_name in files_to_migrate {
                let src = standard_app_dir.join(file_name);
                if src.exists() {
                    let dest = exe_dir.join(file_name);
                    let _ = std::fs::copy(&src, &dest);
                }
            }
        } else {
            // Disable portable mode
            if flag_path.exists() {
                std::fs::remove_file(&flag_path).map_err(|e| format!("Falha ao remover o arquivo flag de portabilidade: {}", e))?;
            }
            
            // Move config files back from exe dir to standard appDataDir
            let standard_app_dir = app.path().app_data_dir()
                .map_err(|e| format!("Failed to locate app data dir: {}", e))?;
                
            // Ensure appDataDir exists
            std::fs::create_dir_all(&standard_app_dir)
                .map_err(|e| format!("Falha ao criar diretório padrão AppData: {}", e))?;
            
            let files_to_migrate = vec!["config.yaml", "manifest.yaml", "cache.yaml", "ludocard.json"];
            for file_name in files_to_migrate {
                let src = exe_dir.join(file_name);
                if src.exists() {
                    let dest = standard_app_dir.join(file_name);
                    if std::fs::copy(&src, &dest).is_ok() {
                        let _ = std::fs::remove_file(src);
                    }
                }
            }
        }
        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

// =============================================================================
// Share Save & Community Checkpoints Commands
// =============================================================================

/// Returns the anonymous client UUID for this installation.
/// Used by the frontend for community repository quota enforcement.
#[tauri::command]
pub async fn get_client_uuid(app: tauri::AppHandle) -> Result<String, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;
    Ok(get_or_create_client_uuid(&app_data_dir))
}

/// Opens a native file picker dialog scoped to a game's save directory.
/// Allows the user to select a specific save file (not the whole folder).
#[tauri::command]
pub async fn select_save_file(start_dir: Option<String>) -> Result<Option<String>, String> {
    let handle = std::thread::spawn(move || {
        let mut builder = rfd::FileDialog::new()
            .set_title("Selecione o arquivo de Save");
        if let Some(ref dir) = start_dir {
            let path = Path::new(dir);
            if path.is_dir() {
                builder = builder.set_directory(dir);
            } else if let Some(parent) = path.parent() {
                if parent.is_dir() {
                    builder = builder.set_directory(parent);
                }
            }
        }
        builder.pick_file()
    });
    let result = handle
        .join()
        .map_err(|_| "Falha ao abrir o seletor de arquivos".to_string())?;
    Ok(result.map(|f| f.to_string_lossy().to_string()))
}

/// Exports a game save as a compressed `.ludocard` archive.
/// The archive is a tar file compressed with zstd, containing:
/// - `metadata.json`: Archive metadata (game info, notes, sizes)
/// - The original save file(s)
#[tauri::command]
pub async fn export_ludocard_save(
    app: tauri::AppHandle,
    game_title: String,
    game_id: String,
    checkpoint_title: String,
    description: String,
    source_path: String,
    dest_path: String,
) -> Result<LudocardMetadata, String> {
    tokio::task::spawn_blocking(move || {
        let source = Path::new(&source_path);
        if !source.exists() {
            return Err(format!(
                "O arquivo de save não foi encontrado: {}",
                source_path
            ));
        }

        // Collect files to archive: if source is a file, just that file.
        // If source is a directory, collect all files in it (shallow, max 2 levels).
        let mut files_to_archive: Vec<PathBuf> = Vec::new();
        let base_dir: &Path;

        if source.is_file() {
            files_to_archive.push(source.to_path_buf());
            base_dir = source.parent().unwrap_or(source);
        } else if source.is_dir() {
            for entry in WalkDir::new(source)
                .max_depth(2)
                .into_iter()
                .filter_map(|e| e.ok())
            {
                if entry.file_type().is_file() {
                    files_to_archive.push(entry.path().to_path_buf());
                }
            }
            base_dir = source;
        } else {
            return Err("O caminho selecionado não é um arquivo ou pasta válida.".to_string());
        }

        if files_to_archive.is_empty() {
            return Err("Nenhum arquivo encontrado para exportar.".to_string());
        }

        // Calculate total uncompressed size
        let total_size: u64 = files_to_archive
            .iter()
            .filter_map(|f| std::fs::metadata(f).ok())
            .map(|m| m.len())
            .sum();

        // Build file name list (relative paths)
        let original_files: Vec<String> = files_to_archive
            .iter()
            .filter_map(|f| {
                f.strip_prefix(base_dir)
                    .ok()
                    .map(|rel| rel.to_string_lossy().to_string())
            })
            .collect();

        // Get client UUID
        let client_uuid = app
            .path()
            .app_data_dir()
            .map(|dir| get_or_create_client_uuid(&dir))
            .unwrap_or_else(|_| "unknown".to_string());

        let now = chrono::Local::now();

        // Create the tar + zstd archive
        let dest_file = std::fs::File::create(&dest_path)
            .map_err(|e| format!("Falha ao criar o arquivo de destino: {}", e))?;

        let zstd_encoder = zstd::Encoder::new(dest_file, 19) // Level 19 = high compression
            .map_err(|e| format!("Falha ao iniciar compressão zstd: {}", e))?;

        let mut tar_builder = tar::Builder::new(zstd_encoder);

        // Add each save file to the tar archive under "saves/" prefix
        for file_path in &files_to_archive {
            let relative = file_path
                .strip_prefix(base_dir)
                .unwrap_or(file_path);
            let archive_name = Path::new("saves").join(relative);

            tar_builder
                .append_path_with_name(file_path, &archive_name)
                .map_err(|e| format!("Falha ao adicionar arquivo ao pacote: {}", e))?;
        }

        // Build metadata (compressed_size will be updated after finishing)
        let metadata = LudocardMetadata {
            game_title: game_title.clone(),
            game_id: game_id.clone(),
            checkpoint_title: checkpoint_title.clone(),
            description: description.clone(),
            original_files: original_files.clone(),
            created_at: now.to_rfc3339(),
            total_size_bytes: total_size,
            compressed_size_bytes: 0, // Will be set after archive is closed
            client_uuid: client_uuid.clone(),
        };

        // Serialize metadata and add to tar
        let metadata_json = serde_json::to_string_pretty(&metadata)
            .map_err(|e| format!("Falha ao serializar metadados: {}", e))?;

        let metadata_bytes = metadata_json.as_bytes();
        let mut header = tar::Header::new_gnu();
        header.set_size(metadata_bytes.len() as u64);
        header.set_mode(0o644);
        header.set_cksum();

        tar_builder
            .append_data(&mut header, "metadata.json", metadata_bytes)
            .map_err(|e| format!("Falha ao adicionar metadados ao pacote: {}", e))?;

        // Finish the tar archive, then finish the zstd encoder
        let zstd_encoder = tar_builder
            .into_inner()
            .map_err(|e| format!("Falha ao finalizar o arquivo tar: {}", e))?;

        zstd_encoder
            .finish()
            .map_err(|e| format!("Falha ao finalizar a compressão: {}", e))?;

        // Read the actual compressed file size
        let compressed_size = std::fs::metadata(&dest_path)
            .map(|m| m.len())
            .unwrap_or(0);

        Ok(LudocardMetadata {
            compressed_size_bytes: compressed_size,
            ..metadata
        })
    })
    .await
    .map_err(|e| e.to_string())?
}

/// Reads metadata from a `.ludocard` archive without extracting files.
/// Used to preview checkpoint details before importing.
#[tauri::command]
pub async fn read_ludocard_metadata(
    archive_path: String,
) -> Result<LudocardMetadata, String> {
    tokio::task::spawn_blocking(move || {
        let file = std::fs::File::open(&archive_path)
            .map_err(|e| format!("Falha ao abrir o arquivo: {}", e))?;

        let decoder = zstd::Decoder::new(file)
            .map_err(|e| format!("Falha ao decodificar o arquivo (não é um .ludocard válido?): {}", e))?;

        let mut archive = tar::Archive::new(decoder);

        for entry in archive
            .entries()
            .map_err(|e| format!("Falha ao ler entradas do arquivo: {}", e))?
        {
            let mut entry =
                entry.map_err(|e| format!("Falha ao ler entrada: {}", e))?;

            let path = entry
                .path()
                .map_err(|e| format!("Falha ao ler caminho da entrada: {}", e))?;

            if path.to_string_lossy() == "metadata.json" {
                let mut content = String::new();
                entry
                    .read_to_string(&mut content)
                    .map_err(|e| format!("Falha ao ler metadata.json: {}", e))?;

                let mut metadata: LudocardMetadata = serde_json::from_str(&content)
                    .map_err(|e| format!("Falha ao interpretar metadata.json: {}", e))?;

                // Update compressed size from the actual file
                if let Ok(file_meta) = std::fs::metadata(&archive_path) {
                    metadata.compressed_size_bytes = file_meta.len();
                }

                return Ok(metadata);
            }
        }

        Err("O arquivo .ludocard não contém metadata.json — pode estar corrompido.".to_string())
    })
    .await
    .map_err(|e| e.to_string())?
}

/// Imports a `.ludocard` archive, extracting save files into the target directory.
/// Before extracting, it creates a safety backup of the current save (Seguro-Crash).
/// All paths are validated to prevent path traversal attacks.
fn import_ludocard_save_internal(
    archive_path: &Path,
    target_dir: &Path,
) -> Result<LudocardMetadata, String> {
    // Step 1: Read metadata first
    let file = std::fs::File::open(archive_path)
        .map_err(|e| format!("Falha ao abrir o arquivo: {}", e))?;

    let decoder = zstd::Decoder::new(file)
        .map_err(|e| format!("Arquivo .ludocard inválido: {}", e))?;

    let mut archive = tar::Archive::new(decoder);
    let mut metadata: Option<LudocardMetadata> = None;

    // First pass: find and read metadata
    for entry in archive
        .entries()
        .map_err(|e| format!("Falha ao ler entradas: {}", e))?
    {
        let mut entry = entry.map_err(|e| format!("Falha ao ler entrada: {}", e))?;
        let path = entry
            .path()
            .map_err(|e| format!("Falha ao ler caminho: {}", e))?;

        if path.to_string_lossy() == "metadata.json" {
            let mut content = String::new();
            entry
                .read_to_string(&mut content)
                .map_err(|e| format!("Falha ao ler metadata.json: {}", e))?;

            metadata = Some(
                serde_json::from_str(&content)
                    .map_err(|e| format!("metadata.json corrompido: {}", e))?,
            );
            break;
        }
    }

    let metadata =
        metadata.ok_or("O arquivo .ludocard não contém metadata.json.".to_string())?;

    // Step 2: Create a safety backup of the current save directory (Seguro-Crash)
    if target_dir.exists() && target_dir.is_dir() {
        let backup_name = format!(
            "{}_seguro_crash_{}.tar.zst",
            metadata.game_id,
            chrono::Local::now().format("%Y%m%d_%H%M%S")
        );
        let backup_path = target_dir
            .parent()
            .unwrap_or(target_dir)
            .join(&backup_name);

        // Create safety backup of existing saves
        if let Ok(backup_file) = std::fs::File::create(&backup_path) {
            if let Ok(encoder) = zstd::Encoder::new(backup_file, 3) {
                // Fast compression for safety backup
                let mut tar_builder = tar::Builder::new(encoder);
                let _ = tar_builder.append_dir_all(".", target_dir);
                if let Ok(encoder) = tar_builder.into_inner() {
                    let _ = encoder.finish();
                }
            }
        }
    }

    // Step 3: Re-open and extract save files with path traversal protection
    let file = std::fs::File::open(archive_path)
        .map_err(|e| format!("Falha ao reabrir o arquivo: {}", e))?;

    let decoder = zstd::Decoder::new(file)
        .map_err(|e| format!("Falha ao decodificar: {}", e))?;

    let mut archive = tar::Archive::new(decoder);

    // Ensure target directory exists
    std::fs::create_dir_all(target_dir)
        .map_err(|e| format!("Falha ao criar diretório de destino: {}", e))?;

    let canonical_target = target_dir
        .canonicalize()
        .map_err(|e| format!("Falha ao resolver caminho de destino: {}", e))?;

    for entry in archive
        .entries()
        .map_err(|e| format!("Falha ao ler entradas: {}", e))?
    {
        let mut entry = entry.map_err(|e| format!("Falha ao ler entrada: {}", e))?;
        let path = entry
            .path()
            .map_err(|e| format!("Falha ao ler caminho: {}", e))?;

        let path_str = path.to_string_lossy();

        // Skip metadata.json — we already read it
        if path_str == "metadata.json" {
            continue;
        }

        // Only extract files from the "saves/" prefix
        let relative = if let Ok(stripped) = path.strip_prefix("saves") {
            stripped.to_path_buf()
        } else {
            // Skip any entry not under "saves/"
            continue;
        };

        // PATH TRAVERSAL PROTECTION: reject any path with ".." components
        if relative
            .components()
            .any(|c| matches!(c, std::path::Component::ParentDir))
        {
            return Err(format!(
                "🚨 Arquivo bloqueado por segurança (path traversal detectado): {}",
                path_str
            ));
        }

        let dest_path = canonical_target.join(&relative);

        // Double-check: resolved path must still be under the target directory
        if let Some(parent) = dest_path.parent() {
            std::fs::create_dir_all(parent)
                .map_err(|e| format!("Falha ao criar subdiretório: {}", e))?;
        }

        // Verify the destination is inside the target
        let canonical_dest = dest_path
            .parent()
            .and_then(|p| p.canonicalize().ok())
            .unwrap_or_else(|| canonical_target.clone());

        if !canonical_dest.starts_with(&canonical_target) {
            return Err(format!(
                "🚨 Caminho de destino fora da pasta permitida: {}",
                dest_path.display()
            ));
        }

        // Extract the file
        let mut output_file = std::fs::File::create(&dest_path)
            .map_err(|e| format!("Falha ao criar arquivo extraído: {}", e))?;

        std::io::copy(&mut entry, &mut output_file)
            .map_err(|e| format!("Falha ao extrair arquivo: {}", e))?;
    }

    Ok(metadata)
}

/// Imports a `.ludocard` archive, extracting save files into the target directory.
/// Before extracting, it creates a safety backup of the current save (Seguro-Crash).
/// All paths are validated to prevent path traversal attacks.
#[tauri::command]
pub async fn import_ludocard_save(
    archive_path: String,
    target_save_dir: String,
) -> Result<LudocardMetadata, String> {
    tokio::task::spawn_blocking(move || {
        let archive = Path::new(&archive_path);
        let target = Path::new(&target_save_dir);
        import_ludocard_save_internal(archive, target)
    })
    .await
    .map_err(|e| e.to_string())?
}

/// Downloads a `.ludocard` file from a URL and imports it.
/// Uses the same security rules and automated Seguro-Crash safety backup.
#[tauri::command]
pub async fn download_and_import_ludocard(
    download_url: String,
    target_save_dir: String,
) -> Result<LudocardMetadata, String> {
    tokio::task::spawn_blocking(move || {
        let client = reqwest::blocking::Client::builder()
            .timeout(std::time::Duration::from_secs(120))
            .build()
            .unwrap_or_default();

        let response = client.get(&download_url)
            .send()
            .map_err(|e| format!("Falha ao iniciar o download do save: {}", e))?;

        if !response.status().is_success() {
            return Err(format!(
                "Download falhou. O servidor respondeu com status: {}",
                response.status()
            ));
        }

        let bytes = response
            .bytes()
            .map_err(|e| format!("Falha ao ler dados de download: {}", e))?;

        // Create a temporary file path
        let temp_dir = std::env::temp_dir();
        let temp_file_path = temp_dir.join(format!(
            "ludocard_download_{}.ludocard",
            uuid::Uuid::new_v4()
        ));

        std::fs::write(&temp_file_path, &bytes)
            .map_err(|e| format!("Falha ao gravar arquivo de download temporário: {}", e))?;

        // Run the import logic
        let target = Path::new(&target_save_dir);
        let result = import_ludocard_save_internal(&temp_file_path, target);

        // Always clean up temp file
        let _ = std::fs::remove_file(&temp_file_path);

        result
    })
    .await
    .map_err(|e| e.to_string())?
}

/// Opens a native "Save As" dialog for .ludocard files.
/// Returns the chosen path or None if cancelled.
#[tauri::command]
pub async fn save_ludocard_dialog(default_name: String) -> Result<Option<String>, String> {
    let handle = std::thread::spawn(move || {
        rfd::FileDialog::new()
            .set_title("Salvar arquivo .ludocard")
            .set_file_name(&default_name)
            .add_filter("Ludocard Save", &["ludocard"])
            .save_file()
    });
    let result = handle
        .join()
        .map_err(|_| "Falha ao abrir o diálogo de salvar".to_string())?;
    Ok(result.map(|f| f.to_string_lossy().to_string()))
}

/// Opens a native file picker dialog filtered for .ludocard files.
/// Returns the chosen path or None if cancelled.
#[tauri::command]
pub async fn open_ludocard_dialog() -> Result<Option<String>, String> {
    let handle = std::thread::spawn(move || {
        rfd::FileDialog::new()
            .set_title("Abrir arquivo .ludocard")
            .add_filter("Ludocard Save", &["ludocard"])
            .pick_file()
    });
    let result = handle
        .join()
        .map_err(|_| "Falha ao abrir o seletor de arquivos".to_string())?;
    Ok(result.map(|f| f.to_string_lossy().to_string()))
}

/// Uploads a local file directly to a presigned URL using reqwest (HTTP PUT).
/// Avoids transferring large binary buffers through the JS bridge.
#[tauri::command]
pub async fn upload_file_to_url(
    file_path: String,
    upload_url: String,
) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        let file_bytes = std::fs::read(&file_path)
            .map_err(|e| format!("Falha ao ler o arquivo para upload: {}", e))?;

        let client = reqwest::blocking::Client::builder()
            .timeout(std::time::Duration::from_secs(300)) // 5 minutes timeout
            .build()
            .unwrap_or_default();

        let response = client.put(&upload_url)
            .body(file_bytes)
            .send()
            .map_err(|e| format!("Falha ao enviar arquivo para o storage: {}", e))?;

        if !response.status().is_success() {
            return Err(format!(
                "O upload para o storage falhou com status: {}",
                response.status()
            ));
        }

        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

/// Helper command to package a save file to a temporary location for cloud upload.
/// Returns the temporary file path and the final compressed size.
#[tauri::command]
pub async fn export_temp_ludocard_save(
    app: tauri::AppHandle,
    game_title: String,
    game_id: String,
    checkpoint_title: String,
    description: String,
    source_path: String,
) -> Result<HashMap<String, serde_json::Value>, String> {
    let temp_dir = std::env::temp_dir();
    let temp_path = temp_dir.join(format!("ludocard_upload_{}.ludocard", uuid::Uuid::new_v4()));
    let temp_path_str = temp_path.to_string_lossy().to_string();

    let metadata = export_ludocard_save(
        app,
        game_title,
        game_id,
        checkpoint_title,
        description,
        source_path,
        temp_path_str.clone(),
    ).await?;

    let mut result = HashMap::new();
    result.insert("filePath".to_string(), serde_json::json!(temp_path_str));
    result.insert("fileSize".to_string(), serde_json::json!(metadata.compressed_size_bytes));
    result.insert("fileName".to_string(), serde_json::json!(format!("{}.ludocard", metadata.game_id)));
    Ok(result)
}

/// Helper command to delete a temporary file after upload completion or failure.
#[tauri::command]
pub async fn delete_temp_file(file_path: String) -> Result<(), String> {
    let path = Path::new(&file_path);
    if path.exists() {
        std::fs::remove_file(path).map_err(|e| format!("Falha ao remover arquivo temporário: {}", e))?;
    }
    Ok(())
}

