ludusavi = Ludusavi
language = Sprache
game-name = Name
total-games = Spiele
file-size = Größe
file-location = Ort
overall = Insgesamt
status = Status
cli-unrecognized-games = Keine Informationen für diese Spiele:
cli-unable-to-request-confirmation = Bestätigung konnte nicht angefordert werden.
    .winpty-workaround = Falls du einen Bash-Emulator (wie Git Bash) verwendest, versuche winpty auszuführen.
cli-backup-id-with-multiple-games = Sicherungs-ID kann nicht angegeben werden, wenn mehrere Spiele wiederhergestellt werden.
cli-invalid-backup-id = Ungültige Sicherungs-ID.
badge-failed = FEHLGESCHLAGEN
badge-duplicates = DUPLIKATE
badge-duplicated = DUPLIZIERT
badge-ignored = IGNORIERT
badge-redirected-from = VON: { $path }
badge-redirecting-to = AN: { $path }
some-entries-failed = Einige Einträge konnten nicht verarbeitet werden. Suche innerhalb der Ausgabe nach { badge-failed } für Details. Überprüfe, ob du auf diese Dateien zugreifen kannst oder ob deren Pfade sehr lang sind.
cli-game-line-item-redirected = Umgeleitet von: { $path }
cli-game-line-item-redirecting = Umleiten an: { $path }
button-backup = Sichern
button-preview = Vorschau
button-restore = Wiederherstellen
button-nav-backup = SICHERUNGSMODUS
button-nav-restore = WIEDERHERSTELLUNGSMODUS
button-nav-custom-games = BENUTZERDEFINIERTE SPIELE
button-nav-other = ANDERE
button-add-game = Spiel hinzufügen
button-continue = Weiter
button-cancel = Abbrechen
button-cancelling = Abbrechen...
button-okay = Okay
button-select-all = Alle auswählen
button-deselect-all = Alle abwählen
button-enable-all = Alle aktivieren
button-disable-all = Alle deaktivieren
button-customize = Anpassen
button-exit = Verlassen
button-comment = Kommentieren
button-lock = Sperren
button-unlock = Entsperren
# This opens a download page.
button-get-app = { $app } holen
button-validate = Überprüfen
button-override-manifest = Manifest überschreiben
button-extend-manifest = Manifest erweitern
button-sort = Sortieren
button-download = Herunterladen
button-upload = Hochladen
button-ignore = Ignorieren
no-roots-are-configured = Füge einige Wurzelverzeichnisse hinzu, um weitere Daten zu sichern.
config-is-invalid = Fehler: Die Konfigurationsdatei ist ungültig.
manifest-is-invalid = Fehler: Die Manifest-Datei ist ungültig.
manifest-cannot-be-updated = Fehler: Die Manifest-Datei konnte nicht auf eine Aktualisierung überprüft werden. Besteht eine Internetverbindung?
cannot-prepare-backup-target = Fehler: Das Sicherungsziel kann nicht vorbereitet werden (entweder beim Erstellen oder Leeren des Ordners). Falls du den Ordner in deinem Dateibrowser geöffnet hast, versuche diesen zu schließen: { $path }
restoration-source-is-invalid = Fehler: Die Wiederherstellungsquelle ist ungültig (entweder sie existiert nicht oder ist kein Verzeichnis). Bitte überprüfe den Speicherort: { $path }
registry-issue = Fehler: Einige Registrierungseinträge wurden übersprungen.
unable-to-browse-file-system = Fehler: Dateisystem kann nicht durchsucht werden.
unable-to-open-directory = Fehler: Verzeichnis konnte nicht geöffnet werden:
unable-to-open-url = Fehler: Kann URL nicht öffnen:
unable-to-configure-cloud = Cloud konnte nicht konfiguriert werden.
unable-to-synchronize-with-cloud = Cloud konnte nicht synchronisiert werden.
cloud-synchronize-conflict = Deine lokalen und Cloud-Backups stehen im Konflikt. Führe einen Upload oder Download durch, um das Problem zu lösen.
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
field-backup-excluded-items = Sicherungsausschlüsse:
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
label-checked = Überprüft
# This shows the time when we found an update to the manifest.
label-updated = Aktualisiert
label-new = Neu
label-removed = Entfernt
label-comment = Kommentar
label-unchanged = Unverändert
label-backup = Sicherung
label-scan = Scan
label-filter = Filter
label-unique = Einzigartig
label-complete = Vollständig
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
label-executable = Ausführbare Datei
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
label-change-count = Änderungen: { $total }
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
label-primary-manifest = Primäres Manifest
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
store-other-wine = Wine-Präfix
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
show-unchanged-games = Unveränderte Spiele anzeigen
show-unscanned-games = Ungescannte Spiele anzeigen
override-max-threads = Max. Threads übergehen
synchronize-automatically = Automatisch synchronisieren
prefer-alias-display = Alias statt Originalnamen anzeigen
skip-unconstructive-backups = Backup überspringen, wenn nur Daten entfernt werden würden, anstatt hinzugefügt oder geändert zu werden
explanation-for-exclude-store-screenshots = Storespezifische Bildschirmfotos aus Datensicherungen ausschießen
explanation-for-exclude-cloud-games = Auf diesen Plattformen keine Spiele mit Cloud-Unterstützung sichern
consider-doing-a-preview =
    Falls du es noch nicht getan hast, erwäge zuerst eine Vorschau zu machen, damit
    keine Überraschungen gibt.
