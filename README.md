# 🎮 Luducard

### Download a save from any point in a game — or the graphics preset from someone with your exact GPU.

**Luducard** is a lightweight game save manager for PC with something no other save manager has: a community hub. Back up and restore your saves locally like usual, then share checkpoints and performance configs with everyone else — one click to upload, one click to install. Built in Rust for Windows, macOS, and Linux.

**[⬇️ Download on itch.io](https://richenbergdev.itch.io/luducard)** &nbsp;•&nbsp; [📦 GitHub Releases](https://github.com/richenberg/luducard/releases) &nbsp;•&nbsp; [💬 Discord](https://discord.gg/8K3TEBMyvK)

- 🌐 **Community saves** — grab a checkpoint from right before the final boss, a 100%-completion file, or a "skip the tutorial" save.
- 🎛️ **Community graphics presets** — apply an FPS config from someone running your hardware. Your original settings are backed up first, so a bad preset is one click away from undone.
- 🕹️ **Emulators included** — Yuzu, Ryujinx, Dolphin, PCSX2 and RetroArch saves are detected automatically and named like real games instead of folder IDs.
- 🤖 **Set it and forget it** — backs up the moment you close a game, quietly, from the system tray.

---

## 📥 How to Download and Install

You can get **Luducard** from **[itch.io](https://richenbergdev.itch.io/luducard)** (all platforms, name-your-own-price / free), or straight from GitHub:

1. Go to the [Releases](https://github.com/richenberg/luducard/releases) section on GitHub.
2. Under the latest stable version, scroll down to the **Assets** section at the bottom.
3. Download the correct file for your operating system:
   - **Windows Installer (`.msi`) [Recommended]**: The standard installer. Run it and you're done.
   - **Windows Portable (`_x64_portable.zip`)**: Extract anywhere — a folder, a USB drive — and run `Luducard.exe`. No installation needed. See the note below before using this one.
   - **macOS / Linux**: Download the appropriate package (`.dmg` or `.deb`/`.AppImage`).

### 🛡️ Is it safe?

Fair question — this app touches your save files, and the Windows build isn't code-signed yet (certificates are expensive for a free project). So here's everything you need to check for yourself:

- **[VirusTotal scan of `Luducard.exe`](https://www.virustotal.com/gui/file/56696da402c3aace496d4a6870ff621c35f4d1c3fcfb9d9c8e0a801f8a6cfeed)** — 1 of 66 engines flags it, and that one detection is `Suspicious.low.ml.score` from Trapmine: a machine-learning guess, not a matched signature. Unsigned Rust binaries that read process names and write to `AppData` set this off routinely. The other 65 engines, including Microsoft, BitDefender, ESET, Kaspersky and CrowdStrike, report it clean.
- **Windows Defender may delete the portable `.zip`**, reporting `Trojan:Script/Wacatac.B!ml`. This is a false positive and it is why the installer is the recommended download for now. The `!ml` suffix means the verdict came from a machine-learning model rather than a matched signature, and `Wacatac.B!ml` is Microsoft's most false-positive-prone generic detection — it regularly flags unsigned open-source software. The `.msi` and `.exe` installers, which contain the same application, are not flagged. It has been reported to Microsoft.
- **Windows SmartScreen may warn you** on first launch, because the build is not code-signed and has few downloads. Click *More info → Run anyway* if you're comfortable.
- **Backups are additive.** Restoring writes over your current save, and the app takes a backup of what it's replacing first — nothing is deleted without a copy kept.
- **The full source is in this repo.** Every release is built from the tagged commit, so you can read exactly what you're running.

---

## 🌟 Highlighted Features

### 🌐 Save Share Hub (Sharing Saves)
No more hunting through sketchy forums or manually emailing files to share progress. Luducard features an integrated sharing ecosystem:
- **One-Click Share**: Instantly package and upload your current save slot of any game directly to the public share hub.
- **Brutal Compression**: Built in Rust, the app uses modern compression algorithms (like `zstd` or `lzma`) to shrink large save folders down to minimal files before upload.
- **Ironclad Cloud Security**: For security, no cloud master keys are embedded inside the client app. Instead, it requests secure, short-lived **Presigned URLs** from a Supabase Edge Function to perform direct, encrypted uploads/downloads to Cloudflare R2 storage.
- **Community Checkpoint Repository**: Download and automatically install checkpoints uploaded by the community (e.g., *"Before the final boss"*, *"100% completion"*, *"Skip tutorial"*).
- **Capped & Clean**: Features auto-delete rules for inactive files (deletes saves after 90 days of no downloads), storage limits per user, and abuse prevention.

### 🎛️ Preset & Graphics Configuration Sharing
Tired of manually tweaking `.ini` and `.cfg` files to optimize your game's graphics or controls?
- **Crash-Safe "Seguro-Crash" Flow**: When you apply a community configuration preset, Luducard automatically takes a backup of your original settings. If the game crashes or has issues, you can restore your original files with one click.
- **Hardware-Attached Presets**: When sharing a preset, the app automatically fetches and attaches your system specs (CPU, GPU, and RAM) using Rust, helping other users find the perfect configuration for their hardware.
- **Potato Mode Presets**: Easily find and inject ultra-low configs designed to disable heavy shadows and maximize FPS for low-end or older computers.
- **Community Voting & Moderation**: Integrated upvote/downvote system (👍/👎) to measure performance gains, and a reporting system (🚨) that auto-hides presets with 3 or more reports for safety.

---

## 🛠️ Complete Feature List

### 🎮 Interface & Game Library
- **Beautiful and Simple Interface**: A modern, easy-to-navigate dashboard to organize and view all your games in one place.
- **Fast Backups & Restores**: Quickly save or restore your progress with a single click, without slowing down your computer.
- **Smart Game Finder**: Checks if games are actually installed on your computer (supporting Steam, Epic Games, GOG, and others) so it only shows games you actually have.
- **Easy Sorting**: Sort your list of games by the ones you played recently, by file size, or in alphabetical order.
- **Choose Where to Save**: Easily select whether to save your files locally on your computer or sync them to the cloud.

### 🤖 Automation & Background Actions
- **Automatic Backup on Close**: The app runs quietly in the background and automatically saves your progress the moment you close your game.
- **Minimize to Taskbar (Tray)**: Close the main window and let the app work quietly in the background near the clock, using almost zero computer memory.
- **Start with Windows**: Start the app automatically when you turn on your computer so you never forget to back up your saves.

### 🛡️ Advanced Save Protection
- **Lock Special Saves**: "Pin" or lock specific saves (like right before a major choice in an RPG) to make sure they are never automatically deleted.
- **Portable Mode (USB Friendly)**: Run the entire app and store all your backups directly on a USB drive or external hard drive so you can play on any computer.
- **Back Up Settings & Controls**: Go beyond save games and back up your game's graphic, volume, and button settings.
- **Multiple Save Profiles**: Create separate profiles for the same game (like one for mods, one for clean gameplay, or one for another family member) and swap between them instantly.
- **Save Comparison Assistant**: If your local saves and cloud saves don't match, a clear screen will show you which one is newer and let you choose which one to keep.

### 🕹️ Emulators Support
- **Emulator Support**: Automatically detects and manages save files from popular console emulators (like Switch, PlayStation, Wii, GBA, etc.).
- **Friendly Emulator Names**: Automatically renames complex emulator game folders into readable game titles (e.g., "[Yuzu] The Legend of Zelda" instead of code numbers).
- **Emulator Badges**: Colorful labels in your library that show you exactly which console or emulator each game belongs to.

### 💖 Extra Tools for Gamers
- **Panic Quick-Save Button**: Hit `Ctrl + Alt + S` at any moment to back up the game you're playing instantly, with a confirmation sound — no need to leave the game. The shortcut is configurable in Settings.
- **Game Notes**: Write quick notes directly on each game's card to keep track of your goals, builds, or where you left off in your adventure.
- **Automatic Game Cover Art**: Automatically downloads beautiful cover art for your games so your library looks organized and clean.
- **Support the Creator**: A simple screen where you can support the project's cloud server costs.
- **Admin Dashboard**: A secure, password-protected area for the developers to manage shared community files and monitor cloud storage.
- **Multiple Languages**: Fully translated into English, Portuguese, Spanish, Russian, and Simplified Chinese.

---

## 🚀 Running & Developing Locally

Luducard is built with [Tauri v2](https://tauri.app/), [React](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), and [Rust](https://www.rust-lang.org/).

### Prerequisites
- Node.js & npm / pnpm
- Rust compiler and toolchain

### Setup & Run
1. Install frontend dependencies:
   ```bash
   cd ui
   pnpm install
   ```
2. Run in development mode:
   ```bash
   # In the root directory:
   npm run tauri dev
   ```
3. Build standalone production binary (`Luducard.exe`):
   ```bash
   npm run tauri build
   ```

---

## 🙏 Credits

Luducard began as a fork of [**Ludusavi**](https://github.com/mtkennerly/ludusavi) by [mtkennerly](https://github.com/mtkennerly), whose save-detection engine and game manifest are the foundation everything here is built on. Huge thanks for releasing it as open source.

## ℹ️ Developer's Note & AI-Assisted Development

This project was started by a non-programmer who just wanted a better-looking save manager with more modern features. The application — Rust backend, Tauri integration, and React/Tailwind frontend — was built, refactored, and optimized with heavy use of AI assistants. Every release is tested manually before it ships, and the full source is here for you to read and audit.

## 📄 License
This project is open-source. For details on permissions and redistribution, see [LICENSE](./LICENSE).
