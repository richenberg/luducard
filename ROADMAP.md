# ðŸ—ºï¸ Roadmap & Checklist - Luducard

Este documento define o status atual do desenvolvimento do **Luducard** (Tauri v2 + React) e as prÃ³ximas etapas de implementaÃ§Ã£o, com ideias e inspiraÃ§Ãµes retiradas do *GameSave Manager (GSM)* e de boas prÃ¡ticas de UX.

---

## ðŸŸ¢ 1. O que jÃ¡ estÃ¡ feito (Current Status)

O projeto estÃ¡ estruturado como um workspace Rust que contÃ©m a biblioteca do Ludosavi no nÃºcleo e a interface do Luducard via Tauri.

- [x] **Frontend (React + Tailwind v4 + Vite)**: Interface com sidebar, visual moderno, pÃ¡ginas configuradas (Biblioteca, Detalhes, Escanear, Nuvem, ConfiguraÃ§Ãµes).
- [x] **Tauri Commands (Rust Bridge)**: Comandos em Rust criados para carregar a biblioteca de jogos (`get_games`), realizar backups (`backup_game`), restaurar backups (`restore_game`) e carregar/salvar configuraÃ§Ãµes (`get_settings`/`save_settings`).
- [x] **SeguranÃ§a e PermissÃµes (Tauri v2)**: Arquivo de capacidades (`default.json`) e arquivo de permissÃµes customizadas (`permissions/luducard.toml`) configurados para liberar o IPC das funÃ§Ãµes Rust para o Javascript.
- [x] **ResoluÃ§Ã£o de Conflitos e CompilaÃ§Ã£o**:
  - [x] CorreÃ§Ã£o dos schemas de janela do Tauri v2.
  - [x] Alinhamento de tipos e serializaÃ§Ã£o de campos (ex: `sizeMB` entre o TypeScript e o Serde).
  - [x] RemoÃ§Ã£o completa do framework antigo (`iced`) e de suas dependÃªncias do backend.
- [x] **DetecÃ§Ã£o Inteligente de Jogos Instalados**: O backend agora verifica a presenÃ§a de arquivos executÃ¡veis (`.exe`) nos diretÃ³rios de instalaÃ§Ã£o de lojas conhecidas (Steam, Epic, GOG, etc.) para confirmar se o jogo realmente estÃ¡ instalado (evitando falsos positivos de saves remanescentes).
- [x] **OrdenaÃ§Ã£o da Biblioteca (Jogados Recentemente)**: Adicionada a ordenaÃ§Ã£o por "Jogados recentemente", "Tamanho" e "Nome (A-Z)" na barra de ferramentas da biblioteca de jogos, alimentada pela data da Ãºltima modificaÃ§Ã£o dos saves.
- [x] **Backup Local ou Cloud**: se o cloud backuip estiver ativado, No botÃ£o "fazer backup" colocar uma flechinha pra selecionar backup local ou cloud, e deixar o cloud cinza se nÃ£o estiver configurado
---

## ðŸŸ¡ 2. O que falta para fechar a etapa atual (Immediate Tasks)

Ajustes finais para tornar o aplicativo usÃ¡vel como um executÃ¡vel de desktop independente.

- [x] **Trocar BrowserRouter por HashRouter**: Alterar em `ui/src/main.tsx` para evitar que o roteamento quebre quando o aplicativo carregar a partir dos arquivos locais integrados no `.exe`.
- [x] **Verificar a Interface**: Testar a navegaÃ§Ã£o de todas as abas e salvar configuraÃ§Ãµes reais para garantir que o backend reflita as alteraÃ§Ãµes nos arquivos `.yaml` locais do Ludosavi.
- [x] **GeraÃ§Ã£o do Standalone (Luducard.exe)**: Rodar a compilaÃ§Ã£o final de produÃ§Ã£o (`tauri build`) para gerar o executÃ¡vel final que roda de forma independente sem o terminal do Node.js.

---

## ðŸš€ 3. Ideias de Recursos & InspiraÃ§Ãµes do GameSave Manager (GSM)

Para transformar o Luducard em um utilitÃ¡rio completo de backup, propomos o desenvolvimento das seguintes novas funcionalidades divididas em blocos temÃ¡ticos:

