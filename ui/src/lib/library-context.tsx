import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { type Game, games as mockGames } from "@/lib/mock-data";

function checkIsTauri(): boolean {
  return typeof window !== "undefined" && (window as any).__TAURI_INTERNALS__ !== undefined;
}

export interface CoverProgress {
  downloading: boolean;
  current: number;
  total: number;
  percentage: number;
}

export interface ScanProgress {
  phase: string;
  progress: number;
  gamesFound: number;
  currentGame: string;
}

interface LibraryContextType {
  games: Game[];
  loading: boolean;
  scanning: boolean;
  scanProgress: ScanProgress;
  coverProgress: CoverProgress;
  scrollPositionRef: React.MutableRefObject<number>;
  loadGames: (silent?: boolean) => Promise<void>;
  scanGames: () => Promise<void>;
  updateGameNotes: (gameId: string, notes: string) => void;
  stats: {
    totalGames: number;
    totalSizeMB: number;
    cloudSynced: number;
    pending: number;
    /** RFC 3339 timestamp of the newest backup across all games, or null if none. */
    lastBackupAt: string | null;
  };
}

const SCAN_PROGRESS_INITIAL: ScanProgress = {
  phase: "",
  progress: 0,
  gamesFound: 0,
  currentGame: "",
};

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [isTauri] = useState(checkIsTauri);
  const [games, setGames] = useState<Game[]>(isTauri ? [] : mockGames);
  const [loading, setLoading] = useState(isTauri);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<ScanProgress>(SCAN_PROGRESS_INITIAL);
  const scrollPositionRef = useRef(0);
  const [coverProgress, setCoverProgress] = useState<CoverProgress>({
    downloading: false,
    current: 0,
    total: 0,
    percentage: 0,
  });

  // Ref to track if a scan is currently in-flight (survives re-renders)
  const scanInFlight = useRef(false);

  const loadGames = useCallback(async (silent = false) => {
    if (!isTauri) return;
    if (!silent) setLoading(true);
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      const list = await invoke<Game[]>("get_games");
      setGames(list);
    } catch (err) {
      console.error("Failed to load games from Tauri:", err);
    } finally {
      setLoading(false);
    }
  }, [isTauri]);

  const scanGames = useCallback(async () => {
    // Prevent double-scan
    if (scanInFlight.current) return;
    scanInFlight.current = true;

    if (!isTauri) {
      setScanning(true);
      setScanProgress({ phase: "scanning-emulators", progress: 5, gamesFound: 0, currentGame: "" });
      await new Promise((resolve) => setTimeout(resolve, 800));
      setScanProgress({ phase: "scanning-saves", progress: 15, gamesFound: 0, currentGame: "" });
      await new Promise((resolve) => setTimeout(resolve, 800));
      setScanProgress({ phase: "processing-results", progress: 60, gamesFound: 0, currentGame: "" });

      // Simulate games being found
      const mockNames = ["The Witcher 3", "Stardew Valley", "Celeste", "Hollow Knight", "Hades"];
      for (let i = 0; i < mockNames.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const prog = 60 + Math.round((i * 30) / mockNames.length);
        setScanProgress({ phase: "game-found", progress: prog, gamesFound: i + 1, currentGame: mockNames[i] });
      }

      setScanProgress({ phase: "finalizing", progress: 92, gamesFound: mockNames.length, currentGame: "" });
      await new Promise((resolve) => setTimeout(resolve, 500));
      setScanProgress({ phase: "done", progress: 100, gamesFound: mockNames.length, currentGame: "" });

      setScanning(false);
      scanInFlight.current = false;

      // Simula o progresso do download de capas no navegador
      let current = 0;
      const total = 3;
      setCoverProgress({
        downloading: true,
        current: 0,
        total,
        percentage: 0,
      });

      const interval = setInterval(() => {
        current += 1;
        const percentage = Math.round((current * 100) / total);
        setCoverProgress({
          downloading: current < total,
          current,
          total,
          percentage,
        });
        if (current >= total) {
          clearInterval(interval);
        }
      }, 1500);
      return;
    }

    setScanning(true);
    setScanProgress({ phase: "scanning-emulators", progress: 5, gamesFound: 0, currentGame: "" });
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      const list = await invoke<Game[]>("scan_games");
      setGames(list);
    } catch (err) {
      console.error("Failed to scan games:", err);
      throw err;
    } finally {
      setScanning(false);
      scanInFlight.current = false;
    }
  }, [isTauri]);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  // Listen for scan-progress events from the Tauri backend
  useEffect(() => {
    if (!isTauri) return;

    let unlistenScanProgress: (() => void) | null = null;
    let unlistenCoverProgress: (() => void) | null = null;
    let unlistenDownloaded: (() => void) | null = null;

    const setupListeners = async () => {
      try {
        const { listen } = await import("@tauri-apps/api/event");

        const unsubScan = await listen<ScanProgress>("scan-progress", (event) => {
          setScanProgress(event.payload);
        });
        unlistenScanProgress = unsubScan;

        const unsubProgress = await listen<CoverProgress>("cover-download-progress", (event) => {
          setCoverProgress(event.payload);
        });
        unlistenCoverProgress = unsubProgress;

        const unsubDownloaded = await listen<{ gameId: string; cover: string }>("cover-downloaded", (event) => {
          setGames((prev) =>
            prev.map((g) =>
              g.id === event.payload.gameId ? { ...g, cover: event.payload.cover } : g
            )
          );
        });
        unlistenDownloaded = unsubDownloaded;
      } catch (err) {
        console.error("Failed to setup Tauri listeners:", err);
      }
    };

    setupListeners();

    return () => {
      if (unlistenScanProgress) unlistenScanProgress();
      if (unlistenCoverProgress) unlistenCoverProgress();
      if (unlistenDownloaded) unlistenDownloaded();
    };
  }, [isTauri]);

  const updateGameNotes = useCallback((gameId: string, notes: string) => {
    setGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, notes } : g))
    );
  }, []);

  const stats = React.useMemo(() => {
    return {
      totalGames: games.length,
      totalSizeMB: games.reduce((acc, g) => acc + (g.sizeMB || 0), 0),
      cloudSynced: games.filter((g) => g.cloudSync).length,
      pending: games.filter((g) => g.status === "pending" || g.status === "never").length,
      lastBackupAt: games.reduce<string | null>((latest, g) => {
        if (!g.lastBackupAt) return latest;
        return !latest || new Date(g.lastBackupAt) > new Date(latest) ? g.lastBackupAt : latest;
      }, null),
    };
  }, [games]);

  return (
    <LibraryContext.Provider value={{ games, loading, scanning, scanProgress, coverProgress, scrollPositionRef, loadGames, scanGames, updateGameNotes, stats }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
}
