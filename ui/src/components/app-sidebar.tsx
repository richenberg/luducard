import { Link, useLocation } from "react-router-dom"
import {
  LibraryBig,
  ScanLine,
  CloudCog,
  Settings,
  HardDriveDownload,
  Users,
  Heart,
  SlidersHorizontal,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { formatSize } from "@/lib/mock-data"
import { useLibrary } from "@/lib/library-context"
import { useI18n } from "@/lib/i18n"

export function AppSidebar() {
  const { pathname } = useLocation()
  const { stats, coverProgress } = useLibrary()
  const { t } = useI18n()

  const navItems = [
    { title: t("luducard-library", "Biblioteca"), href: "/", icon: LibraryBig },
    { title: t("luducard-scan-and-add", "Escanear & Adicionar"), href: "/scan", icon: ScanLine },
    { title: t("luducard-cloud-and-sync", "Nuvem & SincronizaÃ§Ã£o"), href: "/cloud", icon: CloudCog },
    { title: t("luducard-save-share-hub", "Save Share HUB"), href: "/community", icon: Users },
    { title: t("luducard-preset-share-hub", "Preset Share HUB"), href: "/presets", icon: SlidersHorizontal },
    { title: t("luducard-settings", "ConfiguraÃ§Ãµes"), href: "/settings", icon: Settings },
    { title: t("luducard-support-project", "Apoiar o Projeto"), href: "/support", icon: Heart },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2.5 px-2 py-3">
          <div className="flex size-9 items-center justify-center">
            <svg viewBox="0 0 46.08 46.08" className="size-7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="fill-primary" d="M5.76,7.9c1.21,0,2.12-0.89,2.12-2.08c0-1.21-0.95-2.19-2.12-2.19c-1.19,0-2.16,0.96-2.16,2.13 S4.57,7.9,5.76,7.9z" />
              <path className="fill-primary" d="M42.74,38.63c-0.31-0.31-0.63-0.44-0.99-0.46c-4.82,0.07-16.2-0.04-33.85-0.32c0.01-7.01,0.01-11.94,0-14.81 c0-0.34-0.16-0.67-0.46-0.97c-0.54-0.52-1.41-0.87-1.71-0.83c-0.36,0.01-2.15,0.63-2.15,1.8l-0.01,3.33 c-0.01,4.55-0.02,9.25,0.01,13.94c0,0.41,0.49,1.15,0.94,1.59c0.4,0.39,0.81,0.59,1.2,0.59c0.01,0,0.02,0,0.03,0 c4.68-0.13,20.99-0.07,30.74-0.03l5.24,0.02c0,0,0,0,0,0c1.37,0,1.87-1.69,1.87-2.12C43.62,40.06,43.29,39.17,42.74,38.63z" />
              <path className="fill-primary" d="M5.8,12.21c-1.19,0-2.16,0.96-2.16,2.13s0.97,2.13,2.16,2.13c1.19,0,2.12-0.91,2.12-2.08 C7.91,13.2,6.96,12.21,5.8,12.21z" />
              <path className="fill-primary" d="M16.01,34.55h19.89c1.41,0,2.55-1.1,2.55-2.47v-26c0-1.36-1.14-2.47-2.55-2.47H24.93 c-0.68,0-1.32,0.26-1.8,0.72l-8.91,8.63c-0.48,0.46-0.75,1.09-0.75,1.74v17.36C13.46,33.45,14.6,34.55,16.01,34.55z M31.38,30.26 c-1.19,0-2.16-0.96-2.16-2.13S30.19,26,31.38,26c1.17,0,2.12,0.98,2.12,2.19C33.5,29.37,32.59,30.26,31.38,30.26z M31.92,7.2 c0-0.15,0.12-0.27,0.27-0.27h2.61c0.15,0,0.27,0.12,0.27,0.27v5.57c0,0.15-0.12,0.27-0.27,0.27h-2.61c-0.15,0-0.27-0.12-0.27-0.27 V7.2z M33.5,18.83c0,1.16-0.93,2.08-2.12,2.08c-1.19,0-2.16-0.96-2.16-2.13s0.97-2.13,2.16-2.13C32.55,16.64,33.5,17.62,33.5,18.83z M27.37,7.2c0-0.15,0.12-0.27,0.27-0.27h2.61c0.15,0,0.27,0.12,0.27,0.27v5.57c0,0.15-0.12,0.27-0.27,0.27h-2.61 c-0.15,0-0.27-0.12-0.27-0.27V7.2z M22.81,7.2c0-0.15,0.12-0.27,0.27-0.27h2.61c0.15,0,0.27,0.12,0.27,0.27v5.57 c0,0.15-0.12,0.27-0.27,0.27h-2.61c-0.15,0-0.27-0.12-0.27-0.27V7.2z M22.02,16.6c1.17,0,2.12,0.98,2.12,2.19 c0,1.18-0.91,2.08-2.12,2.08c-1.19,0-2.16-0.96-2.16-2.13C19.86,17.56,20.83,16.6,22.02,16.6z M22,25.99c1.17,0,2.12,0.98,2.12,2.19 c0,1.16-0.93,2.08-2.12,2.08c-1.19,0-2.16-0.96-2.16-2.13S20.81,25.99,22,25.99z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none">Luducard</span>
            <span className="text-xs text-muted-foreground">{t("luducard-sidebar-subtitle", "Backup de saves")}</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("luducard-navigation", "NavegaÃ§Ã£o")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={active}
                      render={
                        <Link to={item.href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="rounded-lg border border-border bg-card/60 p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <HardDriveDownload className="size-3.5 text-primary" />
            {t("luducard-library-status", "Status da biblioteca")}
          </div>
          <div className="mt-2 flex flex-col gap-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("luducard-games", "Jogos")}</span>
              <span className="font-medium">{stats.totalGames}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("luducard-stored-saves", "Saves armazenados")}</span>
              <span className="font-medium">
                {formatSize(stats.totalSizeMB)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("luducard-pending-saves", "Pendentes")}</span>
              <span className="font-medium text-amber-400">
                {stats.pending}
              </span>
            </div>
            
            {coverProgress.downloading && (
              <div className="mt-1 flex flex-col gap-1.5 border-t border-border/50 pt-2">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{t("luducard-downloading-covers", "Baixando capas...")}</span>
                  <span className="font-medium text-primary">{coverProgress.percentage}%</span>
                </div>
                <div className="h-1 w-full rounded-full bg-secondary overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300" 
                    style={{ width: `${coverProgress.percentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
