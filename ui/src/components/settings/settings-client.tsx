import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n"
import {
  Settings2,
  CalendarClock,
  Bell,
  Power,
  Monitor,
  Languages,
  Clock,
  HardDrive,
  Cloud,
  FileCode,
  Eye,
  Database,
  Key,
  Zap,
  AlertTriangle,
  History,
  Copy,
  GitBranch,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { games } from "@/lib/mock-data"
import { useLibrary } from "@/lib/library-context"
import { PlatformBadge } from "@/components/platform-badge"
import { cn } from "@/lib/utils"
import { useTheme, type Theme } from "@/lib/theme-context"

const isTauri = typeof window !== "undefined" && (window as any).__TAURI_INTERNALS__ !== undefined;

/**
 * Must match `DEFAULT_SHORTCUT` in src-tauri/src/hotkey.rs. Ctrl+Alt rather than Ctrl+Shift
 * because this is a global hotkey and Ctrl+Shift+S is "Save As" in many applications.
 */
const DEFAULT_QUICK_SAVE_SHORTCUT = "Ctrl+Alt+S";

/**
 * Must match DEFAULT_RETENTION_* in src-tauri/src/watcher.rs.
 *
 * Ludusavi ships with 1 full / 0 differential, meaning each backup replaces the previous
 * one — so the version list could never hold more than one entry and pinning a save had
 * nothing to pin. 3 full copies with 5 change-only backups each gives 18 restore points.
 */
const DEFAULT_RETENTION_FULL = 3;
const DEFAULT_RETENTION_DIFFERENTIAL = 5;

/** Versioning is "off" when only a single full copy is kept and nothing is layered on it. */
const isVersioningOff = (full: number, differential: number) => full <= 1 && differential === 0;

function SettingRow({
  icon: Icon,
  title,
  description,
  control,
}: {
  icon: any
  title: string
  description: string
  control: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <span className="flex items-center gap-3">
        <Icon className="size-4 text-primary" />
        <span className="flex flex-col">
          <span className="text-sm font-medium">{title}</span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </span>
      </span>
      {control}
    </div>
  )
}

export function SettingsClient() {
  const { t, language, setLanguage } = useI18n()
  const { theme, setTheme } = useTheme()
  const [scheduleMode, setScheduleMode] = useState<"interval" | "days">("interval")
  const [allGamesScheduled, setAllGamesScheduled] = useState(false)
  const [scheduledGames, setScheduledGames] = useState<Record<string, boolean>>(
    Object.fromEntries(games.filter((g) => g.autoBackup).map((g) => [g.id, true])),
  )

  const weekDays = [
    { key: "sun", label: t("luducard-day-sun", "Dom") },
    { key: "mon", label: t("luducard-day-mon", "Seg") },
    { key: "tue", label: t("luducard-day-tue", "Ter") },
    { key: "wed", label: t("luducard-day-wed", "Qua") },
    { key: "thu", label: t("luducard-day-thu", "Qui") },
    { key: "fri", label: t("luducard-day-fri", "Sex") },
    { key: "sat", label: t("luducard-day-sat", "Sáb") }
  ]
  const [activeDays, setActiveDays] = useState<string[]>(["mon", "wed", "fri"])

  // Real backend settings state
  const [backupPath, setBackupPath] = useState("")
  const [rclonePath, setRclonePath] = useState("")
  const [cloudPath, setCloudPath] = useState("")
  const [cloudSync, setCloudSync] = useState(false)
  const [rcloneArguments, setRcloneArguments] = useState("")
  const [fileWatcher, setFileWatcher] = useState(false)
  const [systemTray, setSystemTray] = useState(true)
  const [startWithWindows, setStartWithWindows] = useState(false)
  const [portable, setPortable] = useState(false)
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("")
  const [confirmReset, setConfirmReset] = useState(false)
  const [quickSaveEnabled, setQuickSaveEnabled] = useState(true)
  const [quickSaveShortcut, setQuickSaveShortcut] = useState(DEFAULT_QUICK_SAVE_SHORTCUT)
  const [retentionFull, setRetentionFull] = useState(DEFAULT_RETENTION_FULL)
  const [retentionDifferential, setRetentionDifferential] = useState(DEFAULT_RETENTION_DIFFERENTIAL)
  const [hasCloudRemote, setHasCloudRemote] = useState(false)
  const [showNotesInLibrary, setShowNotesInLibrary] = useState(() => {
    return localStorage.getItem("luducard_show_notes_in_library") !== "false";
  })

  const { loadGames } = useLibrary()



  const loadSettings = async () => {
    if (!isTauri) return;
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      const s = await invoke<{
        backupPath: string;
        rclonePath: string;
        cloudPath: string;
        cloudSync: boolean;
        rcloneArguments: string;
        fileWatcher: boolean;
        systemTray: boolean;
        startWithWindows: boolean;
        portable: boolean;
        supabaseUrl: string;
        supabaseAnonKey: string;
        language: string;
        hasSetLanguage: boolean;
        quickSaveEnabled: boolean;
        quickSaveShortcut: string;
        retentionFull: number;
        retentionDifferential: number;
        hasCloudRemote: boolean;
      }>("get_settings");
      setBackupPath(s.backupPath);
      setRclonePath(s.rclonePath);
      setCloudPath(s.cloudPath);
      setCloudSync(s.cloudSync);
      setRcloneArguments(s.rcloneArguments);
      setFileWatcher(s.fileWatcher);
      setSystemTray(s.systemTray);
      setStartWithWindows(s.startWithWindows);
      setPortable(s.portable);
      setSupabaseUrl(s.supabaseUrl || "");
      setSupabaseAnonKey(s.supabaseAnonKey || "");
      setQuickSaveEnabled(s.quickSaveEnabled);
      setQuickSaveShortcut(s.quickSaveShortcut || DEFAULT_QUICK_SAVE_SHORTCUT);
      setRetentionFull(s.retentionFull || DEFAULT_RETENTION_FULL);
      setRetentionDifferential(s.retentionDifferential ?? DEFAULT_RETENTION_DIFFERENTIAL);
      setHasCloudRemote(s.hasCloudRemote);
    } catch (err) {
      console.error("Failed to load settings from Tauri:", err);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSettings = async (override?: { 
    fileWatcher?: boolean; 
    systemTray?: boolean; 
    startWithWindows?: boolean;
    quickSaveEnabled?: boolean;
    quickSaveShortcut?: string;
    retentionFull?: number;
    retentionDifferential?: number;
  }) => {
    const nextFileWatcher = override && override.fileWatcher !== undefined ? override.fileWatcher : fileWatcher;
    const nextSystemTray = override && override.systemTray !== undefined ? override.systemTray : systemTray;
    const nextStartWithWindows = override && override.startWithWindows !== undefined ? override.startWithWindows : startWithWindows;
    const nextQuickSaveEnabled = override && override.quickSaveEnabled !== undefined ? override.quickSaveEnabled : quickSaveEnabled;
    const nextQuickSaveShortcut = override && override.quickSaveShortcut !== undefined ? override.quickSaveShortcut : quickSaveShortcut;
    const nextRetentionFull = override && override.retentionFull !== undefined ? override.retentionFull : retentionFull;
    const nextRetentionDifferential =
      override && override.retentionDifferential !== undefined ? override.retentionDifferential : retentionDifferential;

    if (override) {
      if (override.fileWatcher !== undefined) setFileWatcher(override.fileWatcher);
      if (override.systemTray !== undefined) setSystemTray(override.systemTray);
      if (override.startWithWindows !== undefined) setStartWithWindows(override.startWithWindows);
      if (override.quickSaveEnabled !== undefined) setQuickSaveEnabled(override.quickSaveEnabled);
      if (override.quickSaveShortcut !== undefined) setQuickSaveShortcut(override.quickSaveShortcut);
      if (override.retentionFull !== undefined) setRetentionFull(override.retentionFull);
      if (override.retentionDifferential !== undefined) setRetentionDifferential(override.retentionDifferential);
    }

    if (isTauri) {
      const id = override ? undefined : toast.loading("Salvando configurações...");
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        await invoke("save_settings", {
          settings: {
            backupPath,
            rclonePath,
            cloudPath,
            cloudSync,
            rcloneArguments,
            fileWatcher: nextFileWatcher,
            systemTray: nextSystemTray,
            startWithWindows: nextStartWithWindows,
            portable,
            supabaseUrl,
            supabaseAnonKey,
            language,
            hasSetLanguage: true,
            quickSaveEnabled: nextQuickSaveEnabled,
            quickSaveShortcut: nextQuickSaveShortcut,
            retentionFull: nextRetentionFull,
            retentionDifferential: nextRetentionDifferential,
            hasCloudRemote,
          }
        });
        if (id) {
          toast.success("Configurações salvas no backend!", { id });
        }
        // Reload settings to ensure React states are perfectly in sync
        const s = await invoke<{
          backupPath: string;
          rclonePath: string;
          cloudPath: string;
          cloudSync: boolean;
          rcloneArguments: string;
          fileWatcher: boolean;
          systemTray: boolean;
          startWithWindows: boolean;
          portable: boolean;
          supabaseUrl: string;
          supabaseAnonKey: string;
          language: string;
          hasSetLanguage: boolean;
          quickSaveEnabled: boolean;
          quickSaveShortcut: string;
        retentionFull: number;
        retentionDifferential: number;
          hasCloudRemote: boolean;
        }>("get_settings");
        setBackupPath(s.backupPath);
        setRclonePath(s.rclonePath);
        setCloudPath(s.cloudPath);
        setCloudSync(s.cloudSync);
        setRcloneArguments(s.rcloneArguments);
        setFileWatcher(s.fileWatcher);
        setSystemTray(s.systemTray);
        setStartWithWindows(s.startWithWindows);
        setPortable(s.portable);
        setSupabaseUrl(s.supabaseUrl || "");
        setSupabaseAnonKey(s.supabaseAnonKey || "");
        setQuickSaveEnabled(s.quickSaveEnabled);
        setQuickSaveShortcut(s.quickSaveShortcut || DEFAULT_QUICK_SAVE_SHORTCUT);
        setRetentionFull(s.retentionFull || DEFAULT_RETENTION_FULL);
        setRetentionDifferential(s.retentionDifferential ?? DEFAULT_RETENTION_DIFFERENTIAL);
      setRetentionFull(s.retentionFull || DEFAULT_RETENTION_FULL);
      setRetentionDifferential(s.retentionDifferential ?? DEFAULT_RETENTION_DIFFERENTIAL);
        setHasCloudRemote(s.hasCloudRemote);
      } catch (err) {
        if (id) {
          toast.error(`Erro ao salvar: ${err}`, { id });
        } else {
          toast.error(`Erro ao salvar configuração: ${err}`);
        }
      }
    } else {
      if (!override) {
        toast.success("[Mock] Configurações salvas com sucesso!");
      }
    }
  }

  const handleTogglePortable = async (checked: boolean) => {
    if (!isTauri) {
      setPortable(checked);
      toast.success(`[Mock] Modo Portátil ${checked ? "ativado" : "desativado"}!`);
      return;
    }
    const id = toast.loading(checked ? "Ativando Modo Portátil e migrando dados..." : "Desativando Modo Portátil e migrando dados...");
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      await invoke("toggle_portable_mode", { enable: checked });
      toast.success(checked ? "Modo Portátil ativado! Configurações salvas na pasta do executável." : "Modo Portátil desativado!", { id });
      await loadSettings();
    } catch (err) {
      toast.error(`Erro ao alterar Modo Portátil: ${err}`, { id });
    }
  }

  const handleClearAppData = async () => {
    localStorage.clear();
    if (!isTauri) {
      toast.success("[Mock] Todos os dados do aplicativo foram apagados! O aplicativo seria reiniciado.");
      setConfirmReset(false);
      return;
    }
    const id = toast.loading("Limpando dados do aplicativo...");
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      await invoke("clear_app_data");
      toast.success("Dados limpos! Reiniciando o aplicativo...", { id });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      toast.error(`Erro ao limpar dados: ${err}`, { id });
    }
  }

  return (
    <Tabs defaultValue="general" className="gap-6">
      <TabsList>
        <TabsTrigger value="general">
          <Settings2 data-icon="inline-start" />
          {t("luducard-tab-general", "Geral")}
        </TabsTrigger>
        <TabsTrigger value="schedule">
          <CalendarClock data-icon="inline-start" />
          {t("luducard-tab-schedule", "Agendamento")}
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <Bell data-icon="inline-start" />
          {t("luducard-tab-notifications", "Notificações")}
        </TabsTrigger>
      </TabsList>

      {/* General */}
      <TabsContent value="general">
        <div className="flex flex-col gap-6">
          <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("luducard-general-preferences", "Preferências gerais")}</CardTitle>
            <CardDescription>{t("luducard-general-preferences-desc", "Caminhos e comportamento básico do aplicativo.")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">
            <SettingRow
              icon={Eye}
              title={t("luducard-file-watcher", "Monitor de Saves (File Watcher)")}
              description={t("luducard-file-watcher-desc", "Monitora alterações nos saves e faz backup automático quando o jogo fechar.")}
              control={
                <Switch
                  checked={fileWatcher}
                  onCheckedChange={(c) => {
                    handleSaveSettings({ fileWatcher: c });
                    toast.message(c ? "File Watcher ativado" : "File Watcher desativado");
                  }}
                />
              }
            />
            <Separator />
            <SettingRow
              icon={Power}
              title={t("luducard-start-with-windows", "Iniciar com o Windows")}
              description={t("luducard-start-with-windows-desc", "Abre minimizado na bandeja do sistema ao ligar o PC.")}
              control={
                <Switch
                  checked={startWithWindows}
                  onCheckedChange={(c) => {
                    handleSaveSettings({ startWithWindows: c });
                    toast.message(c ? "Inicialização automática ligada" : "Inicialização automática desligada");
                  }}
                />
              }
            />
            <Separator />
            <SettingRow
              icon={Settings2}
              title={t("luducard-system-tray", "Executar na Bandeja (System Tray)")}
              description={t("luducard-system-tray-desc", "Minimiza o aplicativo perto do relógio ao invés de fechar, mantendo o monitoramento em segundo plano.")}
              control={
                <Switch
                  checked={systemTray}
                  onCheckedChange={(c) => {
                    handleSaveSettings({ systemTray: c });
                    toast.message(c ? "Execução na bandeja ativada" : "Execução na bandeja desativada");
                  }}
                />
              }
            />
            <Separator />
            <SettingRow
              icon={HardDrive}
              title={t("luducard-portable", "Modo Portátil (Portable Mode)")}
              description={t("luducard-portable-desc", "Salva todas as configurações, manifestos e backups na pasta do executável (ideal para pendrives).")}
              control={
                <Switch
                  checked={portable}
                  onCheckedChange={handleTogglePortable}
                />
              }
            />
            <Separator />
            <SettingRow
              icon={Eye}
              title={t("luducard-show-notes-in-library", "Exibir Diário de Bordo na Biblioteca")}
              description={t("luducard-show-notes-in-library-desc", "Mostra o campo de anotações rápidas diretamente nos cartões e linhas da lista de jogos.")}
              control={
                <Switch
                  checked={showNotesInLibrary}
                  onCheckedChange={(c) => {
                    setShowNotesInLibrary(c);
                    localStorage.setItem("luducard_show_notes_in_library", String(c));
                    toast.success(c ? "Diário de bordo visível na biblioteca" : "Diário de bordo ocultado na biblioteca");
                  }}
                />
              }
            />
            <Separator />
            <SettingRow
              icon={Zap}
              title={t("luducard-quicksave", "Atalho de Emergência (Quick-Save Manual)")}
              description={t("luducard-quicksave-desc", "Atalho global (Save State para PC) para fazer backup do jogo ativo em primeiro plano.")}
              control={
                <div className="flex items-center gap-3">
                  <Input
                    value={quickSaveShortcut}
                    onKeyDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      const keys: string[] = [];
                      if (e.ctrlKey) keys.push("Ctrl");
                      if (e.shiftKey) keys.push("Shift");
                      if (e.altKey) keys.push("Alt");
                      if (e.metaKey) keys.push("Win");

                      const key = e.key;
                      const isModifier = ["Control", "Shift", "Alt", "Meta"].includes(key);

                      if (!isModifier) {
                        if (key.length === 1) {
                          keys.push(key.toUpperCase());
                        } else {
                          const friendlyKeys: Record<string, string> = {
                            " ": "Space",
                            "ArrowUp": "Up",
                            "ArrowDown": "Down",
                            "ArrowLeft": "Left",
                            "ArrowRight": "Right",
                            "Escape": "Esc",
                            "Enter": "Enter",
                            "Backspace": "Backspace",
                            "Tab": "Tab",
                          };
                          keys.push(friendlyKeys[key] || key);
                        }
                      }

                      if (keys.length > 0) {
                        const formatted = keys.join("+");
                        setQuickSaveShortcut(formatted);
                        handleSaveSettings({ quickSaveShortcut: formatted });
                      }
                    }}
                    readOnly
                    placeholder={t("luducard-quicksave-press-keys", "Pressione as teclas...")}
                    className="w-36 text-center font-mono text-xs cursor-pointer bg-muted/30 focus:bg-background h-8"
                    title={t("luducard-shortcut-input-title", "Click and press the key combination you want")}
                  />
                  <Switch
                    checked={quickSaveEnabled}
                    onCheckedChange={(c) => {
                      setQuickSaveEnabled(c);
                      handleSaveSettings({ quickSaveEnabled: c });
                      toast.message(c ? "Atalho de emergência ativado" : "Atalho de emergência desativado");
                    }}
                  />
                </div>
              }
            />
            <Separator />
            <SettingRow
              icon={History}
              title={t("luducard-versioning", "Save Versioning")}
              description={t(
                "luducard-versioning-desc",
                "Keep a history of previous saves instead of overwriting the last one. Pinned saves are always kept, no matter the limits."
              )}
              control={
                <Switch
                  checked={!isVersioningOff(retentionFull, retentionDifferential)}
                  onCheckedChange={(c) => {
                    // Off is 1 full with nothing layered on it; on restores the shipped default.
                    const full = c ? DEFAULT_RETENTION_FULL : 1
                    const differential = c ? DEFAULT_RETENTION_DIFFERENTIAL : 0
                    setRetentionFull(full)
                    setRetentionDifferential(differential)
                    handleSaveSettings({ retentionFull: full, retentionDifferential: differential })
                  }}
                />
              }
            />
            {!isVersioningOff(retentionFull, retentionDifferential) && (
              <>
                <Separator />
                <SettingRow
                  icon={Copy}
                  title={t("luducard-retention-full", "Complete copies to keep")}
                  description={t(
                    "luducard-retention-full-desc",
                    "Each one holds every save file for the game. More copies means more protection and more disk used."
                  )}
                  control={
                    <Input
                      type="number"
                      min={1}
                      max={255}
                      value={retentionFull}
                      onChange={(e) => setRetentionFull(Number(e.target.value))}
                      onBlur={() => {
                        const full = Math.min(255, Math.max(1, retentionFull || 1))
                        setRetentionFull(full)
                        handleSaveSettings({ retentionFull: full })
                      }}
                      className="w-20 text-center"
                    />
                  }
                />
                <Separator />
                <SettingRow
                  icon={GitBranch}
                  title={t("luducard-retention-differential", "Change-only backups per copy")}
                  description={t(
                    "luducard-retention-differential-desc",
                    "These store just what changed since the last complete copy, so they are much smaller. Restore points total complete copies × (1 + this number)."
                  )}
                  control={
                    <Input
                      type="number"
                      min={0}
                      max={255}
                      value={retentionDifferential}
                      onChange={(e) => setRetentionDifferential(Number(e.target.value))}
                      onBlur={() => {
                        const differential = Math.min(255, Math.max(0, retentionDifferential || 0))
                        setRetentionDifferential(differential)
                        handleSaveSettings({ retentionDifferential: differential })
                      }}
                      className="w-20 text-center"
                    />
                  }
                />
              </>
            )}
            <Separator />
            <SettingRow
              icon={Monitor}
              title={t("luducard-theme", "Tema")}
              description={t("luducard-theme-desc", "Aparência da interface do aplicativo.")}
              control={
                <Select value={theme} onValueChange={(val) => setTheme(val as Theme)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="dark">{t("luducard-theme-dark", "Escuro")}</SelectItem>
                      <SelectItem value="light">{t("luducard-theme-light", "Claro")}</SelectItem>
                      <SelectItem value="system">{t("luducard-theme-system", "Sistema")}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              }
            />
            <Separator />
            <SettingRow
              icon={Languages}
              title={t("luducard-language", "Idioma")}
              description={t("luducard-language-desc", "Idioma da interface.")}
              control={
                <Select value={language} onValueChange={(val) => { if (val) setLanguage(val); }}>
                  <SelectTrigger className="w-40">
                    <SelectValue>
                      {language === "en-US" && "English"}
                      {language === "pt-BR" && "Português (Brasil)"}
                      {language === "es-ES" && "Español"}
                      {language === "ru-RU" && "Русский"}
                      {language === "zh-Hans" && "中文 (简体)"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="en-US">English</SelectItem>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                      <SelectItem value="ru-RU">Русский</SelectItem>
                      <SelectItem value="zh-Hans">中文 (简体)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              }
            />
            
            {/* Real Paths configuration when running under Tauri */}
            <Separator />
            <div className="flex flex-col gap-2.5 py-3">
              <span className="flex items-center gap-2 text-sm font-medium">
                <HardDrive className="size-4 text-primary" />
                {t("luducard-backup-dir", "Diretório de Backup")}
              </span>
              <span className="text-xs text-muted-foreground">{t("luducard-backup-dir-desc", "Onde os saves dos seus jogos serão guardados localmente.")}</span>
              <Input
                value={backupPath}
                onChange={(e) => setBackupPath(e.target.value)}
                placeholder="Ex: C:/Users/Player/LuducardBackups"
                className="max-w-md font-mono text-xs"
              />
            </div>

            <Separator />
            <div className="flex flex-col gap-2.5 py-3">
              <span className="flex items-center gap-2 text-sm font-medium">
                <FileCode className="size-4 text-primary" />
                {t("luducard-rclone-path", "Caminho do executável Rclone")}
              </span>
              <span className="text-xs text-muted-foreground">{t("luducard-rclone-path-desc", "Caminho para o executável rclone usado no envio para nuvem.")}</span>
              <Input
                value={rclonePath}
                onChange={(e) => setRclonePath(e.target.value)}
                placeholder="rclone"
                className="max-w-md font-mono text-xs"
              />
            </div>

            <Separator />
            <div className="flex flex-col gap-2.5 py-3">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Cloud className="size-4 text-primary" />
                {t("luducard-cloud-folder", "Pasta Remota na Nuvem")}
              </span>
              <span className="text-xs text-muted-foreground">{t("luducard-cloud-folder-desc", "Nome da pasta remota para sincronizar os arquivos.")}</span>
              <Input
                value={cloudPath}
                onChange={(e) => setCloudPath(e.target.value)}
                placeholder="ludusavi"
                className="max-w-md font-mono text-xs"
              />
            </div>

            <Separator />
            <div className="flex flex-col gap-2.5 py-3">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Cloud className="size-4 text-primary" />
                {t("luducard-rclone-args", "Argumentos extras do Rclone")}
              </span>
              <span className="text-xs text-muted-foreground">{t("luducard-rclone-args-desc", "Comandos e flags opcionais passados diretamente ao rclone.")}</span>
              <Input
                value={rcloneArguments}
                onChange={(e) => setRcloneArguments(e.target.value)}
                placeholder="Ex: --fast-list"
                className="max-w-md font-mono text-xs"
              />
            </div>

            <Separator />
            <div className="flex justify-end pt-4">
              <Button onClick={() => handleSaveSettings()}>{t("luducard-btn-save-settings", "Salvar Configurações")}</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-red-500/[0.02]">
          <CardHeader>
            <CardTitle className="text-base text-red-400 flex items-center gap-2">
              <AlertTriangle className="size-4 text-red-500" />
              {t("luducard-danger-zone", "Zona de Perigo")}
            </CardTitle>
            <CardDescription>
              {t("luducard-danger-zone-desc", "Ações destrutivas que não podem ser desfeitas.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-lg border border-red-500/30 bg-red-500/[0.05] p-3 text-xs text-red-300 flex flex-col gap-1 leading-relaxed">
              <span className="font-semibold text-red-200">
                {t("luducard-reset-warning-title", "AVISO IMPORTANTE:")}
              </span>
              <span>
                {t("luducard-reset-warning-desc", "Isso apagará permanentemente todas as suas configurações, caminhos de busca personalizados, histórico de escaneamento de jogos, credenciais de nuvem e perfis de save criados. Suas pastas de backups originais no disco não serão excluídas. O aplicativo será reiniciado após a limpeza.")}
              </span>
            </div>
            
            <div className="flex justify-start">
              {!confirmReset ? (
                <Button 
                  variant="destructive" 
                  onClick={() => setConfirmReset(true)}
                >
                  {t("luducard-btn-reset-app", "Limpar Todos os Dados")}
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="destructive" 
                    onClick={handleClearAppData}
                  >
                    {t("luducard-btn-reset-confirm", "Sim, Confirmar Exclusão")}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setConfirmReset(false)}
                  >
                    {t("luducard-btn-reset-cancel", "Cancelar")}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>

      {/* Schedule */}
      <TabsContent value="schedule">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("luducard-schedule-auto-routine", "Rotina de saves automáticos")}</CardTitle>
              <CardDescription>{t("luducard-schedule-auto-routine-desc", "Defina quando os backups acontecem.")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <ToggleGroup
                value={[scheduleMode]}
                onValueChange={(v) => {
                  const next = v[0] as "interval" | "days" | undefined
                  if (next) setScheduleMode(next)
                }}
                variant="outline"
                spacing={0}
              >
                <ToggleGroupItem value="interval">{t("luducard-schedule-by-interval", "Por intervalo")}</ToggleGroupItem>
                <ToggleGroupItem value="days">{t("luducard-schedule-by-days", "Dias da semana")}</ToggleGroupItem>
              </ToggleGroup>

              {scheduleMode === "interval" ? (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
                  <Clock className="size-4 text-primary" />
                  <span className="text-sm">{t("luducard-schedule-backup-every", "Fazer backup a cada")}</span>
                  <Select defaultValue="6">
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="1">{t("luducard-schedule-1-hour", "1 hora")}</SelectItem>
                        <SelectItem value="3">{t("luducard-schedule-3-hours", "3 horas")}</SelectItem>
                        <SelectItem value="6">{t("luducard-schedule-6-hours", "6 horas")}</SelectItem>
                        <SelectItem value="12">{t("luducard-schedule-12-hours", "12 horas")}</SelectItem>
                        <SelectItem value="24">{t("luducard-schedule-24-hours", "24 horas")}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex flex-wrap gap-1.5">
                    {weekDays.map((d) => (
                      <button
                        key={d.key}
                        onClick={() =>
                          setActiveDays((prev) =>
                            prev.includes(d.key) ? prev.filter((x) => x !== d.key) : [...prev, d.key],
                          )
                        }
                        className={
                          activeDays.includes(d.key)
                            ? "rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                            : "rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                        }
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="size-4 text-primary" />
                    <span className="text-sm">{t("luducard-schedule-at-time", "No horário")}</span>
                    <Select defaultValue="22">
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="08">08:00</SelectItem>
                          <SelectItem value="12">12:00</SelectItem>
                          <SelectItem value="18">18:00</SelectItem>
                          <SelectItem value="22">22:00</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("luducard-schedule-games-in-schedule", "Jogos no cronograma")}</CardTitle>
              <CardDescription>
                {t("luducard-schedule-games-in-schedule-desc", "Selecione quais jogos seguem esta rotina automática.")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
                <span className="text-sm font-medium">
                  {t("luducard-schedule-all-games", "Fazer backup de todos os jogos")}
                </span>
                <Switch
                  checked={allGamesScheduled}
                  onCheckedChange={(checked) => {
                    setAllGamesScheduled(checked)
                    if (checked) {
                      setScheduledGames(
                        Object.fromEntries(games.map((g) => [g.id, true]))
                      )
                    }
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                {games.map((g) => (
                  <label
                    key={g.id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3 transition-colors",
                      allGamesScheduled
                        ? "opacity-75 cursor-not-allowed"
                        : "cursor-pointer hover:border-primary/40"
                    )}
                  >
                    <Checkbox
                      checked={allGamesScheduled || !!scheduledGames[g.id]}
                      disabled={allGamesScheduled}
                      onCheckedChange={(c) =>
                        setScheduledGames((s) => ({ ...s, [g.id]: c === true }))
                      }
                    />
                    <img
                      src={g.cover || "/placeholder.svg"}
                      alt=""
                      className="h-10 w-8 rounded object-cover"
                    />
                    <span className="flex-1 truncate text-sm font-medium">{g.title}</span>
                    <PlatformBadge platform={g.platform} />
                  </label>
                ))}
              </div>
              <Button
                className="mt-2 self-end"
                onClick={() => toast.success(t("luducard-schedule-saved-toast", "Cronograma salvo"))}
              >
                {t("luducard-schedule-btn-save", "Salvar cronograma")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Notifications */}
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("luducard-notification-alerts", "Alertas e notificações")}</CardTitle>
            <CardDescription>{t("luducard-notification-alerts-desc", "Como você quer ser avisado sobre os backups.")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">
            <SettingRow
              icon={Bell}
              title={t("luducard-notification-windows", "Notificações do Windows")}
              description={t("luducard-notification-windows-desc", "Avisa quando um backup é concluído com sucesso.")}
              control={<Switch defaultChecked onCheckedChange={(c) => toast.message(c ? t("luducard-notification-toast-enabled", "Notificações ligadas") : t("luducard-notification-toast-disabled", "Notificações desligadas"))} />}
            />
            <Separator />
            <SettingRow
              icon={Bell}
              title={t("luducard-notification-fail-alerts", "Alertas de falha")}
              description={t("luducard-notification-fail-alerts-desc", "Notifica imediatamente quando um backup falha.")}
              control={<Switch defaultChecked onCheckedChange={(c) => toast.message(c ? t("luducard-notification-toast-fail-enabled", "Alertas de falha ligados") : t("luducard-notification-toast-fail-disabled", "Alertas de falha desligados"))} />}
            />
            <Separator />
            <SettingRow
              icon={Bell}
              title={t("luducard-notification-sounds", "Sons de alerta")}
              description={t("luducard-notification-sounds-desc", "Toca um som ao concluir ou falhar um backup.")}
              control={<Switch onCheckedChange={(c) => toast.message(c ? t("luducard-notification-toast-sounds-enabled", "Sons ligados") : t("luducard-notification-toast-sounds-disabled", "Sons desligados"))} />}
            />
          </CardContent>
        </Card>
      </TabsContent>

    </Tabs>
  )
}
