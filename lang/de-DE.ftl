ludusavi = Ludusavi
language = Sprache
game-name = Name
total-games = Spiele
file-size = GrÃ¶ÃŸe
file-location = Ort
overall = Insgesamt
status = Status
cli-unrecognized-games = Keine Informationen fÃ¼r diese Spiele:
cli-unable-to-request-confirmation = BestÃ¤tigung konnte nicht angefordert werden.
    .winpty-workaround = Falls du einen Bash-Emulator (wie Git Bash) verwendest, versuche winpty auszufÃ¼hren.
cli-backup-id-with-multiple-games = Sicherungs-ID kann nicht angegeben werden, wenn mehrere Spiele wiederhergestellt werden.
cli-invalid-backup-id = UngÃ¼ltige Sicherungs-ID.
badge-failed = FEHLGESCHLAGEN
badge-duplicates = DUPLIKATE
badge-duplicated = DUPLIZIERT
badge-ignored = IGNORIERT
badge-redirected-from = VON: { $path }
badge-redirecting-to = AN: { $path }
some-entries-failed = Einige EintrÃ¤ge konnten nicht verarbeitet werden. Suche innerhalb der Ausgabe nach { badge-failed } fÃ¼r Details. ÃœberprÃ¼fe, ob du auf diese Dateien zugreifen kannst oder ob deren Pfade sehr lang sind.
cli-game-line-item-redirected = Umgeleitet von: { $path }
cli-game-line-item-redirecting = Umleiten an: { $path }
button-backup = Sichern
button-preview = Vorschau
button-restore = Wiederherstellen
button-nav-backup = SICHERUNGSMODUS
button-nav-restore = WIEDERHERSTELLUNGSMODUS
button-nav-custom-games = BENUTZERDEFINIERTE SPIELE
button-nav-other = ANDERE
button-add-game = Spiel hinzufÃ¼gen
button-continue = Weiter
button-cancel = Abbrechen
button-cancelling = Abbrechen...
button-okay = Okay
button-select-all = Alle auswÃ¤hlen
button-deselect-all = Alle abwÃ¤hlen
button-enable-all = Alle aktivieren
button-disable-all = Alle deaktivieren
button-customize = Anpassen
button-exit = Verlassen
button-comment = Kommentieren
button-lock = Sperren
button-unlock = Entsperren
# This opens a download page.
button-get-app = { $app } holen
button-validate = ÃœberprÃ¼fen
button-override-manifest = Manifest Ã¼berschreiben
button-extend-manifest = Manifest erweitern
button-sort = Sortieren
button-download = Herunterladen
button-upload = Hochladen
button-ignore = Ignorieren
no-roots-are-configured = FÃ¼ge einige Wurzelverzeichnisse hinzu, um weitere Daten zu sichern.
config-is-invalid = Fehler: Die Konfigurationsdatei ist ungÃ¼ltig.
manifest-is-invalid = Fehler: Die Manifest-Datei ist ungÃ¼ltig.
manifest-cannot-be-updated = Fehler: Die Manifest-Datei konnte nicht auf eine Aktualisierung Ã¼berprÃ¼ft werden. Besteht eine Internetverbindung?
cannot-prepare-backup-target = Fehler: Das Sicherungsziel kann nicht vorbereitet werden (entweder beim Erstellen oder Leeren des Ordners). Falls du den Ordner in deinem Dateibrowser geÃ¶ffnet hast, versuche diesen zu schlieÃŸen: { $path }
restoration-source-is-invalid = Fehler: Die Wiederherstellungsquelle ist ungÃ¼ltig (entweder sie existiert nicht oder ist kein Verzeichnis). Bitte Ã¼berprÃ¼fe den Speicherort: { $path }
registry-issue = Fehler: Einige RegistrierungseintrÃ¤ge wurden Ã¼bersprungen.
unable-to-browse-file-system = Fehler: Dateisystem kann nicht durchsucht werden.
unable-to-open-directory = Fehler: Verzeichnis konnte nicht geÃ¶ffnet werden:
unable-to-open-url = Fehler: Kann URL nicht Ã¶ffnen:
unable-to-configure-cloud = Cloud konnte nicht konfiguriert werden.
unable-to-synchronize-with-cloud = Cloud konnte nicht synchronisiert werden.
cloud-synchronize-conflict = Deine lokalen und Cloud-Backups stehen im Konflikt. FÃ¼hre einen Upload oder Download durch, um das Problem zu lÃ¶sen.
command-unlaunched = Befehl wurde nicht gestartet: { $command }
command-terminated = Befehl wurde abrupt beendet: { $command }
command-failed = Befehl fehlgeschlagen mit Code { $code }: { $command }
processed-games =
    { $total-games } { $total-games ->
        [one] Spiel
       *[other] Spiele
    }
