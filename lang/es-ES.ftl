ludusavi = Ludusavi
language = Idioma
game-name = Nombre
total-games = Juegos
file-size = TamaÃ±o
file-location = UbicaciÃ³n
overall = Global
status = Estatus
cli-unrecognized-games = No hay informaciÃ³n para estos juegos:
cli-unable-to-request-confirmation = No se pudo solicitar confirmaciÃ³n.
    .winpty-workaround = Si estÃ¡s usando un emulador de Bash (como Git Bash), intenta ejecutar winpty.
cli-backup-id-with-multiple-games = No se puede especificar el ID de copia de seguridad al restaurar mÃºltiples juegos.
cli-invalid-backup-id = ID de copia de seguridad invÃ¡lido.
badge-failed = FALLADO
badge-duplicates = DUPLICADOS
badge-duplicated = DUPLICADO
badge-ignored = IGNORADO
badge-redirected-from = DESDE: { $path }
badge-redirecting-to = A: { $path }
some-entries-failed = Algunas entradas no se han podido procesar; busca { badge-failed } en la salida para ver los detalles. Comprueba si puedes acceder a esos archivos o si sus rutas son muy largas.
cli-game-line-item-redirected = Redirigido de: { $path }
cli-game-line-item-redirecting = Redirigiendo a: { $path }
button-backup = Respaldar
button-preview = Previsualizar
button-restore = Restaurar
button-nav-backup = MODO DE RESPALDO
button-nav-restore = MODO DE RESTAURACIÃ“N
button-nav-custom-games = JUEGOS PERSONALIZADOS
button-nav-other = OTROS
button-add-game = AÃ±adir juego
button-continue = Continuar
button-cancel = Cancelar
button-cancelling = Cancelando...
button-okay = De acuerdo
button-select-all = Seleccionar todos
button-deselect-all = Deseleccionar todos
button-enable-all = Habilitar todos
button-disable-all = Deshabilitar todos
button-customize = Personalizar
button-exit = Salir
button-comment = Comentar
button-lock = Bloquear
button-unlock = Desbloquear
# This opens a download page.
button-get-app = Obtener { $app }
button-validate = Validar
button-override-manifest = Reemplazar manifiesto
button-extend-manifest = Extender manifiesto
button-sort = Ordenar
button-download = Descargar
button-upload = Subir
button-ignore = Ignorar
no-roots-are-configured = AÃ±ade algunas raÃ­ces para respaldar aÃºn mÃ¡s datos.
config-is-invalid = Error: El archivo de configuraciÃ³n no es vÃ¡lido.
manifest-is-invalid = Error: El archivo de manifiesto no es vÃ¡lido.
manifest-cannot-be-updated = Error: No se ha podido comprobar la actualizaciÃ³n del archivo de manifiesto. Â¿Se ha caÃ­do la conexiÃ³n a Internet?
cannot-prepare-backup-target = Error: No se pudo preparar el destino de la copia de seguridad (creando o vaciando la carpeta). Si tiene la carpeta abierta en su navegador de archivos, intente cerrarla: { $path }
restoration-source-is-invalid = Error: La fuente de restauraciÃ³n no es vÃ¡lida (no existe o no es un directorio). Por favor, comprueba la ubicaciÃ³n: { $path }
registry-issue = Error: Se omitieron algunas entradas del registro.
unable-to-browse-file-system = Error: No se puede navegar en su sistema.
unable-to-open-directory = Error: no se puede abrir el directorio:
unable-to-open-url = Error: No se puede abrir la URL:
unable-to-configure-cloud = No se ha podido configurar la nube.
unable-to-synchronize-with-cloud = No se ha podido sincronizar con la nube.
cloud-synchronize-conflict = Tus copias de seguridad locales y en la nube estÃ¡n en conflicto. Realiza una subida o descarga para resolver esto.
command-unlaunched = El comando no se iniciÃ³: { $command }
command-terminated = Comando finalizado abruptamente: { $command }
command-failed = Comando fallÃ³ con el cÃ³digo { $code }: { $command }
processed-games =
    { $total-games } { $total-games ->
        [one] juego
       *[other] juegos
    }
processed-games-subset =
    { $processed-games } de { $total-games } { $total-games ->
        [one] juego
       *[other] juegos
    }
processed-size-subset = { $processed-size } de { $total-size }
field-backup-target = Respaldar a:
field-restore-source = Restaurar desde:
field-custom-files = Rutas:
field-custom-registry = Registro:
field-sort = Ordenar por:
field-redirect-source =
    .placeholder = Origen (ubicaciÃ³n original)
field-redirect-target =
    .placeholder = Destino (nueva ubicaciÃ³n)
