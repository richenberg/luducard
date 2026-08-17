ludusavi = Ludusavi
language = Idioma
game-name = Nombre
total-games = Juegos
file-size = Tamaño
file-location = Ubicación
overall = Global
status = Estatus
cli-unrecognized-games = No hay información para estos juegos:
cli-unable-to-request-confirmation = No se pudo solicitar confirmación.
    .winpty-workaround = Si estás usando un emulador de Bash (como Git Bash), intenta ejecutar winpty.
cli-backup-id-with-multiple-games = No se puede especificar el ID de copia de seguridad al restaurar múltiples juegos.
cli-invalid-backup-id = ID de copia de seguridad inválido.
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
button-nav-restore = MODO DE RESTAURACIÓN
button-nav-custom-games = JUEGOS PERSONALIZADOS
button-nav-other = OTROS
button-add-game = Añadir juego
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
no-roots-are-configured = Añade algunas raíces para respaldar aún más datos.
config-is-invalid = Error: El archivo de configuración no es válido.
manifest-is-invalid = Error: El archivo de manifiesto no es válido.
manifest-cannot-be-updated = Error: No se ha podido comprobar la actualización del archivo de manifiesto. ¿Se ha caído la conexión a Internet?
cannot-prepare-backup-target = Error: No se pudo preparar el destino de la copia de seguridad (creando o vaciando la carpeta). Si tiene la carpeta abierta en su navegador de archivos, intente cerrarla: { $path }
restoration-source-is-invalid = Error: La fuente de restauración no es válida (no existe o no es un directorio). Por favor, comprueba la ubicación: { $path }
registry-issue = Error: Se omitieron algunas entradas del registro.
unable-to-browse-file-system = Error: No se puede navegar en su sistema.
unable-to-open-directory = Error: no se puede abrir el directorio:
unable-to-open-url = Error: No se puede abrir la URL:
unable-to-configure-cloud = No se ha podido configurar la nube.
unable-to-synchronize-with-cloud = No se ha podido sincronizar con la nube.
cloud-synchronize-conflict = Tus copias de seguridad locales y en la nube están en conflicto. Realiza una subida o descarga para resolver esto.
command-unlaunched = El comando no se inició: { $command }
command-terminated = Comando finalizado abruptamente: { $command }
command-failed = Comando falló con el código { $code }: { $command }
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
    .placeholder = Origen (ubicación original)
field-redirect-target =
    .placeholder = Destino (nueva ubicación)
field-roots = Raíces:
field-backup-excluded-items = Exclusiones de copia de seguridad:
field-redirects = Redirecciones:
# This appears next to the number of full backups that you'd like to keep.
# A full backup includes all save files for a game.
field-retention-full = Completo:
# This appears next to the number of differential backups that you'd like to keep.
# A differential backup includes only the files that have changed since the last full backup.
field-retention-differential = Diferencial:
field-backup-format = Formato:
field-backup-compression = Compresión:
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
label-unique = Único
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
label-host = Anfitrión
# https://en.wikipedia.org/wiki/Port_(computer_networking)
label-port = Puerto
label-username = Nombre de usuario
label-password = Contraseña
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
label-integration = Integración
# This is a folder name where a specific game is installed
label-installed-name = Nombre de instalación
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
override-max-threads = Anular hilos máximos
synchronize-automatically = Sincronizar automáticamente
prefer-alias-display = Mostrar alias en lugar del nombre original
skip-unconstructive-backups = Saltar la copia de seguridad cuando solo se van a eliminar datos, pero no se va a agregar ni actualizar nada
explanation-for-exclude-store-screenshots = En las copias de seguridad, excluye las capturas de pantalla específicas de la tienda
explanation-for-exclude-cloud-games = No hacer copias de seguridad de juegos con soporte en la nube en estas plataformas
consider-doing-a-preview =
    Si aún no lo has hecho, considera hacer una vista previa primero para que
    no haya sorpresas.
confirm-backup =
    ¿Estás seguro de que quieres proceder con la copia de seguridad? { $path-action ->
        [merge] Los nuevos datos guardados se combinaran en la carpeta de destino:
       *[create] Se creará la carpeta de destino:
    }
confirm-restore =
    ¿Estás seguro de que deseas continuar con la restauración?
    Esto sobrescribirá cualquier archivo actual con las copias de seguridad desde aquí:
confirm-cloud-upload =
    ¿Quieres reemplazar tus archivos en la nube con tus archivos locales?
    Los archivos en la nube ({ $cloud-path }) se convertirán en una copia exacta de tus archivos locales ({ $local-path }).
    Los archivos en la nube serán actualizados o eliminados según sea necesario.
confirm-cloud-download =
    ¿Quieres reemplazar tus archivos locales por tus archivos en la nube?
    Tus archivos locales ({ $local-path }) se convertirán en una copia exacta de tus archivos en la nube ({ $cloud-path }).
    Los archivos locales serán actualizados o eliminados según sea necesario.
confirm-add-missing-roots = ¿Añadir estas raíces?
no-missing-roots = No se han encontrado raíces adicionales.
loading = Cargando...
preparing-backup-target = Preparando directorio de copia de seguridad...
updating-manifest = Actualizando manifiesto...
no-cloud-changes = No hay cambios para sincronizar
backups-are-valid = Tus copias de seguridad son válidas.
backups-are-invalid =
    Las copias de seguridad de estos juegos parecen ser inválidas.
    ¿Quieres crear nuevas copias de seguridad completas para estos juegos?
saves-found = Datos de guardado encontrados.
no-saves-found = Datos de guardado no encontrados.
# This is tacked on to form something like "Back up (no confirmation)",
# meaning we would perform an action without asking the user if they're sure.
suffix-no-confirmation = sin confirmación
# This is shown when a setting will only take effect after closing and reopening Ludusavi.
suffix-restart-required = reinicio requerido
prefix-error = Error: { $message }
prefix-warning = Advertencia: { $message }
cloud-app-unavailable = Las copias de seguridad de la nube están deshabilitadas porque { $app } no está disponible.
cloud-not-configured = Las copias de seguridad de la nube están desactivadas porque no se ha configurado ningún sistema de nube.
cloud-path-invalid = Las copias de seguridad de la nube están desactivadas porque la ruta de la copia de seguridad no es válida.
game-is-unrecognized = Ludusavi no reconoce este juego.
game-has-nothing-to-restore = Este juego no tiene una copia de seguridad para restaurar.
launch-game-after-error = ¿Iniciar el juego de todos modos?
game-did-not-launch = El juego no se pudo iniciar.
backup-is-newer-than-current-data = The existing backup is newer than the current data.
backup-is-older-than-current-data = La copia de seguridad existente es más antigua que los datos actuales.
back-up-specific-game =
    .confirm = ¿Respaldar datos guardados de { $game }?
    .failed = Error al realizar la copia de seguridad de los datos guardados de { $game }
