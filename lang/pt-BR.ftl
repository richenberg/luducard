ludusavi = Ludusavi
language = Idioma
game-name = Nome
total-games = Jogos
file-size = Tamanho
file-location = LocalizaÃ§Ã£o
overall = Geral
status = Status
cli-unrecognized-games = Sem informaÃ§Ãµes para estes jogos:
cli-unable-to-request-confirmation = NÃ£o foi possÃ­vel solicitar confirmaÃ§Ã£o.
    .winpty-workaround = Se vocÃª estiver usando um emulador Bash (como Git Bash), tente executar a winpty.
cli-backup-id-with-multiple-games = NÃ£o Ã© possÃ­vel especificar a ID do backup ao restaurar vÃ¡rios jogos.
cli-invalid-backup-id = ID do backup invÃ¡lido.
badge-failed = FALHOU
badge-duplicates = DUPLICADOS
badge-duplicated = DUPLICADO
badge-ignored = IGNORADO
badge-redirected-from = DE: { $path }
badge-redirecting-to = PARA: { $path }
some-entries-failed = Algumas entradas nÃ£o conseguiram processar; procure por { badge-failed } na saÃ­da para mais detalhes. Verifique se vocÃª pode acessar esses arquivos ou se os caminhos deles sÃ£o muito longos.
cli-game-line-item-redirected = Redirecionado de: { $path }
cli-game-line-item-redirecting = Redirecionando para: { $path }
button-backup = Fazer backup
button-preview = Visualizar
button-restore = Restaurar
button-nav-backup = MODO DE BACKUP
button-nav-restore = MODO DE RESTAURAÃ‡ÃƒO
button-nav-custom-games = JOGOS PERSONALIZADOS
button-nav-other = OUTRO
button-add-game = Adicionar jogo
button-continue = Continuar
button-cancel = Cancelar
button-cancelling = Cancelamento...
button-okay = Ok
button-select-all = Selecionar tudo
button-deselect-all = Desmarcar tudo
button-enable-all = Ativar tudo
button-disable-all = Desativar tudo
button-customize = Personalizar
button-exit = Sair
button-comment = ComentÃ¡rio
button-lock = Travar
button-unlock = Destravar
# This opens a download page.
button-get-app = Obter { $app }
button-validate = Validar
button-override-manifest = Sobrescrever manifesto
button-extend-manifest = Estender manifesto
button-sort = Classificar
button-download = Download
button-upload = Upload
button-ignore = Ignorar
no-roots-are-configured = Adicione algumas raÃ­zes para armazenar ainda mais dados.
config-is-invalid = Erro: O arquivo de configuraÃ§Ã£o Ã© invÃ¡lido.
manifest-is-invalid = Erro: O arquivo de manifesto Ã© invÃ¡lido.
manifest-cannot-be-updated = Erro: NÃ£o foi possÃ­vel verificar se hÃ¡ uma atualizaÃ§Ã£o no manifesto. Sua conexÃ£o com a Internet estÃ¡ inativa?
cannot-prepare-backup-target = Erro: NÃ£o Ã© possÃ­vel preparar o destino do backup (criando ou esvaziando a pasta). Se vocÃª tiver a pasta aberta no seu navegador de arquivos, tente fechÃ¡-la: { $path }
restoration-source-is-invalid = Erro: A fonte de restauraÃ§Ã£o Ã© invÃ¡lida (ou nÃ£o existe ou nÃ£o Ã© um diretÃ³rio). Por favor, verifique o local: { $path }
registry-issue = Erro: Algumas entradas de registro foram ignoradas.
unable-to-browse-file-system = Erro: NÃ£o Ã© possÃ­vel navegar no seu sistema.
unable-to-open-directory = Erro: NÃ£o Ã© possÃ­vel abrir o diretÃ³rio:
unable-to-open-url = Erro: NÃ£o foi possÃ­vel abrir a URL:
unable-to-configure-cloud = NÃ£o foi possÃ­vel configurar a nuvem.
unable-to-synchronize-with-cloud = NÃ£o foi possÃ­vel sincronizar com a nuvem.
cloud-synchronize-conflict = Seus backups locais e da nuvem estÃ£o em conflito. Execute um upload ou download para resolver isso.
command-unlaunched = Comando nÃ£o iniciou: { $command }
command-terminated = Comando encerrado abruptamente: { $command }
command-failed = O comando falhou com o cÃ³digo { $code }: { $command }
processed-games =
    { $total-games } { $total-games ->
        [one] jogo
       *[other] jogos
    }
processed-games-subset =
    { $processed-games } de { $total-games } { $total-games ->
        [one] jogo
       *[other] jogos
    }
processed-size-subset = { $processed-size } de { $total-size }
field-backup-target = Fazer backup para:
field-restore-source = Restaurar de:
field-custom-files = Caminhos:
field-custom-registry = Registro:
field-sort = Organizar:
field-redirect-source =
    .placeholder = Fonte (local original)
field-redirect-target =
    .placeholder = Alvo (novo local)
