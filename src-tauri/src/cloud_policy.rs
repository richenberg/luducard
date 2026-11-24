//! When backups go to the cloud, and what happens when the cloud has diverged.
//!
//! Two choices, kept in `luducard.json`:
//! - `cloud_upload_mode`: `"auto"` uploads every backup; `"manual"` uploads only when the
//!   user asks for a cloud backup.
//! - `cloud_conflict_mode`: `"ask"` stops and lets the user choose; `"newest"` keeps the
//!   most recent version without asking.

use std::path::Path;

use ludusavi::api::Ludusavi;
use ludusavi::prelude::{Finality, SyncDirection};

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct CloudPrefs {
    pub upload_automatically: bool,
    pub keep_newest_on_conflict: bool,
}

impl Default for CloudPrefs {
    fn default() -> Self {
        Self {
            upload_automatically: true,
            keep_newest_on_conflict: false,
        }
    }
}

impl CloudPrefs {
    pub fn load(app_data_dir: Option<&Path>) -> Self {
        let json: serde_json::Value = app_data_dir
            .and_then(|dir| std::fs::read_to_string(dir.join("luducard.json")).ok())
            .and_then(|c| serde_json::from_str(&c).ok())
            .unwrap_or_default();
        Self::from_json(&json)
    }

    fn from_json(json: &serde_json::Value) -> Self {
        let default = Self::default();
        Self {
            upload_automatically: json["cloud_upload_mode"]
                .as_str()
                .map_or(default.upload_automatically, |m| m != "manual"),
            keep_newest_on_conflict: json["cloud_conflict_mode"]
                .as_str()
                .map_or(default.keep_newest_on_conflict, |m| m == "newest"),
        }
    }
}

/// How an unattended backup dealt with the cloud.
#[derive(Debug, PartialEq, Eq)]
pub enum CloudOutcome {
    /// Uploaded, or the cloud is off for unattended backups.
    Normal,
    /// The cloud had diverged and the user wants to be asked, so the backup stayed local.
    ConflictSkipped,
}

/// A backup nobody is watching: the file watcher after a game closes, or the quick-save
/// hotkey. There is no screen to ask on, so a conflict in "ask" mode keeps the backup
/// local and the caller tells the user. In "newest" mode the save just backed up is the
/// most recent one by definition, so it is uploaded.
pub fn back_up_unattended(game_title: &str, app_data_dir: Option<&Path>, kind: &str) -> Result<CloudOutcome, String> {
    let mut api = Ludusavi::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;
    let prefs = CloudPrefs::load(app_data_dir);
    let mut outcome = CloudOutcome::Normal;

    if !prefs.upload_automatically {
        api.config.cloud.synchronize = false;
    } else if !prefs.keep_newest_on_conflict
        && let Some(dir) = app_data_dir
        && crate::commands::find_cloud_conflict(&api, dir, game_title).is_some()
    {
        api.config.cloud.synchronize = false;
        outcome = CloudOutcome::ConflictSkipped;
    }

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
        crate::commands::record_latest_backup_kind(&api, dir, game_title, kind);
    }

    Ok(outcome)
}

#[derive(serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CloudPrefsDto {
    pub upload_mode: String,
    pub conflict_mode: String,
}

#[tauri::command]
pub fn get_cloud_prefs(app: tauri::AppHandle) -> CloudPrefsDto {
    use tauri::Manager;
    let prefs = CloudPrefs::load(app.path().app_data_dir().ok().as_deref());
    CloudPrefsDto {
        upload_mode: if prefs.upload_automatically { "auto" } else { "manual" }.to_string(),
        conflict_mode: if prefs.keep_newest_on_conflict { "newest" } else { "ask" }.to_string(),
    }
}

#[tauri::command]
pub fn set_cloud_prefs(app: tauri::AppHandle, prefs: CloudPrefsDto) -> Result<(), String> {
    use tauri::Manager;
    if !matches!(prefs.upload_mode.as_str(), "auto" | "manual")
        || !matches!(prefs.conflict_mode.as_str(), "ask" | "newest")
    {
        return Err("Unknown cloud preference.".to_string());
    }
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let path = dir.join("luducard.json");
    let mut json: serde_json::Value = std::fs::read_to_string(&path)
        .ok()
        .and_then(|c| serde_json::from_str(&c).ok())
        .unwrap_or_else(|| serde_json::json!({}));
    json["cloud_upload_mode"] = serde_json::json!(prefs.upload_mode);
    json["cloud_conflict_mode"] = serde_json::json!(prefs.conflict_mode);
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    std::fs::write(&path, serde_json::to_string_pretty(&json).unwrap_or_default()).map_err(|e| e.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn defaults_when_unset() {
        assert_eq!(CloudPrefs::from_json(&serde_json::json!({})), CloudPrefs::default());
    }

    #[test]
    fn reads_both_choices() {
        let prefs = CloudPrefs::from_json(&serde_json::json!({
            "cloud_upload_mode": "manual",
            "cloud_conflict_mode": "newest",
        }));
        assert!(!prefs.upload_automatically);
        assert!(prefs.keep_newest_on_conflict);
    }
}
