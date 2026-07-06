# ðŸŽ® Luducard

**Luducard** is a lightweight, modern, and beautiful game save manager for PC. It began as a simple fork of **Ludosavi**, but it has evolved tremendously into a feature-rich, community-driven backup and share hub.

Join our community on [Discord](https://discord.gg/U2DEbDqgm)!

> â„¹ï¸ **Developer's Note & AI-Assisted Development**
> This project was created by a non-programmer who wanted a better visual, and add more modern features to the game save manager. The entire application, including its Rust backend, Tauri integrations, and React/Tailwind frontend, was built, refactored, and optimized using advanced Artificial Intelligence (such as Gemini). It stands as a testament to what AI collaboration can achieve!

---

## ðŸŒŸ Highlighted Features

### ðŸŒ Save Share Hub (Sharing Saves)
No more hunting through sketchy forums or manually emailing files to share progress. Luducard features an integrated sharing ecosystem:
- **One-Click Share**: Instantly package and upload your current save slot of any game directly to the public share hub.
- **Brutal Compression**: Built in Rust, the app uses modern compression algorithms (like `zstd` or `lzma`) to shrink large save folders down to minimal files before upload.
- **Ironclad Cloud Security**: For security, no cloud master keys are embedded inside the client app. Instead, it requests secure, short-lived **Presigned URLs** from a Supabase Edge Function to perform direct, encrypted uploads/downloads to Cloudflare R2 storage.
- **Community Checkpoint Repository**: Download and automatically install checkpoints uploaded by the community (e.g., *"Before the final boss"*, *"100% completion"*, *"Skip tutorial"*).
- **Capped & Clean**: Features auto-delete rules for inactive files (deletes saves after 90 days of no downloads), storage limits per user, and abuse prevention.

### ðŸŽ›ï¸ Preset & Graphics Configuration Sharing
Tired of manually tweaking `.ini` and `.cfg` files to optimize your game's graphics or controls?
- **Crash-Safe "Seguro-Crash" Flow**: When you apply a community configuration preset, Luducard automatically takes a backup of your original settings. If the game crashes or has issues, you can restore your original files with one click.
- **Hardware-Attached Presets**: When sharing a preset, the app automatically fetches and attaches your system specs (CPU, GPU, and RAM) using Rust, helping other users find the perfect configuration for their hardware.
- **Potato Mode Presets**: Easily find and inject ultra-low configs designed to disable heavy shadows and maximize FPS for low-end or older computers.
- **Community Voting & Moderation**: Integrated upvote/downvote system (ðŸ‘/ðŸ‘Ž) to measure performance gains, and a reporting system (ðŸš¨) that auto-hides presets with 3 or more reports for safety.

---

## ðŸ› ï¸ Complete Feature List

### ðŸŽ® Interface & Game Library
- **Beautiful and Simple Interface**: A modern, easy-to-navigate dashboard to organize and view all your games in one place.
- **Fast Backups & Restores**: Quickly save or restore your progress with a single click, without slowing down your computer.
- **Smart Game Finder**: Checks if games are actually installed on your computer (supporting Steam, Epic Games, GOG, and others) so it only shows games you actually have.
- **Easy Sorting**: Sort your list of games by the ones you played recently, by file size, or in alphabetical order.
- **Choose Where to Save**: Easily select whether to save your files locally on your computer or sync them to the cloud.

### ðŸ¤– Automation & Background Actions
- **Automatic Backup on Close**: The app runs quietly in the background and automatically saves your progress the moment you close your game.
- **Minimize to Taskbar (Tray)**: Close the main window and let the app work quietly in the background near the clock, using almost zero computer memory.
- **Start with Windows**: Start the app automatically when you turn on your computer so you never forget to back up your saves.

### ðŸ›¡ï¸ Advanced Save Protection
- **Lock Special Saves**: "Pin" or lock specific saves (like right before a major choice in an RPG) to make sure they are never automatically deleted.
- **Portable Mode (USB Friendly)**: Run the entire app and store all your backups directly on a USB drive or external hard drive so you can play on any computer.
- **Back Up Settings & Controls**: Go beyond save games and back up your game's graphic, volume, and button settings.
- **Multiple Save Profiles**: Create separate profiles for the same game (like one for mods, one for clean gameplay, or one for another family member) and swap between them instantly.
- **Save Comparison Assistant**: If your local saves and cloud saves don't match, a clear screen will show you which one is newer and let you choose which one to keep.

### ðŸ•¹ï¸ Emulators Support
- **Emulator Support**: Automatically detects and manages save files from popular console emulators (like Switch, PlayStation, Wii, GBA, etc.).
- **Friendly Emulator Names**: Automatically renames complex emulator game folders into readable game titles (e.g., "[Yuzu] The Legend of Zelda" instead of code numbers).
- **Emulator Badges**: Colorful labels in your library that show you exactly which console or emulator each game belongs to.

### ðŸ’– Extra Tools for Gamers
- **Panic Quick-Save Button**: Press a simple shortcut on your keyboard (like `Ctrl + Shift + S`) to instantly save your game status, complete with a quick notification sound.
- **Game Notes**: Write quick notes directly on each game's card to keep track of your goals, builds, or where you left off in your adventure.
- **Automatic Game Cover Art**: Automatically downloads beautiful cover art for your games so your library looks organized and clean.
- **Support the Creator**: A simple screen where you can support the project's cloud server costs.
- **Admin Dashboard**: A secure, password-protected area for the developers to manage shared community files and monitor cloud storage.
- **Multiple Languages**: Fully translated into English, Portuguese, Spanish, Russian, and Simplified Chinese.

---

## ðŸš€ Running & Developing Locally

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

## ðŸ“„ License
This project is open-source. For details on permissions and redistribution, see [LICENSE](./LICENSE).
