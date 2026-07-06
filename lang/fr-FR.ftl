ludusavi = Ludusavi
language = Langue
game-name = Nom
total-games = Jeux
file-size = Taille
file-location = Emplacement
overall = GÃ©nÃ©ral
status = Statut
cli-unrecognized-games = Pas d'informations pour ces jeux :
cli-unable-to-request-confirmation = Demande de confirmation impossible.
    .winpty-workaround = Si vous utilisez un Ã©mulateur Bash (comme Git Bash), essayez de lancer winpty.
cli-backup-id-with-multiple-games = Impossible de spÃ©cifier l'ID de sauvegarde lors de la restauration de plusieurs jeux.
cli-invalid-backup-id = ID de sauvegarde invalide.
badge-failed = Ã‰CHEC
badge-duplicates = DOUBLONS
badge-duplicated = DOUBLON
badge-ignored = IGNORÃ‰
badge-redirected-from = DE : { $path }
badge-redirecting-to = VERS : { $path }
some-entries-failed = Certaines entrÃ©es n'ont pas pu Ãªtre traitÃ©es, recherchez { badge-failed } dans la sortie pour plus de dÃ©tails. VÃ©rifiez si vous pouvez accÃ©der Ã  ces fichiers ou si leurs chemins sont trÃ¨s longs.
cli-game-line-item-redirected = RedirigÃ© depuis : { $path }
cli-game-line-item-redirecting = RedirigÃ© vers : { $path }
button-backup = Sauvegarder
button-preview = AperÃ§u
button-restore = Restaurer
button-nav-backup = MODE DE SAUVEGARDE
button-nav-restore = MODE DE RESTAURATION
button-nav-custom-games = JEUX PERSONNALISÃ‰S
button-nav-other = AUTRE
button-add-game = Ajouter un jeu
button-continue = Continuer
button-cancel = Annuler
button-cancelling = Annulation...
button-okay = Ok
button-select-all = SÃ©lectionner tout
button-deselect-all = DÃ©sÃ©lectionner tout
button-enable-all = Activer tout
button-disable-all = DÃ©sactiver tout
button-customize = Personnaliser
button-exit = Quitter
button-comment = Commentaire
button-lock = Verrouiller
button-unlock = DÃ©verrouiller
# This opens a download page.
button-get-app = Obtenir { $app }
button-validate = Valider
button-override-manifest = Remplacer le manifeste
button-extend-manifest = Ã‰tendre le manifeste
button-sort = Trier
button-download = TÃ©lÃ©charger
button-upload = TÃ©lÃ©verser
button-ignore = Ignorer
no-roots-are-configured = Ajoutez quelques dossiers pour sauvegarder encore plus de donnÃ©es.
config-is-invalid = Erreur : Le fichier de configuration est invalide.
manifest-is-invalid = Erreur : Le manifeste est invalide.
manifest-cannot-be-updated = Erreur : Impossible de vÃ©rifier la mise Ã  jour du manifeste. Votre connexion Internet est-elle interrompue ?
cannot-prepare-backup-target = Erreur : Impossible de prÃ©parer la cible de sauvegarde (crÃ©ation ou vidage du dossier). Si vous avez le dossier ouvert dans votre explorateur de fichiers, essayez de le fermer : { $path }
restoration-source-is-invalid = Erreur : La source de restauration est invalide (soit elle n'existe pas, soit ce n'est pas un rÃ©pertoire). Veuillez vÃ©rifier l'emplacement : { $path }
registry-issue = Erreur : Certaines entrÃ©es du registre ont Ã©tÃ© ignorÃ©es.
unable-to-browse-file-system = Erreur : Impossible de naviguer dans votre systÃ¨me.
unable-to-open-directory = Erreur : Impossible d'ouvrir le rÃ©pertoire :
unable-to-open-url = Erreur : Impossible dâ€™ouvrir l'URL :
unable-to-configure-cloud = Impossible de configurer le cloud.
unable-to-synchronize-with-cloud = Impossible de synchroniser avec le cloud.
cloud-synchronize-conflict = Vos sauvegardes locales et dans le cloud sont en conflit. Effectuez un chargement vers le cloud ou un tÃ©lÃ©chargement pour rÃ©soudre ce problÃ¨me.
command-unlaunched = La commande n'a pas Ã©tÃ© lancÃ©e : { $command }
command-terminated = Commande interrompue brusquement : { $command }
command-failed = Ã‰chec de la commande avec le code { $code }: { $command }
processed-games =
    { $total-games } { $total-games ->
        [one] jeu
       *[other] jeux
    }
processed-games-subset =
    { $processed-games } sur { $total-games } { $total-games ->
        [one] jeu
       *[other] jeux
    }
