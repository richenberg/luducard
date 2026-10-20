//! The backup folder: choosing it on first launch, and changing it later.
//!
//! Changing the folder used to just swap the path in the config, which left every existing
//! backup behind in the old folder where the app no longer looked. Now the user is asked
//! whether to move them, and the move only removes the old copy after the new one is
//! verified.

use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};

use ludusavi::prelude::StrictPath;
use ludusavi::resource::{ResourceFile, SaveableResourceFile, config::Config};
use serde::Serialize;
use tauri::{Emitter, Manager};

/// Set while backups are being moved, so the watcher and the quick-save hotkey don't write
/// a new backup into either folder halfway through.
static BACKUPS_PAUSED: AtomicBool = AtomicBool::new(false);
static MOVE_CANCELLED: AtomicBool = AtomicBool::new(false);

/// Returned as the error when the user cancels a move, so the UI can tell it apart.
pub const MOVE_CANCELLED_ERROR: &str = "backup-folder-move-cancelled";

pub fn backups_paused() -> bool {
    BACKUPS_PAUSED.load(Ordering::SeqCst)
}

struct PauseBackups;

impl PauseBackups {
    fn start() -> Self {
        BACKUPS_PAUSED.store(true, Ordering::SeqCst);
        Self
    }
}

impl Drop for PauseBackups {
    fn drop(&mut self) {
        BACKUPS_PAUSED.store(false, Ordering::SeqCst);
    }
}

fn read_luducard_json(app_data_dir: &Path) -> serde_json::Value {
    std::fs::read_to_string(app_data_dir.join("luducard.json"))
        .ok()
        .and_then(|c| serde_json::from_str(&c).ok())
        .unwrap_or_else(|| serde_json::json!({}))
}

fn write_luducard_json(app_data_dir: &Path, json: &serde_json::Value) {
    let _ = std::fs::create_dir_all(app_data_dir);
    let _ = std::fs::write(
        app_data_dir.join("luducard.json"),
        serde_json::to_string_pretty(json).unwrap_or_default(),
    );
}

/// Flags a brand-new install so the UI asks where backups should go.
///
/// Must run at startup before anything loads the config, because loading creates it. Only
/// installs with neither our settings file nor a config get the flag: people updating keep
/// the folder they already have and are never asked.
pub fn mark_new_install(app_data_dir: &Path) {
    let has_settings = app_data_dir.join("luducard.json").exists();
    let has_config = Config::path().exists();

    if !has_settings && !has_config {
        let mut json = read_luducard_json(app_data_dir);
        json["backup_folder_pending"] = serde_json::json!(true);
        write_luducard_json(app_data_dir, &json);
    }
}

fn clear_pending(app_data_dir: &Path) {
    let mut json = read_luducard_json(app_data_dir);
    if let Some(obj) = json.as_object_mut() {
        obj.remove("backup_folder_pending");
    }
    write_luducard_json(app_data_dir, &json);
}

fn suggested_folder() -> PathBuf {
    if ludusavi::prelude::is_portable()
        && let Ok(mut exe) = std::env::current_exe()
    {
        exe.pop();
        return exe.join("backups");
    }

    dirs::document_dir()
        .or_else(dirs::home_dir)
        .unwrap_or_else(|| PathBuf::from("."))
        .join("Luducard Backups")
}

fn current_folder(config: &Config) -> Option<PathBuf> {
    config.backup.path.as_std_path_buf().ok()
}

/// Absolute form of a path that may not exist yet: the existing part is canonicalized and
/// the rest appended, so two spellings of the same folder compare equal.
fn absolute(path: &Path) -> PathBuf {
    if let Ok(canonical) = std::fs::canonicalize(path) {
        return canonical;
    }
    match (path.parent(), path.file_name()) {
        (Some(parent), Some(name)) if !parent.as_os_str().is_empty() => absolute(parent).join(name),
        _ => std::env::current_dir().map(|d| d.join(path)).unwrap_or_else(|_| path.to_path_buf()),
    }
}

