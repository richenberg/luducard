// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

mod commands;
pub mod watcher;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // Check command line arguments for minimized start
            let args: Vec<String> = std::env::args().collect();
            let start_minimized = args.contains(&"--minimized".to_string()) || args.contains(&"-m".to_string());

            if !start_minimized {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }

            // 1. Create Tray Menu Items
            let quit_i = tauri::menu::MenuItemBuilder::with_id("quit", "Sair do Ludocard").build(app)?;
            let show_i = tauri::menu::MenuItemBuilder::with_id("show", "Exibir Janela").build(app)?;
            
            // 2. Build the Menu
            let menu = tauri::menu::MenuBuilder::new(app)
                .items(&[&show_i, &quit_i])
                .build()?;

            // 3. Build the Tray Icon
            let _tray = tauri::tray::TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .show_menu_on_left_click(false) // Right-click will show the menu
                .on_menu_event(|app, event| {
                    match event.id().as_ref() {
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
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let tauri::tray::TrayIconEvent::Click {
                        button: tauri::tray::MouseButton::Left,
                        button_state: tauri::tray::MouseButtonState::Up,
                        ..
                    } = event {
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
            });
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                let app = window.app_handle();
                let system_tray_enabled = app.path().app_data_dir()
                    .map(|dir| crate::commands::load_system_tray_setting(&dir))
                    .unwrap_or(true);

                if system_tray_enabled {
                    api.prevent_close();
                    let _ = window.hide();

                    // Show notification on first minimization
                    if let Ok(dir) = app.path().app_data_dir() {
                        let config_path = dir.join("ludocard.json");
                        let mut first_time = true;

                        let mut json: serde_json::Value = if let Ok(content) = std::fs::read_to_string(&config_path) {
                            if let Ok(val) = serde_json::from_str::<serde_json::Value>(&content) {
                                if let Some(notified) = val.get("first_minimize_notified").and_then(|v| v.as_bool()) {
                                    if notified {
                                        first_time = false;
                                    }
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
                            let _ = std::fs::write(&config_path, serde_json::to_string_pretty(&json).unwrap_or_default());

                            watcher::show_notification(
                                "Ludocard em segundo plano",
                                "O aplicativo foi minimizado para a bandeja do sistema."
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
            commands::get_roots,
            commands::add_root,
            commands::remove_root,
            commands::select_folder,
            commands::open_game_folder,
            commands::toggle_portable_mode,
            // Share Save & Community Checkpoints
            commands::get_client_uuid,
            commands::select_save_file,
            commands::export_ludocard_save,
            commands::read_ludocard_metadata,
            commands::import_ludocard_save,
            commands::download_and_import_ludocard,
            commands::save_ludocard_dialog,
            commands::open_ludocard_dialog,
            commands::upload_file_to_url,
            commands::export_temp_ludocard_save,
            commands::delete_temp_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Ludocard");
}