field-roots = Raiz:
field-backup-excluded-items = ExclusÃµes do backup:
field-redirects = Redirecionar:
# This appears next to the number of full backups that you'd like to keep.
# A full backup includes all save files for a game.
field-retention-full = Todos:
# This appears next to the number of differential backups that you'd like to keep.
# A differential backup includes only the files that have changed since the last full backup.
field-retention-differential = Diferencial:
field-backup-format = Formato:
field-backup-compression = CompressÃ£o:
# The compression level determines how much compresison we perform.
field-backup-compression-level = NÃ­vel:
label-manifest = Manifesto
# This shows the time when we checked for an update to the manifest.
label-checked = Verificado
# This shows the time when we found an update to the manifest.
label-updated = Atualizado
label-new = Novo
label-removed = Removido
label-comment = ComentÃ¡rio
label-unchanged = Inalterada
label-backup = Backup
label-scan = Escanear
label-filter = Filtro
label-unique = Ãšnico
label-complete = ConcluÃ­do
label-partial = Parcial
label-enabled = Ativado
label-disabled = Desativado
# https://en.wikipedia.org/wiki/Thread_(computing)
label-threads = TÃ³picos
label-cloud = Nuvem
# A "remote" is what Rclone calls cloud systems like Google Drive.
label-remote = Remoto
label-remote-name = Nome remoto
label-folder = Pasta
# An executable file
label-executable = ExecutÃ¡vel
# Options given to a command line program
label-arguments = Argumentos
label-url = URL
# https://en.wikipedia.org/wiki/Host_(network)
label-host = Hospedeiro
# https://en.wikipedia.org/wiki/Port_(computer_networking)
label-port = Porta
label-username = Nome de usuÃ¡rio
label-password = Senha
# This is a specific website or service that provides some cloud functionality.
# For example, Nextcloud and Owncloud are providers of WebDAV services.
label-provider = Provedor
label-custom = Personalizado
label-none = Nenhum
label-change-count = MudanÃ§as: { $total }
label-unscanned = NÃ£o verificado
# This refers to a local file on the computer
label-file = Arquivo
label-game = Jogo
# Aliases are alternative titles for the same game.
label-alias = Apelido
label-original-name = Nome original
# Which manifest a game's data came from
label-source = Fonte
# This refers to the main Ludusavi manifest: https://github.com/mtkennerly/ludusavi-manifest
label-primary-manifest = Manifesto primÃ¡rio
# This refers to how we integrate a custom game with the manifest data.
label-integration = IntegraÃ§Ã£o
# This is a folder name where a specific game is installed
label-installed-name = Nome Instalado
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
store-other-home = Pasta padrÃ£o
# This would be a folder acting as a virtual C: drive, created by Wine.
store-other-wine = Prefixo Wine
# This would be a folder with typical Windows system folders,
# like "Program Files (x86)" and "Users".
store-other-windows = Drive do Windows
# This would be a folder with typical Linux system folders,
# like "home" and "opt".
store-other-linux = Drive do Linux
# This would be a folder with typical Mac system folders,
# like "Applications" and "Users".
store-other-mac = Drive do Mac
store-other = Outro
backup-format-simple = Simples
backup-format-zip = Zip
compression-none = Nenhum
# "Deflate" is a proper noun: https://en.wikipedia.org/wiki/Deflate
compression-deflate = Deflate
compression-bzip2 = Bzip2
compression-zstd = Zstd
theme = Tema
theme-light = Claro
theme-dark = Escuro
redirect-bidirectional = Bidirecional
reverse-redirects-when-restoring = Reverter sequÃªncia de redirecionamentos durante restauraÃ§Ã£o
show-disabled-games = Mostrar jogos desativados
show-unchanged-games = Mostrar jogos inalterados
show-unscanned-games = Mostrar jogos nÃ£o escaneados
override-max-threads = Substituir o nÃºmero mÃ¡ximo de threads
synchronize-automatically = Sincronizar automaticamente
prefer-alias-display = Exibir apelido ao invÃ©s do nome original
skip-unconstructive-backups = Pular backup quando dados serÃ£o removidos ao invÃ©s de adicionados ou atualizados
explanation-for-exclude-store-screenshots = Nos backups, exclui capturas de tela especÃ­ficas de armazenamento
explanation-for-exclude-cloud-games = NÃ£o faÃ§a backup de jogos com suporte Ã  nuvem nessas plataformas
consider-doing-a-preview =
    Se vocÃª ainda nÃ£o fez, considere fazer uma prÃ©-visualizaÃ§Ã£o primeiro, entÃ£o
    nÃ£o hÃ¡ surpresas.
confirm-backup =
    Tem certeza que deseja prosseguir com o backup? { $path-action ->
        [merge] Novos dados salvos serÃ£o mesclados na pasta de destino:
       *[create] A pasta de destino serÃ¡ criada:
    }
confirm-restore =
    Tem certeza que deseja prosseguir com a restauraÃ§Ã£o?
    Isto irÃ¡ sobrescrever qualquer arquivo atual com os backups aqui:
confirm-cloud-upload =
    VocÃª quer substituir seus arquivos na nuvem por seus arquivos locais?
    Seus arquivos da nuvem ({ $cloud-path }) se tornarÃ£o uma cÃ³pia exata de seus arquivos locais ({ $local-path }).
    Arquivos na nuvem serÃ£o atualizados ou excluÃ­dos conforme necessÃ¡rio.
confirm-cloud-download =
    Deseja substituir seus arquivos locais por seus arquivos na nuvem?
    Seus arquivos locais ({ $local-path }) se tornarÃ¡ uma cÃ³pia exata dos seus arquivos de nuvem ({ $cloud-path }).
    Os arquivos locais serÃ£o atualizados ou excluÃ­dos conforme necessÃ¡rio.
confirm-add-missing-roots = Adicionar estas origens?
no-missing-roots = Nenhuma origem adicional encontrada.
loading = Carregando...
preparing-backup-target = Preparando o diretÃ³rio de backup...
updating-manifest = Atualizando manifesto...
no-cloud-changes = NÃ£o hÃ¡ alteraÃ§Ãµes para sincronizar
backups-are-valid = Seus backups sÃ£o vÃ¡lidos.
backups-are-invalid =
    Os backups destes jogos parecem invÃ¡lidos.
    VocÃª deseja criar novos backups completos para esses jogos?
saves-found = Dados salvos encontrados.
no-saves-found = NÃ£o foram encontrados dados salvos.
# This is tacked on to form something like "Back up (no confirmation)",
# meaning we would perform an action without asking the user if they're sure.
suffix-no-confirmation = sem confirmaÃ§Ã£o
# This is shown when a setting will only take effect after closing and reopening Ludusavi.
suffix-restart-required = Ã© necessÃ¡rio reiniciar
prefix-error = Erro: { $message }
prefix-warning = Aviso: { $message }
cloud-app-unavailable = Backups na nuvem estÃ£o desativados porque { $app } nÃ£o estÃ¡ disponÃ­vel.
cloud-not-configured = Backups na nuvem estÃ£o desativados porque nenhum sistema na nuvem estÃ¡ configurado.
cloud-path-invalid = Backups na nuvem estÃ£o desativados porque o caminho de backup Ã© invÃ¡lido.
game-is-unrecognized = Este jogo nÃ£o foi reconhecido pelo Ludusavi.
game-has-nothing-to-restore = Este jogo nÃ£o tem um backup para restauraÃ§Ã£o.
launch-game-after-error = Iniciar o jogo de qualquer forma?
game-did-not-launch = Jogo falhou ao iniciar.
backup-is-newer-than-current-data = O backup existente Ã© mais recente que os dados atuais.
backup-is-older-than-current-data = O backup existe Ã© mais antigo que os dados atuais.
back-up-specific-game =
    .confirm = Fazer backup dos dados de { $game }?
    .failed = Falha ao fazer backup dos dados de { $game }
restore-specific-game =
    .confirm = Restaurar dados salvos de { $game }?
    .failed = Falha ao restaurar dados de { $game }
new-version-check = Verificar por atualizaÃ§Ãµes do aplicativo automaticamente
new-version-available = Uma atualizaÃ§Ã£o do aplicativo estÃ¡ disponÃ­vel: { $version }. Gostaria de ver as notas de lanÃ§amento?
custom-game-will-override = Esse jogo personalizado substitui uma entrada de manifesto
custom-game-will-extend = Este jogo personalizado estende uma entrada de manifesto
operation-will-only-include-listed-games = Isso processarÃ¡ apenas os jogos que estÃ£o listados no momento

luducard-library = Biblioteca
luducard-scan-and-add = Escanear & Adicionar
luducard-cloud-and-sync = Nuvem & SincronizaÃ§Ã£o
luducard-save-share-hub = Save Share HUB
luducard-preset-share-hub = Preset Share HUB
luducard-settings = ConfiguraÃ§Ãµes
luducard-support-project = Apoiar o Projeto
luducard-library-status = Status da biblioteca
luducard-games = Jogos
luducard-language = Idioma
luducard-language-desc = Idioma da interface.
luducard-sidebar-subtitle = Backup de saves
luducard-navigation = NavegaÃ§Ã£o
luducard-stored-saves = Saves armazenados
luducard-pending-saves = Pendentes
luducard-downloading-covers = Baixando capas...
luducard-settings-desc = PreferÃªncias e comportamento do aplicativo
luducard-dashboard-desc = Gerencie e proteja os saves dos seus jogos