processed-games-subset =
    { $processed-games } von { $total-games } { $total-games ->
        [one] Spiel
       *[other] Spiele
    }
processed-size-subset = { $processed-size } von { $total-size }
field-backup-target = Sichern nach:
field-restore-source = Wiederherstellen von:
field-custom-files = Pfade:
field-custom-registry = Registry:
field-sort = Sortierung:
field-redirect-source =
    .placeholder = Quelle (Originalort)
field-redirect-target =
    .placeholder = Ziel (neuer Ort)
field-roots = Wurzelverzeichnisse:
field-backup-excluded-items = SicherungsausschlÃ¼sse:
field-redirects = Umleitungen:
# This appears next to the number of full backups that you'd like to keep.
# A full backup includes all save files for a game.
field-retention-full = Komplett:
# This appears next to the number of differential backups that you'd like to keep.
# A differential backup includes only the files that have changed since the last full backup.
field-retention-differential = Differenz:
field-backup-format = Format:
field-backup-compression = Komprimierung:
# The compression level determines how much compresison we perform.
field-backup-compression-level = Stufe:
label-manifest = Manifest
# This shows the time when we checked for an update to the manifest.
label-checked = ÃœberprÃ¼ft
# This shows the time when we found an update to the manifest.
label-updated = Aktualisiert
label-new = Neu
label-removed = Entfernt
label-comment = Kommentar
label-unchanged = UnverÃ¤ndert
label-backup = Sicherung
label-scan = Scan
label-filter = Filter
label-unique = Einzigartig
label-complete = VollstÃ¤ndig
label-partial = Teilweise
label-enabled = Aktiviert
label-disabled = Deaktiviert
# https://en.wikipedia.org/wiki/Thread_(computing)
label-threads = Threads
label-cloud = Cloud
# A "remote" is what Rclone calls cloud systems like Google Drive.
label-remote = Remote
label-remote-name = Remote-Name
label-folder = Ordner
# An executable file
label-executable = AusfÃ¼hrbare Datei
# Options given to a command line program
label-arguments = Argumente
label-url = URL
# https://en.wikipedia.org/wiki/Host_(network)
label-host = Host
# https://en.wikipedia.org/wiki/Port_(computer_networking)
label-port = Port
label-username = Nutzername
label-password = Passwort
# This is a specific website or service that provides some cloud functionality.
# For example, Nextcloud and Owncloud are providers of WebDAV services.
label-provider = Provider
label-custom = Benutzerdefiniert
label-none = Keiner
label-change-count = Ã„nderungen: { $total }
label-unscanned = Ungescannt
# This refers to a local file on the computer
label-file = Datei
label-game = Spiel
# Aliases are alternative titles for the same game.
label-alias = Alias
label-original-name = Originalname
# Which manifest a game's data came from
label-source = Quelle
# This refers to the main Ludusavi manifest: https://github.com/mtkennerly/ludusavi-manifest
label-primary-manifest = PrimÃ¤res Manifest
# This refers to how we integrate a custom game with the manifest data.
label-integration = Integration
# This is a folder name where a specific game is installed
label-installed-name = Installation
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
store-other-home = Home-Ordner
# This would be a folder acting as a virtual C: drive, created by Wine.
store-other-wine = Wine-PrÃ¤fix
# This would be a folder with typical Windows system folders,
# like "Program Files (x86)" and "Users".
store-other-windows = Windows-Laufwerk
# This would be a folder with typical Linux system folders,
# like "home" and "opt".
store-other-linux = Linux-Laufwerk
# This would be a folder with typical Mac system folders,
# like "Applications" and "Users".
store-other-mac = Mac-Laufwerk
store-other = Sonstiges
backup-format-simple = Einfach
backup-format-zip = Zip
compression-none = Keiner
# "Deflate" is a proper noun: https://en.wikipedia.org/wiki/Deflate
compression-deflate = Deflate
compression-bzip2 = Bzip2
compression-zstd = Zstd
theme = Aussehen
theme-light = Hell
theme-dark = Dunkel
redirect-bidirectional = Bidirektional
reverse-redirects-when-restoring = Beim Wiederherstellen die Reihenfolge der Umleitungen umkehren
show-disabled-games = Deaktivierte Spiele anzeigen
show-unchanged-games = UnverÃ¤nderte Spiele anzeigen
show-unscanned-games = Ungescannte Spiele anzeigen
override-max-threads = Max. Threads Ã¼bergehen
synchronize-automatically = Automatisch synchronisieren
prefer-alias-display = Alias statt Originalnamen anzeigen
skip-unconstructive-backups = Backup Ã¼berspringen, wenn nur Daten entfernt werden wÃ¼rden, anstatt hinzugefÃ¼gt oder geÃ¤ndert zu werden
explanation-for-exclude-store-screenshots = Storespezifische Bildschirmfotos aus Datensicherungen ausschieÃŸen
explanation-for-exclude-cloud-games = Auf diesen Plattformen keine Spiele mit Cloud-UnterstÃ¼tzung sichern
consider-doing-a-preview =
    Falls du es noch nicht getan hast, erwÃ¤ge zuerst eine Vorschau zu machen, damit
    keine Ãœberraschungen gibt.