confirm-backup =
    Bist du sicher, dass du mit der Sicherung fortfahren möchtest? { $path-action ->
        [merge] Neue Spielstanddaten werden mit dem Zielordner zusammengeführt:
       *[create] Der Zielordner wird erstellt:
    }
confirm-restore =
    Bist du sicher, dass du mit der Wiederherstellung fortfahren möchtest?
    Dies überschreibt alle aktuellen Dateien mit den Sicherungen von hier:
confirm-cloud-upload =
    Möchtest du deine Cloud-Dateien mit deinen lokalen Dateien ersetzen?
    Deine Cloud-Dateien ({ $cloud-path }) werden zu einer exakten Kopie deiner lokalen Dateien ({ $local-path }).
    Dateien in der Cloud werden bei Bedarf aktualisiert oder gelöscht.
confirm-cloud-download =
    Möchtest du deine lokalen Dateien mit deinen Cloud-Dateien ersetzen?
    Deine lokalen Dateien ({ $local-path }) werden zu einer exakten Kopie deiner Cloud-Dateien ({ $cloud-path }).
    Lokale Dateien werden bei Bedarf aktualisiert oder gelöscht.
confirm-add-missing-roots = Diese Wurzelverzeichnisse hinzufügen?
no-missing-roots = Keine weiteren Wurzelverzeichnisse gefunden.
loading = Lädt …
preparing-backup-target = Sicherungsverzeichnis wird vorbereitet...
updating-manifest = Manifest wird aktualisiert...
no-cloud-changes = Keine zu sychronisierenden Änderungen
backups-are-valid = Deine Sicherungen sind gültig.
backups-are-invalid =
    Die Sicherungen dieser Spiele scheinen ungültig zu sein.
    Möchtest du für diese Spiele neue vollständige Sicherungen erstellen?
saves-found = Spielstanddaten gefunden.
no-saves-found = Keine Spielstanddaten gefunden.
# This is tacked on to form something like "Back up (no confirmation)",
# meaning we would perform an action without asking the user if they're sure.
suffix-no-confirmation = ohne Bestätigung
# This is shown when a setting will only take effect after closing and reopening Ludusavi.
suffix-restart-required = Neustart erforderlich
prefix-error = Fehler: { $message }
prefix-warning = Warnung: { $message }
cloud-app-unavailable = Cloud-Backups sind deaktiviert, da { $app } nicht verfügbar ist.
cloud-not-configured = Cloud-Backups sind deaktiviert, da kein Cloudsystem konfiguriert ist.
cloud-path-invalid = Cloud-Backups sind deaktiviert, da der Backup-Pfad ungültig ist.
game-is-unrecognized = Ludusavi erkennt dieses Spielt nicht.
game-has-nothing-to-restore = Dieses Spiel hat keine wiederherzustellende Sicherungskopie.
launch-game-after-error = Spiel trotzdem starten?
game-did-not-launch = Spiel konnte nicht gestartet werden.
backup-is-newer-than-current-data = The existing backup is newer than the current data.
backup-is-older-than-current-data = The existing backup is older than the current data.
back-up-specific-game =
    .confirm = Spielstanddaten für { $game } sichern?
    .failed = Spielstanddaten für { $game } konnten nicht gesichert werden.
restore-specific-game =
    .confirm = Spielstanddaten für { $game } wiederherstellen?
    .failed = Spielstanddaten für { $game } konnten nicht wiederhergestellt werden.
new-version-check = Automatisch nach Aktualisierungen der Anwendung suchen
new-version-available = Eine Anwendungsaktualisierung ist verfügbar: { $version }. Möchtest du die Versionshinweise ansehen?
custom-game-will-override = Dieses benutzerdefinierte Spiel überschreibt einen Manifest-Eintrag
custom-game-will-extend = Dieses benutzerdefinierte Spiel erweitert einen Manifest-Eintrag
operation-will-only-include-listed-games = Hiermit werden nur die derzeit aufgelisteten Spiele verarbeitet

