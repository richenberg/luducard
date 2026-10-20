import { useEffect, useState, type ReactNode } from "react"
import { toast } from "sonner"
import { FolderOpen, HardDrive } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const isTauri = typeof window !== "undefined" && (window as any).__TAURI_INTERNALS__ !== undefined

const MOVE_CANCELLED_ERROR = "backup-folder-move-cancelled"

interface BackupFolderSetup {
  pending: boolean
  suggested: string
  current: string
}

interface BackupFolderCheck {
  same: boolean
  nested: boolean
  writable: boolean
  hasBackups: boolean
  currentHasBackups: boolean
  requiredBytes: number
  freeBytes: number | null
}

interface MoveProgress {
  copiedFiles: number
  totalFiles: number
  copiedBytes: number
  totalBytes: number
}

async function invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  const core = await import("@tauri-apps/api/core")
  return core.invoke<T>(cmd, args)
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ["KB", "MB", "GB", "TB"]
  let value = bytes / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unit]}`
}

function Modal({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-lg">{children}</Card>
    </div>
  )
}

function PathBox({ path }: { path: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-xs break-all">
      <HardDrive className="size-4 shrink-0 text-primary" />
      {path}
    </div>
  )
}

/** Asks where backups go, once, on a brand-new install. Blocks the app until answered. */
export function FirstRunBackupFolder() {
  const { t } = useI18n()
  const [setup, setSetup] = useState<BackupFolderSetup | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!isTauri) return
    invoke<BackupFolderSetup>("get_backup_folder_setup")
      .then((s) => s.pending && setSetup(s))
      .catch((err) => console.error("Failed to read backup folder setup:", err))
  }, [])

  if (!setup) return null

  const confirm = async (path: string) => {
    setBusy(true)
    try {
      await invoke("set_backup_folder", { path })
      setSetup(null)
      toast.success(t("luducard-bf-chosen", "Pasta de backups definida."))
    } catch (err) {
      toast.error(String(err))
    } finally {
      setBusy(false)
    }
  }

  const chooseOther = async () => {
    let picked: string | null
    let check: BackupFolderCheck
    try {
      picked = await invoke<string | null>("select_folder")
      if (!picked) return
      check = await invoke<BackupFolderCheck>("check_backup_folder", { path: picked })
    } catch (err) {
      toast.error(String(err))
      return
    }
    if (!check.writable) {
      toast.error(t("luducard-bf-not-writable", "O Luducard não consegue gravar nessa pasta. Escolha outra."))
      return
    }
    await confirm(picked)
  }

  return (
    <Modal>
      <CardHeader>
        <CardTitle>{t("luducard-bf-first-title", "Onde guardar seus backups?")}</CardTitle>
        <CardDescription>
          {t(
            "luducard-bf-first-desc",
            "O Luducard guarda uma cópia dos saves dos seus jogos nesta pasta. Você pode mudar depois nas Configurações."
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PathBox path={setup.suggested} />
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" disabled={busy} onClick={chooseOther}>
          <FolderOpen className="size-4" />
          {t("luducard-bf-choose-other", "Escolher outra…")}
        </Button>
        <Button disabled={busy} onClick={() => confirm(setup.suggested)}>
          {t("luducard-bf-use-this", "Usar esta pasta")}
        </Button>
      </CardFooter>
    </Modal>
  )
}

type ChangeStep =
  | { kind: "idle" }
  | { kind: "ask-move"; path: string; check: BackupFolderCheck }
  | { kind: "has-backups"; path: string }
  | { kind: "moving"; path: string; progress: MoveProgress | null }

/** The "Change…" button for the backup folder in Settings, with the move flow behind it. */
export function ChangeBackupFolderButton({ onChanged }: { onChanged: () => void }) {
  const { t } = useI18n()
  const [step, setStep] = useState<ChangeStep>({ kind: "idle" })

  useEffect(() => {
    if (step.kind !== "moving") return
    let unlisten: (() => void) | undefined
    import("@tauri-apps/api/event").then(({ listen }) =>
      listen<MoveProgress>("backup-folder-move-progress", (e) =>
        setStep((s) => (s.kind === "moving" ? { ...s, progress: e.payload } : s))
      ).then((u) => (unlisten = u))
    )
    return () => unlisten?.()
  }, [step.kind])

  const applyFolder = async (path: string) => {
    try {
      await invoke("set_backup_folder", { path })
      toast.success(t("luducard-bf-changed", "Pasta de backups alterada."))
      onChanged()
    } catch (err) {
      toast.error(String(err))
    }
    setStep({ kind: "idle" })
  }

  const pick = async () => {
    const picked = await invoke<string | null>("select_folder")
    if (!picked) {
      setStep({ kind: "idle" })
      return
    }
    let check: BackupFolderCheck
    try {
      check = await invoke<BackupFolderCheck>("check_backup_folder", { path: picked })
    } catch (err) {
      toast.error(String(err))
      setStep({ kind: "idle" })
      return
    }

    if (check.same) {
      toast.info(t("luducard-bf-same", "Essa já é a pasta de backups atual."))
      setStep({ kind: "idle" })
    } else if (check.nested) {
      toast.error(
        t("luducard-bf-nested", "A nova pasta não pode ficar dentro da pasta atual, nem conter a pasta atual.")
      )
      setStep({ kind: "idle" })
    } else if (!check.writable) {
      toast.error(t("luducard-bf-not-writable", "O Luducard não consegue gravar nessa pasta. Escolha outra."))
      setStep({ kind: "idle" })
    } else if (check.hasBackups) {
      setStep({ kind: "has-backups", path: picked })
    } else if (!check.currentHasBackups) {
      await applyFolder(picked)
    } else {
      setStep({ kind: "ask-move", path: picked, check })
    }
  }

  const move = async (path: string) => {
    setStep({ kind: "moving", path, progress: null })
    try {
      const result = await invoke<{ oldFolderLeft: boolean }>("move_backup_folder", { path })
      if (result.oldFolderLeft) {
        toast.warning(
          t(
            "luducard-bf-moved-left",
            "Backups movidos. Alguns arquivos da pasta antiga não puderam ser apagados; você pode apagá-los manualmente."
          )
        )
      } else {
        toast.success(t("luducard-bf-moved", "Backups movidos para a nova pasta."))
      }
      onChanged()
    } catch (err) {
      if (String(err) === MOVE_CANCELLED_ERROR) {
        toast.info(t("luducard-bf-cancelled", "Mudança cancelada. Nada foi alterado."))
      } else {
        toast.error(`${t("luducard-bf-move-failed", "Não foi possível mover os backups. Nada foi alterado.")} ${err}`)
      }
    }
    setStep({ kind: "idle" })
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={pick} className="w-fit">
        <FolderOpen className="size-4" />
        {t("luducard-bf-change", "Alterar…")}
      </Button>

      {step.kind === "ask-move" && (() => {
        const { check, path } = step
        const noSpace = check.freeBytes !== null && check.freeBytes < check.requiredBytes
        return (
          <Modal>
            <CardHeader>
              <CardTitle>{t("luducard-bf-move-title", "Mover seus backups para a nova pasta?")}</CardTitle>
              <CardDescription>
                {t(
                  "luducard-bf-move-desc",
                  "Se não mover, os backups atuais ficam na pasta antiga e deixam de aparecer no Luducard."
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <PathBox path={path} />
              <span className="text-muted-foreground">
                {t("luducard-bf-size", "Tamanho dos backups:")} {formatBytes(check.requiredBytes)}
              </span>
              {noSpace && (
                <span className="text-destructive">
                  {t("luducard-bf-no-space", "Não há espaço livre suficiente nesse disco para mover os backups.")}
                </span>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setStep({ kind: "idle" })}>
                {t("luducard-bf-cancel", "Cancelar")}
              </Button>
              <Button variant="outline" onClick={() => applyFolder(path)}>
                {t("luducard-bf-dont-move", "Não mover")}
              </Button>
              <Button disabled={noSpace} onClick={() => move(path)}>
                {t("luducard-bf-move", "Mover")}
              </Button>
            </CardFooter>
          </Modal>
        )
      })()}

      {step.kind === "has-backups" && (
        <Modal>
          <CardHeader>
            <CardTitle>{t("luducard-bf-has-backups-title", "Essa pasta já contém backups do Luducard")}</CardTitle>
            <CardDescription>
              {t(
                "luducard-bf-has-backups-desc",
                "Você pode passar a usar os backups que estão lá. Seus backups atuais não serão movidos nem misturados."
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PathBox path={step.path} />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={pick}>
              {t("luducard-bf-choose-other-folder", "Escolher outra pasta")}
            </Button>
            <Button onClick={() => applyFolder(step.path)}>
              {t("luducard-bf-use-existing", "Usar os backups que estão lá")}
            </Button>
          </CardFooter>
        </Modal>
      )}

      {step.kind === "moving" && (
        <Modal>
          <CardHeader>
            <CardTitle>{t("luducard-bf-moving-title", "Movendo backups…")}</CardTitle>
            <CardDescription>
              {t("luducard-bf-moving-desc", "Os backups automáticos ficam pausados até terminar.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <Progress
              value={step.progress && step.progress.totalBytes > 0
                ? (step.progress.copiedBytes / step.progress.totalBytes) * 100
                : 0}
            />
            {step.progress && (
              <span className="text-muted-foreground">
                {formatBytes(step.progress.copiedBytes)} / {formatBytes(step.progress.totalBytes)} ·{" "}
                {step.progress.copiedFiles} / {step.progress.totalFiles}
              </span>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={() => invoke("cancel_backup_folder_move")}>
              {t("luducard-bf-cancel", "Cancelar")}
            </Button>
          </CardFooter>
        </Modal>
      )}
    </>
  )
}
