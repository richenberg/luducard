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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { PlatformBadge } from "@/components/platform-badge"
import { cn } from "@/lib/utils"
import { type Game, type BackupKind, formatSize } from "@/lib/mock-data"

const kindColors: Record<BackupKind | string, string> = {
  Automático: "text-primary",
  Manual: "text-sky-300",
  "Antes de fechar": "text-amber-300",
  Restauração: "text-violet-300",
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
        {active ? "Ativo" : "Desativado"}
      </span>
    </div>
  )
}

interface GameDetailClientProps {
  game: Game
  onRefresh?: () => void
}

export function GameDetailClient({ game, onRefresh }: GameDetailClientProps) {
  function copyPath() {
    navigator.clipboard?.writeText(game.savePath)
    toast.success("Caminho copiado")
  }

  const handleBackup = async () => {
    if (isTauri) {
      const id = toast.loading(`Fazendo backup manual de "${game.title}"...`);
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        await invoke("backup_game", { gameTitle: game.title });
        toast.success(`Backup de "${game.title}" criado com sucesso!`, { id });
        if (onRefresh) onRefresh();
      } catch (err) {
        toast.error(`Falha no backup: ${err}`, { id });
      }
    } else {
      toast.success(`[Mock] Backup de "${game.title}" criado`);
    }
  };

  const handleRestoreLatest = async () => {
    if (isTauri) {
      const id = toast.loading(`Restaurando backup mais recente de "${game.title}"...`);
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        await invoke("restore_game", { gameTitle: game.title, backupId: null });
        toast.success(`Versão mais recente de "${game.title}" restaurada!`, { id });
        if (onRefresh) onRefresh();
      } catch (err) {
        toast.error(`Falha ao restaurar: ${err}`, { id });
      }
    } else {
      toast.info(`[Mock] Restaurando versão mais recente de "${game.title}"`);
    }
  };

  const handleRestoreVersion = async (versionId: string, versionDate: string) => {
    if (isTauri) {
      const id = toast.loading(`Restaurando versão "${versionId}" de "${game.title}"...`);
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        await invoke("restore_game", { gameTitle: game.title, backupId: versionId });
        toast.success(`Versão de ${versionDate} restaurada!`, { id });
        if (onRefresh) onRefresh();
      } catch (err) {
        toast.error(`Falha ao restaurar versão: ${err}`, { id });
      }
    } else {
      toast.info(`[Mock] Restaurando versão de ${versionDate}`);
    }
  };

  const handleToggleLocked = async (versionId: string, currentLocked: boolean) => {
    if (isTauri) {
      const nextLocked = !currentLocked;
      const id = toast.loading(
        nextLocked
          ? `Bloqueando versão "${versionId}"...`
          : `Desbloqueando versão "${versionId}"...`
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
            ? "Versão bloqueada com sucesso! Ela não será deletada automaticamente."
            : "Versão desbloqueada com sucesso.",
          { id }
        );
        if (onRefresh) onRefresh();
      } catch (err) {
        toast.error(`Falha ao alterar status da versão: ${err}`, { id });
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
      toast.error(`Erro ao abrir pasta: ${err}`);
    }
  };

  const handleExportSave = async () => {
    if (!isTauri) {
      toast.info(`[Mock] Exportando save de "${game.title}" como .ludocard`);
      return;
    }
    try {
      const { invoke } = await import("@tauri-apps/api/core");

      // Step 1: Let user pick the specific save file
      const selectedFile = await invoke<string | null>("select_save_file", {
        startDir: game.savePath || null,
      });
      if (!selectedFile) return; // User cancelled

      // Step 2: Choose where to save the .ludocard file
      const slugName = game.id.replace(/[^a-z0-9-]/gi, "-");
      const destPath = await invoke<string | null>("save_ludocard_dialog", {
        defaultName: `${slugName}.ludocard`,
      });
      if (!destPath) return; // User cancelled

      // Step 3: Export
      const toastId = toast.loading(`Compactando save de "${game.title}"...`);
      const metadata = await invoke<any>("export_ludocard_save", {
        gameTitle: game.title,
        gameId: game.id,
        checkpointTitle: `Save de ${game.title}`,
        description: "",
        sourcePath: selectedFile,
        destPath: destPath,
      });

      const compressedMB = (metadata.compressedSizeBytes / (1024 * 1024)).toFixed(1);
      const originalMB = (metadata.totalSizeBytes / (1024 * 1024)).toFixed(1);
      toast.success(
        `Exportado com sucesso! ${originalMB} MB → ${compressedMB} MB compactado`,
        { id: toastId }
      );
    } catch (err) {
      toast.error(`Falha ao exportar: ${err}`);
    }
  };

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
            alt={`Capa de ${game.title}`}
            className="h-40 w-30 shrink-0 rounded-lg border border-border object-cover shadow-xl"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <PlatformBadge platform={game.platform} />
              <span className="text-xs text-muted-foreground">
                {game.backups.length} versões salvas
              </span>
            </div>
            <h2 className="text-balance text-2xl font-bold leading-tight sm:text-3xl">
              {game.title}
            </h2>
            <button
              onClick={copyPath}
              className="group flex w-fit max-w-full items-center gap-2 rounded-md border border-border bg-background/60 px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <FolderOpen className="size-3.5 shrink-0 text-primary" />
              <span className="truncate">{game.savePath}</span>
              <Copy className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleBackup}>
                <ArrowUpToLine data-icon="inline-start" />
                Fazer backup agora
              </Button>
              <Button
                variant="secondary"
                onClick={handleRestoreLatest}
              >
                <ArrowDownToLine data-icon="inline-start" />
                Restaurar última
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenFolder("game")}
                title="Abrir pasta de instalação do jogo no Windows Explorer"
              >
                <Folder className="size-3.5" data-icon="inline-start" />
                Pasta do Jogo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenFolder("save")}
                title="Abrir pasta onde os saves ativos ficam armazenados"
              >
                <FolderSync className="size-3.5" data-icon="inline-start" />
                Pasta do Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenFolder("backup")}
                title="Abrir pasta de backup de saves do Ludocard"
              >
                <Package className="size-3.5" data-icon="inline-start" />
                Pasta de Backups
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportSave}
                title="Exportar save como arquivo .ludocard compactado para compartilhar"
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                <Share2 className="size-3.5" data-icon="inline-start" />
                Exportar Save (.ludocard)
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
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              <StatusPill
                active={game.autoBackup}
                label="Backup automático"
                onIcon={Zap}
                offIcon={Zap}
              />
              <StatusPill
                active={game.cloudSync}
                label="Sincronização na nuvem"
                onIcon={Cloud}
                offIcon={CloudOff}
              />
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                <span className="flex items-center gap-2 text-sm">
                  <HardDrive className="size-4 text-muted-foreground" />
                  Saves no PC
                </span>
                <span className="text-xs font-medium">{formatSize(game.sizeMB)}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                <span className="flex items-center gap-2 text-sm">
                  <Package className="size-4 text-muted-foreground" />
                  Total em backups
                </span>
                <span className="text-xs font-medium">{formatSize(game.backupsSizeMB || 0)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preferências rápidas</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <label className="flex items-center justify-between gap-2">
                <span className="text-sm">Backup automático</span>
                <Switch
                  checked={game.autoBackup}
                  disabled={true} /* Controlled by main settings config */
                />
              </label>
              <label className="flex items-center justify-between gap-2">
                <span className="text-sm">Enviar para a nuvem</span>
                <Switch
                  checked={game.cloudSync}
                  disabled={true} /* Controlled by main settings config */
                />
              </label>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="size-4 text-primary" />
              Histórico de versões
            </CardTitle>
          </CardHeader>
          <CardContent>
            {game.backups.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <CloudOff />
                  </EmptyMedia>
                  <EmptyTitle>Nenhum backup ainda</EmptyTitle>
                  <EmptyDescription>
                    Faça o primeiro backup deste jogo para começar a linha do tempo.
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
                    <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">
                            {b.date} às {b.time}
                          </span>
                          {b.cloud ? (
                            <Cloud className="size-3.5 text-primary" />
                          ) : (
                            <CloudOff className="size-3.5 text-muted-foreground" />
                          )}
                          {b.locked && (
                            <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-500 border border-amber-500/20">
                              <Pin className="size-2.5 fill-current" />
                              Alfinetado
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className={cn("font-medium", kindColors[b.kind] || "text-muted-foreground")}>
                            {b.kind}
                          </span>
                          <span>•</span>
                          <span>{formatSize(b.sizeMB)}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestoreVersion(b.id, `${b.date} ${b.time}`)}
                        >
                          <RotateCcw data-icon="inline-start" />
                          Restaurar
                        </Button>
                        <Button
                          size="icon-sm"
                          variant={b.locked ? "secondary" : "ghost"}
                          onClick={() => handleToggleLocked(b.id, !!b.locked)}
                          title={b.locked ? "Desafixar versão (permitir exclusão automática)" : "Fixar/Alfinetar versão (impedir exclusão automática)"}
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
                          onClick={() => toast.error("Por favor, gerencie exclusões de backups pelo app central")}
                          title="Deletar versão"
                        >
                          <Trash2 />
                          <span className="sr-only">Deletar versão</span>
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