luducard-community-title = Save Share HUB
luducard-community-desc = Teile und lade Community-Spielstände herunter
luducard-btn-share-checkpoint = Spielstand teilen
luducard-repo-disconnected = Community-Repository nicht verbunden
luducard-repo-disconnected-desc = Um Community-Spielstände zu laden und deine eigenen zu teilen, musst du deine Supabase-URL und den öffentlichen Anon-Key in den Einstellungen konfigurieren.
luducard-how-to-config = Konfiguration:
luducard-config-step-1 = Erstelle ein kostenloses Projekt auf Supabase.
luducard-config-step-2 = Erstelle die Tabellen durch Ausführen des SQL-Skripts in supabase/schema.sql.
luducard-config-step-3 = Trage die API-URL und den Anon-Key in den Luducard-Einstellungen ein.
luducard-checkpoints = Checkpoints
luducard-contributors = Mitwirkende
luducard-search-placeholder = Nach Spiel oder Checkpoint suchen...
luducard-sort-popular = Beliebt
luducard-sort-recent-hub = Neueste
luducard-sort-size-hub = Größe
luducard-syncing-repo = Synchronisiere mit dem öffentlichen Repository...
luducard-no-checkpoints-found = Keine Checkpoints gefunden
luducard-no-checkpoints-available = Keine Checkpoints verfügbar
luducard-search-terms-desc = Versuche es mit anderen Suchbegriffen.
luducard-be-first-desc = Sei der Erste, der einen Community-Spielstand teilt!
luducard-hub-unreachable-title = Repository konnte nicht erreicht werden
luducard-hub-unreachable-desc = Der Server hat nicht geantwortet. Prüfe deine Internetverbindung — falls sie funktioniert, ist das Repository möglicherweise vorübergehend offline.
luducard-hub-rejected-title = Repository hat die Verbindung abgelehnt
luducard-hub-rejected-desc = Der konfigurierte Supabase-Schlüssel wurde abgelehnt. Prüfe die URL und den Anon Key in den Einstellungen.
luducard-hub-error-title = Repository hat einen Fehler zurückgegeben
luducard-hub-error-desc = Der Server hat mit einem Fehler geantwortet, die Liste konnte nicht geladen werden.
luducard-btn-try-again = Erneut versuchen
luducard-no-desc-provided = Keine detaillierte Beschreibung vorhanden.
luducard-author-by = von
luducard-zstd-verified = Enthält verifizierte zstd-Metadaten
luducard-btn-install = Installieren
luducard-btn-installing = Installiere...
luducard-security-sandbox-title = Automatische Safe-Crash- und Sandbox-Sicherheit
luducard-security-sandbox-desc = Beim Installieren eines Community-Spielstands erstellt Luducard automatisch ein Backup deines aktuellen Spielstands. Falls etwas schiefgeht, kannst du das vorherige Backup aus dem Verlauf wiederherstellen.
luducard-share-checkpoint-modal = Checkpoint teilen
luducard-publish-progress-desc = Veröffentliche deine Spielstandsdatei für die Community.
luducard-save-game-label = Spielstand *
luducard-search-installed-game = Tippe, um nach einem installierten Spiel zu suchen...
luducard-backup-version-label = Backup-Version *
luducard-no-local-backups-desc = Für dieses Spiel wurden noch keine lokalen Backups erstellt. Erstelle zuerst ein Backup in der Spielkarte.
luducard-checkpoint-title-label = Checkpoint-Titel *
luducard-checkpoint-title-placeholder = Z. B. Vor Malenia oder Level 100 100% abgeschlossen
luducard-checkpoint-author-label = Name des Autors
luducard-checkpoint-author-placeholder = Z. B. Anonym
luducard-checkpoint-desc-label = Beschreibung / Zusätzliche Hinweise
luducard-checkpoint-desc-placeholder = Beschreibe Details wie Build, Level, wichtige Items oder den Fortschrittspunkt.
luducard-checkpoint-tags-label = Checkpoint-Tags
luducard-btn-cancel = Abbrechen
luducard-btn-publishing = Veröffentliche...
luducard-btn-publish = Checkpoint veröffentlichen
luducard-detail-modal-desc = Zeige vollständige Checkpoint-Metadaten an.
luducard-btn-close = Schließen
luducard-btn-download-install = Herunterladen & Installieren
luducard-detail-title-label = Checkpoint-Titel:
luducard-detail-desc-label = Fortschrittsbeschreibung:
luducard-detail-tags-label = Tags:
luducard-detail-size-label = Komprimierte Größe:
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
luducard-search-terms-desc-preset = Versuche, deine Suchbegriffe zurückzusetzen.
luducard-badge-official = Offiziell
luducard-gpu = GPU
luducard-approval = Bewertung
luducard-useful = Nützlich
luducard-useless = Unnütz
luducard-report-preset = Preset melden
luducard-btn-undo = Rückgängig
luducard-btn-inject = Injizieren
luducard-btn-injecting = Injiziere...
luducard-not-installed = Nicht installiert
luducard-security-safety-title = Sicherheit durch Safe-Crash garantiert
luducard-security-safety-desc = Beim Herunterladen eines Grafik-Presets aus dem HUB sichert Luducard deine vorherigen Einstellungen. Deine Spielstände bleiben unberührt.
luducard-share-preset-modal-title = Grafik-Preset teilen
luducard-share-preset-modal-desc = Sende ein lokales Grafik-Preset an die Community.
luducard-preset-game-label = Spiel des Presets *
luducard-search-installed-game-preset = Installiertes Spiel suchen...
luducard-choose-local-preset-label = Lokales Preset auswählen *
luducard-no-local-presets-desc = Keine lokalen Presets für dieses Spiel gespeichert. Erstelle zuerst ein lokales Preset in der Spielkarte!
luducard-preset-title-label = Preset-Titel *
luducard-preset-creator-label = Autor / Ersteller
luducard-preset-desc-label = Beschreibung / Preset-Notizen
luducard-preset-tags-label = Preset-Tags
luducard-preset-hardware-label = Hardware des Autors (automatisch ausgefüllt):
luducard-cpu = CPU
luducard-ram = RAM
luducard-btn-publish-preset = Preset veröffentlichen
luducard-detail-preset-title = Preset-Titel:
luducard-detail-preset-desc = Beschreibung / Optimierungen:
luducard-detail-author-specs = Hardware des Autors:

luducard-tag-desc-100 = Spiel zu 100% abgeschlossen mit allen Errungenschaften, Gegenständen und Sammelobjekten freigeschaltet.
luducard-tag-desc-dlc1 = Fokus auf oder bereit für den ersten DLC.
luducard-tag-desc-dlc2 = Fokus auf oder bereit für den zweiten DLC.
luducard-tag-desc-ngplus = Bereit für oder bereits gestartet im Modus Neues Spiel+.
luducard-tag-desc-vanilla = Fortschritt des Originalspiels komplett sauber, ohne Modifikatoren, Mods oder Cheats.
luducard-tag-desc-modded = Fortschritt mit Modifikationen (Mods) erzielt, die das Gameplay verändern können.
luducard-tag-desc-bossprep = Spielstand strategisch direkt vor einem wichtigen Boss platziert.
luducard-tag-desc-starter = Spielstand am Anfang des Spiels, mit angesammelten Ressourcen oder übersprungenem Tutorial.
luducard-tag-desc-cleanstart = Spielstand direkt nach der Charaktererstellung oder Einführung, bereit zum direkten Start.
luducard-tag-desc-midgame = Spielstand in der Mitte der Hauptkampagne (ideal bei Fortschrittsverlust).
luducard-tag-desc-postgame = Kampagne abgeschlossen, ideal zum Erkunden geheimer Bosse, ausstehender Errungenschaften oder Nebenaktivitäten.
luducard-tag-desc-opbuild = Spielstand fokussiert auf einen Charakter mit extrem starker Ausrüstung, Level und Builds (Overpowered).
luducard-tag-desc-unlimitedcash = Spielstand fokussiert auf maximales oder unendliches Geld, Münzen oder Upgrade-Ressourcen.
luducard-tag-desc-allcollectibles = Spielstand mit Fokus auf sekundäre Errungenschaften und mühsame Sammelobjekte komplett freigeschaltet.
luducard-tag-desc-hardcore = Spielstände auf extremem Schwierigkeitsgrad oder mit permanentem Tod aktiviert (Überleben).
luducard-tag-desc-speedrunready = Spielstand ideal zum Trainieren von Speedrun-Abschnitten oder auf den schnellsten Routen platziert.
luducard-tag-desc-legit = Fortschritt sauber erzielt, ohne Cheats, Cheat-Codes oder das Ausnutzen von Fehlern (Glitches).
luducard-preset-tag-desc-perf = Optimierungen fokussiert auf FPS-Gewinn und Flüssigkeit.
luducard-preset-tag-desc-quality = Optimierungen fokussiert auf maximale Grafikqualität.
luducard-preset-tag-desc-balanced = Ideale Balance zwischen visueller Treue und FPS-Rate.
luducard-preset-tag-desc-deck = Speziell für Bildschirm und Akku des Steam Decks/Handhelds optimiertes Profil.
luducard-preset-tag-desc-potato = Zum Ausführen auf sehr alten PCs und bescheidenen Laptops.
luducard-preset-tag-desc-controls = Benutzerdefiniertes Mapping von Steuerung, Gamepad oder Hotkeys.
luducard-preset-tag-desc-rt = Verfeinerte Konfiguration mit aktivem Raytracing, ausgerichtet auf eine gute Bildrate.
luducard-preset-tag-desc-4k = Optimierungen fokussiert auf 4K-Fernseher und -Monitore mit hoher Auflösung.
luducard-preset-tag-desc-vr = Optimierte Einstellungen für eine ideale FPS-Rate in der virtuellen Realität.
luducard-files-mapped = zugeordnete Dateien