confirm-backup =
    Bist du sicher, dass du mit der Sicherung fortfahren mÃ¶chtest? { $path-action ->
        [merge] Neue Spielstanddaten werden mit dem Zielordner zusammengefÃ¼hrt:
       *[create] Der Zielordner wird erstellt:
    }
confirm-restore =
    Bist du sicher, dass du mit der Wiederherstellung fortfahren mÃ¶chtest?
    Dies Ã¼berschreibt alle aktuellen Dateien mit den Sicherungen von hier:
confirm-cloud-upload =
    MÃ¶chtest du deine Cloud-Dateien mit deinen lokalen Dateien ersetzen?
    Deine Cloud-Dateien ({ $cloud-path }) werden zu einer exakten Kopie deiner lokalen Dateien ({ $local-path }).
    Dateien in der Cloud werden bei Bedarf aktualisiert oder gelÃ¶scht.
confirm-cloud-download =
    MÃ¶chtest du deine lokalen Dateien mit deinen Cloud-Dateien ersetzen?
    Deine lokalen Dateien ({ $local-path }) werden zu einer exakten Kopie deiner Cloud-Dateien ({ $cloud-path }).
    Lokale Dateien werden bei Bedarf aktualisiert oder gelÃ¶scht.
confirm-add-missing-roots = Diese Wurzelverzeichnisse hinzufÃ¼gen?
no-missing-roots = Keine weiteren Wurzelverzeichnisse gefunden.
loading = LÃ¤dtÂ â€¦
preparing-backup-target = Sicherungsverzeichnis wird vorbereitet...
updating-manifest = Manifest wird aktualisiert...
no-cloud-changes = Keine zu sychronisierenden Ã„nderungen
backups-are-valid = Deine Sicherungen sind gÃ¼ltig.
backups-are-invalid =
    Die Sicherungen dieser Spiele scheinen ungÃ¼ltig zu sein.
    MÃ¶chtest du fÃ¼r diese Spiele neue vollstÃ¤ndige Sicherungen erstellen?
