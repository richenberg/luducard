import { useMemo, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import {
  Search,
  LayoutGrid,
  List,
  ArrowUpToLine,
  ArrowDownToLine,
  ArrowUpDown,
  Cloud,
  CloudOff,
  AlertTriangle,
  CheckCircle2,
  CircleSlash,
  HardDrive,
  Gamepad2,
  TimerReset,
  Loader2,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { PlatformBadge } from "@/components/platform-badge"
import { cn } from "@/lib/utils"
import {
  games as mockGames,
  formatSize,
  type Game,
  type Platform,
  type BackupStatus,
} from "@/lib/mock-data"
import { useLibrary } from "@/lib/library-context"

const statusConfig: Record<
  BackupStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  ok: { label: "Sincronizado", icon: CheckCircle2, className: "text-emerald-400" },
  pending: { label: "Backup pendente", icon: AlertTriangle, className: "text-amber-400" },
  never: { label: "Sem backup", icon: CircleSlash, className: "text-rose-400" },
}

const isTauri = typeof window !== "undefined" && (window as any).__TAURI_INTERNALS__ !== undefined;

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof HardDrive
  label: string
  value: string
  accent?: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
      <div className={cn("flex size-10 items-center justify-center rounded-md bg-muted", accent)}>
        <Icon className="size-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-lg font-semibold leading-tight">{value}</span>
      </div>
    </div>
  )
}

interface GameCardProps {
  game: Game
  selected: boolean
  onSelectedChange: (selected: boolean) => void
  onBackup: (title: string) => void
  onRestore: (title: string) => void
}

