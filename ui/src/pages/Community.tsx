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
  Key,
  X,
  FileCheck,
} from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { useLibrary } from "@/lib/library-context"

const isTauri =
  typeof window !== "undefined" &&
  (window as any).__TAURI_INTERNALS__ !== undefined

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
}

type SortMode = "popular" | "recent" | "size"

function formatCompactSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return "Hoje"
  if (diffDays === 1) return "Ontem"
  if (diffDays < 7) return `${diffDays} dias atrás`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
}

function slugify(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function Community() {
  const { games } = useLibrary()
  
  // Search, sort, checkpoints
  const [checkpoints, setCheckpoints] = useState<CommunityCheckpoint[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortMode, setSortMode] = useState<SortMode>("popular")
  const [importing, setImporting] = useState<string | null>(null)

  // Supabase Configuration
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("")
  const [clientUuid, setClientUuid] = useState("")
  const [isConfigured, setIsConfigured] = useState(false)

  // Modal Share State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [selectedGameId, setSelectedGameId] = useState("")
  const [selectedSavePath, setSelectedSavePath] = useState("")
  const [checkpointTitle, setCheckpointTitle] = useState("")
  const [checkpointDesc, setCheckpointDesc] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [uploading, setUploading] = useState(false)

  // Load Settings and Checkpoints
  const loadConfigAndData = async () => {
    setLoading(true)
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
          fileName: "elden-ring.ludocard",
          r2Path: "saves/elden-ring/cp1.ludocard",
          fileSize: 36000000,
          description: "Savegame no New Game+ com todas as armas, cinzas de guerra e armaduras do jogo.",
          authorName: "TarnishedOne",
          userUuid: "mock-user",
          downloadsCount: 1450,
          createdAt: "2026-06-25T12:00:00Z",
        }
      ])
      setLoading(false)
      return
    }

    try {
      const { invoke } = await import("@tauri-apps/api/core")
      const settings = await invoke<any>("get_settings")
      console.log("Community: get_settings returned", settings)
      const uuid = await invoke<string>("get_client_uuid")
      
      const url = settings.supabaseUrl || ""
      const key = settings.supabaseAnonKey || ""
      
      setSupabaseUrl(url)
      setSupabaseAnonKey(key)
      setClientUuid(uuid)

      if (url && key) {
        setIsConfigured(true)
        console.log("Community: Configured successfully. Fetching database...")
        // Fetch public saves from Supabase
        const response = await fetch(`${url}/rest/v1/public_saves?select=*`, {
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          console.log("Community: Fetched checkpoints", data)
          const mapped = data.map((item: any) => ({
            id: item.id,
            gameName: item.game_name,
            title: item.title,
            fileName: item.file_name,
            r2Path: item.r2_path,
            fileSize: Number(item.file_size || 0),
            description: item.description || "",
            authorName: item.author_name || "Anônimo",
            userUuid: item.user_uuid,
            downloadsCount: Number(item.downloads_count || 0),
            createdAt: item.created_at,
          }))
          setCheckpoints(mapped)
        } else {
          console.error("Failed to fetch checkpoints from Supabase:", response.statusText)
          toast.error("Erro ao carregar checkpoints do banco Supabase.")
        }
      } else {
        console.warn("Community: url or key is empty", { url, key })
        setIsConfigured(false)
      }
    } catch (err) {
      console.error("Error reading configuration:", err)
      toast.error("Erro de conexão com o backend do app.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConfigAndData()
  }, [])

  // Filter & Sort
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

  const getGameCover = (gameName: string): string => {
    const match = games.find(
      (g) => g.title.toLowerCase() === gameName.toLowerCase()
    )
    return match?.cover || "/placeholder.svg"
  }

  // Install Checkpoint
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
        throw new Error(`Falha ao obter URL de download: ${edgeRes.statusText}`)
      }

      const { downloadUrl } = await edgeRes.json()

      // Step 2: Find target save path
      const matchedGame = games.find(
        (g) => g.title.toLowerCase() === checkpoint.gameName.toLowerCase()
      )

      if (!matchedGame?.savePath) {
        toast.error(
          `Jogo "${checkpoint.gameName}" não encontrado na sua biblioteca local ou sem pasta de saves configurada.`,
          { id: toastId }
        )
        setImporting(null)
        return
      }

      toast.loading(`Baixando e instalando checkpoint... O Seguro-Crash criará um backup automático.`, { id: toastId })

      // Step 3: Run Rust download + import command
      await invoke("download_and_import_ludocard", {
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
        `Checkpoint "${checkpoint.title}" instalado com sucesso! Backup do save anterior guardado no histórico.`,
        { id: toastId }
      )
      loadConfigAndData()
    } catch (err) {
      console.error(err)
      toast.error(`Falha ao baixar/instalar checkpoint: ${err}`)
    } finally {
      setImporting(null)
    }
  }

  // File Picker for Upload
  const handlePickFile = async () => {
    if (!isTauri) return
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      const gameMatch = games.find(g => g.id === selectedGameId)
      const startDir = gameMatch?.savePath || null

      const path = await invoke<string | null>("select_save_file", {
        startDir,
      })
      if (path) {
        setSelectedSavePath(path)
      }
    } catch (err) {
      toast.error(`Erro ao selecionar arquivo: ${err}`)
    }
  }

  // Publish Checkpoint
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGameId || !selectedSavePath || !checkpointTitle) {
      toast.error("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    setUploading(true)
    const selectedGame = games.find(g => g.id === selectedGameId)
    if (!selectedGame) return

    let tempZipPath = ""
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      const toastId = toast.loading("Comprimindo arquivos de save com zstd...")

      // Step 1: Pack the save locally to a temporary .ludocard file
      const tempSaveInfo = await invoke<any>("export_temp_ludocard_save", {
        gameTitle: selectedGame.title,
        gameId: selectedGame.id,
        checkpointTitle: checkpointTitle,
        description: checkpointDesc,
        sourcePath: selectedSavePath,
      })

      tempZipPath = tempSaveInfo.filePath
      const fileSize = tempSaveInfo.fileSize
      const fileName = tempSaveInfo.fileName

      toast.loading("Solicitando permissão de upload seguro na nuvem...", { id: toastId })

      // Step 2: Get presigned upload URL from Edge Function
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
        throw new Error(errData.error || `Erro de cota/limite de armazenamento na nuvem.`);
      }

      const { uploadUrl, r2Path } = await edgeRes.json()

      toast.loading(`Fazendo upload seguro (${formatCompactSize(fileSize)})...`, { id: toastId })

      // Step 3: Run Rust direct upload
      await invoke("upload_file_to_url", {
        filePath: tempZipPath,
        uploadUrl: uploadUrl,
      })

      toast.loading("Publicando metadados no repositório público...", { id: toastId })

      // Step 4: Write metadata record to public_saves table
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
          author_name: authorName || "Anônimo",
          user_uuid: clientUuid,
        })
      })

      if (!dbRes.ok) {
        const errText = await dbRes.text()
        if (errText.includes("enforce_user_save_quota_trigger")) {
          throw new Error("Você já atingiu o limite de 5 checkpoints ativos na nuvem.")
        }
        throw new Error(`Falha ao registrar checkpoint no banco: ${errText}`)
      }

      toast.success("Checkpoint compartilhado na comunidade com sucesso!", { id: toastId })
      setIsShareModalOpen(false)
      
      // Clean up modal states
      setSelectedGameId("")
      setSelectedSavePath("")
      setCheckpointTitle("")
      setCheckpointDesc("")
      setAuthorName("")

      loadConfigAndData()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || `Erro ao publicar: ${err}`)
    } finally {
      if (tempZipPath && isTauri) {
        const { invoke } = await import("@tauri-apps/api/core")
        const _ = invoke("delete_temp_file", { filePath: tempZipPath })
      }
      setUploading(false)
    }
  }

  // Import local save dialog handler
  const handleImportLocal = async () => {
    if (!isTauri) return
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      const archivePath = await invoke<string | null>("open_ludocard_dialog")
      if (!archivePath) return

      // Read metadata to preview
      const metadata = await invoke<any>("read_ludocard_metadata", {
        archivePath,
      })

      const matchedGame = games.find(
        (g) => g.title.toLowerCase() === metadata.gameTitle.toLowerCase()
      )

      if (!matchedGame?.savePath) {
        toast.error(
          `Jogo "${metadata.gameTitle}" correspondente ao arquivo não está instalado ou configurado na biblioteca.`
        )
        return
      }

      if (
        confirm(
          `Deseja instalar o save local "${metadata.checkpointTitle}" para ${metadata.gameTitle}?\n\nIsso substituirá seus saves atuais. O Seguro-Crash gerará um backup.`
        )
      ) {
        const toastId = toast.loading("Restaurando save a partir do arquivo...")
        await invoke("import_ludocard_save", {
          archivePath,
          targetSaveDir: matchedGame.savePath,
        })
        toast.success("Save importado com sucesso!", { id: toastId })
      }
    } catch (err) {
      toast.error(`Falha ao importar save local: ${err}`)
    }
  }

  return (
    <AppShell
      title="Comunidade"
      description="Compartilhe e baixe checkpoints de saves"
      actions={
        isConfigured && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleImportLocal}>
              Importar .ludocard
            </Button>
            <Button size="sm" onClick={() => setIsShareModalOpen(true)}>
              <Upload data-icon="inline-start" />
              Compartilhar Checkpoint
            </Button>
          </div>
        )
      }
    >
      {!isConfigured ? (
        <div className="flex flex-col items-center justify-center p-8 max-w-xl mx-auto my-12 text-center rounded-2xl border border-border bg-card/60 gap-5 shadow-lg backdrop-blur-md">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Database className="size-6 animate-pulse" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold">Repositório Comunitário Desconectado</h2>
            <p className="text-sm text-muted-foreground">
              Para carregar os checkpoints comunitários e compartilhar os seus, você precisa configurar a URL do seu Supabase e a Anon Key pública na aba de Configurações.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full border-t border-border pt-4 text-xs text-left text-muted-foreground gap-2">
            <span className="font-semibold text-foreground">Como configurar:</span>
            <ol className="list-decimal pl-4 flex flex-col gap-1">
              <li>Crie um projeto gratuito no <strong>Supabase</strong>.</li>
              <li>Crie as tabelas executando o script SQL que geramos no arquivo <code className="font-mono text-primary bg-primary/10 px-1 rounded">supabase/schema.sql</code>.</li>
              <li>Insira a URL da API e a Anon Key pública nas <strong>Configurações</strong> do Ludocard.</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Stats banner */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-3.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="size-4.5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none">
                  {checkpoints.length}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Checkpoints
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-3.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10">
                <Download className="size-4.5 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none">
                  {checkpoints.reduce((s, c) => s + c.downloadsCount, 0).toLocaleString("pt-BR")}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Downloads
                </span>
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
                  Contribuidores
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-3.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10">
                <Shield className="size-4.5 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none">10 GB</span>
                <span className="text-[11px] text-muted-foreground">
                  Cota Cloud R2
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
                placeholder="Buscar por jogo ou checkpoint..."
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
                Popular
              </Button>
              <Button
                variant={sortMode === "recent" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSortMode("recent")}
              >
                <Clock className="size-3.5" data-icon="inline-start" />
                Recentes
              </Button>
              <Button
                variant={sortMode === "size" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSortMode("size")}
              >
                <Package className="size-3.5" data-icon="inline-start" />
                Menor
              </Button>
            </div>
          </div>

          {/* Checkpoint list */}
          {loading ? (
            <div className="flex h-[300px] flex-col items-center justify-center gap-2">
              <RefreshCw className="size-7 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Sincronizando com o repositório público...</span>
            </div>
          ) : sortedCheckpoints.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Globe />
                </EmptyMedia>
                <EmptyTitle>
                  {searchQuery
                    ? "Nenhum checkpoint encontrado"
                    : "Nenhum checkpoint disponível"}
                </EmptyTitle>
                <EmptyDescription>
                  {searchQuery
                    ? "Tente buscar com outros termos."
                    : "Seja o primeiro a compartilhar um save da comunidade!"}
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
                    <div className="flex gap-3.5 p-4">
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
                            <div className="mt-0.5 flex items-center gap-1.5">
                              <Gamepad2 className="size-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {cp.gameName}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {cp.description || "Nenhuma descrição detalhada fornecida."}
                        </p>

                        {/* Meta row */}
                        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                          <Badge variant="secondary" className="text-[10px]">
                            <Package className="mr-1 size-2.5" />
                            {formatCompactSize(cp.fileSize)}
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">
                            <Download className="mr-1 size-2.5" />
                            {cp.downloadsCount.toLocaleString("pt-BR")}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            por <strong className="text-foreground">{cp.authorName}</strong> • {formatRelativeDate(cp.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action bar */}
                    <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2">
                      <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <FileCheck className="size-3 text-emerald-400" />
                        <span>Contém metadados zstd verificados</span>
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
                            Instalando...
                          </>
                        ) : (
                          <>
                            <Download className="size-3" data-icon="inline-start" />
                            Instalar
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Info footer */}
          <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 size-4 shrink-0 text-amber-400" />
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  Segurança Automática e Proteção
                </span>
                <span>
                  Ao instalar um checkpoint da comunidade, o Ludocard
                  automaticamente cria um <strong>backup de segurança</strong>{" "}
                  (Seguro-Crash) do seu save atual antes de sobrescrever. Se algo
                  der errado, é só restaurar o backup anterior. Além disso, os pacotes passam por um scanner de descompressão segura em Rust para impedir injeção de arquivos indesejados.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal Dialog Overlay */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-lg shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border">
              <div>
                <CardTitle className="text-base">Compartilhar Checkpoint</CardTitle>
                <CardDescription className="text-xs">Publique o seu arquivo de progresso para a comunidade.</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsShareModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handlePublish} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="game-select" className="text-xs font-semibold text-muted-foreground">Jogo do Save *</label>
                  <select
                    id="game-select"
                    value={selectedGameId}
                    onChange={(e) => {
                      setSelectedGameId(e.target.value)
                      setSelectedSavePath("")
                    }}
                    className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  >
                    <option value="" disabled>Selecione um jogo da sua biblioteca</option>
                    {games.filter(g => g.installed).map(g => (
                      <option key={g.id} value={g.id}>{g.title} ({g.platform})</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="save-file" className="text-xs font-semibold text-muted-foreground">Arquivo de Progresso (Save Slot)*</label>
                  <div className="flex gap-2">
                    <Input
                      id="save-file"
                      readOnly
                      placeholder="Nenhum arquivo de save selecionado"
                      value={selectedSavePath}
                      className="font-mono text-xs"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={!selectedGameId}
                      onClick={handlePickFile}
                    >
                      Selecionar
                    </Button>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Apenas selecione o arquivo específico correspondente ao slot desejado (ex: slot1.sav, ER0000.sl2).
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="checkpoint-title" className="text-xs font-semibold text-muted-foreground">Título do Checkpoint *</label>
                  <Input
                    id="checkpoint-title"
                    placeholder="Ex: Antes do Boss Final / Jogo 100% Liberado"
                    value={checkpointTitle}
                    onChange={(e) => setCheckpointTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="checkpoint-desc" className="text-xs font-semibold text-muted-foreground">Descrição / Notas do Progresso</label>
                  <textarea
                    id="checkpoint-desc"
                    rows={3}
                    placeholder="Detalhes sobre conquistas, nível de personagem, itens ou builds contidos no save..."
                    value={checkpointDesc}
                    onChange={(e) => setCheckpointDesc(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="author" className="text-xs font-semibold text-muted-foreground">Nome do Autor (opcional)</label>
                  <Input
                    id="author"
                    placeholder="Anônimo"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 border-t border-border pt-4 mt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsShareModalOpen(false)}
                    disabled={uploading}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? (
                      <>
                        <RefreshCw className="mr-2 size-3.5 animate-spin" />
                        Subindo...
                      </>
                    ) : (
                      <>
                        <Upload data-icon="inline-start" />
                        Publicar Checkpoint
                      </>
                    )}
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