### Bloco A: AutomatizaÃ§Ã£o e Segundo Plano (InvisÃ­vel ao UsuÃ¡rio)
- [x] **File Watcher (Monitor de Saves)**: IntegraÃ§Ã£o com a biblioteca `notify` do Rust. Quando o executÃ¡vel do jogo fechar e houver alteraÃ§Ãµes na pasta de saves, o app faz o backup silencioso e emite uma notificaÃ§Ã£o nativa do Windows.
- [x] **Executar na Bandeja do Sistema (System Tray)**: Ao clicar no "X", o app minimiza na barra de tarefas (perto do relÃ³gio) em vez de fechar, continuando seu trabalho de monitoramento silencioso em segundo plano com consumo quase nulo de memÃ³ria e CPU.
adicionar uma opÃ§Ã£o nas configuraÃ§Ãµes para desativar isso e econimzar processamento.
- [x] **Iniciar com o Windows**: Uma opÃ§Ã£o na aba de ConfiguraÃ§Ãµes para adicionar o aplicativo nas chaves de inicializaÃ§Ã£o automÃ¡tica do Registro do Windows (`Run`).

### Bloco B: Facilidades de Armazenamento e Capas
- [x] **Download de Capas AutomÃ¡tico**: Conectar com a API da Steam (usando a ID do jogo) ou SteamGridDB para buscar imagens reais de capas verticais para os jogos da biblioteca, substituindo os placeholders estÃ¡ticos.


### Bloco C: Recursos AvanÃ§ados de Backup
- [x] **Bloqueio de VersÃ£o (Pin Backup)**: Permitir "alfinetar" ou "bloquear" um backup especÃ­fico no histÃ³rico (ex: antes de uma escolha importante no jogo), impedindo que ele seja deletado automaticamente quando o limite de retenÃ§Ã£o for atingido.
- [x] **Modo PortÃ¡til (Portable Mode)**: OpÃ§Ã£o de salvar todos os backups e arquivos de configuraÃ§Ã£o na prÃ³pria pasta do executÃ¡vel (permitindo colocar o Luducard em um pendrive/HD externo e levÃ¡-lo com vocÃª).
- [x] **Backup de ConfiguraÃ§Ãµes do Jogo**: Muitas vezes as configuraÃ§Ãµes grÃ¡ficas, controles e Ã¡udio ficam em pastas diferentes dos saves (ex: arquivos `.ini`/`.cfg` em Documents ou AppData). Ter opÃ§Ãµes para escanear e salvar esses metadados adicionais.
- [x] **Perfis de Saves (Modding e Campanhas Paralelas)**: Permitir criar "perfis" diferentes para o mesmo jogo. Ãštil para separar gameplay com mods de uma campanha limpa (vanilla), ou para jogos de personagem Ãºnico. O app troca os arquivos da pasta ativa dependendo do perfil selecionado.
- [x] **Assistente de Conflitos Visual**: Se a nuvem detectar arquivos diferentes entre o PC local e o notebook, exibir uma tela lado a lado comparando as versÃµes com badges claras (ex: *"Este PC (Mais antigo - 10MB)"* vs *"Nuvem (Mais recente - 12MB)"*) para que o usuÃ¡rio decida qual progresso manter.

- [ ] **Icone do app borrado em baixa qualidade**:
- [ ] **adicionar discord na pagina de suporte**:

### Bloco D: Compartilhamento e Recursos ComunitÃ¡rios
- [x] **ExportaÃ§Ã£o RÃ¡pida para Compartilhamento (Share Save)**: BotÃ£o para compactar o save atual em um formato prÃ³prio (ex: `.luducard`) ou gerar um link na nuvem para facilitar o envio para amigos ou fÃ³runs.
- [x] **RepositÃ³rio ComunitÃ¡rio de "Checkpoints"**: Uma nova aba integrada para upload e download de saves em marcos histÃ³ricos de jogos (ex: *"Antes do boss final"*, *"Jogo 100% liberado"*, *"Pular tutorial"*). O app instala o save baixado automaticamente com um clique.
ðŸ“¦ CompressÃ£o Brutal (Rust Ã© mestre nisso)
Saves de jogos sÃ£o, em sua grande maioria, linhas de texto ou dados binÃ¡rios repetitivos. Eles sÃ£o o tipo de arquivo mais fÃ¡cil de compactar no mundo.

Usando algoritmos modernos em Rust (como zstd ou lzma), uma pasta de save de 500 MB pode facilmente encolher para 20 MB ou 30 MB em um arquivo .zip altamente compactado.

colocar um limite total temporario para nao exeder os 10gb gratis do R2, no futuro podemos tirar esse limite.

