import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  ArrowUpToLine,
  ArrowDownToLine,
  Cloud,
  CloudOff,
  FolderOpen,
  RotateCcw,
  Trash2,
  Clock,
  Zap,
  HardDrive,
  Copy,
  Folder,
  FolderSync,
  Package,
  Pin,
  Share2,
  FileArchive,
  X,
  SlidersHorizontal,
  Cpu,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Sparkles,
  Check,
  Info,
  RefreshCw,
  Download,
  Gamepad2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { PlatformBadge } from "@/components/platform-badge"
import { cn } from "@/lib/utils"
import { type Game, type BackupKind, formatSize } from "@/lib/mock-data"
import { cleanGameTitle } from "@/components/dashboard/library-client"
import { ConflictResolutionModal } from "../cloud/conflict-resolution-modal"
import { useLibrary } from "@/lib/library-context"
import {
  ANONYMOUS_AUTHOR_ID,
  getAuthorLabel,
  getBackupKindLabel,
  getPredefinedPresetTags,
} from "@/lib/preset-tags"
import { fetchHubRows, describeHubError, type HubFetchError } from "@/lib/hub-fetch"

const kindColors: Record<BackupKind | string, string> = {
  "Automático": "text-primary",
  Manual: "text-sky-300",
  "Antes de fechar": "text-amber-300",
  "Restauração": "text-violet-300",
}

const isTauri = typeof window !== "undefined" && (window as any).__TAURI_INTERNALS__ !== undefined;

function StatusPill({
  active,
  label,
  onIcon: OnIcon,
  offIcon: OffIcon,
}: {
  active: boolean
  label: string
  onIcon: typeof Cloud
  offIcon: typeof CloudOff
}) {
  const { t } = useI18n()
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2.5">
      <span className="flex items-center gap-2 text-sm">
        {active ? (
          <OnIcon className="size-4 text-primary" />
        ) : (
          <OffIcon className="size-4 text-muted-foreground" />
        )}
        {label}
      </span>
      <span
        className={cn(
          "text-xs font-medium",
          active ? "text-primary" : "text-muted-foreground",
        )}
      >
        {active ? t("luducard-active", "Active") : t("luducard-disabled", "Disabled")}
      </span>
    </div>
  )
}

interface GameDetailClientProps {
  game: Game
  onRefresh?: () => void
}