# Game detail: presets tab, backup details, backup kinds
luducard-pinned = Angeheftet
luducard-export-btn = Exportieren
luducard-my-presets-tab = Meine Presets (lokal & heruntergeladen)
luducard-community-presets-tab = Community-Presets
luducard-upload-to-hub-btn = Zum HUB hochladen
luducard-undo-restore-original = Rückgängig & Original wiederherstellen
luducard-fetching-cloud-presets = Presets werden aus der Cloud geladen...
luducard-installing = Wird installiert...
luducard-local-backup-details = Details des lokalen Backups
luducard-backup-type-label = Backup-Typ:
luducard-mapping-local-files = Lokale Dateien werden erfasst...
luducard-mapping-files = Dateien werden erfasst...
luducard-your-name-label = Dein Name / Nickname
luducard-detecting-hardware = Lokale Hardware wird erkannt...
luducard-cpu-full-label = Prozessor (CPU)
luducard-preset-detail-modal-desc = Vollständige Preset-Metadaten werden angezeigt.
luducard-shortcut-input-title = Klicken und die gewünschte Tastenkombination drücken
luducard-backup-kind-automatic = Automatisch
luducard-backup-kind-manual = Manuell
luducard-backup-kind-manual-locked = Manuell (gesperrt)
luducard-backup-kind-before-close = Vor dem Schließen
luducard-backup-kind-restore = Wiederherstellung

# Save Share: game picker
luducard-search-game-with-backups = Tippen, um ein Spiel mit Backups zu suchen...
luducard-no-games-with-backups = Keine Spiele mit Backups gefunden

# Conflict resolution, version locking, install results
luducard-toast-resolving-keep-local = Konflikt wird gelöst: lokale Version wird behalten von
luducard-toast-resolving-take-cloud = Konflikt wird gelöst: Cloud-Version wird geladen von
luducard-backup-of = Backup von
luducard-exported-from-backup = Exportiert aus dem lokalen Backup vom
luducard-toast-locking-version = Version wird gesperrt
luducard-toast-unlocking-version = Version wird entsperrt
luducard-toast-version-locked = Version gesperrt! Sie wird nicht automatisch gelöscht.
luducard-toast-version-unlocked = Version erfolgreich entsperrt.
luducard-error-game-not-found = nicht in deiner lokalen Bibliothek gefunden oder ohne konfigurierten Speicherordner.
luducard-game-label = Spiel
luducard-toast-checkpoint-installed = erfolgreich installiert! Der vorherige Spielstand wurde im Verlauf gesichert.
luducard-checkpoint-label = Checkpoint