field-roots = RaÃ­ces:
field-backup-excluded-items = Exclusiones de copia de seguridad:
field-redirects = Redirecciones:
# This appears next to the number of full backups that you'd like to keep.
# A full backup includes all save files for a game.
field-retention-full = Completo:
# This appears next to the number of differential backups that you'd like to keep.
# A differential backup includes only the files that have changed since the last full backup.
field-retention-differential = Diferencial:
field-backup-format = Formato:
field-backup-compression = CompresiÃ³n:
# The compression level determines how much compresison we perform.
field-backup-compression-level = Nivel:
label-manifest = Manifiesto
# This shows the time when we checked for an update to the manifest.
label-checked = Marcado
# This shows the time when we found an update to the manifest.
label-updated = Actualizado
label-new = Nuevo
label-removed = Eliminado
label-comment = Comentario
label-unchanged = Sin cambios
label-backup = Copia de seguridad
label-scan = Escanear
label-filter = Filtro
label-unique = Ãšnico
label-complete = Completado
label-partial = Parcial
label-enabled = Habilitado
label-disabled = Deshabilitado
# https://en.wikipedia.org/wiki/Thread_(computing)
label-threads = Hilos
label-cloud = Nube
# A "remote" is what Rclone calls cloud systems like Google Drive.
label-remote = Remoto
label-remote-name = Nombre remoto
label-folder = Carpeta
# An executable file
label-executable = Ejecutable
# Options given to a command line program
label-arguments = Argumentos
label-url = URL
# https://en.wikipedia.org/wiki/Host_(network)
label-host = AnfitriÃ³n
# https://en.wikipedia.org/wiki/Port_(computer_networking)
label-port = Puerto
label-username = Nombre de usuario
label-password = ContraseÃ±a
# This is a specific website or service that provides some cloud functionality.
# For example, Nextcloud and Owncloud are providers of WebDAV services.
label-provider = Proveedor
label-custom = Personalizado
label-none = Ninguno
label-change-count = Cambios: { $total }
label-unscanned = Sin escanear
# This refers to a local file on the computer
label-file = Archivo
label-game = Juego
# Aliases are alternative titles for the same game.
label-alias = Alias
label-original-name = Nombre original
# Which manifest a game's data came from
label-source = Fuente
# This refers to the main Ludusavi manifest: https://github.com/mtkennerly/ludusavi-manifest
label-primary-manifest = Manifiesto primario
# This refers to how we integrate a custom game with the manifest data.
label-integration = IntegraciÃ³n
# This is a folder name where a specific game is installed
label-installed-name = Nombre de instalaciÃ³n
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
store-other-home = Carpeta Home
# This would be a folder acting as a virtual C: drive, created by Wine.
store-other-wine = Prefijo de Wine
# This would be a folder with typical Windows system folders,
# like "Program Files (x86)" and "Users".
store-other-windows = Unidad de Windows
# This would be a folder with typical Linux system folders,
# like "home" and "opt".
store-other-linux = Unidad de Linux
# This would be a folder with typical Mac system folders,
# like "Applications" and "Users".
store-other-mac = Unidad de Mac
store-other = Otro
backup-format-simple = Simple
backup-format-zip = Zip
compression-none = Ninguno
# "Deflate" is a proper noun: https://en.wikipedia.org/wiki/Deflate
compression-deflate = Deflate
compression-bzip2 = Bzip2
compression-zstd = Zstd
theme = Tema
theme-light = Claro
theme-dark = Oscuro
redirect-bidirectional = Bidireccional
reverse-redirects-when-restoring = Invertir secuencia de redirecciones al restaurar
show-disabled-games = Mostrar juegos desactivados
show-unchanged-games = Mostrar juegos sin cambios
show-unscanned-games = Mostrar juegos no escaneados
override-max-threads = Anular hilos mÃ¡ximos
synchronize-automatically = Sincronizar automÃ¡ticamente
prefer-alias-display = Mostrar alias en lugar del nombre original
skip-unconstructive-backups = Saltar la copia de seguridad cuando solo se van a eliminar datos, pero no se va a agregar ni actualizar nada
explanation-for-exclude-store-screenshots = En las copias de seguridad, excluye las capturas de pantalla especÃ­ficas de la tienda
explanation-for-exclude-cloud-games = No hacer copias de seguridad de juegos con soporte en la nube en estas plataformas
consider-doing-a-preview =
    Si aÃºn no lo has hecho, considera hacer una vista previa primero para que
    no haya sorpresas.
confirm-backup =
    Â¿EstÃ¡s seguro de que quieres proceder con la copia de seguridad? { $path-action ->
        [merge] Los nuevos datos guardados se combinaran en la carpeta de destino:
       *[create] Se crearÃ¡ la carpeta de destino:
    }
confirm-restore =
    Â¿EstÃ¡s seguro de que deseas continuar con la restauraciÃ³n?
    Esto sobrescribirÃ¡ cualquier archivo actual con las copias de seguridad desde aquÃ­:
confirm-cloud-upload =
    Â¿Quieres reemplazar tus archivos en la nube con tus archivos locales?
    Los archivos en la nube ({ $cloud-path }) se convertirÃ¡n en una copia exacta de tus archivos locales ({ $local-path }).
    Los archivos en la nube serÃ¡n actualizados o eliminados segÃºn sea necesario.
