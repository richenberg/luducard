//! Global Hotkey Module for Quick-Save Manual Feature.
//!
//! Registers a global shortcut (default Ctrl+Alt+S) on Windows.
//! When pressed, it detects the active foreground window, finds the corresponding game,
//! and runs a silent backup.
#![cfg_attr(not(target_os = "windows"), allow(dead_code, unused_variables))]

use ludusavi::api::Ludusavi;
use std::path::Path;
#[allow(unused_imports)]
use std::path::PathBuf;
use std::sync::mpsc::Sender;
#[allow(unused_imports)]
use std::sync::mpsc::{Receiver, channel};
use std::sync::{LazyLock, Mutex};
use tauri::Manager;

#[derive(Debug)]
pub enum HotkeyControl {
    Register { modifiers: u32, vk: u32 },
    Unregister,
    Quit,
}

static HOTKEY_SENDER: LazyLock<Mutex<Option<Sender<HotkeyControl>>>> = LazyLock::new(|| Mutex::new(None));

static HOTKEY_THREAD_ID: LazyLock<Mutex<Option<u32>>> = LazyLock::new(|| Mutex::new(None));

/// Default quick-save shortcut.
///
/// Ctrl+Alt rather than Ctrl+Shift: this is a *global* hotkey, so it must not collide
/// with whatever has focus. Ctrl+Shift+S is "Save As" in a large number of applications.
pub const DEFAULT_SHORTCUT: &str = "Ctrl+Alt+S";

/// The shortcut shipped as the default before [`DEFAULT_SHORTCUT`]. Configs still holding
/// this value are migrated once on load — see [`load_quick_save_settings`].
const LEGACY_DEFAULT_SHORTCUT: &str = "Ctrl+Shift+S";

/// Loads quick-save settings from luducard.json.
///
/// Configs left on the old default are rewritten to [`DEFAULT_SHORTCUT`] and persisted, so
/// the migration happens exactly once — a user who deliberately picks Ctrl+Shift+S afterwards
/// keeps it.
pub fn load_quick_save_settings(app_data_dir: &Path) -> (bool, String) {
    let config_path = app_data_dir.join("luducard.json");
    if let Ok(content) = std::fs::read_to_string(&config_path)
        && let Ok(json) = serde_json::from_str::<serde_json::Value>(&content)
    {
        let enabled = json.get("quick_save_enabled").and_then(|v| v.as_bool()).unwrap_or(true);
        let stored = json.get("quick_save_shortcut").and_then(|v| v.as_str());

        return match stored {
            Some(LEGACY_DEFAULT_SHORTCUT) => {
                log::info!(
                    "[Hotkey] Migrating quick-save shortcut from {} to {}",
                    LEGACY_DEFAULT_SHORTCUT,
                    DEFAULT_SHORTCUT
                );
                save_quick_save_settings(app_data_dir, enabled, DEFAULT_SHORTCUT);
                (enabled, DEFAULT_SHORTCUT.to_string())
            }
            Some(shortcut) => (enabled, shortcut.to_string()),
            None => (enabled, DEFAULT_SHORTCUT.to_string()),
        };
    }
    (true, DEFAULT_SHORTCUT.to_string())
}

/// Saves quick-save settings to luducard.json.
pub fn save_quick_save_settings(app_data_dir: &Path, enabled: bool, shortcut: &str) {
    let config_path = app_data_dir.join("luducard.json");
    let mut json: serde_json::Value = if let Ok(content) = std::fs::read_to_string(&config_path) {
        serde_json::from_str(&content).unwrap_or(serde_json::json!({}))
    } else {
        serde_json::json!({})
    };
    json["quick_save_enabled"] = serde_json::json!(enabled);
    json["quick_save_shortcut"] = serde_json::json!(shortcut);
    let _ = std::fs::create_dir_all(app_data_dir);
    let _ = std::fs::write(&config_path, serde_json::to_string_pretty(&json).unwrap_or_default());
}