# Toasts and status messages
luducard-toast-load-community-presets-failed = Fehler beim Laden der Community-Presets.
luducard-toast-load-profiles-failed = Fehler beim Laden der Speicherprofile.
luducard-toast-profile-title-required = Bitte gib einen Titel für das Profil ein.
luducard-toast-creating-profile = Neues Speicherprofil wird erstellt...
luducard-toast-select-config-file = Wähle mindestens eine Konfigurationsdatei aus.
luducard-toast-saving-local-preset = Lokale Einstellungen werden als Preset gespeichert...
luducard-confirm-delete-local-preset = Möchtest du dieses lokale Preset wirklich dauerhaft löschen?
luducard-toast-deleting-local-preset = Lokales Preset wird gelöscht...
luducard-toast-crash-safety-starting = Safe-Crash wird gestartet, um Einstellungen zu sichern...
luducard-toast-downloading-applying-preset = Optimiertes Einstellungs-Preset wird heruntergeladen und angewendet...
luducard-toast-community-preset-applied = Community-Preset erfolgreich angewendet! In deiner lokalen Bibliothek gespeichert.
luducard-toast-restoring-crash-safety = Ursprüngliche Konfigurationsdateien werden aus Safe-Crash wiederhergestellt...
luducard-toast-original-config-restored = Ursprüngliche Konfiguration erfolgreich wiederhergestellt! Spielstände unberührt.
luducard-toast-vote-failed = Stimme konnte nicht gezählt werden.
luducard-toast-report-sent-preset = Meldung gesendet! Das Preset wird nach 3 Meldungen aus der Community ausgeblendet.
luducard-toast-report-failed = Meldung konnte nicht gesendet werden.
luducard-toast-preset-title-required = Bitte fülle den Preset-Titel aus.
luducard-toast-packing-config-files = Konfigurationsdateien werden gepackt...
luducard-toast-publishing-preset-metadata = Preset-Metadaten werden in der Community veröffentlicht...
luducard-error-preset-cloud-limit = Du hast das Limit von 5 aktiven Presets in der Cloud erreicht.
luducard-toast-manage-deletions-in-app = Bitte verwalte das Löschen von Backups in der Haupt-App
luducard-toast-default-path-restored = Standardpfad erfolgreich wiederhergestellt!
luducard-toast-load-hub-failed = Fehler beim Laden der Preset-Hub-Daten.
luducard-toast-vote-error = Fehler beim Zählen der Stimme.
luducard-toast-report-sent-hub = Meldung gesendet! Presets mit 3+ Meldungen werden ausgeblendet.
luducard-toast-report-send-failed = Melden fehlgeschlagen.
luducard-toast-fill-required-fields = Bitte fülle alle Pflichtfelder aus.
luducard-toast-compressing-encrypting = Konfigurationsdateien werden komprimiert und verschlüsselt...
luducard-toast-requesting-upload-permission = Berechtigung für sicheren Upload wird angefordert...
luducard-toast-publishing-to-preset-repo = Metadaten werden im Preset-Repository veröffentlicht...
luducard-error-preset-cloud-limit-reached = Du hast das Limit von 5 aktiven Presets in der Cloud bereits erreicht.
luducard-toast-backend-connection-error = Verbindungsfehler mit dem App-Backend.
luducard-toast-requesting-cloud-upload-permission = Berechtigung für sicheren Cloud-Upload wird angefordert...
luducard-toast-publishing-to-public-repo = Metadaten werden im öffentlichen Repository veröffentlicht...
luducard-error-checkpoint-cloud-limit = Du hast das Limit von 5 aktiven Checkpoints in der Cloud bereits erreicht.
luducard-toast-save-note-failed = Notiz konnte nicht gespeichert werden
luducard-toast-save-note-failed-2 = Notiz konnte nicht gespeichert werden
luducard-toast-change-path-failed = Fehler beim Ändern des Pfads
luducard-toast-restore-path-failed = Fehler beim Wiederherstellen des Pfads
luducard-toast-backup-failed = Backup fehlgeschlagen
luducard-toast-restore-failed = Wiederherstellung fehlgeschlagen
luducard-toast-restore-version-failed = Version konnte nicht wiederhergestellt werden
luducard-toast-export-backup-failed = Backup-Export fehlgeschlagen
luducard-toast-change-version-status-failed = Versionsstatus konnte nicht geändert werden
luducard-toast-open-folder-failed = Fehler beim Öffnen des Ordners
luducard-toast-export-failed = Export fehlgeschlagen
luducard-toast-create-profile-failed = Profil konnte nicht erstellt werden
luducard-toast-switch-profile-failed = Fehler beim Profilwechsel
luducard-toast-delete-profile-failed = Fehler beim Löschen des Profils
luducard-toast-save-local-preset-failed = Lokales Preset konnte nicht gespeichert werden
luducard-toast-apply-local-preset-failed = Lokales Preset konnte nicht angewendet werden
luducard-toast-delete-preset-failed = Fehler beim Löschen des Presets
luducard-toast-apply-preset-failed = Preset konnte nicht angewendet werden
luducard-toast-restore-crash-safety-failed = Safe-Crash-Backup konnte nicht wiederhergestellt werden
luducard-error-register-preset-failed = Preset konnte nicht registriert werden
luducard-toast-publish-preset-failed = Fehler beim Veröffentlichen des Presets
luducard-error-get-download-url-failed = Download-URL konnte nicht abgerufen werden
luducard-toast-inject-preset-failed = Preset konnte nicht angewendet werden
luducard-toast-revert-configs-failed = Einstellungen konnten nicht zurückgesetzt werden
luducard-error-register-preset-failed-2 = Preset konnte nicht registriert werden
luducard-toast-publish-preset-failed-2 = Fehler beim Veröffentlichen des Presets
luducard-error-get-download-url-failed-2 = Download-URL konnte nicht abgerufen werden
luducard-toast-install-checkpoint-failed = Checkpoint konnte nicht heruntergeladen/installiert werden
luducard-error-register-checkpoint-failed = Checkpoint konnte nicht in der Datenbank registriert werden
luducard-toast-publish-failed = Fehler beim Veröffentlichen
luducard-toast-restoring-default-path = Standardpfad wird wiederhergestellt für
luducard-toast-local-version-saved = Lokale Version von
luducard-toast-saved-to-cloud = in der Cloud gespeichert!
luducard-toast-cloud-version-restored = Cloud-Version von
luducard-toast-restored-suffix = wiederhergestellt!
luducard-toast-resolve-conflict-failed = Konflikt konnte nicht gelöst werden für
luducard-toast-latest-version-restored = Neueste Version von
luducard-toast-restoring-version = Version wird wiederhergestellt
luducard-toast-version-restored = Version vom
luducard-toast-switching-profile = Wechsel zum Profil
luducard-toast-may-take-seconds = Das kann einige Sekunden dauern.
luducard-confirm-delete-profile = Möchtest du das Profil wirklich löschen:
luducard-confirm-delete-profile-warning = Alle Spielstände dieses Profils werden dauerhaft gelöscht.
luducard-toast-deleting-profile = Profil wird gelöscht
luducard-toast-profile-deleted = Profil
luducard-toast-deleted-suffix = erfolgreich gelöscht!
luducard-toast-starting-crash-safety-for = Safe-Crash wird gestartet für die Einstellungen von
luducard-toast-local-preset-applied = Lokales Preset
luducard-toast-applied-suffix = erfolgreich angewendet!
luducard-error-quota-or-limit = Kontingent- oder Limitfehler im Repository.
luducard-toast-starting-crash-safety-for-game = Safe-Crash wird gestartet für die Einstellungen von
luducard-toast-installing-preset = Preset wird installiert
luducard-toast-restoring-original-settings = Ursprüngliche Einstellungen werden wiederhergestellt für
luducard-toast-settings-restored = Einstellungen von
luducard-toast-restored-saves-untouched = wiederhergestellt. Spielstände unberührt!
luducard-error-cloud-storage-quota = Fehler beim Cloud-Speicherkontingent.
luducard-toast-uploading-preset = Preset wird in die Cloud hochgeladen
luducard-toast-preset-applied-saved = Preset angewendet und in deinen lokalen Presets gespeichert. Safe-Crash aktiv!
luducard-toast-fill-required-fields-cm = Bitte fülle alle Pflichtfelder aus.
luducard-toast-downloading-checkpoint = Checkpoint wird heruntergeladen und installiert... Safe-Crash erstellt ein automatisches Backup.
luducard-error-cloud-storage-quota-limit = Fehler beim Cloud-Speicherkontingent/-limit.

