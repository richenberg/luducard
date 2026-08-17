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
luducard-show-notes-in-library = Show Logbook in Library
luducard-show-notes-in-library-desc = Displays the quick notes field directly on game cards and rows in the library.
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
luducard-hub-unreachable-title = Could not reach the repository
luducard-hub-unreachable-desc = The server did not respond. Check your internet connection — if it is working, the repository may be temporarily offline.
luducard-hub-rejected-title = Repository refused the connection
luducard-hub-rejected-desc = The configured Supabase key was rejected. Check the URL and the Anon Key in Settings.
luducard-hub-error-title = Repository returned an error
luducard-hub-error-desc = The server answered with an error and the list could not be loaded.
luducard-btn-try-again = Try again
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
luducard-files-mapped = mapped files

# Game detail: presets tab, backup details, backup kinds
luducard-pinned = Pinned
luducard-export-btn = Export
luducard-my-presets-tab = My Presets (Local & Downloaded)
luducard-community-presets-tab = Community Presets
luducard-upload-to-hub-btn = Upload to HUB
luducard-undo-restore-original = Undo & Restore Original
luducard-fetching-cloud-presets = Fetching presets from the cloud...
luducard-installing = Installing...
luducard-local-backup-details = Local Backup Details
luducard-backup-type-label = Backup Type:
luducard-mapping-local-files = Mapping local files...
luducard-mapping-files = Mapping files...
luducard-your-name-label = Your Name / Nickname
luducard-detecting-hardware = Detecting local hardware...
luducard-cpu-full-label = Processor (CPU)
luducard-preset-detail-modal-desc = Viewing complete preset metadata.
luducard-shortcut-input-title = Click and press the key combination you want
luducard-backup-kind-automatic = Automatic
luducard-backup-kind-manual = Manual
luducard-backup-kind-manual-locked = Manual (Locked)
luducard-backup-kind-before-close = Before closing
luducard-backup-kind-restore = Restore

# Save Share: game picker
luducard-search-game-with-backups = Type to search a game with backups...
luducard-no-games-with-backups = No games with backups found

# Conflict resolution, version locking, install results
luducard-toast-resolving-keep-local = Resolving conflict: keeping the local version of
luducard-toast-resolving-take-cloud = Resolving conflict: downloading the cloud version of
luducard-backup-of = Backup of
luducard-exported-from-backup = Exported from the local backup taken on
luducard-toast-locking-version = Locking version
luducard-toast-unlocking-version = Unlocking version
luducard-toast-version-locked = Version locked! It will not be deleted automatically.
luducard-toast-version-unlocked = Version unlocked successfully.
luducard-error-game-not-found = not found in your local library, or it has no save folder configured.
luducard-game-label = Game
luducard-toast-checkpoint-installed = installed successfully! The previous save was backed up to history.
luducard-checkpoint-label = Checkpoint

