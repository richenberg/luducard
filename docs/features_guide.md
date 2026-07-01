# 📖 Ludocard Feature Guide

This guide explains in detail what each of the features implemented in **Ludocard** does and how to use them. It is written in simple terms so that anyone can get the most out of the application.

---

## 🤖 1. Automation & Background Actions

### ⏱️ Real-Time Save Monitoring (File Watcher)
* **What it is:** Ludocard watches the game you are currently playing. As soon as you close the game, the app notices and automatically takes a silent backup of your progress without you having to open the program or click any buttons.
* **How to use:** This feature is enabled by default. Whenever you close a monitored game, you will see a Windows notification confirming that the automatic backup was successful. You can enable or disable this automatic monitoring in the **Settings** tab.

### 📥 Minimize to System Tray
* **What it is:** When you click the close button ("X") on the Ludocard window, the program does not close. Instead, it hides in the Windows system tray (near the clock). It keeps working silently to perform real-time backups with almost zero memory or CPU usage.
* **How to use:** Just close the window normally. To reopen Ludocard, double-click the gamepad icon near your clock. If you want to close the app completely, right-click the icon in the tray and select **Exit**. You can also disable this behavior in the **Settings** if you want the app to close completely when clicking the "X".

### ⚙️ Start with Windows
* **What it is:** Configures Ludocard to open automatically every time you turn on your computer, ensuring it is always ready to watch and back up your games.
* **How to use:** Go to the **Settings** tab and turn on the **"Start with Windows"** option.

---

## 🛡️ 2. Advanced Save Protection

### 📌 Lock Special Saves (Pin Backup)
* **What it is:** Ludocard deletes old backups automatically to save space on your computer. However, if you have a special save (e.g., right before a major choice or a hard boss) that you want to keep forever, you can lock it.
* **How to use:** In your library, click the game to see your backup history (timeline). Click the pin icon next to the backup you want to protect. This backup is now locked and will never be auto-deleted.

### 💾 Portable Mode
* **What it is:** Lets you run Ludocard and save all of your backups and configuration files inside the same folder as the program. This is perfect for putting the app on a USB drive or external hard drive to carry your saves and play on any computer.
* **How to use:** Go to **Settings** and turn on **"Portable Mode"**. The app will automatically move all your existing backups and configuration files to the folder where the Ludocard program is located.

### 🛠️ Back Up Settings & Controls
* **What it is:** Besides saving your game progress, many games store graphic settings, volume, and control configurations in separate folders. Ludocard can find and save these settings files along with your progress.
* **How to use:** This is done automatically as part of the default backup process when these settings folders are identified by the database.

### 👥 Multiple Save Profiles
* **What it is:** Allows you to have different "folders" of saves for the same game. This is useful if you share your computer with someone else, want to play with mods without affecting your main save, or want to start a new campaign without losing your old one.
* **How to use:** In the game card in your library, go to the **Save Profiles** section. Create a new profile (e.g., "Modded Run") and click **Activate**. Ludocard will safely store your previous save files and load a clean slot for the new profile. You can swap profiles instantly with one click.

### ⚖️ Save Comparison Assistant
* **What it is:** If you play on different computers (e.g., PC and Laptop) and your local and cloud saves do not match, Ludocard displays an easy comparison screen.
* **How to use:** When a conflict is detected during cloud synchronization, a window will pop up showing clear details (like file size and modification date) for both saves, allowing you to easily choose which one to keep.

---

## 🌍 3. Community Sharing Features

### 🚀 Save Share Hub
* **What it is:** Allows you to upload and share your saves directly with other players on the public Ludocard cloud, without having to dig through hidden system folders.
* **How to use:** On any game card, go to the **Share Hub** tab and click share/upload your current save. You can write a title (e.g., "Right before the final boss") and add tags.

### 🏁 Community Checkpoints Repository
* **What it is:** A screen where you can browse and download save files uploaded by other players for your game.
* **How to use:** In the game's sharing tab, find a save shared by another player (e.g., "100% Complete Save") and click **Download & Install**. Ludocard will automatically place the save files in the correct game folder.

### 🎛️ Graphics Preset Sharing & Potato Mode
* **What it is:** Allows you to download optimization presets from other users to improve your game's graphics or performance. Features a **Potato Mode** (presets to help older PCs run the game faster) and **Safe-Crash** protection.
* **How to use:**
  1. Open the **Presets** tab on the game card.
  2. Browse configurations matching your goal and view the hardware specs of the creator's PC.
  3. Click **Inject Preset**.
  4. **Safe-Crash Protection:** Ludocard automatically backs up your original graphics and control settings before applying the preset. If your game crashes or runs poorly, click **Undo / Restore Original** to revert back instantly.

---

## 🕹️ 4. Emulator Support

### 🎮 Automatic Emulator Detection
* **What it is:** Ludocard detects and manages save files for retro or modern console emulators (like Yuzu, Ryujinx, Dolphin, PCSX2, RetroArch, etc.) rather than just PC games.
* **How to use:** In **Settings**, point to your emulator's folder or executable file. The app will automatically identify the emulator and display all of its games in your library.

### 🏷️ Emulator Title ID & Rom Mapping
* **What it is:** Translates complex system codes used by emulators (like `01007ef00011e000`) into real, readable game names (e.g., `The Legend of Zelda`) and adds custom-colored labels showing which emulator is running each game.
* **How to use:** This is done automatically as soon as you configure your emulator paths.

---

## 💖 5. Extra Tools for Gamers

### 🚨 Emergency Quick-Save
* **What it is:** A keyboard shortcut that lets you take an instant backup of the game you are currently playing without closing it or hitting Alt+Tab (like a save state in emulators, but for PC games).
* **How to use:** Press `Ctrl + Shift + S` while playing. You will hear a subtle Steam-like notification sound and see a notification confirming the save. You can change this hotkey combination in **Settings**.

### 📝 Game Notes
* **What it is:** A simple notepad inside each game's card to write quick reminders about your campaign.
* **How to use:** Click on a game in your library. In the campaign notes field, type any text (e.g., "Next goal: collect 10 iron ores"). The notes are saved automatically.

### 🖼️ Automatic Game Cover Art
* **What it is:** Automatically fetches official game cover arts from Steam to keep your library looking organized and beautiful.
* **How to use:** This is fully automatic. The app handles downloading and displaying the game artwork in the background.

### 🌍 Multiple Languages
* **What it is:** The application is translated into English, Portuguese, Spanish, Russian, and Simplified Chinese.
* **How to use:** You can change your preferred language at any time in the **Settings** tab.
