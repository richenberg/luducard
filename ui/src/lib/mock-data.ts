export type Platform = "Steam" | "Epic" | "GOG" | "Emulador" | "Origin"

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
}

export const platformColors: Record<Platform, string> = {
  Steam: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  Epic: "bg-zinc-400/15 text-zinc-200 border-zinc-400/30",
  GOG: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  Emulador: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Origin: "bg-orange-500/15 text-orange-300 border-orange-500/30",
}

export const games: Game[] = [
  {
    id: "aether-frontier",
    title: "Aether Frontier",
    cover: "/covers/aether-frontier.png",
    platform: "Steam",
    savePath: "C:/Users/Player/AppData/Roaming/AetherFrontier/Saves",
    sizeMB: 12.4,
    backupsSizeMB: 58.8,
    lastBackup: "Hoje, 14:00",
    status: "ok",
    autoBackup: true,
    cloudSync: true,
    backups: [
      { id: "b1", date: "Hoje", time: "14:00", kind: "Automático", sizeMB: 12.4, cloud: true },
      { id: "b2", date: "Hoje", time: "09:12", kind: "Manual", sizeMB: 12.1, cloud: true, locked: true },
      { id: "b3", date: "Ontem", time: "23:45", kind: "Antes de fechar", sizeMB: 11.8, cloud: true },
      { id: "b4", date: "Ontem", time: "18:30", kind: "Automático", sizeMB: 11.6, cloud: false },
      { id: "b5", date: "12 jun 2026", time: "21:05", kind: "Automático", sizeMB: 10.9, cloud: true },
    ],
    installed: true,
    lastPlayed: "2026-06-26T14:00:00-03:00",
  },
  {
    id: "ironclad-legion",
    title: "Ironclad Legion",
    cover: "/covers/ironclad-legion.png",
    platform: "Epic",
    savePath: "C:/Users/Player/Saved Games/IroncladLegion",
    sizeMB: 34.7,
    backupsSizeMB: 102.4,
    lastBackup: "Ontem, 22:10",
    status: "pending",
    autoBackup: true,
    cloudSync: false,
    backups: [
      { id: "b1", date: "Ontem", time: "22:10", kind: "Antes de fechar", sizeMB: 34.7, cloud: false },
      { id: "b2", date: "Ontem", time: "16:00", kind: "Automático", sizeMB: 34.2, cloud: false },
      { id: "b3", date: "10 jun 2026", time: "20:30", kind: "Manual", sizeMB: 33.5, cloud: false },
    ],
    installed: true,
    lastPlayed: "2026-06-25T22:10:00-03:00",
  },
  {
    id: "neon-drift",
    title: "Neon Drift",
    cover: "/covers/neon-drift.png",
    platform: "Steam",
    savePath: "C:/Program Files (x86)/Steam/userdata/884512/NeonDrift",
    sizeMB: 5.1,
    backupsSizeMB: 10.0,
    lastBackup: "Hoje, 11:32",
    status: "ok",
    autoBackup: false,
    cloudSync: true,
    backups: [
      { id: "b1", date: "Hoje", time: "11:32", kind: "Manual", sizeMB: 5.1, cloud: true },
      { id: "b2", date: "08 jun 2026", time: "19:15", kind: "Manual", sizeMB: 4.9, cloud: true },
    ],
    installed: true,
    lastPlayed: "2026-06-26T11:32:00-03:00",
  },
  {
    id: "hollow-pines",
    title: "Hollow Pines",
    cover: "/covers/hollow-pines.png",
    platform: "GOG",
    savePath: "C:/Users/Player/Documents/HollowPines/saves",
    sizeMB: 2.3,
    backupsSizeMB: 4.5,
    lastBackup: "3 dias atrás",
    status: "pending",
    autoBackup: true,
    cloudSync: true,
    backups: [
      { id: "b1", date: "22 jun 2026", time: "13:20", kind: "Automático", sizeMB: 2.3, cloud: true },
      { id: "b2", date: "20 jun 2026", time: "10:00", kind: "Automático", sizeMB: 2.2, cloud: true },
    ],
    installed: false,
    lastPlayed: "2026-06-22T13:20:00-03:00",
  },
  {
    id: "starforge",
    title: "Starforge",
    cover: "/covers/starforge.png",
    platform: "Steam",
    savePath: "C:/Program Files (x86)/Steam/userdata/884512/Starforge",
    sizeMB: 48.9,
    backupsSizeMB: 142.5,
    lastBackup: "Hoje, 08:00",
    status: "ok",
    autoBackup: true,
    cloudSync: true,
    backups: [
      { id: "b1", date: "Hoje", time: "08:00", kind: "Automático", sizeMB: 48.9, cloud: true },
      { id: "b2", date: "Ontem", time: "08:00", kind: "Automático", sizeMB: 47.5, cloud: true },
      { id: "b3", date: "23 jun 2026", time: "08:00", kind: "Automático", sizeMB: 46.1, cloud: true },
    ],
    installed: true,
    lastPlayed: "2026-06-26T08:00:00-03:00",
  },
  {
    id: "shadowveil",
    title: "Shadowveil",
    cover: "/covers/shadowveil.png",
    platform: "Origin",
    savePath: "C:/Users/Player/AppData/Local/Shadowveil/SaveGames",
    sizeMB: 18.2,
    backupsSizeMB: 0.0,
    lastBackup: "Nunca",
    status: "never",
    autoBackup: false,
    cloudSync: false,
    backups: [],
    installed: false,
  },
  {
    id: "pixel-knights",
    title: "Pixel Knights",
    cover: "/covers/pixel-knights.png",
    platform: "Emulador",
    savePath: "E:/Emuladores/RetroArch/saves/PixelKnights.srm",
    sizeMB: 0.8,
    backupsSizeMB: 2.3,
    lastBackup: "Ontem, 19:30",
    status: "ok",
    autoBackup: true,
    cloudSync: false,
    backups: [
      { id: "b1", date: "Ontem", time: "19:30", kind: "Antes de fechar", sizeMB: 0.8, cloud: false },
      { id: "b2", date: "Ontem", time: "17:10", kind: "Manual", sizeMB: 0.8, cloud: false },
      { id: "b3", date: "21 jun 2026", time: "22:00", kind: "Automático", sizeMB: 0.7, cloud: false },
    ],
    installed: true,
    lastPlayed: "2026-06-25T19:30:00-03:00",
  },
]

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

