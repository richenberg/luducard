ludusavi = Ludusavi

language = Language
game-name = Name
total-games = Games
file-size = Size
file-location = Location
overall = Overall
status = Status

cli-unrecognized-games = No info for these games:
cli-unable-to-request-confirmation = Unable to request confirmation.
    .winpty-workaround = If you are using a Bash emulator (like Git Bash), try running winpty.
cli-backup-id-with-multiple-games = Cannot specify backup ID when restoring multiple games.
cli-invalid-backup-id = Invalid backup ID.

badge-failed = FAILED
badge-duplicates = DUPLICATES
badge-duplicated = DUPLICATED
badge-ignored = IGNORED
badge-redirected-from = FROM: {$path}
badge-redirecting-to = TO: {$path}

some-entries-failed = Some entries failed to process; look for {badge-failed} in the output for details. Double check whether you can access those files or whether their paths are very long.

cli-game-line-item-redirected = Redirected from: {$path}
cli-game-line-item-redirecting = Redirecting to: {$path}

button-backup = Back up
button-preview = Preview
button-restore = Restore
button-nav-backup = BACKUP MODE
button-nav-restore = RESTORE MODE
button-nav-custom-games = CUSTOM GAMES
button-nav-other = OTHER
button-add-game = Add game
button-continue = Continue
button-cancel = Cancel
button-cancelling = Cancelling...
button-okay = Okay
button-select-all = Select all
button-deselect-all = Deselect all
button-enable-all = Enable all
button-disable-all = Disable all
button-customize = Customize
button-exit = Exit
button-comment = Comment
button-lock = Lock
button-unlock = Unlock
# This opens a download page.
button-get-app = Get {$app}
button-validate = Validate
button-override-manifest = Override manifest
button-extend-manifest = Extend manifest
button-sort = Sort
button-download = Download
button-upload = Upload
button-ignore = Ignore

no-roots-are-configured = Add some roots to back up even more data.

config-is-invalid = Error: The config file is invalid.
manifest-is-invalid = Error: The manifest file is invalid.
manifest-cannot-be-updated = Error: Unable to check for an update to the manifest file. Is your Internet connection down?
cannot-prepare-backup-target = Error: Unable to prepare backup target (either creating or emptying the folder). If you have the folder open in your file browser, try closing it: {$path}
restoration-source-is-invalid = Error: The restoration source is invalid (either doesn't exist or isn't a directory). Please double check the location: {$path}
registry-issue = Error: Some registry entries were skipped.
unable-to-browse-file-system = Error: Unable to browse on your system.
unable-to-open-directory = Error: Unable to open directory:
unable-to-open-url = Error: Unable to open URL:
unable-to-configure-cloud = Unable to configure cloud.
unable-to-synchronize-with-cloud = Unable to synchronize with cloud.
cloud-synchronize-conflict = Your local and cloud backups are in conflict. Perform an upload or download to resolve this.

command-unlaunched = Command did not launch: {$command}
command-terminated = Command terminated abruptly: {$command}
command-failed = Command failed with code {$code}: {$command}

processed-games = {$total-games} {$total-games ->
    [one] game
    *[other] games
}
processed-games-subset = {$processed-games} of {$total-games} {$total-games ->
    [one] game
    *[other] games
}
processed-size-subset = {$processed-size} of {$total-size}

field-backup-target = Back up to:
field-restore-source = Restore from:
field-custom-files = Paths:
field-custom-registry = Registry:
field-sort = Sort:
field-redirect-source =
    .placeholder = Source (original location)
field-redirect-target =
    .placeholder = Target (new location)
field-roots = Roots:
field-backup-excluded-items = Backup exclusions:
field-redirects = Redirects:
# This appears next to the number of full backups that you'd like to keep.
# A full backup includes all save files for a game.
field-retention-full = Full:
# This appears next to the number of differential backups that you'd like to keep.
# A differential backup includes only the files that have changed since the last full backup.
field-retention-differential = Differential:
field-backup-format = Format:
field-backup-compression = Compression:
# The compression level determines how much compresison we perform.
field-backup-compression-level = Level:

label-manifest = Manifest
# This shows the time when we checked for an update to the manifest.
label-checked = Checked
# This shows the time when we found an update to the manifest.
label-updated = Updated
label-new = New
label-removed = Removed
label-comment = Comment
label-unchanged = Unchanged
label-backup = Backup
label-scan = Scan
label-filter  = Filter
label-unique = Unique
label-complete = Complete
label-partial = Partial
label-enabled = Enabled
label-disabled = Disabled
# https://en.wikipedia.org/wiki/Thread_(computing)
label-threads = Threads
label-cloud = Cloud
# A "remote" is what Rclone calls cloud systems like Google Drive.
label-remote = Remote
label-remote-name = Remote name
label-folder = Folder
# An executable file
label-executable = Executable
# Options given to a command line program
label-arguments = Arguments
label-url = URL
# https://en.wikipedia.org/wiki/Host_(network)
label-host = Host
# https://en.wikipedia.org/wiki/Port_(computer_networking)
label-port = Port
label-username = Username
label-password = Password
# This is a specific website or service that provides some cloud functionality.
# For example, Nextcloud and Owncloud are providers of WebDAV services.
label-provider = Provider
label-custom = Custom
label-none = None
label-change-count = Changes: {$total}
label-unscanned = Unscanned
# This refers to a local file on the computer
label-file = File
label-game = Game
# Aliases are alternative titles for the same game.
label-alias = Alias
label-original-name = Original name
# Which manifest a game's data came from
label-source = Source
# This refers to the main Ludusavi manifest: https://github.com/mtkennerly/ludusavi-manifest
label-primary-manifest = Primary manifest
# This refers to how we integrate a custom game with the manifest data.
label-integration = Integration
# This is a folder name where a specific game is installed
label-installed-name = Installed name

store-ea = EA
store-epic = Epic
store-gog = GOG
store-gog-galaxy = GOG Galaxy
store-heroic = Heroic
store-legendary = Legendary
store-lutris = Lutris
store-microsoft = Microsoft
store-origin = Origin
store-prime = Prime Gaming
store-steam = Steam
store-uplay = Uplay
store-other-home = Home folder
# This would be a folder acting as a virtual C: drive, created by Wine.
store-other-wine = Wine prefix
# This would be a folder with typical Windows system folders,
# like "Program Files (x86)" and "Users".
store-other-windows = Windows drive
# This would be a folder with typical Linux system folders,
# like "home" and "opt".
store-other-linux = Linux drive
# This would be a folder with typical Mac system folders,
# like "Applications" and "Users".
store-other-mac = Mac drive
store-other = Other

backup-format-simple = Simple
backup-format-zip = Zip

compression-none = None
# "Deflate" is a proper noun: https://en.wikipedia.org/wiki/Deflate
compression-deflate = Deflate
compression-bzip2 = Bzip2
compression-zstd = Zstd

theme = Theme
theme-light = Light
theme-dark = Dark

redirect-bidirectional = Bidirectional
reverse-redirects-when-restoring = Reverse sequence of redirects when restoring

show-disabled-games = Show disabled games
show-unchanged-games = Show unchanged games
show-unscanned-games = Show unscanned games
override-max-threads = Override max threads
synchronize-automatically = Synchronize automatically
prefer-alias-display = Display alias instead of original name
skip-unconstructive-backups = Skip backup when data would be removed, but not added or updated

explanation-for-exclude-store-screenshots =
    In backups, exclude store-specific screenshots

explanation-for-exclude-cloud-games =
    Do not back up games with cloud support on these platforms

consider-doing-a-preview =
    If you haven't already, consider doing a preview first so that there
    are no surprises.

confirm-backup =
    Are you sure you want to proceed with the backup? {$path-action ->
        [merge] New save data will be merged into the target folder:
        *[create] The target folder will be created:
    }

confirm-restore =
    Are you sure you want to proceed with the restoration?
    This will overwrite any current files with the backups from here:

confirm-cloud-upload =
    Do you want to replace your cloud files with your local files?
    Your cloud files ({$cloud-path}) will become an exact copy of your local files ({$local-path}).
    Files in the cloud will be updated or deleted as necessary.

confirm-cloud-download =
    Do you want to replace your local files with your cloud files?
    Your local files ({$local-path}) will become an exact copy of your cloud files ({$cloud-path}).
    Local files will be updated or deleted as necessary.

confirm-add-missing-roots = Add these roots?
no-missing-roots = No additional roots found.
loading = Loading...
preparing-backup-target = Preparing backup directory...
updating-manifest = Updating manifest...
no-cloud-changes = No changes to synchronize
backups-are-valid =
    Your backups are valid.
