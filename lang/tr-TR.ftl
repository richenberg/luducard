ludusavi = Ludusavi
language = Dil
game-name = Oyun Ä°smi
total-games = Oyunlar
file-size = Boyut
file-location = Konum
overall = Genel
status = Durum
cli-unrecognized-games = Bu oyunlar hakkÄ±nda bilgi bulunamadÄ±:
cli-unable-to-request-confirmation = Unable to request confirmation.
    .winpty-workaround = EÄŸer bash emulator kullanÄ±yorsan (Git Bash gibi), winpty'i Ã§alÄ±ÅŸtÄ±rmayÄ± dene.
cli-backup-id-with-multiple-games = OyunlarÄ±n yedeÄŸi geri yÃ¼klenirken backup ID belirlenemiyor.
cli-invalid-backup-id = GeÃ§ersiz backup ID.
badge-failed = BAÅžARISIZ
badge-duplicates = KOPYALAR
badge-duplicated = KOPYALANMIÅž
badge-ignored = IGNORED
badge-redirected-from = Buradan: { $path }
badge-redirecting-to = Åžuraya: { $path }
some-entries-failed = BazÄ± girdilerin iÅŸlenmesi baÅŸarÄ±sÄ±z; detay iÃ§in Ã§Ä±ktÄ± da { badge-failed } seÃ§eneÄŸine bak. O dosyalara eriÅŸim var mÄ± veya dosya yollarÄ± Ã§ok uzun mu diye tekrar kontrol et.
cli-game-line-item-redirected = Åžuradan yÃ¶nlendirildi: { $path }
cli-game-line-item-redirecting = Åžuraya yÃ¶nlendiriliyor: { $path }
button-backup = Yedekle
button-preview = Ã–nizle
button-restore = Geri YÃ¼kle
button-nav-backup = YEDEKLEME MODU
button-nav-restore = GERÄ° YÃœKLEME MODU
button-nav-custom-games = Ã–ZEL OYUNLAR
button-nav-other = DÄ°ÄžER
button-add-game = Oyun ekle
button-continue = Devam Et
button-cancel = Ä°ptal
button-cancelling = Ä°ptal ediliyor...
button-okay = Tamam
button-select-all = TÃ¼mÃ¼nÃ¼ seÃ§
button-deselect-all = TÃ¼m seÃ§imi kaldÄ±r
button-enable-all = Hepsini etkinleÅŸtir
button-disable-all = Hepsini devre dÄ±ÅŸÄ± bÄ±rak
button-customize = KiÅŸiselleÅŸtir
button-exit = Ã‡Ä±kÄ±ÅŸ
button-comment = Yorum Yap
button-lock = Kilitle
button-unlock = Kilidi aÃ§
# This opens a download page.
button-get-app = Ä°ndir { $app }
button-validate = DoÄŸrula
button-override-manifest = Bildiriyi geÃ§ersiz kÄ±l
button-extend-manifest = Bildiriyi geniÅŸlet
button-sort = Filtrele
button-download = Ä°ndir
button-upload = YÃ¼kle
button-ignore = GÃ¶z ardÄ± et
no-roots-are-configured = Daha fazla veri yedeklemek iÃ§in daha fazla kÃ¶k dizin ekleyin.
config-is-invalid = Hata: SeÃ§enekler dosyasÄ± geÃ§ersiz.
manifest-is-invalid = Hata: Bildiri dosyasÄ± geÃ§ersiz.
manifest-cannot-be-updated = Hata: Bildiri dosyasÄ±nda gÃ¼ncelleme olup olmadÄ±ÄŸÄ± kontrol edilemiyor. Ä°nternet baÄŸlantÄ±nÄ±z mÄ± koptu?
cannot-prepare-backup-target = Hata: Yedekleme hazÄ±rlanamÄ±yor (klasÃ¶r oluÅŸturulurken veya boÅŸaltÄ±lÄ±rken). Dosya gezgininde klasÃ¶r aÃ§Ä±ksa kapatmayÄ± deneyin: { $path }
restoration-source-is-invalid = Hata: Geri yÃ¼kleme kaynaÄŸÄ± geÃ§ersiz (ya mevcut deÄŸil ya da bir dizin deÄŸil). LÃ¼tfen konumu tekrar kontrol edin: { $path }
registry-issue = Hata: BazÄ± kayÄ±t defteri girdileri atlandÄ±.
unable-to-browse-file-system = Hata: Sisteminizde gÃ¶z atÄ±lamÄ±yor.
unable-to-open-directory = Hata: Dizin aÃ§Ä±lamÄ±yor:
unable-to-open-url = Hata: URL aÃ§Ä±lamÄ±yor:
unable-to-configure-cloud = Bulut yapÄ±landÄ±rÄ±lamÄ±yor.
unable-to-synchronize-with-cloud = Bulut eÅŸitlemesi yapÄ±lamÄ±yor.
cloud-synchronize-conflict = Yerel ve bulut yedeklemeleriniz Ã§akÄ±ÅŸÄ±yor. Bir yÃ¼kleme ya da indirme yaparak Ã§Ã¶zÃ¼m saÄŸlayÄ±n.
command-unlaunched = Komut yÃ¼rÃ¼tÃ¼lemedi: { $command }
command-terminated = Komut ani ÅŸekilde sonlandÄ±: { $command }
command-failed = Komut ÅŸu kodla baÅŸarÄ±sÄ±z oldu { $code }: { $command }
processed-games =
    { $total-games } { $total-games ->
        [bir] oyun
       *[diger] oyunlar
    }