restore-specific-game =
    .confirm = ¿Restaurar datos guardados de { $game }?
    .failed = Error al restaurar los datos guardados de { $game }
new-version-check = Comprobar actualizaciones automáticamente
new-version-available = Una actualización de la aplicación está disponible: { $version }. ¿Desea ver las notas del lanzamiento?
custom-game-will-override = Este juego personalizado reemplaza una entrada de manifiesto
custom-game-will-extend = Este juego personalizado extiende una entrada de manifiesto
operation-will-only-include-listed-games = Esto solo procesará los juegos que se encuentran actualmente listados

luducard-library = Biblioteca
luducard-scan-and-add = Escanear y añadir
luducard-cloud-and-sync = Nube y sincronización
luducard-save-share-hub = Save Share HUB
luducard-preset-share-hub = Preset Share HUB
luducard-settings = Configuraciones
luducard-support-project = Apoyar el proyecto
luducard-library-status = Estado de la biblioteca
luducard-games = Juegos
luducard-language = Idioma
luducard-language-desc = Idioma de la interfaz.
luducard-sidebar-subtitle = Copias de seguridad de saves
luducard-navigation = Navegación
luducard-stored-saves = Saves almacenados
luducard-pending-saves = Pendientes
luducard-downloading-covers = Descargando portadas...
luducard-settings-desc = Preferencias y comportamiento de la aplicación
luducard-dashboard-desc = Administra y protege tus partidas guardadas

luducard-file-watcher = Monitor de Saves (File Watcher)
luducard-file-watcher-desc = Supervisa los cambios en los saves y realiza una copia de seguridad automática al cerrar el juego.
luducard-start-with-windows = Iniciar con Windows
luducard-start-with-windows-desc = Abre minimizado en la bandeja del sistema al encender el PC.
luducard-system-tray = Ejecutar en la bandeja (System Tray)
luducard-system-tray-desc = Minimiza la aplicación cerca del reloj en lugar de cerrarla, manteniendo el monitoreo en segundo plano.
luducard-portable = Modo portátil (Portable Mode)
luducard-portable-desc = Guarda todas las configuraciones, manifiestos y copias de seguridad en la carpeta del ejecutable (ideal para memorias USB).
luducard-theme = Tema
luducard-theme-desc = Apariencia de la interfaz del aplicativo.
luducard-theme-dark = Oscuro
luducard-theme-light = Claro
luducard-theme-system = Sistema
luducard-backup-dir = Directorio de copias de seguridad
luducard-backup-dir-desc = Dónde se guardarán localmente las partidas guardadas de tus juegos.

luducard-rclone-path = Ruta del ejecutable de Rclone
luducard-rclone-path-desc = Ruta al ejecutable rclone utilizado para subir a la nube.
luducard-cloud-folder = Carpeta remota en la nube
luducard-cloud-folder-desc = Nombre de la carpeta remota para sincronizar los archivos.
luducard-rclone-args = Argumentos adicionales de Rclone
luducard-rclone-args-desc = Comandos y flags opcionales que se pasan directamente a rclone.
luducard-supabase-url = URL de Supabase (Repositorio Comunitario)
luducard-supabase-url-desc = URL de la API de tu proyecto Supabase para la pestaña de comunidad.
luducard-supabase-key = Clave Anon de Supabase
luducard-supabase-key-desc = Clave pública (anon) utilizada para la autenticación anónima en las tablas.
luducard-btn-save-settings = Guardar configuraciones

luducard-tab-general = General
luducard-tab-schedule = Programación
luducard-tab-notifications = Notificaciones
luducard-general-preferences = Preferencias generales
luducard-general-preferences-desc = Rutas del aplicativo y comportamiento básico.

luducard-status-synchronized = Sincronizado
luducard-status-pending = Copia de seguridad pendiente
luducard-status-none = Sin copia de seguridad
luducard-backup = Copia de seguridad
luducard-restore = Restaurar
luducard-current-save = Guardado activo
luducard-last-backup = Última copia de seguridad
luducard-manual-backup = Copia de seguridad manual
luducard-loading-library = Cargando biblioteca de juegos...
luducard-monitored-games = Juegos monitoreados
luducard-cloud-synced = Sincronizados en la nube
luducard-pending-saves-plural = Copias de seguridad pendientes
luducard-search-games = Buscar juegos...
luducard-clear-search = Limpiar búsqueda
luducard-select-all = Seleccionar todo
luducard-platform = Plataforma
luducard-all-platforms = Todas las plataformas
luducard-sort-by = Ordenar por
luducard-sort-name = Nombre (A-Z)
luducard-sort-recent = Jugado recientemente
luducard-sort-size = Tamaño de guardado
luducard-installed = Instalado
luducard-pending = Pendiente
luducard-grid-view = Vista de cuadrícula
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
luducard-backup-failed-for = Falló la copia de seguridad de
luducard-restoring-backup-for = Restaurando copia de seguridad de
luducard-restore-completed-for = Restauración de
luducard-restore-failed-for = Falló la restauración de
luducard-never = Nunca

