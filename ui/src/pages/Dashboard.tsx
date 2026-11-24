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
import { useBackupRun, runBackup, clearBackupConflict, type BackupTarget } from "@/lib/backup-run"

const isTauri = typeof window !== "undefined" && (window as any).__TAURI_INTERNALS__ !== undefined;

export default function Dashboard() {
  const { t } = useI18n()
  const { games } = useLibrary()
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const run = useBackupRun();
  const backingUp = run.running;
  const [cloudSyncEnabled, setCloudSyncEnabled] = useState(false);

  // The cloud option only makes sense with an account connected, not just the switch on.
  useEffect(() => {
    const checkCloudSync = async () => {
      if (isTauri) {
        try {
          const { invoke } = await import("@tauri-apps/api/core");
          const s = await invoke<any>("get_settings");
          setCloudSyncEnabled(Boolean(s.cloudSync && s.hasCloudRemote));
        } catch (e) {
          console.error(e);
        }
      }
    };
    checkCloudSync();
  }, []);

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const handleBackupSelected = (target: BackupTarget = "local") => {
    const titles = (selectedCount > 0 ? games.filter((g) => selected[g.id]) : games).map((g) => g.title);
    runBackup(titles, target, t);
  };

  const handleResolveConflict = async (direction: "local" | "cloud") => {
    const conflictInfo = run.conflict;
    if (!conflictInfo) return;
    const title = conflictInfo.gameTitle;
    const id = toast.loading(
      direction === "local"
        ? t("luducard-conflict-keeping-local", "Resolving conflict: keeping the local version of \"{ $game }\"...", { game: title })
        : t("luducard-conflict-downloading", "Resolving conflict: downloading the cloud version of \"{ $game }\"...", { game: title })
    );
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      if (direction === "local") {
        await invoke("backup_game", { gameTitle: title, cloud: true });
        toast.success(t("luducard-conflict-local-saved", "Local version of \"{ $game }\" saved to the cloud!", { game: title }), { id });
      } else {
        await invoke("restore_game", { gameTitle: title, backupId: null });
        toast.success(t("luducard-conflict-cloud-restored", "Cloud version of \"{ $game }\" restored!", { game: title }), { id });
      }
      clearBackupConflict();
    } catch (err) {
      toast.error(`${t("luducard-conflict-failed", "Could not resolve the conflict for \"{ $game }\":", { game: title })} ${err}`, { id });
    }
  };

  const backupButtonLabel = backingUp
    ? `${t("luducard-run-progress", "Backing up")} (${run.done}/${run.total})`
    : selectedCount > 0
    ? `${t("button-backup", "Fazer backup")} (${selectedCount}/${games.length})`
    : `${t("luducard-backup-all", "Fazer backup de todos")} (${games.length}/${games.length})`;

  const renderActions = () => {
    if (cloudSyncEnabled) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                disabled={backingUp || games.length === 0}
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
              <span>{t("luducard-run-local", "Local backup")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBackupSelected("cloud")}>
              <Cloud className="size-4 mr-2 text-primary" />
              <span>{t("luducard-run-cloud", "Back up and upload to the cloud")}</span>
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
        isOpen={run.conflict !== null}
        onClose={clearBackupConflict}
        conflict={run.conflict}
        onResolve={handleResolveConflict}
      />
    </>
  )
}