# Game detail: presets & configs
luducard-restore-btn = Wiederherstellen
luducard-delete-version = Version löschen
luducard-unpin-version = Version lösen (automatisches Löschen erlauben)
luducard-pin-version = Version anheften (automatisches Löschen verhindern)
luducard-save-current-config = Aktuelle Konfiguration speichern
luducard-save-current-config-desc = Erstelle ein lokales Preset aus den aktiven Einstellungen deines Spiels.
luducard-save-new-config-btn = Neue Konfiguration speichern
luducard-no-local-presets = Keine lokalen Presets
luducard-no-local-presets-hint = Erfasse deine lokalen Grafik- und Steuerungseinstellungen, um sie als Preset zu speichern oder zu teilen.
luducard-no-description = Keine Beschreibung.
luducard-apply-btn = Anwenden
luducard-crash-safety-active = Safe-Crash aktiv
luducard-crash-safety-active-desc = Du hast kürzlich ein Preset angewendet. Bei Problemen stelle die ursprünglichen Konfigurationen wieder her.
luducard-no-community-presets = Keine Community-Presets
luducard-no-community-presets-desc = Für dieses Spiel sind keine Presets in der Cloud veröffentlicht. Erstelle ein lokales und teile es!
luducard-downloads-label = Downloads:
luducard-download-apply-btn = Herunterladen & Anwenden
luducard-delete = Löschen
luducard-version-info-desc = Versionsinformationen und Kampagnennotizen.
luducard-date-time-label = Datum und Uhrzeit:
luducard-at = um
luducard-file-size-label = Dateigröße:
luducard-campaign-notes-label = Kampagnennotizen / Fortschrittsbeschreibung
luducard-campaign-notes-placeholder = Z. B. Nach dem Drachen aufgehört. Level 45, Geschicklichkeits-Build...
luducard-save-notes-btn = Notizen speichern
luducard-share-config-preset-title = Konfigurations-Preset teilen
luducard-share-config-preset-desc = Speichere deine lokalen Optimierungen und sende sie an die Community.
luducard-detected-config-files = Erkannte Konfigurationsdateien:
luducard-no-config-files-detected = Konfigurationsdateien konnten über das Ludusavi-Mapping nicht erkannt werden.
luducard-preset-title-placeholder = Z. B. Potato Mode (Max Performance) oder Balanced DF Specs
luducard-preset-desc-detailed-label = Beschreibung (Spielversion, geschätzte FPS-Gewinne usw.)
luducard-preset-desc-placeholder = Z. B. Rund 15 % mehr FPS in der Stadt. Getestet mit Version 1.63.
luducard-detected-hardware-label = Erkannte Hardware (Angaben des Autors):
luducard-gpu-label = Grafikkarte (GPU)
luducard-ram-label = Arbeitsspeicher (RAM)
luducard-create-local-preset-title = Lokales Preset erstellen
luducard-create-local-preset-desc = Speichere die aktuellen Einstellungen dieses Spiels in einem lokalen Profil.
luducard-local-preset-title-placeholder = Z. B. Meine 60fps-Optimierung oder Flugsteuerung
luducard-local-preset-desc-placeholder = Beschreibe, was dieses Preset ändert (z. B. reduziert volumetrische Schatten für mehr Leistung).
luducard-included-files-label = Enthaltene Dateien (automatisch erkannt):
luducard-no-files-detected = Von Ludusavi wurden keine Dateien erkannt.
luducard-create-preset-btn = Preset erstellen
luducard-no-presets-here = Hier gibt es noch keine Presets
luducard-be-first-to-share = Sei der Erste, der ein Grafik- oder Steuerungs-Preset mit der Community teilt!