# Toasts and status messages
luducard-toast-load-community-presets-failed = Error loading community presets.
luducard-toast-load-profiles-failed = Error loading save profiles.
luducard-toast-profile-title-required = Please enter a title for the profile.
luducard-toast-creating-profile = Creating new save profile...
luducard-toast-select-config-file = Select at least one config file.
luducard-toast-saving-local-preset = Saving local settings as a preset...
luducard-confirm-delete-local-preset = Do you really want to permanently delete this local preset?
luducard-toast-deleting-local-preset = Deleting local preset...
luducard-toast-crash-safety-starting = Starting Safe-Crash to safeguard settings...
luducard-toast-downloading-applying-preset = Downloading and applying optimized settings preset...
luducard-toast-community-preset-applied = Community preset applied successfully! Saved to your local library.
luducard-toast-restoring-crash-safety = Restoring original config files from Safe-Crash...
luducard-toast-original-config-restored = Original settings restored successfully! Saves untouched.
luducard-toast-vote-failed = Failed to register vote.
luducard-toast-report-sent-preset = Report sent! The preset will be hidden from the community after 3 reports.
luducard-toast-report-failed = Failed to send report.
luducard-toast-preset-title-required = Please fill in the preset title.
luducard-toast-packing-config-files = Packing config files...
luducard-toast-publishing-preset-metadata = Publishing preset metadata to the community...
luducard-error-preset-cloud-limit = You have reached the limit of 5 active presets in the cloud.
luducard-toast-manage-deletions-in-app = Please manage backup deletions from the main app
luducard-toast-default-path-restored = Default path restored successfully!
luducard-toast-load-hub-failed = Error loading preset hub data.
luducard-toast-vote-error = Error registering vote.
luducard-toast-report-sent-hub = Report sent! Presets with 3+ reports are hidden.
luducard-toast-report-send-failed = Failed to report.
luducard-toast-fill-required-fields = Please fill in all required fields.
luducard-toast-compressing-encrypting = Compressing and encrypting config files...
luducard-toast-requesting-upload-permission = Requesting secure upload permission...
luducard-toast-publishing-to-preset-repo = Publishing metadata to the preset repository...
luducard-error-preset-cloud-limit-reached = You have already reached the limit of 5 active presets in the cloud.
luducard-toast-backend-connection-error = Connection error with the app backend.
luducard-toast-requesting-cloud-upload-permission = Requesting secure cloud upload permission...
luducard-toast-publishing-to-public-repo = Publishing metadata to the public repository...
luducard-error-checkpoint-cloud-limit = You have already reached the limit of 5 active checkpoints in the cloud.
luducard-toast-save-note-failed = Failed to save note
luducard-toast-save-note-failed-2 = Failed to save note
luducard-toast-change-path-failed = Error changing path
luducard-toast-restore-path-failed = Error restoring path
luducard-toast-backup-failed = Backup failed
luducard-toast-restore-failed = Failed to restore
luducard-toast-restore-version-failed = Failed to restore version
luducard-toast-export-backup-failed = Failed to export backup
luducard-toast-change-version-status-failed = Failed to change version status
luducard-toast-open-folder-failed = Error opening folder
luducard-toast-export-failed = Failed to export
luducard-toast-create-profile-failed = Failed to create profile
luducard-toast-switch-profile-failed = Error switching profile
luducard-toast-delete-profile-failed = Error deleting profile
luducard-toast-save-local-preset-failed = Failed to save local preset
luducard-toast-apply-local-preset-failed = Failed to apply local preset
luducard-toast-delete-preset-failed = Error deleting preset
luducard-toast-apply-preset-failed = Failed to apply preset
luducard-toast-restore-crash-safety-failed = Failed to restore Safe-Crash backup
luducard-error-register-preset-failed = Failed to register preset
luducard-toast-publish-preset-failed = Error publishing preset
luducard-error-get-download-url-failed = Failed to get download URL
luducard-toast-inject-preset-failed = Failed to apply preset
luducard-toast-revert-configs-failed = Failed to revert settings
luducard-error-register-preset-failed-2 = Failed to register preset
luducard-toast-publish-preset-failed-2 = Error publishing preset
luducard-error-get-download-url-failed-2 = Failed to get download URL
luducard-toast-install-checkpoint-failed = Failed to download/install checkpoint
luducard-error-register-checkpoint-failed = Failed to register checkpoint in the database
luducard-toast-publish-failed = Error publishing
luducard-toast-restoring-default-path = Restoring default path of
luducard-toast-local-version-saved = Local version of
luducard-toast-saved-to-cloud = saved to the cloud!
luducard-toast-cloud-version-restored = Cloud version of
luducard-toast-restored-suffix = restored!
luducard-toast-resolve-conflict-failed = Failed to resolve conflict for
luducard-toast-latest-version-restored = Latest version of
luducard-toast-restoring-version = Restoring version
luducard-toast-version-restored = Version from
luducard-toast-switching-profile = Switching to profile
luducard-toast-may-take-seconds = This may take a few seconds.
luducard-confirm-delete-profile = Are you sure you want to delete the profile
luducard-confirm-delete-profile-warning = All saves in this profile will be permanently deleted.
luducard-toast-deleting-profile = Deleting profile
luducard-toast-profile-deleted = Profile
luducard-toast-deleted-suffix = deleted successfully!
luducard-toast-starting-crash-safety-for = Starting Safe-Crash for settings of
luducard-toast-local-preset-applied = Local preset
luducard-toast-applied-suffix = applied successfully!
luducard-error-quota-or-limit = Storage quota or limit error in the repository.
luducard-toast-starting-crash-safety-for-game = Starting Safe-Crash for settings of
luducard-toast-installing-preset = Installing preset
luducard-toast-restoring-original-settings = Restoring original settings of
luducard-toast-settings-restored = Settings of
luducard-toast-restored-saves-untouched = restored. Saves untouched!
luducard-error-cloud-storage-quota = Cloud storage quota error.
luducard-toast-uploading-preset = Uploading preset to the cloud
luducard-toast-preset-applied-saved = Preset applied and saved to your local presets. Safe-Crash active!
luducard-toast-fill-required-fields-cm = Please fill in all required fields.
luducard-toast-downloading-checkpoint = Downloading and installing checkpoint... Safe-Crash will create an automatic backup.
luducard-error-cloud-storage-quota-limit = Cloud storage quota/limit error.