confirm-cloud-download =
    Â¿Quieres reemplazar tus archivos locales por tus archivos en la nube?
    Tus archivos locales ({ $local-path }) se convertirÃ¡n en una copia exacta de tus archivos en la nube ({ $cloud-path }).
    Los archivos locales serÃ¡n actualizados o eliminados segÃºn sea necesario.
confirm-add-missing-roots = Â¿AÃ±adir estas raÃ­ces?
no-missing-roots = No se han encontrado raÃ­ces adicionales.
loading = Cargando...
preparing-backup-target = Preparando directorio de copia de seguridad...
updating-manifest = Actualizando manifiesto...
no-cloud-changes = No hay cambios para sincronizar
backups-are-valid = Tus copias de seguridad son vÃ¡lidas.
backups-are-invalid =
    Las copias de seguridad de estos juegos parecen ser invÃ¡lidas.
    Â¿Quieres crear nuevas copias de seguridad completas para estos juegos?
saves-found = Datos de guardado encontrados.
no-saves-found = Datos de guardado no encontrados.
# This is tacked on to form something like "Back up (no confirmation)",
# meaning we would perform an action without asking the user if they're sure.
suffix-no-confirmation = sin confirmaciÃ³n
# This is shown when a setting will only take effect after closing and reopening Ludusavi.
suffix-restart-required = reinicio requerido
prefix-error = Error: { $message }
prefix-warning = Advertencia: { $message }
cloud-app-unavailable = Las copias de seguridad de la nube estÃ¡n deshabilitadas porque { $app } no estÃ¡ disponible.
cloud-not-configured = Las copias de seguridad de la nube estÃ¡n desactivadas porque no se ha configurado ningÃºn sistema de nube.
cloud-path-invalid = Las copias de seguridad de la nube estÃ¡n desactivadas porque la ruta de la copia de seguridad no es vÃ¡lida.
game-is-unrecognized = Ludusavi no reconoce este juego.
game-has-nothing-to-restore = Este juego no tiene una copia de seguridad para restaurar.
launch-game-after-error = Â¿Iniciar el juego de todos modos?
game-did-not-launch = El juego no se pudo iniciar.
backup-is-newer-than-current-data = The existing backup is newer than the current data.
backup-is-older-than-current-data = La copia de seguridad existente es mÃ¡s antigua que los datos actuales.
back-up-specific-game =
    .confirm = Â¿Respaldar datos guardados de { $game }?
    .failed = Error al realizar la copia de seguridad de los datos guardados de { $game }
restore-specific-game =
    .confirm = Â¿Restaurar datos guardados de { $game }?
    .failed = Error al restaurar los datos guardados de { $game }
new-version-check = Comprobar actualizaciones automÃ¡ticamente
new-version-available = Una actualizaciÃ³n de la aplicaciÃ³n estÃ¡ disponible: { $version }. Â¿Desea ver las notas del lanzamiento?
custom-game-will-override = Este juego personalizado reemplaza una entrada de manifiesto
custom-game-will-extend = Este juego personalizado extiende una entrada de manifiesto
operation-will-only-include-listed-games = Esto solo procesarÃ¡ los juegos que se encuentran actualmente listados

luducard-library = Biblioteca
luducard-scan-and-add = Escanear y aÃ±adir
luducard-cloud-and-sync = Nube y sincronizaciÃ³n
luducard-save-share-hub = Save Share HUB
luducard-preset-share-hub = Preset Share HUB
luducard-settings = Configuraciones
luducard-support-project = Apoyar el proyecto
luducard-library-status = Estado de la biblioteca
luducard-games = Juegos
luducard-language = Idioma
luducard-language-desc = Idioma de la interfaz.
luducard-sidebar-subtitle = Copias de seguridad de saves
luducard-navigation = NavegaciÃ³n
luducard-stored-saves = Saves almacenados
luducard-pending-saves = Pendientes
luducard-downloading-covers = Descargando portadas...
luducard-settings-desc = Preferencias y comportamiento de la aplicaciÃ³n
luducard-dashboard-desc = Administra y protege tus partidas guardadas

luducard-file-watcher = Monitor de Saves (File Watcher)
luducard-file-watcher-desc = Supervisa los cambios en los saves y realiza una copia de seguridad automÃ¡tica al cerrar el juego.
luducard-start-with-windows = Iniciar con Windows
luducard-start-with-windows-desc = Abre minimizado en la bandeja del sistema al encender el PC.
luducard-system-tray = Ejecutar en la bandeja (System Tray)
luducard-system-tray-desc = Minimiza la aplicaciÃ³n cerca del reloj en lugar de cerrarla, manteniendo el monitoreo en segundo plano.
luducard-portable = Modo portÃ¡til (Portable Mode)
luducard-portable-desc = Guarda todas las configuraciones, manifiestos y copias de seguridad en la carpeta del ejecutable (ideal para memorias USB).
luducard-theme = Tema
luducard-theme-desc = Apariencia de la interfaz del aplicativo.
luducard-theme-dark = Oscuro
luducard-theme-light = Claro
luducard-theme-system = Sistema
luducard-backup-dir = Directorio de copias de seguridad
luducard-backup-dir-desc = DÃ³nde se guardarÃ¡n localmente las partidas guardadas de tus juegos.

