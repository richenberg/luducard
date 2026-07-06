import { useState, useEffect } from "react"
import { toast } from "sonner"
import { ArrowUpToLine, Loader2, ChevronDown, HardDrive, Cloud } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LibraryClient } from "@/components/dashboard/library-client"
import { AppShell } from "@/components/app-shell"
import { useLibrary } from "@/lib/library-context"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { ConflictResolutionModal } from "@/components/cloud/conflict-resolution-modal"

const isTauri = typeof window !== "undefined" && (window as any).__TAURI_INTERNALS__ !== undefined;

export default function Dashboard() {
  const { t } = useI18n()
  const { games } = useLibrary()
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [backingUp, setBackingUp] = useState(false);
  const [cloudSyncEnabled, setCloudSyncEnabled] = useState(false);
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [conflictInfo, setConflictInfo] = useState<any>(null);

  // Load cloud sync status
  useEffect(() => {
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
    checkCloudSync();
  }, []);

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const handleBackupSelected = async (target: "local" | "cloud" = "local") => {
    setBackingUp(true);
    const toastId = toast.loading(
      target === "cloud"
        ? "Fazendo backup e sincronizando com a nuvem..."
        : t("luducard-toast-backing-up", "Fazendo backup dos jogos selecionados...")
    );
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      const selectedIds = Object.keys(selected).filter((id) => selected[id]);
      const gamesToBackup = selectedIds.length > 0 
        ? games.filter((g) => selected[g.id]) 
        : games;
      
      for (const game of gamesToBackup) {
        if (target === "cloud" || cloudSyncEnabled) {
          const conflict = await invoke<any>("check_cloud_conflict", { gameTitle: game.title });
          if (conflict) {
            toast.dismiss(toastId);
            setConflictInfo(conflict);
            setConflictModalOpen(true);
            setBackingUp(false);
            return;
          }
        }
        const message = (target === "cloud" || cloudSyncEnabled)
          ? `[${game.title}] Criando backup local e enviando para a nuvem...`
          : `[${game.title}] Criando backup local...`;
        toast.loading(message, { id: toastId });
        await invoke("backup_game", { gameTitle: game.title });
      }

      if (target === "cloud") {
        // Run test/upload connection check to trigger sync or confirm everything uploaded
        try {
          await invoke("test_cloud_connection");
          toast.success("Backup e upload para nuvem concluÃ­dos com sucesso!", { id: toastId });
        } catch (cloudErr) {
          toast.warning("Backup local concluÃ­do, mas falhou ao enviar para a nuvem.", { id: toastId });
        }
      } else {
        toast.success(t("luducard-toast-backup-success", "Backup concluÃ­do com sucesso!"), { id: toastId });
      }
    } catch (err) {
      toast.error(`${t("luducard-toast-backup-failed", "Falha no backup:")} ${err}`, { id: toastId });
    } finally {
      setBackingUp(false);
    }
  };

  const handleResolveConflict = async (direction: "local" | "cloud") => {
    if (!conflictInfo) return;
    const title = conflictInfo.gameTitle;
    const id = toast.loading(
      direction === "local"
        ? `Resolvendo conflito: mantendo a versÃ£o local de "${title}"...`
        : `Resolvendo conflito: baixando a versÃ£o da nuvem de "${title}"...`
    );
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      if (direction === "local") {
        await invoke("backup_game", { gameTitle: title });
        toast.success(`VersÃ£o local de "${title}" salva na nuvem!`, { id });
      } else {
        await invoke("restore_game", { gameTitle: title, backupId: null });
        toast.success(`VersÃ£o da nuvem de "${title}" restaurada!`, { id });
      }
      setConflictModalOpen(false);
      setConflictInfo(null);
    } catch (err) {
      toast.error(`Falha ao resolver conflito de "${title}": ${err}`, { id });
    }
  };

  const backupButtonLabel = selectedCount > 0
    ? `${t("button-backup", "Fazer backup")} (${selectedCount}/${games.length})`
    : `${t("luducard-backup-all", "Fazer backup de todos")} (${games.length}/${games.length})`;

  const renderActions = () => {
    if (cloudSyncEnabled) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <div
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "flex items-center gap-1.5 cursor-pointer focus:outline-none",
                  (backingUp || games.length === 0) ? "pointer-events-none opacity-50" : ""
                )}
              />
            }
          >
            {backingUp ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ArrowUpToLine />
            )}
            {backupButtonLabel}
            <ChevronDown className="size-4 ml-1 opacity-70" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover/95 backdrop-blur-md border border-border">
            <DropdownMenuItem onClick={() => handleBackupSelected("local")}>
              <HardDrive className="size-4 mr-2 text-primary" />
              <span>Fazer Backup Local</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBackupSelected("cloud")}>
              <Cloud className="size-4 mr-2 text-primary" />
              <span>Sincronizar com a Nuvem</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <Button
        disabled={backingUp || games.length === 0}
        onClick={() => handleBackupSelected("local")}
        variant="default"
      >
        {backingUp ? (
          <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
        ) : (
          <ArrowUpToLine data-icon="inline-start" />
        )}
        {backupButtonLabel}
      </Button>
    )
  };

  return (
    <>
      <AppShell
        title={t("luducard-library", "Biblioteca")}
        description={t("luducard-dashboard-desc", "Gerencie e proteja os saves dos seus jogos")}
        actions={renderActions()}
      >
        <LibraryClient selected={selected} setSelected={setSelected} />
      </AppShell>
      <ConflictResolutionModal
        isOpen={conflictModalOpen}
        onClose={() => {
          setConflictModalOpen(false)
          setConflictInfo(null)
        }}
        conflict={conflictInfo}
        onResolve={handleResolveConflict}
      />
    </>
  )
}
