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
  X,
  SlidersHorizontal,
  Cpu,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Sparkles,
  Zap,
  RotateCcw,
} from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { useLibrary } from "@/lib/library-context"
import { cn } from "@/lib/utils"
import { type CommunityPreset } from "@/lib/mock-data"
import { useI18n } from "@/lib/i18n"

const isTauri =
  typeof window !== "undefined" &&
  (window as any).__TAURI_INTERNALS__ !== undefined

interface TagInfo {
  name: string
  description: string
}

const getPredefinedPresetTags = (t: any): TagInfo[] => [
  { name: "Performance", description: t("luducard-preset-tag-desc-perf", "OtimizaÃ§Ãµes focadas em ganho de FPS e fluidez.") },
  { name: "Qualidade / Visual", description: t("luducard-preset-tag-desc-quality", "OtimizaÃ§Ãµes focadas em qualidade grÃ¡fica mÃ¡xima.") },
  { name: "Balanced", description: t("luducard-preset-tag-desc-balanced", "EquilÃ­brio ideal entre fidelidade visual e taxa de FPS.") },
  { name: "Steam Deck", description: t("luducard-preset-tag-desc-deck", "Perfil otimizado especificamente para a tela e bateria do Steam Deck/portÃ¡teis.") },
  { name: "Potato Mode", description: t("luducard-preset-tag-desc-potato", "Para rodar em PCs super antigos e notebooks modestos.") },
  { name: "Controles / Layout", description: t("luducard-preset-tag-desc-controls", "Mapeamento customizado de controles, gamepad ou hotkeys.") },
  { name: "Ray Tracing Opt", description: t("luducard-preset-tag-desc-rt", "ConfiguraÃ§Ã£o refinada com traÃ§ado de raio ativo, visando boa taxa de quadros.") },
  { name: "4K Ready", description: t("luducard-preset-tag-desc-4k", "OtimizaÃ§Ãµes focadas em TVs e monitores 4K de alta definiÃ§Ã£o.") },
  { name: "VR Ready", description: t("luducard-preset-tag-desc-vr", "ConfiguraÃ§Ãµes ajustadas para taxa de FPS ideal em realidade virtual.") }
]

