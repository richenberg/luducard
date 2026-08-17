ludusavi = Ludusavi
language = Язык
game-name = Название
total-games = Игры
file-size = Размер
file-location = Местоположение
overall = Всего
status = Статус
cli-unrecognized-games = Нет информации об этих играх:
cli-unable-to-request-confirmation = Не удалось запросить подтверждение.
    .winpty-workaround = Если вы используете эмулятор Bash (например Git Bash), попробуйте запустить winpty.
cli-backup-id-with-multiple-games = Невозможно задать идентификатор резервной копии при восстановлении нескольких игр.
cli-invalid-backup-id = Неверный идентификатор резервной копии.
badge-failed = ОШИБКА
badge-duplicates = ДУБЛИКАТ
badge-duplicated = ДУБЛИРОВАННЫЙ
badge-ignored = ИГНОРИРОВАН
badge-redirected-from = ИЗ: { $path }
badge-redirecting-to = В: { $path }
some-entries-failed = Некоторые записи не удалось обработать; ищите { badge-failed } на выходе для получения деталей. Дважды проверьте, имеют ли вы доступ к этим файлам или их пути очень длинные.
cli-game-line-item-redirected = Перенаправлено из: { $path }
cli-game-line-item-redirecting = Перенаправление в: { $path }
button-backup = Резервирование
button-preview = Предпросмотр
button-restore = Восстановить
button-nav-backup = РЕЗЕРВИРОВАНИЕ
button-nav-restore = ВОССТАНОВЛЕНИЕ
button-nav-custom-games = СВОЯ ИГРА
button-nav-other = ДРУГИЕ
button-add-game = Добавить игру
button-continue = Продолжить
button-cancel = Отменить
button-cancelling = Отменяю...
button-okay = Хорошо
button-select-all = Выбрать все
button-deselect-all = Снять все
button-enable-all = Включить все
button-disable-all = Отключить все
button-customize = Настроить
button-exit = Выйти
button-comment = Комментарий
button-lock = Заблокировать
button-unlock = Разблокировать
# This opens a download page.
button-get-app = Получить { $app }
button-validate = Проверить
button-override-manifest = Переопределить манифест
button-extend-manifest = Расширить манифест
button-sort = Сортировать
button-download = Скачать
button-upload = Загрузить
button-ignore = Игнорировать
no-roots-are-configured = Добавьте несколько корней для резервирования еще больше данных.
config-is-invalid = Ошибка: неверный файл конфигурации.
manifest-is-invalid = Ошибка: неверный файл конфигурации (манифеста).
manifest-cannot-be-updated = Ошибка: Невозможно проверить обновление файла манифеста. Подключение к Интернету отключено?
cannot-prepare-backup-target = Ошибка: Не удается подготовить резервную копию цели (либо создание, либо очистка папки). Если папка открыта в браузере файлов, попробуйте закрыть её: { $path }
restoration-source-is-invalid = Ошибка: Источник восстановления недействителен (либо не существует или не является каталогом). Пожалуйста, проверьте путь: { $path }
registry-issue = Ошибка: Некоторые записи реестра были пропущены.
unable-to-browse-file-system = Ошибка: Невозможна навигация по файловой системе.
unable-to-open-directory = Ошибка: Не удается открыть каталог:
unable-to-open-url = Ошибка: Не удается открыть URL:
unable-to-configure-cloud = Не удалось настроить облако.
unable-to-synchronize-with-cloud = Не удалось синхронизировать с облаком.
cloud-synchronize-conflict = Ваши локальные и облачные резервные копии конфликтуют. Выполните закачку или загрузку, чтобы разрешить это.
command-unlaunched = Команда не запущена: { $command }
command-terminated = Команда прервана: { $command }
command-failed = Не удалось выполнить команду с кодом { $code }: { $command }
processed-games =
    { $total-games } { $total-games ->
        [one] игр(а)
       *[other] игр(ы)
    }
processed-games-subset =
    { $processed-games } из { $total-games } { $total-games ->
        [one] игр(а)
       *[other] игр(ы)
    }
processed-size-subset = { $processed-size } из { $total-size }
field-backup-target = Резервировать в:
field-restore-source = Восстановить из:
field-custom-files = Пути:
field-custom-registry = Реестр:
field-sort = Сортировать:
field-redirect-source =
    .placeholder = Источник (исходное место)
field-redirect-target =
    .placeholder = Целевой (новое место)
field-roots = Корневые:
field-backup-excluded-items = Исключения из резервной копии:
field-redirects = Перенаправления:
# This appears next to the number of full backups that you'd like to keep.
# A full backup includes all save files for a game.
field-retention-full = Полный:
# This appears next to the number of differential backups that you'd like to keep.
# A differential backup includes only the files that have changed since the last full backup.
field-retention-differential = Дифференциальный:
field-backup-format = Формат:
field-backup-compression = Сжатие:
# The compression level determines how much compresison we perform.
field-backup-compression-level = Степень:
label-manifest = Манифест
# This shows the time when we checked for an update to the manifest.
label-checked = Проверен
# This shows the time when we found an update to the manifest.
label-updated = Обновлено
label-new = Новый
label-removed = Удалено
label-comment = Комментарий
label-unchanged = Без изменений
label-backup = Резервировать
label-scan = Сканирование
label-filter = Фильтр
label-unique = Уникальный
label-complete = Полный
label-partial = Частичный
label-enabled = Включено
label-disabled = Отключено
# https://en.wikipedia.org/wiki/Thread_(computing)
label-threads = Потоки
label-cloud = Облачное хранилище
# A "remote" is what Rclone calls cloud systems like Google Drive.
label-remote = Удалённый репозиторий
label-remote-name = Имя репозитория
label-folder = Папка
# An executable file
label-executable = Исполняемый файл
# Options given to a command line program
label-arguments = Аргументы
label-url = Ссылка
# https://en.wikipedia.org/wiki/Host_(network)
label-host = Хост
# https://en.wikipedia.org/wiki/Port_(computer_networking)
label-port = Порт
label-username = Имя пользователя
label-password = Пароль
# This is a specific website or service that provides some cloud functionality.
# For example, Nextcloud and Owncloud are providers of WebDAV services.
label-provider = Хранилище
label-custom = Пользовательское
label-none = Нет
label-change-count = Изменений: { $total }
label-unscanned = Непроверенные
# This refers to a local file on the computer
label-file = Файл
label-game = Игра
# Aliases are alternative titles for the same game.
label-alias = Псевдоним (похожее)
label-original-name = Исходное название
# Which manifest a game's data came from
label-source = Источник
# This refers to the main Ludusavi manifest: https://github.com/mtkennerly/ludusavi-manifest
label-primary-manifest = Основной манифест
# This refers to how we integrate a custom game with the manifest data.
label-integration = Интеграция
# This is a folder name where a specific game is installed
label-installed-name = Установленное имя
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
store-other-home = Домашняя папка
# This would be a folder acting as a virtual C: drive, created by Wine.
store-other-wine = Wine префикс
# This would be a folder with typical Windows system folders,
# like "Program Files (x86)" and "Users".
store-other-windows = Windows диск
# This would be a folder with typical Linux system folders,
# like "home" and "opt".
store-other-linux = Linux диск
# This would be a folder with typical Mac system folders,
# like "Applications" and "Users".
store-other-mac = Mac диск
store-other = Другое
backup-format-simple = Простой
backup-format-zip = Zip
compression-none = Нет
# "Deflate" is a proper noun: https://en.wikipedia.org/wiki/Deflate
compression-deflate = Дефляция
compression-bzip2 = Bzip2
compression-zstd = Zstd
theme = Тема оформления
theme-light = Светлая
theme-dark = Тёмная
redirect-bidirectional = Двунаправленный
reverse-redirects-when-restoring = Обратная последовательность перенаправлений при восстановлении
show-disabled-games = Показать неактивные игры
show-unchanged-games = Показать неизменные игры
show-unscanned-games = Показать несканированные игры
override-max-threads = Переопределить макс. количество потоков
synchronize-automatically = Синхронизировать автоматически
prefer-alias-display = Отображать своё название вместо исходного
skip-unconstructive-backups = Пропустить резервную копию, когда данные будут удалены, но не добавлены или обновлены
explanation-for-exclude-store-screenshots = В резервных копиях исключить скриншоты из конкретного магазина
explanation-for-exclude-cloud-games = Не создавать резервные копии игр с поддержкой облака на этих платформах
consider-doing-a-preview =
    Если вы еще этого не сделали, предлагаю сначала сделать предварительный просмотр, чтобы
    не было сюрпризов.
