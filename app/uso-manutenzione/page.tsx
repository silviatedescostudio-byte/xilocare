"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"
import { CustomerSidebar } from "@/components/customer/customer-sidebar"
import { CustomerHeader } from "@/components/customer/customer-header"
import { CustomerMobileSidebar } from "@/components/customer/customer-mobile-sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Home, 
  Building2, 
  Hotel, 
  Dumbbell, 
  FileText, 
  ExternalLink,
  AlertTriangle,
  Gauge,
  Activity,
  Thermometer,
  Droplets,
  Sun,
  Wind,
  Sparkles,
  Clock,
  UserCircle
} from "lucide-react"
import Link from "next/link"

// 4 Categorie di pulizia
const categoriePulizia = [
  { 
    id: "casa", 
    label: "CASA", 
    description: "Abitazioni private - Pulizia quotidiana e manutenzione domestica",
    icona: Home,
    colore: "text-blue-400",
    bgColore: "bg-blue-500/15"
  },
  { 
    id: "ufficio", 
    label: "UFFICIO", 
    description: "Ambienti di lavoro - Protocolli per traffico moderato",
    icona: Building2,
    colore: "text-emerald-400",
    bgColore: "bg-emerald-500/15"
  },
  { 
    id: "hotel-negozio", 
    label: "HOTEL / NEGOZIO", 
    description: "Spazi commerciali - Manutenzione intensiva",
    icona: Hotel,
    colore: "text-amber-400",
    bgColore: "bg-amber-500/15"
  },
  { 
    id: "palestra", 
    label: "PALESTRA", 
    description: "Impianti sportivi - Cura specializzata per pavimenti tecnici",
    icona: Dumbbell,
    colore: "text-red-400",
    bgColore: "bg-red-500/15"
  },
]

const soglieAmbientali = [
  { parametro: "Temperatura", icona: Thermometer, min: 18, max: 24, unita: "°C", colore: "text-orange-400" },
  { parametro: "Umidita Relativa", icona: Droplets, min: 45, max: 60, unita: "%", colore: "text-blue-400" },
  { parametro: "Esposizione UV", icona: Sun, min: 0, max: 500, unita: "lux", colore: "text-amber-400" },
  { parametro: "Ventilazione", icona: Wind, min: 0.1, max: 0.5, unita: "m/s", colore: "text-teal-400" },
]

const maintenanceTips = [
  {
    icon: Sparkles,
    title: "Pulizia Quotidiana",
    description: "Usa un panno in microfibra asciutto o leggermente umido. Mai troppa acqua!"
  },
  {
    icon: Droplets,
    title: "Prodotti Specifici",
    description: "Utilizza solo detergenti neutri specifici per parquet. Evita ammoniaca e alcol."
  },
  {
    icon: Sun,
    title: "Protezione UV",
    description: "Usa tende o pellicole UV per proteggere il legno dallo scolorimento."
  },
  {
    icon: Clock,
    title: "Manutenzione Periodica",
    description: "Pianifica una manutenzione professionale ogni 2-3 anni."
  }
]