luducard-file-watcher = Monitor de Saves (File Watcher)
luducard-file-watcher-desc = Monitora alteraÃ§Ãµes nos saves e faz backup automÃ¡tico quando o jogo fechar.
luducard-start-with-windows = Iniciar com o Windows
luducard-start-with-windows-desc = Abre minimizado na bandeja do sistema ao ligar o PC.
luducard-system-tray = Executar na Bandeja (System Tray)
luducard-system-tray-desc = Minimiza o aplicativo perto do relÃ³gio ao invÃ©s de fechar, mantendo o monitoramento em segundo plano.
luducard-portable = Modo PortÃ¡til (Portable Mode)
luducard-portable-desc = Salva todas as configuraÃ§Ãµes, manifestos e backups na pasta do executÃ¡vel (ideal para pendrives).
luducard-theme = Tema
luducard-theme-desc = AparÃªncia da interface do aplicativo.
luducard-theme-dark = Escuro
luducard-theme-light = Claro
luducard-theme-system = Sistema
luducard-backup-dir = DiretÃ³rio de Backup
luducard-backup-dir-desc = Onde os saves dos seus jogos serÃ£o guardados localmente.

luducard-rclone-path = Caminho do executÃ¡vel Rclone
luducard-rclone-path-desc = Caminho para o executÃ¡vel rclone usado no envio para nuvem.
luducard-cloud-folder = Pasta Remota na Nuvem
luducard-cloud-folder-desc = Nome da pasta remota para sincronizar os arquivos.
luducard-rclone-args = Argumentos extras do Rclone
luducard-rclone-args-desc = Comandos e flags opcionais passados diretamente ao rclone.
luducard-supabase-url = URL do Supabase (RepositÃ³rio ComunitÃ¡rio)
luducard-supabase-url-desc = URL da API do seu projeto Supabase para a aba de comunidade.
luducard-supabase-key = Anon Key do Supabase
luducard-supabase-key-desc = Chave pÃºblica (anon) usada para autenticaÃ§Ã£o anÃ´nima nas tabelas.
luducard-btn-save-settings = Salvar ConfiguraÃ§Ãµes

luducard-tab-general = Geral
luducard-tab-schedule = Agendamento
luducard-tab-notifications = NotificaÃ§Ãµes
luducard-general-preferences = PreferÃªncias gerais
luducard-general-preferences-desc = Caminhos e comportamento bÃ¡sico do aplicativo.

luducard-status-synchronized = Sincronizado
luducard-status-pending = Backup pendente
luducard-status-none = Sem backup
luducard-backup = Backup
luducard-restore = Restaurar
luducard-current-save = Save Ativo
luducard-last-backup = Ãšltimo Backup
luducard-manual-backup = Backup Manual
luducard-loading-library = Carregando biblioteca de jogos...
luducard-monitored-games = Jogos Monitorados
luducard-cloud-synced = Sincronizados na Nuvem
luducard-pending-saves-plural = Backups Pendentes
luducard-search-games = Buscar jogos...
luducard-clear-search = Limpar busca
luducard-select-all = Selecionar todos
luducard-platform = Plataforma
luducard-all-platforms = Todas as Plataformas
luducard-sort-by = Ordenar por
luducard-sort-name = Nome (A-Z)
luducard-sort-recent = Jogado recentemente
luducard-sort-size = Tamanho do save
luducard-installed = Instalado
luducard-pending = Pendente
luducard-grid-view = VisualizaÃ§Ã£o em grade
luducard-list-view = VisualizaÃ§Ã£o em lista
luducard-showing = Exibindo
luducard-of = de
luducard-game = jogo
luducard-games-plural = jogos
luducard-no-games-found = Nenhum jogo encontrado
luducard-adjust-filters-desc = Ajuste os filtros ou varra suas pastas para adicionar novos jogos.
luducard-starting-backup-for = Iniciando backup para
luducard-backup-completed-for = Backup de
luducard-completed = concluÃ­do!
luducard-completed-fem = concluÃ­da!
luducard-backup-failed-for = Falha no backup de
luducard-restoring-backup-for = Restaurando backup de
luducard-restore-completed-for = RestauraÃ§Ã£o de
luducard-restore-failed-for = Falha ao restaurar
luducard-never = Nunca

