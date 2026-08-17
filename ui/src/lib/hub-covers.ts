/**
 * Cover art for the community hub (`Community`, `PresetHub`).
 *
 * Both pages used to resolve covers purely out of the local library, so a card for a
 * game the viewer does not own fell back to the placeholder — which is most of the hub,
 * since the whole point is downloading saves and presets for games you may not have.
 *
 * Owning the game was never actually required: the `get-game-cover` Edge Function
 * resolves a cover from the title alone (SteamGridDB lookup, cached per title in
 * `public.game_covers`), so the first viewer to see a title pays one lookup and every
 * other user is served from that cache.
 *
 * Unlike the library, hub covers are used as remote URLs instead of being downloaded
 * and base64-encoded: the hub only renders while online anyway, so a local copy would
 * buy nothing and cost disk plus bandwidth on a page the user is only browsing.
 */

import { useEffect, useMemo, useState } from "react"

/** Resolved lookups for this session. `null` means "asked, and there is no cover". */
const resolved = new Map<string, string | null>()

/** In-flight lookups, so two cards for the same game don't both hit the network. */
const pending = new Map<string, Promise<string | null>>()

const EMULATOR_PREFIXES = [
  "[Yuzu] ",
  "[Ryujinx] ",
  "[Dolphin] ",
  "[RetroArch] ",
  "[mGBA] ",
  "[Citra] ",
  "[PCSX2] ",
  "[PPSSPP] ",
  "[Cemu] ",
]

/**
 * Mirrors `clean_emulator_prefix` in src-tauri/src/commands.rs.
 *
 * The library path strips these before asking the Edge Function, and `game_covers` is
 * keyed by the title it was asked with. Sending the raw title here would miss those
 * rows and store a duplicate — "[Yuzu] Metroid Dread" and "Metroid Dread" would each
 * burn their own SteamGridDB lookup for the same artwork.
 */
export function cleanGameTitle(title: string): string {
  let cleaned = title
  for (const prefix of EMULATOR_PREFIXES) {
    cleaned = cleaned.replace(prefix, "")
  }

  const parenthetical = cleaned.indexOf(" (")
  if (parenthetical !== -1) {
    cleaned = cleaned.slice(0, parenthetical)
  }

  return cleaned.trim()
}

/**
 * Key covers are stored under. The hub keeps whatever title the uploader had, so this
 * matches case-insensitively. Exported because callers need it to read the returned map.
 */
export const coverKey = (title: string) => cleanGameTitle(title).toLowerCase()

async function requestCover(
  title: string,
  supabaseUrl: string,
  anonKey: string
): Promise<string | null> {
  try {
    const response = await fetch(`${supabaseUrl.replace(/\/+$/, "")}/functions/v1/get-game-cover`, {
      method: "POST",
      headers: {
        "apikey": anonKey,
        "Authorization": `Bearer ${anonKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameTitle: cleanGameTitle(title) }),
    })

    if (!response.ok) {
      // Log it: a broken cover service and a game with no artwork both end up as a
      // placeholder on screen, and without this there is nothing to tell them apart.
      console.warn(
        `[hub-covers] cover lookup for "${title}" failed: HTTP ${response.status}`,
        await response.text().catch(() => "")
      )
      return null
    }

    const body = await response.json()
    return typeof body?.coverUrl === "string" ? body.coverUrl : null
  } catch (err) {
    // A missing cover is cosmetic: the card still renders with the placeholder.
    console.warn(`[hub-covers] cover lookup for "${title}" could not be sent:`, err)
    return null
  }
}

/**
 * Resolves covers for `titles`, returning a map keyed by `coverKey`.
 *
 * Titles the local library already has a cover for should not be passed in — the caller
 * prefers its own copy, which is on disk and needs no request.
 */
export function useHubCovers(
  titles: string[],
  supabaseUrl: string,
  anonKey: string
): Record<string, string> {
  const [covers, setCovers] = useState<Record<string, string>>({})

  const keys = titles.map(coverKey).filter(Boolean)

  // Depend on the content rather than the array identity: the caller rebuilds this list
  // on every render, which as a dependency would re-run the effect forever.
  const signature = Array.from(new Set(keys)).sort().join("\n")

  const wanted = useMemo(() => (signature ? signature.split("\n") : []), [signature])

  useEffect(() => {
    if (!supabaseUrl || !anonKey || wanted.length === 0) return

    let cancelled = false

    // Serve whatever this session already knows before touching the network.
    const known: Record<string, string> = {}
    for (const key of wanted) {
      const hit = resolved.get(key)
      if (hit) known[key] = hit
    }
    if (Object.keys(known).length > 0) {
      setCovers((current) => ({ ...current, ...known }))
    }

    for (const key of wanted) {
      if (resolved.has(key)) continue

      const original = titles.find((title) => coverKey(title) === key)
      if (!original) continue

      let lookup = pending.get(key)
      if (!lookup) {
        lookup = requestCover(original, supabaseUrl, anonKey).then((url) => {
          resolved.set(key, url)
          pending.delete(key)
          return url
        })
        pending.set(key, lookup)
      }

      lookup.then((url) => {
        if (cancelled || !url) return
        setCovers((current) => (current[key] === url ? current : { ...current, [key]: url }))
      })
    }

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wanted, supabaseUrl, anonKey])

  return covers
}