processed-games-subset =
    { $total-games } { $total-games} iÃ§inden { $processed-games   ->
        [bir] oyun
       *[diger] oyunlar
    }
processed-size-subset = { $total-size } iÃ§inden { $processed-size }
field-backup-target = Åžuraya yedekle:
field-restore-source = Åžuradan geri yÃ¼kle:
field-custom-files = Yollar:
field-custom-registry = KayÄ±t Defteri:
field-sort = SÄ±rala:
field-redirect-source =
    .placeholder = Kaynak (orjinal yer)
field-redirect-target =
    .placeholder = Hedef (yeni yer)
field-roots = KÃ¶k dizinler:
field-backup-excluded-items = Yedekleme istisnalarÄ±:
field-redirects = YÃ¶nlendirmeler:
# This appears next to the number of full backups that you'd like to keep.
# A full backup includes all save files for a game.
field-retention-full = Tam:
# This appears next to the number of differential backups that you'd like to keep.
# A differential backup includes only the files that have changed since the last full backup.
field-retention-differential = DeÄŸiÅŸiklikler:
field-backup-format = BiÃ§im:
field-backup-compression = SÄ±kÄ±ÅŸtÄ±rma:
# The compression level determines how much compresison we perform.
field-backup-compression-level = Seviye:
label-manifest = Bildiri
# This shows the time when we checked for an update to the manifest.
label-checked = Kontrol edildi
# This shows the time when we found an update to the manifest.
label-updated = GÃ¼ncellendi
label-new = Yeni
label-removed = KaldÄ±rÄ±ldÄ±
label-comment = Yorum
label-unchanged = DeÄŸiÅŸmedi
label-backup = Yedekleme
label-scan = Tara
label-filter = Filtre
label-unique = Benzersiz
label-complete = Tamamla
label-partial = KÄ±smen
label-enabled = Etkin
label-disabled = Devre dÄ±ÅŸÄ±
# https://en.wikipedia.org/wiki/Thread_(computing)
label-threads = Ä°ÅŸ ParÃ§acÄ±klarÄ±
label-cloud = Bulut
# A "remote" is what Rclone calls cloud systems like Google Drive.
label-remote = Bulut yedekleme
label-remote-name = Bulut yedekleme ismi
label-folder = KlasÃ¶r
# An executable file
label-executable = YÃ¼rÃ¼tÃ¼lebilir
# Options given to a command line program
label-arguments = DeÄŸiÅŸkenler
label-url = BaÄŸlantÄ±
# https://en.wikipedia.org/wiki/Host_(network)
label-host = Sunucu
# https://en.wikipedia.org/wiki/Port_(computer_networking)
label-port = BaÄŸlantÄ± NoktasÄ±
label-username = KullanÄ±cÄ± AdÄ±
label-password = Åžifre
# This is a specific website or service that provides some cloud functionality.
# For example, Nextcloud and Owncloud are providers of WebDAV services.
label-provider = SaÄŸlayÄ±cÄ±
label-custom = Ã–zel
label-none = HiÃ§biri
label-change-count = DeÄŸiÅŸiklikler: { $total }
label-unscanned = TaranmamÄ±ÅŸ
# This refers to a local file on the computer
label-file = Dosya
label-game = Oyun
# Aliases are alternative titles for the same game.
label-alias = Takma Ad
label-original-name = Orjinal ad
# Which manifest a game's data came from
label-source = Kaynak
# This refers to the main Ludusavi manifest: https://github.com/mtkennerly/ludusavi-manifest
label-primary-manifest = Birincil bildirim
# This refers to how we integrate a custom game with the manifest data.
label-integration = Entegrasyon
# This is a folder name where a specific game is installed
label-installed-name = YÃ¼klenmiÅŸ adÄ±
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
store-other-home = Ana klasÃ¶r
# This would be a folder acting as a virtual C: drive, created by Wine.
store-other-wine = Wine sÃ¼rÃ¼cÃ¼sÃ¼
# This would be a folder with typical Windows system folders,
# like "Program Files (x86)" and "Users".
store-other-windows = Windows sÃ¼rÃ¼cÃ¼sÃ¼
# This would be a folder with typical Linux system folders,
# like "home" and "opt".
store-other-linux = Linux sÃ¼rÃ¼cÃ¼sÃ¼
# This would be a folder with typical Mac system folders,
# like "Applications" and "Users".
store-other-mac = Mac sÃ¼rÃ¼cÃ¼sÃ¼
store-other = DiÄŸer
backup-format-simple = Basit
backup-format-zip = Zip
compression-none = Yok
# "Deflate" is a proper noun: https://en.wikipedia.org/wiki/Deflate
compression-deflate = Deflate
compression-bzip2 = Bzip2
compression-zstd = Zstd
theme = Tema
theme-light = Beyaz
theme-dark = Siyah
redirect-bidirectional = Ã‡ift yÃ¶nlÃ¼
reverse-redirects-when-restoring = Geri yÃ¼klerken yÃ¶nlendirme sÄ±rasÄ±nÄ± tersine Ã§evir
show-disabled-games = EngellenmiÅŸ oyunlarÄ± gÃ¶ster
show-unchanged-games = DeÄŸiÅŸmeyen oyunlarÄ± gÃ¶ster
show-unscanned-games = TaranmamÄ±ÅŸ oyunlarÄ± gÃ¶ster
override-max-threads = Maksimum iÅŸ parÃ§acÄ±ÄŸÄ±nÄ± geÃ§ersiz kÄ±l
synchronize-automatically = Otomatik olarak senkronize et
prefer-alias-display = Orijinal ad yerine takma adÄ± gÃ¶rÃ¼ntÃ¼le
skip-unconstructive-backups = Verilerin kaldÄ±rÄ±lacaÄŸÄ± ancak eklenmeyeceÄŸi veya gÃ¼ncellenmeyeceÄŸi durumlarda yedeklemeyi atla
explanation-for-exclude-store-screenshots = Yedeklemelerde maÄŸazaya Ã¶zel ekran gÃ¶rÃ¼ntÃ¼lerini hariÃ§ tutun
explanation-for-exclude-cloud-games = Bu platformlarda bulut destekli oyunlarÄ± yedekleme
consider-doing-a-preview =
    HenÃ¼z yapmadÄ±ysan, Ã¶nce bir Ã¶n izleme yapmayÄ± dÃ¼ÅŸÃ¼n, bÃ¶ylece
    sÃ¼rprizlerle karÅŸÄ±laÅŸmayacaksÄ±n.