confirm-backup =
    Вы уверены, что хотите продолжить создание резервной копии? { $path-action ->
        [merge] Новые данные сохранения будут объединены в целевую папку:
       *[create] Будет создана целевая папка:
    }
confirm-restore =
    Вы уверены, что хотите продолжить восстановление?
    Это перезапишет все текущие файлы резервными копиями отсюда:
confirm-cloud-upload =
    Вы хотите заменить ваши облачные файлы локальными файлами?
    Ваши файлы в облаке ({ $cloud-path }) станут точной копией локальных файлов ({ $local-path }).
    Файлы в облаке будут обновлены или удалены по мере необходимости.
confirm-cloud-download =
    Вы хотите заменить локальные файлы на ваши облачные файлы?
    Ваши локальные файлы ({ $local-path }) станут точной копией ваших облачных файлов ({ $cloud-path }).
    По мере необходимости локальные файлы будут обновлены или удалены.
confirm-add-missing-roots = Добавить эти корневые папки?
no-missing-roots = Дополнительные корневые папки не найдены.
loading = Загрузка...
preparing-backup-target = Подготовка папки резервной копии...
updating-manifest = Обновление манифеста...
no-cloud-changes = Нет изменений для синхронизации
backups-are-valid = Ваши резервные копии действительны.
backups-are-invalid =
    Резервные копии этих игр кажутся недействительными.
    Вы хотите создать новые полные резервные копии для этих игр?
saves-found = Найдены данные сохранения.
no-saves-found = Сохраненных данных не найдено.
# This is tacked on to form something like "Back up (no confirmation)",
# meaning we would perform an action without asking the user if they're sure.
suffix-no-confirmation = без подтверждения
# This is shown when a setting will only take effect after closing and reopening Ludusavi.
suffix-restart-required = Требуется перезапуск
prefix-error = Ошибка: { $message }
prefix-warning = Внимание: { $message }
cloud-app-unavailable = Облачные резервные копии отключены, потому что { $app } недоступно.
cloud-not-configured = Облачные резервные копии отключены, так как облачная система не настроена.
cloud-path-invalid = Облачные резервные копии отключены, так как путь резервного копирования недействителен.
game-is-unrecognized = Ludusavi не распознает эту игру.
game-has-nothing-to-restore = У этой игры нет резервной копии для восстановления.
launch-game-after-error = Все равно запустить игру?
game-did-not-launch = Не удалось запустить игру.
backup-is-newer-than-current-data = Существующая резервная копия новее, чем текущая.
backup-is-older-than-current-data = Существующая резервная копия старше, чем текущая.
back-up-specific-game =
    .confirm = Создать резервную копию для { $game }?
    .failed = Не удалось сохранить данные для { $game }
restore-specific-game =
    .confirm = Восстановить сохраненные данные для { $game }?
    .failed = Не удалось восстановить данные для { $game }
new-version-check = Автоматически проверять обновления приложения
new-version-available = Доступно обновление приложения: { $version }. Хотите просмотреть список изменений (патчноут)?
custom-game-will-override = Пользовательская игра переопределяет элемент манифеста
custom-game-will-extend = Пользовательская игра расширяет манифест
operation-will-only-include-listed-games = Обработаются только перечисленные игры

luducard-library = Библиотека
luducard-scan-and-add = Сканирование и добавление
luducard-cloud-and-sync = Облако и синхронизация
luducard-save-share-hub = Save Share HUB
luducard-preset-share-hub = Preset Share HUB
luducard-settings = Настройки
luducard-support-project = Поддержать проект
luducard-library-status = Статус библиотеки
luducard-games = Игры
luducard-language = Язык
luducard-language-desc = Язык интерфейса.
luducard-sidebar-subtitle = Резервные копии сейвов
luducard-navigation = Навигация
luducard-stored-saves = Сохраненные файлы
luducard-pending-saves = Ожидающие
luducard-downloading-covers = Загрузка обложек...
luducard-settings-desc = Настройки и поведение приложения
luducard-dashboard-desc = Управляйте и защищайте сохранения ваших игр

luducard-file-watcher = Монитор сохранений (File Watcher)
luducard-file-watcher-desc = Отслеживает изменения сохранений и автоматически делает копию при закрытии игры.
luducard-start-with-windows = Запуск вместе с Windows
luducard-start-with-windows-desc = Запускается свернутым в системный трей при включении ПК.
luducard-system-tray = Запуск в системном трее (System Tray)
luducard-system-tray-desc = Сворачивает приложение в системный трей вместо закрытия, сохраняя фоновый мониторинг.
luducard-portable = Портативный режим (Portable Mode)
luducard-portable-desc = Сохраняет настройки, манифесты и резервные копии в папке приложения (идеально для флешек).
luducard-theme = Тема
luducard-theme-desc = Внешний вид интерфейса.
luducard-theme-dark = Темная
luducard-theme-light = Светлая
luducard-theme-system = Системная
luducard-backup-dir = Папка резервных копий
luducard-backup-dir-desc = Где будут храниться файлы резервных копий сохранений.

luducard-rclone-path = Путь к исполняемому файлу Rclone
luducard-rclone-path-desc = Путь к исполняемому файлу rclone, используемому для загрузки в облако.
luducard-cloud-folder = Удаленная папка в облаке
luducard-cloud-folder-desc = Имя удаленной папки для синхронизации файлов.
luducard-rclone-args = Дополнительные аргументы Rclone
luducard-rclone-args-desc = Необязательные команды и флаги, передаваемые непосредственно в rclone.
luducard-supabase-url = URL-адрес Supabase (Сообщество)
luducard-supabase-url-desc = URL-адрес API вашего проекта Supabase для вкладки сообщества.
luducard-supabase-key = Анонимный ключ Supabase (Anon Key)
luducard-supabase-key-desc = Публичный (анонимный) ключ, используемый для анонимной аутентификации в таблицах.
luducard-btn-save-settings = Сохранить настройки