ðŸ›‘ LimitaÃ§Ã£o por Checkpoint (Nada de pastas inteiras)
O usuÃ¡rio nÃ£o vai compartilhar a pasta inteira com 50 versÃµes do jogo dele na aba pÃºblica. O app deve exigir que ele selecione um Ãºnico arquivo de progresso especÃ­fico (o save slot atual).

Um save individual de Elden Ring tem cerca de 36 MB. O de Cyberpunk 2077 tem uns 6 MB. O de Metro Exodus tem menos de 5 MB. O tamanho mÃ©dio por upload comunitÃ¡rio cai de gigabytes para mÃ­seros megabytes.

â³ Validade dos Saves (Auto-Delete)
Saves compartilhados na comunidade nÃ£o precisam ser eternos. VocÃª pode programar o banco de dados para fazer uma faxina automÃ¡tica:

Saves que nÃ£o receberam nenhum download nos Ãºltimos 90 dias sÃ£o deletados automaticamente do servidor para liberar espaÃ§o para novos arquivos.

ðŸ›¡ï¸ Quota Estrita por UsuÃ¡rio
Para evitar que robÃ´s ou usuÃ¡rios mal-intencionados flodem o seu servidor, vocÃª pode criar uma trava simples integrada com a ID do usuÃ¡rio (ou conta do GitHub/Discord se houver login): Cada usuÃ¡rio sÃ³ pode ter, no mÃ¡ximo, 3 ou 5 saves pÃºblicos ativos ao mesmo tempo. Se ele quiser postar um novo, terÃ¡ que apagar um antigo.

ðŸš¨ Alerta de SeguranÃ§a CrÃ­tico para o App Final (ProduÃ§Ã£o)
Como o Luducard Ã© um aplicativo de desktop que os usuÃ¡rios vÃ£o baixar para rodar em suas mÃ¡quinas, vocÃª nunca deve embutir essas chaves master dentro do cÃ³digo final do app.

Se vocÃª colocar seu SECRET_ACCESS_KEY dentro do executÃ¡vel, um usuÃ¡rio mal-intencionado pode abrir o .exe em um descompilador, roubar a sua chave e apagar todos os arquivos do seu Cloudflare.

Como o app final vai fazer o upload/download sem a chave?
O padrÃ£o da indÃºstria para softwares de desktop Ã© usar URLs PrÃ©-Assinadas (Presigned URLs):

Quando o usuÃ¡rio do Luducard quiser subir um save, o seu app faz uma requisiÃ§Ã£o para o seu banco de dados seguro na nuvem (Supabase) pedindo permissÃ£o.

O seu backend (que estÃ¡ protegido na nuvem) gera um link temporÃ¡rio especial do Cloudflare que dura apenas 5 minutos e serve para upar sÃ³ aquele arquivo especÃ­fico.

O Supabase devolve esse link para o app em Rust.

O app em Rust faz o upload usando esse link temporÃ¡rio.

Dessa forma, o seu aplicativo fica 100% seguro, leve, e nenhuma senha master sua fica exposta no PC dos jogadores! Deu para entender essa lÃ³gica de seguranÃ§a?



### Bloco E: Ferramentas e UX do Jogador
- [x] **Atalho Global de EmergÃªncia (Quick-Save Manual)**: Atalho customizÃ¡vel (ex: `Ctrl` + `Shift` + `S`) que faz backup instantÃ¢neo do jogo em primeiro plano sem precisar de Alt+Tab (um "Save State" nativo para PC) colocar um toggle nas configuraÃ§~eos para ativar desativar isso e para mudar a tecla de atalho. e quando o save funcionar mostrar uma notificaÃ§Ã£o no windows que o jogo foi salvo com um som bem sutil de notificaÃ§Ã£o, tipo da steam.
- [x] **Notas de Campanha (O "DiÃ¡rio de Bordo")**: Um campo de texto simples dentro do card de cada jogo para anotaÃ§Ãµes rÃ¡pidas sobre o progresso (ex: *"Parei logo apÃ³s derrotar o Boss X. PrÃ³ximo passo: build de mago e explorar Ã¡rea oeste"*).

### Bloco F: LocalizaÃ§Ã£o e Idiomas
- [x] **Suporte Multi-idioma**: TraduÃ§Ã£o completa da interface para mÃºltiplos idiomas (PortuguÃªs, InglÃªs, Espanhol, Russo, Chines simplificado).
- [x] **IntegraÃ§Ã£o com Fluent**: Conectar com os arquivos de traduÃ§Ã£o baseados em Fluent (`.ftl`) herdados da biblioteca nÃºcleo do Ludosavi para manter consistÃªncia sem redobrar o trabalho de localizaÃ§Ã£o.

