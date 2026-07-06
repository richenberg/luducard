# Changelog - Luducard

All notable changes to the **Luducard** project will be documented in this file.

This project is a new application based on the core of Ludosavi. The change history of Luducard starts with this release.

## [1.0.0] - 2026-07-01
### Added
- Fully redesigned UI developed in React + Tailwind CSS v4 + Vite.
- Desktop integration using Tauri v2 framework (Rust-based core).
- **Save Share Hub**: Cloud repository to compress, share, and auto-install game saves/checkpoints.
- **Settings & Graphic Presets**: System to share optimal graphics configurations with safety backups and automatic hardware spec attachment.
- **Active Game Detections**: Executable checks to verify game installations and prevent library clutter.
- **Background File Watcher**: Active background monitoring to backup saves instantly on game exit.
- **System Tray Integration**: Minimize application to the tray.
- **Global Emergency Shortcut**: Customize key shortcuts (like `Ctrl + Shift + S`) for manual quick-saving without switching tabs.
- **Emulator Support**: Auto-detect and group saves from major platforms (Yuzu, Ryujinx, Dolphin, etc.) using Title ID or ROM names.
- **Campaign Notes**: Quick note taking for each game card.
