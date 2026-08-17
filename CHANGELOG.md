# Changelog - Luducard

All notable changes to the **Luducard** project will be documented in this file.

This project is a new application based on the core of Ludosavi. The change history of Luducard starts with this release.

## [0.2.3] - 2026-08-17
### Added
- **Save Versioning Settings**: Version history is now configurable in Settings — a switch to turn it off entirely, plus how many complete copies to keep and how many change-only backups to layer on each. Pinned saves are exempt from these limits and kept indefinitely.
- **Backup Origin Is Recorded**: Each version now stores how it was made — manual, automatic, or quick-save — each with its own label and colour in the timeline.

### Changed
- **Version History Is On By Default**: Luducard inherited Ludusavi's retention of one complete copy and no differentials, meaning every new backup replaced the previous one: the version list could never hold more than one entry, and pinning a save had nothing to pin. New default is 3 complete copies with 5 change-only backups each, for 18 restore points. Existing installations still on the old setting are migrated once, automatically; anyone who turns versioning off afterwards keeps that choice.
- **Note Field Always Visible on Saves**: Each version in the timeline now shows its note slot even when empty, so it is discoverable — a pinned save you cannot identify is not much use. Clicking the version still opens the editor.

### Fixed
- **Installing a Community Save Failed for Games Whose Save Is a Single File**: The importer assumed a game's save location is always a folder, so for the many games that point at one file — Dolphin's `gamelist.cache`, among others — it tried to create a directory over an existing file and failed with "os error 183". Exporting was broken the same way, in four separate copies of the same logic.
- **Backend Error Messages Were Always in Portuguese**: Every error raised by the backend — 105 distinct messages — appeared in Portuguese regardless of the selected language, so an English or Chinese interface would report a failure in a language the user might not read. The 15 messages that carry advice a user can act on are now properly translated into all five languages; the remaining diagnostics were rewritten in English, which reads as a technical detail rather than as broken localization.
- **Manual Backups Labelled "Automatic"**: The label was derived from whether a backup was pinned rather than from how it was created, because nothing recorded the origin. Every unpinned backup claimed to be automatic, including ones made by clicking "Back up now".