# Game detail: presets & configs
luducard-restore-btn = Restore
luducard-delete-version = Delete version
luducard-unpin-version = Unpin version (allow automatic deletion)
luducard-pin-version = Pin version (prevent automatic deletion)
luducard-save-current-config = Save Current Config
luducard-save-current-config-desc = Create a local preset from your game's active settings.
luducard-save-new-config-btn = Save New Config
luducard-no-local-presets = No local presets
luducard-no-local-presets-hint = Capture your local graphics and controller settings to save them as a preset or share them.
luducard-no-description = No description.
luducard-apply-btn = Apply
luducard-crash-safety-active = Safe-Crash Active
luducard-crash-safety-active-desc = You applied a preset recently. If anything breaks, restore the original configs.
luducard-no-community-presets = No community presets
luducard-no-community-presets-desc = There are no presets published for this game in the cloud. Create a local one and share it!
luducard-downloads-label = Downloads:
luducard-download-apply-btn = Download & Apply
luducard-delete = Delete
luducard-version-info-desc = Version information and campaign notes.
luducard-date-time-label = Date and Time:
luducard-at = at
luducard-file-size-label = File Size:
luducard-campaign-notes-label = Campaign Notes / Progress Description
luducard-save-notes-btn = Save Notes
luducard-share-config-preset-title = Share Config Preset
luducard-share-config-preset-desc = Save and send your local optimizations to the community.
luducard-detected-config-files = Detected Config Files:
luducard-no-config-files-detected = Could not detect config files using the Ludusavi mapping.
luducard-preset-title-placeholder = E.g. Potato Mode (Max Performance) or Balanced DF Specs
luducard-preset-desc-detailed-label = Description (Game version, estimated FPS gains, etc.)
luducard-preset-desc-placeholder = E.g. Around 15% more FPS in the city. Tested on version 1.63.
luducard-detected-hardware-label = Detected Hardware (Author Specs):
luducard-gpu-label = Graphics Card (GPU)
luducard-ram-label = RAM Memory
luducard-create-local-preset-title = Create Local Preset
luducard-create-local-preset-desc = Save this game's current settings into a local profile.
luducard-local-preset-title-placeholder = E.g. My 60fps Optimization or Flight Controls
luducard-local-preset-desc-placeholder = Describe what this preset changes (e.g. reduces volumetric shadows for better performance).
luducard-included-files-label = Included Files (Auto-detected):
luducard-no-files-detected = No files detected by Ludusavi.
luducard-create-preset-btn = Create Preset
luducard-no-presets-here = No presets here yet
luducard-be-first-to-share = Be the first to share a graphics or controller preset with the community!