backups-are-invalid =
    These games' backups appear to be invalid.
    Do you want to create new full backups for these games?

saves-found = Save data found.
no-saves-found = No save data found.

# This is tacked on to form something like "Back up (no confirmation)",
# meaning we would perform an action without asking the user if they're sure.
suffix-no-confirmation = no confirmation

# This is shown when a setting will only take effect after closing and reopening Ludusavi.
suffix-restart-required = restart required

prefix-error = Error: {$message}
prefix-warning = Warning: {$message}

cloud-app-unavailable = Cloud backups are disabled because {$app} is not available.
cloud-not-configured = Cloud backups are disabled because no cloud system is configured.
cloud-path-invalid = Cloud backups are disabled because the backup path is invalid.

game-is-unrecognized = Ludusavi does not recognize this game.
game-has-nothing-to-restore = This game does not have a backup to restore.
launch-game-after-error = Launch the game anyway?
game-did-not-launch = Game failed to launch.
backup-is-newer-than-current-data = The existing backup is newer than the current data.
backup-is-older-than-current-data = The existing backup is older than the current data.

back-up-specific-game =
    .confirm = Back up save data for {$game}?
    .failed = Failed to back up save data for {$game}
restore-specific-game =
    .confirm = Restore save data for {$game}?
    .failed = Failed to restore save data for {$game}

new-version-check = Check for application updates automatically
new-version-available = An application update is available: {$version}. Would you like to view the release notes?

custom-game-will-override = This custom game overrides a manifest entry
custom-game-will-extend = This custom game extends a manifest entry

operation-will-only-include-listed-games = This will only process the games that are currently listed

luducard-library = Library
luducard-scan-and-add = Scan & Add
luducard-cloud-and-sync = Cloud & Sync
luducard-save-share-hub = Save Share HUB
luducard-preset-share-hub = Preset Share HUB
luducard-settings = Settings
luducard-support-project = Support the Project
luducard-library-status = Library Status
luducard-games = Games
luducard-language = Language
luducard-language-desc = Interface language.
luducard-sidebar-subtitle = Save Backups
luducard-navigation = Navigation
luducard-stored-saves = Stored Saves
luducard-pending-saves = Pending
luducard-downloading-covers = Downloading covers...
luducard-settings-desc = App preferences and behavior
luducard-dashboard-desc = Manage and protect your game saves

luducard-file-watcher = File Watcher
luducard-file-watcher-desc = Monitors save changes and backs up automatically when the game closes.
luducard-start-with-windows = Start with Windows
luducard-start-with-windows-desc = Open minimized in the system tray when starting the PC.
luducard-system-tray = Run in System Tray
luducard-system-tray-desc = Minimize the application to the system tray near the clock instead of closing.
luducard-portable = Portable Mode
luducard-portable-desc = Save all configurations, manifests, and backups in the executable folder (ideal for USB drives).
luducard-theme = Theme
luducard-theme-desc = Interface appearance.
luducard-theme-dark = Dark
luducard-theme-light = Light
luducard-theme-system = System
luducard-backup-dir = Backup Directory
luducard-backup-dir-desc = Where game saves will be stored locally.

luducard-rclone-path = Rclone executable path
luducard-rclone-path-desc = Path to the rclone executable used for uploading to the cloud.
luducard-cloud-folder = Remote Cloud Folder
luducard-cloud-folder-desc = Name of the remote folder to synchronize the files.
luducard-rclone-args = Extra Rclone arguments
luducard-rclone-args-desc = Optional commands and flags passed directly to rclone.
luducard-supabase-url = Supabase URL (Community Repository)
luducard-supabase-url-desc = API URL of your Supabase project for the community tab.
luducard-supabase-key = Supabase Anon Key
luducard-supabase-key-desc = Public (anon) key used for anonymous authentication on tables.
luducard-btn-save-settings = Save Settings

luducard-tab-general = General
luducard-tab-schedule = Schedule
luducard-tab-notifications = Notifications
luducard-general-preferences = General preferences
luducard-general-preferences-desc = Application paths and basic behavior.