---

- [x] **Seletor de cloud** se o Cloud sync estiver ativo, No "fazer backup" colocar uma flechinha pra selecionar backup local ou cloud


- [x] **Sistema de compartilhar Presets**
  Uma nova aba e funcionalidade integrada ao card do jogo para gerenciamento de configuraÃ§Ãµes otimizadas (`.ini`, `.cfg` etc.).
  
  1. **O Fluxo de SeguranÃ§a (O "Seguro-Crash")**:
     - Quando o usuÃ¡rio clica em "Aplicar ConfiguraÃ§Ã£o Otimizada", o Luducard automaticamente faz um backup da configuraÃ§Ã£o original atual do usuÃ¡rio.
     - Se o jogo der problema, um botÃ£o de "Desfazer e Voltar ao Original" restaura tudo instantaneamente.
  
  2. **Origem dos Arquivos**:
     - *Curadoria Oficial*: Presets oficiais obtidos do PCGamingWiki ou canais de benchmarking.
     - *Crowdsourcing*: UsuÃ¡rios do app podem criar e publicar suas configuraÃ§Ãµes personalizadas. O app captura e anexa o hardware do criador (**CPU, GPU e RAM**) para servir de base.
  
  3. **Sistema de VotaÃ§Ã£o (OpÃ§Ã£o A) e SeguranÃ§a**:
     - *Votos de EficÃ¡cia (ðŸ‘/ðŸ‘Ž)*: Pergunta simples: *"Melhorou a performance?"*. Exibe a porcentagem de aprovaÃ§Ã£o (ex: 92%). Presets com baixa aprovaÃ§Ã£o descem na busca.
     - *DenÃºncia (ðŸš¨ Report)*: BotÃ£o discreto para sinalizar presets quebrados ou maliciosos. Se acumular 3 ou mais reports, o preset Ã© ocultado automaticamente da comunidade para moderaÃ§Ã£o.
  
  4. **Fluxo de CriaÃ§Ã£o do Preset pelo UsuÃ¡rio**:
     - O jogador entra no jogo, ajusta os grÃ¡ficos e controles no menu do jogo e depois o fecha.
     - No Luducard, ele clica em *"Salvar ConfiguraÃ§Ã£o Atual como Preset"*.
     - O app detecta automaticamente os arquivos de configuraÃ§Ã£o do jogo (usando o mapeamento do banco do Ludosavi), copia-os localmente e permite que o usuÃ¡rio dÃª um nome, selecione tags (ex: *Performance*, *Balanced*), adicione uma descriÃ§Ã£o e confirme suas especificaÃ§Ãµes de hardware (capturadas via backend Rust).
  
  5. **ðŸ–¥ï¸ Visual e InteraÃ§Ãµes**:
     - **Detalhes de Saves Locais**: Permitir clicar nos cards da timeline local para abrir um modal detalhado, contendo uma Ã¡rea de texto editÃ¡vel para *"Notas de Campanha / Progresso"* salvas localmente no `luducard.json`.
     - **Save Share Hub**: Cards clicÃ¡veis para exibir descriÃ§Ã£o completa (sem quebras bruscas), tags fixas com tooltips explicando cada uma (ex: `100%`, `DLC1` etc.) e specs de hardware.
     - **Aba de Apoio ao Projeto (`/support`)**: Adicionar um novo item de navegaÃ§Ã£o lateral para uma pÃ¡gina dedicada de apoio financeiro, explicando os custos de infraestrutura de nuvem (R2, banco de dados Supabase) e fornecendo botÃµes de apoio via Itch.io e PIX (via QR code ou link).


  6. **ðŸ›¡ï¸ Medidas de SeguranÃ§a para o CÃ³digo Open Source**:
     - *ProteÃ§Ã£o do Cloud R2 contra abuse*: Validar as cotas de armazenamento na Supabase Edge Function `get-upload-url` antes de emitir o link de upload para o cliente, impedindo uploads fantasmas de usuÃ¡rios mal-intencionados.
     - *Anonymous Auth*: Utilizar autenticaÃ§Ã£o anÃ´nima do Supabase para assinar os tokens JWT do cliente e evitar falsificaÃ§Ã£o do `user_uuid` no controle de cotas de upload.
     - *Ciclo de Vida do R2*: Configurar regras de exclusÃ£o automÃ¡tica no Cloudflare R2 para limpar arquivos abandonados.


      ðŸŸ¥ Preset Potato Mode (Para PCs Ultra-Antigos): Reduz tudo ao mÃ­nimo do mÃ­nimo, desativa sombras complexas e otimiza a memÃ³ria para rodar em qualquer mÃ¡quina.

      InformaÃ§Ãµes Ãšteis por Preset: Cada perfil mostraria uma descriÃ§Ã£o curta do autor: "Ganha cerca de 15% de FPS na cidade. Testado na versÃ£o 1.63 do jogo."

      BotÃ£o "Injetar ConfiguraÃ§Ã£o": Um clique e o app substitui os arquivos locais.