luducard-scan-title = Escanear y agregar
luducard-scan-desc = Encuentra guardados de juegos en tu ordenador
luducard-auto-search = Búsqueda automática
luducard-auto-search-desc = Escanea carpetas comunes del sistema (Steam, Epic, Documentos y AppData) y tus carpetas personalizadas buscando nuevos guardados o cambios.
luducard-scanning = Escaneando...
luducard-start-scan = Iniciar búsqueda de cambios
luducard-scan-completed = Búsqueda completada
luducard-scan-completed-desc = Detección de cambios finalizada.
luducard-scan-error = Error al realizar la búsqueda.
luducard-custom-folder = Personalizada
luducard-default-folder = Predeterminada
luducard-folder-added = Carpeta agregada al monitoreo
luducard-folder-added-success = ¡Carpeta agregada con éxito!
luducard-folder-select-error = Error al seleccionar/agregar carpeta.
luducard-emulator-detected = La carpeta seleccionada pertenece al emulador { $emulator }.\n\n¿Deseas agregarla como un emulador para rastrear los guardados de tus juegos automáticamente?
luducard-adding-emulator = Agregando emulador y escaneando guardados...
luducard-emulator-added-success = ¡Emulador { $emulator } agregado con éxito! { $count } juego(s) detectado(s) en la carpeta de guardados.
luducard-emulator-added-empty = ¡Emulador { $emulator } agregado! No se detectó ningún guardado de juego en la carpeta.
luducard-emulator-add-failed = Error al agregar emulador: { $error }
luducard-emulator-added-mock = ¡Emulador agregado con éxito! (Mock)
luducard-emulator-select-error = Error al seleccionar/agregar emulador.
luducard-emulator-removed = Emulador eliminado
luducard-emulator-remove-error = Error al eliminar emulador.
luducard-folder-removed = Carpeta eliminada del monitoreo
luducard-folder-remove-error = Error al eliminar carpeta.
luducard-monitored-folders = Carpetas monitoreadas
luducard-monitored-folders-desc = Directorios raíz observados continuamente en busca de nuevos guardados.
luducard-add-folder = Agregar carpeta
luducard-no-folders-detected = Ninguna carpeta de juegos detectada automáticamente.
luducard-click-add-folder-desc = Haz clic en "Agregar carpeta" para seleccionar una carpeta de biblioteca o emuladores.
luducard-monitoring-active = Monitoreo activo
luducard-remove-folder = Eliminar carpeta
luducard-select-new-root = Seleccionar nueva carpeta raíz
luducard-monitored-emulators = Emuladores monitoreados
luducard-monitored-emulators-desc = Directorios de emuladores observados para detección automática de guardados de consola.
luducard-add-emulator = Agregar emulador
luducard-no-emulators-configured = Ningún emulador configurado.
luducard-click-add-emulator-desc = Haz clic en "Agregar emulador" para importar guardados de Switch, Wii, Wii U, GBA, PS2, etc.
luducard-saves-integrated = Guardados integrados en la biblioteca
luducard-remove-emulator = Eliminar emulador
luducard-add-other-emulator = Agregar otro emulador
luducard-scan-results = Resultados de la búsqueda
luducard-scan-results-desc = Selecciona de qué juegos con guardados nuevos o modificados deseas hacer una copia de seguridad.
luducard-starting-batch-backup = Iniciando copia de seguridad por lotes para { $count } juegos...
luducard-batch-backup-completed = ¡Copia de seguridad de los juegos seleccionados completada!
luducard-batch-backup-failed = Falló la copia de seguridad por lotes.
luducard-backup-selected = Realizar copia de seguridad de seleccionados
luducard-no-new-saves-detected = ¡No se detectaron nuevos guardados o cambios! Todos los juegos están sincronizados.
luducard-new-game = Juego Nuevo
luducard-changed-save = Modificado

luducard-cloud-title = Nube y Sincronización
luducard-cloud-desc = Configura la copia de seguridad remota de tus guardados
luducard-cloud-provider = Proveedor de nube
luducard-cloud-provider-desc = Elige dónde se almacenarán tus copias de seguridad de forma remota.
luducard-auth-status = Estado de autenticación y almacenamiento.
luducard-connected-as = Conectado como { $account }
luducard-oauth-authorized = Cuenta autorizada mediante OAuth
luducard-disconnect = Desconectar
luducard-space-used = Espacio utilizado
luducard-connect-desc = Conecta tu cuenta de { $provider } para habilitar la copia de seguridad remota de tus guardados.
luducard-connect-btn = Conectar cuenta
luducard-sync-rules = Reglas de sincronización
luducard-sync-rules-desc = Cómo se mueven los guardados entre el PC y la nube.
luducard-auto-upload = Subida automática después de la copia de seguridad local
luducard-auto-upload-desc = Sube a la nube inmediatamente después de cada copia de seguridad.
luducard-auto-upload-enabled = Subida automática activada
luducard-auto-upload-disabled = Subida automática desactivada
luducard-download-if-newer = Descargar si el guardado remoto es más reciente
luducard-download-if-newer-desc = Resuelve conflictos priorizando la versión más nueva.
luducard-auto-download-enabled = Descarga automática activada
luducard-auto-download-disabled = Descarga automática desactivada
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
luducard-restore-latest = Restaurar última
luducard-open-game-folder-desc = Abrir carpeta de instalación del juego en el Explorador de Windows
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
luducard-quick-preferences = Preferencias rápidas
luducard-save-history = Historial de guardados
luducard-config-presets = Presets de configuración
luducard-saves-timeline = Línea de tiempo (Guardados)
luducard-presets-configs = Presets y configuraciones
luducard-no-backups-yet = Aún no hay copias de seguridad
luducard-do-first-backup-desc = Realiza la primera copia de seguridad de este juego para comenzar la línea de tiempo.
luducard-active = Activo
luducard-disabled = Desactivado

luducard-support-title = Apoyar el proyecto
luducard-support-desc = Ayuda a mantener en línea los servidores comunitarios de guardados y presets
luducard-support-intro-title = ¡Luducard es completamente gratuito!
luducard-support-intro-desc = Nuestras características en la nube (Save Share Hub y Presets) generan costos mensuales de servidor y tráfico. Si el aplicativo te resulta útil, ¡considera apoyarnos para mantenerlos en línea!
luducard-how-to-support = Cómo apoyar el proyecto
luducard-how-to-support-desc = Elige tu método de contribución preferido. Stripe admite tarjetas de crédito y PIX.
luducard-support-itch = Apoyar en Itch.io
luducard-support-stripe = Tarjeta / PIX vía Stripe
luducard-support-dest-desc = Todas las contribuciones se destinan íntegramente al mantenimiento de los servidores en la nube (alojamiento y tráfico de datos).