luducard-rclone-path = Ruta del ejecutable de Rclone
luducard-rclone-path-desc = Ruta al ejecutable rclone utilizado para subir a la nube.
luducard-cloud-folder = Carpeta remota en la nube
luducard-cloud-folder-desc = Nombre de la carpeta remota para sincronizar los archivos.
luducard-rclone-args = Argumentos adicionales de Rclone
luducard-rclone-args-desc = Comandos y flags opcionales que se pasan directamente a rclone.
luducard-supabase-url = URL de Supabase (Repositorio Comunitario)
luducard-supabase-url-desc = URL de la API de tu proyecto Supabase para la pestaÃ±a de comunidad.
luducard-supabase-key = Clave Anon de Supabase
luducard-supabase-key-desc = Clave pÃºblica (anon) utilizada para la autenticaciÃ³n anÃ³nima en las tablas.
luducard-btn-save-settings = Guardar configuraciones

luducard-tab-general = General
luducard-tab-schedule = ProgramaciÃ³n
luducard-tab-notifications = Notificaciones
luducard-general-preferences = Preferencias generales
luducard-general-preferences-desc = Rutas del aplicativo y comportamiento bÃ¡sico.

luducard-status-synchronized = Sincronizado
luducard-status-pending = Copia de seguridad pendiente
luducard-status-none = Sin copia de seguridad
luducard-backup = Copia de seguridad
luducard-restore = Restaurar
luducard-current-save = Guardado activo
luducard-last-backup = Ãšltima copia de seguridad
luducard-manual-backup = Copia de seguridad manual
luducard-loading-library = Cargando biblioteca de juegos...
luducard-monitored-games = Juegos monitoreados
luducard-cloud-synced = Sincronizados en la nube
luducard-pending-saves-plural = Copias de seguridad pendientes
luducard-search-games = Buscar juegos...
luducard-clear-search = Limpar bÃºsqueda
luducard-select-all = Seleccionar todo
luducard-platform = Plataforma
luducard-all-platforms = Todas las plataformas
luducard-sort-by = Ordenar por
luducard-sort-name = Nombre (A-Z)
luducard-sort-recent = Jugado recientemente
luducard-sort-size = TamaÃ±o de guardado
luducard-installed = Instalado
luducard-pending = Pendiente
luducard-grid-view = Vista de cuadrÃ­cula
luducard-list-view = Vista de lista
luducard-showing = Mostrando
luducard-of = de
luducard-game = juego
luducard-games-plural = juegos
luducard-no-games-found = No se encontraron juegos
luducard-adjust-filters-desc = Ajusta los filtros o escanea tus carpetas para agregar nuevos juegos.
luducard-starting-backup-for = Iniciando copia de seguridad de
luducard-backup-completed-for = Copia de seguridad de
luducard-completed = completada!
luducard-completed-fem = completada!
luducard-backup-failed-for = FallÃ³ la copia de seguridad de
luducard-restoring-backup-for = Restaurando copia de seguridad de
luducard-restore-completed-for = RestauraciÃ³n de
luducard-restore-failed-for = FallÃ³ la restauraciÃ³n de
luducard-never = Nunca