export function GameDetailClient({ game, onRefresh }: GameDetailClientProps) {
  const { t } = useI18n()
  const { updateGameNotes } = useLibrary()

  const PREDEFINED_PRESET_TAGS = getPredefinedPresetTags(t)
  const authorLabel = (name?: string | null) => getAuthorLabel(t, name)
  const backupKindLabel = (kind: string) => getBackupKindLabel(t, kind)

  // Tabs & safety backup check
  const [activeTab, setActiveTab] = useState<"saves" | "presets" | "profiles">("saves")
  const [hasCrashSafetyBackup, setHasCrashSafetyBackup] = useState(false)

  const [conflictModalOpen, setConflictModalOpen] = useState(false)
  const [conflictInfo, setConflictInfo] = useState<any>(null)

  // Campaign notes state
  const [localNotes, setLocalNotes] = useState(game.notes || "")

  useEffect(() => {
    setLocalNotes(game.notes || "")
  }, [game.id])

  const saveNotes = async () => {
    if (localNotes === (game.notes || "")) return;
    if (isTauri) {
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        await invoke("save_campaign_note", { gameId: game.id, note: localNotes });
      } catch (err) {
        toast.error(`${t("luducard-toast-save-note-failed", "Failed to save note")}: ${err}`);
        return;
      }
    }
    updateGameNotes(game.id, localNotes);
  };

  // Save Profiles states
  const [saveProfiles, setSaveProfiles] = useState<any[]>([])
  const [loadingProfiles, setLoadingProfiles] = useState(false)
  const [isCreateProfileModalOpen, setIsCreateProfileModalOpen] = useState(false)
  const [newProfileTitle, setNewProfileTitle] = useState("")
  const [newProfileDesc, setNewProfileDesc] = useState("")
  const [cloneCurrentSaves, setCloneCurrentSaves] = useState(true)
  const [switchingProfileId, setSwitchingProfileId] = useState<string | null>(null)

  // Presets states
  const [presets, setPresets] = useState<any[]>([])
  const [loadingPresets, setLoadingPresets] = useState(false)
  /** Non-null when the last load failed, so an outage never renders as "no presets". */
  const [presetsError, setPresetsError] = useState<HubFetchError | null>(null)
  const [clientUuid, setClientUuid] = useState("")
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("")
  const [isConfigured, setIsConfigured] = useState(false)

  // Local Presets states
  const [localPresets, setLocalPresets] = useState<any[]>([])
  const [presetSubTab, setPresetSubTab] = useState<"local" | "community">("local")
  const [isCreateLocalPresetModalOpen, setIsCreateLocalPresetModalOpen] = useState(false)
  const [selectedLocalPresetForShare, setSelectedLocalPresetForShare] = useState<any | null>(null)
  const [importingPreset, setImportingPreset] = useState<string | null>(null)
  const [selectedDetailPreset, setSelectedDetailPreset] = useState<any | null>(null)
  
  // Create Local Preset Form State
  const [newLocalTitle, setNewLocalTitle] = useState("")
  const [newLocalDesc, setNewLocalDesc] = useState("")

  // Share Preset Modal state
  const [isSharePresetModalOpen, setIsSharePresetModalOpen] = useState(false)
  const [configFiles, setConfigFiles] = useState<string[]>([])
  const [selectedConfigFiles, setSelectedConfigFiles] = useState<string[]>([])
  const [loadingHardware, setLoadingHardware] = useState(false)
  const [loadingConfigs, setLoadingConfigs] = useState(false)

  // Share Preset Form
  const [presetTitle, setPresetTitle] = useState("")
  const [presetDesc, setPresetDesc] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [cpu, setCpu] = useState("")
  const [gpu, setGpu] = useState("")
  const [ram, setRam] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [publishing, setPublishing] = useState(false)

  // Local Save Detail Modal State
  const [selectedLocalBackup, setSelectedLocalBackup] = useState<any | null>(null)
  const [localNote, setLocalNote] = useState("")

  const handleOpenLocalBackupModal = (b: any) => {
    setSelectedLocalBackup(b)
    setLocalNote(b.note || "")
  }

  const handleSaveNote = async () => {
    if (!selectedLocalBackup) return
    const id = toast.loading("Salvando nota do backup...")
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      await invoke("save_backup_note", {
        gameId: game.id,
        backupId: selectedLocalBackup.id,
        note: localNote,
      })
      toast.success("Nota salva com sucesso!", { id })
      setSelectedLocalBackup(null)
      if (onRefresh) onRefresh()
    } catch (err) {
      toast.error(`${t("luducard-toast-save-note-failed-2", "Failed to save note")}: ${err}`, { id })
    }
  }

  function copyPath() {
    navigator.clipboard?.writeText(game.savePath)
    toast.success("Caminho copiado")
  }

  const handleChangeSavePath = async () => {
    if (!isTauri) {
      toast.info("[Mock] Selecionando nova pasta de save...");
      return;
    }
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      const selected = await invoke<string | null>("select_folder")
      if (selected) {
        const id = toast.loading(`Alterando caminho do save de "${game.title}"...`)
        await invoke("update_game_save_path", {
          gameTitle: game.title,
          savePath: selected,
        })
        toast.success("Caminho do save atualizado com sucesso!", { id })
        if (onRefresh) onRefresh()
      }
    } catch (err) {
      console.error(err)
      toast.error(`${t("luducard-toast-change-path-failed", "Error changing path")}: ${err}`)
    }
  }

  const handleResetSavePath = async () => {
    if (!confirm(t("luducard-confirm-reset-save-path", "Do you really want to reset this game's save path to the manifest default?"))) {
      return
    }
    const id = toast.loading(`${t("luducard-toast-restoring-default-path", "Restoring default path of")} "${game.title}"...`)
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      await invoke("reset_game_save_path", {
        gameTitle: game.title,
      })
      toast.success(t("luducard-toast-default-path-restored", "Default path restored successfully!"), { id })
      if (onRefresh) onRefresh()
    } catch (err) {
      console.error(err)
      toast.error(`${t("luducard-toast-restore-path-failed", "Error restoring path")}: ${err}`, { id })
    }
  }

  const handleBackup = async () => {
    if (isTauri) {
      const id = toast.loading(`Fazendo backup manual de "${game.title}"...`);
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        const conflict = await invoke<any>("check_cloud_conflict", { gameTitle: game.title });
        if (conflict) {
          toast.dismiss(id);
          setConflictInfo(conflict);
          setConflictModalOpen(true);
          return;
        }
        await invoke("backup_game", { gameTitle: game.title });
        toast.success(`Backup de "${game.title}" criado com sucesso!`, { id });
        if (onRefresh) onRefresh();
      } catch (err) {
        toast.error(`${t("luducard-toast-backup-failed", "Backup failed")}: ${err}`, { id });
      }
    } else {
      toast.success(`[Mock] Backup de "${game.title}" criado`);
    }
  };

  const handleResolveConflict = async (direction: "local" | "cloud") => {
    if (!conflictInfo) return;
    const title = conflictInfo.gameTitle;
    const id = toast.loading(
      direction === "local"
        ? `${t("luducard-toast-resolving-keep-local", "Resolving conflict: keeping the local version of")} "${title}"...`
        : `${t("luducard-toast-resolving-take-cloud", "Resolving conflict: downloading the cloud version of")} "${title}"...`
    );
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      if (direction === "local") {
        await invoke("backup_game", { gameTitle: title });
        toast.success(`${t("luducard-toast-local-version-saved", "Local version of")} "${title}" ${t("luducard-toast-saved-to-cloud", "saved to the cloud!")}`, { id });
      } else {
        await invoke("restore_game", { gameTitle: title, backupId: null });
        toast.success(`${t("luducard-toast-cloud-version-restored", "Cloud version of")} "${title}" ${t("luducard-toast-restored-suffix", "restored!")}`, { id });
      }
      setConflictModalOpen(false);
      setConflictInfo(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(`${t("luducard-toast-resolve-conflict-failed", "Failed to resolve conflict for")} "${title}": ${err}`, { id });
    }
  };

  const handleRestoreLatest = async () => {
    if (isTauri) {
      const id = toast.loading(`Restaurando backup mais recente de "${game.title}"...`);
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        await invoke("restore_game", { gameTitle: game.title, backupId: null });
        toast.success(`${t("luducard-toast-latest-version-restored", "Latest version of")} "${game.title}" ${t("luducard-toast-restored-suffix", "restored!")}`, { id });
        if (onRefresh) onRefresh();
      } catch (err) {
        toast.error(`${t("luducard-toast-restore-failed", "Failed to restore")}: ${err}`, { id });
      }
    } else {
      toast.info(`[Mock] Restaurando versão mais recente de "${game.title}"`);
    }
  };

  const handleRestoreVersion = async (versionId: string, versionDate: string) => {
    if (isTauri) {
      const id = toast.loading(`${t("luducard-toast-restoring-version", "Restoring version")} "${versionId}" — "${game.title}"...`);
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        await invoke("restore_game", { gameTitle: game.title, backupId: versionId });
        toast.success(`${t("luducard-toast-version-restored", "Version from")} ${versionDate} ${t("luducard-toast-restored-suffix", "restored!")}`, { id });
        if (onRefresh) onRefresh();
      } catch (err) {
        toast.error(`${t("luducard-toast-restore-version-failed", "Failed to restore version")}: ${err}`, { id });
      }
    } else {
      toast.info(`[Mock] Restaurando versão de ${versionDate}`);
    }
  };

  const handleExportBackupVersion = async (backupId: string, backupDate: string, backupTime: string) => {
    if (!isTauri) {
      toast.info(`[Mock] Exportando backup de "${game.title}" (${backupDate}) como .luducard`);
      return;
    }
    try {
      const { invoke } = await import("@tauri-apps/api/core");

      const slugName = game.id.replace(/[^a-z0-9-]/gi, "-");
      const formattedDate = backupDate.replace(/[^a-z0-9-]/gi, "-");
      const formattedTime = backupTime.replace(/[^a-z0-9-]/gi, "-");
      const destPath = await invoke<string | null>("save_luducard_dialog", {
        defaultName: `${slugName}_backup_${formattedDate}_${formattedTime}.luducard`,
      });
      if (!destPath) return;

      const toastId = toast.loading(`Compactando backup de "${game.title}"...`);
      const metadata = await invoke<any>("export_luducard_backup", {
        gameTitle: game.title,
        gameId: game.id,
        checkpointTitle: `${t("luducard-backup-of", "Backup of")} ${game.title} - ${backupDate} ${backupTime}`,
        description: `${t("luducard-exported-from-backup", "Exported from the local backup taken on")} ${backupDate} ${t("luducard-at", "at")} ${backupTime}.`,
        backupPath: game.backupPath || "",
        backupId: backupId,
        savePath: game.savePath,
        destPath: destPath,
      });

      const compressedMB = (metadata.compressedSizeBytes / (1024 * 1024)).toFixed(1);
      const originalMB = (metadata.totalSizeBytes / (1024 * 1024)).toFixed(1);
      toast.success(
        `Exportado com sucesso! ${originalMB} MB �  ${compressedMB} MB compactado`,
        { id: toastId }
      );
    } catch (err) {
      toast.error(`${t("luducard-toast-export-backup-failed", "Failed to export backup")}: ${err}`);
    }
  };

  const handleToggleLocked = async (versionId: string, currentLocked: boolean) => {
    if (isTauri) {
      const nextLocked = !currentLocked;
      const id = toast.loading(
        nextLocked
          ? `${t("luducard-toast-locking-version", "Locking version")} "${versionId}"...`
          : `${t("luducard-toast-unlocking-version", "Unlocking version")} "${versionId}"...`
      );
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        await invoke("toggle_backup_locked", {
          gameTitle: game.title,
          backupId: versionId,
          locked: nextLocked,
        });
        toast.success(
          nextLocked
            ? t("luducard-toast-version-locked", "Version locked! It will not be deleted automatically.")
            : t("luducard-toast-version-unlocked", "Version unlocked successfully."),
          { id }
        );
        if (onRefresh) onRefresh();
      } catch (err) {
        toast.error(`${t("luducard-toast-change-version-status-failed", "Failed to change version status")}: ${err}`, { id });
      }
    } else {
      toast.info(`[Mock] Alterado bloqueio da versão "${versionId}" para ${!currentLocked}`);
    }
  };

  const handleOpenFolder = async (folderType: "game" | "save" | "backup") => {
    if (!isTauri) {
      toast.info(`[Mock] Abrindo pasta de ${folderType === "game" ? "instalação" : folderType === "save" ? "saves" : "backups"} para ${game.title}`);
      return;
    }
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      await invoke("open_game_folder", {
        gameTitle: game.title,
        folderType,
        savePath: game.savePath,
      });
    } catch (err) {
      console.error(err);
      toast.error(`${t("luducard-toast-open-folder-failed", "Error opening folder")}: ${err}`);
    }
  };

  const handleExportSave = async () => {
    if (!isTauri) {
      toast.info(`[Mock] Exportando save de "${game.title}" como .luducard`);
      return;
    }
    try {
      const { invoke } = await import("@tauri-apps/api/core");

      const slugName = game.id.replace(/[^a-z0-9-]/gi, "-");
      const destPath = await invoke<string | null>("save_luducard_dialog", {
        defaultName: `${slugName}.luducard`,
      });
      if (!destPath) return;

      const toastId = toast.loading(`Compactando save de "${game.title}"...`);
      const metadata = await invoke<any>("export_luducard_save", {
        gameTitle: game.title,
        gameId: game.id,
        checkpointTitle: `Save de ${game.title}`,
        description: "",
        sourcePath: game.savePath,
        destPath: destPath,
      });

      const compressedMB = (metadata.compressedSizeBytes / (1024 * 1024)).toFixed(1);
      const originalMB = (metadata.totalSizeBytes / (1024 * 1024)).toFixed(1);
      toast.success(
        `Exportado com sucesso! ${originalMB} MB �  ${compressedMB} MB compactado`,
        { id: toastId }
      );
    } catch (err) {
      toast.error(`${t("luducard-toast-export-failed", "Failed to export")}: ${err}`);
    }
  };

  // Preset sharing database fetch
  const fetchGamePresets = async () => {
    setLoadingPresets(true)
    setPresetsError(null)
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      const settings = await invoke<any>("get_settings")
      const uuid = await invoke<string>("get_client_uuid")
      
      const url = settings.supabaseUrl || ""
      const key = settings.supabaseAnonKey || ""
      
      setSupabaseUrl(url)
      setSupabaseAnonKey(key)
      setClientUuid(uuid)

      if (url && key) {
        setIsConfigured(true)
        const result = await fetchHubRows(
          `${url}/rest/v1/public_presets?game_id=eq.${game.id}&select=*`,
          key
        )

        if (result.ok) {
          const mapped = result.rows.map((item: any) => ({
            id: item.id,
            gameName: item.game_name,
            gameId: item.game_id,
            title: item.title,
            fileName: item.file_name,
            r2Path: item.r2_path,
            fileSize: Number(item.file_size || 0),
            description: item.description || "",
            authorName: item.author_name || "",
            userUuid: item.user_uuid,
            cpu: item.cpu || "",
            gpu: item.gpu || "",
            ram: item.ram || "",
            isOfficial: item.is_official || false,
            upvotes: Number(item.upvotes || 0),
            downvotes: Number(item.downvotes || 0),
            reportsCount: Number(item.reports_count || 0),
            downloadsCount: Number(item.downloads_count || 0),
            tags: item.tags || [],
            createdAt: item.created_at
          }))
          setPresets(mapped)
        } else {
          console.error("Failed to load public_presets for game:", result.error)
          setPresets([])
          setPresetsError(result.error)
          toast.error(t("luducard-toast-load-community-presets-failed", "Error loading community presets."))
        }
      } else {
        setIsConfigured(false)
        // Load mock presets
        const { mockPresets } = await import("@/lib/mock-data")
        const gamePresets = mockPresets.filter(p => p.gameId === game.id)
        setPresets(gamePresets)
      }
    } catch (err) {
      console.error(err)
      setIsConfigured(false)
    } finally {
      setLoadingPresets(false)
    }
  }

  // Load local presets
  const fetchLocalPresets = async () => {
    if (!isTauri) {
      setLocalPresets([
        {
          id: "local-mock-1",
          gameId: game.id,
          gameTitle: game.title,
          title: "Meu Perfil - Ultra Performance",
          description: "Desativa sombras volumétricas e reduz resolução de texturas secundárias. Perfeito para manter 60fps constantes.",
          cpu: "Intel Core i5-10400F",
          gpu: "NVIDIA GeForce GTX 1660 Super",
          ram: "16 GB",
          createdAt: "2026-06-28T10:00:00Z",
          files: ["GameUserSettings.ini"]
        }
      ])
      return
    }
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      const list = await invoke<any[]>("list_local_presets", {
        gameId: game.id
      })
      setLocalPresets(list)
    } catch (err) {
      console.error("Erro ao listar presets locais:", err)
    }
  }

  const fetchSaveProfiles = async () => {
    if (!isTauri) {
      // Mock save profiles for development preview
      setSaveProfiles([
        {
          id: "mock-1",
          gameId: game.id,
          title: "Campanha Vanilla",
          description: "Minha primeira campanha sem modificações, progresso inicial.",
          createdAt: "2026-06-30T15:30:00Z",
          active: true
        },
        {
          id: "mock-2",
          gameId: game.id,
          title: "Modded Chaos Run",
          description: "Campanha experimental com mods de jogabilidade ativados.",
          createdAt: "2026-07-01T10:00:00Z",
          active: false
        }
      ])
      return
    }
    setLoadingProfiles(true)
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      const list = await invoke<any[]>("list_save_profiles", {
        gameId: game.id
      })
      setSaveProfiles(list)
    } catch (err) {
      console.error("Erro ao listar perfis de save:", err)
      toast.error(t("luducard-toast-load-profiles-failed", "Error loading save profiles."))
    } finally {
      setLoadingProfiles(false)
    }
  }

  const handleCreateSaveProfile = async () => {
    if (!newProfileTitle.trim()) {
      toast.error(t("luducard-toast-profile-title-required", "Please enter a title for the profile."))
      return
    }
    const toastId = toast.loading(t("luducard-toast-creating-profile", "Creating new save profile..."))
    try {
      if (isTauri) {
        const { invoke } = await import("@tauri-apps/api/core")
        await invoke("create_save_profile", {
          gameTitle: game.title,
          gameId: game.id,
          title: newProfileTitle.trim(),
          description: newProfileDesc.trim(),
          cloneCurrent: cloneCurrentSaves
        })
      }
      toast.success("Perfil de save criado com sucesso!", { id: toastId })
      setIsCreateProfileModalOpen(false)
      setNewProfileTitle("")
      setNewProfileDesc("")
      setCloneCurrentSaves(true)
      fetchSaveProfiles()
      if (onRefresh) onRefresh()
    } catch (err: any) {
      console.error(err)
      toast.error(`${t("luducard-toast-create-profile-failed", "Failed to create profile")}: ${err}`, { id: toastId })
    }
  }

  const handleSwitchSaveProfile = async (profileId: string, profileTitle: string) => {
    setSwitchingProfileId(profileId)
    const toastId = toast.loading(`${t("luducard-toast-switching-profile", "Switching to profile")} "${profileTitle}"... ${t("luducard-toast-may-take-seconds", "This may take a few seconds.")}`)
    try {
      if (isTauri) {
        const { invoke } = await import("@tauri-apps/api/core")
        await invoke("switch_save_profile", {
          gameTitle: game.title,
          gameId: game.id,
          profileId
        })
      }
      toast.success(`Perfil de save alterado para "${profileTitle}"!`, { id: toastId })
      fetchSaveProfiles()
      if (onRefresh) onRefresh()
    } catch (err: any) {
      console.error(err)
      toast.error(`${t("luducard-toast-switch-profile-failed", "Error switching profile")}: ${err}`, { id: toastId })
    } finally {
      setSwitchingProfileId(null)
    }
  }

  const handleDeleteSaveProfile = async (profileId: string, profileTitle: string) => {
    if (!confirm(`${t("luducard-confirm-delete-profile", "Are you sure you want to delete the profile")} "${profileTitle}"? ${t("luducard-confirm-delete-profile-warning", "All saves in this profile will be permanently deleted.")}`)) {
      return
    }
    const toastId = toast.loading(`${t("luducard-toast-deleting-profile", "Deleting profile")} "${profileTitle}"...`)
    try {
      if (isTauri) {
        const { invoke } = await import("@tauri-apps/api/core")
        await invoke("delete_save_profile", {
          gameId: game.id,
          profileId
        })
      }
      toast.success(`${t("luducard-toast-profile-deleted", "Profile")} "${profileTitle}" ${t("luducard-toast-deleted-suffix", "deleted successfully!")}`, { id: toastId })
      fetchSaveProfiles()
    } catch (err: any) {
      console.error(err)
      toast.error(`${t("luducard-toast-delete-profile-failed", "Error deleting profile")}: ${err}`, { id: toastId })
    }
  }

  // Load safety backup status & presets
  useEffect(() => {
    const safety = localStorage.getItem(`luducard_preset_safety_${game.id}`)
    setHasCrashSafetyBackup(safety === "true")
    if (activeTab === "presets") {
      fetchGamePresets()
      fetchLocalPresets()
    } else if (activeTab === "profiles") {
      fetchSaveProfiles()
    }
  }, [game.id, activeTab])

  // Save Local Preset
  const handleSaveLocalPreset = async (title: string, description: string, files: string[]) => {
    if (files.length === 0) {
      toast.error(t("luducard-toast-select-config-file", "Select at least one config file."))
      return
    }
    const id = toast.loading(t("luducard-toast-saving-local-preset", "Saving local settings as a preset..."))
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      if (isTauri) {
        await invoke("save_local_preset", {
          gameId: game.id,
          gameTitle: game.title,
          title,
          description,
          files,
        })
      }
      toast.success("Preset local criado com sucesso!", { id })
      fetchLocalPresets()
      setIsCreateLocalPresetModalOpen(false)
      setNewLocalTitle("")
      setNewLocalDesc("")
    } catch (err) {
      toast.error(`${t("luducard-toast-save-local-preset-failed", "Failed to save local preset")}: ${err}`, { id })
    }
  }

  // Apply Local Preset
  const handleApplyLocalPreset = async (preset: any) => {
    const id = toast.loading(`${t("luducard-toast-starting-crash-safety-for", "Starting Safe-Crash for settings of")} ${game.title}...`)
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      if (isTauri) {
        await invoke("apply_local_preset", {
          gameTitle: game.title,
          gameId: game.id,
          presetId: preset.id,
        })
        localStorage.setItem(`luducard_preset_safety_${game.id}`, "true")
        setHasCrashSafetyBackup(true)
      } else {
        await new Promise(r => setTimeout(r, 1000))
      }
      toast.success(`${t("luducard-toast-local-preset-applied", "Local preset")} "${preset.title}" ${t("luducard-toast-applied-suffix", "applied successfully!")}`, { id })
    } catch (err) {
      toast.error(`${t("luducard-toast-apply-local-preset-failed", "Failed to apply local preset")}: ${err}`, { id })
    }
  }

  // Delete Local Preset
  const handleDeleteLocalPreset = async (presetId: string) => {
    if (!confirm(t("luducard-confirm-delete-local-preset", "Do you really want to permanently delete this local preset?"))) return
    const id = toast.loading(t("luducard-toast-deleting-local-preset", "Deleting local preset..."))
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      if (isTauri) {
        await invoke("delete_local_preset", {
          gameId: game.id,
          presetId,
        })
      }
      toast.success("Preset local deletado com sucesso!", { id })
      fetchLocalPresets()
    } catch (err) {
      toast.error(`${t("luducard-toast-delete-preset-failed", "Error deleting preset")}: ${err}`, { id })
    }
  }

  // Open Share Local Preset community wizard
  const handleShareLocalPreset = (preset: any) => {
    setSelectedLocalPresetForShare(preset)
    setIsSharePresetModalOpen(true)
    setPresetTitle(preset.title)
    setPresetDesc(preset.description)
    setCpu(preset.cpu || "")
    setGpu(preset.gpu || "")
    setRam(preset.ram || "")
    setConfigFiles(preset.files || [])
    setSelectedConfigFiles(preset.files || [])
  }

  // Apply Preset (Community)
  const handleApplyPreset = async (preset: any) => {
    const toastId = toast.loading(t("luducard-toast-crash-safety-starting", "Starting Safe-Crash to safeguard settings..."))
    try {
      const { invoke } = await import("@tauri-apps/api/core")

      // Step 1: Create safety backup of configs only
      if (isTauri) {
        await invoke("create_preset_safety_backup", {
          gameTitle: game.title,
          gameId: game.id,
        })
        localStorage.setItem(`luducard_preset_safety_${game.id}`, "true")
        setHasCrashSafetyBackup(true)
      }

      toast.loading(t("luducard-toast-downloading-applying-preset", "Downloading and applying optimized settings preset..."), { id: toastId })

      // Step 2: Get download url
      let downloadUrl = ""
      if (isTauri && isConfigured) {
        const edgeRes = await fetch(`${supabaseUrl}/functions/v1/get-download-url`, {
          method: "POST",
          headers: {
            "apikey": supabaseAnonKey,
            "Authorization": `Bearer ${supabaseAnonKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ r2_path: preset.r2Path })
        })

        if (edgeRes.ok) {
          const resData = await edgeRes.json()
          downloadUrl = resData.downloadUrl
        }
      }

      // Step 3: Inject files (falls back to mock if not configured)
      if (isTauri && downloadUrl) {
        await invoke("download_and_import_luducard", {
          downloadUrl,
          targetSaveDir: game.savePath,
        })

        // Save preset metadata locally so it is registered in "Meus Presets"
        await invoke("save_local_preset", {
          gameId: game.id,
          gameTitle: game.title,
          title: preset.title,
          description: `${preset.description} (${t("luducard-preset-downloaded-from-community", "Downloaded from the community - Author")}: ${authorLabel(preset.authorName)})`,
          files: preset.tags,
        }).catch(err => console.error(err))

        // Step 4: Increment download count in Supabase
        await fetch(`${supabaseUrl}/rest/v1/rpc/increment_preset_downloads`, {
          method: "POST",
          headers: {
            "apikey": supabaseAnonKey,
            "Authorization": `Bearer ${supabaseAnonKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ preset_id: preset.id })
        })
      } else {
        // Mock download duration
        await new Promise(r => setTimeout(r, 1500))
      }

      toast.success(t("luducard-toast-community-preset-applied", "Community preset applied successfully! Saved to your local library."), { id: toastId })
      fetchGamePresets()
      fetchLocalPresets()
    } catch (err) {
      console.error(err)
      toast.error(`${t("luducard-toast-apply-preset-failed", "Failed to apply preset")}: ${err}`, { id: toastId })
    }
  }

  // Restore Original Configurations (Undo)
  const handleUndoPreset = async () => {
    const toastId = toast.loading(t("luducard-toast-restoring-crash-safety", "Restoring original config files from Safe-Crash..."))
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      if (isTauri) {
        await invoke("restore_preset_safety_backup", {
          gameId: game.id,
        })
      } else {
        await new Promise(r => setTimeout(r, 1200))
      }

      localStorage.removeItem(`luducard_preset_safety_${game.id}`)
      setHasCrashSafetyBackup(false)
      toast.success(t("luducard-toast-original-config-restored", "Original settings restored successfully! Saves untouched."), { id: toastId })
    } catch (err) {
      console.error(err)
      toast.error(`${t("luducard-toast-restore-crash-safety-failed", "Failed to restore Safe-Crash backup")}: ${err}`, { id: toastId })
    }
  }

  // Vote on Preset
  const handleVote = async (presetId: string, isUpvote: boolean) => {
    try {
      if (isConfigured) {
        await fetch(`${supabaseUrl}/rest/v1/rpc/vote_preset`, {
          method: "POST",
          headers: {
            "apikey": supabaseAnonKey,
            "Authorization": `Bearer ${supabaseAnonKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ preset_id: presetId, is_upvote: isUpvote })
        })
      }
      toast.success("Voto computado com sucesso! Obrigado.")
      
      // Update local state
      setPresets(prev => prev.map(p => {
        if (p.id === presetId) {
          return {
            ...p,
            upvotes: isUpvote ? p.upvotes + 1 : p.upvotes,
            downvotes: !isUpvote ? p.downvotes + 1 : p.downvotes
          }
        }
        return p
      }))
    } catch (err) {
      toast.error(t("luducard-toast-vote-failed", "Failed to register vote."))
    }
  }

  // Report Preset
  const handleReport = async (presetId: string) => {
    try {
      if (isConfigured) {
        await fetch(`${supabaseUrl}/rest/v1/rpc/report_preset`, {
          method: "POST",
          headers: {
            "apikey": supabaseAnonKey,
            "Authorization": `Bearer ${supabaseAnonKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ preset_id: presetId })
        })
      }
      toast.success(t("luducard-toast-report-sent-preset", "Report sent! The preset will be hidden from the community after 3 reports."))
      
      // Update local state and hide if reports count reaches 3
      setPresets(prev => prev.map(p => {
        if (p.id === presetId) {
          return { ...p, reportsCount: p.reportsCount + 1 }
        }
        return p
      }).filter(p => p.id !== presetId || p.reportsCount < 3))
    } catch (err) {
      toast.error(t("luducard-toast-report-failed", "Failed to send report."))
    }
  }

  // Open Share Preset Modal & Load Hardware + Config Files
  const handleOpenSharePreset = async () => {
    setIsSharePresetModalOpen(true)
    setLoadingHardware(true)
    setLoadingConfigs(true)
    setSelectedTags([])
    setPresetTitle("")
    setPresetDesc("")

    try {
      const { invoke } = await import("@tauri-apps/api/core")

      // 1. Get detected config files
      if (isTauri) {
        const files = await invoke<string[]>("detect_game_config_files", {
          gameTitle: game.title
        })
        setConfigFiles(files)
        setSelectedConfigFiles(files) // check all by default
      } else {
        setConfigFiles(["C:/Users/Player/AppData/Roaming/AetherFrontier/Saves/config.ini"])
        setSelectedConfigFiles(["C:/Users/Player/AppData/Roaming/AetherFrontier/Saves/config.ini"])
      }
      setLoadingConfigs(false)

      // 2. Detect System Hardware Info
      if (isTauri) {
        const hardware = await invoke<any>("get_system_hardware_info")
        setCpu(hardware.cpu)
        setGpu(hardware.gpu)
        setRam(hardware.ram)
      } else {
        setCpu("Intel Core i5-10400F")
        setGpu("NVIDIA GeForce GTX 1660 Super")
        setRam("16 GB")
      }
      setLoadingHardware(false)

    } catch (err) {
      console.error("Error fetching preset requirements:", err)
      setLoadingConfigs(false)
      setLoadingHardware(false)
    }
  }

  // Publish Preset Form handler
  const handlePublishPreset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!presetTitle) {
      toast.error(t("luducard-toast-preset-title-required", "Please fill in the preset title."))
      return
    }

    setPublishing(true)
    let tempPath = ""
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      const toastId = toast.loading(t("luducard-toast-packing-config-files", "Packing config files..."))

      // Step 1: Export preset files to a temporary .luducard archive
      if (isTauri) {
        let presetInfo;
        if (selectedLocalPresetForShare) {
          presetInfo = await invoke<any>("export_local_preset_archive", {
            gameId: game.id,
            presetId: selectedLocalPresetForShare.id,
            savePath: game.savePath,
          });
        } else {
          if (selectedConfigFiles.length === 0) {
            toast.error(t("luducard-toast-select-config-file", "Select at least one config file."))
            setPublishing(false)
            return
          }
          presetInfo = await invoke<any>("export_temp_luducard_preset", {
            gameTitle: game.title,
            gameId: game.id,
            presetTitle: presetTitle,
            description: presetDesc,
            savePath: game.savePath,
            files: selectedConfigFiles,
          });
        }
        tempPath = presetInfo.filePath
        const fileSize = presetInfo.fileSize
        const fileName = presetInfo.fileName

        if (isConfigured) {
          toast.loading("Requisitando upload seguro para o storage R2...", { id: toastId })
          
          // Step 2: Get pre-signed upload URL from Edge Function
          const edgeRes = await fetch(`${supabaseUrl}/functions/v1/get-upload-url`, {
            method: "POST",
            headers: {
              "apikey": supabaseAnonKey,
              "Authorization": `Bearer ${supabaseAnonKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              file_name: fileName,
              file_size: fileSize,
              user_uuid: clientUuid,
              game_id: game.id,
              is_preset: true,
            })
          })

          if (!edgeRes.ok) {
            const errData = await edgeRes.json().catch(() => ({}))
            throw new Error(errData.error || t("luducard-error-quota-or-limit", "Storage quota or limit error in the repository."));
          }

          const { uploadUrl, r2Path } = await edgeRes.json()

          toast.loading("Realizando upload seguro dos arquivos...", { id: toastId })

          // Step 3: Run Rust direct upload
          await invoke("upload_file_to_url", {
            filePath: tempPath,
            uploadUrl: uploadUrl,
          })

          toast.loading(t("luducard-toast-publishing-preset-metadata", "Publishing preset metadata to the community..."), { id: toastId })

          // Step 4: Write record to public_presets table
          const dbRes = await fetch(`${supabaseUrl}/rest/v1/public_presets`, {
            method: "POST",
            headers: {
              "apikey": supabaseAnonKey,
              "Authorization": `Bearer ${supabaseAnonKey}`,
              "Content-Type": "application/json",
              "Prefer": "return=minimal"
            },
            body: JSON.stringify({
              game_name: game.title,
              game_id: game.id,
              title: presetTitle,
              file_name: fileName,
              r2_path: r2Path,
              file_size: fileSize,
              description: presetDesc,
              author_name: authorName || ANONYMOUS_AUTHOR_ID,
              user_uuid: clientUuid,
              cpu,
              gpu,
              ram,
              tags: selectedTags,
              is_official: false,
            })
          })

          if (!dbRes.ok) {
            const errText = await dbRes.text()
            if (errText.includes("enforce_user_preset_quota_trigger")) {
              throw new Error(t("luducard-error-preset-cloud-limit", "You have reached the limit of 5 active presets in the cloud."))
            }
            throw new Error(`${t("luducard-error-register-preset-failed", "Failed to register preset")}: ${errText}`)
          }
        }

        toast.success("Preset compartilhado na comunidade com sucesso!", { id: toastId })
      } else {
        await new Promise(r => setTimeout(r, 2000))
        toast.success("[Mock] Preset publicado com sucesso!")
      }

      setIsSharePresetModalOpen(false)
      fetchGamePresets()
      fetchLocalPresets()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || `${t("luducard-toast-publish-preset-failed", "Error publishing preset")}: ${err}`)
    } finally {
      setPublishing(false)
      setSelectedLocalPresetForShare(null)
      if (tempPath && isTauri) {
        const { invoke } = await import("@tauri-apps/api/core")
        const _ = invoke("delete_temp_file", { filePath: tempPath })
      }
    }
  }

  // Toggle Tag in Preset Creation
  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag))
    } else {
      setSelectedTags(prev => [...prev, tag])
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-xl border border-border">
        <div className="absolute inset-0">
          <img
            src={game.cover || "/placeholder.svg"}
            alt=""
            aria-hidden="true"
            className="size-full scale-110 object-cover blur-2xl"
          />
          <div className="absolute inset-0 bg-background/75" />
        </div>
        <div className="relative flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:p-6">
          <img
            src={game.cover || "/placeholder.svg"}
            alt={`Capa de ${cleanGameTitle(game.title)}`}
            className="h-40 w-30 shrink-0 rounded-lg border border-border object-cover shadow-xl"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <PlatformBadge platform={game.platform} emulator={game.emulator} />
              <span className="text-xs text-muted-foreground">
                {game.backups.length} {t("luducard-saved-versions", "saved versions")}
              </span>
            </div>
            <h2 className="text-balance text-2xl font-bold leading-tight sm:text-3xl">
              {cleanGameTitle(game.title)}
            </h2>
            <div className="flex flex-wrap items-center gap-2 max-w-full">
              <button
                onClick={copyPath}
                className="group flex w-fit max-w-[550px] items-center gap-2 rounded-md border border-border bg-background/60 px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                title={game.savePath || t("luducard-no-save-path", "Path not configured")}
              >
                <FolderOpen className="size-3.5 shrink-0 text-primary" />
                <span className="truncate">{game.savePath || t("luducard-no-save-path", "Path not configured")}</span>
                <Copy className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
              
              {isTauri && (
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={handleChangeSavePath}
                    title={t("luducard-change-save-path-btn", "Change save path")}
                    className="h-8 w-8 px-0"
                  >
                    <SlidersHorizontal className="size-3.5" />
                  </Button>
                  
                  {game.isCustom && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleResetSavePath}
                      title={t("luducard-reset-save-path-btn", "Reset to default path")}
                      className="h-8 w-8 px-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <RotateCcw className="size-3.5" />
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleBackup}>
                <ArrowUpToLine data-icon="inline-start" />
                {t("luducard-backup-now", "Backup now")}
              </Button>
              <Button
                variant="secondary"
                onClick={handleRestoreLatest}
              >
                <ArrowDownToLine data-icon="inline-start" />
                {t("luducard-restore-latest", "Restore latest")}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenFolder("game")}
                title={t("luducard-open-game-folder-desc", "Open game installation folder in Windows Explorer")}
              >
                <Folder className="size-3.5" data-icon="inline-start" />
                {t("luducard-game-folder", "Game Folder")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenFolder("save")}
                title={t("luducard-open-save-folder-desc", "Open folder where active saves are stored")}
              >
                <FolderSync className="size-3.5" data-icon="inline-start" />
                {t("luducard-save-folder", "Save Folder")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenFolder("backup")}
                title={t("luducard-open-backup-folder-desc", "Open Luducard save backup folder")}
              >
                <Package className="size-3.5" data-icon="inline-start" />
                {t("luducard-backup-folder", "Backups Folder")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportSave}
                title={t("luducard-export-save-desc", "Export save as compressed .luducard file to share")}
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                <Share2 className="size-3.5" data-icon="inline-start" />
                {t("luducard-export-save", "Export Save (.luducard)")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Status panel */}
        <div className="flex flex-col gap-4 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("luducard-status", "Status")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              <StatusPill
                active={game.autoBackup}
                label={t("luducard-file-watcher", "File Watcher")}
                onIcon={Zap}
                offIcon={Zap}
              />
              <StatusPill
                active={game.cloudSync}
                label={t("luducard-cloud-sync", "Cloud sync")}
                onIcon={Cloud}
                offIcon={CloudOff}
              />
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                <span className="flex items-center gap-2 text-sm">
                  <HardDrive className="size-4 text-muted-foreground" />
                  {t("luducard-saves-on-pc", "Saves on PC")}
                </span>
                <span className="text-xs font-medium">{formatSize(game.sizeMB)}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                <span className="flex items-center gap-2 text-sm">
                  <Package className="size-4 text-muted-foreground" />
                  {t("luducard-total-backups", "Total in backups")}
                </span>
                <span className="text-xs font-medium">{formatSize(game.backupsSizeMB || 0)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Gamepad2 className="size-4 text-primary" />
                {t("luducard-campaign-notes", "Logbook")}
              </CardTitle>
              <CardDescription className="text-xs">
                {t("luducard-campaign-notes-desc", "Quick notes about your progress")}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-1">
              <textarea
                value={localNotes}
                onChange={(e) => setLocalNotes(e.target.value)}
                onBlur={saveNotes}
                placeholder={t("luducard-campaign-notes-placeholder", "Write quick notes about your progress in this game...")}
                className="w-full min-h-[100px] resize-y bg-muted/40 border border-border focus:border-primary/50 rounded-md p-2.5 text-xs leading-normal outline-none transition-colors text-foreground placeholder:text-muted-foreground/40 font-normal"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("luducard-quick-preferences", "Quick preferences")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <label className="flex items-center justify-between gap-2">
                <span className="text-sm">{t("luducard-file-watcher", "File Watcher")}</span>
                <Switch
                  checked={game.autoBackup}
                  disabled={true} /* Controlled by main settings config */
                />
              </label>
              <label className="flex items-center justify-between gap-2">
                <span className="text-sm">{t("luducard-cloud-sync-upload", "Upload to cloud")}</span>
                <Switch
                  checked={game.cloudSync}
                  disabled={true} /* Controlled by main settings config */
                />
              </label>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed view: Timeline or Presets */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                {activeTab === "saves" ? (
                  <Clock className="size-4 text-primary" />
                ) : activeTab === "presets" ? (
                  <SlidersHorizontal className="size-4 text-primary" />
                ) : (
                  <FolderSync className="size-4 text-primary" />
                )}
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground/90">
                  {activeTab === "saves"
                    ? t("luducard-save-history", "Saves History")
                    : activeTab === "presets"
                    ? t("luducard-config-presets", "Config Presets")
                    : t("luducard-save-profiles-title", "Save Profiles (Modding)")}
                </CardTitle>
              </div>

              {/* Selector Tabs */}
              <div className="flex items-center gap-1 rounded-xl bg-muted/80 p-1 border border-border w-fit shadow-xs">
                <button
                  onClick={() => setActiveTab("saves")}
                  className={cn(
                    "rounded-lg px-4 py-2 text-xs font-bold transition-all duration-150",
                    activeTab === "saves"
                      ? "bg-background text-foreground shadow-sm border border-border/10"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t("luducard-saves-timeline", "Saves Timeline")}
                </button>
                <button
                  onClick={() => setActiveTab("presets")}
                  className={cn(
                    "rounded-lg px-4 py-2 text-xs font-bold transition-all duration-150",
                    activeTab === "presets"
                      ? "bg-background text-foreground shadow-sm border border-border/10"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t("luducard-presets-configs", "Presets & Configs")}
                </button>
                <button
                  onClick={() => setActiveTab("profiles")}
                  className={cn(
                    "rounded-lg px-4 py-2 text-xs font-bold transition-all duration-150",
                    activeTab === "profiles"
                      ? "bg-background text-foreground shadow-sm border border-border/10"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t("luducard-save-profiles-tab", "Save Profiles")}
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {activeTab === "saves" ? (
              /* Saves Timeline */
              game.backups.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <CloudOff />
                    </EmptyMedia>
                    <EmptyTitle>{t("luducard-no-backups-yet", "No backups yet")}</EmptyTitle>
                    <EmptyDescription>
                      {t("luducard-do-first-backup-desc", "Create the first backup of this game to start the timeline.")}
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <ol className="relative flex flex-col">
                  {game.backups.map((b, i) => (
                    <li key={b.id} className="relative flex gap-4 pb-6 last:pb-0">
                      {/* line */}
                      {i < game.backups.length - 1 && (
                        <span className="absolute left-[7px] top-5 h-full w-px bg-border" />
                      )}
                      <span
                        className={cn(
                          "relative z-10 mt-1 size-3.5 shrink-0 rounded-full border-2 border-background",
                          i === 0 ? "bg-primary" : "bg-muted-foreground/50",
                        )}
                      />
                      <div 
                        className="flex min-w-0 flex-1 flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleOpenLocalBackupModal(b)}
                      >
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">
                              {b.date} {t("luducard-at", "at")} {b.time}
                            </span>
                            {b.cloud ? (
                              <Cloud className="size-3.5 text-primary" />
                            ) : (
                              <CloudOff className="size-3.5 text-muted-foreground" />
                            )}
                            {b.locked && (
                              <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-500 border border-amber-500/20">
                                <Pin className="size-2.5 fill-current" />
                                {t("luducard-pinned", "Pinned")}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <span className={cn("font-medium", kindColors[b.kind] || "text-muted-foreground")}>
                                {backupKindLabel(b.kind)}
                              </span>
                              <span>⬢</span>
                              <span>{formatSize(b.sizeMB)}</span>
                            </div>
                            
                            {/* Note preview */}
                            {b.note && (
                              <p className="mt-0.5 line-clamp-1 text-[10px] italic text-muted-foreground/80 bg-primary/5 rounded px-2 py-0.5 border border-primary/10 w-fit">
                                "{b.note}"
                              </p>
                            )}
                          </div>
                        </div>
                        <div 
                          className="flex shrink-0 items-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRestoreVersion(b.id, `${b.date} ${b.time}`)}
                          >
                            <RotateCcw data-icon="inline-start" />
                            {t("luducard-restore-btn", "Restore")}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleExportBackupVersion(b.id, b.date, b.time)}
                          >
                            <Share2 data-icon="inline-start" />
                            {t("luducard-export-btn", "Export")}
                          </Button>
                          <Button
                            size="icon-sm"
                            variant={b.locked ? "secondary" : "ghost"}
                            onClick={() => handleToggleLocked(b.id, !!b.locked)}
                            title={b.locked ? t("luducard-unpin-version", "Unpin version (allow automatic deletion)") : t("luducard-pin-version", "Pin version (prevent automatic deletion)")}
                            className={cn(
                              b.locked ? "text-amber-500 hover:text-amber-600 hover:bg-amber-500/10" : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <Pin className={cn("size-4", b.locked && "fill-current")} />
                            <span className="sr-only">{b.locked ? "Desafixar" : "Fixar"}</span>
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => toast.error(t("luducard-toast-manage-deletions-in-app", "Please manage backup deletions from the main app"))}
                            title={t("luducard-delete-version", "Delete version")}
                          >
                            <Trash2 />
                            <span className="sr-only">{t("luducard-delete-version", "Delete version")}</span>
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              )
            ) : activeTab === "presets" ? (
              /* Presets view */
              <div className="flex flex-col gap-6">
                {/* Segmented Sub Tabs Selector */}
                <div className="flex items-center gap-1 rounded-lg bg-muted p-1 border border-border/80 w-fit self-start">
                  <button
                    onClick={() => setPresetSubTab("local")}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-xs font-semibold transition-all",
                      presetSubTab === "local"
                        ? "bg-background text-foreground shadow-xs border border-border/10"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t("luducard-my-presets-tab", "My Presets (Local & Downloaded)")}
                  </button>
                  <button
                    onClick={() => setPresetSubTab("community")}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-xs font-semibold transition-all",
                      presetSubTab === "community"
                        ? "bg-background text-foreground shadow-xs border border-border/10"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t("luducard-community-presets-tab", "Community Presets")}
                  </button>
                </div>

                {presetSubTab === "local" ? (
                  /* Local Presets list */
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/20 border border-border p-3.5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="size-4.5 text-primary" />
                        <div>
                          <h4 className="text-sm font-semibold">{t("luducard-save-current-config", "Save Current Config")}</h4>
                          <p className="text-xs text-muted-foreground">{t("luducard-save-current-config-desc", "Create a local preset from your game's active settings.")}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          setLoadingConfigs(true);
                          setIsCreateLocalPresetModalOpen(true);
                          if (isTauri) {
                            try {
                              const { invoke } = await import("@tauri-apps/api/core");
                              const files = await invoke<string[]>("detect_game_config_files", {
                                gameTitle: game.title
                              });
                              setConfigFiles(files);
                              setSelectedConfigFiles(files);
                            } catch (err) {
                              console.error(err);
                            }
                          } else {
                            setConfigFiles(["C:/Users/Player/AppData/Roaming/AetherFrontier/Saves/config.ini"]);
                            setSelectedConfigFiles(["C:/Users/Player/AppData/Roaming/AetherFrontier/Saves/config.ini"]);
                          }
                          setLoadingConfigs(false);
                        }}
                        className="border-primary/40 hover:bg-primary/5 text-primary flex items-center gap-1.5 font-medium"
                      >
                        <HardDrive className="size-3.5" />
                        {t("luducard-save-new-config-btn", "Save New Config")}
                      </Button>
                    </div>

                    {localPresets.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border rounded-xl bg-card/20">
                        <Info className="size-8 text-muted-foreground/60 mb-2" />
                        <h5 className="font-semibold text-sm">{t("luducard-no-local-presets", "No local presets")}</h5>
                        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                          {t("luducard-no-local-presets-hint", "Capture your local graphics and controller settings to save them as a preset or share them.")}
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {localPresets.map((lp) => (
                          <div key={lp.id} className="flex flex-col gap-3 rounded-xl border border-border p-4 bg-muted/10">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div 
                                className="flex flex-col gap-1 cursor-pointer hover:bg-muted/5 p-1 rounded transition-colors flex-1 min-w-0"
                                onClick={() => setSelectedDetailPreset({
                                  ...lp,
                                  gameName: game.title,
                                  fileSize: 0,
                                  downloadsCount: 0,
                                  tags: []
                                })}
                              >
                                <h5 className="font-bold text-sm leading-tight text-foreground truncate">{lp.title}</h5>
                                <p className="line-clamp-1 text-xs text-muted-foreground leading-relaxed mt-0.5">{lp.description || t("luducard-no-description", "No description.")}</p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                                <Button
                                  size="sm"
                                  onClick={() => handleApplyLocalPreset(lp)}
                                  className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold flex items-center gap-1"
                                >
                                  <Zap className="size-3 fill-current" />
                                  {t("luducard-apply-btn", "Apply")}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleShareLocalPreset(lp)}
                                  className="flex items-center gap-1 text-xs"
                                >
                                  <Share2 className="size-3 text-primary" />
                                  {t("luducard-upload-to-hub-btn", "Upload to HUB")}
                                </Button>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteLocalPreset(lp.id)}
                                  className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 border-t border-border/40 pt-2 text-[10px] text-muted-foreground">
                              <span className="flex items-center gap-1 font-mono text-[9px] bg-muted px-1.5 py-0.5 rounded border border-border">
                                <Cpu className="size-2.5" />
                                {lp.cpu ? `${lp.cpu} | ` : ""}{lp.gpu ? `${lp.gpu} | ` : ""}{lp.ram || ""}
                              </span>
                              <span>⬢</span>
                              <span>{t("luducard-created-at", "Created on")}: {new Date(lp.createdAt).toLocaleDateString(t("luducard-date-locale", "en-US"))}</span>
                              <span>⬢</span>
                              <span>{lp.files.length} {t("luducard-files-mapped", "mapped files")}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Community Presets list */
                  <div className="flex flex-col gap-5">
                    {/* Revert Safety Backup Info */}
                    {hasCrashSafetyBackup && (
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-red-500/5 border border-red-500/10">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="size-4.5 text-red-400 animate-pulse" />
                          <div className="text-xs text-red-400">
                            <span className="font-semibold block">{t("luducard-crash-safety-active", "Safe-Crash Active")}</span>
                            {t("luducard-crash-safety-active-desc", "You applied a preset recently. If anything breaks, restore the original configs.")}
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleUndoPreset}
                          className="h-8 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <RotateCcw className="size-3.5" />
                          {t("luducard-undo-restore-original", "Undo & Restore Original")}
                        </Button>
                      </div>
                    )}

                    {loadingPresets ? (
                      <div className="flex h-[150px] flex-col items-center justify-center gap-2">
                        <Clock className="size-7 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground">{t("luducard-fetching-cloud-presets", "Fetching presets from the cloud...")}</span>
                      </div>
                    ) : presetsError ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-red-500/30 rounded-xl bg-red-500/5">
                        <CloudOff className="size-8 text-red-400/70 mb-2" />
                        <h5 className="font-semibold text-sm">{describeHubError(t, presetsError).title}</h5>
                        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                          {describeHubError(t, presetsError).description}
                        </p>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={fetchGamePresets}
                          className="mt-3 h-7 text-xs"
                        >
                          <RefreshCw className="size-3" data-icon="inline-start" />
                          {t("luducard-btn-try-again", "Try again")}
                        </Button>
                      </div>
                    ) : presets.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border rounded-xl bg-card/20">
                        <Info className="size-8 text-muted-foreground/60 mb-2" />
                        <h5 className="font-semibold text-sm">{t("luducard-no-community-presets", "No community presets")}</h5>
                        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                          {t("luducard-no-community-presets-desc", "There are no presets published for this game in the cloud. Create a local one and share it!")}
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {presets.map((preset) => {
                          const approvalRatio = preset.upvotes + preset.downvotes > 0
                            ? Math.round((preset.upvotes / (preset.upvotes + preset.downvotes)) * 100)
                            : 100

                          return (
                            <div
                              key={preset.id}
                              className={cn(
                                "flex flex-col gap-3 rounded-xl border border-border p-4 bg-muted/10 hover:bg-muted/20 transition-all",
                                preset.isOfficial && "border-primary/25 bg-primary/2"
                              )}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div 
                                  className="flex flex-col gap-1 cursor-pointer hover:bg-muted/5 p-1 rounded transition-colors flex-1 min-w-0"
                                  onClick={() => setSelectedDetailPreset(preset)}
                                >
                                  <h5 className="font-bold text-sm leading-tight flex items-center gap-1.5 truncate">
                                    {preset.title}
                                    {preset.isOfficial && (
                                      <span className="inline-flex items-center gap-0.5 rounded bg-primary/20 border border-primary/30 px-1.5 py-0.5 text-[9px] font-bold text-primary uppercase shrink-0">
                                        <Sparkles className="size-2.5 fill-current" />
                                        {t("luducard-badge-official", "Official")}
                                      </span>
                                    )}
                                  </h5>
                                  
                                  {preset.tags && preset.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {preset.tags.map((tag: string) => (
                                        <span key={tag} className="inline-flex items-center rounded bg-primary/10 border border-primary/25 px-1.5 py-0.2 text-[9px] font-semibold text-primary select-none shrink-0">
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  
                                  <p className="line-clamp-1 text-xs text-muted-foreground leading-relaxed mt-0.5">
                                    {preset.description}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  disabled={importingPreset === preset.id}
                                  onClick={() => handleApplyPreset(preset)}
                                  className="self-start sm:self-center bg-primary hover:bg-primary/95 text-primary-foreground font-semibold flex items-center gap-1 shrink-0"
                                >
                                  {importingPreset === preset.id ? (
                                    <>
                                      <RefreshCw className="size-3 animate-spin" />
                                      {t("luducard-installing", "Installing...")}
                                    </>
                                  ) : (
                                    <>
                                      <Download className="size-3" />
                                      {t("luducard-download-apply-btn", "Download & Apply")}
                                    </>
                                  )}
                                </Button>
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-2 text-[10px] text-muted-foreground">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="flex items-center gap-1 font-mono text-[9px] bg-muted px-1.5 py-0.5 rounded border border-border">
                                    <Cpu className="size-3" />
                                    {preset.cpu ? `${preset.cpu} | ` : ""}{preset.gpu ? `${preset.gpu} | ` : ""}{preset.ram || ""}
                                  </span>
                                  <span>{t("luducard-author-by-label", "By:")} <strong className="text-foreground">{authorLabel(preset.authorName)}</strong></span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1" title={t("luducard-approval", "Approval")}>
                                    <ThumbsUp className="size-3 text-primary" />
                                    <span className="font-semibold text-foreground">{approvalRatio}%</span>
                                  </div>
                                  <div className="flex items-center gap-0.5 border border-border rounded overflow-hidden bg-background">
                                    <button
                                      onClick={() => handleVote(preset.id, true)}
                                      className="p-1 hover:bg-primary/10 hover:text-primary transition-colors border-r border-border"
                                    >
                                      <ThumbsUp className="size-3" />
                                    </button>
                                    <button
                                      onClick={() => handleVote(preset.id, false)}
                                      className="p-1 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                    >
                                      <ThumbsDown className="size-3" />
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => handleReport(preset.id)}
                                    className="p-0.5 text-muted-foreground hover:text-red-400"
                                  >
                                    <AlertTriangle className="size-3" />
                                  </button>
                                  <span>{t("luducard-downloads-label", "Downloads:")} <strong className="text-foreground">{preset.downloadsCount}</strong></span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Save Profiles view */
              <div className="flex flex-col gap-6">
                 {/* Header / Intro and Create Profile Button */}
                 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-4">
                   <div className="flex flex-col gap-1">
                     <h3 className="text-sm font-semibold text-foreground">
                       {t("luducard-profiles-header", "Save Profile Management")}
                     </h3>
                     <p className="text-xs text-muted-foreground">
                       {t("luducard-profiles-intro", "Create separate campaigns or isolate modded gameplay. Luducard will automatically handle switching and storing the corresponding saves.")}
                     </p>
                   </div>
                   <Button
                     onClick={() => {
                       setNewProfileTitle("")
                       setNewProfileDesc("")
                       setCloneCurrentSaves(true)
                       setIsCreateProfileModalOpen(true)
                     }}
                     className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs py-1.5 h-auto rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                   >
                     <FolderSync className="size-3.5" />
                     {t("luducard-new-save-profile-btn", "New Save Profile")}
                   </Button>
                 </div>

                 {loadingProfiles ? (
                   <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
                     <RefreshCw className="size-8 animate-spin text-primary" />
                     <span className="text-xs">{t("luducard-loading-profiles", "Loading save profiles...")}</span>
                   </div>
                 ) : saveProfiles.length === 0 ? (
                   <Empty>
                     <EmptyHeader>
                       <EmptyMedia variant="icon">
                         <FolderSync />
                       </EmptyMedia>
                       <EmptyTitle>{t("luducard-no-profiles-yet", "No Save Profiles")}</EmptyTitle>
                       <EmptyDescription>
                         {t("luducard-no-profiles-desc", "The game is using your system's default save files. Create the first profile to start organizing your campaigns.")}
                       </EmptyDescription>
                     </EmptyHeader>
                   </Empty>
                 ) : (
                   <div className="grid gap-4">
                     {/* Warning / Active Profile Alert */}
                     <div className="flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-foreground/90 animate-in fade-in duration-200">
                       <Info className="size-4 shrink-0 mt-0.5 text-primary" />
                       <div className="flex flex-col gap-1 leading-relaxed">
                         <span className="font-semibold text-primary">
                           {t("luducard-active-profile-banner", "Active Profile on System:")} {" "}
                           {saveProfiles.find(p => p.active)?.title || t("luducard-none", "None (Using loose saves)")}
                         </span>
                         <span>
                           {t("luducard-active-profile-banner-desc", "When switching profiles, the game folder's current saves are automatically stored in the previously active profile to prevent data loss.")}
                         </span>
                       </div>
                     </div>

                     <div className="flex flex-col gap-3">
                       {saveProfiles.map((p) => (
                         <div
                           key={p.id}
                           className={cn(
                             "relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border p-4 transition-all duration-200",
                             p.active
                               ? "border-primary bg-primary/5 shadow-xs"
                               : "border-border bg-muted/20 hover:bg-muted/30"
                           )}
                         >
                           <div className="flex min-w-0 flex-1 flex-col gap-1">
                             <div className="flex items-center gap-2 flex-wrap">
                               <span className="font-bold text-sm text-foreground truncate">{p.title}</span>
                               {p.active ? (
                                 <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[9px] font-bold text-emerald-500 select-none">
                                   {t("luducard-profile-active-tag", "Active on System")}
                                 </span>
                               ) : (
                                 <span className="inline-flex items-center rounded-full bg-muted border border-border px-2 py-0.5 text-[9px] font-medium text-muted-foreground select-none">
                                   {t("luducard-profile-inactive-tag", "Inactive")}
                                 </span>
                               )}
                             </div>
                             {p.description && (
                               <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                                 {p.description}
                               </p>
                             )}
                             <span className="text-[10px] text-muted-foreground/80 mt-1">
                               {t("luducard-created-at", "Created on")}: {new Date(p.createdAt).toLocaleString(t("luducard-date-locale", "en-US"), { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                             </span>
                           </div>

                           <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
                             {!p.active && (
                               <Button
                                 size="sm"
                                 variant="outline"
                                 disabled={switchingProfileId !== null}
                                 onClick={() => handleSwitchSaveProfile(p.id, p.title)}
                                 className="border-primary/30 text-primary hover:bg-primary/5 cursor-pointer font-semibold animate-in fade-in duration-200"
                               >
                                 {switchingProfileId === p.id ? (
                                   <RefreshCw className="size-3.5 animate-spin" />
                                 ) : (
                                   <FolderSync className="size-3.5" />
                                 )}
                                 {t("luducard-activate-profile-btn", "Activate Profile")}
                               </Button>
                             )}
                             <Button
                               size="icon-sm"
                               variant="ghost"
                               disabled={p.active || switchingProfileId !== null}
                               onClick={() => handleDeleteSaveProfile(p.id, p.title)}
                               title={p.active ? t("luducard-cant-delete-active", "Cannot delete the active profile") : t("luducard-delete-profile", "Delete profile")}
                               className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 cursor-pointer disabled:opacity-30"
                             >
                               <Trash2 className="size-4" />
                               <span className="sr-only">{t("luducard-delete", "Delete")}</span>
                             </Button>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
               </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Local Backup Details Modal */}
      {selectedLocalBackup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-md shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border">
              <div>
                <CardTitle className="text-base">{t("luducard-local-backup-details", "Local Backup Details")}</CardTitle>
                <CardDescription className="text-xs">{t("luducard-version-info-desc", "Version information and campaign notes.")}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedLocalBackup(null)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 bg-muted/20 border border-border p-3.5 rounded-xl text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("luducard-date-time-label", "Date and Time:")}</span>
                  <span className="font-semibold text-foreground">{selectedLocalBackup.date} {t("luducard-at", "at")} {selectedLocalBackup.time}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-muted-foreground">{t("luducard-backup-type-label", "Backup Type:")}</span>
                  <span className={cn("font-semibold", kindColors[selectedLocalBackup.kind] || "text-foreground")}>
                    {backupKindLabel(selectedLocalBackup.kind)}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-muted-foreground">{t("luducard-file-size-label", "File Size:")}</span>
                  <span className="font-semibold text-foreground">{formatSize(selectedLocalBackup.sizeMB)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="local-backup-note" className="text-xs font-semibold text-muted-foreground">
                  {t("luducard-campaign-notes-label", "Campaign Notes / Progress Description")}
                </label>
                <textarea
                  id="local-backup-note"
                  rows={4}
                  placeholder={t("luducard-campaign-notes-placeholder", "E.g. Stopped after beating the dragon. Level 45, dexterity build...")}
                  value={localNote}
                  onChange={(e) => setLocalNote(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary whitespace-pre-wrap leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-border pt-4 mt-2">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedLocalBackup(null)}
                >
                  {t("luducard-cancel", "Cancel")}
                </Button>
                <Button
                  onClick={handleSaveNote}
                  className="bg-primary hover:bg-primary/95 text-primary-foreground font-medium"
                >
                  {t("luducard-save-notes-btn", "Save Notes")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Share Preset Modal */}
      {isSharePresetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-lg shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border bg-card">
              <div>
                <CardTitle className="text-base flex items-center gap-1.5">
                  <Share2 className="size-4.5 text-primary" />
                  {t("luducard-share-config-preset-title", "Share Config Preset")}
                </CardTitle>
                <CardDescription className="text-xs">
                  {t("luducard-share-config-preset-desc", "Save and send your local optimizations to the community.")}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSharePresetModalOpen(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </Button>
            </CardHeader>
            <form onSubmit={handlePublishPreset}>
              <CardContent className="pt-4 flex flex-col gap-4 max-h-[500px] overflow-y-auto">
                
                {/* Config files list */}
                <div className="flex flex-col gap-1.5 border border-border rounded-xl p-3 bg-muted/10">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <FolderSync className="size-3.5 text-primary" />
                    {t("luducard-detected-config-files", "Detected Config Files:")}
                  </label>
                  {loadingConfigs ? (
                    <div className="flex items-center gap-2 py-2 text-xs text-muted-foreground">
                      <Clock className="size-3.5 animate-spin text-primary" />
                      {t("luducard-mapping-local-files", "Mapping local files...")}
                    </div>
                  ) : configFiles.length === 0 ? (
                    <div className="text-xs text-red-400 bg-red-500/5 border border-red-500/10 p-2.5 rounded-lg flex items-start gap-1.5">
                      <AlertTriangle className="size-4 shrink-0" />
                      {t("luducard-no-config-files-detected", "Could not detect config files using the Ludusavi mapping.")}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5 max-h-[100px] overflow-y-auto border border-border/60 rounded bg-background p-2">
                      {configFiles.map(path => {
                        const name = path.split(/[\\/]/).pop()
                        const isChecked = selectedConfigFiles.includes(path)
                        return (
                          <label key={path} className="flex items-center gap-2 text-[11px] cursor-pointer hover:text-foreground select-none">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelectedConfigFiles(prev => prev.filter(p => p !== path))
                                } else {
                                  setSelectedConfigFiles(prev => [...prev, path])
                                }
                              }}
                              className="rounded border-border bg-muted text-primary focus:ring-primary size-3"
                            />
                            <span className="font-semibold text-foreground shrink-0">{name}</span>
                            <span className="truncate text-muted-foreground text-[10px]" title={path}>({path})</span>
                          </label>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Form fields */}
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label htmlFor="preset-title" className="text-xs font-semibold text-muted-foreground">
                      {t("luducard-preset-title-label", "Preset Title *")}
                    </label>
                    <input
                      id="preset-title"
                      type="text"
                      placeholder={t("luducard-preset-title-placeholder", "E.g. Potato Mode (Max Performance) or Balanced DF Specs")}
                      value={presetTitle}
                      onChange={(e) => setPresetTitle(e.target.value)}
                      required
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="preset-author" className="text-xs font-semibold text-muted-foreground">
                      {t("luducard-your-name-label", "Your Name / Nickname")}
                    </label>
                    <input
                      id="preset-author"
                      type="text"
                      placeholder={t("luducard-checkpoint-author-placeholder", "E.g. Anonymous")}
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {/* Tags */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      {t("luducard-preset-tags-label", "Preset Tags")}
                    </label>
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto border border-border/80 p-2.5 rounded-md bg-muted/10">
                      {PREDEFINED_PRESET_TAGS.map(tag => {
                        const active = selectedTags.includes(tag.id)
                        return (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleToggleTag(tag.id)}
                            title={tag.description}
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-medium border transition-all select-none",
                              active
                                ? "bg-primary/10 border-primary text-primary"
                                : "bg-background border-border text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {tag.name}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="preset-desc" className="text-xs font-semibold text-muted-foreground">
                    {t("luducard-preset-desc-detailed-label", "Description (Game version, estimated FPS gains, etc.)")}
                  </label>
                  <textarea
                    id="preset-desc"
                    rows={2}
                    placeholder={t("luducard-preset-desc-placeholder", "E.g. Around 15% more FPS in the city. Tested on version 1.63.")}
                    value={presetDesc}
                    onChange={(e) => setPresetDesc(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary whitespace-pre-wrap"
                  />
                </div>

                {/* Hardware details prefilled */}
                <div className="flex flex-col gap-2.5 border border-border rounded-xl p-3 bg-muted/10">
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Cpu className="size-3.5 text-primary" />
                    {t("luducard-detected-hardware-label", "Detected Hardware (Author Specs):")}
                  </span>
                  {loadingHardware ? (
                    <div className="flex items-center gap-2 py-1 text-xs text-muted-foreground">
                      <Clock className="size-3.5 animate-spin text-primary" />
                      {t("luducard-detecting-hardware", "Detecting local hardware...")}
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="flex flex-col gap-1">
                        <label htmlFor="hw-cpu" className="text-[10px] font-semibold text-muted-foreground">{t("luducard-cpu-full-label", "Processor (CPU)")}</label>
                        <input
                          id="hw-cpu"
                          type="text"
                          value={cpu}
                          onChange={(e) => setCpu(e.target.value)}
                          className="w-full rounded border border-border bg-background px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label htmlFor="hw-gpu" className="text-[10px] font-semibold text-muted-foreground">{t("luducard-gpu-label", "Graphics Card (GPU)")}</label>
                        <input
                          id="hw-gpu"
                          type="text"
                          value={gpu}
                          onChange={(e) => setGpu(e.target.value)}
                          className="w-full rounded border border-border bg-background px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label htmlFor="hw-ram" className="text-[10px] font-semibold text-muted-foreground">{t("luducard-ram-label", "RAM Memory")}</label>
                        <input
                          id="hw-ram"
                          type="text"
                          value={ram}
                          onChange={(e) => setRam(e.target.value)}
                          className="w-full rounded border border-border bg-background px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                  )}
                </div>

              </CardContent>
              <div className="flex justify-end gap-2 border-t border-border p-4 bg-muted/10">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsSharePresetModalOpen(false)}
                >
                  {t("luducard-cancel", "Cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={publishing || configFiles.length === 0}
                  className="bg-primary hover:bg-primary/95 text-primary-foreground font-medium"
                >
                  {publishing ? "Publicando..." : "Publicar Preset"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Detail Preset Modal overlay */}
      {selectedDetailPreset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-md shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border bg-card">
              <div>
                <CardTitle className="text-base flex items-center gap-1.5 font-semibold">
                  <Gamepad2 className="size-4.5 text-primary" />
                  {selectedDetailPreset.gameName}
                </CardTitle>
                <CardDescription className="text-xs">{t("luducard-preset-detail-modal-desc", "Viewing complete preset metadata.")}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDetailPreset(null)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground font-semibold">{t("luducard-detail-preset-title", "Preset Title:")}</span>
                <span className="text-sm font-bold text-foreground leading-snug">{selectedDetailPreset.title}</span>
              </div>

              {selectedDetailPreset.description && (
                <div className="flex flex-col gap-1 bg-muted/20 border border-border p-3 rounded-lg">
                  <span className="text-[11px] text-muted-foreground font-semibold">{t("luducard-detail-preset-desc", "Description / Optimizations:")}</span>
                  <div className="max-h-[160px] overflow-y-auto pr-1.5 scrollbar-thin">
                    <p className="text-xs leading-relaxed text-muted-foreground mt-0.5 whitespace-pre-wrap">{selectedDetailPreset.description}</p>
                  </div>
                </div>
              )}

              {selectedDetailPreset.tags && selectedDetailPreset.tags.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] text-muted-foreground font-semibold">{t("luducard-detail-tags-label", "Tags:")}</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedDetailPreset.tags.map((tagId: string) => {
                      const info = PREDEFINED_PRESET_TAGS.find(pt => pt.id === tagId)
                      return (
                        <span
                          key={tagId}
                          title={info?.description}
                          className="inline-flex items-center rounded bg-primary/10 border border-primary/25 px-1.5 py-0.2 text-[9px] font-semibold text-primary select-none cursor-help"
                        >
                          {info?.name ?? tagId}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 bg-muted/20 border border-border p-3.5 rounded-xl text-xs">
                <div className="flex flex-col gap-0.5 col-span-2">
                  <span className="text-muted-foreground font-semibold">{t("luducard-detail-author-specs", "Author Specs:")}</span>
                  <span className="font-mono text-foreground mt-0.5 leading-relaxed">
                    {selectedDetailPreset.cpu ? `${selectedDetailPreset.cpu} | ` : ""}{selectedDetailPreset.gpu ? `${selectedDetailPreset.gpu} | ` : ""}{selectedDetailPreset.ram || ""}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 mt-1">
                  <span className="text-muted-foreground">{t("luducard-detail-size-label", "Compressed Size:")}</span>
                  <span className="font-semibold text-foreground">{formatSize(selectedDetailPreset.fileSize)}</span>
                </div>
                <div className="flex flex-col gap-0.5 mt-1">
                  <span className="text-muted-foreground">{t("luducard-detail-downloads-label", "Total Downloads:")}</span>
                  <span className="font-semibold text-foreground">{selectedDetailPreset.downloadsCount.toLocaleString(t("luducard-date-locale", "en-US"))}</span>
                </div>
                <div className="flex flex-col gap-0.5 mt-1">
                  <span className="text-muted-foreground font-medium">{t("luducard-detail-author-label", "Uploaded by:")}</span>
                  <span className="font-semibold text-foreground">{selectedDetailPreset.authorName ? authorLabel(selectedDetailPreset.authorName) : "Local"}</span>
                </div>
                <div className="flex flex-col gap-0.5 mt-1">
                  <span className="text-muted-foreground font-medium">{t("luducard-detail-date-label", "Uploaded on:")}</span>
                  <span className="font-semibold text-foreground">
                    {new Date(selectedDetailPreset.createdAt).toLocaleDateString(t("luducard-date-locale", "en-US"), { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {/* Create Local Preset Modal */}
      {isCreateLocalPresetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-md shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border">
              <div>
                <CardTitle className="text-base flex items-center gap-1.5">
                  <SlidersHorizontal className="size-4.5 text-primary" />
                  {t("luducard-create-local-preset-title", "Create Local Preset")}
                </CardTitle>
                <CardDescription className="text-xs">
                  {t("luducard-create-local-preset-desc", "Save this game's current settings into a local profile.")}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCreateLocalPresetModalOpen(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="local-preset-title" className="text-xs font-semibold text-muted-foreground">{t("luducard-preset-title-label", "Preset Title *")}</label>
                <input
                  id="local-preset-title"
                  type="text"
                  placeholder={t("luducard-local-preset-title-placeholder", "E.g. My 60fps Optimization or Flight Controls")}
                  value={newLocalTitle}
                  onChange={(e) => setNewLocalTitle(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="local-preset-desc" className="text-xs font-semibold text-muted-foreground">{t("luducard-profile-desc-label", "Description")}</label>
                <textarea
                  id="local-preset-desc"
                  rows={2.5}
                  placeholder={t("luducard-local-preset-desc-placeholder", "Describe what this preset changes (e.g. reduces volumetric shadows for better performance).")}
                  value={newLocalDesc}
                  onChange={(e) => setNewLocalDesc(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <FolderSync className="size-3.5 text-primary" />
                  {t("luducard-included-files-label", "Included Files (Auto-detected):")}
                </span>
                {loadingConfigs ? (
                  <div className="text-xs text-muted-foreground py-1">{t("luducard-mapping-files", "Mapping files...")}</div>
                ) : configFiles.length === 0 ? (
                  <div className="text-xs text-red-400 bg-red-500/5 p-2 rounded-lg border border-red-500/10">{t("luducard-no-files-detected", "No files detected by Ludusavi.")}</div>
                ) : (
                  <div className="flex flex-col gap-1 max-h-24 overflow-y-auto border border-border/80 bg-muted/10 p-2 rounded-md">
                    {configFiles.map(c => {
                      const name = c.split(/[\\/]/).pop()
                      return (
                        <span key={c} className="text-[10px] text-muted-foreground font-mono truncate" title={c}>
                          ⬢ {name}
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t border-border pt-4 mt-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsCreateLocalPresetModalOpen(false)}
                >
                  {t("luducard-cancel", "Cancel")}
                </Button>
                <Button
                  disabled={loadingConfigs || configFiles.length === 0 || !newLocalTitle}
                  onClick={() => handleSaveLocalPreset(newLocalTitle, newLocalDesc, configFiles)}
                  className="bg-primary hover:bg-primary/95 text-primary-foreground font-medium"
                >
                  {t("luducard-create-preset-btn", "Create Preset")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Save Profile Modal */}
      {isCreateProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-md shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border">
              <div>
                <CardTitle className="text-base flex items-center gap-1.5">
                  <FolderSync className="size-4.5 text-primary" />
                  {t("luducard-create-profile-title", "Create Save Profile")}
                </CardTitle>
                <CardDescription className="text-xs">
                  {t("luducard-create-profile-desc", "Start a parallel campaign or isolate saves with mods.")}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCreateProfileModalOpen(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="save-profile-title" className="text-xs font-semibold text-muted-foreground">
                  {t("luducard-profile-name-label", "Profile Name *")}
                </label>
                <input
                  id="save-profile-title"
                  type="text"
                  placeholder={t("luducard-profile-name-placeholder", "E.g. My Vanilla Campaign or Modded Run")}
                  value={newProfileTitle}
                  onChange={(e) => setNewProfileTitle(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="save-profile-desc" className="text-xs font-semibold text-muted-foreground">
                  {t("luducard-profile-desc-label", "Description")}
                </label>
                <textarea
                  id="save-profile-desc"
                  rows={2.5}
                  placeholder={t("luducard-profile-desc-placeholder", "Describe the purpose of this profile (e.g. playing with the warrior class).")}
                  value={newProfileDesc}
                  onChange={(e) => setNewProfileDesc(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-3 text-xs">
                <span className="font-semibold text-muted-foreground flex items-center gap-1">
                  {t("luducard-creation-options", "Startup Options:")}
                </span>

                <div className="flex flex-col gap-2.5">
                  <label className="flex items-start gap-2 cursor-pointer font-medium text-foreground">
                    <input
                      type="radio"
                      name="clone-option"
                      checked={cloneCurrentSaves}
                      onChange={() => setCloneCurrentSaves(true)}
                      className="mt-0.5 text-primary focus:ring-primary"
                    />
                    <div className="flex flex-col gap-0.5">
                      <span>{t("luducard-clone-current-saves", "Clone current progress")}</span>
                      <span className="text-[10px] text-muted-foreground font-normal">
                        {t("luducard-clone-current-saves-desc", "Copies the saves currently in the game folder to this profile (recommended).")}
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer font-medium text-foreground">
                    <input
                      type="radio"
                      name="clone-option"
                      checked={!cloneCurrentSaves}
                      onChange={() => setCloneCurrentSaves(false)}
                      className="mt-0.5 text-primary focus:ring-primary"
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-amber-500">{t("luducard-start-empty", "Start from scratch (Empty)")}</span>
                      <span className="text-[10px] text-muted-foreground font-normal">
                        {t("luducard-start-empty-desc", "The game's current save folder will be cleared so you can start 100% fresh progress.")}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-border pt-4 mt-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsCreateProfileModalOpen(false)}
                >
                  {t("luducard-cancel", "Cancel")}
                </Button>
                <Button
                  disabled={!newProfileTitle}
                  onClick={handleCreateSaveProfile}
                  className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold"
                >
                  {t("luducard-create-profile-btn", "Create Profile")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <ConflictResolutionModal
        isOpen={conflictModalOpen}
        onClose={() => {
          setConflictModalOpen(false)
          setConflictInfo(null)
        }}
        conflict={conflictInfo}
        onResolve={handleResolveConflict}
      />
    </div>
  )
}