saves-found = Spielstanddaten gefunden.
no-saves-found = Keine Spielstanddaten gefunden.
# This is tacked on to form something like "Back up (no confirmation)",
# meaning we would perform an action without asking the user if they're sure.
suffix-no-confirmation = ohne BestÃ¤tigung
# This is shown when a setting will only take effect after closing and reopening Ludusavi.
suffix-restart-required = Neustart erforderlich
prefix-error = Fehler: { $message }
prefix-warning = Warnung: { $message }
cloud-app-unavailable = Cloud-Backups sind deaktiviert, da { $app } nicht verfÃ¼gbar ist.
cloud-not-configured = Cloud-Backups sind deaktiviert, da kein Cloudsystem konfiguriert ist.
cloud-path-invalid = Cloud-Backups sind deaktiviert, da der Backup-Pfad ungÃ¼ltig ist.
game-is-unrecognized = Ludusavi erkennt dieses Spielt nicht.
game-has-nothing-to-restore = Dieses Spiel hat keine wiederherzustellende Sicherungskopie.
launch-game-after-error = Spiel trotzdem starten?
game-did-not-launch = Spiel konnte nicht gestartet werden.
backup-is-newer-than-current-data = The existing backup is newer than the current data.
backup-is-older-than-current-data = The existing backup is older than the current data.
back-up-specific-game =
    .confirm = Spielstanddaten fÃ¼r { $game } sichern?
    .failed = Spielstanddaten fÃ¼r { $game } konnten nicht gesichert werden.
restore-specific-game =
    .confirm = Spielstanddaten fÃ¼r { $game } wiederherstellen?
    .failed = Spielstanddaten fÃ¼r { $game } konnten nicht wiederhergestellt werden.
new-version-check = Automatisch nach Aktualisierungen der Anwendung suchen
new-version-available = Eine Anwendungsaktualisierung ist verfÃ¼gbar: { $version }. MÃ¶chtest du die Versionshinweise ansehen?
custom-game-will-override = Dieses benutzerdefinierte Spiel Ã¼berschreibt einen Manifest-Eintrag
custom-game-will-extend = Dieses benutzerdefinierte Spiel erweitert einen Manifest-Eintrag
operation-will-only-include-listed-games = Hiermit werden nur die derzeit aufgelisteten Spiele verarbeitet