luducard-status-synchronized = Synchronized
luducard-status-pending = Backup pending
luducard-status-none = No backup
luducard-backup = Backup
luducard-restore = Restore
luducard-current-save = Active Save
luducard-last-backup = Last Backup
luducard-manual-backup = Manual Backup
luducard-loading-library = Loading game library...
luducard-monitored-games = Monitored Games
luducard-cloud-synced = Cloud Synced
luducard-pending-saves-plural = Pending Backups
luducard-search-games = Search games...
luducard-clear-search = Clear search
luducard-select-all = Select all
luducard-platform = Platform
luducard-all-platforms = All Platforms
luducard-sort-by = Sort by
luducard-sort-name = Name (A-Z)
luducard-sort-recent = Recently played
luducard-sort-size = Save size
luducard-installed = Installed
luducard-pending = Pending
luducard-grid-view = Grid view
luducard-list-view = List view
luducard-showing = Showing
luducard-of = of
luducard-game = game
luducard-games-plural = games
luducard-no-games-found = No games found
luducard-adjust-filters-desc = Adjust the filters or scan your folders to add new games.
luducard-starting-backup-for = Starting backup for
luducard-backup-completed-for = Backup for
luducard-completed = completed!
luducard-completed-fem = completed!
luducard-backup-failed-for = Backup failed for
luducard-restoring-backup-for = Restoring backup for
luducard-restore-completed-for = Restore for
luducard-restore-failed-for = Restore failed for
luducard-never = Never

luducard-scan-title = Scan & Add
luducard-scan-desc = Find game saves on your computer
luducard-auto-search = Automatic search
luducard-auto-search-desc = Scans system common folders (Steam, Epic, Documents, AppData) and custom folders for new saves or changes.
luducard-scanning = Scanning...
luducard-start-scan = Start search for changes
luducard-scan-completed = Scan completed
luducard-scan-completed-desc = Change detection finished.
luducard-scan-error = Error performing scan.
luducard-custom-folder = Custom
luducard-default-folder = Default
luducard-folder-added = Folder added to monitoring
luducard-folder-added-success = Folder added successfully!
luducard-folder-select-error = Error selecting/adding folder.
luducard-emulator-detected = The selected folder belongs to emulator { $emulator }.\n\nDo you want to add it as an Emulator to track game saves automatically?
luducard-adding-emulator = Adding emulator and scanning saves...
luducard-emulator-added-success = Emulator { $emulator } added successfully! { $count } game(s) detected in saves folder.
luducard-emulator-added-empty = Emulator { $emulator } added! No game saves detected in folder.
luducard-emulator-add-failed = Failed to add emulator: { $error }
luducard-emulator-added-mock = Emulator added successfully! (Mock)
luducard-emulator-select-error = Error selecting/adding emulator.
luducard-emulator-removed = Emulator removed
luducard-emulator-remove-error = Error removing emulator.
luducard-folder-removed = Folder removed from monitoring
luducard-folder-remove-error = Error removing folder.
luducard-monitored-folders = Monitored folders
luducard-monitored-folders-desc = Root directories continuously observed for new saves.
luducard-add-folder = Add folder
luducard-no-folders-detected = No game folder automatically detected.
luducard-click-add-folder-desc = Click "Add folder" to select a library folder or emulators.
luducard-monitoring-active = Active monitoring
luducard-remove-folder = Remove folder
luducard-select-new-root = Select new root folder
luducard-monitored-emulators = Monitored emulators
luducard-monitored-emulators-desc = Emulator directories observed for console save auto-detection.
luducard-add-emulator = Add emulator
luducard-no-emulators-configured = No emulator configured.
luducard-click-add-emulator-desc = Click "Add emulator" to import saves from Switch, Wii, Wii U, GBA, PS2, etc.
luducard-saves-integrated = Saves integrated to library
luducard-remove-emulator = Remove emulator
luducard-add-other-emulator = Add another emulator
luducard-scan-results = Scan results
luducard-scan-results-desc = Select which games with new or changed saves you want to backup.
luducard-starting-batch-backup = Starting batch backup for { $count } games...
luducard-batch-backup-completed = Backup of selected games completed!
luducard-batch-backup-failed = Batch backup failed.
luducard-backup-selected = Backup Selected
luducard-no-new-saves-detected = No new saves or changes detected. All games are synchronized!
luducard-new-game = New Game
luducard-changed-save = Changed