export const scanResults: ScanResult[] = [
  { id: "s1", title: "Crimson Tide", platform: "Steam", path: "C:/Steam/userdata/884512/CrimsonTide", sizeMB: 9.2, isNew: true },
  { id: "s2", title: "Verdant Realms", platform: "GOG", path: "C:/Users/Player/Documents/VerdantRealms", sizeMB: 14.0, isNew: true },
  { id: "s3", title: "Aether Frontier", platform: "Steam", path: "C:/Users/Player/AppData/Roaming/AetherFrontier", sizeMB: 12.4, isNew: false },
  { id: "s4", title: "Turbo Karts GP", platform: "Emulador", path: "E:/Emuladores/Dolphin/saves/TurboKarts", sizeMB: 3.4, isNew: true },
  { id: "s5", title: "Nightfall Saga", platform: "Epic", path: "C:/Users/Player/Saved Games/Nightfall", sizeMB: 22.6, isNew: true },
  { id: "s6", title: "Pixel Knights", platform: "Emulador", path: "E:/Emuladores/RetroArch/saves", sizeMB: 0.8, isNew: false },
]

export const watchedFolders = [
  { id: "f1", path: "C:/Program Files (x86)/Steam/userdata", type: "Padrão do sistema", games: 14 },
  { id: "f2", path: "C:/Users/Player/AppData/Roaming", type: "Padrão do sistema", games: 8 },
  { id: "f3", path: "D:/Jogos Antigos", type: "Personalizada", games: 5 },
  { id: "f4", path: "E:/Emuladores/Saves", type: "Personalizada", games: 23 },
]

export type CloudProvider = "Google Drive" | "OneDrive" | "Dropbox" | "WebDAV" | "FTP"

export interface CloudInfo {
  provider: CloudProvider
  connected: boolean
  account?: string
  usedGB?: number
  totalGB?: number
}

export const cloudProviders: CloudInfo[] = [
  { provider: "Google Drive", connected: true, account: "player@gmail.com", usedGB: 8.4, totalGB: 15 },
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