luducard-community-title = Save Share HUB
luducard-community-desc = Teile und lade Community-SpielstÃ¤nde herunter
luducard-btn-share-checkpoint = Spielstand teilen
luducard-repo-disconnected = Community-Repository nicht verbunden
luducard-repo-disconnected-desc = Um Community-SpielstÃ¤nde zu laden und deine eigenen zu teilen, musst du deine Supabase-URL und den Ã¶ffentlichen Anon-Key in den Einstellungen konfigurieren.
luducard-how-to-config = Konfiguration:
luducard-config-step-1 = Erstelle ein kostenloses Projekt auf Supabase.
luducard-config-step-2 = Erstelle die Tabellen durch AusfÃ¼hren des SQL-Skripts in supabase/schema.sql.
luducard-config-step-3 = Trage die API-URL und den Anon-Key in den Luducard-Einstellungen ein.
luducard-checkpoints = Checkpoints
luducard-contributors = Mitwirkende
luducard-search-placeholder = Nach Spiel oder Checkpoint suchen...
luducard-sort-popular = Beliebt
luducard-sort-recent-hub = Neueste
luducard-sort-size-hub = GrÃ¶ÃŸe
luducard-syncing-repo = Synchronisiere mit dem Ã¶ffentlichen Repository...
luducard-no-checkpoints-found = Keine Checkpoints gefunden
luducard-no-checkpoints-available = Keine Checkpoints verfÃ¼gbar
luducard-search-terms-desc = Versuche es mit anderen Suchbegriffen.
luducard-be-first-desc = Sei der Erste, der einen Community-Spielstand teilt!
luducard-no-desc-provided = Keine detaillierte Beschreibung vorhanden.
luducard-author-by = von
luducard-zstd-verified = EnthÃ¤lt verifizierte zstd-Metadaten
luducard-btn-install = Installieren
luducard-btn-installing = Installiere...
luducard-security-sandbox-title = Automatische Safe-Crash- und Sandbox-Sicherheit
luducard-security-sandbox-desc = Beim Installieren eines Community-Spielstands erstellt Luducard automatisch ein Backup deines aktuellen Spielstands. Falls etwas schiefgeht, kannst du das vorherige Backup aus dem Verlauf wiederherstellen.
luducard-share-checkpoint-modal = Checkpoint teilen
luducard-publish-progress-desc = VerÃ¶ffentliche deine Spielstandsdatei fÃ¼r die Community.
luducard-save-game-label = Spielstand *
luducard-search-installed-game = Tippe, um nach einem installierten Spiel zu suchen...
luducard-backup-version-label = Backup-Version *
luducard-no-local-backups-desc = FÃ¼r dieses Spiel wurden noch keine lokalen Backups erstellt. Erstelle zuerst ein Backup in der Spielkarte.
luducard-checkpoint-title-label = Checkpoint-Titel *
luducard-checkpoint-title-placeholder = Z. B. Vor Malenia oder Level 100 100% abgeschlossen
luducard-checkpoint-author-label = Name des Autors
luducard-checkpoint-author-placeholder = Z. B. Anonym
luducard-checkpoint-desc-label = Beschreibung / ZusÃ¤tzliche Hinweise
luducard-checkpoint-desc-placeholder = Beschreibe Details wie Build, Level, wichtige Items oder den Fortschrittspunkt.
luducard-checkpoint-tags-label = Checkpoint-Tags
luducard-btn-cancel = Abbrechen
luducard-btn-publishing = VerÃ¶ffentliche...
luducard-btn-publish = Checkpoint verÃ¶ffentlichen
luducard-detail-modal-desc = Zeige vollstÃ¤ndige Checkpoint-Metadaten an.
luducard-btn-close = SchlieÃŸen
luducard-btn-download-install = Herunterladen & Installieren
luducard-detail-title-label = Checkpoint-Titel:
luducard-detail-desc-label = Fortschrittsbeschreibung:
luducard-detail-tags-label = Tags:
luducard-detail-size-label = Komprimierte GrÃ¶ÃŸe:
luducard-detail-downloads-label = Downloads gesamt:
luducard-detail-author-label = Hochgeladen von:
luducard-detail-date-label = Hochgeladen am:
luducard-date-today = Heute
luducard-date-yesterday = Gestern
luducard-date-days-ago = Tage zuvor
luducard-date-weeks-ago = Wochen zuvor
luducard-date-locale = de-DE