luducard-community-title = Save Share HUB
luducard-community-desc = Comparte y descarga checkpoints de guardados de la comunidad
luducard-btn-share-checkpoint = Compartir Checkpoint
luducard-repo-disconnected = Repositorio Comunitario Desconectado
luducard-repo-disconnected-desc = Para cargar los checkpoints comunitarios y compartir los tuyos, necesitas configurar la URL de tu Supabase y la Anon Key pública en la pestaña de Configuración.
luducard-how-to-config = Cómo configurar:
luducard-config-step-1 = Crea un proyecto gratuito en Supabase.
luducard-config-step-2 = Crea las tablas ejecutando el script SQL que generamos en el archivo supabase/schema.sql.
luducard-config-step-3 = Inserta la URL de la API y la Anon Key pública en la Configuración de Luducard.
luducard-checkpoints = Checkpoints
luducard-contributors = Colaboradores
luducard-search-placeholder = Buscar por juego o checkpoint...
luducard-sort-popular = Popular
luducard-sort-recent-hub = Recientes
luducard-sort-size-hub = Tamaño
luducard-syncing-repo = Sincronizando con el repositorio público...
luducard-no-checkpoints-found = No se encontraron checkpoints
luducard-no-checkpoints-available = No hay checkpoints disponibles
luducard-search-terms-desc = Intenta buscar con otros términos.
luducard-be-first-desc = ¡Sé el primero en compartir un guardado de la comunidad!
luducard-hub-unreachable-title = No se pudo acceder al repositorio
luducard-hub-unreachable-desc = El servidor no respondió. Comprueba tu conexión a internet — si funciona, el repositorio puede estar temporalmente fuera de servicio.
luducard-hub-rejected-title = El repositorio rechazó la conexión
luducard-hub-rejected-desc = La clave de Supabase configurada fue rechazada. Revisa la URL y la Anon Key en Ajustes.
luducard-hub-error-title = El repositorio devolvió un error
luducard-hub-error-desc = El servidor respondió con un error y no se pudo cargar la lista.
luducard-btn-try-again = Reintentar
luducard-no-desc-provided = No se ha proporcionado una descripción detallada.
luducard-author-by = por
luducard-zstd-verified = Contiene metadados zstd verificados
luducard-btn-install = Instalar
luducard-btn-installing = Instalando...
luducard-security-sandbox-title = Seguridad automática de Seguro-Crash y Sandbox
luducard-security-sandbox-desc = Al instalar un checkpoint de la comunidad, Luducard crea automáticamente una copia de seguridad de tu guardado actual antes de sobrescribir. Si algo sale mal, simplemente restaura la copia anterior desde el historial.
luducard-share-checkpoint-modal = Compartir Checkpoint
luducard-publish-progress-desc = Publica tu archivo de progreso para la comunidad.
luducard-save-game-label = Juego del Guardado *
luducard-search-installed-game = Escribe para buscar un juego instalado...
luducard-backup-version-label = Versión de la copia de seguridad *
luducard-no-local-backups-desc = Aún no se han realizado copias de seguridad locales para este juego. ¡Crea una copia en la tarjeta del juego primero!
luducard-checkpoint-title-label = Título del checkpoint *
luducard-checkpoint-title-placeholder = Ej: Antes de Malenia o Nivel 100 100% completo
luducard-checkpoint-author-label = Nombre del autor
luducard-checkpoint-author-placeholder = Ej: Anónimo
luducard-checkpoint-desc-label = Descripción / Notas adicionales
luducard-checkpoint-desc-placeholder = Describe detalles como la build, nivel, ítems importantes o punto de progreso.
luducard-checkpoint-tags-label = Tags del checkpoint
luducard-btn-cancel = Cancelar
luducard-btn-publishing = Publicando...
luducard-btn-publish = Publicar checkpoint
luducard-detail-modal-desc = Visualizando metadados completos del checkpoint.
luducard-btn-close = Cerrar
luducard-btn-download-install = Descargar e Instalar
luducard-detail-title-label = Título del checkpoint:
luducard-detail-desc-label = Descripción del progreso:
luducard-detail-tags-label = Marcadores:
luducard-detail-size-label = Tamaño comprimido:
luducard-detail-downloads-label = Total de descargas:
luducard-detail-author-label = Enviado por:
luducard-detail-date-label = Enviado el:
luducard-date-today = Hoy
luducard-date-yesterday = Ayer
luducard-date-days-ago = días atrás
luducard-date-weeks-ago = semanas atrás
luducard-date-locale = es-ES

luducard-presethub-title = Preset Share HUB
luducard-presethub-desc = Descubre y comparte optimizaciones gráficas y de controles de la comunidad
luducard-btn-share-preset = Compartir Preset
luducard-presethub-disconnected = Repositorio de Presets Desconectado
luducard-presethub-disconnected-desc = Para cargar los presets comunitarios y compartir los tuyos, necesitas configurar la URL de tu Supabase y la Anon Key pública en la pestaña de Configuración.
luducard-presets = Presets
luducard-preset-search-placeholder = Buscar por juego, título o hardware (ej. RTX 4070)...
luducard-syncing-presets = Sincronizando presets...
luducard-no-presets-found = No se encontraron presets gráficos
luducard-search-terms-desc-preset = Intenta restablecer los términos de búsqueda.
luducard-badge-official = Oficial
luducard-gpu = GPU
luducard-approval = Aprobación
luducard-useful = Útil
luducard-useless = Inútil
luducard-report-preset = Denunciar preset
luducard-btn-undo = Deshacer
luducard-btn-inject = Inyectar
luducard-btn-injecting = Inyectando...
luducard-not-installed = No Instalado
luducard-security-safety-title = Seguridad garantizada por Seguro-Crash
luducard-security-safety-desc = Al descargar cualquier preset gráfico del HUB, Luducard realiza una copia de seguridad de tu configuración anterior. Tus partidas guardadas de progreso permanecen intactas.
luducard-share-preset-modal-title = Compartir Preset Gráfico
luducard-share-preset-modal-desc = Envía un preset gráfico local para la comunidad.
luducard-preset-game-label = Juego del preset *
luducard-search-installed-game-preset = Buscar juego instalado...
luducard-choose-local-preset-label = Elegir Preset Local *
luducard-no-local-presets-desc = No hay presets locales guardados para este juego. ¡Ve a la pestaña del juego y crea un preset local primero!
luducard-preset-title-label = Título del preset *
luducard-preset-creator-label = Autor / Creador
luducard-preset-desc-label = Descripción / Notas del preset
luducard-preset-tags-label = Tags del preset
luducard-preset-hardware-label = Hardware del autor (Autocompletado del preset local):
luducard-cpu = CPU
luducard-ram = RAM
luducard-btn-publish-preset = Publicar Preset
luducard-detail-preset-title = Título del preset:
luducard-detail-preset-desc = Descripción / Optimizaciones:
luducard-detail-author-specs = Especificaciones del autor:

luducard-tag-desc-100 = Juego 100% completado con todos los logros, ítems y coleccionables desbloqueados.
luducard-tag-desc-dlc1 = Progreso enfocado o listo para iniciar el primer DLC.
luducard-tag-desc-dlc2 = Progreso enfocado o listo para iniciar el segundo DLC.
luducard-tag-desc-ngplus = Juego listo para iniciar o ya iniciado en el modo Nuevo Juego+.
luducard-tag-desc-vanilla = Progresso del juego base totalmente limpio, sin modificadores, mods o trampas.
luducard-tag-desc-modded = Progreso obtenido utilizando modificaciones (mods) que pueden alterar el juego.
luducard-tag-desc-bossprep = Guardado estratégicamente posicionado justo antes de un jefe importante del juego.
luducard-tag-desc-starter = Guardado al comienzo del juego, con recursos acumulados o tutorial omitido.
luducard-tag-desc-cleanstart = Partida guardada inmediatamente después de la creación del personaje o introducción, lista para jugar directamente desde el inicio real.
luducard-tag-desc-midgame = Guardado posicionado a la mitad de la campaña principal (ideal para quienes perdieron progreso).
luducard-tag-desc-postgame = Campaña completada, ideal para explorar jefes secretos, logros pendientes o actividades secundarias.
luducard-tag-desc-opbuild = Guardado enfocado en un personaje con equipo, nivel y builds extremadamente fuertes (Overpowered).
luducard-tag-desc-unlimitedcash = Guardado enfocado en tener dinero, monedas o recursos de mejora máximos o infinitos.
luducard-tag-desc-allcollectibles = Guardado enfocado en logros secundarios y coleccionables tediosos totalmente desbloqueados.
luducard-tag-desc-hardcore = Guardados en dificultades extremas o con muerte permanente activada (sobrevivencia extrema).
luducard-tag-desc-speedrunready = Guardado ideal para entrenar tramos de speedruns o posicionado en las rutas más rápidas.
luducard-tag-desc-legit = Progreso obtenido limpiamente, sin cheats, códigos de trampa ni explotar bugs (glitches).
luducard-preset-tag-desc-perf = Optimizaciones enfocadas en la ganancia de FPS y fluidez.
luducard-preset-tag-desc-quality = Optimizaciones enfocadas en la máxima calidad gráfica.
luducard-preset-tag-desc-balanced = Equilibrio ideal entre fidelidad visual y tasa de FPS.
luducard-preset-tag-desc-deck = Perfil optimizado específicamente para la pantalla y batería de Steam Deck/consolas portátiles.
luducard-preset-tag-desc-potato = Para ejecutar en PCs súper antiguos y portátiles modestos.
luducard-preset-tag-desc-controls = Mapeo personalizado de controles, gamepad o combinaciones de teclas.
luducard-preset-tag-desc-rt = Configuración refinada con trazado de rayos activo, buscando una buena tasa de fotogramas.
luducard-preset-tag-desc-4k = Optimizaciones enfocadas en televisores y monitores 4K de alta definición.
luducard-preset-tag-desc-vr = Configuraciones ajustadas para una tasa de FPS ideal en realidad virtual.
luducard-files-mapped = archivos mapeados

# Game detail: presets tab, backup details, backup kinds
luducard-pinned = Anclado
luducard-export-btn = Exportar
luducard-my-presets-tab = Mis Presets (Locales y Descargados)
luducard-community-presets-tab = Presets de la Comunidad
luducard-upload-to-hub-btn = Subir al HUB
luducard-undo-restore-original = Deshacer y Volver al Original
luducard-fetching-cloud-presets = Buscando presets en la nube...
luducard-installing = Instalando...
luducard-local-backup-details = Detalles de la Copia Local
luducard-backup-type-label = Tipo de Copia:
luducard-mapping-local-files = Mapeando archivos locales...
luducard-mapping-files = Mapeando archivos...
luducard-your-name-label = Tu Nombre / Apodo
luducard-detecting-hardware = Detectando hardware local...
luducard-cpu-full-label = Procesador (CPU)
luducard-preset-detail-modal-desc = Viendo los metadatos completos del preset.
luducard-shortcut-input-title = Haz clic y pulsa la combinación de teclas que quieras
luducard-backup-kind-automatic = Automático
luducard-backup-kind-manual = Manual
luducard-backup-kind-manual-locked = Manual (Bloqueado)
luducard-backup-kind-before-close = Antes de cerrar
luducard-backup-kind-restore = Restauración

# Save Share: game picker
luducard-search-game-with-backups = Escribe para buscar un juego con copias...
luducard-no-games-with-backups = No se encontraron juegos con copias

# Conflict resolution, version locking, install results
luducard-toast-resolving-keep-local = Resolviendo conflicto: manteniendo la versión local de
luducard-toast-resolving-take-cloud = Resolviendo conflicto: descargando la versión en la nube de
luducard-backup-of = Copia de
luducard-exported-from-backup = Exportado desde la copia local realizada el
luducard-toast-locking-version = Bloqueando la versión
luducard-toast-unlocking-version = Desbloqueando la versión
luducard-toast-version-locked = ¡Versión bloqueada! No se eliminará automáticamente.
luducard-toast-version-unlocked = Versión desbloqueada correctamente.
luducard-error-game-not-found = no se encontró en tu biblioteca local o no tiene carpeta de guardado configurada.
luducard-game-label = Juego
luducard-toast-checkpoint-installed = se instaló correctamente. La partida anterior se guardó en el historial.
luducard-checkpoint-label = Checkpoint