/// Parses a shortcut string like "Ctrl+Alt+S" into (modifiers, vk).
pub fn parse_shortcut(shortcut: &str) -> Option<(u32, u32)> {
    let parts = shortcut.split('+');
    let mut modifiers = 0;
    let mut vk = 0;

    for part in parts {
        let part_trimmed = part.trim().to_lowercase();
        match part_trimmed.as_str() {
            "ctrl" | "control" => modifiers |= 0x0002,                 // MOD_CONTROL
            "shift" => modifiers |= 0x0004,                            // MOD_SHIFT
            "alt" => modifiers |= 0x0001,                              // MOD_ALT
            "win" | "meta" | "cmd" | "command" => modifiers |= 0x0008, // MOD_WIN
            other => {
                if other.len() == 1 {
                    let c = other.chars().next().unwrap();
                    if c.is_ascii_alphabetic() {
                        vk = c.to_ascii_uppercase() as u32;
                    } else if c.is_ascii_digit() {
                        vk = c as u32;
                    }
                } else if other.starts_with('f') && other.len() > 1 {
                    if let Ok(num) = other[1..].parse::<u32>()
                        && (1..=12).contains(&num)
                    {
                        vk = 0x70 + (num - 1); // VK_F1 is 0x70
                    }
                } else {
                    match other {
                        "space" => vk = 0x20,
                        "tab" => vk = 0x09,
                        "esc" | "escape" => vk = 0x1B,
                        "enter" | "return" => vk = 0x0D,
                        "backspace" => vk = 0x08,
                        _ => {}
                    }
                }
            }
        }
    }

    if vk == 0 { None } else { Some((modifiers, vk)) }
}

#[cfg(target_os = "windows")]
pub fn wake_hotkey_thread() {
    if let Some(thread_id) = *HOTKEY_THREAD_ID.lock().unwrap() {
        unsafe {
            let _ = windows::Win32::UI::WindowsAndMessaging::PostThreadMessageW(
                thread_id,
                windows::Win32::UI::WindowsAndMessaging::WM_NULL,
                windows::Win32::Foundation::WPARAM(0),
                windows::Win32::Foundation::LPARAM(0),
            );
        }
    }
}

#[cfg(target_os = "windows")]
pub fn send_hotkey_command(control: HotkeyControl) {
    if let Some(sender) = HOTKEY_SENDER.lock().unwrap().as_ref() {
        let _ = sender.send(control);
        wake_hotkey_thread();
    }
}

#[cfg(target_os = "windows")]
fn get_foreground_process_path() -> Option<PathBuf> {
    use sysinfo::System;
    use windows::Win32::UI::WindowsAndMessaging::{GetForegroundWindow, GetWindowThreadProcessId};

    unsafe {
        let hwnd = GetForegroundWindow();
        if hwnd.0.is_null() {
            return None;
        }
        let mut pid: u32 = 0;
        GetWindowThreadProcessId(hwnd, Some(&mut pid));
        if pid == 0 {
            return None;
        }

        let sys = System::new_all();
        for (p_pid, process) in sys.processes() {
            if p_pid.to_string() == pid.to_string() {
                return process.exe().map(|p| p.to_path_buf());
            }
        }
    }
    None
}

#[cfg(target_os = "windows")]
pub fn play_notification_sound() {
    use std::os::windows::ffi::OsStrExt;

    #[link(name = "winmm")]
    unsafe extern "system" {
        fn PlaySoundW(pszSound: *const u16, hmod: *mut std::ffi::c_void, fdwSound: u32) -> i32;
    }

    let sound_name: Vec<u16> = std::ffi::OsStr::new("SystemNotification")
        .encode_wide()
        .chain(std::iter::once(0))
        .collect();

    unsafe {
        // SND_ALIAS (0x00010000) | SND_ASYNC (0x00000001) | SND_NODEFAULT (0x00000002)
        PlaySoundW(
            sound_name.as_ptr(),
            std::ptr::null_mut(),
            0x00010000 | 0x00000001 | 0x00000002,
        );
    }
}