interface LocalPresetOption {
  id: string
  title: string
  description: string
  cpu: string
  gpu: string
  ram: string
  files: string[]
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
  if (diffDays === 0) return t("luducard-date-today", "Hoje")
  if (diffDays === 1) return t("luducard-date-yesterday", "Ontem")
  if (diffDays < 7) return `${diffDays} ${t("luducard-date-days-ago", "dias atrÃ¡s")}`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} ${t("luducard-date-weeks-ago", "semanas atrÃ¡s")}`
  return date.toLocaleDateString(t("luducard-date-locale", "pt-BR"), { day: "2-digit", month: "short", year: "numeric" })
}

export default function PresetHub() {
  const { t } = useI18n()
  const { games } = useLibrary()
  const PREDEFINED_PRESET_TAGS = getPredefinedPresetTags(t)

  // Presets and state
  const [presets, setPresets] = useState<CommunityPreset[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortMode, setSortMode] = useState<SortMode>("popular")
  const [importingPreset, setImportingPreset] = useState<string | null>(null)

  // Safety backups local track
  const [hasSafetyPresetsBackup, setHasSafetyPresetsBackup] = useState<Record<string, boolean>>({})

  // Supabase Configuration
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("")
  const [clientUuid, setClientUuid] = useState("")
  const [isConfigured, setIsConfigured] = useState(false)

  // Share Preset Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [selectedGameId, setSelectedGameId] = useState("")
  const [gameSearchQuery, setGameSearchQuery] = useState("")
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false)
  
  // Local Presets of the selected game for sharing
  const [localPresets, setLocalPresets] = useState<LocalPresetOption[]>([])
  const [selectedLocalPresetId, setSelectedLocalPresetId] = useState("")
  
  // Upload Fields
  const [presetTitle, setPresetTitle] = useState("")
  const [presetDesc, setPresetDesc] = useState("")
  const [cpu, setCpu] = useState("")
  const [gpu, setGpu] = useState("")
  const [ram, setRam] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [uploading, setUploading] = useState(false)
  const [selectedDetailPreset, setSelectedDetailPreset] = useState<any | null>(null)
  const [selectedUploadTags, setSelectedUploadTags] = useState<string[]>([])

  const loadConfigAndData = async () => {
    setLoading(true)
    if (!isTauri) {
      // Offline fallback
      setSupabaseUrl("mock")
      setSupabaseAnonKey("mock")
      setIsConfigured(true)

      const { mockPresets } = await import("@/lib/mock-data")
      setPresets(mockPresets)
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

        const resPresets = await fetch(`${url}/rest/v1/public_presets?select=*`, {
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`
          }
        })
        if (resPresets.ok) {
          const data = await resPresets.json()
          const mapped = data.map((item: any) => ({
            id: item.id,
            gameName: item.game_name,
            gameId: item.game_id,
            title: item.title,
            fileName: item.file_name,
            r2Path: item.r2_path,
            fileSize: Number(item.file_size || 0),
            description: item.description || "",
            authorName: item.author_name || "AnÃ´nimo",
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
        }
      } else {
        setIsConfigured(false)
        const { mockPresets } = await import("@/lib/mock-data")
        setPresets(mockPresets)
      }
    } catch (err) {
      console.error(err)
      toast.error("Erro ao carregar dados do hub de presets.")
    } finally {
      setLoading(false)
    }
  }

  const checkSafetyBackups = () => {
    const status: Record<string, boolean> = {}
    games.forEach(g => {
      status[g.id] = localStorage.getItem(`luducard_preset_safety_${g.id}`) === "true"
    })
    setHasSafetyPresetsBackup(status)
  }

  useEffect(() => {
    loadConfigAndData()
  }, [])

  useEffect(() => {
    checkSafetyBackups()
  }, [games])

  // Load local presets when a game is selected in share form
  useEffect(() => {
    const fetchLocalPresets = async () => {
      if (!selectedGameId || !isTauri) {
        setLocalPresets([])
        return
      }
      try {
        const { invoke } = await import("@tauri-apps/api/core")
        const list = await invoke<LocalPresetOption[]>("list_local_presets", {
          gameId: selectedGameId
        })
        setLocalPresets(list)
      } catch (err) {
        console.error("Erro ao listar presets locais:", err)
      }
    }
    fetchLocalPresets()
  }, [selectedGameId])

  // Fill upload form when a local preset is selected
  useEffect(() => {
    if (!selectedLocalPresetId) return
    const match = localPresets.find(p => p.id === selectedLocalPresetId)
    if (match) {
      setPresetTitle(match.title)
      setPresetDesc(match.description)
      setCpu(match.cpu)
      setGpu(match.gpu)
      setRam(match.ram)
    }
  }, [selectedLocalPresetId])

  useEffect(() => {
    if (!isShareModalOpen) {
      setSelectedGameId("")
      setGameSearchQuery("")
      setIsGameDropdownOpen(false)
      setLocalPresets([])
      setSelectedLocalPresetId("")
      setPresetTitle("")
      setPresetDesc("")
      setCpu("")
      setGpu("")
      setRam("")
      setAuthorName("")
      setSelectedUploadTags([])
    }
  }, [isShareModalOpen])

  // Filters & Sorting
  const filteredPresets = presets.filter((p) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      p.gameName.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.gpu.toLowerCase().includes(q) ||
      p.cpu.toLowerCase().includes(q)
    )
  })

  const sortedPresets = [...filteredPresets].sort((a, b) => {
    if (sortMode === "popular") return b.downloadsCount - a.downloadsCount
    if (sortMode === "recent")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (sortMode === "size") return a.fileSize - b.fileSize
    return 0
  })

  const getGameCover = (gameName: string): string => {
    const match = games.find(
      (g) => g.title.toLowerCase() === gameName.toLowerCase()
    )
    return match?.cover || "/placeholder.svg"
  }

  // Inject / Apply Preset
  const handleInstallPreset = async (preset: CommunityPreset) => {
    if (!isConfigured) return

    setImportingPreset(preset.id)
    const toastId = toast.loading(`Iniciando Seguro-Crash para configuraÃ§Ãµes de ${preset.gameName}...`)
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      const matchedGame = games.find(
        (g) => g.title.toLowerCase() === preset.gameName.toLowerCase()
      )

      if (!matchedGame?.savePath) {
        toast.error(
          `Jogo "${preset.gameName}" nÃ£o encontrado na sua biblioteca local ou sem pasta de saves configurada.`,
          { id: toastId }
        )
        setImportingPreset(null)
        return
      }

      // 1. Create safety backup
      if (isTauri) {
        await invoke("create_preset_safety_backup", {
          gameTitle: matchedGame.title,
          gameId: matchedGame.id,
        })
        localStorage.setItem(`luducard_preset_safety_${matchedGame.id}`, "true")
        setHasSafetyPresetsBackup(prev => ({ ...prev, [matchedGame.id]: true }))
      }

      toast.loading(`Instalando preset "${preset.title}"...`, { id: toastId })

      // 2. Fetch presigned url
      const edgeRes = await fetch(`${supabaseUrl}/functions/v1/get-download-url`, {
        method: "POST",
        headers: {
          "apikey": supabaseAnonKey,
          "Authorization": `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ r2_path: preset.r2Path })
      })

      if (!edgeRes.ok) {
        throw new Error(`Falha ao obter URL de download: ${edgeRes.statusText}`)
      }

      const { downloadUrl } = await edgeRes.json()

      // 3. Download and inject config
      await invoke("download_and_import_luducard", {
        downloadUrl,
        targetSaveDir: matchedGame.savePath,
      })

      // 4. Save this downloaded preset to local presets cache so they can swap back
      await invoke("save_local_preset", {
        gameId: matchedGame.id,
        gameTitle: matchedGame.title,
        title: preset.title,
        description: `${preset.description} (Baixado da comunidade - Autor: ${preset.authorName})`,
        files: preset.tags, /* We store files list or tag list safely */
      }).catch(err => console.error("Erro ao salvar preset baixado localmente:", err))

      // 5. Increment download stats
      await fetch(`${supabaseUrl}/rest/v1/rpc/increment_preset_downloads`, {
        method: "POST",
        headers: {
          "apikey": supabaseAnonKey,
          "Authorization": `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ preset_id: preset.id })
      })

      toast.success(
        `Preset aplicado e guardado em seus presets locais. Seguro-Crash ativo!`,
        { id: toastId }
      )
      loadConfigAndData()
    } catch (err) {
      console.error(err)
      toast.error(`Falha ao injetar preset: ${err}`, { id: toastId })
    } finally {
      setImportingPreset(null)
    }
  }

  // Revert Preset / Undo
  const handleUndoPreset = async (gameId: string, gameTitle: string) => {
    const toastId = toast.loading(`Restaurando configuraÃ§Ãµes originais de "${gameTitle}"...`)
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      if (isTauri) {
        await invoke("restore_preset_safety_backup", {
          gameId: gameId,
        })
      }
      localStorage.removeItem(`luducard_preset_safety_${gameId}`)
      setHasSafetyPresetsBackup(prev => ({ ...prev, [gameId]: false }))
      toast.success(`ConfiguraÃ§Ãµes de "${gameTitle}" restauradas. Saves intocados!`, { id: toastId })
    } catch (err) {
      console.error(err)
      toast.error(`Falha ao reverter configs: ${err}`, { id: toastId })
    }
  }

  // Voting
  const handleVotePreset = async (presetId: string, isUpvote: boolean) => {
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
      toast.success("Voto registrado!")
      
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
      toast.error("Erro ao computar voto.")
    }
  }

  // Reporting
  const handleReportPreset = async (presetId: string) => {
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
      toast.success("DenÃºncia enviada! Presets com 3+ denÃºncias sÃ£o ocultados.")
      setPresets(prev => prev.filter(p => p.id !== presetId))
    } catch (err) {
      toast.error("Falha ao denunciar.")
    }
  }

  // Upload Preset Form Submit
  const handlePublishPreset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGameId || !selectedLocalPresetId || !presetTitle) {
      toast.error("Por favor, preencha todos os campos obrigatÃ³rios.")
      return
    }

    setUploading(true)
    const selectedGame = games.find(g => g.id === selectedGameId)
    if (!selectedGame) return

    let tempZipPath = ""
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      const toastId = toast.loading("Compactando e criptografando arquivos de configuraÃ§Ã£o...")

      // Step 1: Pack preset files to temporary `.luducard` archive
      const tempInfo = await invoke<any>("export_local_preset_archive", {
        gameId: selectedGame.id,
        presetId: selectedLocalPresetId,
        savePath: selectedGame.savePath,
      })

      tempZipPath = tempInfo.filePath
      const fileSize = tempInfo.fileSize
      const fileName = tempInfo.fileName

      toast.loading("Requisitando permissÃ£o de upload seguro...", { id: toastId })

      // Step 2: Get upload Presigned URL
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
        throw new Error(errData.error || `Erro de cota de armazenamento na nuvem.`);
      }

      const { uploadUrl, r2Path } = await edgeRes.json()

      toast.loading(`Enviando preset para a nuvem (${formatCompactSize(fileSize)})...`, { id: toastId })

      // Step 3: Run Rust direct upload
      await invoke("upload_file_to_url", {
        filePath: tempZipPath,
        uploadUrl: uploadUrl,
      })

      toast.loading("Publicando metadados no repositÃ³rio de presets...", { id: toastId })

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
          game_name: selectedGame.title,
          game_id: selectedGame.id,
          title: presetTitle,
          file_name: fileName,
          r2_path: r2Path,
          file_size: fileSize,
          description: presetDesc,
          author_name: authorName || "AnÃ´nimo",
          user_uuid: clientUuid,
          cpu: cpu,
          gpu: gpu,
          ram: ram,
          tags: selectedUploadTags,
        })
      })

      if (!dbRes.ok) {
        const errText = await dbRes.text()
        if (errText.includes("enforce_user_preset_quota_trigger")) {
          throw new Error("VocÃª jÃ¡ atingiu o limite de 5 presets ativos na nuvem.")
        }
        throw new Error(`Falha ao registrar preset: ${errText}`)
      }

      toast.success("Preset publicado no HUB com sucesso!", { id: toastId })
      setIsShareModalOpen(false)
      loadConfigAndData()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || `Erro ao publicar preset: ${err}`)
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
      title={t("luducard-presethub-title", "Preset Share HUB")}
      description={t("luducard-presethub-desc", "Descubra e compartilhe otimizaÃ§Ãµes de grÃ¡ficos e controles da comunidade")}
      actions={
        isConfigured && (
          <Button size="sm" onClick={() => setIsShareModalOpen(true)}>
            <Upload data-icon="inline-start" />
            {t("luducard-btn-share-preset", "Compartilhar Preset")}
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
            <h2 className="text-lg font-bold">{t("luducard-presethub-disconnected", "RepositÃ³rio de Presets Desconectado")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("luducard-presethub-disconnected-desc", "NÃ£o foi possÃ­vel conectar ao servidor de presets comunitÃ¡rios. Verifique sua conexÃ£o com a internet.")}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-3.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <SlidersHorizontal className="size-4.5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none">{presets.length}</span>
                <span className="text-[11px] text-muted-foreground">{t("luducard-presets", "Presets")}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-3.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-sky-500/10">
                <Users className="size-4.5 text-sky-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none">
                  {new Set(presets.map(p => p.userUuid)).size}
                </span>
                <span className="text-[11px] text-muted-foreground">{t("luducard-contributors", "Contribuidores")}</span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="preset-search"
                placeholder={t("luducard-preset-search-placeholder", "Buscar por jogo, tÃ­tulo ou hardware (ex: RTX 4070)...")}
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                {t("luducard-sort-recent-hub", "Recentes")}
              </Button>
              <Button
                variant={sortMode === "size" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSortMode("size")}
              >
                <Package className="size-3.5" data-icon="inline-start" />
                {t("luducard-sort-size-hub", "Tamanho")}
              </Button>
            </div>
          </div>

          {/* Presets Grid */}
          {loading ? (
            <div className="flex h-[300px] flex-col items-center justify-center gap-2">
              <RefreshCw className="size-7 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">{t("luducard-syncing-presets", "Sincronizando presets...")}</span>
            </div>
          ) : sortedPresets.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <SlidersHorizontal />
                </EmptyMedia>
                <EmptyTitle>
                  {presets.length === 0 
                    ? "Aqui ainda nÃ£o tem presets" 
                    : t("luducard-no-presets-found", "Nenhum preset grÃ¡fico encontrado")}
                </EmptyTitle>
                <EmptyDescription>
                  {presets.length === 0 
                    ? "Seja o primeiro a compartilhar um preset grÃ¡fico ou de controles para a comunidade!" 
                    : t("luducard-search-terms-desc-preset", "Tente redefinir seus termos de busca.")}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {sortedPresets.map((p) => {
                const matchedGame = games.find(g => g.title.toLowerCase() === p.gameName.toLowerCase())
                const isInstalledLocally = !!matchedGame
                const isUndoActive = matchedGame ? hasSafetyPresetsBackup[matchedGame.id] : false

                const approval = p.upvotes + p.downvotes > 0
                  ? Math.round((p.upvotes / (p.upvotes + p.downvotes)) * 100)
                  : 100

                return (
                  <Card key={p.id} className={cn("group relative overflow-hidden transition-colors hover:border-primary/40", p.isOfficial && "border-primary/25 bg-primary/2")}>
                    <CardContent className="p-0 flex flex-col h-full justify-between">
                      {/* Top Clickable Area */}
                      <div 
                        className="flex gap-3.5 p-4 cursor-pointer hover:bg-muted/10 transition-colors flex-1"
                        onClick={() => setSelectedDetailPreset(p)}
                      >
                        {/* Game cover thumbnail */}
                        <div className="relative h-24 w-18 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                          <img
                            src={getGameCover(p.gameName)}
                            alt={p.gameName}
                            className="size-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold leading-tight flex items-center gap-1.5">
                              {p.title}
                              {p.isOfficial && (
                                <Badge variant="outline" className="text-[9px] font-bold text-primary border-primary/35 bg-primary/10 select-none uppercase shrink-0">
                                  <Sparkles className="size-2 ml-0.5 fill-current" />
                                  {t("luducard-badge-official", "Oficial")}
                                </Badge>
                              )}
                            </h3>
                            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                              <Gamepad2 className="size-3.5 text-primary shrink-0" />
                              <span className="truncate">{p.gameName}</span>
                            </div>

                            {/* Tags display in card */}
                            {p.tags && p.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {p.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-[9px] px-1.5 py-0.2 bg-primary/5 text-primary border-primary/20 select-none shrink-0">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          <p className="line-clamp-1 text-xs leading-relaxed text-muted-foreground mt-0.5">
                            {p.description || t("luducard-no-desc-provided", "Nenhuma descriÃ§Ã£o fornecida.")}
                          </p>

                          {/* Hardware / Author mini row */}
                          <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1 text-[10px] text-muted-foreground font-medium">
                            <span className="font-mono bg-muted px-1.5 py-0.5 rounded border border-border/80 truncate max-w-[200px]" title={`${p.cpu} | ${p.gpu} | ${p.ram}`}>
                              <Cpu className="inline-block size-3 mr-0.5 text-primary -translate-y-0.5" />
                              {p.gpu || t("luducard-gpu", "GPU")}
                            </span>
                            <span>â€¢</span>
                            <span>{p.authorName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action & Voting Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1" title={t("luducard-approval", "AprovaÃ§Ã£o")}>
                            <ThumbsUp className="size-3 text-primary" />
                            <span className="font-semibold text-foreground">{approval}%</span>
                            <span className="text-[10px] text-muted-foreground">({p.downloadsCount})</span>
                          </div>

                          <div className="flex items-center gap-0.5 border border-border rounded bg-background overflow-hidden shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVotePreset(p.id, true);
                              }}
                              className="p-1 hover:bg-primary/10 hover:text-primary transition-colors border-r border-border"
                              title={t("luducard-useful", "Ãštil")}
                            >
                              <ThumbsUp className="size-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVotePreset(p.id, false);
                              }}
                              className="p-1 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                              title={t("luducard-useless", "InÃºtil")}
                            >
                              <ThumbsDown className="size-3" />
                            </button>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReportPreset(p.id);
                            }}
                            className="p-1 text-muted-foreground hover:text-red-400 hover:bg-red-500/5 rounded transition-colors"
                            title={t("luducard-report-preset", "Denunciar preset")}
                          >
                            <AlertTriangle className="size-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isUndoActive && matchedGame && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUndoPreset(matchedGame.id, matchedGame.title);
                              }}
                              className="h-7 text-[10px] font-semibold"
                            >
                              <RotateCcw className="size-3" data-icon="inline-start" />
                              {t("luducard-btn-undo", "Desfazer")}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            disabled={!isInstalledLocally || importingPreset === p.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInstallPreset(p);
                            }}
                            className="h-7 text-[10px] bg-primary hover:bg-primary/95 text-primary-foreground font-semibold"
                          >
                            {importingPreset === p.id ? (
                              <>
                                <RefreshCw className="size-2.5 animate-spin" data-icon="inline-start" />
                                {t("luducard-btn-injecting", "Injetando...")}
                              </>
                            ) : (
                              <>
                                <Zap className="size-2.5 fill-current" data-icon="inline-start" />
                                {isInstalledLocally ? t("luducard-btn-inject", "Injetar") : t("luducard-not-installed", "NÃ£o Instalado")}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Safe info */}
          <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 size-4 shrink-0 text-amber-400" />
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{t("luducard-security-safety-title", "SeguranÃ§a Garantida pelo Seguro-Crash")}</span>
                <span>
                  {t("luducard-security-safety-desc", "Ao baixar qualquer preset grÃ¡fico do HUB, o Luducard faz backup das suas configuraÃ§Ãµes anteriores. Os seus saves de progresso permanecem intocados.")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Preset Modal overlay */}
      {selectedDetailPreset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-md shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border">
              <div>
                <CardTitle className="text-base flex items-center gap-1.5">
                  <Gamepad2 className="size-4.5 text-primary" />
                  {selectedDetailPreset.gameName}
                </CardTitle>
                <CardDescription className="text-xs">{t("luducard-detail-modal-desc", "Visualizando metadados completos do preset.")}</CardDescription>
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
                <span className="text-xs text-muted-foreground font-semibold font-medium">{t("luducard-detail-preset-title", "TÃ­tulo do Preset:")}</span>
                <span className="text-sm font-bold text-foreground leading-snug">{selectedDetailPreset.title}</span>
              </div>

              {selectedDetailPreset.description && (
                <div className="flex flex-col gap-1 bg-muted/20 border border-border p-3 rounded-lg">
                  <span className="text-[11px] text-muted-foreground font-semibold">{t("luducard-detail-preset-desc", "DescriÃ§Ã£o / OtimizaÃ§Ãµes:")}</span>
                  <div className="max-h-[160px] overflow-y-auto pr-1.5 scrollbar-thin">
                    <p className="text-xs leading-relaxed text-muted-foreground mt-0.5 whitespace-pre-wrap">{selectedDetailPreset.description}</p>
                  </div>
                </div>
              )}

              {selectedDetailPreset.tags && selectedDetailPreset.tags.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] text-muted-foreground font-semibold">{t("luducard-detail-tags-label", "Marcadores:")}</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedDetailPreset.tags.map((t: string) => {
                      const info = PREDEFINED_PRESET_TAGS.find(pt => pt.name === t)
                      return (
                        <Badge
                          key={t}
                          variant="outline"
                          title={info?.description}
                          className="text-[10px] px-2 py-0.5 bg-primary/5 text-primary border-primary/20 select-none cursor-help font-semibold"
                        >
                          {t}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 bg-muted/20 border border-border p-3.5 rounded-xl text-xs">
                <div className="flex flex-col gap-0.5 col-span-2">
                  <span className="text-muted-foreground font-semibold">{t("luducard-detail-author-specs", "EspecificaÃ§Ãµes do Autor:")}</span>
                  <span className="font-mono text-foreground mt-0.5 leading-relaxed">
                    {selectedDetailPreset.cpu ? `${selectedDetailPreset.cpu} | ` : ""}{selectedDetailPreset.gpu ? `${selectedDetailPreset.gpu} | ` : ""}{selectedDetailPreset.ram || ""}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 mt-1">
                  <span className="text-muted-foreground">{t("luducard-detail-size-label", "Tamanho Comprimido:")}</span>
                  <span className="font-semibold text-foreground">{formatCompactSize(selectedDetailPreset.fileSize)}</span>
                </div>
                <div className="flex flex-col gap-0.5 mt-1">
                  <span className="text-muted-foreground">{t("luducard-detail-downloads-label", "Total Downloads:")}</span>
                  <span className="font-semibold text-foreground">{selectedDetailPreset.downloadsCount.toLocaleString(t("luducard-date-locale", "pt-BR"))}</span>
                </div>
                <div className="flex flex-col gap-0.5 mt-1">
                  <span className="text-muted-foreground">{t("luducard-detail-author-label", "Enviado por:")}</span>
                  <span className="font-semibold text-foreground">{selectedDetailPreset.authorName}</span>
                </div>
                <div className="flex flex-col gap-0.5 mt-1">
                  <span className="text-muted-foreground">{t("luducard-detail-date-label", "Enviado em:")}</span>
                  <span className="font-semibold text-foreground">
                    {new Date(selectedDetailPreset.createdAt).toLocaleDateString(t("luducard-date-locale", "pt-BR"), { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Share Preset Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-lg shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200 !overflow-visible">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border">
              <div>
                <CardTitle className="text-base">{t("luducard-share-preset-modal-title", "Compartilhar Preset GrÃ¡fico")}</CardTitle>
                <CardDescription className="text-xs">{t("luducard-share-preset-modal-desc", "Envie um preset grÃ¡fico local para a comunidade.")}</CardDescription>
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
              <form onSubmit={handlePublishPreset} className="flex flex-col gap-4">
                {/* Searchable Game Selector */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-xs font-semibold text-muted-foreground">{t("luducard-preset-game-label", "Jogo do Preset *")}</label>
                  {!selectedGameId ? (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder={t("luducard-search-installed-game-preset", "Pesquisar jogo instalado...")}
                        value={gameSearchQuery}
                        onChange={(e) => {
                          setGameSearchQuery(e.target.value)
                          setIsGameDropdownOpen(true)
                        }}
                        onFocus={() => setIsGameDropdownOpen(true)}
                        className="pl-9"
                      />
                      {isGameDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md">
                          {games
                            .filter(g => g.installed && (!gameSearchQuery || g.title.toLowerCase().includes(gameSearchQuery.toLowerCase())))
                            .length === 0 ? (
                            <div className="py-2 px-3 text-xs text-muted-foreground">{t("luducard-no-games-found", "Nenhum jogo encontrado")}</div>
                          ) : (
                            games
                              .filter(g => g.installed && (!gameSearchQuery || g.title.toLowerCase().includes(gameSearchQuery.toLowerCase())))
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
                          setSelectedLocalPresetId("")
                          setLocalPresets([])
                        }}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Local Preset Selector */}
                {selectedGameId && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">{t("luducard-choose-local-preset-label", "Escolher Preset Local *")}</label>
                    {localPresets.length === 0 ? (
                      <div className="text-xs text-amber-400 bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-lg flex items-center gap-2">
                        <SlidersHorizontal className="size-4 shrink-0 text-amber-400" />
                        {t("luducard-no-local-presets-desc", "Nenhum preset local salvo para este jogo. VÃ¡ na aba do jogo e crie um preset local primeiro!")}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto border border-border/80 rounded-md bg-muted/10 p-2.5">
                        {localPresets.map(p => {
                          const isChecked = selectedLocalPresetId === p.id
                          return (
                            <label
                              key={p.id}
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
                                    name="selected-local-preset"
                                    checked={isChecked}
                                    onChange={() => setSelectedLocalPresetId(p.id)}
                                    className="size-3.5 text-primary border-border bg-muted focus:ring-primary focus:ring-1"
                                  />
                                  <span className="font-semibold text-foreground">{p.title}</span>
                                </div>
                                <span className="font-mono text-[10px] text-muted-foreground">{p.gpu}</span>
                              </label>
                            )
                          })}
                      </div>
                    )}
                  </div>
                )}

                {/* Form fields filled from manifest */}
                {selectedLocalPresetId && (
                  <>
                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="preset-title" className="text-xs font-semibold text-muted-foreground">{t("luducard-preset-title-label", "TÃ­tulo do Preset *")}</label>
                        <input
                          id="preset-title"
                          type="text"
                          value={presetTitle}
                          onChange={(e) => setPresetTitle(e.target.value)}
                          required
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="preset-author" className="text-xs font-semibold text-muted-foreground">{t("luducard-preset-creator-label", "Autor / Criador")}</label>
                        <input
                          id="preset-author"
                          type="text"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="preset-desc" className="text-xs font-semibold text-muted-foreground">{t("luducard-preset-desc-label", "DescriÃ§Ã£o / Notas do Preset")}</label>
                      <textarea
                        id="preset-desc"
                        rows={2}
                        value={presetDesc}
                        onChange={(e) => setPresetDesc(e.target.value)}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    {/* Predefined Tags Selector */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">{t("luducard-preset-tags-label", "Tags do Preset")}</label>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto border border-border/80 p-2.5 rounded-md bg-muted/10">
                        {PREDEFINED_PRESET_TAGS.map(tag => {
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

                    {/* Hardware Info prefilled */}
                    <div className="flex flex-col gap-2 border border-border rounded-xl p-3 bg-muted/10">
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <Cpu className="size-3.5 text-primary" />
                        {t("luducard-preset-hardware-label", "Hardware do Autor (Auto-preenchido do preset local):")}
                      </span>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-semibold text-muted-foreground">{t("luducard-cpu", "CPU")}</span>
                          <input
                            type="text"
                            value={cpu}
                            onChange={(e) => setCpu(e.target.value)}
                            className="w-full rounded border border-border bg-background px-2 py-1 text-xs font-mono"
                          />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-semibold text-muted-foreground">{t("luducard-gpu", "GPU")}</span>
                          <input
                            type="text"
                            value={gpu}
                            onChange={(e) => setGpu(e.target.value)}
                            className="w-full rounded border border-border bg-background px-2 py-1 text-xs font-mono"
                          />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-semibold text-muted-foreground">{t("luducard-ram", "RAM")}</span>
                          <input
                            type="text"
                            value={ram}
                            onChange={(e) => setRam(e.target.value)}
                            className="w-full rounded border border-border bg-background px-2 py-1 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2 border-t border-border pt-4 mt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsShareModalOpen(false)}
                  >
                    {t("luducard-btn-cancel", "Cancelar")}
                  </Button>
                  <Button
                    type="submit"
                    disabled={uploading || !selectedGameId || !selectedLocalPresetId}
                    className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold"
                  >
                    {uploading ? t("luducard-btn-publishing", "Publicando...") : t("luducard-btn-publish-preset", "Publicar Preset")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  )
}
