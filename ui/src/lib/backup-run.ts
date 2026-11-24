import { useSyncExternalStore } from "react"
import { toast } from "sonner"

/**
 * The "Back up all / selected" run. It lives outside any page so that leaving the Library
 * neither loses its progress nor lets a second run start on top of it.
 */

export type BackupTarget = "local" | "cloud"

type Translate = (key: string, fallback: string, args?: Record<string, string | number>) => string

export interface BackupRunState {
  running: boolean
  target: BackupTarget
  done: number
  total: number
  current: string | null
  cancelling: boolean
  /** A cloud conflict that stopped the run, waiting for the user to pick a side. */
  conflict: any | null
}

let state: BackupRunState = {
  running: false,
  target: "local",
  done: 0,
  total: 0,
  current: null,
  cancelling: false,
  conflict: null,
}
const listeners = new Set<() => void>()

function set(patch: Partial<BackupRunState>) {
  state = { ...state, ...patch }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useBackupRun(): BackupRunState {
  return useSyncExternalStore(subscribe, () => state)
}

export function clearBackupConflict() {
  set({ conflict: null })
}

/** Stops after the game being backed up now; a game's backup can't be cut in half safely. */
export function cancelBackupRun() {
  if (state.running) set({ cancelling: true })
}

export async function runBackup(titles: string[], target: BackupTarget, t: Translate) {
  if (state.running || titles.length === 0) return

  set({ running: true, target, done: 0, total: titles.length, current: null, cancelling: false, conflict: null })
  const cloud = target === "cloud"
  const toastId = toast.loading(t("luducard-run-starting", "Starting backup..."))
  const cancelAction = {
    label: t("luducard-run-cancel", "Cancel"),
    onClick: () => cancelBackupRun(),
  }

  try {
    const { invoke } = await import("@tauri-apps/api/core")
    const prefs = cloud
      ? await invoke<{ conflictMode: "ask" | "newest" }>("get_cloud_prefs").catch(() => ({ conflictMode: "ask" as const }))
      : null

    for (const title of titles) {
      if (state.cancelling) {
        toast.info(
          t("luducard-run-cancelled", "Backup cancelled. { $done } of { $total } games were backed up.", {
            done: state.done,
            total: state.total,
          }),
          { id: toastId, action: undefined }
        )
        return
      }

      if (cloud) {
        const conflict = await invoke<any>("check_cloud_conflict", { gameTitle: title })
        if (conflict && prefs?.conflictMode === "newest" && conflict.remote.isNewer) {
          // The cloud's version is the most recent: bring it here instead of burying it.
          // The save it replaces was backed up before, so it stays in the version history.
          toast.loading(t("luducard-conflict-downloading", "Resolving conflict: downloading the cloud version of \"{ $game }\"...", { game: title }), { id: toastId, action: cancelAction })
          await invoke("restore_game", { gameTitle: title, backupId: null })
          set({ done: state.done + 1 })
          continue
        }
        if (conflict && prefs?.conflictMode !== "newest") {
          toast.dismiss(toastId)
          set({ conflict })
          return
        }
      }

      set({ current: title })
      const progress = `(${state.done + 1}/${state.total})`
      toast.loading(
        cloud
          ? t("luducard-run-game-cloud", "[{ $game }] Backing up and uploading to the cloud... { $progress }", { game: title, progress })
          : t("luducard-run-game-local", "[{ $game }] Creating local backup... { $progress }", { game: title, progress }),
        { id: toastId, action: cancelAction }
      )
      await invoke("backup_game", { gameTitle: title, cloud })
      set({ done: state.done + 1 })
    }

    toast.success(
      cloud
        ? t("luducard-run-done-cloud", "Backup and cloud upload finished.")
        : t("luducard-toast-backup-success", "Backup completed successfully!"),
      { id: toastId, action: undefined }
    )
  } catch (err) {
    toast.error(`${t("luducard-toast-backup-failed", "Backup failed:")} ${err}`, { id: toastId, action: undefined })
  } finally {
    set({ running: false, current: null, cancelling: false })
  }
}