#[cfg(target_os = "windows")]
fn run_hotkey_loop(rx: Receiver<HotkeyControl>, app_handle: tauri::AppHandle) {
    use windows::Win32::UI::Input::KeyboardAndMouse::{HOT_KEY_MODIFIERS, RegisterHotKey, UnregisterHotKey};
    use windows::Win32::UI::WindowsAndMessaging::{GetMessageW, MSG, WM_HOTKEY};

    let thread_id = unsafe { windows::Win32::System::Threading::GetCurrentThreadId() };
    *HOTKEY_THREAD_ID.lock().unwrap() = Some(thread_id);

    let mut current_registered = false;
    let hotkey_id = 1337;

    loop {
        // Drain commands
        while let Ok(msg) = rx.try_recv() {
            match msg {
                HotkeyControl::Register { modifiers, vk } => {
                    if current_registered {
                        unsafe {
                            let _ = UnregisterHotKey(None, hotkey_id);
                        }
                        current_registered = false;
                    }
                    unsafe {
                        let ok = RegisterHotKey(None, hotkey_id, HOT_KEY_MODIFIERS(modifiers), vk);
                        if ok.is_ok() {
                            current_registered = true;
                            log::info!("[Hotkey] Registered hotkey modifiers: {}, vk: {}", modifiers, vk);
                        } else {
                            if let Err(e) = ok {
                                log::error!(
                                    "[Hotkey] Failed to register hotkey with modifiers: {}, vk: {}. Error: {:?}",
                                    modifiers,
                                    vk,
                                    e
                                );
                            }
                        }
                    }
                }
                HotkeyControl::Unregister => {
                    if current_registered {
                        unsafe {
                            let _ = UnregisterHotKey(None, hotkey_id);
                        }
                        current_registered = false;
                        log::info!("[Hotkey] Unregistered hotkey");
                    }
                }
                HotkeyControl::Quit => {
                    if current_registered {
                        unsafe {
                            let _ = UnregisterHotKey(None, hotkey_id);
                        }
                    }
                    return;
                }
            }
        }

        let mut win_msg = MSG::default();
        let has_msg = unsafe { GetMessageW(&mut win_msg, None, 0, 0).as_bool() };
        if !has_msg {
            break;
        }

        if win_msg.message == WM_HOTKEY && win_msg.wParam.0 == hotkey_id as usize {
            log::info!("[Hotkey] Hotkey pressed!");
            trigger_quick_save(&app_handle);
        }
    }
}

fn matches_game(game_title: &str, install_dir: Option<&str>, exe_path: &Path) -> bool {
    let exe_str = exe_path.to_string_lossy().to_lowercase();
    let exe_name = exe_path
        .file_name()
        .map(|n| n.to_string_lossy().to_lowercase())
        .unwrap_or_default();
    let exe_name_without_ext = exe_path
        .file_stem()
        .map(|n| n.to_string_lossy().to_lowercase())
        .unwrap_or_default();

    // 1. Install dir match
    if let Some(dir) = install_dir
        && !dir.is_empty()
    {
        let dir_lower = dir.to_lowercase();
        let normalized_exe = exe_str.replace('\\', "/");
        let normalized_dir = dir_lower.replace('\\', "/");
        if normalized_exe.contains(&normalized_dir) {
            return true;
        }
    }

    // 2. Fuzzy/slug matches
    let game_lower = game_title.to_lowercase();
    let slug = game_lower
        .chars()
        .map(|c| if c.is_alphanumeric() { c } else { '-' })
        .collect::<String>();
    let clean_slug = slug.replace('-', "");
    let clean_game_title = game_lower.replace(' ', "");

    if exe_str.contains(&game_lower)
        || exe_str.contains(&slug)
        || exe_name.contains(&game_lower)
        || exe_name.contains(&slug)
        || exe_name_without_ext == game_lower
        || exe_name_without_ext == slug
        || exe_name_without_ext == clean_slug
        || exe_name_without_ext == clean_game_title
        || game_lower.contains(&exe_name_without_ext)
    {
        return true;
    }

    false
}