function GameCard({ game, selected, onSelectedChange, onBackup, onRestore }: GameCardProps) {
  const status = statusConfig[game.status]
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/50">
      <div className="absolute left-2 top-2 z-20 flex items-center gap-2">
        <Checkbox
          checked={selected}
          onCheckedChange={(c) => onSelectedChange(c === true)}
          className="border-white/40 bg-black/60 backdrop-blur data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          aria-label={`Selecionar ${game.title}`}
        />
      </div>

      <Link to={`/game/${game.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={game.cover || "/placeholder.svg"}
            alt={`Capa de ${game.title}`}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
          <div className="absolute left-8 top-2">
            <PlatformBadge platform={game.platform} />
          </div>
          <div className="absolute right-2 top-2 flex items-center gap-1.5 rounded-md bg-background/70 px-1.5 py-1 backdrop-blur">
            {game.cloudSync ? (
              <Cloud className="size-3.5 text-primary" />
            ) : (
              <CloudOff className="size-3.5 text-muted-foreground" />
            )}
            <status.icon className={cn("size-3.5", status.className)} />
          </div>
        </div>
      </Link>

      <div className="flex flex-col gap-1 p-3">
        <Link to={`/game/${game.id}`} className="truncate font-medium hover:text-primary">
          {game.title}
        </Link>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatSize(game.sizeMB)}</span>
          <span className="truncate">{game.lastBackup}</span>
        </div>
      </div>

      {/* Hover quick actions */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[68px] flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
        <Button
          size="sm"
          onClick={() => onBackup(game.title)}
          className="shadow-lg hover:pointer-events-auto"
        >
          <ArrowUpToLine data-icon="inline-start" />
          Backup
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onRestore(game.title)}
          className="shadow-lg hover:pointer-events-auto"
        >
          <ArrowDownToLine data-icon="inline-start" />
          Restaurar
        </Button>
      </div>
    </div>
  )
}

function GameRow({ game, selected, onSelectedChange, onBackup, onRestore }: GameCardProps) {
  const status = statusConfig[game.status]
  return (
    <div className="group flex items-center gap-3 rounded-lg border border-border bg-card p-2.5 transition-colors hover:border-primary/50 sm:gap-4">
      <Checkbox
        checked={selected}
        onCheckedChange={(c) => onSelectedChange(c === true)}
        aria-label={`Selecionar ${game.title}`}
        className="ml-1"
      />
      <Link to={`/game/${game.id}`} className="shrink-0">
        <img
          src={game.cover || "/placeholder.svg"}
          alt={`Capa de ${game.title}`}
          className="h-16 w-12 rounded-md object-cover"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link to={`/game/${game.id}`} className="truncate font-medium hover:text-primary">
          {game.title}
        </Link>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <PlatformBadge platform={game.platform} />
          <span className="inline-flex items-center gap-1">
            <status.icon className={cn("size-3.5", status.className)} />
            {status.label}
          </span>
        </div>
      </div>
      <div className="hidden w-24 shrink-0 flex-col items-end text-xs sm:flex">
        <span className="font-medium text-foreground">{formatSize(game.sizeMB)}</span>
        <span className="text-muted-foreground">Save atual</span>
      </div>
      <div className="hidden w-28 shrink-0 flex-col items-end text-xs md:flex">
        <span className="font-medium text-foreground">{game.lastBackup}</span>
        <span className="text-muted-foreground">Último backup</span>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <Button size="icon-sm" variant="ghost" onClick={() => onBackup(game.title)} title="Backup manual">
          <ArrowUpToLine />
          <span className="sr-only">Backup manual</span>
        </Button>
        <Button size="icon-sm" variant="ghost" onClick={() => onRestore(game.title)} title="Restaurar">
          <ArrowDownToLine />
          <span className="sr-only">Restaurar</span>
        </Button>
      </div>
    </div>
  )
}

interface LibraryClientProps {
  selected: Record<string, boolean>
  setSelected: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}

export function LibraryClient({ selected, setSelected }: LibraryClientProps) {
  const { games, loading, loadGames, stats } = useLibrary()
  const [view, setView] = useState<"grid" | "list">("grid")
  const [query, setQuery] = useState("")
  const [platform, setPlatform] = useState<Platform | "all">("all")
  const [onlyPending, setOnlyPending] = useState(false)
  const [onlyInstalled, setOnlyInstalled] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "recent" | "size">("name")

  const handleBackup = async (title: string) => {
    if (isTauri) {
      const id = toast.loading(`Iniciando backup de "${title}"...`);
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        await invoke("backup_game", { gameTitle: title });
        toast.success(`Backup de "${title}" concluído!`, { id });
        loadGames(true);
      } catch (err) {
        toast.error(`Falha no backup de "${title}": ${err}`, { id });
      }
    } else {
      toast.success(`[Mock] Backup de "${title}" concluído!`);
    }
  };

  const handleRestore = async (title: string) => {
    if (isTauri) {
      const id = toast.loading(`Restaurando backup de "${title}"...`);
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        await invoke("restore_game", { gameTitle: title });
        toast.success(`Restauração de "${title}" concluída!`, { id });
        loadGames(true);
      } catch (err) {
        toast.error(`Falha ao restaurar "${title}": ${err}`, { id });
      }
    } else {
      toast.success(`[Mock] Restauração de "${title}" concluída!`);
    }
  };

  const filtered = useMemo(() => {
    const result = games.filter((g) => {
      if (query && !g.title.toLowerCase().includes(query.toLowerCase())) return false
      if (platform !== "all" && g.platform !== platform) return false
      if (onlyPending && g.status === "ok") return false
      if (onlyInstalled && !g.installed) return false
      return true
    })

    // Apply sorting
    switch (sortBy) {
      case "recent":
        result.sort((a, b) => {
          const dateA = a.lastPlayed ? new Date(a.lastPlayed).getTime() : 0
          const dateB = b.lastPlayed ? new Date(b.lastPlayed).getTime() : 0
          return dateB - dateA // Most recent first
        })
        break
      case "size":
        result.sort((a, b) => b.sizeMB - a.sizeMB) // Largest first
        break
      case "name":
      default:
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    return result
  }, [games, query, platform, onlyPending, onlyInstalled, sortBy])

  const allFilteredSelected = filtered.length > 0 && filtered.every(g => !!selected[g.id]);

  const handleSelectAllToggle = () => {
    if (allFilteredSelected) {
      setSelected(prev => {
        const next = { ...prev };
        filtered.forEach(g => {
          next[g.id] = false;
        });
        return next;
      });
    } else {
      setSelected(prev => {
        const next = { ...prev };
        filtered.forEach(g => {
          next[g.id] = true;
        });
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-2">
        <Loader2 className="size-8 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Carregando biblioteca de jogos...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={Gamepad2}
          label="Jogos monitorados"
          value={String(stats.totalGames)}
          accent="text-primary"
        />
        <StatCard
          icon={HardDrive}
          label="Saves armazenados"
          value={formatSize(stats.totalSizeMB)}
        />
        <StatCard
          icon={Cloud}
          label="Sincronizados na nuvem"
          value={`${stats.cloudSynced}/${stats.totalGames}`}
          accent="text-primary"
        />
        <StatCard
          icon={TimerReset}
          label="Backups pendentes"
          value={String(stats.pending)}
          accent="text-amber-400"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:max-w-md">
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar jogos..."
              className="pl-9 pr-9"
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 size-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setQuery("")}
                aria-label="Limpar pesquisa"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Checkbox
              id="select-all-library"
              checked={filtered.length > 0 && filtered.every(g => !!selected[g.id])}
              onCheckedChange={handleSelectAllToggle}
            />
            <label htmlFor="select-all-library" className="text-xs font-medium cursor-pointer select-none text-muted-foreground">
              Selecionar todos ({filtered.filter(g => selected[g.id]).length}/{filtered.length})
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={platform} onValueChange={(v) => setPlatform(v as Platform | "all")}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Plataforma" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todas plataformas</SelectItem>
                <SelectItem value="Steam">Steam</SelectItem>
                <SelectItem value="Epic">Epic</SelectItem>
                <SelectItem value="GOG">GOG</SelectItem>
                <SelectItem value="Origin">Origin</SelectItem>
                <SelectItem value="Emulador">Emulador</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as "name" | "recent" | "size")}>
            <SelectTrigger className="w-[190px]">
              <ArrowUpDown className="size-4 mr-1.5 shrink-0 text-muted-foreground" />
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="name">Nome (A-Z)</SelectItem>
                <SelectItem value="recent">Jogados recentemente</SelectItem>
                <SelectItem value="size">Tamanho do save</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            variant={onlyInstalled ? "default" : "outline"}
            onClick={() => setOnlyInstalled((p) => !p)}
          >
            <Gamepad2 data-icon="inline-start" />
            Instalados
          </Button>

          <Button
            variant={onlyPending ? "default" : "outline"}
            onClick={() => setOnlyPending((p) => !p)}
          >
            <AlertTriangle data-icon="inline-start" />
            Pendentes
          </Button>

          <ToggleGroup
            value={[view]}
            onValueChange={(val) => {
              const next = val[0] as "grid" | "list" | undefined
              if (next) setView(next)
            }}
            variant="outline"
            spacing={0}
          >
            <ToggleGroupItem value="grid" aria-label="Visualização em grade">
              <LayoutGrid />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="Visualização em lista">
              <List />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Results */}
      <div className="text-xs text-muted-foreground font-medium px-1 -mb-2">
        Exibindo {filtered.length} de {games.length} {games.length === 1 ? "jogo" : "jogos"}
      </div>

      {filtered.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>Nenhum jogo encontrado</EmptyTitle>
            <EmptyDescription>
              Ajuste os filtros ou escaneie suas pastas para adicionar novos jogos.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              selected={!!selected[game.id]}
              onSelectedChange={(s) => setSelected((prev) => ({ ...prev, [game.id]: s }))}
              onBackup={handleBackup}
              onRestore={handleRestore}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((game) => (
            <GameRow
              key={game.id}
              game={game}
              selected={!!selected[game.id]}
              onSelectedChange={(s) => setSelected((prev) => ({ ...prev, [game.id]: s }))}
              onBackup={handleBackup}
              onRestore={handleRestore}
            />
          ))}
        </div>
      )}
    </div>
  )
}
