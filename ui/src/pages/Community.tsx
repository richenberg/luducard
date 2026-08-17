import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  Search,
  Upload,
  Download,
  Users,
  Clock,
  TrendingUp,
  Package,
  Shield,
  Gamepad2,
  RefreshCw,
  Globe,
  Database,
  CloudOff,
  X,
  FileCheck,
} from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty"
import { useLibrary } from "@/lib/library-context"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"
import { ANONYMOUS_AUTHOR_ID, getAuthorLabel } from "@/lib/preset-tags"
import { fetchHubRows, describeHubError, type HubFetchError } from "@/lib/hub-fetch"
import { useHubCovers, coverKey } from "@/lib/hub-covers"

const isTauri =
  typeof window !== "undefined" &&
  (window as any).__TAURI_INTERNALS__ !== undefined

interface TagInfo {
  name: string
  description: string
}

const getPredefinedTags = (t: any): TagInfo[] => [
  { name: "100%", description: t("luducard-tag-desc-100", "Game 100% completed with all achievements, items and collectibles unlocked.") },
  { name: "DLC1", description: t("luducard-tag-desc-dlc1", "Progress focused on or ready to start the first DLC.") },
  { name: "DLC2", description: t("luducard-tag-desc-dlc2", "Progress focused on or ready to start the second DLC.") },
  { name: "New Game+", description: t("luducard-tag-desc-ngplus", "Game ready to start or already started in New Game+ mode.") },
  { name: "Vanilla", description: t("luducard-tag-desc-vanilla", "Base game progress completely clean, without modifiers, mods or cheats.") },
  { name: "Modded", description: t("luducard-tag-desc-modded", "Progress obtained using modifications (mods) that can alter gameplay.") },
  { name: "Boss Prep", description: t("luducard-tag-desc-bossprep", "Save strategically positioned right before a major game boss.") },
  { name: "Starter", description: t("luducard-tag-desc-starter", "Save at the beginning of the game, with accumulated resources or skipped tutorial.") },
  { name: "Clean Start", description: t("luducard-tag-desc-cleanstart", "Savegame right after character creation or introduction, ready to play straight from the real start.") },
  { name: "Mid-Game", description: t("luducard-tag-desc-midgame", "Save positioned in the middle of the main campaign (great for those who lost progress).") },
  { name: "Post-Game", description: t("luducard-tag-desc-postgame", "Campaign completed, ideal for exploring secret bosses, pending achievements or side activities.") },
  { name: "OP Build", description: t("luducard-tag-desc-opbuild", "Savegame focused on a character with extremely strong equipment, level and builds (Overpowered).") },
  { name: "Unlimited Cash", description: t("luducard-tag-desc-unlimitedcash", "Save focused on having max or infinite cash, coins or upgrade resources.") },
  { name: "All Collectibles", description: t("luducard-tag-desc-allcollectibles", "Save focusing on secondary achievements and tedious collectibles fully unlocked.") },
  { name: "Hardcore", description: t("luducard-tag-desc-hardcore", "Saves in extreme difficulties or with permanent death enabled (extreme survival).") },
  { name: "Speedrun Ready", description: t("luducard-tag-desc-speedrunready", "Save ideal for training speedrun segments or positioned on the fastest routes.") },
  { name: "Legit", description: t("luducard-tag-desc-legit", "Progress obtained cleanly, without cheats, cheat codes or exploiting bugs (glitches).") }
]

interface CommunityCheckpoint {
  id: string
  gameName: string
  title: string
  fileName: string
  r2Path: string
  fileSize: number
  description: string
  authorName: string
  userUuid: string
  downloadsCount: number
  createdAt: string
  tags?: string[]
}

type SortMode = "popular" | "recent" | "size"

function formatCompactSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatRelativeDate(isoDate: string, t: any): string {
  const date = new Date(isoDate)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return t("luducard-date-today", "Today")
  if (diffDays === 1) return t("luducard-date-yesterday", "Yesterday")
  if (diffDays < 7) return `${diffDays} ${t("luducard-date-days-ago", "days ago")}`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} ${t("luducard-date-weeks-ago", "weeks ago")}`
  return date.toLocaleDateString(t("luducard-date-locale", "en-US"), { day: "2-digit", month: "short", year: "numeric" })
}

export default function Community() {
  const { t } = useI18n()
  const { games } = useLibrary()
  const PREDEFINED_TAGS = getPredefinedTags(t)

  const authorLabel = (name?: string | null) => getAuthorLabel(t, name)

  // Search, sort, checkpoints
  const [checkpoints, setCheckpoints] = useState<CommunityCheckpoint[]>([])
  const [loading, setLoading] = useState(true)
  /** Non-null when the last load failed, so an outage never renders as an empty hub. */
  const [loadError, setLoadError] = useState<HubFetchError | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortMode, setSortMode] = useState<SortMode>("popular")
  const [importing, setImporting] = useState<string | null>(null)

  // Supabase Configuration
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("")
  const [clientUuid, setClientUuid] = useState("")
  const [isConfigured, setIsConfigured] = useState(() => typeof window !== "undefined" && localStorage.getItem("luducard_supabase_configured") === "true")

  // Modal Share Checkpoint State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [selectedGameId, setSelectedGameId] = useState("")
  const [gameSearchQuery, setGameSearchQuery] = useState("")
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false)
  const [selectedBackupId, setSelectedBackupId] = useState("")
  const [checkpointTitle, setCheckpointTitle] = useState("")
  const [checkpointDesc, setCheckpointDesc] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [uploading, setUploading] = useState(false)
  const [selectedUploadTags, setSelectedUploadTags] = useState<string[]>([])

  // Modal Detail State
  const [selectedDetailCheckpoint, setSelectedDetailCheckpoint] = useState<CommunityCheckpoint | null>(null)

  /**
   * Games offerable in the share dialog. Must stay below the state declarations it reads —
   * `filter` runs its callback synchronously, so hoisting this above `gameSearchQuery`
   * throws on the temporal dead zone.
   *
   * Keyed off backups, not `installed`: what gets uploaded is a backup (see
   * `export_temp_luducard_backup` below, which only needs backupPath/backupId/savePath),
   * and sharing a save is exactly what you do for a game you have since uninstalled.
   * `installed` additionally requires the install dir to sit under a configured root and
   * hold an executable, which excluded games that have perfectly shareable backups.
   */
  const shareableGames = games.filter(
    g =>
      g.backups.length > 0 &&
      (!gameSearchQuery || g.title.toLowerCase().includes(gameSearchQuery.toLowerCase()))
  )

  // Load Settings and Data
  const loadConfigAndData = async () => {
    setLoading(true)
    setLoadError(null)
    if (!isTauri) {
      // Offline/Browser mock mode fallback
      setSupabaseUrl("mock")
      setSupabaseAnonKey("mock")
      setIsConfigured(true)

      setCheckpoints([
        {
          id: "cp-mock-1",
          gameName: "Elden Ring",
          title: "100% Completo - Todas Conquistas",
          fileName: "elden-ring.luducard",
          r2Path: "saves/elden-ring/cp1.luducard",
          fileSize: 36000000,
          description: "Savegame no New Game+ com todas as armas, cinzas de guerra e armaduras do jogo. Ideal para iniciar as DLCs direto com as melhores builds.",
          authorName: "TarnishedOne",
          userUuid: "mock-user",
          downloadsCount: 1450,
          createdAt: "2026-06-25T12:00:00Z",
          tags: ["100%", "New Game+", "Vanilla"]
        }
      ])
      setLoading(false)
      return
    }

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
        localStorage.setItem("luducard_supabase_configured", "true")

        // Fetch public saves from Supabase
        const result = await fetchHubRows(`${url}/rest/v1/public_saves?select=*`, key)

        if (result.ok) {
          const mapped = result.rows.map((item: any) => ({
            id: item.id,
            gameName: item.game_name,
            title: item.title,
            fileName: item.file_name,
            r2Path: item.r2_path,
            fileSize: Number(item.file_size || 0),
            description: item.description || "",
            authorName: item.author_name || "",
            userUuid: item.user_uuid,
            downloadsCount: Number(item.downloads_count || 0),
            createdAt: item.created_at,
            tags: item.tags || []
          }))
          setCheckpoints(mapped)
        } else {
          console.error("Failed to load public_saves:", result.error)
          setCheckpoints([])
          setLoadError(result.error)
          toast.error(describeHubError(t, result.error).title)
        }
      } else {
        setIsConfigured(false)
        localStorage.setItem("luducard_supabase_configured", "false")
      }
    } catch (err) {
      console.error("Error reading configuration:", err)
      toast.error(t("luducard-toast-backend-connection-error", "Connection error with the app backend."))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConfigAndData()
  }, [])

  useEffect(() => {
    if (!isShareModalOpen) {
      setSelectedGameId("")
      setGameSearchQuery("")
      setIsGameDropdownOpen(false)
      setSelectedBackupId("")
      setCheckpointTitle("")
      setCheckpointDesc("")
      setAuthorName("")
      setSelectedUploadTags([])
    }
  }, [isShareModalOpen])

  // Filter & Sort for Checkpoints
  const filteredCheckpoints = checkpoints.filter((cp) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      cp.gameName.toLowerCase().includes(q) ||
      cp.title.toLowerCase().includes(q) ||
      cp.description.toLowerCase().includes(q)
    )
  })

  const sortedCheckpoints = [...filteredCheckpoints].sort((a, b) => {
    if (sortMode === "popular") return b.downloadsCount - a.downloadsCount
    if (sortMode === "recent")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (sortMode === "size") return a.fileSize - b.fileSize
    return 0
  })

  /**
   * Titles the local library cannot cover. Most of the hub is games the viewer does not
   * own, so these are resolved remotely by title — see `useHubCovers`.
   */
  const uncoveredTitles = checkpoints
    .map((cp) => cp.gameName)
    .filter(
      (gameName) =>
        !games.some((g) => g.title.toLowerCase() === gameName.toLowerCase() && g.cover)
    )

  const remoteCovers = useHubCovers(uncoveredTitles, supabaseUrl, supabaseAnonKey)

  const getGameCover = (gameName: string): string => {
    const match = games.find(
      (g) => g.title.toLowerCase() === gameName.toLowerCase()
    )
    // Prefer the local copy: already on disk, and works offline.
    return match?.cover || remoteCovers[coverKey(gameName)] || "/placeholder.svg"
  }

  // Install Checkpoint Save
  const handleInstallCheckpoint = async (checkpoint: CommunityCheckpoint) => {
    if (!isConfigured) return

    setImporting(checkpoint.id)
    try {
      const { invoke } = await import("@tauri-apps/api/core")

      // Step 1: Request presigned download URL from Edge Function
      const toastId = toast.loading("Requisitando link de download seguro...")
      const edgeRes = await fetch(`${supabaseUrl}/functions/v1/get-download-url`, {
        method: "POST",
        headers: {
          "apikey": supabaseAnonKey,
          "Authorization": `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ r2_path: checkpoint.r2Path })
      })

      if (!edgeRes.ok) {
        throw new Error(`${t("luducard-error-get-download-url-failed-2", "Failed to get download URL")}: ${edgeRes.statusText}`)
      }

      const { downloadUrl } = await edgeRes.json()

      // Step 2: Find target save path
      const matchedGame = games.find(
        (g) => g.title.toLowerCase() === checkpoint.gameName.toLowerCase()
      )

      if (!matchedGame?.savePath) {
        toast.error(
          `${t("luducard-game-label", "Game")} "${checkpoint.gameName}" ${t("luducard-error-game-not-found", "not found in your local library, or it has no save folder configured.")}`,
          { id: toastId }
        )
        setImporting(null)
        return
      }

      toast.loading(t("luducard-toast-downloading-checkpoint", "Downloading and installing checkpoint... Safe-Crash will create an automatic backup."), { id: toastId })

      // Step 3: Run Rust download + import command
      await invoke("download_and_import_luducard", {
        downloadUrl,
        targetSaveDir: matchedGame.savePath,
      })

      // Step 4: Increment download count in Supabase
      await fetch(`${supabaseUrl}/rest/v1/rpc/increment_downloads`, {
        method: "POST",
        headers: {
          "apikey": supabaseAnonKey,
          "Authorization": `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ save_id: checkpoint.id })
      })

      toast.success(
        `${t("luducard-checkpoint-label", "Checkpoint")} "${checkpoint.title}" ${t("luducard-toast-checkpoint-installed", "installed successfully! The previous save was backed up to history.")}`,
        { id: toastId }
      )
      loadConfigAndData()
    } catch (err) {
      console.error(err)
      toast.error(`${t("luducard-toast-install-checkpoint-failed", "Failed to download/install checkpoint")}: ${err}`)
    } finally {
      setImporting(null)
    }
  }

  // Publish Save Checkpoint
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGameId || !selectedBackupId || !checkpointTitle) {
      toast.error(t("luducard-toast-fill-required-fields-cm", "Please fill in all required fields."))
      return
    }

    setUploading(true)
    const selectedGame = games.find(g => g.id === selectedGameId)
    if (!selectedGame) return

    let tempZipPath = ""
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      const toastId = toast.loading("Comprimindo arquivos de save do backup com zstd...")

      const tempSaveInfo = await invoke<any>("export_temp_luducard_backup", {
        gameTitle: selectedGame.title,
        gameId: selectedGame.id,
        checkpointTitle: checkpointTitle,
        description: checkpointDesc,
        backupPath: selectedGame.backupPath || "",
        backupId: selectedBackupId,
        savePath: selectedGame.savePath,
      })

      tempZipPath = tempSaveInfo.filePath
      const fileSize = tempSaveInfo.fileSize
      const fileName = tempSaveInfo.fileName

      toast.loading(t("luducard-toast-requesting-cloud-upload-permission", "Requesting secure cloud upload permission..."), { id: toastId })

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
          game_id: selectedGame.id,
        })
      })

      if (!edgeRes.ok) {
        const errData = await edgeRes.json().catch(() => ({}))
        throw new Error(errData.error || t("luducard-error-cloud-storage-quota-limit", "Cloud storage quota/limit error."));
      }

      const { uploadUrl, r2Path } = await edgeRes.json()

      toast.loading(`Fazendo upload seguro (${formatCompactSize(fileSize)})...`, { id: toastId })

      await invoke("upload_file_to_url", {
        filePath: tempZipPath,
        uploadUrl: uploadUrl,
      })

      toast.loading(t("luducard-toast-publishing-to-public-repo", "Publishing metadata to the public repository..."), { id: toastId })

      const dbRes = await fetch(`${supabaseUrl}/rest/v1/public_saves`, {
        method: "POST",
        headers: {
          "apikey": supabaseAnonKey,
          "Authorization": `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          game_name: selectedGame.title,
          title: checkpointTitle,
          file_name: fileName,
          r2_path: r2Path,
          file_size: fileSize,
          description: checkpointDesc,
          author_name: authorName || ANONYMOUS_AUTHOR_ID,
          user_uuid: clientUuid,
          tags: selectedUploadTags,
        })
      })

      if (!dbRes.ok) {
        const errText = await dbRes.text()
        if (errText.includes("enforce_user_save_quota_trigger")) {
          throw new Error(t("luducard-error-checkpoint-cloud-limit", "You have already reached the limit of 5 active checkpoints in the cloud."))
        }
        throw new Error(`${t("luducard-error-register-checkpoint-failed", "Failed to register checkpoint in the database")}: ${errText}`)
      }

      toast.success("Checkpoint compartilhado na comunidade com sucesso!", { id: toastId })
      setIsShareModalOpen(false)

      setSelectedGameId("")
      setGameSearchQuery("")
      setIsGameDropdownOpen(false)
      setSelectedBackupId("")
      setCheckpointTitle("")
      setCheckpointDesc("")
      setAuthorName("")

      loadConfigAndData()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || `${t("luducard-toast-publish-failed", "Error publishing")}: ${err}`)
    } finally {
      if (tempZipPath && isTauri) {
        const { invoke } = await import("@tauri-apps/api/core")
        const _ = invoke("delete_temp_file", { filePath: tempZipPath })
      }
      setUploading(false)
    }
  }

  return (
    <AppShell
      title={t("luducard-community-title", "Save Share HUB")}
      description={t("luducard-community-desc", "Share and download community save checkpoints")}
      actions={
        isConfigured && (
          <Button size="sm" onClick={() => setIsShareModalOpen(true)}>
            <Upload data-icon="inline-start" />
            {t("luducard-btn-share-checkpoint", "Share Checkpoint")}
          </Button>
        )
      }
    >
      {!isConfigured ? (
        <div className="flex flex-col items-center justify-center p-8 max-w-xl mx-auto my-12 text-center rounded-2xl border border-border bg-card/60 gap-5 shadow-lg backdrop-blur-md">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Database className="size-6 animate-pulse" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold">{t("luducard-repo-disconnected", "Community Repository Disconnected")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("luducard-repo-disconnected-desc", "To load community checkpoints and share yours, you need to configure your Supabase URL and public Anon Key in Settings.")}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Stats banner */}
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-3.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="size-4.5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none">{checkpoints.length}</span>
                <span className="text-[11px] text-muted-foreground">{t("luducard-checkpoints", "Checkpoints")}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-3.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-sky-500/10">
                <Users className="size-4.5 text-sky-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none">
                  {new Set(checkpoints.map(c => c.userUuid)).size}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {t("luducard-contributors", "Contributors")}
                </span>
              </div>
            </div>
          </div>

          {/* Search & Sort */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="community-search"
                placeholder={t("luducard-search-placeholder", "Search by game or checkpoint...")}
                className={cn("pl-9", searchQuery && "pr-9")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label={t("luducard-clear-search", "Clear search")}
                  title={t("luducard-clear-search", "Clear search")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={sortMode === "popular" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSortMode("popular")}
              >
                <TrendingUp className="size-3.5" data-icon="inline-start" />
                {t("luducard-sort-popular", "Popular")}
              </Button>
              <Button
                variant={sortMode === "recent" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSortMode("recent")}
              >
                <Clock className="size-3.5" data-icon="inline-start" />
                {t("luducard-sort-recent-hub", "Recent")}
              </Button>
              <Button
                variant={sortMode === "size" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSortMode("size")}
              >
                <Package className="size-3.5" data-icon="inline-start" />
                {t("luducard-sort-size-hub", "Size")}
              </Button>
            </div>
          </div>

          {/* Saves List */}
          {loading ? (
            <div className="flex h-[300px] flex-col items-center justify-center gap-2">
              <RefreshCw className="size-7 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">{t("luducard-syncing-repo", "Syncing with the public repository...")}</span>
            </div>
          ) : loadError ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon" className="bg-red-500/10 text-red-400">
                  <CloudOff />
                </EmptyMedia>
                <EmptyTitle>{describeHubError(t, loadError).title}</EmptyTitle>
                <EmptyDescription>{describeHubError(t, loadError).description}</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="secondary" size="sm" onClick={loadConfigAndData}>
                  <RefreshCw className="size-3.5" data-icon="inline-start" />
                  {t("luducard-btn-try-again", "Try again")}
                </Button>
              </EmptyContent>
            </Empty>
          ) : sortedCheckpoints.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Globe />
                </EmptyMedia>
                <EmptyTitle>
                  {searchQuery ? t("luducard-no-checkpoints-found", "No checkpoints found") : t("luducard-no-checkpoints-available", "No checkpoints available")}
                </EmptyTitle>
                <EmptyDescription>
                  {searchQuery ? t("luducard-search-terms-desc", "Try searching with other terms.") : t("luducard-be-first-desc", "Be the first to share a community save!")}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {sortedCheckpoints.map((cp) => (
                <Card
                  key={cp.id}
                  className="group relative overflow-hidden transition-colors hover:border-primary/40"
                >
                  <CardContent className="p-0">
                    <div
                      className="flex gap-3.5 p-4 cursor-pointer hover:bg-muted/10 transition-colors"
                      onClick={() => setSelectedDetailCheckpoint(cp)}
                    >
                      {/* Game cover thumbnail */}
                      <div className="relative h-24 w-18 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                        <img
                          src={getGameCover(cp.gameName)}
                          alt={cp.gameName}
                          className="size-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold leading-tight">
                              {cp.title}
                            </h3>
                            <div className="mt-0.5 flex flex-wrap items-center gap-2">
                              <div className="flex items-center gap-1.5">
                                <Gamepad2 className="size-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {cp.gameName}
                                </span>
                              </div>
                            </div>

                            {/* Tags display in card */}
                            {cp.tags && cp.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {cp.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-[9px] px-1.5 py-0.2 bg-primary/5 text-primary border-primary/20 select-none">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground mt-0.5">
                          {cp.description || t("luducard-no-desc-provided", "No detailed description provided.")}
                        </p>

                        {/* Meta row */}
                        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                          <Badge variant="secondary" className="text-[10px]">
                            <Package className="mr-1 size-2.5" />
                            {formatCompactSize(cp.fileSize)}
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">
                            <Download className="mr-1 size-2.5" />
                            {cp.downloadsCount.toLocaleString(t("luducard-date-locale", "en-US"))}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {t("luducard-author-by", "by")} <strong className="text-foreground">{authorLabel(cp.authorName)}</strong> • {formatRelativeDate(cp.createdAt, t)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action bar */}
                    <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2">
                      <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <FileCheck className="size-3 text-emerald-400" />
                        <span>{t("luducard-zstd-verified", "Contains verified zstd metadata")}</span>
                      </span>
                      <Button
                        size="sm"
                        disabled={importing === cp.id}
                        onClick={() => handleInstallCheckpoint(cp)}
                        className="h-7 text-xs"
                      >
                        {importing === cp.id ? (
                          <>
                            <RefreshCw className="size-3 animate-spin" data-icon="inline-start" />
                            {t("luducard-btn-installing", "Installing...")}
                          </>
                        ) : (
                          <>
                            <Download className="size-3" data-icon="inline-start" />
                            {t("luducard-btn-install", "Install")}
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Info footer security */}
          <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 size-4 shrink-0 text-amber-400" />
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {t("luducard-security-sandbox-title", "Automatic Safe-Crash and Sandbox Security")}
                </span>
                <span>
                  {t("luducard-security-sandbox-desc", "When installing a community checkpoint, Luducard automatically creates a safety backup of your current save before overwriting. If anything goes wrong, just restore the previous backup from history.")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Checkpoint Modal Dialog Overlay */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-lg shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200 !overflow-visible">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border">
              <div>
                <CardTitle className="text-base">{t("luducard-share-checkpoint-modal", "Share Checkpoint")}</CardTitle>
                <CardDescription className="text-xs">{t("luducard-publish-progress-desc", "Publish your progress file to the community.")}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsShareModalOpen(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handlePublish} className="flex flex-col gap-4">
                {/* Searchable Game Selector */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-xs font-semibold text-muted-foreground">{t("luducard-save-game-label", "Save Game *")}</label>

                  {!selectedGameId ? (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder={t("luducard-search-game-with-backups", "Type to search a game with backups...")}
                        value={gameSearchQuery}
                        onChange={(e) => {
                          setGameSearchQuery(e.target.value)
                          setIsGameDropdownOpen(true)
                        }}
                        onFocus={() => setIsGameDropdownOpen(true)}
                        className="pl-9"
                      />

                      {isGameDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md animate-in fade-in-50 slide-in-from-top-1 duration-100">
                          {shareableGames.length === 0 ? (
                            <div className="py-2 px-3 text-xs text-muted-foreground">{t("luducard-no-games-with-backups", "No games with backups found")}</div>
                          ) : (
                            shareableGames
                              .map(g => (
                                <button
                                  key={g.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedGameId(g.id)
                                    setIsGameDropdownOpen(false)
                                    setGameSearchQuery("")
                                  }}
                                  className="w-full text-left py-2 px-3 text-xs hover:bg-accent hover:text-accent-foreground font-medium"
                                >
                                  {g.title}
                                </button>
                              ))
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between border border-border rounded-md px-3 py-2 bg-muted/40">
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="size-4 text-primary" />
                        <span className="text-sm font-semibold">{games.find(g => g.id === selectedGameId)?.title}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedGameId("")
                          setSelectedBackupId("")
                        }}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Backup version Selector */}
                {selectedGameId && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">{t("luducard-backup-version-label", "Backup Version *")}</label>
                    {games.find(g => g.id === selectedGameId)?.backups.length === 0 ? (
                      <div className="text-xs text-red-400 bg-red-500/5 border border-red-500/10 p-2.5 rounded-lg">
                        {t("luducard-no-local-backups-desc", "No local backups made for this game yet. Create a backup in the game card first.")}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto border border-border/80 rounded-md bg-muted/10 p-2.5">
                        {games
                          .find(g => g.id === selectedGameId)
                          ?.backups.map(b => {
                            const isChecked = selectedBackupId === b.id
                            return (
                              <label
                                key={b.id}
                                className={cn(
                                  "flex items-center justify-between gap-3 p-2 rounded-md border text-xs cursor-pointer select-none transition-colors",
                                  isChecked
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "bg-background border-border hover:bg-muted/40"
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name="selected-backup"
                                    checked={isChecked}
                                    onChange={() => setSelectedBackupId(b.id)}
                                    className="size-3.5 text-primary border-border bg-muted focus:ring-primary focus:ring-1"
                                  />
                                  <span className="font-semibold text-foreground">{b.date} {t("luducard-of", "of")} {b.time}</span>
                                  <span className="text-[10px] text-muted-foreground">({b.kind})</span>
                                </div>
                                <span className="font-mono text-[10px] text-muted-foreground">{formatCompactSize(b.sizeMB * 1024 * 1024)}</span>
                              </label>
                            )
                          })}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="checkpoint-title" className="text-xs font-semibold text-muted-foreground">{t("luducard-checkpoint-title-label", "Checkpoint Title *")}</label>
                    <input
                      id="checkpoint-title"
                      type="text"
                      placeholder={t("luducard-checkpoint-title-placeholder", "E.g. Before Malenia or Level 100 100% Complete")}
                      value={checkpointTitle}
                      onChange={(e) => setCheckpointTitle(e.target.value)}
                      required
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="checkpoint-author" className="text-xs font-semibold text-muted-foreground">{t("luducard-checkpoint-author-label", "Author Name")}</label>
                    <input
                      id="checkpoint-author"
                      type="text"
                      placeholder={t("luducard-checkpoint-author-placeholder", "E.g. Anonymous")}
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="checkpoint-desc" className="text-xs font-semibold text-muted-foreground">{t("luducard-checkpoint-desc-label", "Description / Additional Notes")}</label>
                  <textarea
                    id="checkpoint-desc"
                    rows={3}
                    placeholder={t("luducard-checkpoint-desc-placeholder", "Describe details like build, level, important items or progress point.")}
                    value={checkpointDesc}
                    onChange={(e) => setCheckpointDesc(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Predefined Tags Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">{t("luducard-checkpoint-tags-label", "Checkpoint Tags")}</label>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto border border-border/80 p-2.5 rounded-md bg-muted/10">
                    {PREDEFINED_TAGS.map(tag => {
                      const active = selectedUploadTags.includes(tag.name)
                      return (
                        <button
                          key={tag.name}
                          type="button"
                          onClick={() => {
                            if (active) {
                              setSelectedUploadTags(prev => prev.filter(t => t !== tag.name))
                            } else {
                              setSelectedUploadTags(prev => [...prev, tag.name])
                            }
                          }}
                          title={tag.description}
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] border font-medium transition-colors select-none",
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

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 border-t border-border pt-4 mt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsShareModalOpen(false)}
                  >
                    {t("luducard-btn-cancel", "Cancel")}
                  </Button>
                  <Button
                    type="submit"
                    disabled={uploading || !selectedGameId || !selectedBackupId}
                    className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold"
                  >
                    {uploading ? t("luducard-btn-publishing", "Publishing...") : t("luducard-btn-publish", "Publish Checkpoint")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detail Checkpoint Modal overlay */}
      {selectedDetailCheckpoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-md shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border">
              <div>
                <CardTitle className="text-base flex items-center gap-1">
                  <Gamepad2 className="size-4.5 text-primary" />
                  {selectedDetailCheckpoint.gameName}
                </CardTitle>
                <CardDescription className="text-xs">{t("luducard-detail-modal-desc", "Viewing complete checkpoint metadata.")}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDetailCheckpoint(null)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-4.5">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground font-semibold">{t("luducard-detail-title-label", "Checkpoint Title:")}</span>
                <span className="text-sm font-bold text-foreground leading-snug">{selectedDetailCheckpoint.title}</span>
              </div>

              {selectedDetailCheckpoint.description && (
                <div className="flex flex-col gap-1 bg-muted/20 border border-border p-3 rounded-lg">
                  <span className="text-[11px] text-muted-foreground font-semibold">{t("luducard-detail-desc-label", "Progress Description:")}</span>
                  <div className="max-h-[160px] overflow-y-auto pr-1.5 scrollbar-thin">
                    <p className="text-xs leading-relaxed text-muted-foreground mt-0.5 whitespace-pre-wrap">{selectedDetailCheckpoint.description}</p>
                  </div>
                </div>
              )}

              {selectedDetailCheckpoint.tags && selectedDetailCheckpoint.tags.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] text-muted-foreground font-semibold">{t("luducard-detail-tags-label", "Tags:")}</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedDetailCheckpoint.tags.map(t => {
                      const info = PREDEFINED_TAGS.find(pt => pt.name === t)
                      return (
                        <Badge
                          key={t}
                          variant="outline"
                          title={info?.description}
                          className="text-[10px] px-2 py-0.5 bg-primary/5 text-primary border-primary/20 select-none cursor-help"
                        >
                          {t}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3.5 bg-muted/20 border border-border p-3.5 rounded-xl text-xs">
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted-foreground">{t("luducard-detail-size-label", "Compressed Size:")}</span>
                  <span className="font-semibold text-foreground">{formatCompactSize(selectedDetailCheckpoint.fileSize)}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted-foreground">{t("luducard-detail-downloads-label", "Total Downloads:")}</span>
                  <span className="font-semibold text-foreground">{selectedDetailCheckpoint.downloadsCount.toLocaleString(t("luducard-date-locale", "en-US"))}</span>
                </div>
                <div className="flex flex-col gap-0.5 mt-1">
                  <span className="text-muted-foreground">{t("luducard-detail-author-label", "Uploaded by:")}</span>
                  <span className="font-semibold text-foreground">{authorLabel(selectedDetailCheckpoint.authorName)}</span>
                </div>
                <div className="flex flex-col gap-0.5 mt-1">
                  <span className="text-muted-foreground">{t("luducard-detail-date-label", "Uploaded on:")}</span>
                  <span className="font-semibold text-foreground">
                    {new Date(selectedDetailCheckpoint.createdAt).toLocaleDateString(t("luducard-date-locale", "en-US"), { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedDetailCheckpoint(null)}
                >
                  {t("luducard-btn-close", "Close")}
                </Button>
                <Button
                  disabled={importing === selectedDetailCheckpoint.id}
                  onClick={() => {
                    handleInstallCheckpoint(selectedDetailCheckpoint)
                    setSelectedDetailCheckpoint(null)
                  }}
                  className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold flex items-center gap-1.5"
                >
                  {importing === selectedDetailCheckpoint.id ? (
                    <>
                      <RefreshCw className="size-3.5 animate-spin" />
                      {t("luducard-btn-installing", "Installing...")}
                    </>
                  ) : (
                    <>
                      <Download className="size-3.5" />
                      {t("luducard-btn-download-install", "Download & Install")}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  )
}