luducard-tab-general = Общие
luducard-tab-schedule = Расписание
luducard-tab-notifications = Уведомления
luducard-general-preferences = Общие настройки
luducard-general-preferences-desc = Пути приложения и базовое поведение.

luducard-status-synchronized = Синхронизировано
luducard-status-pending = Ожидает бэкапа
luducard-status-none = Нет бэкапа
luducard-backup = Бэкап
luducard-restore = Восстановить
luducard-current-save = Активное сохранение
luducard-last-backup = Последний бэкап
luducard-manual-backup = Ручной бэкап
luducard-loading-library = Загрузка библиотеки игр...
luducard-monitored-games = Отслеживаемые игры
luducard-cloud-synced = Синхронизировано с облаком
luducard-pending-saves-plural = Ожидающие бэкапы
luducard-search-games = Поиск игр...
luducard-clear-search = Очистить поиск
luducard-select-all = Выбрать все
luducard-platform = Платформа
luducard-all-platforms = Все платформы
luducard-sort-by = Сортировка
luducard-sort-name = По имени (А-Я)
luducard-sort-recent = Недавно запущенные
luducard-sort-size = Размер сохранений
luducard-installed = Установлено
luducard-pending = Ожидает
luducard-grid-view = Сетка
luducard-list-view = Список
luducard-showing = Отображено
luducard-of = из
luducard-game = игра
luducard-games-plural = игр
luducard-no-games-found = Игры не найдены
luducard-adjust-filters-desc = Измените фильтры или отсканируйте папки, чтобы добавить новые игры.
luducard-starting-backup-for = Запуск бэкапа для
luducard-backup-completed-for = Бэкап для
luducard-completed = завершен!
luducard-completed-fem = завершен!
luducard-backup-failed-for = Сбой бэкапа для
luducard-restoring-backup-for = Восстановление бэкапа для
luducard-restore-completed-for = Восстановление для
luducard-restore-failed-for = Сбой восстановления для
luducard-never = Никогда

luducard-scan-title = Сканирование и добавление
luducard-scan-desc = Найдите сохранения игр на вашем компьютере
luducard-auto-search = Автоматический поиск
luducard-auto-search-desc = Сканирует общие системные папки (Steam, Epic, Документы и AppData) и ваши пользовательские папки на наличие изменений.
luducard-scanning = Сканирование...
luducard-start-scan = Запустить сканирование изменений
luducard-scan-completed = Сканирование завершено
luducard-scan-completed-desc = Обнаружение изменений завершено.
luducard-scan-error = Ошибка при сканировании.
luducard-custom-folder = Пользовательская
luducard-default-folder = Стандартная
luducard-folder-added = Папка добавлена в список отслеживания
luducard-folder-added-success = Папка успешно добавлена!
luducard-folder-select-error = Ошибка при выборе/добавлении папки.
luducard-emulator-detected = Выбранная папка принадлежит эмулятору { $emulator }.\n\nХотите добавить её как эмулятор для автоматического отслеживания сохранений?
luducard-adding-emulator = Добавление эмулятора и сканирование сохранений...
luducard-emulator-added-success = Эмулятор { $emulator } успешно добавлен! Обнаружено сохранений для { $count } игр.
luducard-emulator-added-empty = Эмулятор { $emulator } добавлен! Сохранений игр не обнаружено.
luducard-emulator-add-failed = Не удалось добавить эмулятор: { $error }
luducard-emulator-added-mock = Эмулятор успешно добавлен! (Демо-режим)
luducard-emulator-select-error = Ошибка при выборе/добавлении эмулятора.
luducard-emulator-removed = Эмулятор удален
luducard-emulator-remove-error = Ошибка при удалении эмулятора.
luducard-folder-removed = Папка удалена из списка отслеживания
luducard-folder-remove-error = Ошибка при удалении папки.
luducard-monitored-folders = Отслеживаемые папки
luducard-monitored-folders-desc = Корневые директории, постоянно сканируемые на наличие новых сохранений.
luducard-add-folder = Добавить папку
luducard-no-folders-detected = Папки с играми не найдены автоматически.
luducard-click-add-folder-desc = Нажмите «Добавить папку», чтобы выбрать папку библиотеки или эмуляторы.
luducard-monitoring-active = Мониторинг активен
luducard-remove-folder = Удалить папку
luducard-select-new-root = Выбрать новую корневую папку
luducard-monitored-emulators = Отслеживаемые эмуляторы
luducard-monitored-emulators-desc = Папки эмуляторов, проверяемые для автоопределения консольных сохранений.
luducard-add-emulator = Добавить эмулятор
luducard-no-emulators-configured = Эмуляторы не настроены.
luducard-click-add-emulator-desc = Нажмите «Добавить эмулятор» для импорта сохранений со Switch, Wii, Wii U, GBA, PS2 и др.
luducard-saves-integrated = Сохранения интегрированы в библиотеку
luducard-remove-emulator = Удалить эмулятор
luducard-add-other-emulator = Добавить другой эмулятор
luducard-scan-results = Результаты сканирования
luducard-scan-results-desc = Выберите, для каких игр с новыми или измененными сохранениями сделать бэкап.
luducard-starting-batch-backup = Запуск пакетного бэкапа для { $count } игр...
luducard-batch-backup-completed = Пакетный бэкап выбранных игр завершен!
luducard-batch-backup-failed = Сбой пакетного бэкапа.
luducard-backup-selected = Создать бэкап выбранных
luducard-no-new-saves-detected = Изменений не обнаружено. Все игры синхронизированы!
luducard-new-game = Новая игра
luducard-changed-save = Изменено

luducard-cloud-title = Облако и синхронизация
luducard-cloud-desc = Настройте удаленное резервное копирование сохранений
luducard-cloud-provider = Облачный провайдер
luducard-cloud-provider-desc = Выберите, где удаленно хранить ваши бэкапы.
luducard-auth-status = Статус авторизации и хранилища.
luducard-connected-as = Подключено как { $account }
luducard-oauth-authorized = Аккаунт авторизован через OAuth
luducard-disconnect = Отключить
luducard-space-used = Использовано места
luducard-connect-desc = Подключите аккаунт { $provider }, чтобы включить облачный бэкап сохранений.
luducard-connect-btn = Подключить аккаунт
luducard-sync-rules = Правила синхронизации
luducard-sync-rules-desc = Перемещение сохранений между ПК и облаком.
luducard-auto-upload = Автозагрузка после локального бэкапа
luducard-auto-upload-desc = Мгновенная отправка в облако после каждого бэкапа.
luducard-auto-upload-enabled = Автозагрузка включена
luducard-auto-upload-disabled = Автозагрузка выключена
luducard-download-if-newer = Скачивать, если облачное сохранение новее
luducard-download-if-newer-desc = Разрешение конфликтов в пользу более новой версии.
luducard-auto-download-enabled = Автоматическое скачивание включено
luducard-auto-download-disabled = Автоматическое скачивание выключено
luducard-disconnected-provider = { $provider } отключен
luducard-connected-provider = { $provider } подключен