luducard-presethub-title = Preset Share HUB
luducard-presethub-desc = Entdecke und teile Grafik- und Steuerungsoptimierungen aus der Community
luducard-btn-share-preset = Preset teilen
luducard-presethub-disconnected = Preset-Repository nicht verbunden
luducard-presethub-disconnected-desc = Um Community-Presets zu laden und deine eigenen zu teilen, musst du deine Supabase-URL und den Anon-Key in den Einstellungen konfigurieren.
luducard-presets = Presets
luducard-preset-search-placeholder = Suche nach Spiel, Titel oder Hardware (z. B. RTX 4070)...
luducard-syncing-presets = Synchronisiere Presets...
luducard-no-presets-found = Keine Grafik-Presets gefunden
luducard-search-terms-desc-preset = Versuche, deine Suchbegriffe zurÃ¼ckzusetzen.
luducard-badge-official = Offiziell
luducard-gpu = GPU
luducard-approval = Bewertung
luducard-useful = NÃ¼tzlich
luducard-useless = UnnÃ¼tz
luducard-report-preset = Preset melden
luducard-btn-undo = RÃ¼ckgÃ¤ngig
luducard-btn-inject = Injizieren
luducard-btn-injecting = Injiziere...
luducard-not-installed = Nicht installiert
luducard-security-safety-title = Sicherheit durch Safe-Crash garantiert
luducard-security-safety-desc = Beim Herunterladen eines Grafik-Presets aus dem HUB sichert Luducard deine vorherigen Einstellungen. Deine SpielstÃ¤nde bleiben unberÃ¼hrt.
luducard-share-preset-modal-title = Grafik-Preset teilen
luducard-share-preset-modal-desc = Sende ein lokales Grafik-Preset an die Community.
luducard-preset-game-label = Spiel des Presets *
luducard-search-installed-game-preset = Installiertes Spiel suchen...
luducard-choose-local-preset-label = Lokales Preset auswÃ¤hlen *
luducard-no-local-presets-desc = Keine lokalen Presets fÃ¼r dieses Spiel gespeichert. Erstelle zuerst ein lokales Preset in der Spielkarte!
luducard-preset-title-label = Preset-Titel *
luducard-preset-creator-label = Autor / Ersteller
luducard-preset-desc-label = Beschreibung / Preset-Notizen
luducard-preset-tags-label = Preset-Tags
luducard-preset-hardware-label = Hardware des Autors (automatisch ausgefÃ¼llt):
luducard-cpu = CPU
luducard-ram = RAM
luducard-btn-publish-preset = Preset verÃ¶ffentlichen
luducard-detail-preset-title = Preset-Titel:
luducard-detail-preset-desc = Beschreibung / Optimierungen:
luducard-detail-author-specs = Hardware des Autors:

luducard-tag-desc-100 = Spiel zu 100% abgeschlossen mit allen Errungenschaften, GegenstÃ¤nden und Sammelobjekten freigeschaltet.
luducard-tag-desc-dlc1 = Fokus auf oder bereit fÃ¼r den ersten DLC.
luducard-tag-desc-dlc2 = Fokus auf oder bereit fÃ¼r den zweiten DLC.
luducard-tag-desc-ngplus = Bereit fÃ¼r oder bereits gestartet im Modus Neues Spiel+.
luducard-tag-desc-vanilla = Fortschritt des Originalspiels komplett sauber, ohne Modifikatoren, Mods oder Cheats.
luducard-tag-desc-modded = Fortschritt mit Modifikationen (Mods) erzielt, die das Gameplay verÃ¤ndern kÃ¶nnen.
luducard-tag-desc-bossprep = Spielstand strategisch direkt vor einem wichtigen Boss platziert.
luducard-tag-desc-starter = Spielstand am Anfang des Spiels, mit angesammelten Ressourcen oder Ã¼bersprungenem Tutorial.
luducard-tag-desc-cleanstart = Spielstand direkt nach der Charaktererstellung oder EinfÃ¼hrung, bereit zum direkten Start.
luducard-tag-desc-midgame = Spielstand in der Mitte der Hauptkampagne (ideal bei Fortschrittsverlust).
luducard-tag-desc-postgame = Kampagne abgeschlossen, ideal zum Erkunden geheimer Bosse, ausstehender Errungenschaften oder NebenaktivitÃ¤ten.
luducard-tag-desc-opbuild = Spielstand fokussiert auf einen Charakter mit extrem starker AusrÃ¼stung, Level und Builds (Overpowered).
luducard-tag-desc-unlimitedcash = Spielstand fokussiert auf maximales oder unendliches Geld, MÃ¼nzen oder Upgrade-Ressourcen.
luducard-tag-desc-allcollectibles = Spielstand mit Fokus auf sekundÃ¤re Errungenschaften und mÃ¼hsame Sammelobjekte komplett freigeschaltet.
luducard-tag-desc-hardcore = SpielstÃ¤nde auf extremem Schwierigkeitsgrad oder mit permanentem Tod aktiviert (Ãœberleben).
luducard-tag-desc-speedrunready = Spielstand ideal zum Trainieren von Speedrun-Abschnitten oder auf den schnellsten Routen platziert.
luducard-tag-desc-legit = Fortschritt sauber erzielt, ohne Cheats, Cheat-Codes oder das Ausnutzen von Fehlern (Glitches).
luducard-preset-tag-desc-perf = Optimierungen fokussiert auf FPS-Gewinn und FlÃ¼ssigkeit.
luducard-preset-tag-desc-quality = Optimierungen fokussiert auf maximale GrafikqualitÃ¤t.
luducard-preset-tag-desc-balanced = Ideale Balance zwischen visueller Treue und FPS-Rate.
luducard-preset-tag-desc-deck = Speziell fÃ¼r Bildschirm und Akku des Steam Decks/Handhelds optimiertes Profil.
luducard-preset-tag-desc-potato = Zum AusfÃ¼hren auf sehr alten PCs und bescheidenen Laptops.
luducard-preset-tag-desc-controls = Benutzerdefiniertes Mapping von Steuerung, Gamepad oder Hotkeys.
luducard-preset-tag-desc-rt = Verfeinerte Konfiguration mit aktivem Raytracing, ausgerichtet auf eine gute Bildrate.
luducard-preset-tag-desc-4k = Optimierungen fokussiert auf 4K-Fernseher und -Monitore mit hoher AuflÃ¶sung.
luducard-preset-tag-desc-vr = Optimierte Einstellungen fÃ¼r eine ideale FPS-Rate in der virtuellen RealitÃ¤t.

