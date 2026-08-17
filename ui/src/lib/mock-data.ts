/** "Other" covers games whose store the manifest cannot identify — most non-Steam, non-GOG entries. */
export type Platform = "Steam" | "Epic" | "GOG" | "Emulador" | "Origin" | "Other"

export type BackupStatus = "ok" | "pending" | "never"

export type BackupKind = "Automático" | "Manual" | "Antes de fechar" | "Restauração"

export interface BackupVersion {
  id: string
  date: string // ex: "Hoje", "Ontem", "12 jun 2026"
  time: string // ex: "14:00"
  kind: BackupKind
  sizeMB: number
  cloud: boolean
  locked?: boolean
  note?: string
}


export interface Game {
  id: string
  title: string
  cover: string
  platform: Platform
  savePath: string
  backupPath?: string
  sizeMB: number
  backupsSizeMB: number
  lastBackup: string
  status: BackupStatus
  autoBackup: boolean
  cloudSync: boolean
  backups: BackupVersion[]
  installed: boolean
  lastPlayed?: string // ISO 8601 date string
  emulator?: string
  notes?: string
  isCustom?: boolean
}

export const platformColors: Record<Platform, string> = {
  Steam: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  Epic: "bg-zinc-400/15 text-zinc-200 border-zinc-400/30",
  GOG: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  Emulador: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Origin: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  Other: "bg-slate-500/15 text-slate-300 border-slate-500/30",
}

export const emulatorColors: Record<string, string> = {
  Yuzu: "bg-red-500/15 text-red-300 border-red-500/30",
  Ryujinx: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  Dolphin: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  RetroArch: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  mGBA: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  Citra: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  PCSX2: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  PPSSPP: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  Cemu: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
}

export const games: Game[] = []

export function getGame(id: string): Game | undefined {
  return games.find((g) => g.id === id)
}

export interface ScanResult {
  id: string
  title: string
  platform: Platform
  path: string
  sizeMB: number
  isNew: boolean
}

export const scanResults: ScanResult[] = []

export const watchedFolders: any[] = []

export type CloudProvider = "Google Drive" | "OneDrive" | "Dropbox" | "WebDAV" | "FTP"

export interface CloudInfo {
  provider: CloudProvider
  connected: boolean
  account?: string
  usedGB?: number
  totalGB?: number
}

export const cloudProviders: CloudInfo[] = [
  { provider: "Google Drive", connected: false },
  { provider: "OneDrive", connected: false },
  { provider: "Dropbox", connected: false },
  { provider: "WebDAV", connected: false },
  { provider: "FTP", connected: false },
]

export const libraryStats = {
  totalGames: games.length,
  totalSizeMB: games.reduce((acc, g) => acc + g.sizeMB, 0),
  cloudSynced: games.filter((g) => g.cloudSync).length,
  pending: games.filter((g) => g.status === "pending" || g.status === "never").length,
}

export function formatSize(mb: number | undefined | null): string {
  if (mb === undefined || mb === null) return "0 KB"
  if (mb < 1) return `${Math.round(mb * 1000)} KB`
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`
  return `${mb.toFixed(1)} MB`
}

export interface CommunityPreset {
  id: string
  gameName: string
  gameId: string
  title: string
  fileName: string
  r2Path: string
  fileSize: number
  description: string
  authorName: string
  userUuid: string
  cpu: string
  gpu: string
  ram: string
  isOfficial: boolean
  upvotes: number
  downvotes: number
  reportsCount: number
  downloadsCount: number
  tags: string[]
  createdAt: string
}

export const mockPresets: CommunityPreset[] = [];