luducard-loading = Загрузка...
luducard-fetching-details = Получение сведений об игре
luducard-loading-details = Загрузка сведений об игре...
luducard-details-desc = Подробности и история бэкапов
luducard-back = Назад
luducard-select = Выбрать
luducard-saved-versions = сохраненных версий
luducard-backup-now = Создать бэкап сейчас
luducard-restore-latest = Восстановить последнюю
luducard-open-game-folder-desc = Открыть папку с установленной игрой в Проводнике Windows
luducard-game-folder = Папка игры
luducard-open-save-folder-desc = Открыть рабочую папку сохранений
luducard-save-folder = Папка сохранений
luducard-open-backup-folder-desc = Открыть папку бэкапов Luducard
luducard-backup-folder = Папка бэкапов
luducard-export-save-desc = Экспортировать сохранение в виде сжатого файла .luducard для отправки
luducard-export-save = Экспортировать сохранение (.luducard)
luducard-status = Статус
luducard-saves-on-pc = Сохранения на ПК
luducard-total-backups = Всего бэкапов
luducard-quick-preferences = Быстрые настройки
luducard-save-history = История сохранений
luducard-config-presets = Пресеты конфигурации
luducard-saves-timeline = Временная шкала сохранений
luducard-presets-configs = Пресеты и настройки
luducard-no-backups-yet = Бэкапов еще нет
luducard-do-first-backup-desc = Создайте первый бэкап для этой игры, чтобы начать историю версий.
luducard-active = Активно
luducard-disabled = Отключено

luducard-support-title = Поддержать проект
luducard-support-desc = Помогите сохранить серверы сохранений и настроек в онлайне
luducard-support-intro-title = Luducard абсолютно бесплатен!
luducard-support-intro-desc = Поддержка облачных функций (Save Share Hub и пресеты) сопряжена с ежемесячными расходами на серверы и трафик. Если приложение полезно вам, поддержите проект, чтобы помочь нам оставаться в онлайне!
luducard-how-to-support = Способы поддержки проекта
luducard-how-to-support-desc = Выберите удобный способ взноса. Stripe поддерживает кредитные карты и Pix.
luducard-support-itch = Поддержать на Itch.io
luducard-support-stripe = Карты / Pix через Stripe
luducard-support-dest-desc = Все пожертвования полностью направляются на оплату облачных серверов (хостинг и трафик данных).

luducard-community-title = Save Share HUB
luducard-community-desc = Делитесь и загружайте файлы сохранений (чекпоинты) сообщества
luducard-btn-share-checkpoint = Поделиться чекпоинтом
luducard-repo-disconnected = Публичный репозиторий отключен
luducard-repo-disconnected-desc = Чтобы загружать чекпоинты сообщества и делиться своими, вам необходимо указать API URL вашего проекта Supabase и публичный Anon Key в настройках.
luducard-how-to-config = Инструкция по настройке:
luducard-config-step-1 = Создайте бесплатный проект в Supabase.
luducard-config-step-2 = Создайте таблицы, выполнив SQL-скрипт из файла supabase/schema.sql.
luducard-config-step-3 = Введите API URL и публичный Anon Key в настройках Luducard.
luducard-checkpoints = Чекпоинты
luducard-contributors = Авторы
luducard-search-placeholder = Поиск по названию игры или чекпоинта...
luducard-sort-popular = Популярные
luducard-sort-recent-hub = Новые
luducard-sort-size-hub = Размер
luducard-syncing-repo = Синхронизация с публичным репозиторием...
luducard-no-checkpoints-found = Чекпоинты не найдены
luducard-no-checkpoints-available = Чекпоинты отсутствуют
luducard-search-terms-desc = Попробуйте изменить поисковый запрос.
luducard-be-first-desc = Станьте первым, кто поделится сохранением с сообществом!
luducard-hub-unreachable-title = Не удалось подключиться к репозиторию
luducard-hub-unreachable-desc = Сервер не ответил. Проверьте подключение к интернету — если оно работает, репозиторий может быть временно недоступен.
luducard-hub-rejected-title = Репозиторий отклонил подключение
luducard-hub-rejected-desc = Настроенный ключ Supabase отклонён. Проверьте URL и Anon Key в настройках.
luducard-hub-error-title = Репозиторий вернул ошибку
luducard-hub-error-desc = Сервер ответил ошибкой, список не удалось загрузить.
luducard-btn-try-again = Повторить
luducard-no-desc-provided = Описание не предоставлено.
luducard-author-by = от
luducard-zstd-verified = Содержит проверенные метаданные zstd
luducard-btn-install = Установить
luducard-btn-installing = Установка...
luducard-security-sandbox-title = Автоматическая защита Seguro-Crash и Sandbox
luducard-security-sandbox-desc = При установке чекпоинта сообщества Luducard автоматически создает резервную копию вашего текущего сохранения перед его заменой. Если что-то пойдет не так, вы всегда сможете восстановить его из истории версий.
luducard-share-checkpoint-modal = Поделиться чекпоинтом
luducard-publish-progress-desc = Опубликуйте ваш файл сохранения в сообществе.
luducard-save-game-label = Игра сохранения *
luducard-search-installed-game = Введите название установленной игры...
luducard-backup-version-label = Версия бэкапа *
luducard-no-local-backups-desc = Локальные бэкапы для этой игры еще не создавались. Создайте бэкап в карточке игры.
luducard-checkpoint-title-label = Название чекпоинта *
luducard-checkpoint-title-placeholder = Например: Перед Маленией или 100% Прохождение (100 Уровень)
luducard-checkpoint-author-label = Имя автора
luducard-checkpoint-author-placeholder = Например: Аноним
luducard-checkpoint-desc-label = Описание / Дополнительные примечания
luducard-checkpoint-desc-placeholder = Опишите билд, уровень, важные предметы или момент прохождения.
luducard-checkpoint-tags-label = Теги чекпоинта
luducard-btn-cancel = Отмена
luducard-btn-publishing = Публикация...
luducard-btn-publish = Опубликовать чекпоинт
luducard-detail-modal-desc = Просмотр полных метаданных чекпоинта.
luducard-btn-close = Закрыть
luducard-btn-download-install = Скачать и установить
luducard-detail-title-label = Название чекпоинта:
luducard-detail-desc-label = Описание прогресса:
luducard-detail-tags-label = Теги:
luducard-detail-size-label = Сжатый размер:
luducard-detail-downloads-label = Всего скачиваний:
luducard-detail-author-label = Отправитель:
luducard-detail-date-label = Дата отправки:
luducard-date-today = Сегодня
luducard-date-yesterday = Вчера
luducard-date-days-ago = дн. назад
luducard-date-weeks-ago = нед. назад
luducard-date-locale = ru-RU

