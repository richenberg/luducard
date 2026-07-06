ludusavi = Ludusavi
language = SprÃ¥k
game-name = Navn
total-games = Spill
file-size = StÃ¸rrelse
file-location = Plassering
overall = Generelt
status = Status
cli-unrecognized-games = Ingen informasjon for disse spillene:
cli-unable-to-request-confirmation = Kunne ikke be om bekreftelse.
    .winpty-workaround = Hvis du bruker en Bash-emulator (som f.eks. Git Bash), kan du prÃ¸ve Ã¥ kjÃ¸re winpty.
cli-backup-id-with-multiple-games = Kan ikke spesifisere sikkerhetskopi-ID nÃ¥r man gjenoppretter flere spill.
cli-invalid-backup-id = Ugyldig sikkerhetskopi-ID.
badge-failed = FEILET
badge-duplicates = DUPLIKATER
badge-duplicated = DUPLISERTE
badge-ignored = IGNORERTE
badge-redirected-from = FRA: { $path }
badge-redirecting-to = TIL: { $path }
some-entries-failed = Noen oppfÃ¸ringer feilet med Ã¥ prosessere; se etter { badge-failed } i utdataen for detaljer. Dobbel sjekk om du har tilgang til filene, eller om filstiene for de filene er veldig lange.
cli-game-line-item-redirected = Omdirigert fra: { $path }
cli-game-line-item-redirecting = Omdirigerer til: { $path }
button-backup = Sikkerhetskopier
button-preview = ForhÃ¥ndsvisning
button-restore = Gjenopprett
button-nav-backup = SIKKERHETSKOPI-MODUS
button-nav-restore = GJENOPPRETTINGS-MODUS
button-nav-custom-games = TILPASSEDE SPILL
button-nav-other = ANNET
button-add-game = Legg til spill
button-continue = Fortsett
button-cancel = Avbryt
button-cancelling = Avbryter...
button-okay = Okei
button-select-all = Velg alt
button-deselect-all = Velg bort alt
button-enable-all = Aktiver alle
button-disable-all = Deaktiver alle
button-customize = Endre
button-exit = Avslutt
button-comment = Kommentar
button-lock = LÃ¥s
button-unlock = LÃ¥s opp
# This opens a download page.
button-get-app = FÃ¥ { $app }
button-validate = Valider
button-override-manifest = Overstyr manifest
button-extend-manifest = Utvid manifest
button-sort = Sorter
button-download = Last ned
button-upload = Last opp
button-ignore = Ignorer
no-roots-are-configured = Legg til noen rot-filstier for Ã¥ sikkerhetskopiere enda mer lagringsdata.
config-is-invalid = Feil: Konfigurasjons-filen er ugyldig.
manifest-is-invalid = Feil: manifest filen er ugyldig.
manifest-cannot-be-updated = Feil: Kunne ikke sjekke om det er oppdateringer i manifest filen. Er internett-tilkoblingen din nede?
cannot-prepare-backup-target = Feil: Kunne ikke klargjÃ¸re sikkerhetskopi-mÃ¥let (enten ved opprettelse eller tÃ¸mming av mappen). Hvis du har mappen Ã¥pen i filutforskeren din, prÃ¸v Ã¥ lukke den: { $path }
restoration-source-is-invalid = Feil: Gjenopprettingskilden er ugyldig (enten finnes den ikke, eller er ikke en filsti.) Vennligst dobbeltsjekk plasseringen: { $path }
registry-issue = Feil: Noen registeroppfÃ¸ringer ble hoppet over.
unable-to-browse-file-system = Feil: Kunne ikke sÃ¸ke i systemet ditt.
unable-to-open-directory = Feil: Kunne ikke Ã¥pne filsti:
unable-to-open-url = Feil: Kunne ikke Ã¥pne URL:
unable-to-configure-cloud = Kunne ikke konfigurere sky.
unable-to-synchronize-with-cloud = Kunne ikke synkronisere med sky.
cloud-synchronize-conflict = Dine lokale og sky -sikkerhetskopier har konflikter. GjÃ¸r en opplastning eller nedlastning for Ã¥ lÃ¸se dette problemet.
command-unlaunched = Kommando ble ikke startet: { $command }
command-terminated = Kommando ble plutselig avbrutt: { $command }
command-failed = Kommando feilet med koden: { $code }: { $command }
processed-games = { $total-games } spill
processed-games-subset = { $processed-games } av { $total-games } spill
processed-size-subset = { $processed-size } av { $total-size }
field-backup-target = Sikkerhetskopier til:
field-restore-source = Gjenopprett fra:
field-custom-files = Plasseringer:
field-custom-registry = Register:
field-sort = Sorter:
field-redirect-source =
    .placeholder = Kilde (original plassering)
