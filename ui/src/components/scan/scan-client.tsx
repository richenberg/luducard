import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  Radar,
  FolderPlus,
  Folder,
  Trash2,
  Loader2,
  CheckCircle2,
  Plus,
  Sparkles,
  ChevronDown,
  HardDrive,
  Cloud,
} from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { PlatformBadge } from "@/components/platform-badge"
import { cn } from "@/lib/utils"
import { formatSize } from "@/lib/mock-data"
import { useLibrary } from "@/lib/library-context"
import { useI18n } from "@/lib/i18n"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

const isTauri = typeof window !== "undefined" && (window as any).__TAURI_INTERNALS__ !== undefined;

interface FrontendEmulator {
  path: string;
  name: string;
}

export function ScanClient() {
  const { t } = useI18n()
  const { games, loadGames, scanGames } = useLibrary()
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [hasResults, setHasResults] = useState(false)
  const [folders, setFolders] = useState<{ id: string; path: string; type: string; games: number }[]>([])
  const [emulators, setEmulators] = useState<FrontendEmulator[]>([])
  
  // Scanned games are games that are not backed up or have pending changes
  const scanResultsList = games.filter(g => g.status === "never" || g.status === "pending")

  const [selected, setSelected] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Select all new games by default
    setSelected(
      Object.fromEntries(scanResultsList.map((r) => [r.id, true]))
    )
  }, [games])

  const loadRoots = async () => {
    if (!isTauri) {
      setFolders([]);
      return;
    }
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      const list = await invoke<{ id: string; path: string; store: string }[]>("get_roots");
      setFolders(
        list.map((r) => ({
          id: r.id,
          path: r.path,
          type: r.store === "Other" ? t("luducard-custom-folder", "Personalizada") : t("luducard-default-folder", "PadrÃ£o"),
          games: 0, // In backend, these are scanned automatically
        }))
      );
    } catch (err) {
      console.error("Failed to load roots:", err);
    }
  };

  const loadEmulators = async () => {
    if (!isTauri) {
      setEmulators([]);
      return;
    }
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      const list = await invoke<FrontendEmulator[]>("get_emulators");
      setEmulators(list);
    } catch (err) {
      console.error("Failed to load emulators:", err);
    }
  };

  const [cloudSyncEnabled, setCloudSyncEnabled] = useState(false);

  const checkCloudSync = async () => {
    if (isTauri) {
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        const s = await invoke<any>("get_settings");
        setCloudSyncEnabled(s.cloudSync || false);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    loadRoots();
    loadEmulators();
    checkCloudSync();
  }, []);

  async function startScan() {
    setScanning(true)
    setProgress(10)
    // Animate progress while waiting for the full backend scan
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 3, 90))
    }, 500)
    try {
      await scanGames()
      clearInterval(progressInterval)
      setProgress(100)
      setHasResults(true)
      toast.success(t("luducard-scan-completed", "Varredura concluÃ­da"), {
        description: t("luducard-scan-completed-desc", "DetecÃ§Ã£o de alteraÃ§Ãµes finalizada."),
      })
    } catch (err) {
      clearInterval(progressInterval)
      toast.error(t("luducard-scan-error", "Erro ao realizar varredura."))
    } finally {
      setScanning(false)
    }
  }

  async function addFolder() {
    if (!isTauri) {
      const path = `D:/Nova Pasta ${folders.length + 1}`
      setFolders((f) => [
        ...f,
        { id: `f${Date.now()}`, path, type: t("luducard-custom-folder", "Personalizada"), games: 0 },
      ])
      toast.success(t("luducard-folder-added", "Pasta adicionada ao monitoramento"))
      return;
    }

    try {
      const { invoke } = await import("@tauri-apps/api/core");
      const selected = await invoke<string | null>("select_folder");
      if (selected) {
        const res = await invoke<{ success: boolean; is_emulator: boolean; emulator_name: string | null }>("add_root", { path: selected });
        
        if (res.is_emulator) {
          const accept = window.confirm(
            t("luducard-emulator-detected", "A pasta selecionada pertence ao emulador { $emulator }.\n\nDeseja adicionÃ¡-la como um Emulador para rastrear os saves dos seus jogos automaticamente?")
              .replace(/\{\s*\$emulator\s*\}/g, res.emulator_name || "")
          );
          if (accept) {
            const id = toast.loading(t("luducard-adding-emulator", "Adicionando emulador e escaneando saves..."));
            try {
              const count = await invoke<number>("add_emulator", { path: selected });
              if (count > 0) {
                toast.success(
                  t("luducard-emulator-added-success", "Emulador { $emulator } adicionado com sucesso! { $count } jogo(s) detectado(s) na pasta de saves.")
                    .replace(/\{\s*\$emulator\s*\}/g, res.emulator_name || "")
                    .replace(/\{\s*\$count\s*\}/g, String(count)),
                  { id }
                );
              } else {
                toast.success(
                  t("luducard-emulator-added-empty", "Emulador { $emulator } adicionado! Nenhum save de jogo foi detectado na pasta.")
                    .replace(/\{\s*\$emulator\s*\}/g, res.emulator_name || ""),
                  { id }
                );
              }
              loadEmulators();
              loadGames(true);
            } catch (err) {
              toast.error(
                t("luducard-emulator-add-failed", "Falha ao adicionar emulador: { $error }")
                  .replace(/\{\s*\$error\s*\}/g, String(err)),
                { id }
              );
            }
          }
        } else if (res.success) {
          toast.success(t("luducard-folder-added-success", "Pasta adicionada com sucesso!"));
          loadRoots();
        }
      }
    } catch (err) {
      console.error("Failed to add folder root:", err);
      toast.error(t("luducard-folder-select-error", "Erro ao selecionar/adicionar pasta."));
    }
  }

  async function addEmulator() {
    if (!isTauri) {
      setEmulators((prev) => [...prev, { path: "G:/05-Emuladores/CEMU", name: "Cemu" }]);
      toast.success(t("luducard-emulator-added-mock", "Emulador adicionado com sucesso! (Mock)"));
      return;
    }

    try {
      const { invoke } = await import("@tauri-apps/api/core");
      const path = await invoke<string | null>("select_folder");
      if (path) {
        const id = toast.loading(t("luducard-adding-emulator", "Adicionando emulador e escaneando saves..."));
        try {
          const count = await invoke<number>("add_emulator", { path });
          const emus = await invoke<FrontendEmulator[]>("get_emulators");
          const added = emus.find((e) => e.path === path);
          const name = added ? added.name : "Emulador";

          if (count > 0) {
            toast.success(
              t("luducard-emulator-added-success", "Emulador { $emulator } adicionado com sucesso! { $count } jogo(s) detectado(s) na pasta de saves.")
                .replace(/\{\s*\$emulator\s*\}/g, name)
                .replace(/\{\s*\$count\s*\}/g, String(count)),
              { id }
            );
          } else {
            toast.success(
              t("luducard-emulator-added-empty", "Emulador { $emulator } adicionado! Nenhum save de jogo foi detectado na pasta.")
                .replace(/\{\s*\$emulator\s*\}/g, name),
              { id }
            );
          }
          loadEmulators();
          loadGames(true);
        } catch (err) {
          toast.error(
            t("luducard-emulator-add-failed", "Falha ao adicionar emulador: { $error }")
              .replace(/\{\s*\$error\s*\}/g, String(err)),
            { id }
          );
        }
      }
    } catch (err) {
      console.error("Failed to add emulator:", err);
      toast.error(t("luducard-emulator-select-error", "Erro ao selecionar/adicionar emulador."));
    }
  }

  async function removeEmulator(path: string) {
    if (!isTauri) {
      setEmulators((prev) => prev.filter((x) => x.path !== path));
      return;
    }

    try {
      const { invoke } = await import("@tauri-apps/api/core");
      await invoke("remove_emulator", { path });
      toast.success(t("luducard-emulator-removed", "Emulador removido"));
      loadEmulators();
      loadGames(true);
    } catch (err) {
      console.error("Failed to remove emulator:", err);
      toast.error(t("luducard-emulator-remove-error", "Erro ao remover emulador."));
    }
  }

  async function removeFolder(path: string) {
    if (!isTauri) {
      setFolders((f) => f.filter((x) => x.path !== path))
      return;
    }

    try {
      const { invoke } = await import("@tauri-apps/api/core");
      await invoke("remove_root", { path });
      toast.success(t("luducard-folder-removed", "Pasta removida do monitoramento"));
      loadRoots();
    } catch (err) {
      console.error("Failed to remove folder root:", err);
      toast.error(t("luducard-folder-remove-error", "Erro ao remover pasta."));
    }
  }

  const selectedCount = Object.values(selected).filter(Boolean).length

  return (
    <div className="flex flex-col gap-6">
      {/* Auto scan */}
      <Card className="overflow-hidden">
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Radar className={cn("size-8", scanning && "animate-spin")} />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold">{t("luducard-auto-search", "Busca automÃ¡tica")}</h2>
            <p className="max-w-md text-balance text-sm text-muted-foreground">
              {t("luducard-auto-search-desc", "Varre as pastas comuns do sistema (Steam, Epic, Documentos e AppData) e suas pastas customizadas em busca de novos saves ou alteraÃ§Ãµes.")}
            </p>
          </div>
          {scanning ? (
            <div className="flex w-full max-w-sm flex-col gap-2">
              <Progress value={progress} />
              <span className="text-xs text-muted-foreground">
                {t("luducard-scanning", "Escaneando...")} {progress}%
              </span>
            </div>
          ) : (
            <Button size="lg" onClick={startScan}>
              <Sparkles data-icon="inline-start" />
              {t("luducard-start-scan", "Iniciar varredura de alteraÃ§Ãµes")}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Custom folders */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-base">{t("luducard-monitored-folders", "Pastas monitoradas")}</CardTitle>
            <CardDescription>
              {t("luducard-monitored-folders-desc", "DiretÃ³rios raiz observados continuamente para novos saves.")}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={addFolder}>
            <Plus data-icon="inline-start" />
            {t("luducard-add-folder", "Adicionar pasta")}
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {folders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <FolderPlus className="size-8 text-muted-foreground/30 mb-2.5" />
              <p className="text-sm font-medium">{t("luducard-no-folders-detected", "Nenhuma pasta de jogos detectada automaticamente.")}</p>
              <p className="text-xs text-muted-foreground/80 mt-0.5">{t("luducard-click-add-folder-desc", "Clique em \"Adicionar pasta\" para selecionar uma pasta de biblioteca ou emuladores.")}</p>
            </div>
          ) : (
            folders.map((folder) => (
              <div
                key={folder.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3"
              >
                <Folder className="size-5 shrink-0 text-primary" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-mono text-sm">{folder.path}</span>
                  <span className="text-xs text-muted-foreground">
                    {t("luducard-monitoring-active", "Monitoramento ativo")}
                  </span>
                </div>
                <Badge variant={folder.type === t("luducard-custom-folder", "Personalizada") ? "secondary" : "outline"}>
                  {folder.type}
                </Badge>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => removeFolder(folder.path)}
                  title={t("luducard-remove-folder", "Remover pasta")}
                >
                  <Trash2 />
                  <span className="sr-only">{t("luducard-remove-folder", "Remover pasta")}</span>
                </Button>
              </div>
            ))
          )}
          {folders.length > 0 && (
            <button
              onClick={addFolder}
              className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-3 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <FolderPlus className="size-4" />
              {t("luducard-select-new-root", "Selecionar nova pasta raiz")}
            </button>
          )}
        </CardContent>
      </Card>

      {/* Emulators */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-base">{t("luducard-monitored-emulators", "Emuladores monitorados")}</CardTitle>
            <CardDescription>
              {t("luducard-monitored-emulators-desc", "DiretÃ³rios de emuladores observados para busca automÃ¡tica de saves de console.")}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={addEmulator}>
            <Plus data-icon="inline-start" />
            {t("luducard-add-emulator", "Adicionar emulador")}
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {emulators.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <FolderPlus className="size-8 text-muted-foreground/30 mb-2.5" />
              <p className="text-sm font-medium">{t("luducard-no-emulators-configured", "Nenhum emulador configurado.")}</p>
              <p className="text-xs text-muted-foreground/80 mt-0.5">{t("luducard-click-add-emulator-desc", "Clique em \"Adicionar emulador\" para importar saves de Switch, Wii, Wii U, GBA, PS2, etc.")}</p>
            </div>
          ) : (
            emulators.map((emu) => (
              <div
                key={emu.path}
                className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3"
              >
                <Folder className="size-5 shrink-0 text-emerald-500" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-mono text-sm">{emu.path}</span>
                  <span className="text-xs text-muted-foreground">
                    {t("luducard-saves-integrated", "Saves integrados Ã  biblioteca")}
                  </span>
                </div>
                <PlatformBadge platform="Emulador" emulator={emu.name} />
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => removeEmulator(emu.path)}
                  title={t("luducard-remove-emulator", "Remover emulador")}
                >
                  <Trash2 />
                  <span className="sr-only">{t("luducard-remove-emulator", "Remover emulador")}</span>
                </Button>
              </div>
            ))
          )}
          {emulators.length > 0 && (
            <button
              onClick={addEmulator}
              className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-3 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <Plus className="size-4" />
              {t("luducard-add-other-emulator", "Adicionar outro emulador")}
            </button>
          )}
        </CardContent>
      </Card>


      {/* Results */}
      {hasResults && (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-base">{t("luducard-scan-results", "Resultados da varredura")}</CardTitle>
              <CardDescription>
                {t("luducard-scan-results-desc", "Selecione quais jogos com saves novos ou alterados vocÃª deseja fazer backup.")}
              </CardDescription>
            </div>
            {cloudSyncEnabled ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <div
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "flex items-center gap-1.5 cursor-pointer focus:outline-none",
                        selectedCount === 0 ? "pointer-events-none opacity-50" : ""
                      )}
                    />
                  }
                >
                  <CheckCircle2 />
                  {t("luducard-backup-selected", "Fazer Backup Selecionados")} {selectedCount > 0 ? `(${selectedCount})` : ""}
                  <ChevronDown className="size-4 ml-1 opacity-80" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover/95 backdrop-blur-md border border-border">
                  <DropdownMenuItem onClick={async () => {
                    const gamesToBackup = scanResultsList.filter(r => selected[r.id]);
                    const id = toast.loading(
                      t("luducard-starting-batch-backup", "Iniciando backup em lote para { $count } jogos...")
                        .replace(/\{\s*\$count\s*\}/g, String(gamesToBackup.length))
                    );
                    try {
                      const { invoke } = await import("@tauri-apps/api/core");
                      for (const game of gamesToBackup) {
                        toast.loading(`[${game.title}] Criando backup local...`, { id });
                        await invoke("backup_game", { gameTitle: game.title });
                      }
                      toast.success(t("luducard-batch-backup-completed", "Backup dos jogos selecionados concluÃ­do!"), { id });
                      loadGames(true);
                      setHasResults(false);
                    } catch (err) {
                      toast.error(t("luducard-batch-backup-failed", "Falha no backup em lote."), { id });
                    }
                  }}>
                    <HardDrive className="size-4 mr-2 text-primary" />
                    <span>Fazer Backup Local</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={async () => {
                    const gamesToBackup = scanResultsList.filter(r => selected[r.id]);
                    const id = toast.loading(
                      "Iniciando backup em lote e enviando para nuvem..."
                    );
                    try {
                      const { invoke } = await import("@tauri-apps/api/core");
                      for (const game of gamesToBackup) {
                        toast.loading(`[${game.title}] Criando backup local e enviando para a nuvem...`, { id });
                        await invoke("backup_game", { gameTitle: game.title });
                      }
                      try {
                        await invoke("test_cloud_connection");
                        toast.success("Backup e upload para nuvem concluÃ­dos com sucesso!", { id });
                      } catch {
                        toast.warning("Backup local concluÃ­do, mas falhou ao enviar para a nuvem.", { id });
                      }
                      loadGames(true);
                      setHasResults(false);
                    } catch (err) {
                      toast.error("Falha no backup e upload.", { id });
                    }
                  }}>
                    <Cloud className="size-4 mr-2 text-primary" />
                    <span>Sincronizar com a Nuvem</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                disabled={selectedCount === 0}
                onClick={async () => {
                  const gamesToBackup = scanResultsList.filter(r => selected[r.id]);
                  const id = toast.loading(
                    t("luducard-starting-batch-backup", "Iniciando backup em lote para { $count } jogos...")
                      .replace(/\{\s*\$count\s*\}/g, String(gamesToBackup.length))
                  );
                  try {
                    const { invoke } = await import("@tauri-apps/api/core");
                    for (const game of gamesToBackup) {
                      toast.loading(`[${game.title}] Criando backup local...`, { id });
                      await invoke("backup_game", { gameTitle: game.title });
                    }
                    toast.success(t("luducard-batch-backup-completed", "Backup dos jogos selecionados concluÃ­do!"), { id });
                    loadGames(true);
                    setHasResults(false);
                  } catch (err) {
                    toast.error(t("luducard-batch-backup-failed", "Falha no backup em lote."), { id });
                  }
                }}
              >
                <CheckCircle2 data-icon="inline-start" />
                {t("luducard-backup-selected", "Fazer Backup Selecionados")} {selectedCount > 0 ? `(${selectedCount})` : ""}
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {scanResultsList.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {t("luducard-no-new-saves-detected", "Nenhum novo save ou alteraÃ§Ã£o detectada. Todos os jogos estÃ£o sincronizados!")}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 px-3 py-2 bg-muted/20 rounded-lg border border-border">
                  <Checkbox
                    id="select-all-scan"
                    checked={scanResultsList.length > 0 && selectedCount === scanResultsList.length}
                    onCheckedChange={(c) => {
                      const allSelected = c === true;
                      setSelected(
                        Object.fromEntries(scanResultsList.map((r) => [r.id, allSelected]))
                      );
                    }}
                  />
                  <label htmlFor="select-all-scan" className="text-xs font-medium cursor-pointer select-none text-muted-foreground">
                    {t("luducard-select-all", "Selecionar todos")}
                  </label>
                </div>
                {scanResultsList.map((r) => (
                  <label
                    key={r.id}
                    className="flex items-center gap-3 rounded-lg border cursor-pointer border-border bg-muted/30 hover:border-primary/40 p-3 transition-colors"
                  >
                    <Checkbox
                      checked={!!selected[r.id]}
                      onCheckedChange={(c) =>
                        setSelected((s) => ({ ...s, [r.id]: c === true }))
                      }
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="flex items-center gap-2 truncate font-medium">
                        {r.title}
                        {r.status === "never" ? (
                          <Badge variant="outline" className="text-rose-400 border-rose-400/30 bg-rose-500/10">
                            {t("luducard-new-game", "Novo Jogo")}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-400 border-amber-400/30 bg-amber-500/10">
                            {t("luducard-changed-save", "Alterado")}
                          </Badge>
                        )}
                      </span>
                      <span className="truncate font-mono text-xs text-muted-foreground">
                        {r.savePath}
                      </span>
                    </div>
                    <Separator orientation="vertical" className="hidden h-8 sm:block" />
                    <div className="hidden w-16 shrink-0 text-right text-xs text-muted-foreground sm:block">
                      {formatSize(r.sizeMB)}
                    </div>
                    <PlatformBadge platform={r.platform} />
                  </label>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
