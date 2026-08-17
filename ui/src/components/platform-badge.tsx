import { cn } from "@/lib/utils"
import { type Platform, platformColors, emulatorColors } from "@/lib/mock-data"
import { useI18n } from "@/lib/i18n"

export function PlatformBadge({
  platform,
  emulator,
  className,
}: {
  platform: Platform
  emulator?: string
  className?: string
}) {
  const { t } = useI18n()

  // Store names are proper nouns and stay as they are; "Other" is the one label that is
  // a word rather than a brand, so it gets translated.
  const displayLabel =
    emulator || (platform === "Other" ? t("luducard-platform-other", "Other") : platform)
  const colorClass = emulator ? (emulatorColors[emulator] || platformColors[platform]) : platformColors[platform]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        colorClass,
        className,
      )}
    >
      {displayLabel}
    </span>
  )
}