luducard-presethub-title = Preset Share HUB
luducard-presethub-desc = Открывайте для себя и делитесь графическими настройками и раскладками управления
luducard-btn-share-preset = Поделиться пресетом
luducard-presethub-disconnected = Репозиторий пресетов отключен
luducard-presethub-disconnected-desc = Чтобы загружать пресеты сообщества и делиться своими, вам необходимо указать API URL вашего проекта Supabase и публичный Anon Key в настройках.
luducard-presets = Пресеты
luducard-preset-search-placeholder = Поиск по названию игры, пресета или железу (например, RTX 4070)...
luducard-syncing-presets = Синхронизация пресетов...
luducard-no-presets-found = Графические пресеты не найдены
luducard-search-terms-desc-preset = Попробуйте изменить поисковый запрос.
luducard-badge-official = Официальный
luducard-gpu = Видеокарта (GPU)
luducard-approval = Рейтинг одобрения
luducard-useful = Полезно
luducard-useless = Бесполезно
luducard-report-preset = Пожаловаться на пресет
luducard-btn-undo = Отменить
luducard-btn-inject = Применить
luducard-btn-injecting = Применение...
luducard-not-installed = Не установлена
luducard-security-safety-title = Безопасность гарантирована Seguro-Crash
luducard-security-safety-desc = При скачивании любого графического пресета из HUB Luducard делает резервную копию ваших предыдущих настроек. Ваши файлы сохранений с прогрессом остаются нетронутыми.
luducard-share-preset-modal-title = Поделиться графическим пресетом
luducard-share-preset-modal-desc = Отправьте локальный графический пресет в сообщество.
luducard-preset-game-label = Игра пресета *
luducard-search-installed-game-preset = Поиск установленной игры...
luducard-choose-local-preset-label = Выбрать локальный пресет *
luducard-no-local-presets-desc = Локальные пресеты для этой игры не найдены. Перейдите в карточку игры и создайте локальный пресет!
luducard-preset-title-label = Название пресета *
luducard-preset-creator-label = Автор / Создатель
luducard-preset-desc-label = Описание / Примечания пресета
luducard-preset-tags-label = Теги пресета
luducard-preset-hardware-label = Железо автора (Заполняется автоматически на основе локального пресета):
luducard-cpu = Процессор (CPU)
luducard-ram = ОЗУ (RAM)
luducard-btn-publish-preset = Опубликовать пресет
luducard-detail-preset-title = Название пресета:
luducard-detail-preset-desc = Описание / Оптимизации:
luducard-detail-author-specs = Железо автора:

luducard-tag-desc-100 = Игра пройдена на 100%, разблокированы все достижения, предметы и коллекционные вещи.
luducard-tag-desc-dlc1 = Прогресс сфокусирован на подготовке или готовности к запуску первого DLC.
luducard-tag-desc-dlc2 = Прогресс сфокусирован на подготовке или готовности к запуску второго DLC.
luducard-tag-desc-ngplus = Игра готова к запуску или уже запущена в режиме "Новая игра+".
luducard-tag-desc-vanilla = Чистый прогресс оригинальной игры без модификаторов, модов или читов.
luducard-tag-desc-modded = Прогресс получен с использованием модификаций (модов), влияющих на геймплей.
luducard-tag-desc-bossprep = Сохранение создано непосредственно перед важным боссом в игре.
luducard-tag-desc-starter = Сохранение в самом начале игры с накопленными ресурсами или пропущенным обучением.
luducard-tag-desc-cleanstart = Сохранение сразу после создания персонажа или вступления, готовое к старту игры без обучения.
luducard-tag-desc-midgame = Сохранение на середине прохождения сюжетной кампании (отлично подходит для тех, кто потерял сохранения).
luducard-tag-desc-postgame = Сюжет пройден, идеальный вариант для сражений с секретными боссами, добивания достижений или побочных активностей.
luducard-tag-desc-opbuild = Сохранение с персонажем, имеющим максимально сильное снаряжение, уровень и сборку (Overpowered).
luducard-tag-desc-unlimitedcash = Сохранение с максимальным или бесконечным количеством игровой валюты, монет или ресурсов.
luducard-tag-desc-allcollectibles = Сохранение с полностью собранными коллекционными предметами и выполненными второстепенными задачами.
luducard-tag-desc-hardcore = Сохранение на максимальном уровне сложности или с активированной перманентной смертью (хардкор).
luducard-tag-desc-speedrunready = Идеальное сохранение для тренировки отдельных сегментов спидрана или находящееся на быстрейшем маршруте.
luducard-tag-desc-legit = Честное прохождение игры без читов, кодов и использования багов (гличей).
luducard-preset-tag-desc-perf = Оптимизации, направленные на прирост кадров в секунду (FPS) и плавность.
luducard-preset-tag-desc-quality = Настройки, сфокусированные на достижении максимального качества графики.
luducard-preset-tag-desc-balanced = Оптимальный баланс между качеством картинки и производительностью (FPS).
luducard-preset-tag-desc-deck = Настройки, оптимизированные под экран и энергопотребление портативной консоли Steam Deck.
luducard-preset-tag-desc-potato = Для запуска игры на очень старых ПК или слабых ноутбуках.
luducard-preset-tag-desc-controls = Персональная настройка кнопок управления, геймпада или горячих клавиш.
luducard-preset-tag-desc-rt = Тонкая настройка графики с включенной трассировкой лучей для сохранения комфортного FPS.
luducard-preset-tag-desc-4k = Настройки, оптимизированные под запуск на 4K-мониторах и телевизорах высокого разрешения.
luducard-preset-tag-desc-vr = Настройки, подобранные для обеспечения стабильной кадровой частоты в виртуальной реальности.
luducard-files-mapped = сопоставленных файлов

# Game detail: presets tab, backup details, backup kinds
luducard-pinned = Закреплено
luducard-export-btn = Экспорт
luducard-my-presets-tab = Мои пресеты (локальные и загруженные)
luducard-community-presets-tab = Пресеты сообщества
luducard-upload-to-hub-btn = Загрузить в HUB
luducard-undo-restore-original = Отменить и вернуть исходное
luducard-fetching-cloud-presets = Загрузка пресетов из облака...
luducard-installing = Установка...
luducard-local-backup-details = Сведения о локальной резервной копии
luducard-backup-type-label = Тип резервной копии:
luducard-mapping-local-files = Сопоставление локальных файлов...
luducard-mapping-files = Сопоставление файлов...
luducard-your-name-label = Ваше имя / никнейм
luducard-detecting-hardware = Определение локального оборудования...
luducard-cpu-full-label = Процессор (CPU)
luducard-preset-detail-modal-desc = Просмотр полных метаданных пресета.
luducard-shortcut-input-title = Нажмите и введите нужное сочетание клавиш
luducard-backup-kind-automatic = Автоматически
luducard-backup-kind-manual = Вручную
luducard-backup-kind-manual-locked = Вручную (заблокировано)
luducard-backup-kind-before-close = Перед закрытием
luducard-backup-kind-restore = Восстановление

# Save Share: game picker
luducard-search-game-with-backups = Введите название игры с резервными копиями...
luducard-no-games-with-backups = Игр с резервными копиями не найдено

# Conflict resolution, version locking, install results
luducard-toast-resolving-keep-local = Разрешение конфликта: сохраняется локальная версия
luducard-toast-resolving-take-cloud = Разрешение конфликта: загружается облачная версия
luducard-backup-of = Резервная копия
luducard-exported-from-backup = Экспортировано из локальной резервной копии от
luducard-toast-locking-version = Блокировка версии
luducard-toast-unlocking-version = Разблокировка версии
luducard-toast-version-locked = Версия заблокирована! Она не будет удалена автоматически.
luducard-toast-version-unlocked = Версия успешно разблокирована.
luducard-error-game-not-found = не найдена в вашей локальной библиотеке или не настроена папка сохранений.
luducard-game-label = Игра
luducard-toast-checkpoint-installed = успешно установлен! Предыдущее сохранение помещено в историю.
luducard-checkpoint-label = Чекпоинт

