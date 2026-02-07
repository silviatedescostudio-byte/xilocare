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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Home,
  Building2,
  Thermometer,
  Droplets,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react"

export default function ManutenzionePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [destinazioneUso, setDestinazioneUso] = useState<"residential" | "commercial">("residential")
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
            {/* Titolo Pagina */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-cream">
                Guida completa per la cura e manutenzione del tuo pavimento in legno
              </h1>
            </div>

            {/* Box Informativo ATTENZIONE */}
            <Card className="bg-cpr-yellow-bg border-cpr-yellow/40">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="p-2 rounded-lg bg-cpr-yellow/20">
                  <AlertTriangle className="h-6 w-6 text-cpr-yellow" />
                </div>
                <div>
                  <p className="font-bold text-cpr-yellow text-lg">ATTENZIONE</p>
                  <p className="text-cream/90 mt-1">
                    Negli ambienti lasciati chiusi a lungo possono avvenire fenomeni di sofferenza al parquet.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Parametri Standard */}
            <Card className="bg-wood-medium border-gold/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-cream text-lg">Parametri Standard Ottimali</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-cpr-green-bg border border-cpr-green/30">
                    <div className="p-3 rounded-full bg-cpr-green/20">
                      <Thermometer className="h-8 w-8 text-cpr-green" />
                    </div>
                    <div>
                      <p className="text-cream/60 text-sm">Temperatura</p>
                      <p className="text-cream text-2xl font-bold">18-22°C</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-cpr-green-bg border border-cpr-green/30">
                    <div className="p-3 rounded-full bg-cpr-green/20">
                      <Droplets className="h-8 w-8 text-cpr-green" />
                    </div>
                    <div>
                      <p className="text-cream/60 text-sm">Umidita Relativa</p>
                      <p className="text-cream text-2xl font-bold">45-65%</p>
                      <p className="text-cream/50 text-xs mt-1">Range semaforo VERDE</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tre Sezioni Principali */}
            <div className="grid gap-6 md:grid-cols-2">
              
              {/* MOLTO CONSIGLIATO */}
              <Card className="bg-wood-medium border-cpr-green/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cpr-green/10">
                      <CheckCircle className="h-6 w-6 text-cpr-green" />
                    </div>
                    <CardTitle className="text-cpr-green text-xl">MOLTO CONSIGLIATO</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-cream/90">
                      <span className="text-cpr-green font-bold mt-0.5">•</span>
                      Mantenere temperatura e umidita nei range ottimali
                    </li>
                    <li className="flex items-start gap-3 text-cream/90">
                      <span className="text-cpr-green font-bold mt-0.5">•</span>
                      Pulire quotidianamente con panno morbido asciutto o leggermente umido
                    </li>
                    <li className="flex items-start gap-3 text-cream/90">
                      <span className="text-cpr-green font-bold mt-0.5">•</span>
                      Utilizzare tappetini agli ingressi per ridurre lo sporco
                    </li>
                    <li className="flex items-start gap-3 text-cream/90">
                      <span className="text-cpr-green font-bold mt-0.5">•</span>
                      Asciugare immediatamente qualsiasi liquido versato
                    </li>
                    <li className="flex items-start gap-3 text-cream/90">
                      <span className="text-cpr-green font-bold mt-0.5">•</span>
                      Applicare feltri protettivi sotto i mobili
                    </li>
                    <li className="flex items-start gap-3 text-cream/90">
                      <span className="text-cpr-green font-bold mt-0.5">•</span>
                      Arieggiare regolarmente gli ambienti
                    </li>
                    <li className="flex items-start gap-3 text-cream/90">
                      <span className="text-cpr-green font-bold mt-0.5">•</span>
                      Nutrire il pavimento ogni 6 mesi con prodotti specifici
                    </li>
                    <li className="flex items-start gap-3 text-cream/90">
                      <span className="text-cpr-green font-bold mt-0.5">•</span>
                      Utilizzare appositi tappeti di protezione dallo sfregamento delle ruote della sedia sotto alla scrivania e/o postazione di lavoro
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* DA EVITARE */}
              <Card className="bg-wood-medium border-cpr-red/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cpr-red/10">
                      <XCircle className="h-6 w-6 text-cpr-red" />
                    </div>
                    <CardTitle className="text-cpr-red text-xl">DA EVITARE</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-cream/90">
                      <span className="text-cpr-red font-bold mt-0.5">•</span>
                      Lavare con molta acqua o lasciare ristagni
                    </li>
                    <li className="flex items-start gap-3 text-cream/90">
                      <span className="text-cpr-red font-bold mt-0.5">•</span>
                      Usare detergenti aggressivi, candeggina o ammoniaca
                    </li>
                    <li className="flex items-start gap-3 text-cream/90">
                      <span className="text-cpr-red font-bold mt-0.5">•</span>
                      Utilizzare pulitori a vapore
                    </li>
                    <li className="flex items-start gap-3 text-cream/90">
                      <span className="text-cpr-red font-bold mt-0.5">•</span>
                      Camminare con scarpe con tacchi a spillo o suole dure
                    </li>
                    <li className="flex items-start gap-3 text-cream/90">
                      <span className="text-cpr-red font-bold mt-0.5">•</span>
                      Trascinare mobili senza protezioni
                    </li>
                    <li className="flex items-start gap-3 text-cream/90">
                      <span className="text-cpr-red font-bold mt-0.5">•</span>
                      Esporre a luce solare diretta prolungata
                    </li>
                    <li className="flex items-start gap-3 text-cream/90">
                      <span className="text-cpr-red font-bold mt-0.5">•</span>
                      Lasciare ambienti chiusi a lungo senza ventilazione
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* DESTINAZIONE D'USO */}
            <Card className="bg-wood-medium border-gold/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-cream text-xl">DESTINAZIONE D'USO</CardTitle>
                  {/* Tasto di selezione */}
                  <div className="flex rounded-lg overflow-hidden border border-gold/30">
                    <button
                      onClick={() => setDestinazioneUso("residential")}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors ${
                        destinazioneUso === "residential"
                          ? "bg-gold text-wood-dark"
                          : "bg-transparent text-cream/70 hover:text-cream"
                      }`}
                    >
                      <Home className="h-4 w-4" />
                      Residenziale
                    </button>
                    <button
                      onClick={() => setDestinazioneUso("commercial")}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors ${
                        destinazioneUso === "commercial"
                          ? "bg-gold text-wood-dark"
                          : "bg-transparent text-cream/70 hover:text-cream"
                      }`}
                    >
                      <Building2 className="h-4 w-4" />
                      Commerciale
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {destinazioneUso === "residential" ? (
                  <div className="space-y-4">
                    <Badge className="bg-gold/20 text-gold border-gold/30">
                      <Home className="h-3 w-3 mr-1" />
                      Ambiente Residenziale
                    </Badge>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-4 rounded-xl bg-wood-light/30 border border-gold/10">
                        <p className="text-gold font-semibold mb-2">Pulizia Quotidiana</p>
                        <p className="text-cream/70 text-sm">Scopa morbida o aspirapolvere con spazzola per parquet. Panno in microfibra leggermente umido.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-wood-light/30 border border-gold/10">
                        <p className="text-gold font-semibold mb-2">Pulizia Settimanale</p>
                        <p className="text-cream/70 text-sm">Detergente neutro specifico per parquet. Panno ben strizzato, mai bagnato.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-wood-light/30 border border-gold/10">
                        <p className="text-gold font-semibold mb-2">Trattamento Periodico</p>
                        <p className="text-cream/70 text-sm">Ogni 6 mesi applicare olio nutriente specifico per l'essenza del legno.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Badge className="bg-gold/20 text-gold border-gold/30">
                      <Building2 className="h-3 w-3 mr-1" />
                      Ambiente Commerciale
                    </Badge>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-4 rounded-xl bg-wood-light/30 border border-gold/10">
                        <p className="text-gold font-semibold mb-2">Pulizia Quotidiana</p>
                        <p className="text-cream/70 text-sm">Aspirare 2-3 volte al giorno nelle zone di maggior traffico. Lavaggio umido serale con detergente professionale.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-wood-light/30 border border-gold/10">
                        <p className="text-gold font-semibold mb-2">Manutenzione Settimanale</p>
                        <p className="text-cream/70 text-sm">Lavaggio completo con macchina lavasciuga. Trattamento protettivo nelle zone usura.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-wood-light/30 border border-gold/10">
                        <p className="text-gold font-semibold mb-2">Manutenzione Straordinaria</p>
                        <p className="text-cream/70 text-sm">Trimestrale: levigatura leggera zone usurate, riapplicazione trattamento protettivo.</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