# Save profiles (modding)
luducard-activate-profile-btn = Profil aktivieren
luducard-active-profile-banner = Aktives Profil im System:
luducard-active-profile-banner-desc = Beim Profilwechsel werden die aktuellen Spielstände aus dem Spielordner automatisch im zuvor aktiven Profil gesichert, um Datenverlust zu vermeiden.
luducard-cancel = Abbrechen
luducard-cant-delete-active = Das aktive Profil kann nicht gelöscht werden
luducard-change-save-path-btn = Speicherpfad ändern
luducard-clone-current-saves = Aktuellen Fortschritt klonen
luducard-clone-current-saves-desc = Kopiert die aktuell im Spielordner vorhandenen Spielstände in dieses Profil (empfohlen).
luducard-cloud-sync = Cloud-Synchronisierung
luducard-cloud-sync-upload = In die Cloud hochladen
luducard-confirm-reset-save-path = Möchtest du den Speicherpfad dieses Spiels wirklich auf den Manifest-Standard zurücksetzen?
luducard-create-profile-btn = Profil erstellen
luducard-new-save-profile-btn = Neues Speicherprofil
luducard-create-profile-desc = Starte eine parallele Kampagne oder isoliere Spielstände mit Mods.
luducard-create-profile-title = Speicherprofil erstellen
luducard-created-at = Erstellt am
luducard-creation-options = Startoptionen:
luducard-delete-profile = Profil löschen
luducard-loading-profiles = Speicherprofile werden geladen...
luducard-no-profiles-desc = Das Spiel verwendet die Standard-Speicherdateien deines Systems. Erstelle das erste Profil, um deine Kampagnen zu organisieren.
luducard-no-profiles-yet = Keine Speicherprofile
luducard-no-save-path = Pfad nicht konfiguriert
luducard-none = Keines (lose Spielstände in Verwendung)
luducard-profile-active-tag = Im System aktiv
luducard-profile-desc-label = Beschreibung
luducard-profile-desc-placeholder = Beschreibe den Zweck dieses Profils (z. B. Spiel mit der Krieger-Klasse).
luducard-profile-inactive-tag = Inaktiv
luducard-profile-name-label = Profilname *
luducard-profile-name-placeholder = Z. B. Meine Vanilla-Kampagne oder Modded Run
luducard-profiles-header = Verwaltung der Speicherprofile
luducard-profiles-intro = Erstelle getrennte Kampagnen oder isoliere modifiziertes Gameplay. Luducard wechselt und sichert die zugehörigen Spielstände automatisch.
luducard-reset-save-path-btn = Auf Standardpfad zurücksetzen
luducard-save-profiles-tab = Speicherprofile
luducard-save-profiles-title = Speicherprofile (Modding)
luducard-start-empty = Bei null anfangen (leer)
luducard-start-empty-desc = Der aktuelle Speicherordner des Spiels wird geleert, damit du einen komplett neuen Fortschritt beginnen kannst.

luducard-anonymous = Anonym
luducard-author-by-label = Von:
luducard-preset-downloaded-from-community = Aus der Community heruntergeladen - Autor
luducard-preset-tag-perf = Leistung
luducard-preset-tag-quality = Qualität / Optik
luducard-preset-tag-balanced = Ausgewogen
luducard-preset-tag-deck = Steam Deck
luducard-preset-tag-potato = Kartoffel-Modus
luducard-preset-tag-controls = Steuerung / Layout
luducard-preset-tag-rt = Raytracing-Opt.
luducard-preset-tag-4k = 4K-fähig
luducard-preset-tag-vr = VR-fähig

luducard-schedule-auto-routine = Automatische Backup-Routine
luducard-schedule-auto-routine-desc = Lege fest, wann automatische Backups durchgeführt werden sollen.
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
luducard-schedule-games-in-schedule-desc = Wähle aus, welche Spiele diesem automatischen Ablauf folgen sollen.
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
luducard-notification-alerts-desc = Wähle aus, wie du über Backups informiert werden möchtest.
luducard-notification-windows = Windows-Benachrichtigungen
luducard-notification-windows-desc = Benachrichtigen, wenn ein Backup erfolgreich abgeschlossen wurde.
luducard-notification-toast-enabled = Benachrichtigungen aktiviert
luducard-notification-toast-disabled = Benachrichtigungen deaktiviert
luducard-notification-fail-alerts = Fehlermeldungen
luducard-notification-fail-alerts-desc = Sofort benachrichtigen, wenn ein Backup fehlschlägt.
luducard-notification-toast-fail-enabled = Fehlermeldungen aktiviert
luducard-notification-toast-fail-disabled = Fehlermeldungen deaktiviert
luducard-notification-sounds = Hinweistöne
luducard-notification-sounds-desc = Einen Ton abspielen, wenn ein Backup abgeschlossen wird oder fehlschlägt.
luducard-notification-toast-sounds-enabled = Töne aktiviert
luducard-notification-toast-sounds-disabled = Töne deaktiviert
luducard-cloud-details-title = Account Details
luducard-cloud-provider = Connected Provider:
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
luducard-support-dest-desc = All contributions go entirely to cloud server maintenance (hosting and data traffic).
luducard-danger-zone = Danger Zone
luducard-danger-zone-desc = Destructive actions that cannot be undone.
luducard-reset-warning-title = IMPORTANT WARNING:
luducard-reset-warning-desc = This will permanently erase all settings, custom search paths, game scan history, cloud credentials, and save profiles. Original backup folders on disk will not be deleted.
luducard-btn-reset-app = Clear All Data
luducard-btn-reset-confirm = Yes, Confirm Deletion
luducard-btn-reset-cancel = Cancel