luducard-scan-title = Escanear & Adicionar
luducard-scan-desc = Encontre saves de jogos no seu computador
luducard-auto-search = Busca automÃ¡tica
luducard-auto-search-desc = Varre as pastas comuns do sistema (Steam, Epic, Documentos e AppData) e suas pastas customizadas em busca de novos saves ou alteraÃ§Ãµes.
luducard-scanning = Escaneando...
luducard-start-scan = Iniciar varredura de alteraÃ§Ãµes
luducard-scan-completed = Varredura concluÃ­da
luducard-scan-completed-desc = DetecÃ§Ã£o de alteraÃ§Ãµes finalizada.
luducard-scan-error = Erro ao realizar varredura.
luducard-custom-folder = Personalizada
luducard-default-folder = PadrÃ£o
luducard-folder-added = Pasta adicionada ao monitoramento
luducard-folder-added-success = Pasta adicionada com sucesso!
luducard-folder-select-error = Erro ao selecionar/adicionar pasta.
luducard-emulator-detected = A pasta selecionada pertence ao emulador { $emulator }.\n\nDeseja adicionÃ¡-la como um Emulador para rastrear os saves dos seus jogos automaticamente?
luducard-adding-emulator = Adicionando emulador e escaneando saves...
luducard-emulator-added-success = Emulador { $emulator } adicionado com sucesso! { $count } jogo(s) detectado(s) na pasta de saves.
luducard-emulator-added-empty = Emulador { $emulator } adicionado! Nenhum save de jogo foi detectado na pasta.
luducard-emulator-add-failed = Falha ao adicionar emulador: { $error }
luducard-emulator-added-mock = Emulador adicionado com sucesso! (Mock)
luducard-emulator-select-error = Erro ao selecionar/adicionar emulador.
luducard-emulator-removed = Emulador removido
luducard-emulator-remove-error = Erro ao remover emulador.
luducard-folder-removed = Pasta removida do monitoramento
luducard-folder-remove-error = Erro ao remover pasta.
luducard-monitored-folders = Pastas monitoradas
luducard-monitored-folders-desc = DiretÃ³rios raiz observados continuamente para novos saves.
luducard-add-folder = Adicionar pasta
luducard-no-folders-detected = Nenhuma pasta de jogos detectada automaticamente.
luducard-click-add-folder-desc = Clique em "Adicionar pasta" para selecionar uma pasta de biblioteca ou emuladores.
luducard-monitoring-active = Monitoramento active
luducard-remove-folder = Remover pasta
luducard-select-new-root = Selecionar nova pasta raiz
luducard-monitored-emulators = Emuladores monitorados
luducard-monitored-emulators-desc = DiretÃ³rios de emuladores observados para busca automÃ¡tica de saves de console.
luducard-add-emulator = Adicionar emulador
luducard-no-emulators-configured = Nenhum emulador configurado.
luducard-click-add-emulator-desc = Clique em "Adicionar emulador" para importar saves de Switch, Wii, Wii U, GBA, PS2, etc.
luducard-saves-integrated = Saves integrados Ã  biblioteca
luducard-remove-emulator = Remover emulador
luducard-add-other-emulator = Adicionar outro emulador
luducard-scan-results = Resultados da varredura
luducard-scan-results-desc = Selecione quais jogos com saves novos ou alterados vocÃª deseja fazer backup.
luducard-starting-batch-backup = Iniciando backup em lote para { $count } jogos...
luducard-batch-backup-completed = Backup dos jogos selecionados concluÃ­do!
luducard-batch-backup-failed = Falha no backup em lote.
luducard-backup-selected = Fazer Backup Selecionados
luducard-no-new-saves-detected = Nenhum novo save ou alteraÃ§Ã£o detectada. Todos os jogos estÃ£o sincronizados!
luducard-new-game = Novo Jogo
luducard-changed-save = Alterado

luducard-cloud-title = Nuvem & SincronizaÃ§Ã£o
luducard-cloud-desc = Configure o backup remoto dos seus saves
luducard-cloud-provider = Provedor de nuvem
luducard-cloud-provider-desc = Escolha onde seus backups serÃ£o armazenados remotamente.
luducard-auth-status = Status de autenticaÃ§Ã£o e armazenamento.
luducard-connected-as = Conectado como { $account }
luducard-oauth-authorized = Conta autorizada via OAuth
luducard-disconnect = Desconectar
luducard-space-used = EspaÃ§o utilizado
luducard-connect-desc = Conecte sua conta { $provider } para habilitar o backup remoto dos seus saves.
luducard-connect-btn = Conectar conta
luducard-sync-rules = Regras de sincronizaÃ§Ã£o
luducard-sync-rules-desc = Como os saves se movem entre o PC e a nuvem.
luducard-auto-upload = Upload automÃ¡tico apÃ³s backup local
luducard-auto-upload-desc = Envia para a nuvem imediatamente apÃ³s cada backup.
luducard-auto-upload-enabled = Upload automÃ¡tico ligado
luducard-auto-upload-disabled = Upload automÃ¡tico desligado
luducard-download-if-newer = Baixar se o save remoto for mais recente
luducard-download-if-newer-desc = Resolve conflitos priorizando a versÃ£o mais nova.
luducard-auto-download-enabled = Download automÃ¡tico ligado
luducard-auto-download-disabled = Download automÃ¡tico desligado
luducard-disconnected-provider = { $provider } desconectado
luducard-connected-provider = { $provider } conectado

