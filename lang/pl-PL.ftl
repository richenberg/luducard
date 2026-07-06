ludusavi = Ludusavi
language = JÄ™zyk
game-name = Nazwa
total-games = Gry
file-size = Rozmiar
file-location = Lokalizacja
overall = CaÅ‚oÅ›ciowo
status = Status
cli-unrecognized-games = Brak informacji dla tych gier:
cli-unable-to-request-confirmation = BÅ‚Ä…d Å¼Ä…dania potwierdzenia.
    .winpty-workaround = JeÅ›li korzystasz z emulatora Bash (takiego jak Git Bash), sprÃ³buj uruchomiÄ‡ winpty.
cli-backup-id-with-multiple-games = Nie moÅ¼na okreÅ›liÄ‡ identyfikatora kopii zapasowej podczas przywracania wielu gier.
cli-invalid-backup-id = NieprawidÅ‚owy identyfikator kopii zapasowej.
badge-failed = NIEPOWODZENIE
badge-duplicates = DUPLIKATY
badge-duplicated = ZDUPLIKOWANE
badge-ignored = ZIGNOROWANE
badge-redirected-from = Z: { $path }
badge-redirecting-to = DO: { $path }
some-entries-failed = BÅ‚Ä…d przetwarzania niektÃ³rych elementÃ³w; sprawdÅº { badge-failed } w anych wyjÅ›ciowych po wiÄ™cej szczegÃ³Å‚Ã³w. Upewnij siÄ™, Å¼e masz dostÄ™p do tych plikÃ³w oraz, czy ich Å›cieÅ¼ki sÄ… zbyt dÅ‚ugie.
cli-game-line-item-redirected = Przekierowano z: { $path }
cli-game-line-item-redirecting = Przekierowywanie do: { $path }
button-backup = UtwÃ³rz kopiÄ™
button-preview = PodglÄ…d
button-restore = PrzywrÃ³Ä‡
button-nav-backup = TRYB TWORZENIA KOPII
button-nav-restore = TRYB PRZYWRACANIA
button-nav-custom-games = NIESTANDARDOWE GRY
button-nav-other = POZOSTAÅE
button-add-game = Dodaj grÄ™
button-continue = Kontynuuj
button-cancel = Anuluj
button-cancelling = Anulowanie...
button-okay = OK
button-select-all = Zaznacz wszystkie
button-deselect-all = Odznacz wszystkie
button-enable-all = WÅ‚Ä…cz wszystkie
button-disable-all = WyÅ‚Ä…cz wszystkie
button-customize = Dostosuj
button-exit = WyjdÅº
button-comment = Komentarz
button-lock = Zablokuj
button-unlock = Odblokuj
# This opens a download page.
button-get-app = Pobierz { $app }
button-validate = Zweryfikuj
button-override-manifest = Nadpisanie manifestu
button-extend-manifest = Rozszerzenie manifestu
button-sort = Sortowanie
button-download = Pobierz
button-upload = WyÅ›lij
button-ignore = Ignoruj
no-roots-are-configured = Dodaj kilka katalogÃ³w gÅ‚Ã³wnych, aby utworzyÄ‡ kopiÄ™ wiÄ™kszej iloÅ›ci danych.
config-is-invalid = BÅ‚Ä…d: Plik konfiguracji jest nieprawidÅ‚owy.
manifest-is-invalid = BÅ‚Ä…d: Plik manifest jest nieprawidÅ‚owy.
manifest-cannot-be-updated = BÅ‚Ä…d: Nie moÅ¼na sprawdziÄ‡ aktualizacji dla pliku manifest. Czy masz poÅ‚Ä…czenie z Internetem?
cannot-prepare-backup-target = BÅ‚Ä…d: Nie moÅ¼na przygotowaÄ‡ docelowej kopii zapasowej (utworzyÄ‡ lub oczyÅ›ciÄ‡ folderu). JeÅ›li folder jest otwarty w eksploratorze plikÃ³w, zamknij go: { $path }
restoration-source-is-invalid = BÅ‚Ä…d: Å¹rÃ³dÅ‚o przywracania jest nieprawidÅ‚owe (nie istnieje lub nie jest katalogiem) Upewnij siÄ™, Å¼e lokalizacja jest prawidÅ‚owa: { $path }
registry-issue = BÅ‚Ä…d: NiektÃ³re pozycje rejestru zostaÅ‚y pominiÄ™te.
unable-to-browse-file-system = BÅ‚Ä…d. Nie moÅ¼na przeglÄ…daÄ‡ na Twoim systemie.
unable-to-open-directory = BÅ‚Ä…d: Nie moÅ¼na otworzyÄ‡ katalogu:
unable-to-open-url = BÅ‚Ä…d: Nie moÅ¼na otworzyÄ‡ adresu URL:
unable-to-configure-cloud = Nie udaÅ‚o siÄ™ skonfigurowaÄ‡ chmury.
unable-to-synchronize-with-cloud = Nie moÅ¼na zsynchronizowaÄ‡ z chmurÄ….
cloud-synchronize-conflict = Kopia lokalna rÃ³Å¼ni siÄ™ od tej w chmurze. WyÅ›lij lub pobierz odpowiedniÄ… wersjÄ™, aby rozwiÄ…zaÄ‡ problem.
command-unlaunched = Polecenia nie uruchomiono: { $command }
command-terminated = Polecenie zakoÅ„czone nagle: { $command }
command-failed = Polecenie nie powiodÅ‚o siÄ™ z kodem { $code }: { $command }
processed-games =
    { $total-games } { $total-games ->
        [one] gra
       *[other] gier
    }