luducard-scan-title = Escanear y agregar
luducard-scan-desc = Encuentra guardados de juegos en tu ordenador
luducard-auto-search = BÃºsqueda automÃ¡tica
luducard-auto-search-desc = Escanea carpetas comunes del sistema (Steam, Epic, Documentos y AppData) y tus carpetas personalizadas buscando nuevos guardados o cambios.
luducard-scanning = Escaneando...
luducard-start-scan = Iniciar bÃºsqueda de cambios
luducard-scan-completed = BÃºsqueda completada
luducard-scan-completed-desc = DetecciÃ³n de cambios finalizada.
luducard-scan-error = Error al realizar la bÃºsqueda.
luducard-custom-folder = Personalizada
luducard-default-folder = Predeterminada
luducard-folder-added = Carpeta agregada al monitoreo
luducard-folder-added-success = Â¡Carpeta agregada con Ã©xito!
luducard-folder-select-error = Error al seleccionar/agregar carpeta.
luducard-emulator-detected = La carpeta seleccionada pertenece al emulador { $emulator }.\n\nÂ¿Deseas agregarla como un emulador para rastrear los guardados de tus juegos automÃ¡ticamente?
luducard-adding-emulator = Agregando emulador y escaneando guardados...
luducard-emulator-added-success = Â¡Emulador { $emulator } agregado con Ã©xito! { $count } juego(s) detectado(s) en la carpeta de guardados.
luducard-emulator-added-empty = Â¡Emulador { $emulator } agregado! No se detectÃ³ ningÃºn guardado de juego en la carpeta.
luducard-emulator-add-failed = Error al agregar emulador: { $error }
luducard-emulator-added-mock = Â¡Emulador agregado con Ã©xito! (Mock)
luducard-emulator-select-error = Error al seleccionar/agregar emulador.
luducard-emulator-removed = Emulador eliminado
luducard-emulator-remove-error = Error al eliminar emulador.
luducard-folder-removed = Carpeta eliminada del monitoreo
luducard-folder-remove-error = Error al eliminar carpeta.
luducard-monitored-folders = Carpetas monitoreadas
luducard-monitored-folders-desc = Directorios raÃ­z observados continuamente en busca de nuevos guardados.
luducard-add-folder = Agregar carpeta
luducard-no-folders-detected = Ninguna carpeta de juegos detectada automÃ¡ticamente.
luducard-click-add-folder-desc = Haz clic en "Agregar carpeta" para seleccionar una carpeta de biblioteca o emuladores.
luducard-monitoring-active = Monitoreo activo
luducard-remove-folder = Eliminar carpeta
luducard-select-new-root = Seleccionar nueva carpeta raÃ­z
luducard-monitored-emulators = Emuladores monitoreados
luducard-monitored-emulators-desc = Directorios de emuladores observados para detecciÃ³n automÃ¡tica de guardados de consola.
luducard-add-emulator = Agregar emulador
luducard-no-emulators-configured = NingÃºn emulador configurado.
luducard-click-add-emulator-desc = Haz clic en "Agregar emulador" para importar guardados de Switch, Wii, Wii U, GBA, PS2, etc.
luducard-saves-integrated = Guardados integrados en la biblioteca
luducard-remove-emulator = Eliminar emulador
luducard-add-other-emulator = Agregar otro emulador
luducard-scan-results = Resultados de la bÃºsqueda
luducard-scan-results-desc = Selecciona de quÃ© juegos con guardados nuevos o modificados deseas hacer una copia de seguridad.
luducard-starting-batch-backup = Iniciando copia de seguridad por lotes para { $count } juegos...
luducard-batch-backup-completed = Â¡Copia de seguridad de los juegos seleccionados completada!
luducard-batch-backup-failed = FallÃ³ la copia de seguridad por lotes.
luducard-backup-selected = Realizar copia de seguridad de seleccionados
luducard-no-new-saves-detected = Â¡No se detectaron nuevos guardados o cambios! Todos los juegos estÃ¡n sincronizados.
luducard-new-game = Juego Nuevo
luducard-changed-save = Modificado

luducard-cloud-title = Nube y SincronizaciÃ³n
luducard-cloud-desc = Configura la copia de seguridad remota de tus guardados
luducard-cloud-provider = Proveedor de nube
luducard-cloud-provider-desc = Elige dÃ³nde se almacenarÃ¡n tus copias de seguridad de forma remota.
luducard-auth-status = Estado de autenticaciÃ³n y almacenamiento.
luducard-connected-as = Conectado como { $account }
luducard-oauth-authorized = Cuenta autorizada mediante OAuth
luducard-disconnect = Desconectar
luducard-space-used = Espacio utilizado
luducard-connect-desc = Conecta tu cuenta de { $provider } para habilitar la copia de seguridad remota de tus guardados.
luducard-connect-btn = Conectar cuenta
luducard-sync-rules = Reglas de sincronizaciÃ³n
luducard-sync-rules-desc = CÃ³mo se mueven los guardados entre el PC y la nube.
luducard-auto-upload = Subida automÃ¡tica despuÃ©s de la copia de seguridad local
luducard-auto-upload-desc = Sube a la nube inmediatamente despuÃ©s de cada copia de seguridad.
luducard-auto-upload-enabled = Subida automÃ¡tica activada
luducard-auto-upload-disabled = Subida automÃ¡tica desactivada
luducard-download-if-newer = Descargar si el guardado remoto es mÃ¡s reciente
luducard-download-if-newer-desc = Resuelve conflictos priorizando la versiÃ³n mÃ¡s nueva.
luducard-auto-download-enabled = Descarga automÃ¡tica activada
luducard-auto-download-disabled = Descarga automÃ¡tica desactivada
luducard-disconnected-provider = { $provider } desconectado
luducard-connected-provider = { $provider } conectado