luducard-loading = Carregando...
luducard-fetching-details = Buscando detalhes do jogo
luducard-loading-details = Carregando detalhes do jogo...
luducard-details-desc = Detalhes e histÃ³rico de backups
luducard-back = Voltar
luducard-select = Selecionar
luducard-saved-versions = versÃµes salvas
luducard-backup-now = Fazer backup agora
luducard-restore-latest = Restaurar Ãºltima
luducard-open-game-folder-desc = Abrir pasta de instalaÃ§Ã£o do jogo no Windows Explorer
luducard-game-folder = Pasta do Jogo
luducard-open-save-folder-desc = Abrir pasta onde os saves ativos ficam armazenados
luducard-save-folder = Pasta do Save
luducard-open-backup-folder-desc = Abrir pasta de backup de saves do Luducard
luducard-backup-folder = Pasta de Backups
luducard-export-save-desc = Exportar save como arquivo .luducard compactado para compartilhar
luducard-export-save = Exportar Save (.luducard)
luducard-status = Status
luducard-saves-on-pc = Saves no PC
luducard-total-backups = Total em backups
luducard-quick-preferences = PreferÃªncias rÃ¡pidas
luducard-save-history = HistÃ³rico de Saves
luducard-config-presets = Presets de ConfiguraÃ§Ã£o
luducard-saves-timeline = Linha do Tempo (Saves)
luducard-presets-configs = Presets & ConfiguraÃ§Ãµes
luducard-no-backups-yet = Nenhum backup ainda
luducard-do-first-backup-desc = FaÃ§a o primeiro backup deste jogo para comeÃ§ar a linha do tempo.
luducard-active = Ativo
luducard-disabled = Desativado

luducard-support-title = Apoiar o Projeto
luducard-support-desc = Ajude a manter os servidores comunitÃ¡rios de saves e presets online
luducard-support-intro-title = O Luducard Ã© totalmente gratuito!
luducard-support-intro-desc = Nossos recursos de nuvem (Save Share Hub e Presets) geram custos mensais de servidores e trÃ¡fego. Se o aplicativo Ã© Ãºtil para vocÃª, considere apoiar para ajudar a mantÃª-los online!
luducard-how-to-support = Como Apoiar o Projeto
luducard-how-to-support-desc = Escolha a sua forma de contribuiÃ§Ã£o preferida. O Stripe oferece suporte a cartÃµes de crÃ©dito e PIX nacional.
luducard-support-itch = Apoiar no Itch.io
luducard-support-stripe = CartÃ£o / PIX via Stripe
luducard-support-dest-desc = Toda contribuiÃ§Ã£o Ã© integralmente voltada para a manutenÃ§Ã£o dos servidores em nuvem (hospedagem e trÃ¡fego de dados).

luducard-community-title = Save Share HUB
luducard-community-desc = Compartilhe e baixe checkpoints de saves da comunidade
luducard-btn-share-checkpoint = Compartilhar Checkpoint
luducard-repo-disconnected = RepositÃ³rio ComunitÃ¡rio Desconectado
luducard-repo-disconnected-desc = Para carregar os checkpoints comunitÃ¡rios e compartilhar os seus, vocÃª precisa configurar a URL do seu Supabase e a Anon Key pÃºblica na aba de ConfiguraÃ§Ãµes.
luducard-how-to-config = Como configurar:
luducard-config-step-1 = Crie um projeto gratuito no Supabase.
luducard-config-step-2 = Crie as tabelas executando o script SQL que geramos no arquivo supabase/schema.sql.
luducard-config-step-3 = Insira a URL da API e a Anon Key pÃºblica nas ConfiguraÃ§Ãµes do Luducard.
luducard-checkpoints = Checkpoints
luducard-contributors = Contribuidores
luducard-search-placeholder = Buscar por jogo ou checkpoint...
luducard-sort-popular = Popular
luducard-sort-recent-hub = Recentes
luducard-sort-size-hub = Tamanho
luducard-syncing-repo = Sincronizando com o repositÃ³rio pÃºblico...
luducard-no-checkpoints-found = Nenhum checkpoint encontrado
luducard-no-checkpoints-available = Nenhum checkpoint disponÃ­vel
luducard-search-terms-desc = Tente buscar com outros termos.
luducard-be-first-desc = Seja o primeiro a compartilhar um save da comunidade!
luducard-no-desc-provided = Nenhuma descriÃ§Ã£o detalhada fornecida.
luducard-author-by = por
luducard-zstd-verified = ContÃ©m metadados zstd verificados
luducard-btn-install = Instalar
luducard-btn-installing = Instalando...
luducard-security-sandbox-title = SeguranÃ§a AutomÃ¡tica do Seguro-Crash e Sandbox
luducard-security-sandbox-desc = Ao instalar um checkpoint da comunidade, o Luducard automaticamente cria um backup de seguranÃ§a do seu save atual antes de sobrescrever. Se algo der errado, Ã© sÃ³ restaurar o backup anterior no histÃ³rico.
luducard-share-checkpoint-modal = Compartilhar Checkpoint
luducard-publish-progress-desc = Publique o seu arquivo de progresso para a comunidade.
luducard-save-game-label = Jogo do Save *
luducard-search-installed-game = Digite para pesquisar um jogo instalado...
luducard-backup-version-label = VersÃ£o do Backup *
luducard-no-local-backups-desc = Nenhum backup local feito para este jogo ainda. Crie um backup no card do jogo primeiro.
luducard-checkpoint-title-label = TÃ­tulo do Checkpoint *
luducard-checkpoint-title-placeholder = Ex: Antes da MalÃªnia ou Level 100 100% Completo
luducard-checkpoint-author-label = Nome do Autor
luducard-checkpoint-author-placeholder = Ex: AnÃ´nimo
luducard-checkpoint-desc-label = DescriÃ§Ã£o / Notas Adicionais
luducard-checkpoint-desc-placeholder = Descreva detalhes como build, nÃ­vel, itens importantes ou o momento do progresso.
luducard-checkpoint-tags-label = Tags do Checkpoint
luducard-btn-cancel = Cancelar
luducard-btn-publishing = Publicando...
luducard-btn-publish = Publicar Checkpoint
luducard-detail-modal-desc = Visualizando metadados completos do checkpoint.
luducard-btn-close = Fechar
luducard-btn-download-install = Baixar & Instalar
luducard-detail-title-label = TÃ­tulo do Checkpoint:
luducard-detail-desc-label = DescriÃ§Ã£o do Progresso:
luducard-detail-tags-label = Marcadores:
luducard-detail-size-label = Tamanho Comprimido:
luducard-detail-downloads-label = Total Downloads:
luducard-detail-author-label = Enviado por:
luducard-detail-date-label = Enviado em:
luducard-date-today = Hoje
luducard-date-yesterday = Ontem
luducard-date-days-ago = dias atrÃ¡s
luducard-date-weeks-ago = semanas atrÃ¡s
luducard-date-locale = pt-BR