fn find_game_for_exe(exe_path: &Path, app: &tauri::AppHandle) -> Option<String> {
    let app_data_dir = app.path().app_data_dir().ok()?;
    let mut scan_cache = crate::commands::get_scan_cache();
    if scan_cache.is_empty() {
        scan_cache = crate::commands::load_scan_cache(&app_data_dir);
    }

    let api = Ludusavi::load().ok()?;

    // Check scan cache
    for (game_title, info) in &scan_cache {
        if matches_game(game_title, info.install_dir.as_deref(), exe_path) {
            return Some(game_title.clone());
        }
    }

    // Check custom games
    for cg in &api.config.custom_games {
        if matches_game(&cg.name, None, exe_path) {
            return Some(cg.name.clone());
        }
    }

    None
}

/// Backup game silently using Ludusavi API
fn backup_game_silent(game_title: &str, app_data_dir: Option<&Path>) -> Result<(), String> {
    use ludusavi::prelude::{Finality, SyncDirection};

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

    if let Some(dir) = app_data_dir {
        crate::commands::record_latest_backup_kind(&api, dir, game_title, crate::commands::BACKUP_KIND_QUICK);
    }

    Ok(())
}

pub fn trigger_quick_save(app: &tauri::AppHandle) {
    #[cfg(target_os = "windows")]
    {
        use ludusavi::lang::TRANSLATOR;

        let exe_path = match get_foreground_process_path() {
            Some(path) => path,
            None => {
                log::warn!("[Hotkey] Could not determine foreground process path.");
                crate::watcher::show_notification(
                    &TRANSLATOR.notify_quick_save_title(),
                    &TRANSLATOR.notify_quick_save_no_game(),
                );
                return;
            }
        };

        log::info!("[Hotkey] Foreground process: {:?}", exe_path);

        if let Some(game_title) = find_game_for_exe(&exe_path, app) {
            log::info!("[Hotkey] Matched foreground process to game: {}", game_title);

            match backup_game_silent(&game_title, app.path().app_data_dir().ok().as_deref()) {
                Ok(()) => {
                    log::info!("[Hotkey] Quick-save successful for game: {}", game_title);
                    crate::watcher::show_notification(
                        &TRANSLATOR.notify_quick_save_done_title(),
                        &TRANSLATOR.notify_quick_save_done(&game_title),
                    );
                    play_notification_sound();
                }
                Err(e) => {
                    log::error!("[Hotkey] Quick-save failed for game: {}. Error: {}", game_title, e);
                    crate::watcher::show_notification(
                        &TRANSLATOR.notify_quick_save_failed_title(),
                        &TRANSLATOR.notify_quick_save_failed(&game_title, &e),
                    );
                }
            }
        } else {
            let file_name = exe_path
                .file_name()
                .map(|n| n.to_string_lossy().into_owned())
                // No file name to show: fall back to the full path rather than a
                // translated "Unknown", which would tell the user nothing.
                .unwrap_or_else(|| exe_path.to_string_lossy().into_owned());

            log::warn!(
                "[Hotkey] Executable '{:?}' did not match any registered game.",
                exe_path
            );
            crate::watcher::show_notification(
                &TRANSLATOR.notify_quick_save_title(),
                &TRANSLATOR.notify_quick_save_unmatched(&file_name),
            );
        }
    }
}

#[cfg(target_os = "windows")]
pub fn init_hotkey(app: &tauri::AppHandle) {
    let (tx, rx) = channel();
    *HOTKEY_SENDER.lock().unwrap() = Some(tx);

    let app_handle = app.clone();
    std::thread::spawn(move || {
        run_hotkey_loop(rx, app_handle);
    });

    if let Ok(dir) = app.path().app_data_dir() {
        let (enabled, shortcut) = load_quick_save_settings(&dir);
        if enabled && let Some((modifiers, vk)) = parse_shortcut(&shortcut) {
            send_hotkey_command(HotkeyControl::Register { modifiers, vk });
        }
    }
}

#[cfg(not(target_os = "windows"))]
pub fn init_hotkey(_app: &tauri::AppHandle) {}

#[cfg(not(target_os = "windows"))]
pub fn send_hotkey_command(_control: HotkeyControl) {}

#[cfg(not(target_os = "windows"))]
pub fn play_notification_sound() {}