processed-games-subset =
    { $processed-games } z { $total-games } { $total-games ->
        [one] gra
       *[other] gier
    }
processed-size-subset = { $processed-size } z { $total-size }
field-backup-target = UtwÃ³rz kopiÄ™ w:
field-restore-source = PrzywrÃ³Ä‡ z:
field-custom-files = ÅšcieÅ¼ki:
field-custom-registry = Rejestr:
field-sort = Sortuj:
field-redirect-source =
    .placeholder = Å¹rÃ³dÅ‚o (oryginalna lokalizacja)
field-redirect-target =
    .placeholder = Cel (nowa lokalizacja)
field-roots = Å¹rÃ³dÅ‚o:
field-backup-excluded-items = Wykluczenia kopii zapasowych:
field-redirects = Przekierowania:
# This appears next to the number of full backups that you'd like to keep.
# A full backup includes all save files for a game.
field-retention-full = PeÅ‚ne:
# This appears next to the number of differential backups that you'd like to keep.
# A differential backup includes only the files that have changed since the last full backup.
field-retention-differential = RÃ³Å¼nicowe:
field-backup-format = Format:
field-backup-compression = Kompresja:
# The compression level determines how much compresison we perform.
field-backup-compression-level = Poziom kompresji:
label-manifest = Wzory Å›cieÅ¼ek zapisu
# This shows the time when we checked for an update to the manifest.
label-checked = Sprawdzono
# This shows the time when we found an update to the manifest.
label-updated = Zaktualizowano
label-new = Nowy
label-removed = UsuniÄ™to
label-comment = Komentarz
label-unchanged = Bez zmian
label-backup = Kopia zapasowa
label-scan = Skan
label-filter = Filtruj
label-unique = Unikalne
label-complete = PeÅ‚ny
label-partial = CzÄ™Å›ciowy
label-enabled = Aktywny
label-disabled = Nieaktywny
# https://en.wikipedia.org/wiki/Thread_(computing)
label-threads = WÄ…tki
label-cloud = Chmura
# A "remote" is what Rclone calls cloud systems like Google Drive.
label-remote = Zdalny
label-remote-name = Nazwa zdalnego
label-folder = Folder
# An executable file
label-executable = Plik wykonywalny
# Options given to a command line program
label-arguments = Parametry
label-url = URL
# https://en.wikipedia.org/wiki/Host_(network)
label-host = Host
# https://en.wikipedia.org/wiki/Port_(computer_networking)
label-port = Port
label-username = Nazwa uÅ¼ytkownika
label-password = HasÅ‚o
# This is a specific website or service that provides some cloud functionality.
# For example, Nextcloud and Owncloud are providers of WebDAV services.
label-provider = UsÅ‚ugodawca
label-custom = WÅ‚asny
label-none = Brak
label-change-count = Zmiany: { $total }
label-unscanned = Nieprzeskanowane
# This refers to a local file on the computer
label-file = Plik
label-game = Gra
# Aliases are alternative titles for the same game.
label-alias = Alias
label-original-name = Oryginalna nazwa
# Which manifest a game's data came from
label-source = Å¹rÃ³dÅ‚o
# This refers to the main Ludusavi manifest: https://github.com/mtkennerly/ludusavi-manifest
label-primary-manifest = GÅ‚Ã³wny manifest
# This refers to how we integrate a custom game with the manifest data.
label-integration = Integracja
# This is a folder name where a specific game is installed
label-installed-name = Nazwa instalacji
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
store-other-home = Folder gÅ‚Ã³wny
# This would be a folder acting as a virtual C: drive, created by Wine.
store-other-wine = Prefiks Wine
# This would be a folder with typical Windows system folders,
# like "Program Files (x86)" and "Users".
store-other-windows = Dysk Windows
# This would be a folder with typical Linux system folders,
# like "home" and "opt".
store-other-linux = Dysk Linux
# This would be a folder with typical Mac system folders,
# like "Applications" and "Users".
store-other-mac = Dysk Mac
store-other = PozostaÅ‚e
backup-format-simple = Prosty
backup-format-zip = Zip
compression-none = Brak
# "Deflate" is a proper noun: https://en.wikipedia.org/wiki/Deflate
compression-deflate = Deflate
compression-bzip2 = Bzip2
compression-zstd = Zstd
theme = Motyw
theme-light = Jasny
theme-dark = Ciemny
redirect-bidirectional = Dwukierunkowy
reverse-redirects-when-restoring = Odwrotna sekwencja przekierowaÅ„ podczas przywracania
show-disabled-games = PokaÅ¼ wyÅ‚Ä…czone gry
show-unchanged-games = PokaÅ¼ niezmienione gry
show-unscanned-games = PokaÅ¼ nieprzeskanowane gry
override-max-threads = ZastÄ…p maksymalnÄ… liczbÄ™ wÄ…tkÃ³w
synchronize-automatically = Synchronizuj automatycznie
prefer-alias-display = WyÅ›wietlaj alias zamiast oryginalnej nazwy
skip-unconstructive-backups = PomiÅ„ kopiÄ™ zapasowÄ…, gdy dane zostanÄ… usuniÄ™te, ale nie dodane lub zaktualizowane
explanation-for-exclude-store-screenshots = Nie zawieraj w kopiach zapasowych zrzutÃ³w ekranu dla konkretnego sklepu
explanation-for-exclude-cloud-games = Na tych platformach nie naleÅ¼y tworzyÄ‡ kopii zapasowych gier z obsÅ‚ugÄ… chmury
consider-doing-a-preview = JeÅ›li jeszcze tego nie zrobiono, rozwaÅ¼ wykonanie pierwszego testu, aby zobaczyÄ‡, czy wszystko dziaÅ‚a.
confirm-backup =
    Czy na pewno chcesz kontynuowaÄ‡ z kopiÄ… zapasowÄ…? { $path-action ->
        [merge] Nowe dane zapisu zostanÄ… scalone z folderem docelowym:
       *[create] Folder docelowy zostanie utworzony:
    }