# Toasts and status messages
luducard-toast-load-community-presets-failed = Ошибка загрузки пресетов сообщества.
luducard-toast-load-profiles-failed = Ошибка загрузки профилей сохранений.
luducard-toast-profile-title-required = Укажите название профиля.
luducard-toast-creating-profile = Создание нового профиля сохранений...
luducard-toast-select-config-file = Выберите хотя бы один файл настроек.
luducard-toast-saving-local-preset = Сохранение локальных настроек как пресета...
luducard-confirm-delete-local-preset = Действительно удалить этот локальный пресет навсегда?
luducard-toast-deleting-local-preset = Удаление локального пресета...
luducard-toast-crash-safety-starting = Запуск Safe-Crash для защиты настроек...
luducard-toast-downloading-applying-preset = Загрузка и применение пресета оптимизированных настроек...
luducard-toast-community-preset-applied = Пресет сообщества успешно применён! Сохранён в локальной библиотеке.
luducard-toast-restoring-crash-safety = Восстановление исходных файлов настроек из Safe-Crash...
luducard-toast-original-config-restored = Исходные настройки успешно восстановлены! Сохранения не тронуты.
luducard-toast-vote-failed = Не удалось учесть голос.
luducard-toast-report-sent-preset = Жалоба отправлена! После 3 жалоб пресет скроют от сообщества.
luducard-toast-report-failed = Не удалось отправить жалобу.
luducard-toast-preset-title-required = Заполните название пресета.
luducard-toast-packing-config-files = Упаковка файлов настроек...
luducard-toast-publishing-preset-metadata = Публикация метаданных пресета в сообществе...
luducard-error-preset-cloud-limit = Достигнут предел в 5 активных пресетов в облаке.
luducard-toast-manage-deletions-in-app = Управляйте удалением резервных копий в основном приложении
luducard-toast-default-path-restored = Путь по умолчанию успешно восстановлен!
luducard-toast-load-hub-failed = Ошибка загрузки данных хаба пресетов.
luducard-toast-vote-error = Ошибка при учёте голоса.
luducard-toast-report-sent-hub = Жалоба отправлена! Пресеты с 3+ жалобами скрываются.
luducard-toast-report-send-failed = Не удалось пожаловаться.
luducard-toast-fill-required-fields = Заполните все обязательные поля.
luducard-toast-compressing-encrypting = Сжатие и шифрование файлов настроек...
luducard-toast-requesting-upload-permission = Запрос разрешения на безопасную загрузку...
luducard-toast-publishing-to-preset-repo = Публикация метаданных в репозитории пресетов...
luducard-error-preset-cloud-limit-reached = Вы уже достигли предела в 5 активных пресетов в облаке.
luducard-toast-backend-connection-error = Ошибка соединения с бэкендом приложения.
luducard-toast-requesting-cloud-upload-permission = Запрос разрешения на безопасную загрузку в облако...
luducard-toast-publishing-to-public-repo = Публикация метаданных в публичном репозитории...
luducard-error-checkpoint-cloud-limit = Вы уже достигли предела в 5 активных чекпоинтов в облаке.
luducard-toast-save-note-failed = Не удалось сохранить заметку
luducard-toast-save-note-failed-2 = Не удалось сохранить заметку
luducard-toast-change-path-failed = Ошибка при изменении пути
luducard-toast-restore-path-failed = Ошибка при восстановлении пути
luducard-toast-backup-failed = Резервное копирование не удалось
luducard-toast-restore-failed = Не удалось восстановить
luducard-toast-restore-version-failed = Не удалось восстановить версию
luducard-toast-export-backup-failed = Не удалось экспортировать резервную копию
luducard-toast-change-version-status-failed = Не удалось изменить статус версии
luducard-toast-open-folder-failed = Ошибка при открытии папки
luducard-toast-export-failed = Не удалось экспортировать
luducard-toast-create-profile-failed = Не удалось создать профиль
luducard-toast-switch-profile-failed = Ошибка при переключении профиля
luducard-toast-delete-profile-failed = Ошибка при удалении профиля
luducard-toast-save-local-preset-failed = Не удалось сохранить локальный пресет
luducard-toast-apply-local-preset-failed = Не удалось применить локальный пресет
luducard-toast-delete-preset-failed = Ошибка при удалении пресета
luducard-toast-apply-preset-failed = Не удалось применить пресет
luducard-toast-restore-crash-safety-failed = Не удалось восстановить резервную копию Safe-Crash
luducard-error-register-preset-failed = Не удалось зарегистрировать пресет
luducard-toast-publish-preset-failed = Ошибка при публикации пресета
luducard-error-get-download-url-failed = Не удалось получить URL загрузки
luducard-toast-inject-preset-failed = Не удалось применить пресет
luducard-toast-revert-configs-failed = Не удалось откатить настройки
luducard-error-register-preset-failed-2 = Не удалось зарегистрировать пресет
luducard-toast-publish-preset-failed-2 = Ошибка при публикации пресета
luducard-error-get-download-url-failed-2 = Не удалось получить URL загрузки
luducard-toast-install-checkpoint-failed = Не удалось скачать/установить чекпоинт
luducard-error-register-checkpoint-failed = Не удалось зарегистрировать чекпоинт в базе
luducard-toast-publish-failed = Ошибка при публикации
luducard-toast-restoring-default-path = Восстановление пути по умолчанию для
luducard-toast-local-version-saved = Локальная версия
luducard-toast-saved-to-cloud = сохранена в облаке!
luducard-toast-cloud-version-restored = Облачная версия
luducard-toast-restored-suffix = восстановлена!
luducard-toast-resolve-conflict-failed = Не удалось разрешить конфликт для
luducard-toast-latest-version-restored = Последняя версия
luducard-toast-restoring-version = Восстановление версии
luducard-toast-version-restored = Версия от
luducard-toast-switching-profile = Переключение на профиль
luducard-toast-may-take-seconds = Это может занять несколько секунд.
luducard-confirm-delete-profile = Действительно удалить профиль
luducard-confirm-delete-profile-warning = Все сохранения этого профиля будут удалены навсегда.
luducard-toast-deleting-profile = Удаление профиля
luducard-toast-profile-deleted = Профиль
luducard-toast-deleted-suffix = успешно удалён!
luducard-toast-starting-crash-safety-for = Запуск Safe-Crash для настроек
luducard-toast-local-preset-applied = Локальный пресет
luducard-toast-applied-suffix = успешно применён!
luducard-error-quota-or-limit = Ошибка квоты или лимита в репозитории.
luducard-toast-starting-crash-safety-for-game = Запуск Safe-Crash для настроек
luducard-toast-installing-preset = Установка пресета
luducard-toast-restoring-original-settings = Восстановление исходных настроек
luducard-toast-settings-restored = Настройки
luducard-toast-restored-saves-untouched = восстановлены. Сохранения не тронуты!
luducard-error-cloud-storage-quota = Ошибка квоты облачного хранилища.
luducard-toast-uploading-preset = Отправка пресета в облако
luducard-toast-preset-applied-saved = Пресет применён и сохранён в локальных пресетах. Safe-Crash активен!
luducard-toast-fill-required-fields-cm = Заполните все обязательные поля.
luducard-toast-downloading-checkpoint = Загрузка и установка чекпоинта... Safe-Crash создаст автоматическую резервную копию.
luducard-error-cloud-storage-quota-limit = Ошибка квоты/лимита облачного хранилища.

