import React, { createContext, useContext, useState, useEffect } from "react"

const isTauri = typeof window !== "undefined" && (window as any).__TAURI_INTERNALS__ !== undefined;

interface I18nContextProps {
  t: (key: string, defaultValue?: string, args?: Record<string, string | number>) => string
  language: string
  setLanguage: (lang: string) => Promise<void>
  loading: boolean
}

const I18nContext = createContext<I18nContextProps>({
  t: (key, defaultValue, args) => fill(defaultValue || key, args),
  language: "en-US",
  setLanguage: async () => {},
  loading: true,
})

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [language, setLanguageState] = useState<string>("en-US")
  const [loading, setLoading] = useState(true)

  const loadTranslations = async () => {
    if (!isTauri) {
      // Mock translations for local development preview
      setLanguageState("pt-BR")
      setLoading(false)
      return
    }

    try {
      const { invoke } = await import("@tauri-apps/api/core")
      const settings = await invoke<any>("get_settings")
      let lang = settings.language
      const hasSetLanguage = settings.hasSetLanguage

      if (!hasSetLanguage) {
        // Detect system language
        const sysLang = navigator.language || "en-US"
        const sysLangLower = sysLang.toLowerCase()
        if (sysLangLower.startsWith("pt")) {
          lang = "pt-BR"
        } else if (sysLangLower.startsWith("es")) {
          lang = "es-ES"
        } else if (sysLangLower.startsWith("ru")) {
          lang = "ru-RU"
        } else if (sysLangLower.startsWith("zh")) {
          lang = "zh-Hans"
        } else {
          lang = "en-US"
        }

        // Save settings to backend with detected language
        await invoke("save_settings", {
          settings: {
            ...settings,
            language: lang,
            hasSetLanguage: true,
          },
        })
      }

      setLanguageState(lang)
      const dict = await invoke<Record<string, string>>("get_translations")
      setTranslations(dict)
    } catch (err) {
      console.error("Failed to load translations:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTranslations()
  }, [])

  const setLanguage = async (newLang: string) => {
    setLanguageState(newLang)

    if (!isTauri) {
      return
    }
    setLoading(true)
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      await invoke("save_language", { language: newLang })
      const dict = await invoke<Record<string, string>>("get_translations")
      setTranslations(dict)
    } catch (err) {
      console.error("Failed to set language:", err)
      try {
        const { invoke } = await import("@tauri-apps/api/core")
        const settings = await invoke<any>("get_settings")
        setLanguageState(settings.language)
      } catch (_) {}
    } finally {
      setLoading(false)
    }
  }

  const t = (key: string, defaultValue?: string, args?: Record<string, string | number>) => {
    return fill(translations[key] || defaultValue || key, args)
  }

  return (
    <I18nContext.Provider value={{ t, language, setLanguage, loading }}>
      {children}
    </I18nContext.Provider>
  )
}

/** Fills Fluent-style variables, `{ $name }`, which the translation files hand over as raw text. */
function fill(text: string, args?: Record<string, string | number>) {
  if (!args) return text
  return text.replace(/\{\s*\$(\w+)\s*\}/g, (match, name) => (name in args ? String(args[name]) : match))
}

export function useI18n() {
  return useContext(I18nContext)
}
