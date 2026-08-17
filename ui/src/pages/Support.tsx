import {
  Heart,
  Coffee,
  Globe,
  ExternalLink,
  Info,
  CreditCard,
} from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"

const ITCH_URL = "https://richenbergdev.itch.io/luducard" // Link de doação do Itch.io
const STRIPE_URL = "https://buy.stripe.com/fZu8wO2Ej7L8fdjeHR9fW00" // Link de pagamento do Stripe (suporta Pix e Cartões)
const DISCORD_URL = "https://discord.gg/8K3TEBMyvK" // Link do servidor Discord

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 127.14 96.36" fill="currentColor" {...props}>
    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c1-.73,2-1.51,3-2.31A74.37,74.37,0,0,0,96,78.2c1,.8,2,1.58,3,2.31a68.43,68.43,0,0,1-10.5,5A77.7,77.7,0,0,0,95.14,96.36a105.73,105.73,0,0,0,31-18.83C129,54.65,122.94,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
  </svg>
)

export default function Support() {
  const { t } = useI18n()
  
  const handleOpenUrl = async (url: string) => {
    try {
      const { invoke } = await import("@tauri-apps/api/core")
      await invoke("open_url", { url })
    } catch (err) {
      console.error("Failed to open URL in browser:", err)
      // Fallback inside web browser
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <AppShell
      title={t("luducard-support-title", "Apoiar o Projeto")}
      description={t("luducard-support-desc", "Ajude a manter os servidores comunitários de saves e presets online")}
    >
      <div className="flex flex-col gap-6 max-w-2xl mx-auto my-4">
        {/* Intro Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-primary/10 via-background to-background p-5 shadow-sm">
          <div className="relative flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30">
              <Heart className="size-6 fill-current text-rose-500 animate-pulse" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <h2 className="text-sm font-bold text-foreground">{t("luducard-support-intro-title", "O Luducard é totalmente gratuito!")}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("luducard-support-intro-desc", "Nossos recursos de nuvem (Save Share Hub e Presets) geram custos mensais de servidores e tráfego. Se o aplicativo é útil para você, considere apoiar para ajudar a mantê-los online!")}
              </p>
            </div>
          </div>
        </div>

        {/* Unified Support Card */}
        <Card className="relative overflow-hidden border-border bg-card/60 backdrop-blur-md shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none" />
          
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base text-primary">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Coffee className="size-3.5 fill-current" />
              </span>
              {t("luducard-how-to-support", "Como Apoiar o Projeto")}
            </CardTitle>
            <CardDescription className="text-xs">
              {t("luducard-how-to-support-desc", "Escolha a sua forma de contribuição preferida. O Stripe oferece suporte a cartões de crédito e PIX nacional.")}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-6">
            {/* Action Buttons (Itch & Stripe) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Itch.io Button */}
              <Button
                onClick={() => handleOpenUrl(ITCH_URL)}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-medium flex items-center justify-center gap-2 h-11 shadow-md shadow-rose-950/10 cursor-pointer text-sm"
              >
                <Globe className="size-4" />
                {t("luducard-support-itch", "Apoiar no Itch.io")}
                <ExternalLink className="size-3.5" />
              </Button>

              {/* Stripe Button */}
              <Button
                onClick={() => handleOpenUrl(STRIPE_URL)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center justify-center gap-2 h-11 shadow-md shadow-indigo-950/10 cursor-pointer text-sm"
              >
                <CreditCard className="size-4" />
                {t("luducard-support-stripe", "Cartão / PIX via Stripe")}
                <ExternalLink className="size-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Discord Community Card */}
        <Card className="relative overflow-hidden border-[#5865F2]/20 bg-[#5865F2]/5 backdrop-blur-md shadow-lg">
          <CardContent className="flex flex-col sm:flex-row items-center gap-4 py-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#5865F2]/20 text-[#5865F2] border border-[#5865F2]/30">
              <DiscordIcon className="size-5" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-sm font-bold text-foreground">{t("luducard-discord-title", "Comunidade no Discord")}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                {t("luducard-discord-desc", "Tire dúvidas, reporte bugs, sugira funcionalidades e conecte-se com outros jogadores.")}
              </p>
            </div>
            <Button
              onClick={() => handleOpenUrl(DISCORD_URL)}
              className="w-full sm:w-auto bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium flex items-center justify-center gap-2 h-10 px-5 shadow-md shadow-blue-950/10 cursor-pointer text-sm"
            >
              <DiscordIcon className="size-4 shrink-0" />
              {t("luducard-discord-join", "Entrar no Discord")}
              <ExternalLink className="size-3.5" />
            </Button>
          </CardContent>
        </Card>

        {/* Server status alert info */}
        <div className="flex gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-xs text-blue-300">
          <Info className="size-4 shrink-0 text-blue-400 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-blue-200">{t("luducard-support-dest", "Destinação dos Recursos")}</span>
            <p className="text-[11px] text-blue-300/80 leading-relaxed">
              {t("luducard-support-dest-desc", "Toda contribuição é integralmente voltada para a manutenção dos servidores em nuvem (hospedagem e tráfego de dados).")}
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