## [0.2.2] - 2026-08-17
### Added
- **Full Interface Localization**: Roughly 260 further interface strings were moved into the translation files, covering the Save Share Hub, the Preset Hub, the game details screen, settings, the first-run setup wizard, the save conflict dialog, and the scan progress phases. Preset and checkpoint tag descriptions are translated as well. Available in English, Portuguese, Spanish, Russian, and Simplified Chinese, with partial German. Every translation key referenced by the interface now exists — none fall back to hardcoded text.
- **Hub Connection Error States**: The hubs can now tell "the repository answered and there is nothing there" apart from "we never got an answer". An outage, a DNS failure, or a rejected Supabase key each explain themselves instead of silently rendering as an empty hub.
- **Relative Dates in the Hubs**: Checkpoints and presets are dated "Today", "Yesterday", "3 days ago", or "2 weeks ago" rather than only as a raw calendar date.
- **Anonymous Author Label**: Uploads published without an author name now show a single consistent "Anonymous" label.
- **itch.io Release Page**: Luducard is now published on [itch.io](https://richenbergdev.itch.io/luducard) for Windows, macOS, and Linux, linked from the README next to GitHub Releases.
- **Security Transparency**: Added an "Is it safe?" section to the README with the VirusTotal scan, an explanation of the single machine-learning false positive, and notes on SmartScreen and backup safety.
- **Hub Seeding Scripts**: Added `scripts/seed_community_saves.py` and `scripts/seed_community_presets.py` for populating the community repository (maintainer tooling, not shipped with the app).

- **Cover Size Control in the Library**: A selector next to the grid/list toggle picks small, medium, or large covers, and the choice is remembered between sessions.
- **Window Size and Position Are Remembered**: Resizing or maximizing the window now survives a restart, instead of reopening at the default 1200×800 every time. Visibility is deliberately not restored, so an app that was hidden to the tray does not reopen invisible.
- **Clear Button in the Hub Searches**: The Save Share Hub and Preset Hub search boxes get an "X" to empty them, matching the library search, which already had one.

### Changed
- **Emergency Shortcut Default**: The default quick-save shortcut moved from `Ctrl + Shift + S` to `Ctrl + Alt + S`. It is a *global* hotkey, so it was being captured ahead of whatever had focus, and `Ctrl + Shift + S` is "Save As" in a large number of applications. Configurations still on the old default are migrated automatically, once.
- **Notification Titles**: Dropped the redundant `Luducard - ` prefix from notification titles, now that the OS labels each toast with the app name and icon.

### Fixed
- **Portable ZIP Missing Its Version**: The archive is now named `Luducard_<version>_x64_portable.zip`, matching how the installer bundles are named, instead of a fixed name identical across every release.
- **Corrupted Text in the Library List**: The "Last Backup" column label was displaying mojibake from a mis-encoded string.
- **Notifications Attributed to "Windows PowerShell"**: Notifications now carry Luducard's name and icon. Windows attributes every toast to an AppUserModelID and none was registered, so the OS fell back to PowerShell's. The ID is registered under `HKCU`, requiring no installer and no admin rights, so it also works from a portable copy on a USB drive.
- **Notifications and Tray Menu Always in Portuguese**: Every notification and system tray label was hardcoded in Portuguese regardless of the selected language. All 17 strings are now translated into English, Portuguese, Spanish, Russian, and Simplified Chinese, falling back to English for the remaining languages.
- **Language Not Applied on Startup**: The saved language was only applied once the settings screen had been opened, so notifications and the tray menu reverted to English on every launch.
- **Tray Menu Language Needing a Restart**: The tray menu is now rebuilt when the language changes, instead of keeping the previous language until the app was restarted.
- **Cover Art Lookup by Title Was Broken Everywhere**: The cover service passed the search term to SteamGridDB as a query string instead of in the URL path, which is not a route it serves — so every lookup by name answered 404 and no cover was ever resolved that way. Steam games hid the problem, because they were covered by an earlier step that fetches artwork by App ID.
- **Cover Art Never Requested for Non-Emulator Games**: Even with the above fixed, the call was nested inside the emulator branch of the download chain, so it only ran for titles prefixed with "[Yuzu] ", "[Dolphin] " and similar. An ordinary PC game with no Steam App ID artwork — Halo 4, Enslaved: Odyssey to the West, Final Fantasy Tactics — never reached it and stayed uncovered no matter how many rescans ran.
- **Missing Cover Art in the Save Share Hub and Preset Hub**: Both hubs looked for cover art only in the local library, so anything for a game the user did not have showed a placeholder — which was most of the hub, since downloading saves for games you do not own is the point. Covers are now resolved by title, which never required owning the game.
- **Library Covers Grew Instead of Multiplying**: The game grid used a fixed column count per breakpoint, so past the widest breakpoint a larger window inflated each cover rather than fitting more of them. Columns are now added as the window grows.
- **Wrong Store Badge on Game Cards**: Any game without a Steam or GOG id in the manifest was labelled "Epic", because the check was merely "does this entry list any file paths" — true for nearly every game in the manifest. Standalone downloads and the emulators the manifest tracks in their own right, such as Dolphin, all showed an Epic badge they had nothing to do with. Games with no manifest entry at all defaulted to "Steam" for the same reason. Both now show a neutral "Other" badge, since the manifest carries no information about any store beyond Steam and GOG.
- **Emergency Shortcut Untranslated**: The "Emergency Shortcut (Manual Quick-Save)" setting, its description, and its input placeholder had no translation entries at all, so every language fell back to the hardcoded Portuguese text.
- **Spanish Typo**: "Clear search" read "Limpar búsqueda", mixing in the Portuguese word for "clear".
- **Dead Discord Invites**: Three expired invite links (README, CONTRIBUTING, and the in-app Support screen, which pointed at a different dead invite) now point to a permanent invite.
- **Donation Link in Test Mode**: The Stripe payment link on the Support screen was a test-mode link and could not accept real payments.
- **Outdated Shortcut in README**: The README still documented the emergency shortcut as `Ctrl + Shift + S`.


## [0.2.1] - 2026-07-13
### Added
- **Goldberg Emulator (GSE) Autodetection**: Implemented automatic scanning and mapping of Goldberg Steam Emulator (GSE) saves under `%APPDATA%\GSE Saves\<AppId>\` to official PC game entries.
- **Custom Game Save Path Overrides**: Added OS system file picker and reset buttons on the game detail screen to allow manual override of game save paths.
- **Back to Top Button**: Added a smooth-scrolling floating button in the games library when scrolling down.
- **Tauri Background Scan Notification**: Added native OS notifications when background library scans complete, displaying the number of found games.

### Fixed
- **Library Scan Progress**: Switched from fake timer progress to real-time backend progress events, fixing the "99% slider lock" issue.
- **Scan Reset on Tab Switch**: Moved scan progress state to the global `LibraryContext` to prevent scans from resetting when switching dashboard tabs.
- **Scroll Restoration and Viewport Reset**: Fixed scroll inheritance by forcing pages to start at the top on mount, and correctly restoring scroll position in the library after elements are loaded in the DOM.
- **Diário de Bordo Sincronização & Race Condition**: Fixed delay by updating context notes on save, and prevented text deletion by decoupling textarea resets from background updates.
- **Save Path Box Formatting**: Set a 550px max width for the save path display with truncation and full path shown on hover.
- **Fixed translations**: Fixed translations not updating in some cases.


## [0.2.0] - 2026-07-08
### Fixed
- **Notes I/O Performance**: Optimized campaign and backup notes loading by reading and parsing `luducard.json` once per API call, significantly improving the loading speed of game lists and scans.
- **Scan Page Layout Flashing**: Introduced loading spinners for Monitored Folders and Emulators sections to prevent layout flashing and layout shifting during the initial backend fetch.
- **Library Synchronization**: Integrated automatic context reloading (`loadGames`) on critical game details screen events (such as manual backup creation, restore operations, save profiles, and preset imports), keeping the main library list perfectly up to date.
- **UI Flickering**: Eliminated UI flickers on layout transitions.
- **Access Control List (ACL)**: Fixed ACL permissions issues in backend operations.

### Added
- **Logbook Toggle Preference**: Added a "Show Logbook in Library" option under General Settings (supporting localization in English and Portuguese) to easily show or hide the quick notes field directly from game cards and rows.
- **Discord Community Link**: Added direct integration and community links to Discord on the support page.
- **Cloud Sync Configuration**: Enabled auto-fetching of the cloud email on settings load.

## [0.1.0] - 2026-07-01
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