# Game detail: presets & configs
luducard-restore-btn = Восстановить
luducard-delete-version = Удалить версию
luducard-unpin-version = Открепить версию (разрешить автоудаление)
luducard-pin-version = Закрепить версию (запретить автоудаление)
luducard-save-current-config = Сохранить текущую конфигурацию
luducard-save-current-config-desc = Создайте локальный пресет из активных настроек игры.
luducard-save-new-config-btn = Сохранить новую конфигурацию
luducard-no-local-presets = Нет локальных пресетов
luducard-no-local-presets-hint = Сохраните локальные настройки графики и управления как пресет или поделитесь ими.
luducard-no-description = Без описания.
luducard-apply-btn = Применить
luducard-crash-safety-active = Safe-Crash активен
luducard-crash-safety-active-desc = Вы недавно применили пресет. При сбоях восстановите исходные настройки.
luducard-no-community-presets = Нет пресетов сообщества
luducard-no-community-presets-desc = Для этой игры нет опубликованных пресетов в облаке. Создайте локальный и поделитесь!
luducard-downloads-label = Загрузки:
luducard-download-apply-btn = Скачать и применить
luducard-delete = Удалить
luducard-version-info-desc = Сведения о версии и заметки кампании.
luducard-date-time-label = Дата и время:
luducard-at = в
luducard-file-size-label = Размер файла:
luducard-campaign-notes-label = Заметки кампании / описание прогресса
luducard-campaign-notes-placeholder = Например: остановился после победы над драконом. Уровень 45, билд на ловкость...
luducard-save-notes-btn = Сохранить заметки
luducard-share-config-preset-title = Поделиться пресетом настроек
luducard-share-config-preset-desc = Сохраните и отправьте свои локальные оптимизации сообществу.
luducard-detected-config-files = Обнаруженные файлы настроек:
luducard-no-config-files-detected = Не удалось обнаружить файлы настроек по сопоставлению Ludusavi.
luducard-preset-title-placeholder = Например: Potato Mode (Max Performance) или Balanced DF Specs
luducard-preset-desc-detailed-label = Описание (версия игры, ожидаемый прирост FPS и т. д.)
luducard-preset-desc-placeholder = Например: примерно +15 % FPS в городе. Проверено на версии 1.63.
luducard-detected-hardware-label = Обнаруженное железо (характеристики автора):
luducard-gpu-label = Видеокарта (GPU)
luducard-ram-label = Оперативная память
luducard-create-local-preset-title = Создать локальный пресет
luducard-create-local-preset-desc = Сохраните текущие настройки этой игры в локальный профиль.
luducard-local-preset-title-placeholder = Например: Моя оптимизация 60fps или Управление полётом
luducard-local-preset-desc-placeholder = Опишите, что меняет этот пресет (например, снижает объёмные тени ради производительности).
luducard-included-files-label = Включённые файлы (обнаружены автоматически):
luducard-no-files-detected = Ludusavi не обнаружил файлов.
luducard-create-preset-btn = Создать пресет
luducard-no-presets-here = Здесь пока нет пресетов
luducard-be-first-to-share = Станьте первым, кто поделится пресетом графики или управления с сообществом!

# Save profiles (modding)
luducard-activate-profile-btn = Активировать профиль
luducard-active-profile-banner = Активный профиль в системе:
luducard-active-profile-banner-desc = При переключении профиля текущие сохранения из папки игры автоматически помещаются в ранее активный профиль, чтобы избежать потери данных.
luducard-cancel = Отмена
luducard-cant-delete-active = Невозможно удалить активный профиль
luducard-change-save-path-btn = Изменить путь сохранений
luducard-clone-current-saves = Клонировать текущий прогресс
luducard-clone-current-saves-desc = Копирует сохранения, находящиеся сейчас в папке игры, в этот профиль (рекомендуется).
luducard-cloud-sync = Облачная синхронизация
luducard-cloud-sync-upload = Отправить в облако
luducard-confirm-reset-save-path = Действительно сбросить путь сохранений этой игры к значению по умолчанию из манифеста?
luducard-create-profile-btn = Создать профиль
luducard-new-save-profile-btn = Новый профиль сохранений
luducard-create-profile-desc = Начните параллельную кампанию или изолируйте сохранения с модами.
luducard-create-profile-title = Создать профиль сохранений
luducard-created-at = Создан
luducard-creation-options = Параметры запуска:
luducard-delete-profile = Удалить профиль
luducard-loading-profiles = Загрузка профилей сохранений...
luducard-no-profiles-desc = Игра использует стандартные файлы сохранений вашей системы. Создайте первый профиль, чтобы начать упорядочивать кампании.
luducard-no-profiles-yet = Нет профилей сохранений
luducard-no-save-path = Путь не настроен
luducard-none = Нет (используются отдельные сохранения)
luducard-profile-active-tag = Активен в системе
luducard-profile-desc-label = Описание
luducard-profile-desc-placeholder = Опишите назначение этого профиля (например, прохождение классом воина).
luducard-profile-inactive-tag = Неактивен
luducard-profile-name-label = Название профиля *
luducard-profile-name-placeholder = Например: Моя ванильная кампания или Modded Run
luducard-profiles-header = Управление профилями сохранений
luducard-profiles-intro = Создавайте отдельные кампании или изолируйте игру с модами. Luducard автоматически переключит и сохранит соответствующие сохранения.
luducard-reset-save-path-btn = Сбросить к пути по умолчанию
luducard-save-profiles-tab = Профили сохранений
luducard-save-profiles-title = Профили сохранений (моддинг)
luducard-start-empty = Начать с нуля (пусто)
luducard-start-empty-desc = Текущая папка сохранений игры будет очищена, чтобы вы начали полностью новый прогресс.

luducard-anonymous = Аноним
luducard-author-by-label = Автор:
luducard-preset-downloaded-from-community = Загружено из сообщества - автор
luducard-preset-tag-perf = Производительность
luducard-preset-tag-quality = Качество / Графика
luducard-preset-tag-balanced = Сбалансированный
luducard-preset-tag-deck = Steam Deck
luducard-preset-tag-potato = Режим «картошка»
luducard-preset-tag-controls = Управление / Раскладка
luducard-preset-tag-rt = Оптим. трассировки лучей
luducard-preset-tag-4k = Готов к 4K
luducard-preset-tag-vr = Готов к VR

