import { useState } from "react"
import { HardDrive, Cloud, AlertCircle, CheckCircle2, Clock, ShieldAlert, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"

interface ConflictVersionInfo {
  date: string
  sizeFormatted: string
  isNewer: boolean
  isOlder: boolean
  label: string
}

interface CloudConflict {
  gameTitle: string
  local: ConflictVersionInfo
  remote: ConflictVersionInfo
}

interface ConflictResolutionModalProps {
  isOpen: boolean
  onClose: () => void
  conflict: CloudConflict | null
  onResolve: (direction: "local" | "cloud") => Promise<void>
}

export function ConflictResolutionModal({
  isOpen,
  onClose,
  conflict,
  onResolve,
}: ConflictResolutionModalProps) {
  const { t } = useI18n()
  const [resolving, setResolving] = useState<"local" | "cloud" | null>(null)

  if (!isOpen || !conflict) return null

  const handleChoose = async (direction: "local" | "cloud") => {
    setResolving(direction)
    try {
      await onResolve(direction)
    } finally {
      setResolving(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-border bg-muted/30 flex items-start gap-4">
          <div className="p-3 bg-destructive/10 rounded-lg text-destructive shrink-0">
            <ShieldAlert className="size-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {t("luducard-conflict-title", "Conflito de Save Detectado")}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Os dados de save para <strong className="text-foreground">{conflict.gameTitle}</strong> no seu PC local e na nuvem sÃ£o diferentes. Escolha qual progresso deseja manter.
            </p>
          </div>
        </div>

        {/* Content - Side-by-side comparison */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
          {/* Este PC (Local) */}
          <div className={`relative flex flex-col justify-between p-5 rounded-xl border transition-all ${
            conflict.local.isNewer 
              ? "border-primary/50 bg-primary/5" 
              : "border-border bg-card/50"
          }`}>
            {conflict.local.isNewer && (
              <span className="absolute -top-3 left-4 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-primary-foreground bg-primary rounded-full uppercase">
                Recomendado
              </span>
            )}
            
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${conflict.local.isNewer ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  <HardDrive className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t("luducard-conflict-this-pc", "Este PC")}</h3>
                  <span className="text-[10px] text-muted-foreground">Armazenamento Local</span>
                </div>
              </div>

              {/* Version details info */}
              <div className="space-y-3 my-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-4 shrink-0 text-muted-foreground/60" />
                  <span>{conflict.local.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Tamanho:</span>
                  <span className="font-semibold text-foreground">{conflict.local.sizeFormatted}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {conflict.local.isNewer ? (
                  <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-medium">
                    <CheckCircle2 className="size-3" />
                    {t("luducard-conflict-newer", "Mais recente")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-medium">
                    <AlertCircle className="size-3" />
                    {t("luducard-conflict-older", "Mais antigo")}
                  </span>
                )}
              </div>
            </div>

            <Button
              className="w-full mt-6"
              variant={conflict.local.isNewer ? "default" : "outline"}
              disabled={resolving !== null}
              onClick={() => handleChoose("local")}
            >
              {resolving === "local" ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <HardDrive className="size-4 mr-2" />
              )}
              {t("luducard-conflict-keep-local", "Manter versÃ£o deste PC")}
            </Button>
          </div>

          {/* Nuvem (Remote) */}
          <div className={`relative flex flex-col justify-between p-5 rounded-xl border transition-all ${
            conflict.remote.isNewer 
              ? "border-primary/50 bg-primary/5" 
              : "border-border bg-card/50"
          }`}>
            {conflict.remote.isNewer && (
              <span className="absolute -top-3 left-4 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-primary-foreground bg-primary rounded-full uppercase">
                Recomendado
              </span>
            )}
            
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${conflict.remote.isNewer ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  <Cloud className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t("luducard-conflict-cloud", "Nuvem")}</h3>
                  <span className="text-[10px] text-muted-foreground">Backup Remoto</span>
                </div>
              </div>

              {/* Version details info */}
              <div className="space-y-3 my-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-4 shrink-0 text-muted-foreground/60" />
                  <span>{conflict.remote.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Tamanho:</span>
                  <span className="font-semibold text-foreground">{conflict.remote.sizeFormatted}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {conflict.remote.isNewer ? (
                  <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-medium">
                    <CheckCircle2 className="size-3" />
                    {t("luducard-conflict-newer", "Mais recente")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-medium">
                    <AlertCircle className="size-3" />
                    {t("luducard-conflict-older", "Mais antigo")}
                  </span>
                )}
              </div>
            </div>

            <Button
              className="w-full mt-6"
              variant={conflict.remote.isNewer ? "default" : "outline"}
              disabled={resolving !== null}
              onClick={() => handleChoose("cloud")}
            >
              {resolving === "cloud" ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <Cloud className="size-4 mr-2" />
              )}
              {t("luducard-conflict-keep-cloud", "Manter versÃ£o da Nuvem")}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground text-center sm:text-left font-medium">
            A versÃ£o rejeitada serÃ¡ sobrescrita. Esta aÃ§Ã£o Ã© irreversÃ­vel.
          </span>
          <Button
            variant="ghost"
            disabled={resolving !== null}
            onClick={onClose}
          >
            {t("luducard-cancel", "Cancelar")}
          </Button>
        </div>

      </div>
    </div>
  )
}