confirm-restore =
    Czy na pewno chcesz kontynuowaÄ‡ przywracanie?
    Jakiekolwiek bieÅ¼Ä…ce pliki z kopiÄ… zapasowÄ… zostanÄ… zastÄ…pione:
confirm-cloud-upload =
    Czy chcesz zastÄ…piÄ‡ pliki w chmurze plikami lokalnymi?
    Twoje pliki ({ $cloud-path }) stanÄ… siÄ™ dokÅ‚adnÄ… kopiÄ… plikÃ³w lokalnych ({ $local-path }).
    Pliki w chmurze zostanÄ… w razie potrzeby zaktualizowane lub usuniÄ™te.
confirm-cloud-download =
    Czy chcesz zastÄ…piÄ‡ pliki lokalne plikami w chmurze?
    Twoje lokalne pliki ({ $local-path }) stanÄ… siÄ™ dokÅ‚adnÄ… kopiÄ… Twoich plikÃ³w w chmurze ({ $cloud-path }).
    Pliki lokalne zostanÄ… w razie potrzeby zaktualizowane lub usuniÄ™te.
confirm-add-missing-roots = Czy to sÄ… katalogi gÅ‚Ã³wne?
no-missing-roots = Nie znaleziono wiÄ™cej katalogÃ³w gÅ‚Ã³wnych.
loading = Åadowanie...
preparing-backup-target = Przygotowywanie katalogu kopii zapasowej...
updating-manifest = Aktualizowanie manifestu...
no-cloud-changes = Nie ma zmian do synchronizacji
backups-are-valid = Twoje kopie zapasowe sÄ… prawidÅ‚owe.
backups-are-invalid =
    Kopie zapasowe tych gier wydajÄ… siÄ™ nieprawidÅ‚owe.
    Czy chcesz utworzyÄ‡ nowe peÅ‚ne kopie zapasowe?
