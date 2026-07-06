import { AppShell } from "@/components/app-shell"
import { ScanClient } from "@/components/scan/scan-client"
import { useI18n } from "@/lib/i18n"

export default function Scan() {
  const { t } = useI18n()
  return (
    <AppShell
      title={t("luducard-scan-title", "Escanear & Adicionar")}
      description={t("luducard-scan-desc", "Encontre saves de jogos no seu computador")}
    >
      <ScanClient />
    </AppShell>
  )
}