# Save profiles (modding)
luducard-activate-profile-btn = Activate Profile
luducard-active-profile-banner = Active Profile on System:
luducard-active-profile-banner-desc = When switching profiles, the game folder's current saves are automatically stored in the previously active profile to prevent data loss.
luducard-cancel = Cancel
luducard-cant-delete-active = Cannot delete the active profile
luducard-change-save-path-btn = Change save path
luducard-clone-current-saves = Clone current progress
luducard-clone-current-saves-desc = Copies the saves currently in the game folder to this profile (recommended).
luducard-cloud-sync = Cloud sync
luducard-cloud-sync-upload = Upload to cloud
luducard-confirm-reset-save-path = Do you really want to reset this game's save path to the manifest default?
luducard-create-profile-btn = Create Profile
luducard-new-save-profile-btn = New Save Profile
luducard-create-profile-desc = Start a parallel campaign or isolate saves with mods.
luducard-create-profile-title = Create Save Profile
luducard-created-at = Created on
luducard-creation-options = Startup Options:
luducard-delete-profile = Delete profile
luducard-loading-profiles = Loading save profiles...
luducard-no-profiles-desc = The game is using your system's default save files. Create the first profile to start organizing your campaigns.
luducard-no-profiles-yet = No Save Profiles
luducard-no-save-path = Path not configured
luducard-none = None (Using loose saves)
luducard-profile-active-tag = Active on System
luducard-profile-desc-label = Description
luducard-profile-desc-placeholder = Describe the purpose of this profile (e.g. playing with the warrior class).
luducard-profile-inactive-tag = Inactive
luducard-profile-name-label = Profile Name *
luducard-profile-name-placeholder = E.g. My Vanilla Campaign or Modded Run
luducard-profiles-header = Save Profile Management
luducard-profiles-intro = Create separate campaigns or isolate modded gameplay. Luducard will automatically handle switching and storing the corresponding saves.
luducard-reset-save-path-btn = Reset to default path
luducard-save-profiles-tab = Save Profiles
luducard-save-profiles-title = Save Profiles (Modding)
luducard-start-empty = Start from scratch (Empty)
luducard-start-empty-desc = The game's current save folder will be cleared so you can start 100% fresh progress.

luducard-anonymous = Anonymous
luducard-author-by-label = By:
luducard-preset-downloaded-from-community = Downloaded from the community - Author
luducard-preset-tag-perf = Performance
luducard-preset-tag-quality = Quality / Visual
luducard-preset-tag-balanced = Balanced
luducard-preset-tag-deck = Steam Deck
luducard-preset-tag-potato = Potato Mode
luducard-preset-tag-controls = Controls / Layout
luducard-preset-tag-rt = Ray Tracing Opt
luducard-preset-tag-4k = 4K Ready
luducard-preset-tag-vr = VR Ready

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

luducard-diario-bordo-placeholder = Logbook (notes)...
luducard-diario-bordo-placeholder-short = Logbook...
luducard-campaign-notes = Logbook
luducard-campaign-notes-desc = Quick notes about your progress
luducard-campaign-notes-placeholder = Write quick notes about your progress in this game...
luducard-backup-all = Backup all
luducard-discord-title = Discord Community
luducard-discord-desc = Ask questions, report bugs, suggest features and connect with other players.
luducard-discord-join = Join Discord
luducard-cloud-active = Cloud Sync Active and Healthy
luducard-cloud-paused = Cloud Sync Paused
luducard-cloud-active-desc = Your local backups will be automatically uploaded and synchronized in the cloud.
luducard-cloud-paused-desc = Cloud upload is paused. Enable it to synchronize your saves.
luducard-cloud-disconnect = Disconnect Account
luducard-cloud-disconnect-btn = Disconnect


luducard-cloud-details-title = Account Details
luducard-cloud-email = Account Email:
luducard-cloud-destination = Destination Folder:
luducard-cloud-engine = Backup Engine:
luducard-cloud-path = Executable Path:
luducard-cloud-rules-title = Sync Rules
luducard-cloud-upload-auto = Auto Upload
luducard-cloud-upload-auto-desc = Upload saves as soon as local backup is generated.
luducard-cloud-download-latest = Download Most Recent
luducard-cloud-download-latest-desc = Give priority to newer files on the cloud.
luducard-cloud-toast-upload-enabled = Auto upload enabled
luducard-cloud-toast-upload-disabled = Auto upload disabled
luducard-cloud-toast-download-enabled = Auto download enabled
luducard-cloud-toast-download-disabled = Auto download disabled
luducard-support-dest = Resource Allocation
luducard-danger-zone = Danger Zone
luducard-danger-zone-desc = Destructive actions that cannot be undone.
luducard-reset-warning-title = IMPORTANT WARNING:
luducard-reset-warning-desc = This will permanently erase all settings, custom search paths, game scan history, cloud credentials, and save profiles. Original backup folders on disk will not be deleted.
luducard-btn-reset-app = Clear All Data
luducard-btn-reset-confirm = Yes, Confirm Deletion
luducard-btn-reset-cancel = Cancel

