import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const isTauri = typeof window !== "undefined" && (window as any).__TAURI_INTERNALS__ !== undefined

type UploadMode = "auto" | "manual"
type ConflictMode = "ask" | "newest"

interface CloudPrefs {
  uploadMode: UploadMode
  conflictMode: ConflictMode
}

interface Option<T extends string> {
  value: T
  label: string
  desc: string
}

function Choice<T extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="flex flex-col gap-2 text-left">
      <span className="text-xs font-semibold">{title}</span>
      <div role="radiogroup" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex flex-col gap-0.5 rounded-lg border px-3 py-2 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
              value === option.value
                ? "border-primary bg-primary/10"
                : "border-border bg-muted/20 hover:border-primary/40"
            )}
          >
            <span className="text-xs font-medium">{option.label}</span>
            <span className="text-[10px] text-muted-foreground">{option.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/** When backups go to the cloud, and what to do when the cloud has a version this PC lacks. */
export function CloudRules() {
  const { t } = useI18n()
  const [prefs, setPrefs] = useState<CloudPrefs>({ uploadMode: "auto", conflictMode: "ask" })

  useEffect(() => {
    if (!isTauri) return
    import("@tauri-apps/api/core")
      .then(({ invoke }) => invoke<CloudPrefs>("get_cloud_prefs"))
      .then(setPrefs)
      .catch((err) => console.error("Failed to read cloud preferences:", err))
  }, [])

  const save = async (next: CloudPrefs) => {
    const previous = prefs
    setPrefs(next)
    if (!isTauri) return
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      await invoke("set_cloud_prefs", { prefs: next })
    } catch (err) {
      setPrefs(previous)
      toast.error(`${t("luducard-cw-save-failed", "Could not save the setting:")} ${err}`)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Choice<UploadMode>
        title={t("luducard-cloud-upload-mode", "Upload to the cloud")}
        value={prefs.uploadMode}
        onChange={(uploadMode) => save({ ...prefs, uploadMode })}
        options={[
          {
            value: "auto",
            label: t("luducard-cloud-upload-auto-label", "Automatically"),
            desc: t("luducard-cloud-upload-auto-hint", "Every backup goes up, including automatic ones and quick-saves."),
          },
          {
            value: "manual",
            label: t("luducard-cloud-upload-manual-label", "Only when I ask"),
            desc: t("luducard-cloud-upload-manual-hint", "Backups stay on this PC until you choose “Back up and upload to the cloud”."),
          },
        ]}
      />
      <Choice<ConflictMode>
        title={t("luducard-cloud-conflict-mode", "When the cloud has a version this PC hasn't seen")}
        value={prefs.conflictMode}
        onChange={(conflictMode) => save({ ...prefs, conflictMode })}
        options={[
          {
            value: "ask",
            label: t("luducard-cloud-conflict-ask-label", "Ask me"),
            desc: t("luducard-cloud-conflict-ask-hint", "Automatic backups stay on this PC and you get a notification."),
          },
          {
            value: "newest",
            label: t("luducard-cloud-conflict-newest-label", "Keep the most recent"),
            desc: t("luducard-cloud-conflict-newest-hint", "Decided by date. The other version stays in the version history."),
          },
        ]}
      />
    </div>
  )
}
