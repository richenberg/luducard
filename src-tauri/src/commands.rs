use base64::Engine;
use ludusavi::{
    api::{Ludusavi, parameters},
    prelude::{Finality, StrictPath, SyncDirection},
    report::ApiGame,
    resource::{SaveableResourceFile, config::Root, manifest::Store},
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::io::Read;
use std::path::{Path, PathBuf};
use std::sync::{LazyLock, Mutex};
use tauri::Emitter;
use tauri::Manager;
use walkdir::WalkDir;

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
    pub note: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FrontendGame {
    pub id: String,
    pub title: String,
    pub cover: String,
    pub platform: String,
    pub save_path: String,
    pub backup_path: String,
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
    pub emulator: Option<String>,
    pub notes: Option<String>,
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
    pub language: String,
    pub has_set_language: bool,
    #[serde(default)]
    pub has_cloud_remote: bool,
    #[serde(default)]
    pub quick_save_enabled: bool,
    #[serde(default)]
    pub quick_save_shortcut: String,
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

static SCAN_CACHE: LazyLock<Mutex<HashMap<String, CachedScanInfo>>> = LazyLock::new(|| Mutex::new(HashMap::new()));

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
    if let Ok(content) = std::fs::read_to_string(path)
        && let Ok(cache) = serde_json::from_str(&content) {
            return cache;
        }
    HashMap::new()
}

static COVER_CACHE: LazyLock<Mutex<HashMap<String, String>>> = LazyLock::new(|| Mutex::new(HashMap::new()));

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
            if file_path.exists()
                && let Ok(bytes) = std::fs::read(&file_path) {
                    let encoded = base64::engine::general_purpose::STANDARD.encode(&bytes);
                    let mime = if *ext == "png" { "image/png" } else { "image/jpeg" };
                    let base64_uri = format!("data:{};base64,{}", mime, encoded);

                    let mut cache = COVER_CACHE.lock().unwrap();
                    cache.insert(slug.to_string(), base64_uri.clone());
                    return base64_uri;
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

fn clean_emulator_prefix(title: &str) -> String {
    let clean = title
        .replace("[Yuzu] ", "")
        .replace("[Ryujinx] ", "")
        .replace("[Dolphin] ", "")
        .replace("[RetroArch] ", "")
        .replace("[mGBA] ", "")
        .replace("[Citra] ", "")
        .replace("[PCSX2] ", "")
        .replace("[PPSSPP] ", "")
        .replace("[Cemu] ", "");

    let mut cleaned = clean;
    if let Some(pos) = cleaned.find(" (") {
        cleaned = cleaned[..pos].to_string();
    }
    cleaned
}

fn extract_title_id_from_path(path: &str) -> Option<String> {
    let normalized = path.replace('\\', "/");
    let parts: Vec<&str> = normalized.split('/').collect();
    for part in parts {
        let clean = part.trim();
        if clean.len() == 16 && clean.chars().all(|c| c.is_ascii_hexdigit()) {
            return Some(clean.to_lowercase());
        }
        if clean.len() == 8 && clean.chars().all(|c| c.is_ascii_hexdigit())
            && clean != "00050000" && clean != "0005000e" && clean != "0005000c" {
                return Some(clean.to_lowercase());
            }
    }
    None
}

fn clean_name_for_match(name: &str) -> String {
    let mut clean = name
        .to_lowercase()
        .chars()
        .filter(|c| c.is_alphanumeric())
        .collect::<String>();

    if clean.starts_with("thelegendofzelda") {
        clean = clean.replace("thelegendofzelda", "tloz");
    }
    clean
}

fn resolve_wiiu_product_code(game_name: &str) -> Option<String> {
    let client = reqwest::blocking::Client::builder()
        .timeout(std::time::Duration::from_secs(3))
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        .build()
        .ok()?;
    let url = "https://raw.githubusercontent.com/Laf111/CEMU-Batch-Framework/master/resources/WiiU-Titles-Library.csv";
    if let Ok(resp) = client.get(url).send()
        && resp.status().is_success()
            && let Ok(content) = resp.text() {
                let name_clean = clean_name_for_match(game_name);
                for line in content.lines() {
                    let parts: Vec<&str> = if line.contains(';') {
                        line.split(';').collect()
                    } else {
                        line.split(',').collect()
                    };
                    if parts.len() > 2 {
                        let csv_name = parts[1].trim().trim_matches('"').trim();
                        if clean_name_for_match(csv_name) == name_clean {
                            let product_code = parts[2].trim().trim_matches('"').trim().to_lowercase();
                            if product_code.is_empty() || product_code == "-" {
                                continue;
                            }
                            let company_code = if parts.len() > 3 {
                                parts[3].trim().trim_matches('"').trim().to_lowercase()
                            } else {
                                "1".to_string()
                            };

                            let game_code = product_code.split('-').next_back().unwrap_or(&product_code).to_uppercase();
                            let pub_code = if company_code == "1" || company_code.is_empty() || company_code == "-" {
                                "01".to_string()
                            } else if company_code.len() >= 2 {
                                company_code[company_code.len() - 2..].to_uppercase()
                            } else {
                                format!("0{}", company_code).to_uppercase()
                            };

                            let gametdb_id = format!("{}{}", game_code, pub_code);
                            if gametdb_id.len() == 6 {
                                return Some(gametdb_id);
                            }
                        }
                    }
                }
            }
    None
}

fn start_cover_downloads(
    app: &tauri::AppHandle,
    games_to_download: Vec<(String, String, Option<u32>, Option<String>)>,
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
            .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
            .build()
            .unwrap_or_default();

        for (i, (slug, title, steam_id, title_id)) in games_to_download.iter().enumerate() {
            let mut app_id = *steam_id;
            let clean_title = clean_emulator_prefix(title);
            if app_id.is_none()
                && let Ok(search_res) = search_steam_app_id(&client, &clean_title) {
                    app_id = Some(search_res);
                }

            let mut downloaded = false;
            let mut base64_uri = String::new();

            if let Some(id) = app_id {
                let url = format!(
                    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/{}/library_600x900.jpg",
                    id
                );
                if let Ok(resp) = client.get(&url).send()
                    && resp.status().is_success()
                        && let Ok(bytes) = resp.bytes()
                            && bytes.len() > 1000 {
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

            if !downloaded {
                // Try Libretro Thumbnails / GameTDB fallback for emulation console exclusives
                let mut emulator_name = "";
                let emulators_prefix = [
                    "Yuzu",
                    "Ryujinx",
                    "Dolphin",
                    "RetroArch",
                    "mGBA",
                    "Citra",
                    "PCSX2",
                    "PPSSPP",
                    "Cemu",
                ];
                for emu in emulators_prefix {
                    let prefix = format!("[{}] ", emu);
                    if title.starts_with(&prefix) {
                        emulator_name = emu;
                        break;
                    }
                }

                if !emulator_name.is_empty() {
                    // Try Cemu (Wii U) GameTDB Cover logic
                    if emulator_name == "Cemu"
                        && let Some(product_code) = resolve_wiiu_product_code(&clean_title) {
                            for region in &["US", "EN", "JA"] {
                                let url = format!("https://art.gametdb.com/wiiu/cover/{}/{}.jpg", region, product_code);
                                if let Ok(resp) = client.get(&url).send()
                                    && resp.status().is_success()
                                        && let Ok(bytes) = resp.bytes()
                                            && bytes.len() > 1000 {
                                                let file_path = covers_dir.join(format!("{}.jpg", slug));
                                                if std::fs::write(&file_path, &bytes).is_ok() {
                                                    let encoded =
                                                        base64::engine::general_purpose::STANDARD.encode(&bytes);
                                                    base64_uri = format!("data:image/jpeg;base64,{}", encoded);

                                                    let mut cache = COVER_CACHE.lock().unwrap();
                                                    cache.insert(slug.clone(), base64_uri.clone());
                                                    downloaded = true;
                                                    break;
                                                }
                                            }
                            }
                        }

                    // Try Yuzu/Ryujinx (Switch) Tinfoil Cover scraping
                    if (emulator_name == "Yuzu" || emulator_name == "Ryujinx") && !downloaded
                        && let Some(tid) = title_id {
                            let url = format!("https://tinfoil.io/Title/{}", tid.to_lowercase());
                            if let Ok(resp) = client.get(&url).send()
                                && resp.status().is_success()
                                    && let Ok(html) = resp.text()
                                        && let Some(pos) = html.find("og:image")
                                            && let Some(content_pos) = html[pos..].find("content=\"")
                                                && let Some(end_pos) = html[pos + content_pos + 9..].find('"') {
                                                    let img_url =
                                                        &html[pos + content_pos + 9..pos + content_pos + 9 + end_pos];
                                                    if let Ok(img_resp) = client.get(img_url).send()
                                                        && img_resp.status().is_success()
                                                            && let Ok(bytes) = img_resp.bytes()
                                                                && bytes.len() > 1000 {
                                                                    let file_path =
                                                                        covers_dir.join(format!("{}.png", slug));
                                                                    if std::fs::write(&file_path, &bytes).is_ok() {
                                                                        let encoded =
                                                                            base64::engine::general_purpose::STANDARD
                                                                                .encode(&bytes);
                                                                        base64_uri = format!(
                                                                            "data:image/png;base64,{}",
                                                                            encoded
                                                                        );

                                                                        let mut cache = COVER_CACHE.lock().unwrap();
                                                                        cache.insert(slug.clone(), base64_uri.clone());
                                                                        downloaded = true;
                                                                    }
                                                                }
                                                }
                        }

                    // Fallback to standard Libretro Named Boxarts exact match
                    if !downloaded {
                        let repo_name = match emulator_name {
                            "Dolphin" => {
                                if title.to_lowercase().contains("wii") {
                                    Some("Nintendo_-_Wii")
                                } else {
                                    Some("Nintendo_-_GameCube")
                                }
                            }
                            "PCSX2" => Some("Sony_-_PlayStation_2"),
                            "mGBA" => Some("Nintendo_-_Game_Boy_Advance"),
                            "Citra" => Some("Nintendo_-_Nintendo_3DS"),
                            "PPSSPP" => Some("Sony_-_PlayStation_Portable"),
                            "Cemu" => Some("Nintendo_-_Wii_U"),
                            _ => None,
                        };

                        if let Some(repo) = repo_name {
                            let github_title = clean_title.replace(" ", "%20");
                            let libretro_url = format!(
                                "https://raw.githubusercontent.com/libretro-thumbnails/{}/master/Named_Boxarts/{}.png",
                                repo, github_title
                            );

                            if let Ok(resp) = client.get(&libretro_url).send()
                                && resp.status().is_success()
                                    && let Ok(bytes) = resp.bytes()
                                        && bytes.len() > 1000 {
                                            let file_path = covers_dir.join(format!("{}.png", slug));
                                            if std::fs::write(&file_path, &bytes).is_ok() {
                                                let encoded = base64::engine::general_purpose::STANDARD.encode(&bytes);
                                                base64_uri = format!("data:image/png;base64,{}", encoded);

                                                let mut cache = COVER_CACHE.lock().unwrap();
                                                cache.insert(slug.clone(), base64_uri.clone());
                                                downloaded = true;
                                            }
                                        }
                        }
                    }

                    if !downloaded {
                        let (supabase_url, supabase_anon_key) = load_supabase_settings(&app_data_dir);
                        let edge_function_url =
                            format!("{}/functions/v1/get-game-cover", supabase_url.trim_end_matches('/'));
                        let req_payload = serde_json::json!({
                            "gameTitle": clean_title
                        });

                        if let Ok(resp) = client
                            .post(&edge_function_url)
                            .header("apikey", &supabase_anon_key)
                            .header("Authorization", format!("Bearer {}", supabase_anon_key))
                            .json(&req_payload)
                            .send()
                            && resp.status().is_success()
                                && let Ok(json_res) = resp.json::<serde_json::Value>()
                                    && let Some(cover_url) = json_res.get("coverUrl").and_then(|v| v.as_str())
                                        && let Ok(img_resp) = client.get(cover_url).send()
                                            && img_resp.status().is_success()
                                                && let Ok(bytes) = img_resp.bytes()
                                                    && bytes.len() > 1000 {
                                                        let file_path = covers_dir.join(format!("{}.jpg", slug));
                                                        if std::fs::write(&file_path, &bytes).is_ok() {
                                                            let encoded = base64::engine::general_purpose::STANDARD
                                                                .encode(&bytes);
                                                            base64_uri = format!("data:image/jpeg;base64,{}", encoded);

                                                            let mut cache = COVER_CACHE.lock().unwrap();
                                                            cache.insert(slug.clone(), base64_uri.clone());
                                                            downloaded = true;
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

fn find_game_install_dir(root_path: &Path, game_title: &str, candidate_dirs: &[String]) -> Option<PathBuf> {
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
            if let Ok(file_type) = entry.file_type()
                && file_type.is_dir() {
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

    None
}

/// Check if a game's installation directory exists and contains at least one executable.
/// This is a lightweight check that avoids false positives from leftover save files.
fn check_if_game_installed(api: &Ludusavi, name: &str) -> bool {
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
        if let Ok(metadata) = entry.metadata()
            && let Ok(modified) = metadata.modified() {
                match latest {
                    Some(current) if modified > current => latest = Some(modified),
                    None => latest = Some(modified),
                    _ => {}
                }
            }
    }

    latest.map(|t| {
        let datetime: chrono::DateTime<chrono::Local> = t.into();
        datetime.to_rfc3339()
    })
}

pub fn load_backup_note(app_data_dir: &Path, game_id: &str, backup_id: &str) -> Option<String> {
    let config_path = app_data_dir.join("ludocard.json");
    let content = std::fs::read_to_string(&config_path).ok()?;
    let json: serde_json::Value = serde_json::from_str(&content).ok()?;
    let note = json
        .get("backup_notes")?
        .get(game_id)?
        .get(backup_id)?
        .as_str()?
        .to_string();
    Some(note)
}

pub fn load_campaign_note(app_data_dir: &Path, game_id: &str) -> Option<String> {
    let config_path = app_data_dir.join("ludocard.json");
    let content = std::fs::read_to_string(&config_path).ok()?;
    let json: serde_json::Value = serde_json::from_str(&content).ok()?;
    let note = json.get("campaign_notes")?.get(game_id)?.as_str()?.to_string();
    Some(note)
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

            let note = app_data_dir.and_then(|dir| load_backup_note(dir, &slug, &b.name));

            backups_list.push(FrontendBackupVersion {
                id: b.name.clone(),
                date: date_str,
                time: time_str,
                kind: if b.locked { "Manual (Bloqueado)" } else { "Automático" }.to_string(),
                size_mb: (b.size_bytes as f64) / (1024.0 * 1024.0),
                cloud: api.config.cloud.synchronize,
                locked: b.locked,
                note,
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
    let mut emulator = None;

    if name.starts_with('[') {
        let emulators_prefix = [
            "Yuzu",
            "Ryujinx",
            "Dolphin",
            "RetroArch",
            "mGBA",
            "Citra",
            "PCSX2",
            "PPSSPP",
            "Cemu",
        ];
        for emu in emulators_prefix {
            let prefix = format!("[{}] ", emu);
            if name.starts_with(&prefix) {
                platform = "Emulador".to_string();
                emulator = Some(emu.to_string());
                break;
            }
        }
    } else if let Some(meta) = game_meta {
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
    let has_known_store = game_meta
        .map(|m| m.steam.id.is_some() || m.gog.id.is_some())
        .unwrap_or(false)
        || matches!(platform.as_str(), "Steam" | "GOG" | "Epic" | "Origin" | "Ea" | "Uplay");

    let installed = if has_known_store {
        check_if_game_installed(api, name)
    } else {
        !save_path.is_empty()
    };

    // Calculate last_played from save file modification times
    let last_played = get_latest_modified_time(&save_path);

    let backups_size_mb = backups_list.iter().map(|b| b.size_mb).sum::<f64>();

    let mut backup_path = String::new();
    if let Some(ApiGame::Stored { backup_path: path, .. }) = backup_game {
        backup_path = path.clone();
    }

    let notes = app_data_dir.and_then(|dir| load_campaign_note(dir, &slug));

    FrontendGame {
        id: slug,
        title: display_title,
        cover: cover_path,
        platform,
        save_path,
        backup_path,
        size_mb: (size_bytes as f64) / (1024.0 * 1024.0),
        last_backup: last_backup_str,
        status,
        auto_backup,
        cloud_sync,
        backups: backups_list,
        backups_size_mb,
        installed,
        last_played,
        emulator,
        notes,
    }
}

/// Fast load: only reads backup directory structure + merges cached scan data.
/// Does NOT scan the filesystem for saves (that's what scan_games does).
#[tauri::command]
pub async fn get_games(app: tauri::AppHandle) -> Result<Vec<FrontendGame>, String> {
    tokio::task::spawn_blocking(move || {
        let _ = crate::emulator::heal_custom_game_paths();
        let api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

        let backups_output = api
            .list_backups(parameters::ListBackups { games: vec![] })
            .map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

        let app_data_dir = app.path().app_data_dir().ok();
        let mut cache = SCAN_CACHE.lock().unwrap();
        if cache.is_empty()
            && let Some(ref dir) = app_data_dir {
                *cache = load_scan_cache(dir);
            }

        // Collect all known game names from backups + scan cache + custom games
        let mut all_names: std::collections::BTreeSet<String> = std::collections::BTreeSet::new();
        for name in backups_output.games.keys() {
            all_names.insert(name.clone());
        }
        for name in cache.keys() {
            all_names.insert(name.clone());
        }
        for cg in &api.config.custom_games {
            all_names.insert(cg.name.clone());
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
                if let Some(game_meta) = api.manifest.0.get(name)
                    && let Some(sid) = game_meta.steam.id {
                        steam_id = Some(sid);
                    }
                let mut title_id = None;
                if let Some(cg) = api.config.custom_games.iter().find(|g| g.name == *name)
                    && let Some(first_file) = cg.files.first() {
                        title_id = extract_title_id_from_path(first_file);
                    }
                games_to_download.push((fg.id.clone(), name.clone(), steam_id, title_id));
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
        let _ = crate::emulator::heal_custom_game_paths();
        let app_data_dir = app.path().app_data_dir().ok();

        // 1. Scan and register emulator saves first
        if let Some(ref dir) = app_data_dir {
            let emulators = load_emulators_setting(dir);
            let mut all_saves = Vec::new();
            for emu_path in emulators {
                if let Some(emu_name) = crate::emulator::identify_emulator(Path::new(&emu_path)) {
                    let detected = crate::emulator::scan_emulator_saves(&emu_name, &emu_path);
                    all_saves.extend(detected);
                }
            }
            if !all_saves.is_empty() {
                let _ = crate::emulator::register_emulator_saves(all_saves);
            }
        }

        let mut api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

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
                if let ApiGame::Operative { change, files, .. } = game_data {
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
        for cg in &api.config.custom_games {
            all_names.insert(cg.name.clone());
        }

        let cache = SCAN_CACHE.lock().unwrap();
        let mut frontend_games = Vec::new();
        let mut games_to_download = Vec::new();

        for name in &all_names {
            let scan_game = scan_output.games.get(name);
            let backup_game = backups_output.games.get(name);
            let cached_scan = cache.get(name);
            let fg = build_frontend_game(app_data_dir.as_deref(), &api, name, scan_game, backup_game, cached_scan);

            if fg.cover == "/placeholder.svg" {
                let mut steam_id = None;
                if let Some(game_meta) = api.manifest.0.get(name)
                    && let Some(sid) = game_meta.steam.id {
                        steam_id = Some(sid);
                    }
                let mut title_id = None;
                if let Some(cg) = api.config.custom_games.iter().find(|g| g.name == *name)
                    && let Some(first_file) = cg.files.first() {
                        title_id = extract_title_id_from_path(first_file);
                    }
                games_to_download.push((fg.id.clone(), name.clone(), steam_id, title_id));
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
        let mut api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

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

        let fg = build_frontend_game(app_data_dir.as_deref(), &api, &name, scan_game, backup_game, None);

        if fg.cover == "/placeholder.svg" {
            let mut steam_id = None;
            if let Some(game_meta) = api.manifest.0.get(&name)
                && let Some(sid) = game_meta.steam.id {
                    steam_id = Some(sid);
                }
            let mut title_id = None;
            if let Some(cg) = api.config.custom_games.iter().find(|g| g.name == name)
                && let Some(first_file) = cg.files.first() {
                    title_id = extract_title_id_from_path(first_file);
                }
            start_cover_downloads(&app, vec![(fg.id.clone(), name.clone(), steam_id, title_id)]);
        }

        Ok(Some(fg))
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn backup_game(game_title: String) -> Result<String, String> {
    tokio::task::spawn_blocking(move || {
        let mut api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

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
        let mut api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

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
pub async fn toggle_backup_locked(game_title: String, backup_id: String, locked: bool) -> Result<(), String> {
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
    if let Ok(content) = std::fs::read_to_string(&config_path)
        && let Ok(json) = serde_json::from_str::<serde_json::Value>(&content) {
            return json.get("system_tray").and_then(|v| v.as_bool()).unwrap_or(true);
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
    if let Ok(content) = std::fs::read_to_string(&config_path)
        && let Ok(json) = serde_json::from_str::<serde_json::Value>(&content) {
            let url = json
                .get("supabase_url")
                .and_then(|v| v.as_str())
                .filter(|s| !s.is_empty())
                .unwrap_or(DEFAULT_SUPABASE_URL)
                .to_string();
            let key = json
                .get("supabase_anon_key")
                .and_then(|v| v.as_str())
                .filter(|s| !s.is_empty())
                .unwrap_or(DEFAULT_SUPABASE_ANON_KEY)
                .to_string();
            return (url, key);
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
    use winreg::RegKey;
    use winreg::enums::HKEY_CURRENT_USER;
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    if let Ok(run_key) = hkcu.open_subkey("Software\\Microsoft\\Windows\\CurrentVersion\\Run")
        && let Ok(val) = run_key.get_value::<String, _>("Ludocard")
            && let Ok(exe) = std::env::current_exe() {
                let exe_str = exe.to_string_lossy();
                return val.contains(&*exe_str);
            }
    false
}

#[cfg(not(target_os = "windows"))]
pub fn is_autostart_enabled() -> bool {
    false
}

#[cfg(target_os = "windows")]
pub fn set_autostart(enabled: bool) -> Result<(), String> {
    use winreg::RegKey;
    use winreg::enums::{HKEY_CURRENT_USER, KEY_READ, KEY_WRITE};
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let run_key = hkcu
        .open_subkey_with_flags(
            "Software\\Microsoft\\Windows\\CurrentVersion\\Run",
            KEY_WRITE | KEY_READ,
        )
        .map_err(|e| format!("Failed to open Run registry key: {}", e))?;

    if enabled {
        let exe = std::env::current_exe().map_err(|e| format!("Failed to get current executable path: {}", e))?;
        let exe_str = exe.to_string_lossy();
        let value = format!("\"{}\" --minimized", exe_str);
        run_key
            .set_value("Ludocard", &value)
            .map_err(|e| format!("Failed to set Registry value: {}", e))?;
    } else {
        if run_key.get_value::<String, _>("Ludocard").is_ok() {
            run_key
                .delete_value("Ludocard")
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

        let file_watcher = app
            .path()
            .app_data_dir()
            .map(|dir| crate::watcher::load_file_watcher_setting(&dir))
            .unwrap_or(false);

        let system_tray = app
            .path()
            .app_data_dir()
            .map(|dir| load_system_tray_setting(&dir))
            .unwrap_or(true);

        let (supabase_url, supabase_anon_key) = match app.path().app_data_dir() {
            Ok(dir) => {
                let res = load_supabase_settings(&dir);
                println!(
                    "DEBUG: Supabase loaded from AppData ({}): URL = '{}', KEY = '{}'",
                    dir.display(),
                    res.0,
                    res.1
                );
                res
            }
            Err(e) => {
                println!("DEBUG: Failed to get AppData dir: {:?}", e);
                ("".to_string(), "".to_string())
            }
        };

        let (quick_save_enabled, quick_save_shortcut) = app
            .path()
            .app_data_dir()
            .map(|dir| crate::hotkey::load_quick_save_settings(&dir))
            .unwrap_or((true, "Ctrl+Shift+S".to_string()));

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
            language: serde_json::to_string(&api.config.language)
                .unwrap()
                .trim_matches('"')
                .to_string(),
            has_set_language: api.config.has_set_language,
            has_cloud_remote: api.config.cloud.remote.is_some(),
            quick_save_enabled,
            quick_save_shortcut,
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
        let mut api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

        api.config.backup.path = StrictPath::new(settings.backup_path);
        api.config.apps.rclone.path = StrictPath::new(settings.rclone_path);
        api.config.cloud.path = settings.cloud_path;
        api.config.cloud.synchronize = settings.cloud_sync;
        api.config.apps.rclone.arguments = settings.rclone_arguments;

        if let Ok(lang) = serde_json::from_str::<ludusavi::lang::Language>(&format!("\"{}\"", settings.language)) {
            api.config.language = lang;
            api.config.has_set_language = settings.has_set_language;
            ludusavi::lang::TRANSLATOR.set_language(lang);
        }

        api.config.save();

        // Save settings to ludocard.json
        if let Ok(dir) = app_clone.path().app_data_dir() {
            crate::watcher::save_file_watcher_setting(&dir, file_watcher_enabled);
            save_system_tray_setting(&dir, system_tray_enabled);
            save_supabase_settings(&dir, &settings.supabase_url, &settings.supabase_anon_key);
            crate::hotkey::save_quick_save_settings(&dir, settings.quick_save_enabled, &settings.quick_save_shortcut);
        }

        // Configure autostart
        let _ = set_autostart(start_with_windows_enabled);

        // Start or stop the file watcher based on the new setting
        if file_watcher_enabled {
            crate::watcher::start_file_watcher(&app_clone);
        } else {
            crate::watcher::stop_file_watcher();
        }

        // Update global hotkey registration
        #[cfg(target_os = "windows")]
        {
            if settings.quick_save_enabled {
                if let Some((modifiers, vk)) = crate::hotkey::parse_shortcut(&settings.quick_save_shortcut) {
                    crate::hotkey::send_hotkey_command(crate::hotkey::HotkeyControl::Register { modifiers, vk });
                } else {
                    crate::hotkey::send_hotkey_command(crate::hotkey::HotkeyControl::Unregister);
                }
            } else {
                crate::hotkey::send_hotkey_command(crate::hotkey::HotkeyControl::Unregister);
            }
        }

        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn save_language(language: String) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        let mut config = ludusavi::resource::config::Config::load().map_err(|e| format!("{:?}", e))?;
        if let Ok(lang) = serde_json::from_str::<ludusavi::lang::Language>(&format!("\"{}\"", language)) {
            config.language = lang;
            config.has_set_language = true;
            config.save();
            ludusavi::lang::TRANSLATOR.set_language(lang);
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
                api.config.save();
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
pub async fn open_game_folder(game_title: String, folder_type: String, save_path: String) -> Result<(), String> {
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
                
                Path::new(&backup_base).join(sanitize_game_title(&game_title))
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
                        use winreg::RegKey;
                        use winreg::enums::*;
                        let hkcu = RegKey::predef(HKEY_CURRENT_USER);
                        if let Ok(steam_key) = hkcu.open_subkey("Software\\Valve\\Steam")
                            && let Ok(steam_path) = steam_key.get_value::<String, _>("SteamPath") {
                                let steam_common = Path::new(&steam_path).join("steamapps").join("common");
                                if let Some(p) = find_game_install_dir(&steam_common, &game_title, &candidate_dirs) {
                                    resolved_path = Some(p);
                                }
                            }
                    }
                }

                match resolved_path {
                    Some(p) => p,
                    None => {
                        return Err(format!(
                            "Não foi possível localizar a pasta de instalação para: {}.",
                            game_title
                        ));
                    }
                }
            }
            _ => return Err("Tipo de pasta inválido.".to_string()),
        };

        if !path_to_open.exists() {
            return Err(format!(
                "O diretório especificado não existe ou ainda não foi criado: {:?}",
                path_to_open
            ));
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
        use winreg::RegKey;
        use winreg::enums::*;

        // 1. Steam
        let hkcu = RegKey::predef(HKEY_CURRENT_USER);
        if let Ok(steam_key) = hkcu.open_subkey("Software\\Valve\\Steam")
            && let Ok(steam_path) = steam_key.get_value::<String, _>("SteamPath") {
                let path = Path::new(&steam_path).join("steamapps").join("common");
                if path.exists() {
                    detected.push((StrictPath::new(path.to_string_lossy().to_string()), Store::Steam));
                }
            }

        // 2. GOG Galaxy
        let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
        if let Ok(gog_key) = hklm.open_subkey("SOFTWARE\\WOW6432Node\\GOG.com\\GalaxyClient\\paths")
            && let Ok(gog_path) = gog_key.get_value::<String, _>("client") {
                let path = Path::new(&gog_path);
                if path.exists() {
                    detected.push((StrictPath::new(path.to_string_lossy().to_string()), Store::Gog));
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

#[derive(serde::Serialize)]
pub struct AddRootResult {
    pub success: bool,
    pub is_emulator: bool,
    pub emulator_name: Option<String>,
}

#[tauri::command]
pub async fn add_root(path: String) -> Result<AddRootResult, String> {
    tokio::task::spawn_blocking(move || {
        let path_buf = PathBuf::from(&path);

        if let Some(emu_name) = crate::emulator::identify_emulator(&path_buf) {
            return Ok(AddRootResult {
                success: false,
                is_emulator: true,
                emulator_name: Some(emu_name),
            });
        }

        let mut api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;
        let strict_path = StrictPath::new(path);
        let new_root = Root::new(strict_path, Store::Other);
        api.config.roots.push(new_root);
        api.config.save();

        Ok(AddRootResult {
            success: true,
            is_emulator: false,
            emulator_name: None,
        })
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn remove_root(path: String) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        let mut api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;
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
        let mut builder = rfd::FileDialog::new().set_title("Selecione o arquivo de Save");
        if let Some(ref dir) = start_dir {
            let path = Path::new(dir);
            if path.is_dir() {
                builder = builder.set_directory(dir);
            } else if let Some(parent) = path.parent()
                && parent.is_dir() {
                    builder = builder.set_directory(parent);
                }
        }
        builder.pick_file()
    });
    let result = handle
        .join()
        .map_err(|_| "Falha ao abrir o seletor de arquivos".to_string())?;
    Ok(result.map(|f| f.to_string_lossy().to_string()))
}

fn export_ludocard_save_internal(
    app: &tauri::AppHandle,
    game_title: &str,
    game_id: &str,
    checkpoint_title: &str,
    description: &str,
    source_path: &str,
    dest_path: &str,
) -> Result<LudocardMetadata, String> {
    let source = Path::new(source_path);
    if !source.exists() {
        return Err(format!("O arquivo de save não foi encontrado: {}", source_path));
    }

    // Collect files to archive: if source is a file, just that file.
    // If source is a directory, collect all files in it (shallow, max 2 levels).
    let mut files_to_archive: Vec<PathBuf> = Vec::new();
    let base_dir: &Path;

    if source.is_file() {
        files_to_archive.push(source.to_path_buf());
        base_dir = source.parent().unwrap_or(source);
    } else if source.is_dir() {
        for entry in WalkDir::new(source).max_depth(2).into_iter().filter_map(|e| e.ok()) {
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
    let dest_file =
        std::fs::File::create(dest_path).map_err(|e| format!("Falha ao criar o arquivo de destino: {}", e))?;

    let zstd_encoder = zstd::Encoder::new(dest_file, 19) // Level 19 = high compression
        .map_err(|e| format!("Falha ao iniciar compressão zstd: {}", e))?;

    let mut tar_builder = tar::Builder::new(zstd_encoder);

    // Add each save file to the tar archive under "saves/" prefix
    for file_path in &files_to_archive {
        let relative = file_path.strip_prefix(base_dir).unwrap_or(file_path);
        let archive_name = Path::new("saves").join(relative);

        tar_builder
            .append_path_with_name(file_path, &archive_name)
            .map_err(|e| format!("Falha ao adicionar arquivo ao pacote: {}", e))?;
    }

    // Build metadata (compressed_size will be updated after finishing)
    let metadata = LudocardMetadata {
        game_title: game_title.to_string(),
        game_id: game_id.to_string(),
        checkpoint_title: checkpoint_title.to_string(),
        description: description.to_string(),
        original_files,
        created_at: now.to_rfc3339(),
        total_size_bytes: total_size,
        compressed_size_bytes: 0, // Will be set after archive is closed
        client_uuid,
    };

    // Serialize metadata and add to tar
    let metadata_json =
        serde_json::to_string_pretty(&metadata).map_err(|e| format!("Falha ao serializar metadados: {}", e))?;

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
    let compressed_size = std::fs::metadata(dest_path).map(|m| m.len()).unwrap_or(0);

    Ok(LudocardMetadata {
        compressed_size_bytes: compressed_size,
        ..metadata
    })
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
        export_ludocard_save_internal(
            &app,
            &game_title,
            &game_id,
            &checkpoint_title,
            &description,
            &source_path,
            &dest_path,
        )
    })
    .await
    .map_err(|e| e.to_string())?
}

/// Reads metadata from a `.ludocard` archive without extracting files.
/// Used to preview checkpoint details before importing.
#[tauri::command]
pub async fn read_ludocard_metadata(archive_path: String) -> Result<LudocardMetadata, String> {
    tokio::task::spawn_blocking(move || {
        let file = std::fs::File::open(&archive_path).map_err(|e| format!("Falha ao abrir o arquivo: {}", e))?;

        let decoder = zstd::Decoder::new(file)
            .map_err(|e| format!("Falha ao decodificar o arquivo (não é um .ludocard válido?): {}", e))?;

        let mut archive = tar::Archive::new(decoder);

        for entry in archive
            .entries()
            .map_err(|e| format!("Falha ao ler entradas do arquivo: {}", e))?
        {
            let mut entry = entry.map_err(|e| format!("Falha ao ler entrada: {}", e))?;

            let path = entry
                .path()
                .map_err(|e| format!("Falha ao ler caminho da entrada: {}", e))?;

            if path.to_string_lossy() == "metadata.json" {
                let mut content = String::new();
                entry
                    .read_to_string(&mut content)
                    .map_err(|e| format!("Falha ao ler metadata.json: {}", e))?;

                let mut metadata: LudocardMetadata =
                    serde_json::from_str(&content).map_err(|e| format!("Falha ao interpretar metadata.json: {}", e))?;

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
fn import_ludocard_save_internal(archive_path: &Path, target_dir: &Path) -> Result<LudocardMetadata, String> {
    // Step 1: Read metadata first
    let file = std::fs::File::open(archive_path).map_err(|e| format!("Falha ao abrir o arquivo: {}", e))?;

    let decoder = zstd::Decoder::new(file).map_err(|e| format!("Arquivo .ludocard inválido: {}", e))?;

    let mut archive = tar::Archive::new(decoder);
    let mut metadata: Option<LudocardMetadata> = None;

    // First pass: find and read metadata
    for entry in archive.entries().map_err(|e| format!("Falha ao ler entradas: {}", e))? {
        let mut entry = entry.map_err(|e| format!("Falha ao ler entrada: {}", e))?;
        let path = entry.path().map_err(|e| format!("Falha ao ler caminho: {}", e))?;

        if path.to_string_lossy() == "metadata.json" {
            let mut content = String::new();
            entry
                .read_to_string(&mut content)
                .map_err(|e| format!("Falha ao ler metadata.json: {}", e))?;

            metadata = Some(serde_json::from_str(&content).map_err(|e| format!("metadata.json corrompido: {}", e))?);
            break;
        }
    }

    let metadata = metadata.ok_or("O arquivo .ludocard não contém metadata.json.".to_string())?;

    // Step 2: Create a safety backup of the current save directory (Seguro-Crash)
    if target_dir.exists() && target_dir.is_dir() {
        let backup_name = format!(
            "{}_seguro_crash_{}.tar.zst",
            metadata.game_id,
            chrono::Local::now().format("%Y%m%d_%H%M%S")
        );
        let backup_path = target_dir.parent().unwrap_or(target_dir).join(&backup_name);

        // Create safety backup of existing saves
        if let Ok(backup_file) = std::fs::File::create(&backup_path)
            && let Ok(encoder) = zstd::Encoder::new(backup_file, 3) {
                // Fast compression for safety backup
                let mut tar_builder = tar::Builder::new(encoder);
                let _ = tar_builder.append_dir_all(".", target_dir);
                if let Ok(encoder) = tar_builder.into_inner() {
                    let _ = encoder.finish();
                }
            }
    }

    // Step 3: Re-open and extract save files with path traversal protection
    let file = std::fs::File::open(archive_path).map_err(|e| format!("Falha ao reabrir o arquivo: {}", e))?;

    let decoder = zstd::Decoder::new(file).map_err(|e| format!("Falha ao decodificar: {}", e))?;

    let mut archive = tar::Archive::new(decoder);

    // Ensure target directory exists
    std::fs::create_dir_all(target_dir).map_err(|e| format!("Falha ao criar diretório de destino: {}", e))?;

    let canonical_target = target_dir
        .canonicalize()
        .map_err(|e| format!("Falha ao resolver caminho de destino: {}", e))?;

    for entry in archive.entries().map_err(|e| format!("Falha ao ler entradas: {}", e))? {
        let mut entry = entry.map_err(|e| format!("Falha ao ler entrada: {}", e))?;
        let path = entry.path().map_err(|e| format!("Falha ao ler caminho: {}", e))?;

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
            std::fs::create_dir_all(parent).map_err(|e| format!("Falha ao criar subdiretório: {}", e))?;
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
        let mut output_file =
            std::fs::File::create(&dest_path).map_err(|e| format!("Falha ao criar arquivo extraído: {}", e))?;

        std::io::copy(&mut entry, &mut output_file).map_err(|e| format!("Falha ao extrair arquivo: {}", e))?;
    }

    Ok(metadata)
}

/// Imports a `.ludocard` archive, extracting save files into the target directory.
/// Before extracting, it creates a safety backup of the current save (Seguro-Crash).
/// All paths are validated to prevent path traversal attacks.
#[tauri::command]
pub async fn import_ludocard_save(archive_path: String, target_save_dir: String) -> Result<LudocardMetadata, String> {
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

        let response = client
            .get(&download_url)
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
        let temp_file_path = temp_dir.join(format!("ludocard_download_{}.ludocard", uuid::Uuid::new_v4()));

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
pub async fn upload_file_to_url(file_path: String, upload_url: String) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        let file_bytes = std::fs::read(&file_path).map_err(|e| format!("Falha ao ler o arquivo para upload: {}", e))?;

        let client = reqwest::blocking::Client::builder()
            .timeout(std::time::Duration::from_secs(300)) // 5 minutes timeout
            .build()
            .unwrap_or_default();

        let response = client
            .put(&upload_url)
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
    )
    .await?;

    let mut result = HashMap::new();
    result.insert("filePath".to_string(), serde_json::json!(temp_path_str));
    result.insert(
        "fileSize".to_string(),
        serde_json::json!(metadata.compressed_size_bytes),
    );
    result.insert(
        "fileName".to_string(),
        serde_json::json!(format!("{}.ludocard", metadata.game_id)),
    );
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

#[allow(clippy::too_many_arguments)]
#[tauri::command]
pub async fn export_temp_ludocard_backup(
    app: tauri::AppHandle,
    game_title: String,
    game_id: String,
    checkpoint_title: String,
    description: String,
    backup_path: String,
    backup_id: String,
    save_path: String,
) -> Result<HashMap<String, serde_json::Value>, String> {
    tokio::task::spawn_blocking(move || {
        let backup_folder = Path::new(&backup_path).join(&backup_id);
        if !backup_folder.exists() {
            return Err(format!(
                "O diretório do backup não foi encontrado: {}",
                backup_folder.display()
            ));
        }

        // Load mapping.yaml to get the drives mapping and files list
        let mapping_path = Path::new(&backup_path).join("mapping.yaml");
        if !mapping_path.exists() {
            return Err(format!(
                "O arquivo mapping.yaml não foi encontrado em: {}",
                mapping_path.display()
            ));
        }

        let mapping_file = StrictPath::from(mapping_path.as_path());
        let mapping = ludusavi::scan::layout::IndividualMapping::load(&mapping_file)
            .map_err(|e| format!("Falha ao carregar mapping.yaml: {}", e))?;

        // Find the specific backup version in the mapping
        let backup_version = mapping
            .backups
            .iter()
            .find(|b| b.name == backup_id)
            .ok_or_else(|| format!("Backup '{}' não encontrado no mapping.yaml", backup_id))?;

        // Create a temporary directory to assemble the files
        let temp_dir = std::env::temp_dir();
        let export_temp_dir = temp_dir.join(format!("ludocard_export_{}", uuid::Uuid::new_v4()));
        std::fs::create_dir_all(&export_temp_dir)
            .map_err(|e| format!("Falha ao criar diretório temporário de exportação: {}", e))?;

        // Resolve normalized live save path
        let live_save_dir = Path::new(&save_path);

        // Copy files from backup to the temporary directory with their correct relative paths
        for file_key in backup_version.files.keys() {
            let src_file_path = backup_folder.join(file_key);
            if !src_file_path.exists() {
                continue;
            }

            // Reconstruct absolute path
            // file_key is like "drive-C/Users/..." or "drive-0/..."
            let file_key_normalized = file_key.replace('\\', "/");
            let parts: Vec<&str> = file_key_normalized.split('/').collect();
            if parts.is_empty() {
                continue;
            }
            let drive_key = parts[0];
            let relative_to_drive = parts[1..].join("/");

            let drive_letter = mapping.drives.get(drive_key).map(|s| s.as_str()).unwrap_or(""); // e.g. "C:" or ""

            let original_abs_path_str = if drive_letter.is_empty() {
                // Unix root
                format!("/{}", relative_to_drive)
            } else {
                // Windows path, e.g. "C:/Users/..."
                format!("{}/{}", drive_letter, relative_to_drive)
            };

            let original_abs_path = Path::new(&original_abs_path_str);

            // Compute relative path from live_save_dir
            let orig_str = original_abs_path_str.replace('\\', "/");
            let live_str = live_save_dir.to_string_lossy().to_string().replace('\\', "/");

            let is_match = orig_str.starts_with(&live_str)
                || (cfg!(target_os = "windows") && orig_str.to_lowercase().starts_with(&live_str.to_lowercase()));
            let relative_path_str = if is_match {
                let mut rel = &orig_str[live_str.len()..];
                if rel.starts_with('/') {
                    rel = &rel[1..];
                }
                rel.to_string()
            } else {
                original_abs_path
                    .file_name()
                    .map(|f| f.to_string_lossy().to_string())
                    .unwrap_or_else(|| "save_file".to_string())
            };

            let dest_file_path = export_temp_dir.join(&relative_path_str);
            if let Some(parent) = dest_file_path.parent() {
                let _ = std::fs::create_dir_all(parent);
            }

            std::fs::copy(&src_file_path, &dest_file_path)
                .map_err(|e| format!("Falha ao copiar arquivo de backup para pasta temporária: {}", e))?;
        }

        // Pack the temporary folder
        let temp_archive_path = temp_dir.join(format!("ludocard_upload_{}.ludocard", uuid::Uuid::new_v4()));
        let temp_archive_path_str = temp_archive_path.to_string_lossy().to_string();

        let metadata_res = export_ludocard_save_internal(
            &app,
            &game_title,
            &game_id,
            &checkpoint_title,
            &description,
            export_temp_dir.to_string_lossy().as_ref(),
            &temp_archive_path_str,
        );

        // Always clean up the temporary files directory
        let _ = std::fs::remove_dir_all(&export_temp_dir);

        let metadata = metadata_res.map_err(|e| format!("Falha ao empacotar save do backup: {}", e))?;

        let mut result = HashMap::new();
        result.insert("filePath".to_string(), serde_json::json!(temp_archive_path_str));
        result.insert(
            "fileSize".to_string(),
            serde_json::json!(metadata.compressed_size_bytes),
        );
        result.insert(
            "fileName".to_string(),
            serde_json::json!(format!("{}.ludocard", metadata.game_id)),
        );
        Ok(result)
    })
    .await
    .map_err(|e| e.to_string())?
}

#[allow(clippy::too_many_arguments)]
#[tauri::command]
pub async fn export_ludocard_backup(
    app: tauri::AppHandle,
    game_title: String,
    game_id: String,
    checkpoint_title: String,
    description: String,
    backup_path: String,
    backup_id: String,
    save_path: String,
    dest_path: String,
) -> Result<LudocardMetadata, String> {
    tokio::task::spawn_blocking(move || {
        let backup_folder = Path::new(&backup_path).join(&backup_id);
        if !backup_folder.exists() {
            return Err(format!(
                "O diretório do backup não foi encontrado: {}",
                backup_folder.display()
            ));
        }

        // Load mapping.yaml to get the drives mapping and files list
        let mapping_path = Path::new(&backup_path).join("mapping.yaml");
        if !mapping_path.exists() {
            return Err(format!(
                "O arquivo mapping.yaml não foi encontrado em: {}",
                mapping_path.display()
            ));
        }

        let mapping_file = StrictPath::from(mapping_path.as_path());
        let mapping = ludusavi::scan::layout::IndividualMapping::load(&mapping_file)
            .map_err(|e| format!("Falha ao carregar mapping.yaml: {}", e))?;

        // Find the specific backup version in the mapping
        let backup_version = mapping
            .backups
            .iter()
            .find(|b| b.name == backup_id)
            .ok_or_else(|| format!("Backup '{}' não encontrado no mapping.yaml", backup_id))?;

        // Create a temporary directory to assemble the files
        let temp_dir = std::env::temp_dir();
        let export_temp_dir = temp_dir.join(format!("ludocard_export_{}", uuid::Uuid::new_v4()));
        std::fs::create_dir_all(&export_temp_dir)
            .map_err(|e| format!("Falha ao criar diretório temporário de exportação: {}", e))?;

        // Resolve normalized live save path
        let live_save_dir = Path::new(&save_path);

        // Copy files from backup to the temporary directory with their correct relative paths
        for file_key in backup_version.files.keys() {
            let src_file_path = backup_folder.join(file_key);
            if !src_file_path.exists() {
                continue;
            }

            // Reconstruct absolute path
            let file_key_normalized = file_key.replace('\\', "/");
            let parts: Vec<&str> = file_key_normalized.split('/').collect();
            if parts.is_empty() {
                continue;
            }
            let drive_key = parts[0];
            let relative_to_drive = parts[1..].join("/");

            let drive_letter = mapping.drives.get(drive_key).map(|s| s.as_str()).unwrap_or("");

            let original_abs_path_str = if drive_letter.is_empty() {
                format!("/{}", relative_to_drive)
            } else {
                format!("{}/{}", drive_letter, relative_to_drive)
            };

            let original_abs_path = Path::new(&original_abs_path_str);

            // Compute relative path from live_save_dir
            let orig_str = original_abs_path_str.replace('\\', "/");
            let live_str = live_save_dir.to_string_lossy().to_string().replace('\\', "/");

            let is_match = orig_str.starts_with(&live_str)
                || (cfg!(target_os = "windows") && orig_str.to_lowercase().starts_with(&live_str.to_lowercase()));
            let relative_path_str = if is_match {
                let mut rel = &orig_str[live_str.len()..];
                if rel.starts_with('/') {
                    rel = &rel[1..];
                }
                rel.to_string()
            } else {
                original_abs_path
                    .file_name()
                    .map(|f| f.to_string_lossy().to_string())
                    .unwrap_or_else(|| "save_file".to_string())
            };

            let dest_file_path = export_temp_dir.join(&relative_path_str);
            if let Some(parent) = dest_file_path.parent() {
                let _ = std::fs::create_dir_all(parent);
            }

            std::fs::copy(&src_file_path, &dest_file_path)
                .map_err(|e| format!("Falha ao copiar arquivo de backup para pasta temporária: {}", e))?;
        }

        // Pack the temporary folder directly to dest_path
        let metadata_res = export_ludocard_save_internal(
            &app,
            &game_title,
            &game_id,
            &checkpoint_title,
            &description,
            export_temp_dir.to_string_lossy().as_ref(),
            &dest_path,
        );

        // Always clean up the temporary files directory
        let _ = std::fs::remove_dir_all(&export_temp_dir);

        metadata_res.map_err(|e| format!("Falha ao empacotar save do backup: {}", e))
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn save_backup_note(
    app: tauri::AppHandle,
    game_id: String,
    backup_id: String,
    note: String,
) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
        let config_path = app_data_dir.join("ludocard.json");
        let mut json: serde_json::Value = if let Ok(content) = std::fs::read_to_string(&config_path) {
            serde_json::from_str(&content).unwrap_or(serde_json::json!({}))
        } else {
            serde_json::json!({})
        };

        if !json["backup_notes"].is_object() {
            json["backup_notes"] = serde_json::json!({});
        }

        if !json["backup_notes"][&game_id].is_object() {
            json["backup_notes"][&game_id] = serde_json::json!({});
        }

        json["backup_notes"][&game_id][&backup_id] = serde_json::json!(note);

        let _ = std::fs::create_dir_all(&app_data_dir);
        std::fs::write(&config_path, serde_json::to_string_pretty(&json).unwrap_or_default())
            .map_err(|e| format!("Falha ao salvar nota do backup: {}", e))?;
        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn save_campaign_note(app: tauri::AppHandle, game_id: String, note: String) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
        let config_path = app_data_dir.join("ludocard.json");
        let mut json: serde_json::Value = if let Ok(content) = std::fs::read_to_string(&config_path) {
            serde_json::from_str(&content).unwrap_or(serde_json::json!({}))
        } else {
            serde_json::json!({})
        };

        if !json["campaign_notes"].is_object() {
            json["campaign_notes"] = serde_json::json!({});
        }

        json["campaign_notes"][&game_id] = serde_json::json!(note);

        let _ = std::fs::create_dir_all(&app_data_dir);
        std::fs::write(&config_path, serde_json::to_string_pretty(&json).unwrap_or_default())
            .map_err(|e| format!("Falha ao salvar notas da campanha: {}", e))?;
        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn open_url(url: String) -> Result<(), String> {
    tokio::task::spawn_blocking(move || opener::open(&url).map_err(|e| e.to_string()))
        .await
        .map_err(|e| e.to_string())?
}

#[derive(Serialize)]
pub struct SystemHardwareInfo {
    pub cpu: String,
    pub gpu: String,
    pub ram: String,
}

#[cfg(target_os = "windows")]
fn get_gpu_info() -> String {
    use winreg::RegKey;
    use winreg::enums::*;

    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
    let class_path = "SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}";
    if let Ok(class_key) = hklm.open_subkey(class_path) {
        let mut gpus = Vec::new();
        for name in class_key.enum_keys().filter_map(|r| r.ok()) {
            if let Ok(subkey) = class_key.open_subkey(&name)
                && let Ok(desc) = subkey.get_value::<String, _>("DriverDesc")
                    && !desc.contains("Microsoft Basic Display Adapter") && !desc.contains("Software Device") {
                        gpus.push(desc);
                    }
        }
        if !gpus.is_empty() {
            return gpus.join(", ");
        }
    }
    "Unknown GPU".to_string()
}

#[cfg(not(target_os = "windows"))]
fn get_gpu_info() -> String {
    "Unknown GPU".to_string()
}

#[tauri::command]
pub async fn get_system_hardware_info() -> Result<SystemHardwareInfo, String> {
    tokio::task::spawn_blocking(move || {
        let mut sys = sysinfo::System::new_all();
        sys.refresh_all();

        let cpu = if let Some(cpu) = sys.cpus().first() {
            cpu.brand().trim().to_string()
        } else {
            "Unknown CPU".to_string()
        };

        let total_memory_bytes = sys.total_memory();
        let total_memory_gb = (total_memory_bytes as f64 / 1024.0 / 1024.0 / 1024.0).round();
        let ram = format!("{} GB", total_memory_gb);

        let gpu = get_gpu_info();

        Ok(SystemHardwareInfo { cpu, gpu, ram })
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn detect_game_config_files(game_title: String) -> Result<Vec<String>, String> {
    tokio::task::spawn_blocking(move || {
        let mut api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;
        let scan_output = api
            .back_up(parameters::BackUp {
                games: vec![game_title.clone()],
                finality: Finality::Preview,
                resolve_cloud_conflict: None,
                wine_prefix: None,
                include_disabled: true,
                skip_downgrade: false,
            })
            .map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

        let mut config_files = Vec::new();
        if let Some(game_data) = scan_output.games.get(&game_title)
            && let ApiGame::Operative { files, .. } = game_data {
                for file_path in files.keys() {
                    let path = Path::new(file_path);
                    let ext = path.extension().and_then(|e| e.to_str()).unwrap_or("").to_lowercase();
                    let name = path.file_name().and_then(|n| n.to_str()).unwrap_or("").to_lowercase();

                    let is_config_ext = matches!(
                        ext.as_str(),
                        "ini"
                            | "cfg"
                            | "conf"
                            | "config"
                            | "settings"
                            | "json"
                            | "xml"
                            | "yaml"
                            | "yml"
                            | "prefs"
                            | "properties"
                            | "toml"
                            | "opt"
                            | "txt"
                    );

                    let is_config_name = name.contains("config")
                        || name.contains("settings")
                        || name.contains("prefs")
                        || name.contains("options")
                        || name.contains("user");

                    if is_config_ext || is_config_name {
                        config_files.push(file_path.clone());
                    }
                }
            }
        Ok(config_files)
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn create_preset_safety_backup(
    app: tauri::AppHandle,
    game_title: String,
    game_id: String,
) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
        let safety_dir = app_data_dir.join("preset_safety").join(&game_id);

        // Clean any old backup
        if safety_dir.exists() {
            let _ = std::fs::remove_dir_all(&safety_dir);
        }
        std::fs::create_dir_all(&safety_dir).map_err(|e| format!("Falha ao criar diretório de Seguro-Crash: {}", e))?;

        let mut api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;
        let scan_output = api
            .back_up(parameters::BackUp {
                games: vec![game_title.clone()],
                finality: Finality::Preview,
                resolve_cloud_conflict: None,
                wine_prefix: None,
                include_disabled: true,
                skip_downgrade: false,
            })
            .map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

        let mut config_files = Vec::new();
        if let Some(game_data) = scan_output.games.get(&game_title)
            && let ApiGame::Operative { files, .. } = game_data {
                for file_path in files.keys() {
                    let path = Path::new(file_path);
                    let ext = path.extension().and_then(|e| e.to_str()).unwrap_or("").to_lowercase();
                    let name = path.file_name().and_then(|n| n.to_str()).unwrap_or("").to_lowercase();

                    let is_config_ext = matches!(
                        ext.as_str(),
                        "ini"
                            | "cfg"
                            | "conf"
                            | "config"
                            | "settings"
                            | "json"
                            | "xml"
                            | "yaml"
                            | "yml"
                            | "prefs"
                            | "properties"
                            | "toml"
                            | "opt"
                            | "txt"
                    );

                    let is_config_name = name.contains("config")
                        || name.contains("settings")
                        || name.contains("prefs")
                        || name.contains("options")
                        || name.contains("user");

                    if is_config_ext || is_config_name {
                        config_files.push(file_path.clone());
                    }
                }
            }

        let mut manifest_mapping = HashMap::new();

        for (index, file_path_str) in config_files.iter().enumerate() {
            let file_path = Path::new(file_path_str);
            if file_path.exists() && file_path.is_file() {
                let backup_file_name = format!("file_{}", index);
                let dest_path = safety_dir.join(&backup_file_name);
                std::fs::copy(file_path, &dest_path)
                    .map_err(|e| format!("Falha ao copiar arquivo de configuração para Seguro-Crash: {}", e))?;
                manifest_mapping.insert(backup_file_name, file_path_str.clone());
            }
        }

        let manifest_path = safety_dir.join("manifest.json");
        let manifest_content = serde_json::to_string_pretty(&manifest_mapping)
            .map_err(|e| format!("Falha ao serializar manifesto do Seguro-Crash: {}", e))?;
        std::fs::write(&manifest_path, manifest_content)
            .map_err(|e| format!("Falha ao gravar manifesto do Seguro-Crash: {}", e))?;

        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn restore_preset_safety_backup(app: tauri::AppHandle, game_id: String) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
        let safety_dir = app_data_dir.join("preset_safety").join(&game_id);
        let manifest_path = safety_dir.join("manifest.json");

        if !manifest_path.exists() {
            return Err("Nenhum backup do Seguro-Crash encontrado para este jogo.".to_string());
        }

        let manifest_content = std::fs::read_to_string(&manifest_path)
            .map_err(|e| format!("Falha ao ler manifesto do Seguro-Crash: {}", e))?;
        let manifest_mapping: HashMap<String, String> = serde_json::from_str(&manifest_content)
            .map_err(|e| format!("Manifesto do Seguro-Crash corrompido: {}", e))?;

        for (backup_file_name, original_path_str) in &manifest_mapping {
            let src_path = safety_dir.join(backup_file_name);
            let dest_path = Path::new(original_path_str);

            if src_path.exists() {
                if let Some(parent) = dest_path.parent() {
                    let _ = std::fs::create_dir_all(parent);
                }
                std::fs::copy(&src_path, dest_path)
                    .map_err(|e| format!("Falha ao restaurar arquivo de configuração: {}", e))?;
            }
        }

        // Clean up safety backup after successful restore
        let _ = std::fs::remove_dir_all(&safety_dir);

        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn export_temp_ludocard_preset(
    app: tauri::AppHandle,
    game_title: String,
    game_id: String,
    preset_title: String,
    description: String,
    save_path: String,
    files: Vec<String>,
) -> Result<HashMap<String, serde_json::Value>, String> {
    tokio::task::spawn_blocking(move || {
        // Create a temporary directory to assemble the files
        let temp_dir = std::env::temp_dir();
        let export_temp_dir = temp_dir.join(format!("ludocard_preset_{}", uuid::Uuid::new_v4()));
        std::fs::create_dir_all(&export_temp_dir).map_err(|e| format!("Falha ao criar diretório temporário: {}", e))?;

        let live_save_path = Path::new(&save_path);
        let live_save_dir = if live_save_path.is_file() || live_save_path.extension().is_some() {
            live_save_path.parent().unwrap_or(live_save_path)
        } else {
            live_save_path
        };
        let live_str = live_save_dir.to_string_lossy().to_string().replace('\\', "/");
        let is_live_str_valid = !live_str.trim().is_empty();

        for file_path_str in &files {
            let file_path = Path::new(file_path_str);
            if !file_path.exists() {
                continue;
            }

            let orig_str = file_path_str.replace('\\', "/");
            let is_match = is_live_str_valid
                && (orig_str.starts_with(&live_str)
                    || (cfg!(target_os = "windows") && orig_str.to_lowercase().starts_with(&live_str.to_lowercase())));
            let relative_path_str = if is_match {
                let mut rel = &orig_str[live_str.len()..];
                if rel.starts_with('/') {
                    rel = &rel[1..];
                }
                rel.to_string()
            } else {
                file_path
                    .file_name()
                    .map(|f| f.to_string_lossy().to_string())
                    .unwrap_or_else(|| "config_file".to_string())
            };

            let dest_file_path = export_temp_dir.join(&relative_path_str);
            if let Some(parent) = dest_file_path.parent() {
                let _ = std::fs::create_dir_all(parent);
            }

            std::fs::copy(file_path, &dest_file_path)
                .map_err(|e| format!("Falha ao copiar arquivo para pasta temporária: {}", e))?;
        }

        // Pack the temporary folder
        let temp_archive_path = temp_dir.join(format!("ludocard_upload_{}.ludocard", uuid::Uuid::new_v4()));
        let temp_archive_path_str = temp_archive_path.to_string_lossy().to_string();

        let metadata_res = export_ludocard_save_internal(
            &app,
            &game_title,
            &game_id,
            &preset_title,
            &description,
            export_temp_dir.to_string_lossy().as_ref(),
            &temp_archive_path_str,
        );

        // Always clean up the temporary files directory
        let _ = std::fs::remove_dir_all(&export_temp_dir);

        let metadata = metadata_res.map_err(|e| format!("Falha ao empacotar preset: {}", e))?;

        let mut result = HashMap::new();
        result.insert("filePath".to_string(), serde_json::json!(temp_archive_path_str));
        result.insert(
            "fileSize".to_string(),
            serde_json::json!(metadata.compressed_size_bytes),
        );
        result.insert(
            "fileName".to_string(),
            serde_json::json!(format!("{}_preset.ludocard", game_id)),
        );
        Ok(result)
    })
    .await
    .map_err(|e| e.to_string())?
}

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct LocalPreset {
    pub id: String,
    pub game_id: String,
    pub game_title: String,
    pub title: String,
    pub description: String,
    pub cpu: String,
    pub gpu: String,
    pub ram: String,
    pub created_at: String,
    pub files: Vec<String>,
}

#[tauri::command]
pub async fn save_local_preset(
    app: tauri::AppHandle,
    game_id: String,
    game_title: String,
    title: String,
    description: String,
    files: Vec<String>,
) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
        let preset_id = uuid::Uuid::new_v4().to_string();
        let preset_dir = app_data_dir.join("local_presets").join(&game_id).join(&preset_id);
        std::fs::create_dir_all(&preset_dir).map_err(|e| format!("Falha ao criar diretório do preset local: {}", e))?;

        // Auto-detect hardware
        let mut sys = sysinfo::System::new_all();
        sys.refresh_all();
        let cpu = sys.cpus().first().map(|c| c.brand().to_string()).unwrap_or_default();
        let ram_gb = sys.total_memory() / (1024 * 1024 * 1024);
        let ram = format!("{} GB", ram_gb);

        // GPU registry detection
        let mut gpu = String::new();
        #[cfg(target_os = "windows")]
        {
            use winreg::RegKey;
            use winreg::enums::*;
            let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
            if let Ok(class_key) =
                hklm.open_subkey("SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}")
            {
                for subkey_name in class_key.enum_keys().filter_map(|x| x.ok()) {
                    if let Ok(driver_key) = class_key.open_subkey(&subkey_name)
                        && let Ok(driver_desc) = driver_key.get_value::<String, _>("DriverDesc") {
                            gpu = driver_desc;
                            break;
                        }
                }
            }
        }

        let created_at = chrono::Utc::now().to_rfc3339();

        let mut manifest_mapping = HashMap::new();
        for (index, file_path_str) in files.iter().enumerate() {
            let file_path = Path::new(file_path_str);
            if file_path.exists() && file_path.is_file() {
                let backup_file_name = format!("file_{}", index);
                let dest_path = preset_dir.join(&backup_file_name);
                std::fs::copy(file_path, &dest_path)
                    .map_err(|e| format!("Falha ao copiar arquivo para preset local: {}", e))?;
                manifest_mapping.insert(backup_file_name, file_path_str.clone());
            }
        }

        let preset = LocalPreset {
            id: preset_id,
            game_id,
            game_title,
            title,
            description,
            cpu,
            gpu,
            ram,
            created_at,
            files: files.clone(),
        };

        let meta_path = preset_dir.join("manifest.json");
        let meta_content = serde_json::to_string_pretty(&preset)
            .map_err(|e| format!("Falha ao serializar manifesto do preset: {}", e))?;
        std::fs::write(&meta_path, meta_content).map_err(|e| format!("Falha ao gravar manifesto do preset: {}", e))?;

        let mapping_path = preset_dir.join("mapping.json");
        let mapping_content = serde_json::to_string_pretty(&manifest_mapping)
            .map_err(|e| format!("Falha ao serializar mapeamento de arquivos: {}", e))?;
        std::fs::write(&mapping_path, mapping_content)
            .map_err(|e| format!("Falha ao gravar mapeamento de arquivos: {}", e))?;

        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn list_local_presets(app: tauri::AppHandle, game_id: String) -> Result<Vec<LocalPreset>, String> {
    tokio::task::spawn_blocking(move || {
        let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
        let game_presets_dir = app_data_dir.join("local_presets").join(&game_id);

        if !game_presets_dir.exists() {
            return Ok(Vec::new());
        }

        let mut list = Vec::new();
        if let Ok(entries) = std::fs::read_dir(game_presets_dir) {
            for entry in entries.flatten() {
                if entry.path().is_dir() {
                    let manifest_path = entry.path().join("manifest.json");
                    if manifest_path.exists()
                        && let Ok(content) = std::fs::read_to_string(manifest_path)
                            && let Ok(preset) = serde_json::from_str::<LocalPreset>(&content) {
                                list.push(preset);
                            }
                }
            }
        }

        list.sort_by(|a, b| b.created_at.cmp(&a.created_at));
        Ok(list)
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn delete_local_preset(app: tauri::AppHandle, game_id: String, preset_id: String) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
        let preset_dir = app_data_dir.join("local_presets").join(&game_id).join(&preset_id);
        if preset_dir.exists() {
            std::fs::remove_dir_all(&preset_dir)
                .map_err(|e| format!("Falha ao remover diretório de preset local: {}", e))?;
        }
        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn apply_local_preset(
    app: tauri::AppHandle,
    game_title: String,
    game_id: String,
    preset_id: String,
) -> Result<(), String> {
    create_preset_safety_backup(app.clone(), game_title, game_id.clone()).await?;

    let (manifest_mapping, preset_dir) = tokio::task::spawn_blocking({
        let app = app.clone();
        let game_id = game_id.clone();
        move || -> Result<(HashMap<String, String>, PathBuf), String> {
            let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
            let preset_dir = app_data_dir.join("local_presets").join(&game_id).join(&preset_id);
            let mapping_path = preset_dir.join("mapping.json");

            if !mapping_path.exists() {
                return Err("Mapeamento do preset local não encontrado.".to_string());
            }

            let mapping_content = std::fs::read_to_string(&mapping_path)
                .map_err(|e| format!("Falha ao ler mapeamento do preset: {}", e))?;
            let manifest_mapping: HashMap<String, String> = serde_json::from_str(&mapping_content)
                .map_err(|e| format!("Mapeamento do preset corrompido: {}", e))?;
            Ok((manifest_mapping, preset_dir))
        }
    })
    .await
    .map_err(|e| e.to_string())??;

    tokio::task::spawn_blocking(move || {
        for (backup_file_name, original_path_str) in &manifest_mapping {
            let src_path = preset_dir.join(backup_file_name);
            let dest_path = Path::new(original_path_str);

            if src_path.exists() {
                if let Some(parent) = dest_path.parent() {
                    let _ = std::fs::create_dir_all(parent);
                }
                std::fs::copy(&src_path, dest_path)
                    .map_err(|e| format!("Falha ao aplicar arquivo de configuração: {}", e))?;
            }
        }
        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn export_local_preset_archive(
    app: tauri::AppHandle,
    game_id: String,
    preset_id: String,
    save_path: String,
) -> Result<HashMap<String, serde_json::Value>, String> {
    tokio::task::spawn_blocking(move || {
        let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
        let preset_dir = app_data_dir.join("local_presets").join(&game_id).join(&preset_id);
        let meta_path = preset_dir.join("manifest.json");
        let mapping_path = preset_dir.join("mapping.json");

        if !meta_path.exists() || !mapping_path.exists() {
            return Err("Preset local incompleto ou inválido.".to_string());
        }

        let meta_content =
            std::fs::read_to_string(&meta_path).map_err(|e| format!("Falha ao ler metadados do preset: {}", e))?;
        let preset: LocalPreset =
            serde_json::from_str(&meta_content).map_err(|e| format!("Metadados do preset corrompidos: {}", e))?;

        let mapping_content =
            std::fs::read_to_string(&mapping_path).map_err(|e| format!("Falha ao ler mapeamento do preset: {}", e))?;
        let manifest_mapping: HashMap<String, String> =
            serde_json::from_str(&mapping_content).map_err(|e| format!("Mapeamento do preset corrompido: {}", e))?;

        let temp_dir = std::env::temp_dir();
        let export_temp_dir = temp_dir.join(format!("ludocard_preset_{}", uuid::Uuid::new_v4()));
        std::fs::create_dir_all(&export_temp_dir).map_err(|e| format!("Falha ao criar diretório temporário: {}", e))?;

        let live_save_path = Path::new(&save_path);
        let live_save_dir = if live_save_path.is_file() || live_save_path.extension().is_some() {
            live_save_path.parent().unwrap_or(live_save_path)
        } else {
            live_save_path
        };
        let live_str = live_save_dir.to_string_lossy().to_string().replace('\\', "/");
        let is_live_str_valid = !live_str.trim().is_empty();

        for (backup_file_name, original_path_str) in &manifest_mapping {
            let src_path = preset_dir.join(backup_file_name);
            if !src_path.exists() {
                continue;
            }

            let orig_str = original_path_str.replace('\\', "/");
            let is_match = is_live_str_valid
                && (orig_str.starts_with(&live_str)
                    || (cfg!(target_os = "windows") && orig_str.to_lowercase().starts_with(&live_str.to_lowercase())));
            let relative_path_str = if is_match {
                let mut rel = &orig_str[live_str.len()..];
                if rel.starts_with('/') {
                    rel = &rel[1..];
                }
                rel.to_string()
            } else {
                let path = Path::new(original_path_str);
                path.file_name()
                    .map(|f| f.to_string_lossy().to_string())
                    .unwrap_or_else(|| "config_file".to_string())
            };

            let dest_file_path = export_temp_dir.join(&relative_path_str);
            if let Some(parent) = dest_file_path.parent() {
                let _ = std::fs::create_dir_all(parent);
            }

            std::fs::copy(&src_path, &dest_file_path)
                .map_err(|e| format!("Falha ao copiar arquivo para pasta temporária: {}", e))?;
        }

        let temp_archive_path = temp_dir.join(format!("ludocard_upload_{}.ludocard", uuid::Uuid::new_v4()));
        let temp_archive_path_str = temp_archive_path.to_string_lossy().to_string();

        let metadata_res = export_ludocard_save_internal(
            &app,
            &preset.game_title,
            &preset.game_id,
            &preset.title,
            &preset.description,
            export_temp_dir.to_string_lossy().as_ref(),
            &temp_archive_path_str,
        );

        let _ = std::fs::remove_dir_all(&export_temp_dir);

        let metadata = metadata_res.map_err(|e| format!("Falha ao empacotar preset local: {}", e))?;

        let mut result = HashMap::new();
        result.insert("filePath".to_string(), serde_json::json!(temp_archive_path_str));
        result.insert(
            "fileSize".to_string(),
            serde_json::json!(metadata.compressed_size_bytes),
        );
        result.insert(
            "fileName".to_string(),
            serde_json::json!(format!("{}_preset.ludocard", game_id)),
        );
        Ok(result)
    })
    .await
    .map_err(|e| e.to_string())?
}

pub fn load_emulators_setting(app_data_dir: &Path) -> Vec<String> {
    let config_path = app_data_dir.join("ludocard.json");
    if let Ok(content) = std::fs::read_to_string(&config_path)
        && let Ok(json) = serde_json::from_str::<serde_json::Value>(&content)
            && let Some(arr) = json.get("emulators").and_then(|v| v.as_array()) {
                return arr.iter().filter_map(|v| v.as_str().map(|s| s.to_string())).collect();
            }
    Vec::new()
}

pub fn save_emulators_setting(app_data_dir: &Path, emulators: &[String]) {
    let config_path = app_data_dir.join("ludocard.json");
    let mut json: serde_json::Value = if let Ok(content) = std::fs::read_to_string(&config_path) {
        serde_json::from_str(&content).unwrap_or(serde_json::json!({}))
    } else {
        serde_json::json!({})
    };
    json["emulators"] = serde_json::json!(emulators);
    let _ = std::fs::create_dir_all(app_data_dir);
    let _ = std::fs::write(&config_path, serde_json::to_string_pretty(&json).unwrap_or_default());
}

#[tauri::command]
pub async fn add_emulator(app: tauri::AppHandle, path: String) -> Result<usize, String> {
    tokio::task::spawn_blocking(move || {
        let app_data_dir = app.path().app_data_dir().map_err(|_| "Failed to get AppData dir".to_string())?;

        let path_buf = PathBuf::from(&path);
        if !path_buf.exists() {
            return Err("Caminho do emulador não existe.".to_string());
        }

        let emu_name = crate::emulator::identify_emulator(&path_buf)
            .ok_or_else(|| "Nenhum emulador compatível detectado nesta pasta (verifique se o executável do emulador está presente).".to_string())?;

        let mut emulators = load_emulators_setting(&app_data_dir);
        if emulators.contains(&path) {
            return Err("Este emulador já está adicionado.".to_string());
        }
        emulators.push(path.clone());
        save_emulators_setting(&app_data_dir, &emulators);

        // Run initial scan for this emulator
        let detected = crate::emulator::scan_emulator_saves(&emu_name, &path);
        let count = detected.len();
        if !detected.is_empty() {
            crate::emulator::register_emulator_saves(detected)?;
        }

        Ok(count)
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn remove_emulator(app: tauri::AppHandle, path: String) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        let app_data_dir = app
            .path()
            .app_data_dir()
            .map_err(|_| "Failed to get AppData dir".to_string())?;
        let mut emulators = load_emulators_setting(&app_data_dir);
        emulators.retain(|p| p != &path);
        save_emulators_setting(&app_data_dir, &emulators);
        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[derive(serde::Serialize)]
pub struct FrontendEmulator {
    pub path: String,
    pub name: String,
}

#[tauri::command]
pub async fn get_emulators(app: tauri::AppHandle) -> Result<Vec<FrontendEmulator>, String> {
    tokio::task::spawn_blocking(move || {
        let app_data_dir = app
            .path()
            .app_data_dir()
            .map_err(|_| "Failed to get AppData dir".to_string())?;
        let emulators = load_emulators_setting(&app_data_dir);

        let mut list = Vec::new();
        for path in emulators {
            let path_buf = PathBuf::from(&path);
            let name = crate::emulator::identify_emulator(&path_buf).unwrap_or_else(|| "Desconhecido".to_string());
            list.push(FrontendEmulator { path, name });
        }
        Ok(list)
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn get_translations() -> Result<std::collections::HashMap<String, String>, String> {
    tokio::task::spawn_blocking(move || Ok(ludusavi::lang::TRANSLATOR.get_translations()))
        .await
        .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn download_rclone(app: tauri::AppHandle) -> Result<String, String> {
    tokio::task::spawn_blocking(move || {
        let app_data_dir = app
            .path()
            .app_data_dir()
            .map_err(|_| "Failed to get AppData dir".to_string())?;
        let rclone_dir = app_data_dir.join("rclone");
        std::fs::create_dir_all(&rclone_dir).map_err(|e| format!("Failed to create rclone folder: {}", e))?;

        let url = if cfg!(target_os = "windows") {
            "https://downloads.rclone.org/v1.68.0/rclone-v1.68.0-windows-amd64.zip"
        } else if cfg!(target_os = "macos") {
            if cfg!(target_arch = "aarch64") {
                "https://downloads.rclone.org/v1.68.0/rclone-v1.68.0-osx-arm64.zip"
            } else {
                "https://downloads.rclone.org/v1.68.0/rclone-v1.68.0-osx-amd64.zip"
            }
        } else {
            "https://downloads.rclone.org/v1.68.0/rclone-v1.68.0-linux-amd64.zip"
        };

        // Download ZIP
        let response = reqwest::blocking::get(url).map_err(|e| format!("Download error: {}", e))?;
        let bytes = response.bytes().map_err(|e| format!("Failed to read bytes: {}", e))?;

        // Extract ZIP
        let cursor = std::io::Cursor::new(bytes.to_vec());
        let mut archive = zip::ZipArchive::new(cursor).map_err(|e| format!("Failed to parse zip: {}", e))?;

        let exe_name = if cfg!(target_os = "windows") {
            "rclone.exe"
        } else {
            "rclone"
        };
        let mut found_exe = false;
        let exe_path_buf = rclone_dir.join(exe_name);

        for i in 0..archive.len() {
            let mut file = archive
                .by_index(i)
                .map_err(|e| format!("Failed to read zip entry: {}", e))?;
            let name = file.name();
            if name.ends_with(exe_name) {
                let mut out_file = std::fs::File::create(&exe_path_buf)
                    .map_err(|e| format!("Failed to create rclone executable file: {}", e))?;
                std::io::copy(&mut file, &mut out_file)
                    .map_err(|e| format!("Failed to write rclone executable: {}", e))?;
                found_exe = true;
                break;
            }
        }

        if !found_exe {
            return Err("rclone executable not found inside downloaded archive".to_string());
        }

        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            let mut perms = std::fs::metadata(&exe_path_buf)
                .map_err(|e| e.to_string())?
                .permissions();
            perms.set_mode(0o755);
            std::fs::set_permissions(&exe_path_buf, perms).map_err(|e| e.to_string())?;
        }

        let exe_path_str = exe_path_buf.to_string_lossy().to_string();

        // Update settings in Ludusavi config
        let mut api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;
        api.config.apps.rclone.path = ludusavi::prelude::StrictPath::new(exe_path_str.clone());
        api.config.save();

        Ok(exe_path_str)
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn configure_cloud_remote(_app: tauri::AppHandle, provider: String, email: String) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        let mut api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

        if !api.config.apps.rclone.is_valid() {
            return Err("Executável do Rclone não configurado ou inválido nas Configurações.".to_string());
        }

        let remote_choice = match provider.as_str() {
            "Google Drive" => ludusavi::cloud::RemoteChoice::GoogleDrive,
            "OneDrive" => ludusavi::cloud::RemoteChoice::OneDrive,
            "Dropbox" => ludusavi::cloud::RemoteChoice::Dropbox,
            "WebDAV" => ludusavi::cloud::RemoteChoice::WebDav,
            "FTP" => ludusavi::cloud::RemoteChoice::Ftp,
            _ => return Err(format!("Provedor desconhecido: {}", provider)),
        };

        let remote = ludusavi::cloud::Remote::try_from(remote_choice)
            .map_err(|_| "Falha ao criar instância remota".to_string())?;

        let rclone = ludusavi::cloud::Rclone::new(api.config.apps.rclone.clone(), remote.clone());

        // This will block and trigger OAuth browser authorization
        rclone
            .configure_remote()
            .map_err(|e| format!("Falha ao configurar remoto no Rclone: {:?}", e))?;

        // Update config
        api.config.cloud.remote = Some(remote);
        let sanitized_email = email.replace(|c: char| !c.is_alphanumeric() && c != '@' && c != '.', "_");
        api.config.cloud.path = format!("ludocard-backup/{}", sanitized_email);
        api.config.cloud.synchronize = true;

        api.config.save();
        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn test_cloud_connection(app: tauri::AppHandle) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        let api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

        if !api.config.apps.rclone.is_valid() {
            return Err("Executável do Rclone não configurado ou inválido nas Configurações.".to_string());
        }

        let Some(remote) = api.config.cloud.remote.clone() else {
            return Err("Nenhum provedor de nuvem conectado. Vincule uma conta primeiro.".to_string());
        };

        let cloud_path = &api.config.cloud.path;
        if cloud_path.is_empty() {
            return Err("Caminho de nuvem vazio.".to_string());
        }

        let app_data_dir = app
            .path()
            .app_data_dir()
            .map_err(|_| "Failed to get AppData dir".to_string())?;
        let local_test_file = app_data_dir.join("ludocard_test.tmp");

        // 1. Create local test file
        std::fs::write(&local_test_file, "ludocard-cloud-sync-test-content")
            .map_err(|e| format!("Falha ao criar arquivo de teste local: {}", e))?;

        let remote_test_path = format!("{}:{}/ludocard_test.tmp", remote.id(), cloud_path.replace('\\', "/"));

        let run_rclone = |args: &[&str]| -> Result<(), String> {
            let mut command = std::process::Command::new(api.config.apps.rclone.path.raw());
            command.args(args);

            if !api.config.apps.rclone.arguments.is_empty()
                && let Some(parts) = shlex::split(&api.config.apps.rclone.arguments) {
                    command.args(parts);
                }

            #[cfg(target_os = "windows")]
            {
                use std::os::windows::process::CommandExt;
                command.creation_flags(0x08000000);
            }

            let output = command.output().map_err(|e| format!("Erro ao iniciar Rclone: {}", e))?;
            if !output.status.success() {
                let stderr = String::from_utf8_lossy(&output.stderr);
                return Err(format!("Erro no Rclone: {}", stderr));
            }
            Ok(())
        };

        // 2. Upload
        let upload_res = run_rclone(&["copyto", &local_test_file.to_string_lossy(), &remote_test_path]);
        if let Err(e) = upload_res {
            let _ = std::fs::remove_file(&local_test_file);
            return Err(format!("Falha no upload do arquivo de teste: {}", e));
        }

        let _ = std::fs::remove_file(&local_test_file);

        // 3. Download back to verify
        let local_downloaded_file = app_data_dir.join("ludocard_test_downloaded.tmp");
        let download_res = run_rclone(&["copyto", &remote_test_path, &local_downloaded_file.to_string_lossy()]);
        if let Err(e) = download_res {
            let _ = run_rclone(&["deletefile", &remote_test_path]);
            return Err(format!("Falha no download do arquivo de teste: {}", e));
        }

        let content = std::fs::read_to_string(&local_downloaded_file)
            .map_err(|e| format!("Falha ao ler arquivo baixado: {}", e))?;

        let _ = std::fs::remove_file(&local_downloaded_file);

        // 4. Delete remote
        let delete_res = run_rclone(&["deletefile", &remote_test_path]);
        if let Err(e) = delete_res {
            return Err(format!("Falha ao remover arquivo de teste remoto: {}", e));
        }

        if content != "ludocard-cloud-sync-test-content" {
            return Err("Conteúdo corrompido durante o teste.".to_string());
        }

        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConflictVersionInfo {
    pub date: String,
    pub size_formatted: String,
    pub is_newer: bool,
    pub is_older: bool,
    pub label: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CloudConflict {
    pub game_title: String,
    pub local: ConflictVersionInfo,
    pub remote: ConflictVersionInfo,
}

#[tauri::command]
pub async fn check_cloud_conflict(app: tauri::AppHandle, game_title: String) -> Result<Option<CloudConflict>, String> {
    tokio::task::spawn_blocking(move || {
        let api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

        // 1. Check if cloud sync is enabled
        if !api.config.cloud.synchronize {
            return Ok(None);
        }

        // 2. Validate cloud config and get remote
        let remote = match ludusavi::cloud::validate_cloud_config(&api.config, &api.config.cloud.path) {
            Ok(r) => r,
            Err(_) => return Ok(None),
        };

        let game_dir = api
            .layout
            .game_folder(&game_title)
            .leaf()
            .unwrap_or_else(|| game_title.clone());
        let app_data_dir = app
            .path()
            .app_data_dir()
            .map_err(|_| "Failed to get AppData dir".to_string())?;

        // 3. Try to load local mapping.yaml
        let local_mapping_path = api.layout.game_folder(&game_title).joined("mapping.yaml");
        let local_mapping = if local_mapping_path.exists() {
            ludusavi::scan::layout::IndividualMapping::load(&local_mapping_path).ok()
        } else {
            None
        };

        // 4. Download remote mapping.yaml
        let temp_dir = app_data_dir.join("temp");
        let _ = std::fs::create_dir_all(&temp_dir);
        let temp_file = temp_dir.join(format!("remote_mapping_{}.yaml", uuid::Uuid::new_v4()));

        let remote_mapping_path_str = format!("{}/{}/mapping.yaml", api.config.cloud.path, game_dir);
        let remote_path_full = format!("{}:{}", remote.id(), remote_mapping_path_str.replace('\\', "/"));

        let run_rclone = |args: &[&str]| -> Result<(), String> {
            let mut command = std::process::Command::new(api.config.apps.rclone.path.raw());
            command.args(args);

            if !api.config.apps.rclone.arguments.is_empty()
                && let Some(parts) = shlex::split(&api.config.apps.rclone.arguments) {
                    command.args(parts);
                }

            #[cfg(target_os = "windows")]
            {
                use std::os::windows::process::CommandExt;
                command.creation_flags(0x08000000);
            }

            let output = command.output().map_err(|e| format!("Erro ao iniciar Rclone: {}", e))?;
            if !output.status.success() {
                let stderr = String::from_utf8_lossy(&output.stderr);
                return Err(format!("Erro no Rclone: {}", stderr));
            }
            Ok(())
        };

        // Copy remote mapping to temp file
        let remote_mapping = if run_rclone(&["copyto", &remote_path_full, &temp_file.to_string_lossy()]).is_ok() {
            let mapping_content = std::fs::read_to_string(&temp_file).ok();
            let _ = std::fs::remove_file(&temp_file);
            mapping_content.and_then(|c| ludusavi::scan::layout::IndividualMapping::load_from_string(&c).ok())
        } else {
            None
        };

        // 5. Compare latest backups
        let latest_local = local_mapping.as_ref().and_then(|m| m.backups.back());
        let latest_remote = remote_mapping.as_ref().and_then(|m| m.backups.back());

        if let (Some(local), Some(remote)) = (latest_local, latest_remote) {
            // Check if timestamps are different (by more than 2 seconds)
            let diff_seconds = (local.when.timestamp() - remote.when.timestamp()).abs();
            if diff_seconds > 2 {
                let local_bytes: u64 = local.files.values().map(|f| f.size).sum();
                let remote_bytes: u64 = remote.files.values().map(|f| f.size).sum();

                let is_local_newer = local.when > remote.when;

                let format_size = |bytes: u64| {
                    if bytes < 1024 * 1024 {
                        format!("{:.2} KB", bytes as f64 / 1024.0)
                    } else {
                        format!("{:.2} MB", bytes as f64 / (1024.0 * 1024.0))
                    }
                };

                let local_local_time = local.when.with_timezone(&chrono::Local);
                let remote_local_time = remote.when.with_timezone(&chrono::Local);

                return Ok(Some(CloudConflict {
                    game_title,
                    local: ConflictVersionInfo {
                        date: local_local_time.format("%d %b %Y, %H:%M:%S").to_string(),
                        size_formatted: format_size(local_bytes),
                        is_newer: is_local_newer,
                        is_older: !is_local_newer,
                        label: "Este PC".to_string(),
                    },
                    remote: ConflictVersionInfo {
                        date: remote_local_time.format("%d %b %Y, %H:%M:%S").to_string(),
                        size_formatted: format_size(remote_bytes),
                        is_newer: !is_local_newer,
                        is_older: is_local_newer,
                        label: "Nuvem".to_string(),
                    },
                }));
            }
        }

        Ok(None)
    })
    .await
    .map_err(|e| e.to_string())?
}

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SaveProfile {
    pub id: String,
    pub game_id: String,
    pub title: String,
    pub description: String,
    pub created_at: String,
    pub active: bool,
}

async fn save_profile_state_internal(
    app: &tauri::AppHandle,
    game_title: &str,
    game_id: &str,
    profile_id: &str,
) -> Result<(), String> {
    let (profile_dir, mapping) = tokio::task::spawn_blocking({
        let app = app.clone();
        let game_id = game_id.to_string();
        let profile_id = profile_id.to_string();
        move || -> Result<(PathBuf, HashMap<String, String>), String> {
            let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
            let profile_dir = app_data_dir.join("save_profiles").join(&game_id).join(&profile_id);
            std::fs::create_dir_all(&profile_dir)
                .map_err(|e| format!("Falha ao criar diretório do perfil de save: {}", e))?;

            let mapping_path = profile_dir.join("mapping.json");
            let mapping = if mapping_path.exists() {
                let content = std::fs::read_to_string(&mapping_path)
                    .map_err(|e| format!("Falha ao ler mapeamento do perfil: {}", e))?;
                serde_json::from_str(&content).map_err(|e| format!("Mapeamento do perfil corrompido: {}", e))?
            } else {
                HashMap::new()
            };
            Ok((profile_dir, mapping))
        }
    })
    .await
    .map_err(|e| e.to_string())??;

    let scan_output = tokio::task::spawn_blocking({
        let game_title = game_title.to_string();
        move || -> Result<_, String> {
            let mut api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;
            let scan_output = api
                .back_up(parameters::BackUp {
                    games: vec![game_title],
                    finality: Finality::Preview,
                    resolve_cloud_conflict: None,
                    wine_prefix: None,
                    include_disabled: true,
                    skip_downgrade: false,
                })
                .map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;
            Ok(scan_output)
        }
    })
    .await
    .map_err(|e| e.to_string())??;

    let _updated_mapping = tokio::task::spawn_blocking({
        let game_title = game_title.to_string();
        move || -> Result<HashMap<String, String>, String> {
            let mut new_mapping = HashMap::new();
            if let Some(game_data) = scan_output.games.get(&game_title)
                && let ApiGame::Operative { files, .. } = game_data {
                    // Copy files and build new mapping
                    for (index, file_path_str) in files.keys().enumerate() {
                        let file_path = Path::new(file_path_str);
                        if file_path.exists() && file_path.is_file() {
                            let backup_file_name = format!("file_{}", index);
                            let dest_path = profile_dir.join(&backup_file_name);
                            std::fs::copy(file_path, &dest_path)
                                .map_err(|e| format!("Falha ao copiar arquivo de save para o perfil: {}", e))?;
                            new_mapping.insert(backup_file_name, file_path_str.clone());
                        }
                    }
                }

            // Clean up files in profile dir that are no longer in new mapping
            for key in mapping.keys() {
                if !new_mapping.contains_key(key) {
                    let old_file_path = profile_dir.join(key);
                    if old_file_path.exists() {
                        let _ = std::fs::remove_file(old_file_path);
                    }
                }
            }

            // Write mapping.json
            let mapping_path = profile_dir.join("mapping.json");
            let mapping_content = serde_json::to_string_pretty(&new_mapping)
                .map_err(|e| format!("Falha ao serializar mapeamento de arquivos do perfil: {}", e))?;
            std::fs::write(mapping_path, mapping_content)
                .map_err(|e| format!("Falha ao gravar mapeamento de arquivos do perfil: {}", e))?;

            Ok(new_mapping)
        }
    })
    .await
    .map_err(|e| e.to_string())??;

    Ok(())
}

#[tauri::command]
pub async fn list_save_profiles(app: tauri::AppHandle, game_id: String) -> Result<Vec<SaveProfile>, String> {
    tokio::task::spawn_blocking(move || {
        let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
        let game_profiles_dir = app_data_dir.join("save_profiles").join(&game_id);

        if !game_profiles_dir.exists() {
            return Ok(Vec::new());
        }

        let mut list = Vec::new();
        if let Ok(entries) = std::fs::read_dir(game_profiles_dir) {
            for entry in entries.flatten() {
                if entry.path().is_dir() {
                    let manifest_path = entry.path().join("manifest.json");
                    if manifest_path.exists()
                        && let Ok(content) = std::fs::read_to_string(manifest_path)
                            && let Ok(profile) = serde_json::from_str::<SaveProfile>(&content) {
                                list.push(profile);
                            }
                }
            }
        }

        list.sort_by(|a, b| b.created_at.cmp(&a.created_at));
        Ok(list)
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn create_save_profile(
    app: tauri::AppHandle,
    game_title: String,
    game_id: String,
    title: String,
    description: String,
    clone_current: bool,
) -> Result<(), String> {
    // Check if there are any existing profiles. If not, create a default profile first.
    let existing_profiles = list_save_profiles(app.clone(), game_id.clone()).await?;

    if existing_profiles.is_empty() {
        let default_profile_id = uuid::Uuid::new_v4().to_string();
        let default_created_at = chrono::Utc::now().to_rfc3339();
        let default_profile = SaveProfile {
            id: default_profile_id.clone(),
            game_id: game_id.clone(),
            title: "Principal (Original)".to_string(),
            description: "Perfil padrão criado automaticamente com o progresso inicial do jogo.".to_string(),
            created_at: default_created_at,
            active: false,
        };

        tokio::task::spawn_blocking({
            let app = app.clone();
            let game_id = game_id.clone();
            let default_profile_id = default_profile_id.clone();
            let default_profile = default_profile.clone();
            move || -> Result<(), String> {
                let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
                let profile_dir = app_data_dir
                    .join("save_profiles")
                    .join(&game_id)
                    .join(&default_profile_id);
                std::fs::create_dir_all(&profile_dir)
                    .map_err(|e| format!("Falha ao criar diretório do perfil padrão: {}", e))?;

                let meta_path = profile_dir.join("manifest.json");
                let meta_content = serde_json::to_string_pretty(&default_profile)
                    .map_err(|e| format!("Falha ao serializar manifesto do perfil padrão: {}", e))?;
                std::fs::write(meta_path, meta_content)
                    .map_err(|e| format!("Falha ao gravar manifesto do perfil padrão: {}", e))?;

                Ok(())
            }
        })
        .await
        .map_err(|e| e.to_string())??;

        save_profile_state_internal(&app, &game_title, &game_id, &default_profile_id).await?;
    }

    // 1. If any active profile exists, save its current state first
    let active_profile = tokio::task::spawn_blocking({
        let app = app.clone();
        let game_id = game_id.clone();
        move || -> Result<Option<String>, String> {
            let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
            let game_profiles_dir = app_data_dir.join("save_profiles").join(&game_id);
            if !game_profiles_dir.exists() {
                return Ok(None);
            }
            if let Ok(entries) = std::fs::read_dir(game_profiles_dir) {
                for entry in entries.flatten() {
                    if entry.path().is_dir() {
                        let manifest_path = entry.path().join("manifest.json");
                        if manifest_path.exists()
                            && let Ok(content) = std::fs::read_to_string(&manifest_path)
                                && let Ok(profile) = serde_json::from_str::<SaveProfile>(&content)
                                    && profile.active {
                                        return Ok(Some(profile.id));
                                    }
                    }
                }
            }
            Ok(None)
        }
    })
    .await
    .map_err(|e| e.to_string())??;

    if let Some(active_id) = active_profile {
        save_profile_state_internal(&app, &game_title, &game_id, &active_id).await?;
    }

    // 2. Create the new profile
    let profile_id = uuid::Uuid::new_v4().to_string();
    let created_at = chrono::Utc::now().to_rfc3339();
    let profile = SaveProfile {
        id: profile_id.clone(),
        game_id: game_id.clone(),
        title,
        description,
        created_at,
        active: true, // New profile starts as active
    };

    // Save profile metadata
    tokio::task::spawn_blocking({
        let app = app.clone();
        let game_id = game_id.clone();
        let profile_id = profile_id.clone();
        let profile = profile.clone();
        move || -> Result<(), String> {
            let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
            let profile_dir = app_data_dir.join("save_profiles").join(&game_id).join(&profile_id);
            std::fs::create_dir_all(&profile_dir).map_err(|e| format!("Falha ao criar diretório do perfil: {}", e))?;

            let meta_path = profile_dir.join("manifest.json");
            let meta_content = serde_json::to_string_pretty(&profile)
                .map_err(|e| format!("Falha ao serializar manifesto do perfil: {}", e))?;
            std::fs::write(meta_path, meta_content)
                .map_err(|e| format!("Falha ao gravar manifesto do perfil: {}", e))?;

            Ok(())
        }
    })
    .await
    .map_err(|e| e.to_string())??;

    // 3. Mark all OTHER profiles as inactive
    tokio::task::spawn_blocking({
        let app = app.clone();
        let game_id = game_id.clone();
        let profile_id = profile_id.clone();
        move || -> Result<(), String> {
            let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
            let game_profiles_dir = app_data_dir.join("save_profiles").join(&game_id);

            if let Ok(entries) = std::fs::read_dir(game_profiles_dir) {
                for entry in entries.flatten() {
                    if entry.path().is_dir() {
                        let manifest_path = entry.path().join("manifest.json");
                        if manifest_path.exists()
                            && let Ok(content) = std::fs::read_to_string(&manifest_path)
                                && let Ok(mut other_profile) = serde_json::from_str::<SaveProfile>(&content)
                                    && other_profile.id != profile_id && other_profile.active {
                                        other_profile.active = false;
                                        let updated_content =
                                            serde_json::to_string_pretty(&other_profile).map_err(|e| {
                                                format!("Falha ao serializar manifesto do perfil antigo: {}", e)
                                            })?;
                                        std::fs::write(&manifest_path, updated_content).map_err(|e| {
                                            format!("Falha ao gravar manifesto do perfil antigo: {}", e)
                                        })?;
                                    }
                    }
                }
            }
            Ok(())
        }
    })
    .await
    .map_err(|e| e.to_string())??;

    // 4. Fill/clone saves OR clear live saves
    if clone_current {
        // Save current live saves to this new profile
        save_profile_state_internal(&app, &game_title, &game_id, &profile_id).await?;
    } else {
        // Clear live saves on disk (since we want a clean/empty campaign under the new profile)
        tokio::task::spawn_blocking({
            let game_title = game_title.clone();
            move || -> Result<(), String> {
                let mut api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;
                let scan_output = api
                    .back_up(parameters::BackUp {
                        games: vec![game_title.clone()],
                        finality: Finality::Preview,
                        resolve_cloud_conflict: None,
                        wine_prefix: None,
                        include_disabled: true,
                        skip_downgrade: false,
                    })
                    .map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

                if let Some(game_data) = scan_output.games.get(&game_title)
                    && let ApiGame::Operative { files, .. } = game_data {
                        for file_path_str in files.keys() {
                            let path = Path::new(file_path_str);
                            if path.exists() && path.is_file() {
                                std::fs::remove_file(path)
                                    .map_err(|e| format!("Falha ao limpar arquivo de save anterior: {}", e))?;
                            }
                        }
                    }
                Ok(())
            }
        })
        .await
        .map_err(|e| e.to_string())??;

        // Create an empty mapping.json for the new empty profile
        tokio::task::spawn_blocking({
            let app = app.clone();
            let game_id = game_id.clone();
            let profile_id = profile_id.clone();
            move || -> Result<(), String> {
                let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
                let profile_dir = app_data_dir.join("save_profiles").join(&game_id).join(&profile_id);
                let mapping_path = profile_dir.join("mapping.json");
                let empty_mapping: HashMap<String, String> = HashMap::new();
                let mapping_content = serde_json::to_string_pretty(&empty_mapping).unwrap();
                std::fs::write(mapping_path, mapping_content)
                    .map_err(|e| format!("Falha ao gravar mapeamento vazio do perfil: {}", e))?;
                Ok(())
            }
        })
        .await
        .map_err(|e| e.to_string())??;
    }

    Ok(())
}

#[tauri::command]
pub async fn switch_save_profile(
    app: tauri::AppHandle,
    game_title: String,
    game_id: String,
    profile_id: String,
) -> Result<(), String> {
    // 1. Find the currently active profile for this game (if any) and save current state to it
    let active_profile = tokio::task::spawn_blocking({
        let app = app.clone();
        let game_id = game_id.clone();
        move || -> Result<Option<String>, String> {
            let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
            let game_profiles_dir = app_data_dir.join("save_profiles").join(&game_id);
            if !game_profiles_dir.exists() {
                return Ok(None);
            }
            if let Ok(entries) = std::fs::read_dir(game_profiles_dir) {
                for entry in entries.flatten() {
                    if entry.path().is_dir() {
                        let manifest_path = entry.path().join("manifest.json");
                        if manifest_path.exists()
                            && let Ok(content) = std::fs::read_to_string(&manifest_path)
                                && let Ok(profile) = serde_json::from_str::<SaveProfile>(&content)
                                    && profile.active {
                                        return Ok(Some(profile.id));
                                    }
                    }
                }
            }
            Ok(None)
        }
    })
    .await
    .map_err(|e| e.to_string())??;

    if let Some(active_id) = active_profile {
        save_profile_state_internal(&app, &game_title, &game_id, &active_id).await?;
    }

    // 2. Clean the live files on disk by running a preview scan
    tokio::task::spawn_blocking({
        let game_title = game_title.clone();
        move || -> Result<(), String> {
            let mut api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;
            let scan_output = api
                .back_up(parameters::BackUp {
                    games: vec![game_title.clone()],
                    finality: Finality::Preview,
                    resolve_cloud_conflict: None,
                    wine_prefix: None,
                    include_disabled: true,
                    skip_downgrade: false,
                })
                .map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;

            if let Some(game_data) = scan_output.games.get(&game_title)
                && let ApiGame::Operative { files, .. } = game_data {
                    for file_path_str in files.keys() {
                        let path = Path::new(file_path_str);
                        if path.exists() && path.is_file() {
                            std::fs::remove_file(path)
                                .map_err(|e| format!("Não foi possível remover o arquivo de save anterior {}: {}. Verifique se o jogo está fechado.", file_path_str, e))?;
                        }
                    }
                }
            Ok(())
        }
    })
    .await
    .map_err(|e| e.to_string())??;

    // 3. Restore the newly selected profile files
    let mapping_and_dir = tokio::task::spawn_blocking({
        let app = app.clone();
        let game_id = game_id.clone();
        let profile_id = profile_id.clone();
        move || -> Result<(HashMap<String, String>, PathBuf), String> {
            let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
            let profile_dir = app_data_dir.join("save_profiles").join(&game_id).join(&profile_id);
            let mapping_path = profile_dir.join("mapping.json");

            if !mapping_path.exists() {
                return Ok((HashMap::new(), profile_dir));
            }

            let mapping_content = std::fs::read_to_string(&mapping_path)
                .map_err(|e| format!("Falha ao ler mapeamento do perfil: {}", e))?;
            let mapping: HashMap<String, String> = serde_json::from_str(&mapping_content)
                .map_err(|e| format!("Mapeamento do perfil corrompido: {}", e))?;
            Ok((mapping, profile_dir))
        }
    })
    .await
    .map_err(|e| e.to_string())??;

    let (mapping, profile_dir) = mapping_and_dir;

    tokio::task::spawn_blocking(move || -> Result<(), String> {
        for (backup_file_name, original_path_str) in &mapping {
            let src_path = profile_dir.join(backup_file_name);
            let dest_path = Path::new(original_path_str);

            if src_path.exists() {
                if let Some(parent) = dest_path.parent() {
                    let _ = std::fs::create_dir_all(parent);
                }
                std::fs::copy(&src_path, dest_path)
                    .map_err(|e| format!("Falha ao restaurar arquivo de save do perfil: {}", e))?;
            }
        }
        Ok(())
    })
    .await
    .map_err(|e| e.to_string())??;

    // 4. Update manifests: selected profile becomes active, others inactive
    tokio::task::spawn_blocking({
        let app = app.clone();
        let game_id = game_id.clone();
        let profile_id = profile_id.clone();
        move || -> Result<(), String> {
            let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
            let game_profiles_dir = app_data_dir.join("save_profiles").join(&game_id);

            if let Ok(entries) = std::fs::read_dir(game_profiles_dir) {
                for entry in entries.flatten() {
                    if entry.path().is_dir() {
                        let manifest_path = entry.path().join("manifest.json");
                        if manifest_path.exists()
                            && let Ok(content) = std::fs::read_to_string(&manifest_path)
                                && let Ok(mut profile) = serde_json::from_str::<SaveProfile>(&content) {
                                    let was_active = profile.active;
                                    profile.active = profile.id == profile_id;
                                    if was_active != profile.active {
                                        let updated_content = serde_json::to_string_pretty(&profile)
                                            .map_err(|e| format!("Falha ao serializar manifesto do perfil: {}", e))?;
                                        std::fs::write(&manifest_path, updated_content)
                                            .map_err(|e| format!("Falha ao gravar manifesto do perfil: {}", e))?;
                                    }
                                }
                    }
                }
            }
            Ok(())
        }
    })
    .await
    .map_err(|e| e.to_string())??;

    Ok(())
}

#[tauri::command]
pub async fn delete_save_profile(app: tauri::AppHandle, game_id: String, profile_id: String) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
        let profile_dir = app_data_dir.join("save_profiles").join(&game_id).join(&profile_id);

        // Safety check: is it active?
        let manifest_path = profile_dir.join("manifest.json");
        if manifest_path.exists()
            && let Ok(content) = std::fs::read_to_string(&manifest_path)
                && let Ok(profile) = serde_json::from_str::<SaveProfile>(&content)
                    && profile.active {
                        return Err(
                            "Não é possível excluir o perfil de save ativo. Alterne para outro perfil primeiro."
                                .to_string(),
                        );
                    }

        if profile_dir.exists() {
            std::fs::remove_dir_all(&profile_dir)
                .map_err(|e| format!("Falha ao remover diretório do perfil de save: {}", e))?;
        }
        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}