# Native OS notifications and tray menu. Sent from the Rust side, so they are
# translated here rather than in the UI. The OS already labels the toast with the
# app name and icon, so these titles deliberately leave "Luducard" out.
luducard-notify-quick-save-title = Quick-save
luducard-notify-quick-save-done-title = Quick-save complete
luducard-notify-quick-save-done = Backup of "{ $game }" saved successfully.
luducard-notify-quick-save-failed-title = Quick-save failed
luducard-notify-quick-save-failed = Could not back up "{ $game }": { $message }
luducard-notify-quick-save-no-game = Could not detect which game is in the foreground.
luducard-notify-quick-save-unmatched = { $exe } is not a game in your library.
luducard-notify-auto-backup-title = Automatic backup
luducard-notify-auto-backup-done = Save for "{ $game }" backed up successfully.
luducard-notify-auto-backup-failed-title = Automatic backup failed
luducard-notify-auto-backup-failed = Could not back up "{ $game }": { $message }
luducard-notify-scan-done-title = Scan complete
luducard-notify-scan-done =
    { $total } { $total ->
        [one] game
       *[other] games
    } found in your library.
luducard-notify-tray-title = Luducard is still running
luducard-notify-tray-body = The app was minimized to the system tray.
luducard-tray-show = Show window
luducard-tray-quit = Quit Luducard

luducard-quicksave = Emergency Shortcut (Manual Quick-Save)
luducard-quicksave-desc = Global shortcut (Save State for PC) that backs up whichever game is in the foreground.
luducard-quicksave-press-keys = Press the keys...
luducard-card-size-small = Small covers
luducard-card-size-medium = Medium covers
luducard-card-size-large = Large covers

# First-run wizard
luducard-wizard-title = Initial game setup
luducard-wizard-desc = To back up your saves automatically, Luducard needs to know where your games are installed. We found these folders:
luducard-wizard-confirm = Confirm and save
luducard-wizard-skip = Skip / set up later
luducard-wizard-close = Close
luducard-scan-after-wizard = Scan for new saves right after saving
luducard-detecting-launchers = Looking for installed platforms...
luducard-detection-failed = Could not detect installed platforms.
luducard-no-platforms-detected = No standard platform detected.
luducard-no-platforms-desc = No problem — you can add your game folders by hand once this wizard is closed.
luducard-saving-folders = Saving folders and setting up monitoring...
luducard-folders-saved-success = Folders set up successfully.
luducard-save-wizard-failed = Could not save the monitored folders.

# Save conflict dialog
luducard-conflict-title = Save conflict detected
luducard-conflict-this-pc = This PC
luducard-conflict-cloud = Cloud
luducard-conflict-newer = Newer
luducard-conflict-older = Older
luducard-conflict-keep-local = Keep this PC's version
luducard-conflict-keep-cloud = Keep the cloud version

# Scan phases
luducard-scan-phase-starting = Starting scan...
luducard-scan-phase-saves = Looking for saves on disk...
luducard-scan-phase-game = Analyzing the games found...
luducard-scan-phase-emulators = Scanning emulators...
luducard-scan-phase-processing = Processing results...
luducard-scan-phase-finalizing = Finishing up and saving cache...
luducard-scan-phase-done = Scan complete.
luducard-games-found = games found

luducard-toast-backing-up = Backing up the selected games...
luducard-toast-backup-success = Backup completed successfully.
luducard-schedule-all-games = Back up all games
luducard-back-to-top = Back to top
luducard-platform-other = Other