luducard-schedule-auto-routine = Расписание автосохранений
luducard-schedule-auto-routine-desc = Задайте время для создания автоматических бэкапов.
luducard-schedule-by-interval = По интервалу
luducard-schedule-by-days = Дни недели
luducard-schedule-backup-every = Создавать бэкап каждые
luducard-schedule-1-hour = 1 час
luducard-schedule-3-hours = 3 часа
luducard-schedule-6-hours = 6 часов
luducard-schedule-12-hours = 12 часов
luducard-schedule-24-hours = 24 часа
luducard-schedule-at-time = В назначенное время
luducard-schedule-games-in-schedule = Игры в расписании
luducard-schedule-games-in-schedule-desc = Выберите игры, которые будут сохраняться автоматически по этому расписанию.
luducard-schedule-btn-save = Сохранить расписание
luducard-schedule-saved-toast = Расписание успешно сохранено

luducard-day-sun = Вс
luducard-day-mon = Пн
luducard-day-tue = Вт
luducard-day-wed = Ср
luducard-day-thu = Чт
luducard-day-fri = Пт
luducard-day-sat = Сб

luducard-notification-alerts = Оповещения и уведомления
luducard-notification-alerts-desc = Выберите, как вы хотите получать уведомления о бэкапах.
luducard-notification-windows = Системные уведомления Windows
luducard-notification-windows-desc = Уведомлять при успешном завершении резервного копирования.
luducard-notification-toast-enabled = Уведомления включены
luducard-notification-toast-disabled = Уведомления отключены
luducard-notification-fail-alerts = Оповещения об ошибках
luducard-notification-fail-alerts-desc = Немедленно уведомлять при сбое резервного копирования.
luducard-notification-toast-fail-enabled = Оповещения об ошибках включены
luducard-notification-toast-fail-disabled = Оповещения об ошибках отключены
luducard-notification-sounds = Звуки оповещения
luducard-notification-sounds-desc = Воспроизводить звук при успешном завершении или ошибке бэкапа.
luducard-notification-toast-sounds-enabled = Звуки включены
luducard-notification-toast-sounds-disabled = Звуки отключены


luducard-cloud-details-title = Детали аккаунта
luducard-cloud-email = Email аккаунта:
luducard-cloud-destination = Целевая папка:
luducard-cloud-engine = Движок резервного копирования:
luducard-cloud-path = Путь к файлу:
luducard-cloud-rules-title = Правила синхронизации
luducard-cloud-upload-auto = Автозагрузка
luducard-cloud-upload-auto-desc = Загружать сохранения сразу после создания локальной копии.
luducard-cloud-download-latest = Скачать последнее
luducard-cloud-download-latest-desc = Отдавать приоритет более новым файлам в облаке.
luducard-cloud-toast-upload-enabled = Автозагрузка включена
luducard-cloud-toast-upload-disabled = Автозагрузка выключена
luducard-cloud-toast-download-enabled = Автоскачивание включено
luducard-cloud-toast-download-disabled = Автоскачивание выключено
luducard-support-dest = Распределение ресурсов
luducard-danger-zone = Опасная зона
luducard-danger-zone-desc = Деструктивные действия, которые нельзя отменить.
luducard-reset-warning-title = ВАЖНОЕ ПРЕДУПРЕЖДЕНИЕ:
luducard-reset-warning-desc = Это навсегда сотрет все ваши настройки, пути поиска, облачные учетные данные и профили сохранений. Исходные папки на диске удалены не будут.
luducard-btn-reset-app = Очистить все данные
luducard-btn-reset-confirm = Да, подтвердить удаление
luducard-btn-reset-cancel = Отмена

luducard-notify-quick-save-title = Быстрое сохранение
luducard-notify-quick-save-done-title = Быстрое сохранение выполнено
luducard-notify-quick-save-done = Резервная копия «{ $game }» успешно сохранена.
luducard-notify-quick-save-failed-title = Ошибка быстрого сохранения
luducard-notify-quick-save-failed = Не удалось сохранить «{ $game }»: { $message }
luducard-notify-quick-save-no-game = Не удалось определить игру на переднем плане.
luducard-notify-quick-save-unmatched = { $exe } не является игрой из вашей библиотеки.
luducard-notify-auto-backup-title = Автоматическое резервное копирование
luducard-notify-auto-backup-done = Сохранение «{ $game }» успешно скопировано.
luducard-notify-auto-backup-failed-title = Ошибка автоматического копирования
luducard-notify-auto-backup-failed = Не удалось сохранить «{ $game }»: { $message }
luducard-notify-scan-done-title = Сканирование завершено
luducard-notify-scan-done =
    В вашей библиотеке найдено { $total } { $total ->
        [one] игра
        [few] игры
       *[other] игр
    }.
luducard-notify-tray-title = Luducard всё ещё работает
luducard-notify-tray-body = Приложение свёрнуто в системный лоток.
luducard-tray-show = Показать окно
luducard-tray-quit = Выйти из Luducard

luducard-quicksave = Экстренное сочетание клавиш (быстрое сохранение)
luducard-quicksave-desc = Глобальное сочетание клавиш (Save State для ПК) для резервного копирования игры на переднем плане.
luducard-quicksave-press-keys = Нажмите клавиши...
luducard-card-size-small = Маленькие обложки
luducard-card-size-medium = Средние обложки
luducard-card-size-large = Большие обложки

luducard-wizard-title = Первоначальная настройка игр
luducard-wizard-desc = Чтобы создавать резервные копии автоматически, Luducard нужно знать, где установлены ваши игры. Мы нашли следующие папки:
luducard-wizard-confirm = Подтвердить и сохранить
luducard-wizard-skip = Пропустить / настроить позже
luducard-wizard-close = Закрыть
luducard-scan-after-wizard = Искать новые сохранения сразу после сохранения
luducard-detecting-launchers = Поиск установленных платформ...
luducard-detection-failed = Не удалось определить установленные платформы.
luducard-no-platforms-detected = Стандартные платформы не найдены.
luducard-no-platforms-desc = Ничего страшного — вы сможете добавить папки с играми вручную после закрытия помощника.
luducard-saving-folders = Сохранение папок и настройка отслеживания...
luducard-folders-saved-success = Папки успешно настроены.
luducard-save-wizard-failed = Не удалось сохранить отслеживаемые папки.

luducard-conflict-title = Обнаружен конфликт сохранений
luducard-conflict-this-pc = Этот компьютер
luducard-conflict-cloud = Облако
luducard-conflict-newer = Новее
luducard-conflict-older = Старее
luducard-conflict-keep-local = Оставить версию с этого компьютера
luducard-conflict-keep-cloud = Оставить версию из облака

luducard-scan-phase-starting = Запуск сканирования...
luducard-scan-phase-saves = Поиск сохранений на диске...
luducard-scan-phase-game = Анализ найденных игр...
luducard-scan-phase-emulators = Сканирование эмуляторов...
luducard-scan-phase-processing = Обработка результатов...
luducard-scan-phase-finalizing = Завершение и сохранение кэша...
luducard-scan-phase-done = Сканирование завершено.
luducard-games-found = игр найдено

luducard-toast-backing-up = Резервное копирование выбранных игр...
luducard-toast-backup-success = Резервное копирование успешно завершено.
luducard-schedule-all-games = Резервировать все игры
luducard-back-to-top = Наверх
luducard-platform-other = Другое