export default function UsoManutenzionePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isCustomer } = useAuth()

  const SidebarComponent = isCustomer ? CustomerSidebar : Sidebar
  const HeaderComponent = isCustomer ? CustomerHeader : Header
  const MobileSidebarComponent = isCustomer ? CustomerMobileSidebar : MobileSidebar

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-wood-dark">
        <div className="hidden lg:block">
          <SidebarComponent />
        </div>
        <MobileSidebarComponent open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

        <div className="lg:pl-64">
          <HeaderComponent onMenuClick={() => setMobileMenuOpen(true)} />

          <main className="p-4 md:p-6 lg:p-8 space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-cream">Uso e Manutenzione</h1>
              <p className="text-cream/60 mt-1">Manuale educativo per la cura del tuo pavimento in legno</p>
            </div>

            {/* Quick Tips */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {maintenanceTips.map((tip, idx) => {
                const IconComponent = tip.icon
                return (
                  <Card key={idx} className="bg-wood-medium border-gold/20">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
                        <IconComponent className="h-6 w-6 text-gold" />
                      </div>
                      <h4 className="font-semibold text-cream text-sm mb-1">{tip.title}</h4>
                      <p className="text-xs text-cream/60">{tip.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Sezione 1: Categorie Pulizia con PDF */}
            <Card className="bg-wood-medium border-gold/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gold/10 rounded-lg">
                      <FileText className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <CardTitle className="text-cream">Guide alla Pulizia per Scenario</CardTitle>
                      <CardDescription className="text-cream/60">Seleziona la categoria per visualizzare le istruzioni specifiche</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {categoriePulizia.map((categoria) => {
                    const IconComponent = categoria.icona
                    return (
                      <div
                        key={categoria.id}
                        className="p-5 rounded-xl border border-gold/20 bg-wood-light/30 hover:border-gold/40 transition-all cursor-pointer"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${categoria.bgColore}`}>
                            <IconComponent className={`h-7 w-7 ${categoria.colore}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-bold text-lg ${categoria.colore}`}>{categoria.label}</h3>
                            <p className="text-sm text-cream/60 mt-1">{categoria.description}</p>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="mt-3 gap-2 bg-transparent border-gold/30 text-gold hover:bg-gold/10"
                            >
                              <FileText className="h-4 w-4" />
                              Visualizza PDF
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Sezione 2: Soglie Ambientali CPR */}
            <Card className="bg-wood-medium border-gold/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cpr-green-bg rounded-lg">
                    <Gauge className="h-6 w-6 text-cpr-green" />
                  </div>
                  <div>
                    <CardTitle className="text-cream">Soglie Ambientali CPR</CardTitle>
                    <CardDescription className="text-cream/60">Limiti per mantenere il semaforo VERDE</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {soglieAmbientali.map((soglia) => {
                    const IconComponent = soglia.icona
                    return (
                      <div key={soglia.parametro} className="p-4 rounded-xl bg-wood-light/30 border border-gold/10">
                        <div className="flex items-center gap-3 mb-3">
                          <IconComponent className={`h-5 w-5 ${soglia.colore}`} />
                          <span className="font-semibold text-cream">{soglia.parametro}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-cream/50">Min:</span>
                            <span className="font-mono text-sm font-semibold text-cream">{soglia.min}{soglia.unita}</span>
                          </div>
                          <div className="h-2 flex-1 mx-4 bg-gradient-to-r from-cpr-red/50 via-cpr-green/50 to-cpr-red/50 rounded-full" />
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-cream/50">Max:</span>
                            <span className="font-mono text-sm font-semibold text-cream">{soglia.max}{soglia.unita}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Sezione 3: Monitoraggio Shelly */}
            <Card className="bg-wood-medium border-gold/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cpr-green-bg rounded-lg">
                    <Activity className="h-6 w-6 text-cpr-green" />
                  </div>
                  <div>
                    <CardTitle className="text-cream">Monitoraggio Automatico</CardTitle>
                    <CardDescription className="text-cream/60">Il sistema ti guida automaticamente</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-xl bg-cpr-green-bg border border-cpr-green/30 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-cpr-green rounded-full animate-pulse" />
                    <span className="font-semibold text-cpr-green">Integrazione Shelly H&T Attiva</span>
                  </div>
                  <p className="text-sm text-cream/70">
                    Il sensore monitora costantemente temperatura e umidita. Non devi prendere decisioni tecniche: 
                    il sistema ti avvisa automaticamente quando intervenire per evitare danni.
                  </p>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-xl bg-wood-light/30 border border-gold/10">
                    <h4 className="font-semibold text-cream mb-2">Semaforo Verde</h4>
                    <p className="text-sm text-cream/60">Il tuo pavimento e protetto. Continua cosi!</p>
                  </div>
                  <div className="p-4 rounded-xl bg-wood-light/30 border border-gold/10">
                    <h4 className="font-semibold text-cream mb-2">Semaforo Giallo</h4>
                    <p className="text-sm text-cream/60">Segui i consigli di prevenzione mostrati.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-wood-light/30 border border-gold/10">
                    <h4 className="font-semibold text-cream mb-2">Semaforo Rosso</h4>
                    <p className="text-sm text-cream/60">Azione immediata richiesta. Vai a SOS Procedure.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avviso */}
            <Alert className="border-cpr-yellow/30 bg-cpr-yellow-bg">
              <AlertTriangle className="h-4 w-4 text-cpr-yellow" />
              <AlertDescription className="text-cream/80">
                <strong className="text-cpr-yellow">Nota importante:</strong> Per danni strutturali o emergenze, consulta i{" "}
                <Link href="/sos-protocols" className="underline font-semibold text-cpr-yellow hover:text-gold">
                  Protocolli SOS
                </Link>
                . Questa sezione copre solo la manutenzione ordinaria e preventiva.
              </AlertDescription>
            </Alert>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