luducard-loading = Cargando...
luducard-fetching-details = Buscando detalles del juego
luducard-loading-details = Cargando detalles del juego...
luducard-details-desc = Detalles e historial de copias de seguridad
luducard-back = Volver
luducard-select = Seleccionar
luducard-saved-versions = versiones guardadas
luducard-backup-now = Copia de seguridad ahora
luducard-restore-latest = Restaurar Ãºltima
luducard-open-game-folder-desc = Abrir carpeta de instalaciÃ³n del juego en el Explorador de Windows
luducard-game-folder = Carpeta del juego
luducard-open-save-folder-desc = Abrir carpeta donde se almacenan los guardados activos
luducard-save-folder = Carpeta de guardado
luducard-open-backup-folder-desc = Abrir carpeta de copias de seguridad de Luducard
luducard-backup-folder = Carpeta de copias de seguridad
luducard-export-save-desc = Exportar guardado como archivo .luducard comprimido para compartir
luducard-export-save = Exportar guardado (.luducard)
luducard-status = Estado
luducard-saves-on-pc = Guardados en PC
luducard-total-backups = Total en copias de seguridad
luducard-quick-preferences = Preferencias rÃ¡pidas
luducard-save-history = Historial de guardados
luducard-config-presets = Presets de configuraciÃ³n
luducard-saves-timeline = LÃ­nea de tiempo (Guardados)
luducard-presets-configs = Presets y configuraciones
luducard-no-backups-yet = AÃºn no hay copias de seguridad
luducard-do-first-backup-desc = Realiza la primera copia de seguridad de este juego para comenzar la lÃ­nea de tiempo.
luducard-active = Activo
luducard-disabled = Desactivado

luducard-support-title = Apoyar el proyecto
luducard-support-desc = Ayuda a mantener en lÃ­nea los servidores comunitarios de guardados y presets
luducard-support-intro-title = Â¡Luducard es completamente gratuito!
luducard-support-intro-desc = Nuestras caracterÃ­sticas en la nube (Save Share Hub y Presets) generan costos mensuales de servidor y trÃ¡fico. Si el aplicativo te resulta Ãºtil, Â¡considera apoyarnos para mantenerlos en lÃ­nea!
luducard-how-to-support = CÃ³mo apoyar el proyecto
luducard-how-to-support-desc = Elige tu mÃ©todo de contribuciÃ³n preferido. Stripe admite tarjetas de crÃ©dito y PIX.
luducard-support-itch = Apoyar en Itch.io
luducard-support-stripe = Tarjeta / PIX vÃ­a Stripe
luducard-support-dest-desc = Todas las contribuciones se destinan Ã­ntegramente al mantenimiento de los servidores en la nube (alojamiento y trÃ¡fico de datos).

luducard-community-title = Save Share HUB
luducard-community-desc = Comparte y descarga checkpoints de guardados de la comunidad
luducard-btn-share-checkpoint = Compartir Checkpoint
luducard-repo-disconnected = Repositorio Comunitario Desconectado
luducard-repo-disconnected-desc = Para cargar los checkpoints comunitarios y compartir los tuyos, necesitas configurar la URL de tu Supabase y la Anon Key pÃºblica en la pestaÃ±a de ConfiguraciÃ³n.
luducard-how-to-config = CÃ³mo configurar:
luducard-config-step-1 = Crea un proyecto gratuito en Supabase.
luducard-config-step-2 = Crea las tablas ejecutando el script SQL que generamos en el archivo supabase/schema.sql.
luducard-config-step-3 = Inserta la URL de la API y la Anon Key pÃºblica en la ConfiguraciÃ³n de Luducard.
luducard-checkpoints = Checkpoints
luducard-contributors = Colaboradores
luducard-search-placeholder = Buscar por juego o checkpoint...
luducard-sort-popular = Popular
luducard-sort-recent-hub = Recientes
luducard-sort-size-hub = TamaÃ±o
luducard-syncing-repo = Sincronizando con el repositorio pÃºblico...
luducard-no-checkpoints-found = No se encontraron checkpoints
luducard-no-checkpoints-available = No hay checkpoints disponibles
luducard-search-terms-desc = Intenta buscar con otros tÃ©rminos.
luducard-be-first-desc = Â¡SÃ© el primero en compartir un guardado de la comunidad!
luducard-no-desc-provided = No se ha proporcionado una descripciÃ³n detallada.
luducard-author-by = por
luducard-zstd-verified = Contiene metadados zstd verificados
luducard-btn-install = Instalar
luducard-btn-installing = Instalando...
luducard-security-sandbox-title = Seguridad automÃ¡tica de Seguro-Crash y Sandbox
luducard-security-sandbox-desc = Al instalar un checkpoint de la comunidad, Luducard crea automÃ¡ticamente una copia de seguridad de tu guardado actual antes de sobrescribir. Si algo sale mal, simplemente restaura la copia anterior desde el historial.
luducard-share-checkpoint-modal = Compartir Checkpoint
luducard-publish-progress-desc = Publica tu archivo de progreso para la comunidad.
luducard-save-game-label = Juego del Guardado *
luducard-search-installed-game = Escribe para buscar un juego instalado...
luducard-backup-version-label = VersiÃ³n de la copia de seguridad *
luducard-no-local-backups-desc = AÃºn no se han realizado copias de seguridad locales para este juego. Â¡Crea una copia en la tarjeta del juego primero!
luducard-checkpoint-title-label = TÃ­tulo del checkpoint *
luducard-checkpoint-title-placeholder = Ej: Antes de Malenia o Nivel 100 100% completo
luducard-checkpoint-author-label = Nombre del autor
luducard-checkpoint-author-placeholder = Ej: AnÃ³nimo
luducard-checkpoint-desc-label = DescripciÃ³n / Notas adicionales
luducard-checkpoint-desc-placeholder = Describe detalles como la build, nivel, Ã­tems importantes o punto de progreso.
luducard-checkpoint-tags-label = Tags del checkpoint
luducard-btn-cancel = Cancelar
luducard-btn-publishing = Publicando...
luducard-btn-publish = Publicar checkpoint
luducard-detail-modal-desc = Visualizando metadados completos del checkpoint.
luducard-btn-close = Cerrar
luducard-btn-download-install = Descargar e Instalar
luducard-detail-title-label = TÃ­tulo del checkpoint:
luducard-detail-desc-label = DescripciÃ³n del progreso:
luducard-detail-tags-label = Marcadores:
luducard-detail-size-label = TamaÃ±o comprimido:
luducard-detail-downloads-label = Total de descargas:
luducard-detail-author-label = Enviado por:
luducard-detail-date-label = Enviado el:
luducard-date-today = Hoy
luducard-date-yesterday = Ayer
luducard-date-days-ago = dÃ­as atrÃ¡s
luducard-date-weeks-ago = semanas atrÃ¡s
luducard-date-locale = es-ES