field-redirect-target =
    .placeholder = MÃ¥l (ny plassering)
field-roots = Rot-filstier:
field-backup-excluded-items = Sikkerhetskopi-eksluderinger:
field-redirects = Omdirigeringer:
# This appears next to the number of full backups that you'd like to keep.
# A full backup includes all save files for a game.
field-retention-full = Full:
# This appears next to the number of differential backups that you'd like to keep.
# A differential backup includes only the files that have changed since the last full backup.
field-retention-differential = Differensial:
field-backup-format = Format:
field-backup-compression = Komprimering:
# The compression level determines how much compresison we perform.
field-backup-compression-level = NivÃ¥:
label-manifest = Manifest
# This shows the time when we checked for an update to the manifest.
label-checked = Sjekket
# This shows the time when we found an update to the manifest.
label-updated = Oppdatert
label-new = Ny
label-removed = Fjernet
label-comment = Kommentar
label-unchanged = Uforandret
label-backup = Sikkerhetskopi
label-scan = Skann
label-filter = Filter
label-unique = Unik
label-complete = Ferdig
label-partial = Delvis
label-enabled = Aktivert
label-disabled = Deaktivert
# https://en.wikipedia.org/wiki/Thread_(computing)
label-threads = TrÃ¥der
label-cloud = Sky
# A "remote" is what Rclone calls cloud systems like Google Drive.
label-remote = Ekstern
label-remote-name = Eksternt navn
label-folder = Mappe
# An executable file
label-executable = KjÃ¸rbar fil
# Options given to a command line program
label-arguments = Argumenter
label-url = URL
# https://en.wikipedia.org/wiki/Host_(network)
label-host = Vert
# https://en.wikipedia.org/wiki/Port_(computer_networking)
label-port = Port
label-username = Brukernavn
label-password = Passord
# This is a specific website or service that provides some cloud functionality.
# For example, Nextcloud and Owncloud are providers of WebDAV services.
label-provider = LeverandÃ¸r
label-custom = Tilpasset
label-none = Ingen
label-change-count = Endringer: { $total }
label-unscanned = Uskannet
# This refers to a local file on the computer
label-file = Fil
label-game = Spill
# Aliases are alternative titles for the same game.
label-alias = Alias
label-original-name = Original navn
# Which manifest a game's data came from
label-source = Kilde
# This refers to the main Ludusavi manifest: https://github.com/mtkennerly/ludusavi-manifest
label-primary-manifest = PrimÃ¦r manifest
# This refers to how we integrate a custom game with the manifest data.
label-integration = Intergrering
# This is a folder name where a specific game is installed
label-installed-name = Installert navn
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
store-other-home = Hjemmappe
# This would be a folder acting as a virtual C: drive, created by Wine.
store-other-wine = Wine-prefiks
# This would be a folder with typical Windows system folders,
# like "Program Files (x86)" and "Users".
store-other-windows = Windows stasjon
# This would be a folder with typical Linux system folders,
# like "home" and "opt".
store-other-linux = Linux stasjon
# This would be a folder with typical Mac system folders,
# like "Applications" and "Users".
store-other-mac = Mac stasjon
store-other = Annet
backup-format-simple = Enkel
backup-format-zip = Zip
compression-none = Ingen
# "Deflate" is a proper noun: https://en.wikipedia.org/wiki/Deflate
compression-deflate = Deflatere
compression-bzip2 = Bzip2
compression-zstd = Zstd
theme = Tema
theme-light = Lys
theme-dark = MÃ¸rk
redirect-bidirectional = Bidireksjonell
reverse-redirects-when-restoring = Omvendt rekkefÃ¸lge av omdirigeringer ved gjenoppretting
show-disabled-games = Vis deaktiverte spill
show-unchanged-games = Vis uendrede spill
show-unscanned-games = Vis uskannede spill
override-max-threads = Overskriv maks antall trÃ¥der
synchronize-automatically = Synkroniser automatisk
prefer-alias-display = Vis alias i stedet for originalt navn
skip-unconstructive-backups = Hopp over sikkerhetskopiering nÃ¥r data skal ha blitt fjernet, men ikke lagt til eller oppdatert
explanation-for-exclude-store-screenshots = I sikkerhetskopier; ekskluder butikk-spesifikke skjermdumper
explanation-for-exclude-cloud-games = Ikke sikkerhetskopier spill med sky-stÃ¸tte for disse plattformene
consider-doing-a-preview = Hvis du ikke allerede har gjort det, bÃ¸r du vurdere Ã¥ gjÃ¸re en forhÃ¥ndsvisning fÃ¸rst, slik at det er ingen overraskelser.
confirm-backup =
    Er du sikker pÃ¥ at du vil fortsette med sikkerhetskopieringen? { $path-action ->
        [merge] Nye lagringsdata kommer til Ã¥ bli slÃ¥tt sammen med mÃ¥lmappen:
       *[create] MÃ¥lmappen kommer til Ã¥ bli opprettet:
    }