fn same_path(a: &Path, b: &Path) -> bool {
    if cfg!(windows) {
        a.to_string_lossy().to_lowercase() == b.to_string_lossy().to_lowercase()
    } else {
        a == b
    }
}

fn is_inside(child: &Path, parent: &Path) -> bool {
    if cfg!(windows) {
        let child = PathBuf::from(child.to_string_lossy().to_lowercase());
        let parent = PathBuf::from(parent.to_string_lossy().to_lowercase());
        child != parent && child.starts_with(&parent)
    } else {
        child != parent && child.starts_with(parent)
    }
}

/// A folder holds Luducard backups when one of its game folders has a `mapping.yaml`.
fn contains_backups(folder: &Path) -> bool {
    let Ok(entries) = std::fs::read_dir(folder) else {
        return false;
    };
    entries
        .flatten()
        .any(|entry| entry.path().is_dir() && entry.path().join("mapping.yaml").is_file())
}

/// Whether a file can be created in the folder, or in its nearest existing parent when the
/// folder doesn't exist yet. Leaves nothing behind.
fn is_writable(folder: &Path) -> bool {
    let mut probe_dir = folder.to_path_buf();
    while !probe_dir.exists() {
        match probe_dir.parent() {
            Some(parent) => probe_dir = parent.to_path_buf(),
            None => return false,
        }
    }
    let probe = probe_dir.join(format!(".luducard-write-test-{}", uuid::Uuid::new_v4()));
    match std::fs::write(&probe, b"") {
        Ok(()) => {
            let _ = std::fs::remove_file(&probe);
            true
        }
        Err(_) => false,
    }
}