# Toasts and status messages
luducard-toast-load-community-presets-failed = Error al cargar presets comunitarios.
luducard-toast-load-profiles-failed = Error al cargar perfiles de guardado.
luducard-toast-profile-title-required = Por favor, introduce un título para el perfil.
luducard-toast-creating-profile = Creando nuevo perfil de guardado...
luducard-toast-select-config-file = Selecciona al menos un archivo de configuración.
luducard-toast-saving-local-preset = Guardando ajustes locales como preset...
luducard-confirm-delete-local-preset = ¿Seguro que quieres eliminar permanentemente este preset local?
luducard-toast-deleting-local-preset = Eliminando preset local...
luducard-toast-crash-safety-starting = Iniciando Seguro-Crash para resguardar los ajustes...
luducard-toast-downloading-applying-preset = Descargando y aplicando el preset de ajustes optimizados...
luducard-toast-community-preset-applied = ¡Preset comunitario aplicado con éxito! Guardado en tu biblioteca local.
luducard-toast-restoring-crash-safety = Restaurando los archivos de configuración originales desde Seguro-Crash...
luducard-toast-original-config-restored = ¡Configuración original restaurada con éxito! Partidas intactas.
luducard-toast-vote-failed = No se pudo registrar el voto.
luducard-toast-report-sent-preset = ¡Denuncia enviada! El preset se ocultará de la comunidad tras 3 denuncias.
luducard-toast-report-failed = No se pudo enviar la denuncia.
luducard-toast-preset-title-required = Por favor, rellena el título del preset.
luducard-toast-packing-config-files = Empaquetando archivos de configuración...
luducard-toast-publishing-preset-metadata = Publicando metadatos del preset en la comunidad...
luducard-error-preset-cloud-limit = Has alcanzado el límite de 5 presets activos en la nube.
luducard-toast-manage-deletions-in-app = Gestiona las eliminaciones de copias desde la app principal
luducard-toast-default-path-restored = ¡Ruta predeterminada restaurada con éxito!
luducard-toast-load-hub-failed = Error al cargar los datos del hub de presets.
luducard-toast-vote-error = Error al registrar el voto.
luducard-toast-report-sent-hub = ¡Denuncia enviada! Los presets con 3+ denuncias se ocultan.
luducard-toast-report-send-failed = No se pudo denunciar.
luducard-toast-fill-required-fields = Por favor, rellena todos los campos obligatorios.
luducard-toast-compressing-encrypting = Comprimiendo y cifrando archivos de configuración...
luducard-toast-requesting-upload-permission = Solicitando permiso de subida segura...
luducard-toast-publishing-to-preset-repo = Publicando metadatos en el repositorio de presets...
luducard-error-preset-cloud-limit-reached = Ya has alcanzado el límite de 5 presets activos en la nube.
luducard-toast-backend-connection-error = Error de conexión con el backend de la app.
luducard-toast-requesting-cloud-upload-permission = Solicitando permiso de subida segura a la nube...
luducard-toast-publishing-to-public-repo = Publicando metadatos en el repositorio público...
luducard-error-checkpoint-cloud-limit = Ya has alcanzado el límite de 5 checkpoints activos en la nube.
luducard-toast-save-note-failed = No se pudo guardar la nota
luducard-toast-save-note-failed-2 = No se pudo guardar la nota
luducard-toast-change-path-failed = Error al cambiar la ruta
luducard-toast-restore-path-failed = Error al restaurar la ruta
luducard-toast-backup-failed = Fallo en la copia de seguridad
luducard-toast-restore-failed = No se pudo restaurar
luducard-toast-restore-version-failed = No se pudo restaurar la versión
luducard-toast-export-backup-failed = No se pudo exportar la copia
luducard-toast-change-version-status-failed = No se pudo cambiar el estado de la versión
luducard-toast-open-folder-failed = Error al abrir la carpeta
luducard-toast-export-failed = No se pudo exportar
luducard-toast-create-profile-failed = No se pudo crear el perfil
luducard-toast-switch-profile-failed = Error al cambiar de perfil
luducard-toast-delete-profile-failed = Error al eliminar el perfil
luducard-toast-save-local-preset-failed = No se pudo guardar el preset local
luducard-toast-apply-local-preset-failed = No se pudo aplicar el preset local
luducard-toast-delete-preset-failed = Error al eliminar el preset
luducard-toast-apply-preset-failed = No se pudo aplicar el preset
luducard-toast-restore-crash-safety-failed = No se pudo restaurar la copia de Seguro-Crash
luducard-error-register-preset-failed = No se pudo registrar el preset
luducard-toast-publish-preset-failed = Error al publicar el preset
luducard-error-get-download-url-failed = No se pudo obtener la URL de descarga
luducard-toast-inject-preset-failed = No se pudo aplicar el preset
luducard-toast-revert-configs-failed = No se pudieron revertir los ajustes
luducard-error-register-preset-failed-2 = No se pudo registrar el preset
luducard-toast-publish-preset-failed-2 = Error al publicar el preset
luducard-error-get-download-url-failed-2 = No se pudo obtener la URL de descarga
luducard-toast-install-checkpoint-failed = No se pudo descargar/instalar el checkpoint
luducard-error-register-checkpoint-failed = No se pudo registrar el checkpoint en la base de datos
luducard-toast-publish-failed = Error al publicar
luducard-toast-restoring-default-path = Restaurando la ruta predeterminada de
luducard-toast-local-version-saved = La versión local de
luducard-toast-saved-to-cloud = se guardó en la nube.
luducard-toast-cloud-version-restored = La versión en la nube de
luducard-toast-restored-suffix = se restauró.
luducard-toast-resolve-conflict-failed = No se pudo resolver el conflicto de
luducard-toast-latest-version-restored = La versión más reciente de
luducard-toast-restoring-version = Restaurando la versión
luducard-toast-version-restored = La versión del
luducard-toast-switching-profile = Cambiando al perfil
luducard-toast-may-take-seconds = Esto puede tardar unos segundos.
luducard-confirm-delete-profile = ¿Seguro que quieres eliminar el perfil
luducard-confirm-delete-profile-warning = Todas las partidas de este perfil se eliminarán permanentemente.
luducard-toast-deleting-profile = Eliminando el perfil
luducard-toast-profile-deleted = El perfil
luducard-toast-deleted-suffix = se eliminó correctamente.
luducard-toast-starting-crash-safety-for = Iniciando Seguro-Crash para los ajustes de
luducard-toast-local-preset-applied = El preset local
luducard-toast-applied-suffix = se aplicó correctamente.
luducard-error-quota-or-limit = Error de cuota o límite en el repositorio.
luducard-toast-starting-crash-safety-for-game = Iniciando Seguro-Crash para los ajustes de
luducard-toast-installing-preset = Instalando el preset
luducard-toast-restoring-original-settings = Restaurando los ajustes originales de
luducard-toast-settings-restored = Los ajustes de
luducard-toast-restored-saves-untouched = se restauraron. ¡Partidas intactas!
luducard-error-cloud-storage-quota = Error de cuota de almacenamiento en la nube.
luducard-toast-uploading-preset = Subiendo el preset a la nube
luducard-toast-preset-applied-saved = Preset aplicado y guardado en tus presets locales. ¡Seguro-Crash activo!
luducard-toast-fill-required-fields-cm = Por favor, rellena todos los campos obligatorios.
luducard-toast-downloading-checkpoint = Descargando e instalando el checkpoint... Seguro-Crash creará una copia automática.
luducard-error-cloud-storage-quota-limit = Error de cuota/límite de almacenamiento en la nube.