processed-size-subset = { $processed-size } sur { $total-size }
field-backup-target = Sauvegarder vers :
field-restore-source = Restaurer depuis :
field-custom-files = Chemins :
field-custom-registry = Registre :
field-sort = Trier :
field-redirect-source =
    .placeholder = Source (Localisation d'origine)
field-redirect-target =
    .placeholder = Destination (Nouvelle localisation)
field-roots = Dossiers :
field-backup-excluded-items = Exclusions de sauvegarde :
field-redirects = Redirections :
# This appears next to the number of full backups that you'd like to keep.
# A full backup includes all save files for a game.
field-retention-full = Plein :
# This appears next to the number of differential backups that you'd like to keep.
# A differential backup includes only the files that have changed since the last full backup.
field-retention-differential = DiffÃ©rentielle :
field-backup-format = Format :
field-backup-compression = Compression :
# The compression level determines how much compresison we perform.
field-backup-compression-level = Niveau :
label-manifest = Manifeste
# This shows the time when we checked for an update to the manifest.
label-checked = VÃ©rifier
# This shows the time when we found an update to the manifest.
label-updated = Mis Ã  jour
label-new = Nouveau
label-removed = RetirÃ©
label-comment = Commentaire
label-unchanged = InchangÃ©
label-backup = Sauvegarde
label-scan = Analyse
label-filter = Filtre
label-unique = Unique
label-complete = TerminÃ©
label-partial = Partiel
label-enabled = ActivÃ©
label-disabled = DÃ©sactivÃ©
# https://en.wikipedia.org/wiki/Thread_(computing)
label-threads = Threads
label-cloud = Cloud
# A "remote" is what Rclone calls cloud systems like Google Drive.
label-remote = Distant
label-remote-name = Nom distant
label-folder = Dossier
# An executable file
label-executable = ExÃ©cutable
# Options given to a command line program
label-arguments = Arguments
label-url = URL
# https://en.wikipedia.org/wiki/Host_(network)
label-host = HÃ´te
# https://en.wikipedia.org/wiki/Port_(computer_networking)
label-port = Port
label-username = Nom dâ€™utilisateur
label-password = Mot de passe
# This is a specific website or service that provides some cloud functionality.
# For example, Nextcloud and Owncloud are providers of WebDAV services.
label-provider = Fournisseur
label-custom = PersonnalisÃ©
label-none = Aucun
label-change-count = Modifications : { $total }
label-unscanned = Non scannÃ©
# This refers to a local file on the computer
label-file = Fichier
label-game = Jeu
# Aliases are alternative titles for the same game.
label-alias = Alias
label-original-name = Nom d'origine
# Which manifest a game's data came from
label-source = Source
# This refers to the main Ludusavi manifest: https://github.com/mtkennerly/ludusavi-manifest
label-primary-manifest = Manifeste principal
# This refers to how we integrate a custom game with the manifest data.
label-integration = IntÃ©gration
# This is a folder name where a specific game is installed
label-installed-name = Nom de l'installation
store-ea = EA
store-epic = Epic Games
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
store-other-home = Dossier personnel
# This would be a folder acting as a virtual C: drive, created by Wine.
store-other-wine = PrÃ©fixe Wine
# This would be a folder with typical Windows system folders,
# like "Program Files (x86)" and "Users".
store-other-windows = Disque Windows
# This would be a folder with typical Linux system folders,
# like "home" and "opt".
store-other-linux = Disque Linux
# This would be a folder with typical Mac system folders,
# like "Applications" and "Users".
store-other-mac = Disque Mac
store-other = Autres
backup-format-simple = Simple
backup-format-zip = Zip
compression-none = Aucun
# "Deflate" is a proper noun: https://en.wikipedia.org/wiki/Deflate
compression-deflate = Deflate
compression-bzip2 = Bzip2
compression-zstd = Zstd
theme = ThÃ¨me
theme-light = Clair
theme-dark = Sombre
redirect-bidirectional = Mode bidirectionnel
reverse-redirects-when-restoring = Inverser la sÃ©quence des redirections lors de la restauration
show-disabled-games = Afficher les jeux dÃ©sactivÃ©s
show-unchanged-games = Afficher les jeux non modifiÃ©s
show-unscanned-games = Afficher les jeux non scannÃ©s
override-max-threads = Outrepasser les threads max
synchronize-automatically = Synchroniser automatiquement
prefer-alias-display = Afficher l'alias au lieu du nom d'origine
skip-unconstructive-backups = Ignorer la sauvegarde quand les donnÃ©es seront supprimÃ©es, mais pas ajoutÃ©es ou mises Ã  jour
explanation-for-exclude-store-screenshots = Dans les sauvegardes, excluez les captures d'Ã©cran spÃ©cifiques Ã  la boutique
explanation-for-exclude-cloud-games = Ne pas sauvegarder les jeux avec la prise en charge du cloud sur ces plateformes
consider-doing-a-preview = Si vous ne l'avez pas dÃ©jÃ  fait, pensez d'abord Ã  faire un aperÃ§u afin qu'il n'y ait pas de surprises.
confirm-backup =
    ÃŠtes-vous sÃ»r de vouloir procÃ©der Ã  la sauvegarde ? { $path-action ->
        [merge] Les nouvelles donnÃ©es de sauvegarde seront fusionnÃ©es dans le dossier cible :
       *[create] Le dossier cible sera crÃ©Ã© :
    }
confirm-restore =
    ÃŠtes-vous sÃ»r de vouloir procÃ©der Ã  la restauration ?
    Cela Ã©crasera tous les fichiers actuels avec les sauvegardes ici :
confirm-cloud-upload =
    Voulez-vous remplacer vos fichiers cloud par vos fichiers locaux ?
    Vos fichiers cloud ({ $cloud-path }) deviendront une copie exacte de vos fichiers locaux ({ $local-path }).
    Les fichiers dans le cloud seront mis Ã  jour ou supprimÃ©s si nÃ©cessaire.
confirm-cloud-download =
    Voulez-vous remplacer vos fichiers locaux par vos fichiers cloud ?
    Vos fichiers locaux ({ $local-path }) deviendront une copie exacte de vos fichiers cloud ({ $cloud-path }).
    Les fichiers locaux seront mis Ã  jour ou supprimÃ©s si nÃ©cessaire.
confirm-add-missing-roots = Ajouter ces dossiers ?
no-missing-roots = Aucun dossier supplÃ©mentaire trouvÃ©.
loading = Chargement...
preparing-backup-target = PrÃ©paration du rÃ©pertoire de sauvegarde...
updating-manifest = Mise Ã  jour du manifeste...
no-cloud-changes = Aucun changement Ã  synchroniser
backups-are-valid = Vos sauvegardes sont valides.
backups-are-invalid =
    Les sauvegardes de ces jeux semblent Ãªtre invalides.
    Voulez-vous crÃ©er de nouvelles sauvegardes complÃ¨tes pour ces jeux ?
saves-found = DonnÃ©es de sauvegarde trouvÃ©e.
no-saves-found = Aucune donnÃ©e de sauvegarde trouvÃ©e.
# This is tacked on to form something like "Back up (no confirmation)",
# meaning we would perform an action without asking the user if they're sure.
suffix-no-confirmation = sans confirmation
# This is shown when a setting will only take effect after closing and reopening Ludusavi.
suffix-restart-required = RedÃ©marrage nÃ©cessaire
prefix-error = Erreur : { $message }
prefix-warning = Attention : { $message }
cloud-app-unavailable = Les sauvegardes dans le cloud sont dÃ©sactivÃ©es car { $app } n'est pas disponible.
cloud-not-configured = Les sauvegardes dans le cloud sont dÃ©sactivÃ©es car aucun systÃ¨me cloud n'est configurÃ©.
cloud-path-invalid = Les sauvegardes dans le cloud sont dÃ©sactivÃ©es car le chemin de sauvegarde est invalide.
game-is-unrecognized = Ludusavi ne reconnaÃ®t pas ce jeu.
game-has-nothing-to-restore = Ce jeu n'a pas de sauvegarde Ã  restaurer.
launch-game-after-error = Lancez le jeu quand mÃªme ?
game-did-not-launch = Ã‰chec du lancement du jeu.
backup-is-newer-than-current-data = La sauvegarde existante est plus rÃ©cente que les donnÃ©es actuelles.
backup-is-older-than-current-data = La sauvegarde existante est plus ancienne que les donnÃ©es actuelles.
back-up-specific-game =
    .confirm = Sauvegarder les donnÃ©es pour { $game } ?
    .failed = Ã‰chec de la sauvegarde des donnÃ©es pour { $game }
restore-specific-game =
    .confirm = Restaurer les donnÃ©es de sauvegarde pour { $game } ?
    .failed = Ã‰chec de la restauration des donnÃ©es de sauvegarde pour { $game }
new-version-check = VÃ©rifier automatiquement les mises Ã  jour de l'application
new-version-available = Une mise Ã  jour de l'application est disponible : { $version }. Souhaitez-vous voir les notes de version ?
custom-game-will-override = Ce jeu personnalisÃ© remplace une entrÃ©e du manifeste
custom-game-will-extend = Ce jeu personnalisÃ© Ã©tend une entrÃ©e du manifeste
operation-will-only-include-listed-games = Cette opÃ©ration ne traitera que les jeux qui sont actuellement rÃ©pertoriÃ©s