luducard-cloud-title = Cloud & Sync
luducard-cloud-desc = Configure remote backup of your saves
luducard-cloud-provider = Cloud provider
luducard-cloud-provider-desc = Choose where your backups will be stored remotely.
luducard-auth-status = Authentication and storage status.
luducard-connected-as = Connected as { $account }
luducard-oauth-authorized = Account authorized via OAuth
luducard-disconnect = Disconnect
luducard-space-used = Space used
luducard-connect-desc = Connect your { $provider } account to enable remote backup of your saves.
luducard-connect-btn = Connect account
luducard-sync-rules = Sync rules
luducard-sync-rules-desc = How saves move between the PC and the cloud.
luducard-auto-upload = Automatic upload after local backup
luducard-auto-upload-desc = Uploads to the cloud immediately after each backup.
luducard-auto-upload-enabled = Automatic upload enabled
luducard-auto-upload-disabled = Automatic upload disabled
luducard-download-if-newer = Download if remote save is newer
luducard-download-if-newer-desc = Resolves conflicts by prioritizing the newer version.
luducard-auto-download-enabled = Automatic download enabled
luducard-auto-download-disabled = Automatic download disabled
luducard-disconnected-provider = { $provider } disconnected
luducard-connected-provider = { $provider } connected

luducard-loading = Loading...
luducard-fetching-details = Fetching game details
luducard-loading-details = Loading game details...
luducard-details-desc = Backup details and history
luducard-back = Back
luducard-select = Select
luducard-saved-versions = saved versions
luducard-backup-now = Backup now
luducard-restore-latest = Restore latest
luducard-open-game-folder-desc = Open game installation folder in Windows Explorer
luducard-game-folder = Game Folder
luducard-open-save-folder-desc = Open folder where active saves are stored
luducard-save-folder = Save Folder
luducard-open-backup-folder-desc = Open Luducard save backup folder
luducard-backup-folder = Backups Folder
luducard-export-save-desc = Export save as compressed .luducard file to share
luducard-export-save = Export Save (.luducard)
luducard-status = Status
luducard-saves-on-pc = Saves on PC
luducard-total-backups = Total in backups
luducard-quick-preferences = Quick preferences
luducard-save-history = Saves History
luducard-config-presets = Config Presets
luducard-saves-timeline = Saves Timeline
luducard-presets-configs = Presets & Configs
luducard-no-backups-yet = No backups yet
luducard-do-first-backup-desc = Create the first backup of this game to start the timeline.
luducard-active = Active
luducard-disabled = Disabled

luducard-support-title = Support the Project
luducard-support-desc = Help keep community save and preset servers online
luducard-support-intro-title = Luducard is completely free!
luducard-support-intro-desc = Our cloud features (Save Share Hub and Presets) generate monthly server and traffic costs. If the app is useful to you, please consider supporting to help keep them online!
luducard-how-to-support = How to Support the Project
luducard-how-to-support-desc = Choose your preferred method of contribution. Stripe supports credit cards and PIX.
luducard-support-itch = Support on Itch.io
luducard-support-stripe = Card / PIX via Stripe
luducard-support-dest-desc = All contributions are fully directed towards the maintenance of cloud servers (hosting and data traffic).