luducard-presethub-title = Preset Share HUB
luducard-presethub-desc = Descubra e compartilhe otimizaÃ§Ãµes de grÃ¡ficos e controles da comunidade
luducard-btn-share-preset = Compartilhar Preset
luducard-presethub-disconnected = RepositÃ³rio de Presets Desconectado
luducard-presethub-disconnected-desc = Para carregar os presets comunitÃ¡rios e compartilhar os seus, vocÃª precisa configurar a URL do seu Supabase e a Anon Key pÃºblica na aba de ConfiguraÃ§Ãµes.
luducard-presets = Presets
luducard-preset-search-placeholder = Buscar por jogo, tÃ­tulo ou hardware (ex: RTX 4070)...
luducard-syncing-presets = Sincronizando presets...
luducard-no-presets-found = Nenhum preset grÃ¡fico encontrado
luducard-search-terms-desc-preset = Tente redefinir seus termos de busca.
luducard-badge-official = Oficial
luducard-gpu = GPU
luducard-approval = AprovaÃ§Ã£o
luducard-useful = Useful
luducard-useless = Useless
luducard-report-preset = Denunciar preset
luducard-btn-undo = Desfazer
luducard-btn-inject = Injetar
luducard-btn-injecting = Injetando...
luducard-not-installed = NÃ£o Instalado
luducard-security-safety-title = SeguranÃ§a Garantida pelo Seguro-Crash
luducard-security-safety-desc = Ao baixar qualquer preset grÃ¡fico do HUB, o Luducard faz backup das suas configuraÃ§Ãµes anteriores. Os seus saves de progresso permanecem intocados.
luducard-share-preset-modal-title = Compartilhar Preset GrÃ¡fico
luducard-share-preset-modal-desc = Envie um preset grÃ¡fico local para a comunidade.
luducard-preset-game-label = Jogo do Preset *
luducard-search-installed-game-preset = Pesquisar jogo instalado...
luducard-choose-local-preset-label = Escolher Preset Local *
luducard-no-local-presets-desc = Nenhum preset local salvo para este jogo. VÃ¡ na aba do jogo e crie um preset local primeiro!
luducard-preset-title-label = TÃ­tulo do Preset *
luducard-preset-creator-label = Autor / Criador
luducard-preset-desc-label = DescriÃ§Ã£o / Notas do Preset
luducard-preset-tags-label = Tags do Preset
luducard-preset-hardware-label = Hardware do Autor (Auto-preenchido do preset local):
luducard-cpu = CPU
luducard-ram = RAM
luducard-btn-publish-preset = Publicar Preset
luducard-detail-preset-title = TÃ­tulo do Preset:
luducard-detail-preset-desc = DescriÃ§Ã£o / OtimizaÃ§Ãµes:
luducard-detail-author-specs = EspecificaÃ§Ãµes do Autor:

luducard-tag-desc-100 = Jogo 100% concluÃ­do com todas as conquistas, itens e colecionÃ¡veis liberados.
luducard-tag-desc-dlc1 = Progresso focado ou pronto para iniciar a primeira DLC do jogo.
luducard-tag-desc-dlc2 = Progresso focado ou pronto para iniciar a segunda DLC do jogo.
luducard-tag-desc-ngplus = Jogo pronto para iniciar ou jÃ¡ iniciado no modo Novo Jogo+.
luducard-tag-desc-vanilla = Progresso do jogo base totalmente limpo, sem modificadores, mods ou trapaÃ§as.
luducard-tag-desc-modded = Progresso obtido utilizando modificaÃ§Ãµes (mods) que podem alterar a gameplay.
luducard-tag-desc-bossprep = Save posicionado estrategicamente logo antes de um chefe importante do jogo.
luducard-tag-desc-starter = Save no inÃ­cio do jogo, com recursos acumulados ou com tutorial pulado.
luducard-tag-desc-cleanstart = Savegame logo apÃ³s a criaÃ§Ã£o de personagem ou introduÃ§Ã£o, pronto para jogar direto do inÃ­cio real.
luducard-tag-desc-midgame = Save posicionado no meio da campanha principal (Ã³timo para quem perdeu o progresso).
luducard-tag-desc-postgame = Campanha concluÃ­da, ideal para exploraÃ§Ã£o de bosses secretos, conquistas pendentes ou atividades secundÃ¡rias.
luducard-tag-desc-opbuild = Savegame focado em um personagem com equipamentos, nÃ­vel e builds extremamente fortes (Overpowered).
luducard-tag-desc-unlimitedcash = Save focado em ter dinheiro, moedas ou recursos de upgrades mÃ¡ximos ou infinitos.
luducard-tag-desc-allcollectibles = Save com foco em conquistas secundÃ¡rias e colecionÃ¡veis cansativos totalmente liberados.
luducard-tag-desc-hardcore = Saves em dificuldades extremas ou com morte permanente ativada (sobrevivÃªncia extrema).
luducard-tag-desc-speedrunready = Save ideal para treinar trechos de speedruns ou posicionado nas rotas mais rÃ¡pidas.
luducard-tag-desc-legit = Progresso obtido de forma limpa, sem cheats, cÃ³digos de trapaÃ§a ou aproveitamento de bugs (glitches).
luducard-preset-tag-desc-perf = OtimizaÃ§Ãµes focadas em ganho de FPS e fluidez.
luducard-preset-tag-desc-quality = OtimizaÃ§Ãµes focadas em qualidade grÃ¡fica mÃ¡xima.
luducard-preset-tag-desc-balanced = EquilÃ­brio ideal entre fidelidade visual e taxa de FPS.
luducard-preset-tag-desc-deck = Perfil otimizado especificamente para a tela e bateria do Steam Deck/portÃ¡teis.
luducard-preset-tag-desc-potato = Para rodar em PCs super antigos e notebooks modestos.
luducard-preset-tag-desc-controls = Mapeamento customizado de controles, gamepad ou hotkeys.
luducard-preset-tag-desc-rt = ConfiguraÃ§Ã£o refinada com traÃ§ado de raio ativo, visando boa taxa de quadros.
luducard-preset-tag-desc-4k = OtimizaÃ§Ãµes focadas em TVs e monitores 4K de alta definiÃ§Ã£o.
luducard-preset-tag-desc-vr = ConfiguraÃ§Ãµes ajustadas para taxa de FPS ideal em realidade virtual.

luducard-schedule-auto-routine = Rotina de saves automÃ¡ticos
luducard-schedule-auto-routine-desc = Defina quando os backups acontecem.
luducard-schedule-by-interval = Por intervalo
luducard-schedule-by-days = Dias da semana
luducard-schedule-backup-every = Fazer backup a cada
luducard-schedule-1-hour = 1 hora
luducard-schedule-3-hours = 3 horas
luducard-schedule-6-hours = 6 horas
luducard-schedule-12-hours = 12 horas
luducard-schedule-24-hours = 24 horas
luducard-schedule-at-time = No horÃ¡rio
luducard-schedule-games-in-schedule = Jogos no cronograma
luducard-schedule-games-in-schedule-desc = Selecione quais jogos seguem esta rotina automÃ¡tica.
luducard-schedule-btn-save = Salvar cronograma
luducard-schedule-saved-toast = Cronograma salvo

luducard-day-sun = Dom
luducard-day-mon = Seg
luducard-day-tue = Ter
luducard-day-wed = Qua
luducard-day-thu = Qui
luducard-day-fri = Sex
luducard-day-sat = SÃ¡b

luducard-notification-alerts = Alertas e notificaÃ§Ãµes
luducard-notification-alerts-desc = Como vocÃª quer ser avisado sobre os backups.
luducard-notification-windows = NotificaÃ§Ãµes do Windows
luducard-notification-windows-desc = Avisa quando um backup Ã© concluÃ­do com sucesso.
luducard-notification-toast-enabled = NotificaÃ§Ãµes ligadas
luducard-notification-toast-disabled = NotificaÃ§Ãµes desligadas
luducard-notification-fail-alerts = Alertas de falha
luducard-notification-fail-alerts-desc = Notifica imediatamente quando um backup falha.
luducard-notification-toast-fail-enabled = Alertas de falha ligados
luducard-notification-toast-fail-disabled = Alertas de falha desligados
luducard-notification-sounds = Sons de alerta
luducard-notification-sounds-desc = Toca um som ao concluir ou falhar um backup.
luducard-notification-toast-sounds-enabled = Sons ligados
luducard-notification-toast-sounds-disabled = Sons desligados