saves-found = Znaleziono dane zapisu.
no-saves-found = Nie znaleziono danych zapisu.
# This is tacked on to form something like "Back up (no confirmation)",
# meaning we would perform an action without asking the user if they're sure.
suffix-no-confirmation = bez potwierdzenia
# This is shown when a setting will only take effect after closing and reopening Ludusavi.
suffix-restart-required = wymagane ponowne uruchomienie
prefix-error = BÅ‚Ä…d: { $message }
prefix-warning = OstrzeÅ¼enie: { $message }
cloud-app-unavailable = Kopie zapasowe w chmurze sÄ… wyÅ‚Ä…czone, poniewaÅ¼ { $app } jest niedostÄ™pny.
cloud-not-configured = Kopie zapasowe w chmurze sÄ… wyÅ‚Ä…czone, poniewaÅ¼ nie skonfigurowano Å¼adnego systemu w chmurze.
cloud-path-invalid = Kopie zapasowe w chmurze sÄ… wyÅ‚Ä…czone, poniewaÅ¼ Å›cieÅ¼ka kopii zapasowej jest nieprawidÅ‚owa.
game-is-unrecognized = Ludusavi nie rozpoznaje tej gry.
game-has-nothing-to-restore = Ta gra nie ma kopii zapasowej do przywrÃ³cenia.
launch-game-after-error = Czy mimo to uruchomiÄ‡ grÄ™?
game-did-not-launch = Nie udaÅ‚o siÄ™ uruchomiÄ‡ gry.
backup-is-newer-than-current-data = The existing backup is newer than the current data.
backup-is-older-than-current-data = The existing backup is older than the current data.
back-up-specific-game =
    .confirm = StworzyÄ‡ kopiÄ™ zapisÃ³w dla { $game }?
    .failed = Nie udaÅ‚o siÄ™ utworzyÄ‡ kopii zapisÃ³w dla { $game }
restore-specific-game =
    .confirm = PrzywrÃ³ciÄ‡ zapisy dla { $game }?
    .failed = Nie udaÅ‚o siÄ™ przywrÃ³ciÄ‡ zapisÃ³w dla { $game }
new-version-check = Automatyczne sprawdzanie aktualizacji aplikacji
new-version-available = DostÄ™pna jest aktualizacja aplikacji: { $version }. Chcesz zobaczyÄ‡ informacje o wydaniu?
custom-game-will-override = Ta niestandardowa gra zastÄ™puje wpis manifestu
custom-game-will-extend = Ta niestandardowa gra rozszerza wpis manifestu
operation-will-only-include-listed-games = Spowoduje to przetworzenie tylko tych gier, ktÃ³re aktualnie znajdujÄ… siÄ™ na liÅ›cie