confirm-restore = Er du sikker pÃ¥ at du vil fortsette med gjenopprettingen? Dette kommer til Ã¥ overskrive gjeldende Ã¥pne filer med sikkerhetskopier fra her:
confirm-cloud-upload =
    Vil du erstatte sky-filene dine med dine lokale filer? Dine sky-filer ({ $cloud-path }) kommer til Ã¥ bli en eksakt kopi av dine lokale filer ({ $local-path }).
    Filer i skyen kommer til Ã¥ bli oppdatert eller slettet etter behov.
confirm-cloud-download =
    Vil du erstatte dine lokale filer med sky-filene dine? Dine lokale filer ({ $cloud-path }) kommer til Ã¥ bli en eksakt kopi av dine sky-filer ({ $local-path }).
    Lokale filer kommer til Ã¥ bli oppdatert eller slettet etter behov.
confirm-add-missing-roots = Legg til disse rot-filstiene?
no-missing-roots = Ingen ytterlige rot-filstier funnet.
loading = Laster...
preparing-backup-target = Forbereder sikkerhetskopi-filsti...
updating-manifest = Oppdaterer manifest...
no-cloud-changes = Ingen endringer Ã¥ synkronisere
backups-are-valid = Sikkerhetskopiene dine er ugyldige.
backups-are-invalid = Sikkerhetskopiene til disse spillene ser ut til Ã¥ vÃ¦re ugyldige. Vil du lage nye fullstendige sikkerhetskopier for disse spillene?
saves-found = Lagringsdata funnet.
no-saves-found = Ingen lagringsdata funnet.
# This is tacked on to form something like "Back up (no confirmation)",
# meaning we would perform an action without asking the user if they're sure.
suffix-no-confirmation = ingen bekreftelse
# This is shown when a setting will only take effect after closing and reopening Ludusavi.
suffix-restart-required = omstart nÃ¸dvendig
prefix-error = Feil: { $message }
prefix-warning = Advarsel: { $message }
cloud-app-unavailable = Sky-sikkerhetskopier er deaktivert pÃ¥ grunn av at { $app } ikke er tilgjengelig.
cloud-not-configured = Sky-sikkerhetskopier er deaktivert pÃ¥ grunn av at ingen sky-systemer er konfigurert.
cloud-path-invalid = Sky-sikkerhetskopier er deaktivert pÃ¥ grunn av at sikkerhetskopi-filstien er ugyldig.
game-is-unrecognized = Ludusavi kjenner ikke igjen spillet.
game-has-nothing-to-restore = Dette spillet har ikke en sikkerhetskopi Ã¥ gjenopprette.
launch-game-after-error = Ã…pne spillet uansett?
game-did-not-launch = Spill feilet med Ã¥ starte.
backup-is-newer-than-current-data = Den eksisterende sikkerhetskopien er nyere enn de nÃ¥vÃ¦rende dataene.
backup-is-older-than-current-data = Den eksisterende sikkerhetskopien er gamlere enn de nÃ¥vÃ¦rende dataene.
back-up-specific-game =
    .confirm = Sikkerhetskopier lagringsdata for { $game }?
    .failed = Feilet med Ã¥ sikkerhetskopiere lagringsdata for { $game }
restore-specific-game =
    .confirm = Gjenopprett lagringsdata for { $game }?
    .failed = Feilet med Ã¥ gjenopprette lagringsdata for { $game }
new-version-check = Sjekk for programoppdateringer automatisk
new-version-available = En programoppdatering er tilgjenglig: { $version }. Vil du se utgivelses-notatene?
custom-game-will-override = Dette tilpassede spillet overskriver en manifest oppfÃ¸ring
custom-game-will-extend = Dette tilpassede spillet utvider en manifest oppfÃ¸ring
operation-will-only-include-listed-games = Dette kommer bare til Ã¥ prosessere spillene som er for Ã¸yeblikket oppfÃ¸rt