# Game detail: presets & configs
luducard-restore-btn = Restaurar
luducard-delete-version = Eliminar versión
luducard-unpin-version = Desanclar versión (permitir eliminación automática)
luducard-pin-version = Anclar versión (impedir eliminación automática)
luducard-save-current-config = Guardar Configuración Actual
luducard-save-current-config-desc = Crea un preset local a partir de los ajustes activos de tu juego.
luducard-save-new-config-btn = Guardar Nueva Config
luducard-no-local-presets = Ningún preset local
luducard-no-local-presets-hint = Captura tus ajustes locales de gráficos y controles para guardarlos como preset o compartirlos.
luducard-no-description = Sin descripción.
luducard-apply-btn = Aplicar
luducard-crash-safety-active = Seguro-Crash Activo
luducard-crash-safety-active-desc = Aplicaste un preset recientemente. Si algo falla, restaura las configuraciones originales.
luducard-no-community-presets = Ningún preset comunitario
luducard-no-community-presets-desc = No hay presets publicados para este juego en la nube. ¡Crea uno local y compártelo!
luducard-downloads-label = Descargas:
luducard-download-apply-btn = Descargar y Aplicar
luducard-delete = Eliminar
luducard-version-info-desc = Información de la versión y notas de campaña.
luducard-date-time-label = Fecha y Hora:
luducard-at = a las
luducard-file-size-label = Tamaño del Archivo:
luducard-campaign-notes-label = Notas de Campaña / Descripción del Progreso
luducard-campaign-notes-placeholder = P. ej. Paré tras derrotar al dragón. Nivel 45, build de destreza...
luducard-save-notes-btn = Guardar Notas
luducard-share-config-preset-title = Compartir Preset de Configuración
luducard-share-config-preset-desc = Guarda y envía tus optimizaciones locales a la comunidad.
luducard-detected-config-files = Archivos de Configuración Detectados:
luducard-no-config-files-detected = No se pudieron detectar archivos de configuración usando el mapeo de Ludusavi.
luducard-preset-title-placeholder = P. ej. Potato Mode (Max Performance) o Balanced DF Specs
luducard-preset-desc-detailed-label = Descripción (Versión del juego, mejoras de FPS estimadas, etc.)
luducard-preset-desc-placeholder = P. ej. Sube cerca del 15 % de FPS en la ciudad. Probado en la versión 1.63.
luducard-detected-hardware-label = Hardware Detectado (Especificaciones del Autor):
luducard-gpu-label = Tarjeta Gráfica (GPU)
luducard-ram-label = Memoria RAM
luducard-create-local-preset-title = Crear Preset Local
luducard-create-local-preset-desc = Guarda los ajustes actuales de este juego en un perfil local.
luducard-local-preset-title-placeholder = P. ej. Mi Optimización 60fps o Controles de Vuelo
luducard-local-preset-desc-placeholder = Describe qué cambia este preset (p. ej. reduce sombras volumétricas para mejor rendimiento).
luducard-included-files-label = Archivos Incluidos (Detectados automáticamente):
luducard-no-files-detected = Ludusavi no detectó ningún archivo.
luducard-create-preset-btn = Crear Preset
luducard-no-presets-here = Aún no hay presets aquí
luducard-be-first-to-share = ¡Sé el primero en compartir un preset de gráficos o controles con la comunidad!

# Save profiles (modding)
luducard-activate-profile-btn = Activar Perfil
luducard-active-profile-banner = Perfil Activo en el Sistema:
luducard-active-profile-banner-desc = Al cambiar de perfil, las partidas actuales de la carpeta del juego se guardan automáticamente en el perfil activo anterior para evitar la pérdida de datos.
luducard-cancel = Cancelar
luducard-cant-delete-active = No se puede eliminar el perfil activo
luducard-change-save-path-btn = Cambiar ruta de guardado
luducard-clone-current-saves = Clonar progreso actual
luducard-clone-current-saves-desc = Copia las partidas que hay actualmente en la carpeta del juego a este perfil (recomendado).
luducard-cloud-sync = Sincronización en la nube
luducard-cloud-sync-upload = Subir a la nube
luducard-confirm-reset-save-path = ¿Seguro que quieres restablecer la ruta de guardado de este juego al valor predeterminado del manifiesto?
luducard-create-profile-btn = Crear Perfil
luducard-new-save-profile-btn = Nuevo Perfil de Guardado
luducard-create-profile-desc = Inicia una campaña paralela o aísla partidas con mods.
luducard-create-profile-title = Crear Perfil de Guardado
luducard-created-at = Creado el
luducard-creation-options = Opciones de Inicio:
luducard-delete-profile = Eliminar perfil
luducard-loading-profiles = Cargando perfiles de guardado...
luducard-no-profiles-desc = El juego está usando los archivos de guardado predeterminados de tu sistema. Crea el primer perfil para empezar a organizar tus campañas.
luducard-no-profiles-yet = Ningún Perfil de Guardado
luducard-no-save-path = Ruta no configurada
luducard-none = Ninguno (Usando partidas sueltas)
luducard-profile-active-tag = Activo en el Sistema
luducard-profile-desc-label = Descripción
luducard-profile-desc-placeholder = Describe el propósito de este perfil (p. ej. jugando con la clase guerrero).
luducard-profile-inactive-tag = Inactivo
luducard-profile-name-label = Nombre del Perfil *
luducard-profile-name-placeholder = P. ej. Mi Campaña Vanilla o Partida con Mods
luducard-profiles-header = Gestión de Perfiles de Guardado
luducard-profiles-intro = Crea campañas separadas o aísla el juego con mods. Luducard se encargará de cambiar y guardar automáticamente las partidas correspondientes.
luducard-reset-save-path-btn = Restablecer a la ruta predeterminada
luducard-save-profiles-tab = Perfiles de Guardado
luducard-save-profiles-title = Perfiles de Guardado (Modding)
luducard-start-empty = Empezar desde cero (Vacío)
luducard-start-empty-desc = La carpeta de guardado actual del juego se vaciará para que empieces un progreso 100 % nuevo.

luducard-anonymous = Anónimo
luducard-author-by-label = Por:
luducard-preset-downloaded-from-community = Descargado de la comunidad - Autor
luducard-preset-tag-perf = Rendimiento
luducard-preset-tag-quality = Calidad / Visual
luducard-preset-tag-balanced = Equilibrado
luducard-preset-tag-deck = Steam Deck
luducard-preset-tag-potato = Modo Patata
luducard-preset-tag-controls = Controles / Disposición
luducard-preset-tag-rt = Ray Tracing Opt.
luducard-preset-tag-4k = Listo para 4K
luducard-preset-tag-vr = Listo para RV