confirm-backup =
    Yedeklemeye devam etmek istediÄŸinizden emin misiniz? { $path-action ->
        [merge] Yeni kaydetme verileri hedef klasÃ¶rle birleÅŸtirilecek:
       *[create] Hedef klasÃ¶r oluÅŸturulur:
    }
confirm-restore =
    Restorasyona devam etmek istediÄŸinizden emin misiniz?
    Bu, buradaki yedekleri iÃ§eren mevcut dosyalarÄ±n Ã¼zerine yazacaktÄ±r:
confirm-cloud-upload =
    Bulut dosyalarÄ±nÄ±zÄ± yerel dosyalarÄ±nÄ±zla deÄŸiÅŸtirmek ister misiniz?
    Bulut dosyalarÄ±nÄ±z ({ $cloud-path }) yerel dosyalarÄ±nÄ±zÄ±n ({ $local-path }) tam bir kopyasÄ± haline gelecektir.
    Buluttaki dosyalar gerektiÄŸi ÅŸekilde gÃ¼ncellenecek veya silinecektir.
confirm-cloud-download =
    Yerel dosyalarÄ±nÄ±zÄ± bulut dosyalarÄ±nÄ±zla deÄŸiÅŸtirmek ister misiniz?
    Yerel dosyalarÄ±nÄ±z ({ $local-path }), bulut dosyalarÄ±nÄ±zÄ±n ({ $cloud-path }) tam bir kopyasÄ± haline gelecektir.
    Yerel dosyalar gerektiÄŸi ÅŸekilde gÃ¼ncellenecek veya silinecektir.
