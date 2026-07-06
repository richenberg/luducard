// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

mod commands;
pub mod emulator;
pub mod hotkey;
pub mod watcher;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.unminimize();
                let _ = window.set_focus();
            }
        }))
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // Check command line arguments for minimized start
            let args: Vec<String> = std::env::args().collect();
            let start_minimized = args.contains(&"--minimized".to_string()) || args.contains(&"-m".to_string());

            if !start_minimized && let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
            }

            // 1. Create Tray Menu Items
            let quit_i = tauri::menu::MenuItemBuilder::with_id("quit", "Sair do Luducard").build(app)?;
            let show_i = tauri::menu::MenuItemBuilder::with_id("show", "Exibir Janela").build(app)?;

            // 2. Build the Menu
            let menu = tauri::menu::MenuBuilder::new(app).items(&[&show_i, &quit_i]).build()?;

            // 3. Build the Tray Icon
            let _tray = tauri::tray::TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .show_menu_on_left_click(false) // Right-click will show the menu
                .on_menu_event(|app, event| match event.id().as_ref() {
                    "quit" => {
                        app.exit(0);
                    }
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let tauri::tray::TrayIconEvent::Click {
                        button: tauri::tray::MouseButton::Left,
                        button_state: tauri::tray::MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            // Initialize the file watcher in the background after app starts
            let app_handle = app.handle().clone();
            std::thread::spawn(move || {
                // Small delay to let the app fully initialize and load scan cache
                std::thread::sleep(std::time::Duration::from_secs(3));
                watcher::setup_watcher(&app_handle);
                hotkey::init_hotkey(&app_handle);
            });
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                let app = window.app_handle();
                let system_tray_enabled = app
                    .path()
                    .app_data_dir()
                    .map(|dir| crate::commands::load_system_tray_setting(&dir))
                    .unwrap_or(true);

                if system_tray_enabled {
                    api.prevent_close();
                    let _ = window.hide();

                    // Show notification on first minimization
                    if let Ok(dir) = app.path().app_data_dir() {
                        let config_path = dir.join("luducard.json");
                        let mut first_time = true;

                        let mut json: serde_json::Value = if let Ok(content) = std::fs::read_to_string(&config_path) {
                            if let Ok(val) = serde_json::from_str::<serde_json::Value>(&content) {
                                if let Some(notified) = val.get("first_minimize_notified").and_then(|v| v.as_bool())
                                    && notified
                                {
                                    first_time = false;
                                }
                                val
                            } else {
                                serde_json::json!({})
                            }
                        } else {
                            serde_json::json!({})
                        };

                        if first_time {
                            json["first_minimize_notified"] = serde_json::json!(true);
                            let _ = std::fs::create_dir_all(&dir);
                            let _ =
                                std::fs::write(&config_path, serde_json::to_string_pretty(&json).unwrap_or_default());

                            watcher::show_notification(
                                "Luducard em segundo plano",
                                "O aplicativo foi minimizado para a bandeja do sistema.",
                            );
                        }
                    }
                }
            }
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_games,
            commands::scan_games,
            commands::get_game_details,
            commands::backup_game,
            commands::restore_game,
            commands::toggle_backup_locked,
            commands::get_settings,
            commands::save_settings,
            commands::save_language,
            commands::get_translations,
            commands::download_rclone,
            commands::configure_cloud_remote,
            commands::test_cloud_connection,
            commands::check_cloud_conflict,
            commands::get_roots,
            commands::add_root,
            commands::remove_root,
            commands::select_folder,
            commands::open_game_folder,
            commands::toggle_portable_mode,
            // Share Save & Community Checkpoints
            commands::get_client_uuid,
            commands::select_save_file,
            commands::export_luducard_save,
            commands::read_luducard_metadata,
            commands::import_luducard_save,
            commands::download_and_import_luducard,
            commands::save_luducard_dialog,
            commands::open_luducard_dialog,
            commands::upload_file_to_url,
            commands::export_temp_luducard_save,
            commands::export_temp_luducard_backup,
            commands::export_luducard_backup,
            commands::delete_temp_file,
            commands::save_backup_note,
            commands::save_campaign_note,
            commands::open_url,
            commands::get_system_hardware_info,
            commands::detect_game_config_files,
            commands::create_preset_safety_backup,
            commands::restore_preset_safety_backup,
            commands::export_temp_luducard_preset,
            commands::save_local_preset,
            commands::list_local_presets,
            commands::delete_local_preset,
            commands::apply_local_preset,
            commands::export_local_preset_archive,
            commands::add_emulator,
            commands::remove_emulator,
            commands::get_emulators,
            commands::list_save_profiles,
            commands::create_save_profile,
            commands::switch_save_profile,
            commands::delete_save_profile,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Luducard");
}