luducard-schedule-auto-routine = Automatische Backup-Routine
luducard-schedule-auto-routine-desc = Lege fest, wann automatische Backups durchgefÃ¼hrt werden sollen.
luducard-schedule-by-interval = Nach Intervall
luducard-schedule-by-days = Wochentage
luducard-schedule-backup-every = Backup erstellen alle
luducard-schedule-1-hour = 1 Stunde
luducard-schedule-3-hours = 3 Stunden
luducard-schedule-6-hours = 6 Stunden
luducard-schedule-12-hours = 12 Stunden
luducard-schedule-24-hours = 24 Stunden
luducard-schedule-at-time = Zur Uhrzeit
luducard-schedule-games-in-schedule = Spiele im Zeitplan
luducard-schedule-games-in-schedule-desc = WÃ¤hle aus, welche Spiele diesem automatischen Ablauf folgen sollen.
luducard-schedule-btn-save = Zeitplan speichern
luducard-schedule-saved-toast = Zeitplan erfolgreich gespeichert

luducard-day-sun = So
luducard-day-mon = Mo
luducard-day-tue = Di
luducard-day-wed = Mi
luducard-day-thu = Do
luducard-day-fri = Fr
luducard-day-sat = Sa

luducard-notification-alerts = Benachrichtigungen & Alarme
luducard-notification-alerts-desc = WÃ¤hle aus, wie du Ã¼ber Backups informiert werden mÃ¶chtest.
luducard-notification-windows = Windows-Benachrichtigungen
luducard-notification-windows-desc = Benachrichtigen, wenn ein Backup erfolgreich abgeschlossen wurde.
luducard-notification-toast-enabled = Benachrichtigungen aktiviert
luducard-notification-toast-disabled = Benachrichtigungen deaktiviert
luducard-notification-fail-alerts = Fehlermeldungen
luducard-notification-fail-alerts-desc = Sofort benachrichtigen, wenn ein Backup fehlschlÃ¤gt.
luducard-notification-toast-fail-enabled = Fehlermeldungen aktiviert
luducard-notification-toast-fail-disabled = Fehlermeldungen deaktiviert
luducard-notification-sounds = HinweistÃ¶ne
luducard-notification-sounds-desc = Einen Ton abspielen, wenn ein Backup abgeschlossen wird oder fehlschlÃ¤gt.
luducard-notification-toast-sounds-enabled = TÃ¶ne aktiviert
luducard-notification-toast-sounds-disabled = TÃ¶ne deaktiviert