## ðŸ” 5. DetecÃ§Ã£o AutomÃ¡tica de Jogos de Emuladores (Conceito)

> [!NOTE]
> A ideia Ã© permitir que o aplicativo identifique e gerencie individualmente o save de cada jogo emulado (Yuzu, Ryujinx, Dolphin, RetroArch, etc.) em vez de fazer o backup genÃ©rico da pasta inteira do emulador.

### Como funcionarÃ¡ a arquitetura:
- [x] **Fluxo de AdiÃ§Ã£o**: O usuÃ¡rio aponta para a pasta do emulador (ou seleciona o executÃ¡vel do emulador). O app identifica o emulador pelo nome do executÃ¡vel (ex: `yuzu.exe`, `Ryujinx.exe`, `dolphin.exe`, `pcsx2.exe`, `retroarch.exe`, `mgba.exe`, `citra-qt.exe`).
- [x] **LocalizaÃ§Ã£o Inteligente de Saves**:
  - Tenta localizar a pasta de saves na pasta do emulador (caso esteja em Modo PortÃ¡til, ex: pasta `user/nand/` no Yuzu ou `portable/bis/` no Ryujinx).
  - Caso contrÃ¡rio, usa os caminhos padrÃ£o do sistema de arquivos (`%APPDATA%`, `%USERPROFILE%/Documents`, etc.).
- [x] **DiferenciaÃ§Ã£o por Tipo de Save**:
  - **Sistemas por Title ID (Switch, 3DS, Wii)**: Varre subpastas buscando IDs hexadecimais de 16 caracteres (ex: `01007ef00011e000`). Converte esses IDs para nomes amigÃ¡veis usando um dicionÃ¡rio local de jogos populares ou uma API de fallback.
  - **Sistemas por Nome de ROM (GBA, PS2, RetroArch)**: LÃª os arquivos de save diretamente (ex: `Pokemon FireRed.sav`, `Silent Hill 2.ps2`). O prÃ³prio nome do arquivo (sem extensÃ£o) Ã© usado como o nome amigÃ¡vel do jogo.
- [x] **IntegraÃ§Ã£o via Custom Games (Ludosavi)**:
  - Cada jogo detectado Ã© cadastrado dinamicamente como um `CustomGame` no arquivo `config.yaml` do Ludosavi, sob a nomenclatura `[Emulador] Nome do Jogo` (ex: `[Yuzu] The Legend of Zelda: Tears of the Kingdom`).
  - Permite que o Luducard use a mesma engine robusta de backup, restauraÃ§Ã£o, cloud sync, notas e monitoramento para os jogos emulados.
- [x] **Badges TemÃ¡ticas Premium**:
  - MantÃ©m a classificaÃ§Ã£o de plataforma como `"Emulador"` para agrupamento e filtros de biblioteca.
  - Adiciona o campo `emulator` (ex: `"Yuzu"`, `"Ryujinx"`, `"Dolphin"`) ao `FrontendGame`.
  - Exibe badges customizadas com as cores caracterÃ­sticas de cada marca (ex: ðŸ”´ Yuzu, ðŸ”µ Ryujinx, ðŸ¬ Dolphin, ðŸŸ£ mGBA, ðŸŽ® RetroArch) na interface.

## ðŸ‘‘ 4. Ãrea Administrativa (Painel Admin)

- [x] **Painel de Controle Admin**: Uma tela ou modal oculto/protegido por senha nas configuraÃ§Ãµes para gerenciamento da infraestrutura.
- [x] **Gerenciamento de ConteÃºdo**: Listagem e opÃ§Ã£o de deletar diretamente do Supabase/R2 saves e presets que estejam corrompidos, ofensivos ou com erros.
- [x] **Monitoramento de Quota R2**: ExibiÃ§Ã£o da cota e espaÃ§o restante no Cloudflare R2 (gratuito de 10 GB) com mÃ©tricas de uso em tempo real.
- [x] **HistÃ³rico e Logs**: Rastreamento de uploads suspeitos e aÃ§Ãµes para banimento de UUIDs abusivos.
