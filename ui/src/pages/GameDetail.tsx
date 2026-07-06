import { useEffect, useState, useMemo } from "react"
import { Link, useParams, Navigate } from "react-router-dom"
import { ArrowLeft, Loader2 } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { GameDetailClient } from "@/components/game-detail/game-detail-client"
import { type Game } from "@/lib/mock-data"
import { useLibrary } from "@/lib/library-context"
import { useI18n } from "@/lib/i18n"

function checkIsTauri(): boolean {
  return typeof window !== "undefined" && (window as any).__TAURI_INTERNALS__ !== undefined;
}

export default function GameDetail() {
  const { id } = useParams<{ id: string }>()
  const { games, loading: libraryLoading } = useLibrary()
  const isTauri = checkIsTauri()
  const { t } = useI18n()

  // Find game from already-loaded library context (instant)
  const gameFromContext = useMemo(() => games.find(g => g.id === id), [games, id])

  // Detailed game from single-game backend scan
  const [freshGame, setFreshGame] = useState<Game | undefined>(undefined)
  const [fetchingDetails, setFetchingDetails] = useState(false)

  // Fetch detailed info (save path, size) for this specific game
  useEffect(() => {
    if (!isTauri || !gameFromContext?.title) return
    setFetchingDetails(true)
    const fetchDetails = async () => {
      try {
        const { invoke } = await import("@tauri-apps/api/core")
        const detail = await invoke<Game | null>("get_game_details", {
          gameTitle: gameFromContext.title,
        })
        if (detail) setFreshGame(detail)
      } catch (err) {
        console.error("Failed to load game details:", err)
      } finally {
        setFetchingDetails(false)
      }
    }
    fetchDetails()
  }, [isTauri, gameFromContext?.title])

  // Use fresh data if available, fall back to context data
  const game = freshGame || gameFromContext

  const handleRefresh = async () => {
    if (!isTauri || !game?.title) return
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      const detail = await invoke<Game | null>("get_game_details", {
        gameTitle: game.title,
      })
      if (detail) setFreshGame(detail)
    } catch (err) {
      console.error("Failed to refresh game details:", err)
    }
  }

  if (libraryLoading) {
    return (
      <AppShell title={t("luducard-loading", "Carregando...")} description={t("luducard-fetching-details", "Buscando detalhes do jogo")}>
        <div className="flex h-[400px] flex-col items-center justify-center gap-2">
          <Loader2 className="size-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">{t("luducard-loading-details", "Carregando detalhes do jogo...")}</span>
        </div>
      </AppShell>
    )
  }

  if (!game) return <Navigate to="/" replace />

  return (
    <AppShell
      title={game.title}
      description={t("luducard-details-desc", "Detalhes e histÃ³rico de backups")}
      actions={
        <Button
          variant="outline"
          render={
            <Link to="/">
              <ArrowLeft data-icon="inline-start" />
              {t("luducard-back", "Voltar")}
            </Link>
          }
        />
      }
    >
      <GameDetailClient game={game} onRefresh={handleRefresh} />
    </AppShell>
  )
}
