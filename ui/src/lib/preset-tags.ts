/**
 * Shared vocabulary for community presets.
 *
 * Tag ids and the anonymous-author sentinel are persisted in Supabase, so they must
 * stay byte-stable across locales. Only the `name`/`description` shown in the UI is
 * translated. Both PresetHub and the game detail page consume this module, which used
 * to hold two diverging hardcoded copies of the list.
 */

export type Translate = (key: string, defaultValue?: string) => string

export interface PresetTagInfo {
  /** Stable value persisted in the database — never localized. */
  id: string
  /** Localized label shown to the user. */
  name: string
  description: string
}

export const getPredefinedPresetTags = (t: Translate): PresetTagInfo[] => [
  { id: "Performance", name: t("luducard-preset-tag-perf", "Performance"), description: t("luducard-preset-tag-desc-perf", "Optimizations focused on FPS gain and smoothness.") },
  { id: "Qualidade / Visual", name: t("luducard-preset-tag-quality", "Quality / Visual"), description: t("luducard-preset-tag-desc-quality", "Optimizations focused on maximum graphic quality.") },
  { id: "Balanced", name: t("luducard-preset-tag-balanced", "Balanced"), description: t("luducard-preset-tag-desc-balanced", "Ideal balance between visual fidelity and FPS rate.") },
  { id: "Steam Deck", name: t("luducard-preset-tag-deck", "Steam Deck"), description: t("luducard-preset-tag-desc-deck", "Profile optimized specifically for Steam Deck/handheld screen and battery.") },
  { id: "Potato Mode", name: t("luducard-preset-tag-potato", "Potato Mode"), description: t("luducard-preset-tag-desc-potato", "To run on super old PCs and modest laptops.") },
  { id: "Controles / Layout", name: t("luducard-preset-tag-controls", "Controls / Layout"), description: t("luducard-preset-tag-desc-controls", "Customized mapping of controls, gamepad or hotkeys.") },
  { id: "Ray Tracing Opt", name: t("luducard-preset-tag-rt", "Ray Tracing Opt"), description: t("luducard-preset-tag-desc-rt", "Fine-tuned configuration with active ray tracing, aiming for good frame rate.") },
  { id: "4K Ready", name: t("luducard-preset-tag-4k", "4K Ready"), description: t("luducard-preset-tag-desc-4k", "Optimizations focused on 4K high-definition TVs and monitors.") },
  { id: "VR Ready", name: t("luducard-preset-tag-vr", "VR Ready"), description: t("luducard-preset-tag-desc-vr", "Settings adjusted for ideal FPS rate in virtual reality.") },
]

/** Localized label for a stored tag id; unknown (custom) ids render as-is. */
export const getTagLabel = (tags: PresetTagInfo[], id: string): string =>
  tags.find(tag => tag.id === id)?.name ?? id

/** Value stored for content shared without an author name. Kept stable across locales. */
export const ANONYMOUS_AUTHOR_ID = "Anonymous"

/** Sentinels written by older builds, before the author name stopped being localized on write. */
const ANONYMOUS_AUTHOR_ALIASES = ["Anonymous", "Anônimo", "Anonimo", "Anónimo"]

/** Localized author name, collapsing every legacy anonymous sentinel onto one label. */
export const getAuthorLabel = (t: Translate, name?: string | null): string =>
  !name || ANONYMOUS_AUTHOR_ALIASES.includes(name.trim())
    ? t("luducard-anonymous", "Anonymous")
    : name

/**
 * Backup `kind` arrives from the backend as a Portuguese string (see commands.rs) and is
 * also the lookup key for the timeline colours, so the wire value is left alone and only
 * the displayed label is translated. Unknown kinds fall through unchanged.
 */
const BACKUP_KIND_KEYS: Record<string, [string, string]> = {
  "Automático": ["luducard-backup-kind-automatic", "Automatic"],
  Manual: ["luducard-backup-kind-manual", "Manual"],
  "Manual (Bloqueado)": ["luducard-backup-kind-manual-locked", "Manual (Locked)"],
  "Antes de fechar": ["luducard-backup-kind-before-close", "Before closing"],
  "Restauração": ["luducard-backup-kind-restore", "Restore"],
}

/** Localized label for a backup kind. */
export const getBackupKindLabel = (t: Translate, kind: string): string => {
  const entry = BACKUP_KIND_KEYS[kind]
  return entry ? t(entry[0], entry[1]) : kind
}