luducard-community-title = Save Share HUB
luducard-community-desc = Share and download community save checkpoints
luducard-btn-share-checkpoint = Share Checkpoint
luducard-repo-disconnected = Community Repository Disconnected
luducard-repo-disconnected-desc = To load community checkpoints and share yours, you need to configure your Supabase URL and public Anon Key in Settings.
luducard-how-to-config = How to configure:
luducard-config-step-1 = Create a free project on Supabase.
luducard-config-step-2 = Create tables by running the SQL script in supabase/schema.sql.
luducard-config-step-3 = Insert the API URL and public Anon Key in Luducard Settings.
luducard-checkpoints = Checkpoints
luducard-contributors = Contributors
luducard-search-placeholder = Search by game or checkpoint...
luducard-sort-popular = Popular
luducard-sort-recent-hub = Recent
luducard-sort-size-hub = Size
luducard-syncing-repo = Syncing with the public repository...
luducard-no-checkpoints-found = No checkpoints found
luducard-no-checkpoints-available = No checkpoints available
luducard-search-terms-desc = Try searching with other terms.
luducard-be-first-desc = Be the first to share a community save!
luducard-no-desc-provided = No detailed description provided.
luducard-author-by = by
luducard-zstd-verified = Contains verified zstd metadata
luducard-btn-install = Install
luducard-btn-installing = Installing...
luducard-security-sandbox-title = Automatic Safe-Crash and Sandbox Security
luducard-security-sandbox-desc = When installing a community checkpoint, Luducard automatically creates a safety backup of your current save before overwriting. If anything goes wrong, just restore the previous backup from history.
luducard-share-checkpoint-modal = Share Checkpoint
luducard-publish-progress-desc = Publish your progress file to the community.
luducard-save-game-label = Save Game *
luducard-search-installed-game = Type to search an installed game...
luducard-backup-version-label = Backup Version *
luducard-no-local-backups-desc = No local backups made for this game yet. Create a backup in the game card first.
luducard-checkpoint-title-label = Checkpoint Title *
luducard-checkpoint-title-placeholder = E.g. Before Malenia or Level 100 100% Complete
luducard-checkpoint-author-label = Author Name
luducard-checkpoint-author-placeholder = E.g. Anonymous
luducard-checkpoint-desc-label = Description / Additional Notes
luducard-checkpoint-desc-placeholder = Describe details like build, level, important items or progress point.
luducard-checkpoint-tags-label = Checkpoint Tags
luducard-btn-cancel = Cancel
luducard-btn-publishing = Publishing...
luducard-btn-publish = Publish Checkpoint
luducard-detail-modal-desc = Viewing complete checkpoint metadata.
luducard-btn-close = Close
luducard-btn-download-install = Download & Install
luducard-detail-title-label = Checkpoint Title:
luducard-detail-desc-label = Progress Description:
luducard-detail-tags-label = Tags:
luducard-detail-size-label = Compressed Size:
luducard-detail-downloads-label = Total Downloads:
luducard-detail-author-label = Uploaded by:
luducard-detail-date-label = Uploaded on:
luducard-date-today = Today
luducard-date-yesterday = Yesterday
luducard-date-days-ago = days ago
luducard-date-weeks-ago = weeks ago
luducard-date-locale = en-US

luducard-presethub-title = Preset Share HUB
luducard-presethub-desc = Discover and share graphics and controller optimizations from the community
luducard-btn-share-preset = Share Preset
luducard-presethub-disconnected = Preset Repository Disconnected
luducard-presethub-disconnected-desc = To load community presets and share yours, you need to configure your Supabase URL and public Anon Key in Settings.
luducard-presets = Presets
luducard-preset-search-placeholder = Search by game, title, or hardware (e.g. RTX 4070)...
luducard-syncing-presets = Syncing presets...
luducard-no-presets-found = No graphic presets found
luducard-search-terms-desc-preset = Try resetting your search terms.
luducard-badge-official = Official
luducard-gpu = GPU
luducard-approval = Approval
luducard-useful = Useful
luducard-useless = Useless
luducard-report-preset = Report preset
luducard-btn-undo = Undo
luducard-btn-inject = Inject
luducard-btn-injecting = Injecting...
luducard-not-installed = Not Installed
luducard-security-safety-title = Safety Guaranteed by Safe-Crash
luducard-security-safety-desc = When downloading any graphic preset from the HUB, Luducard backs up your previous settings. Your progress saves remain untouched.
luducard-share-preset-modal-title = Share Graphic Preset
luducard-share-preset-modal-desc = Send a local graphic preset to the community.
luducard-preset-game-label = Preset Game *
luducard-search-installed-game-preset = Search installed game...
luducard-choose-local-preset-label = Choose Local Preset *
luducard-no-local-presets-desc = No local preset saved for this game. Go to the game tab and create a local preset first!
luducard-preset-title-label = Preset Title *
luducard-preset-creator-label = Author / Creator
luducard-preset-desc-label = Description / Preset Notes
luducard-preset-tags-label = Preset Tags
luducard-preset-hardware-label = Author Hardware (Auto-filled from local preset):
luducard-cpu = CPU
luducard-ram = RAM
luducard-btn-publish-preset = Publish Preset
luducard-detail-preset-title = Preset Title:
luducard-detail-preset-desc = Description / Optimizations:
luducard-detail-author-specs = Author Specs:

luducard-tag-desc-100 = Game 100% completed with all achievements, items and collectibles unlocked.
luducard-tag-desc-dlc1 = Progress focused on or ready to start the first DLC.
luducard-tag-desc-dlc2 = Progress focused on or ready to start the second DLC.
luducard-tag-desc-ngplus = Game ready to start or already started in New Game+ mode.
luducard-tag-desc-vanilla = Base game progress completely clean, without modifiers, mods or cheats.
luducard-tag-desc-modded = Progress obtained using modifications (mods) that can alter gameplay.
luducard-tag-desc-bossprep = Save strategically positioned right before a major game boss.
luducard-tag-desc-starter = Save at the beginning of the game, with accumulated resources or skipped tutorial.
luducard-tag-desc-cleanstart = Savegame right after character creation or introduction, ready to play straight from the real start.
luducard-tag-desc-midgame = Save positioned in the middle of the main campaign (great for those who lost progress).
luducard-tag-desc-postgame = Campaign completed, ideal for exploring secret bosses, pending achievements or side activities.
luducard-tag-desc-opbuild = Savegame focused on a character with extremely strong equipment, level and builds (Overpowered).
luducard-tag-desc-unlimitedcash = Save focused on having max or infinite cash, coins or upgrade resources.
luducard-tag-desc-allcollectibles = Save focusing on secondary achievements and tedious collectibles fully unlocked.
luducard-tag-desc-hardcore = Saves in extreme difficulties or with permanent death enabled (extreme survival).
luducard-tag-desc-speedrunready = Save ideal for training speedrun segments or positioned on the fastest routes.
luducard-tag-desc-legit = Progress obtained cleanly, without cheats, cheat codes or exploiting bugs (glitches).
luducard-preset-tag-desc-perf = Optimizations focused on FPS gain and smoothness.
luducard-preset-tag-desc-quality = Optimizations focused on maximum graphic quality.
luducard-preset-tag-desc-balanced = Ideal balance between visual fidelity and FPS rate.
luducard-preset-tag-desc-deck = Profile optimized specifically for Steam Deck/handheld screen and battery.
luducard-preset-tag-desc-potato = To run on super old PCs and modest laptops.
luducard-preset-tag-desc-controls = Customized mapping of controls, gamepad or hotkeys.
luducard-preset-tag-desc-rt = Fine-tuned configuration with active ray tracing, aiming for good frame rate.
luducard-preset-tag-desc-4k = Optimizations focused on 4K high-definition TVs and monitors.
luducard-preset-tag-desc-vr = Settings adjusted for ideal FPS rate in virtual reality.

luducard-schedule-auto-routine = Automatic backup routine
luducard-schedule-auto-routine-desc = Define when backups should happen automatically.
luducard-schedule-by-interval = By interval
luducard-schedule-by-days = Days of the week
luducard-schedule-backup-every = Backup every
luducard-schedule-1-hour = 1 hour
luducard-schedule-3-hours = 3 hours
luducard-schedule-6-hours = 6 hours
luducard-schedule-12-hours = 12 hours
luducard-schedule-24-hours = 24 hours
luducard-schedule-at-time = At time
luducard-schedule-games-in-schedule = Games in schedule
luducard-schedule-games-in-schedule-desc = Select which games follow this automatic routine.
luducard-schedule-btn-save = Save schedule
luducard-schedule-saved-toast = Schedule saved successfully

luducard-day-sun = Sun
luducard-day-mon = Mon
luducard-day-tue = Tue
luducard-day-wed = Wed
luducard-day-thu = Thu
luducard-day-fri = Fri
luducard-day-sat = Sat

luducard-notification-alerts = Alerts & Notifications
luducard-notification-alerts-desc = Choose how you want to be notified about backups.
luducard-notification-windows = Windows Notifications
luducard-notification-windows-desc = Notify when a backup completes successfully.
luducard-notification-toast-enabled = Notifications enabled
luducard-notification-toast-disabled = Notifications disabled
luducard-notification-fail-alerts = Failure alerts
luducard-notification-fail-alerts-desc = Notify immediately when a backup fails.
luducard-notification-toast-fail-enabled = Failure alerts enabled
luducard-notification-toast-fail-disabled = Failure alerts disabled
luducard-notification-sounds = Alert sounds
luducard-notification-sounds-desc = Play a sound when a backup completes or fails.
luducard-notification-toast-sounds-enabled = Alert sounds enabled
luducard-notification-toast-sounds-disabled = Alert sounds disabled


