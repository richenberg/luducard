import { AppShell } from "@/components/app-shell"
import { SettingsClient } from "@/components/settings/settings-client"
import { useI18n } from "@/lib/i18n"

export default function Settings() {
  const { t } = useI18n()
  return (
    <AppShell
      title={t("luducard-settings", "ConfiguraÃ§Ãµes")}
      description={t("luducard-settings-desc", "PreferÃªncias e comportamento do aplicativo")}
    >
      <SettingsClient />
    </AppShell>
  )
}