fn free_space(folder: &Path) -> Option<u64> {
    let disks = sysinfo::Disks::new_with_refreshed_list();
    disks
        .list()
        .iter()
        .filter(|disk| {
            let mount = disk.mount_point();
            if cfg!(windows) {
                folder
                    .to_string_lossy()
                    .trim_start_matches(r"\\?\")
                    .to_lowercase()
                    .starts_with(&mount.to_string_lossy().to_lowercase())
            } else {
                folder.starts_with(mount)
            }
        })
        .max_by_key(|disk| disk.mount_point().as_os_str().len())
        .map(|disk| disk.available_space())
}

struct FileToMove {
    relative: PathBuf,
    size: u64,
}

/// Every file of every game backup in the folder. Only game folders with a `mapping.yaml`
/// count, so anything else the user keeps alongside them is never moved or deleted.
fn list_files(folder: &Path) -> Vec<FileToMove> {
    let Ok(entries) = std::fs::read_dir(folder) else {
        return vec![];
    };
    entries
        .flatten()
        .map(|entry| entry.path())
        .filter(|game| game.is_dir() && game.join("mapping.yaml").is_file())
        .flat_map(|game| walkdir::WalkDir::new(game).into_iter().flatten())
        .filter(|entry| entry.file_type().is_file())
        .filter_map(|entry| {
            let relative = entry.path().strip_prefix(folder).ok()?.to_path_buf();
            let size = entry.metadata().map(|m| m.len()).unwrap_or(0);
            Some(FileToMove { relative, size })
        })
        .collect()
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BackupFolderSetup {
    pub pending: bool,
    pub suggested: String,
    pub current: String,
}

#[tauri::command]
pub async fn get_backup_folder_setup(app: tauri::AppHandle) -> Result<BackupFolderSetup, String> {
    tokio::task::spawn_blocking(move || {
        let pending = app
            .path()
            .app_data_dir()
            .map(|dir| read_luducard_json(&dir)["backup_folder_pending"].as_bool() == Some(true))
            .unwrap_or(false);
        let current = Config::load()
            .map(|c| c.backup.path.raw().to_string())
            .unwrap_or_default();

        Ok(BackupFolderSetup {
            pending,
            suggested: suggested_folder().to_string_lossy().to_string(),
            current,
        })
    })
    .await
    .map_err(|e| e.to_string())?
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BackupFolderCheck {
    /// The chosen folder is the current one.
    pub same: bool,
    /// One folder is inside the other, so moving would copy a folder into itself.
    pub nested: bool,
    pub writable: bool,
    /// The chosen folder already holds Luducard backups.
    pub has_backups: bool,
    /// The current folder holds backups, so there is something to move.
    pub current_has_backups: bool,
    pub required_bytes: u64,
    /// `None` when the drive could not be identified.
    pub free_bytes: Option<u64>,
}

fn check(target: &Path) -> Result<BackupFolderCheck, String> {
    let config = Config::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;
    let target = absolute(target);
    let current = current_folder(&config).map(|p| absolute(&p));

    let same = current.as_ref().is_some_and(|c| same_path(c, &target));
    let nested = current
        .as_ref()
        .is_some_and(|c| is_inside(&target, c) || is_inside(c, &target));
    let current_has_backups = current.as_ref().is_some_and(|c| contains_backups(c));
    let required_bytes = match (&current, current_has_backups) {
        (Some(c), true) => list_files(c).iter().map(|f| f.size).sum(),
        _ => 0,
    };

    Ok(BackupFolderCheck {
        same,
        nested,
        writable: is_writable(&target),
        has_backups: !same && contains_backups(&target),
        current_has_backups,
        required_bytes,
        free_bytes: free_space(&target),
    })
}

#[tauri::command]
pub async fn check_backup_folder(path: String) -> Result<BackupFolderCheck, String> {
    tokio::task::spawn_blocking(move || check(Path::new(&path)))
        .await
        .map_err(|e| e.to_string())?
}

fn apply_folder(app: &tauri::AppHandle, folder: &Path) -> Result<(), String> {
    let mut config = Config::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;
    config.backup.path = StrictPath::new(folder.to_string_lossy().to_string());
    config.save();

    if let Ok(dir) = app.path().app_data_dir() {
        clear_pending(&dir);
    }
    Ok(())
}

/// Points the app at a folder without moving anything: the first-launch choice, "don't
/// move", and "use the backups already there".
#[tauri::command]
pub async fn set_backup_folder(app: tauri::AppHandle, path: String) -> Result<(), String> {
    tokio::task::spawn_blocking(move || {
        let folder = PathBuf::from(&path);
        std::fs::create_dir_all(&folder).map_err(|e| format!("Could not create the backup folder: {}", e))?;
        apply_folder(&app, &folder)
    })
    .await
    .map_err(|e| e.to_string())?
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct MoveProgress {
    copied_files: usize,
    total_files: usize,
    copied_bytes: u64,
    total_bytes: u64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MoveResult {
    /// The old folder could not be fully removed; the backups are safe in the new one.
    pub old_folder_left: bool,
}

/// Removes what a failed or cancelled move copied, leaving the destination as it was.
fn undo_copy(target: &Path, created_target: bool, copied: &[PathBuf]) {
    if created_target {
        let _ = std::fs::remove_dir_all(target);
        return;
    }
    for file in copied {
        let _ = std::fs::remove_file(target.join(file));
    }
    remove_empty_dirs(target);
}

fn remove_empty_dirs(root: &Path) {
    for entry in walkdir::WalkDir::new(root)
        .contents_first(true)
        .min_depth(1)
        .into_iter()
        .flatten()
    {
        if entry.file_type().is_dir() {
            let _ = std::fs::remove_dir(entry.path());
        }
    }
}

fn move_backups(app: &tauri::AppHandle, target: &Path) -> Result<MoveResult, String> {
    let _pause = PauseBackups::start();
    MOVE_CANCELLED.store(false, Ordering::SeqCst);

    let checked = check(target)?;
    if checked.same {
        return Ok(MoveResult { old_folder_left: false });
    }
    if checked.nested {
        return Err("The new folder cannot be inside the current one, or contain it.".to_string());
    }
    if !checked.writable {
        return Err("Luducard cannot write to that folder.".to_string());
    }
    if checked.has_backups {
        return Err("That folder already contains Luducard backups.".to_string());
    }
    if let Some(free) = checked.free_bytes
        && free < checked.required_bytes
    {
        return Err("There is not enough free space on that drive.".to_string());
    }

    let config = Config::load().map_err(|e| ludusavi::lang::TRANSLATOR.handle_error(&e))?;
    let source = current_folder(&config).ok_or("The current backup folder is not set.")?;
    let chosen = target;
    let target = absolute(target);

    let files = list_files(&source);
    let total_files = files.len();
    let total_bytes: u64 = files.iter().map(|f| f.size).sum();

    let created_target = !target.exists();
    std::fs::create_dir_all(&target).map_err(|e| format!("Could not create the backup folder: {}", e))?;

    let mut copied: Vec<PathBuf> = Vec::with_capacity(total_files);
    let mut copied_bytes = 0u64;

    for file in &files {
        if MOVE_CANCELLED.load(Ordering::SeqCst) {
            undo_copy(&target, created_target, &copied);
            return Err(MOVE_CANCELLED_ERROR.to_string());
        }

        let from = source.join(&file.relative);
        let to = target.join(&file.relative);
        let result = to
            .parent()
            .map(std::fs::create_dir_all)
            .unwrap_or(Ok(()))
            .and_then(|_| std::fs::copy(&from, &to));

        if let Err(e) = result {
            undo_copy(&target, created_target, &copied);
            return Err(format!("Could not copy {}: {}", file.relative.display(), e));
        }

        copied.push(file.relative.clone());
        copied_bytes += file.size;
        let _ = app.emit(
            "backup-folder-move-progress",
            MoveProgress {
                copied_files: copied.len(),
                total_files,
                copied_bytes,
                total_bytes,
            },
        );
    }

    // Verify before the switch: every file is there with the size it had.
    for file in &files {
        let size = std::fs::metadata(target.join(&file.relative)).map(|m| m.len()).ok();
        if size != Some(file.size) {
            undo_copy(&target, created_target, &copied);
            return Err(format!("The copy of {} did not match the original.", file.relative.display()));
        }
    }

    // Saved as the user typed it: the canonical form carries a Windows long-path prefix.
    if let Err(e) = apply_folder(app, chosen) {
        undo_copy(&target, created_target, &copied);
        return Err(e);
    }

    // Only now is the old copy redundant.
    let mut old_folder_left = false;
    for file in &files {
        if std::fs::remove_file(source.join(&file.relative)).is_err() {
            old_folder_left = true;
        }
    }
    let games: std::collections::BTreeSet<PathBuf> = files
        .iter()
        .filter_map(|f| f.relative.components().next().map(|c| source.join(c)))
        .collect();
    for game in games {
        remove_empty_dirs(&game);
        if std::fs::remove_dir(&game).is_err() && game.exists() {
            old_folder_left = true;
        }
    }
    // The folder itself goes only if nothing else of the user's is in it.
    let _ = std::fs::remove_dir(&source);

    if old_folder_left {
        log::warn!("[BackupFolder] Moved, but could not fully remove {}", source.display());
    }
    Ok(MoveResult { old_folder_left })
}

#[tauri::command]
pub async fn move_backup_folder(app: tauri::AppHandle, path: String) -> Result<MoveResult, String> {
    tokio::task::spawn_blocking(move || move_backups(&app, Path::new(&path)))
        .await
        .map_err(|e| e.to_string())?
}

#[tauri::command]
pub fn cancel_backup_folder_move() {
    MOVE_CANCELLED.store(true, Ordering::SeqCst);
}
