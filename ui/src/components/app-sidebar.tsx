import { Link, useLocation } from "react-router-dom"
import {
  LibraryBig,
  ScanLine,
  CloudCog,
  Settings,
  HardDriveDownload,
  Vault,
  Users,
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

const navItems = [
  { title: "Biblioteca", href: "/", icon: LibraryBig },
  { title: "Escanear & Adicionar", href: "/scan", icon: ScanLine },
  { title: "Nuvem & Sincronização", href: "/cloud", icon: CloudCog },
  { title: "Save Share HUB", href: "/community", icon: Users },
  { title: "Configurações", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { pathname } = useLocation()
  const { stats, coverProgress } = useLibrary()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2.5 px-2 py-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Vault className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none">Ludocard</span>
            <span className="text-xs text-muted-foreground">Backup de saves</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
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
            Status da biblioteca
          </div>
          <div className="mt-2 flex flex-col gap-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Jogos</span>
              <span className="font-medium">{stats.totalGames}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Saves armazenados</span>
              <span className="font-medium">
                {formatSize(stats.totalSizeMB)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Pendentes</span>
              <span className="font-medium text-amber-400">
                {stats.pending}
              </span>
            </div>
            
            {coverProgress.downloading && (
              <div className="mt-1 flex flex-col gap-1.5 border-t border-border/50 pt-2">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Baixando capas...</span>
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