luducard-schedule-auto-routine = Rutina de guardados automáticos
luducard-schedule-auto-routine-desc = Define cuándo deben realizarse las copias de seguridad de forma automática.
luducard-schedule-by-interval = Por intervalo
luducard-schedule-by-days = Días de la semana
luducard-schedule-backup-every = Hacer copia de seguridad cada
luducard-schedule-1-hour = 1 hora
luducard-schedule-3-hours = 3 horas
luducard-schedule-6-hours = 6 horas
luducard-schedule-12-hours = 12 horas
luducard-schedule-24-hours = 24 horas
luducard-schedule-at-time = A las
luducard-schedule-games-in-schedule = Juegos en la programación
luducard-schedule-games-in-schedule-desc = Selecciona qué juegos siguen esta rutina automática.
luducard-schedule-btn-save = Guardar programación
luducard-schedule-saved-toast = Programación guardada con éxito

luducard-day-sun = Dom
luducard-day-mon = Lun
luducard-day-tue = Mar
luducard-day-wed = Mié
luducard-day-thu = Jue
luducard-day-fri = Vie
luducard-day-sat = Sáb

luducard-notification-alerts = Alertas y notificaciones
luducard-notification-alerts-desc = Elige cómo deseas ser notificado sobre las copias de seguridad.
luducard-notification-windows = Notificaciones de Windows
luducard-notification-windows-desc = Notificar cuando una copia de seguridad se complete con éxito.
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


luducard-cloud-details-title = Detalles de la cuenta
luducard-cloud-email = Correo de la cuenta:
luducard-cloud-destination = Carpeta de destino:
luducard-cloud-engine = Motor de copia de seguridad:
luducard-cloud-path = Ruta del ejecutable:
luducard-cloud-rules-title = Reglas de sincronización
luducard-cloud-upload-auto = Subida automática
luducard-cloud-upload-auto-desc = Subir partidas tan pronto como se genere la copia local.
luducard-cloud-download-latest = Descargar más reciente
luducard-cloud-download-latest-desc = Dar prioridad a los archivos más nuevos en la nube.
luducard-cloud-toast-upload-enabled = Subida automática activada
luducard-cloud-toast-upload-disabled = Subida automática desactivada
luducard-cloud-toast-download-enabled = Descarga automática activada
luducard-cloud-toast-download-disabled = Descarga automática desactivada
luducard-support-dest = Destino de los recursos
luducard-danger-zone = Zona de peligro
luducard-danger-zone-desc = Acciones destructivas que no se pueden deshacer.
luducard-reset-warning-title = ADVERTENCIA IMPORTANTE:
luducard-reset-warning-desc = Esto borrará permanentemente todos tus ajustes, rutas de búsqueda, credenciales en la nube y perfiles de guardado. Las carpetas originales de copia en disco no se borrarán.
luducard-btn-reset-app = Limpiar todos los datos
luducard-btn-reset-confirm = Sí, confirmar eliminación
luducard-btn-reset-cancel = Cancelar

luducard-notify-quick-save-title = Guardado rápido
luducard-notify-quick-save-done-title = Guardado rápido completado
luducard-notify-quick-save-done = Copia de "{ $game }" guardada correctamente.
luducard-notify-quick-save-failed-title = Error en el guardado rápido
luducard-notify-quick-save-failed = No se pudo guardar "{ $game }": { $message }
luducard-notify-quick-save-no-game = No se pudo detectar el juego en primer plano.
luducard-notify-quick-save-unmatched = { $exe } no es un juego de tu biblioteca.
luducard-notify-auto-backup-title = Copia de seguridad automática
luducard-notify-auto-backup-done = Partida de "{ $game }" guardada correctamente.
luducard-notify-auto-backup-failed-title = Error en la copia automática
luducard-notify-auto-backup-failed = No se pudo guardar "{ $game }": { $message }
luducard-notify-scan-done-title = Análisis completado
luducard-notify-scan-done =
    { $total } { $total ->
        [one] juego encontrado
       *[other] juegos encontrados
    } en tu biblioteca.
luducard-notify-tray-title = Luducard sigue en ejecución
luducard-notify-tray-body = La aplicación se minimizó a la bandeja del sistema.
luducard-tray-show = Mostrar ventana
luducard-tray-quit = Salir de Luducard

luducard-quicksave = Atajo de emergencia (guardado rápido manual)
luducard-quicksave-desc = Atajo global (Save State para PC) que respalda el juego que esté en primer plano.
luducard-quicksave-press-keys = Pulsa las teclas...
luducard-card-size-small = Portadas pequeñas
luducard-card-size-medium = Portadas medianas
luducard-card-size-large = Portadas grandes

luducard-wizard-title = Configuración inicial de juegos
luducard-wizard-desc = Para respaldar tus partidas automáticamente, Luducard necesita saber dónde están instalados tus juegos. Encontramos estas carpetas:
luducard-wizard-confirm = Confirmar y guardar
luducard-wizard-skip = Omitir / configurar más tarde
luducard-wizard-close = Cerrar
luducard-scan-after-wizard = Buscar partidas nuevas justo después de guardar
luducard-detecting-launchers = Buscando plataformas instaladas...
luducard-detection-failed = No se pudieron detectar las plataformas instaladas.
luducard-no-platforms-detected = No se detectó ninguna plataforma estándar.
luducard-no-platforms-desc = Sin problema: puedes añadir tus carpetas de juegos manualmente al cerrar este asistente.
luducard-saving-folders = Guardando carpetas y configurando el monitoreo...
luducard-folders-saved-success = Carpetas configuradas correctamente.
luducard-save-wizard-failed = No se pudieron guardar las carpetas monitorizadas.

luducard-conflict-title = Conflicto de partida detectado
luducard-conflict-this-pc = Este PC
luducard-conflict-cloud = Nube
luducard-conflict-newer = Más reciente
luducard-conflict-older = Más antigua
luducard-conflict-keep-local = Conservar la versión de este PC
luducard-conflict-keep-cloud = Conservar la versión de la nube

luducard-scan-phase-starting = Iniciando análisis...
luducard-scan-phase-saves = Buscando partidas en el disco...
luducard-scan-phase-game = Analizando los juegos encontrados...
luducard-scan-phase-emulators = Analizando emuladores...
luducard-scan-phase-processing = Procesando resultados...
luducard-scan-phase-finalizing = Finalizando y guardando la caché...
luducard-scan-phase-done = Análisis completado.
luducard-games-found = juegos encontrados

luducard-toast-backing-up = Respaldando los juegos seleccionados...
luducard-toast-backup-success = Copia de seguridad completada correctamente.
luducard-schedule-all-games = Respaldar todos los juegos
luducard-back-to-top = Volver arriba
luducard-platform-other = Otro