luducard-presethub-title = Preset Share HUB
luducard-presethub-desc = Descubre y comparte optimizaciones grÃ¡ficas y de controles de la comunidad
luducard-btn-share-preset = Compartir Preset
luducard-presethub-disconnected = Repositorio de Presets Desconectado
luducard-presethub-disconnected-desc = Para cargar los presets comunitarios y compartir los tuyos, necesitas configurar la URL de tu Supabase y la Anon Key pÃºblica en la pestaÃ±a de ConfiguraciÃ³n.
luducard-presets = Presets
luducard-preset-search-placeholder = Buscar por juego, tÃ­tulo o hardware (ej. RTX 4070)...
luducard-syncing-presets = Sincronizando presets...
luducard-no-presets-found = No se encontraron presets grÃ¡ficos
luducard-search-terms-desc-preset = Intenta restablecer los tÃ©rminos de bÃºsqueda.
luducard-badge-official = Oficial
luducard-gpu = GPU
luducard-approval = AprobaciÃ³n
luducard-useful = Useful
luducard-useless = Useless
luducard-report-preset = Denunciar preset
luducard-btn-undo = Deshacer
luducard-btn-inject = Inyectar
luducard-btn-injecting = Inyectando...
luducard-not-installed = No Instalado
luducard-security-safety-title = Seguridad garantizada por Seguro-Crash
luducard-security-safety-desc = Al descargar cualquier preset grÃ¡fico del HUB, Luducard realiza una copia de seguridad de tu configuraciÃ³n anterior. Tus partidas guardadas de progreso permanecen intactas.
luducard-share-preset-modal-title = Compartir Preset GrÃ¡fico
luducard-share-preset-modal-desc = EnvÃ­a un preset grÃ¡fico local para la comunidad.
luducard-preset-game-label = Juego del preset *
luducard-search-installed-game-preset = Buscar juego instalado...
luducard-choose-local-preset-label = Elegir Preset Local *
luducard-no-local-presets-desc = No hay presets locales guardados para este juego. Â¡Ve a la pestaÃ±a del juego y crea un preset local primero!
luducard-preset-title-label = TÃ­tulo del preset *
luducard-preset-creator-label = Autor / Creador
luducard-preset-desc-label = DescripciÃ³n / Notas del preset
luducard-preset-tags-label = Tags del preset
luducard-preset-hardware-label = Hardware del autor (Autocompletado del preset local):
luducard-cpu = CPU
luducard-ram = RAM
luducard-btn-publish-preset = Publicar Preset
luducard-detail-preset-title = TÃ­tulo del preset:
luducard-detail-preset-desc = DescripciÃ³n / Optimizaciones:
luducard-detail-author-specs = Especificaciones del autor:

luducard-tag-desc-100 = Juego 100% completado con todos los logros, Ã­tems y coleccionables desbloqueados.
luducard-tag-desc-dlc1 = Progreso enfocado o listo para iniciar el primer DLC.
luducard-tag-desc-dlc2 = Progreso enfocado o listo para iniciar el segundo DLC.
luducard-tag-desc-ngplus = Juego listo para iniciar o ya iniciado en el modo Nuevo Juego+.
luducard-tag-desc-vanilla = Progresso del juego base totalmente limpio, sin modificadores, mods o trampas.
luducard-tag-desc-modded = Progreso obtenido utilizando modificaciones (mods) que pueden alterar el juego.
luducard-tag-desc-bossprep = Guardado estratÃ©gicamente posicionado justo antes de un jefe importante del juego.
luducard-tag-desc-starter = Guardado al comienzo del juego, con recursos acumulados o tutorial omitido.
luducard-tag-desc-cleanstart = Partida guardada inmediatamente despuÃ©s de la creaciÃ³n del personaje o introducciÃ³n, lista para jugar directamente desde el inicio real.
luducard-tag-desc-midgame = Guardado posicionado a la mitad de la campaÃ±a principal (ideal para quienes perdieron progreso).
luducard-tag-desc-postgame = CampaÃ±a completada, ideal para explorar jefes secretos, logros pendientes o actividades secundarias.
luducard-tag-desc-opbuild = Guardado enfocado en un personaje con equipo, nivel y builds extremadamente fuertes (Overpowered).
luducard-tag-desc-unlimitedcash = Guardado enfocado en tener dinero, monedas o recursos de mejora mÃ¡ximos o infinitos.
luducard-tag-desc-allcollectibles = Guardado enfocado en logros secundarios y coleccionables tediosos totalmente desbloqueados.
luducard-tag-desc-hardcore = Guardados en dificultades extremas o con muerte permanente activada (sobrevivencia extrema).
luducard-tag-desc-speedrunready = Guardado ideal para entrenar tramos de speedruns o posicionado en las rutas mÃ¡s rÃ¡pidas.
luducard-tag-desc-legit = Progreso obtenido limpiamente, sin cheats, cÃ³digos de trampa ni explotar bugs (glitches).
luducard-preset-tag-desc-perf = Optimizaciones enfocadas en la ganancia de FPS y fluidez.
luducard-preset-tag-desc-quality = Optimizaciones enfocadas en la mÃ¡xima calidad grÃ¡fica.
luducard-preset-tag-desc-balanced = Equilibrio ideal entre fidelidad visual y tasa de FPS.
luducard-preset-tag-desc-deck = Perfil optimizado especÃ­ficamente para la pantalla y baterÃ­a de Steam Deck/consolas portÃ¡tiles.
luducard-preset-tag-desc-potato = Para ejecutar en PCs sÃºper antiguos y portÃ¡tiles modestos.
luducard-preset-tag-desc-controls = Mapeo personalizado de controles, gamepad o combinaciones de teclas.
luducard-preset-tag-desc-rt = ConfiguraciÃ³n refinada con trazado de rayos activo, buscando una buena tasa de fotogramas.
luducard-preset-tag-desc-4k = Optimizaciones enfocadas en televisores y monitores 4K de alta definiciÃ³n.
luducard-preset-tag-desc-vr = Configuraciones ajustadas para una tasa de FPS ideal en realidad virtual.

luducard-schedule-auto-routine = Rutina de guardados automÃ¡ticos
luducard-schedule-auto-routine-desc = Define cuÃ¡ndo deben realizarse las copias de seguridad de forma automÃ¡tica.
luducard-schedule-by-interval = Por intervalo
luducard-schedule-by-days = DÃ­as de la semana
luducard-schedule-backup-every = Hacer copia de seguridad cada
luducard-schedule-1-hour = 1 hora
luducard-schedule-3-hours = 3 horas
luducard-schedule-6-hours = 6 horas
luducard-schedule-12-hours = 12 horas
luducard-schedule-24-hours = 24 horas
luducard-schedule-at-time = A las
luducard-schedule-games-in-schedule = Juegos en la programaciÃ³n
luducard-schedule-games-in-schedule-desc = Selecciona quÃ© juegos siguen esta rutina automÃ¡tica.
luducard-schedule-btn-save = Guardar programaciÃ³n
luducard-schedule-saved-toast = ProgramaciÃ³n guardada con Ã©xito

luducard-day-sun = Dom
luducard-day-mon = Lun
luducard-day-tue = Mar
luducard-day-wed = MiÃ©
luducard-day-thu = Jue
luducard-day-fri = Vie
luducard-day-sat = SÃ¡b

luducard-notification-alerts = Alertas y notificaciones
luducard-notification-alerts-desc = Elige cÃ³mo deseas ser notificado sobre las copias de seguridad.
luducard-notification-windows = Notificaciones de Windows
luducard-notification-windows-desc = Notificar cuando una copia de seguridad se complete con Ã©xito.
luducard-notification-toast-enabled = Notificaciones activadas
luducard-notification-toast-disabled = Notificaciones desactivadas
luducard-notification-fail-alerts = Alertas de fallo
luducard-notification-fail-alerts-desc = Notificar inmediatamente cuando falle una copia de seguridad.
luducard-notification-toast-fail-enabled = Alertas de fallo activadas
luducard-notification-toast-fail-disabled = Alertas de fallo desactivadas
luducard-notification-sounds = Sonidos de alerta
luducard-notification-sounds-desc = Reproducir un sonido cuando una copia de seguridad se complete o falle.
luducard-notification-toast-sounds-enabled = Sonidos de alerta activados
luducard-notification-toast-sounds-disabled = Sonidos de alerta desactivados