confirm-add-missing-roots = Bu kÃ¶k dizinler eklensin mi?
no-missing-roots = BaÅŸka kÃ¶k dizin bulunamadÄ±.
loading = YÃ¼kleniyor...
preparing-backup-target = Yedekleme dizini hazÄ±rlanÄ±yor...
updating-manifest = Bildiri gÃ¼ncelleniyor...
no-cloud-changes = Senkronize edilecek deÄŸiÅŸiklik yok
backups-are-valid = Yedeklemeleriniz geÃ§erlidir.
backups-are-invalid =
    Bu oyunlarÄ±n yedeklemeleri geÃ§ersiz gÃ¶rÃ¼nÃ¼yor.
    Bu oyunlar iÃ§in yeni tam yedeklemeler oluÅŸturmak istiyor musunuz?
saves-found = KayÄ±tlÄ± veri mevcut.
no-saves-found = KayÄ±tlÄ± veri bulunamadÄ±.
# This is tacked on to form something like "Back up (no confirmation)",
# meaning we would perform an action without asking the user if they're sure.
suffix-no-confirmation = doÄŸrulamasÄ±z
# This is shown when a setting will only take effect after closing and reopening Ludusavi.
suffix-restart-required = yeniden baÅŸlatma gerekli
prefix-error = Hata: { $message }
prefix-warning = UyarÄ±: { $message }
cloud-app-unavailable = { $app } kullanÄ±lamadÄ±ÄŸÄ±ndan bulut yedeklemeleri devre dÄ±ÅŸÄ± bÄ±rakÄ±ldÄ±.
cloud-not-configured = HiÃ§bir bulut sistemi yapÄ±landÄ±rÄ±lmadÄ±ÄŸÄ±ndan bulut yedeklemeleri devre dÄ±ÅŸÄ± bÄ±rakÄ±ldÄ±.
cloud-path-invalid = Yedekleme yolu geÃ§ersiz olduÄŸundan bulut yedeklemeleri devre dÄ±ÅŸÄ± bÄ±rakÄ±ldÄ±.
game-is-unrecognized = Ludusavi bu oyunu tanÄ±mÄ±yor.
game-has-nothing-to-restore = Bu oyunun geri yÃ¼klenecek bir yedeÄŸi yok.
launch-game-after-error = Yine de oyun baÅŸlatÄ±lsÄ±n mÄ±?
game-did-not-launch = Oyun baÅŸlatÄ±lamadÄ±.
backup-is-newer-than-current-data = Var olan yedekleme, gÃ¼ncel veriden daha yeni.
backup-is-older-than-current-data = Var olan yedekleme, gÃ¼ncel veriden daha eski.
back-up-specific-game =
    .confirm = { $game } iÃ§in kayÄ±t verileri yedeklensin mi?
    .failed = { $game } iÃ§in kayÄ±t verileri yedeklenemedi
restore-specific-game =
    .confirm = { $game } iÃ§in kayÄ±t verileri geri yÃ¼klensin mi?
    .failed = { $game } iÃ§in kayÄ±t verileri geri yÃ¼klenemedi
new-version-check = GÃ¼ncellemelerini otomatik olarak kontrol et
new-version-available = GÃ¼ncelleme mevcut: { $version }. SÃ¼rÃ¼m notlarÄ±nÄ± gÃ¶rÃ¼ntÃ¼lemek ister misiniz?
custom-game-will-override = Bu Ã¶zel oyun, bildirim giriÅŸini geÃ§ersiz kÄ±lÄ±yor
custom-game-will-extend = Bu Ã¶zel oyun, manifest giriÅŸini geniÅŸletiyor
operation-will-only-include-listed-games = Bu yalnÄ±zca ÅŸu anda listelenen oyunlarÄ± iÅŸleyecektir
