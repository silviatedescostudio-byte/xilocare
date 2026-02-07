"use client"

/**
 * ===============================================
 * PAGINA DOCUMENTI CPR / ARCHIVIO CLIENTE
 * ===============================================
 * 
 * Struttura documenti aggiornata secondo specifiche:
 * 
 * OBBLIGATORI (influiscono sul semaforo):
 * - Etichetta CE
 * - Dichiarazione di Conformita
 * - DoP (Dichiarazione di Prestazione)
 * - Scheda Prodotto
 * 
 * FACOLTATIVI (NON influiscono sul semaforo):
 * - Rapporto di Posa
 * 
 * Per il CLIENTE: mostra solo i documenti caricati
 * dal SUO rivenditore per la SUA fornitura.
 * 
 * ===============================================
 */

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
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Download, 
  Shield, 
  Award, 
  ScrollText, 
  FileCheck, 
  ExternalLink,
  CheckCircle,
  Scale,
  ClipboardCheck,
  Package,
  BookOpen,
  Info
} from "lucide-react"

/**
 * ===============================================
 * STRUTTURA DOCUMENTI SECONDO SPECIFICHE
 * ===============================================
 * 
 * LOGICA SEMAFORO:
 * - VERDE: CE + Conformita + DoP + Scheda tutti caricati
 * - GIALLO: Solo alcuni dei 4 obbligatori caricati
 * - ROSSO: Nessun documento obbligatorio caricato
 * - NOTA: Rapporto di Posa e FACOLTATIVO e NON influisce
 * 
 * ===============================================
 */

// Documenti OBBLIGATORI (influiscono sul semaforo)
const documentiObbligatori = [
  {
    id: "etichetta-ce",
    title: "Etichetta CE",
    description: "Marcatura di conformita alle normative europee per i prodotti da costruzione",
    icon: Award,
    type: "Certificazione",
    required: true,
    semaphoreImpact: true
  },
  {
    id: "conformita",
    title: "Dichiarazione di Conformita",
    description: "Attestazione del produttore che il prodotto rispetta le normative applicabili",
    icon: ClipboardCheck,
    type: "Documento Legale",
    required: true,
    semaphoreImpact: true
  },
  {
    id: "dop",
    title: "Dichiarazione di Prestazione (DoP)",
    description: "Documento obbligatorio che certifica le caratteristiche del prodotto secondo il Regolamento CPR",
    icon: ScrollText,
    type: "Documento Legale",
    required: true,
    semaphoreImpact: true
  },
  {
    id: "scheda-prodotto",
    title: "Scheda Prodotto",
    description: "Specifiche tecniche complete del pavimento installato con caratteristiche e prestazioni",
    icon: Package,
    type: "Documentazione Tecnica",
    required: true,
    semaphoreImpact: true
  }
]

// Documenti FACOLTATIVI (NON influiscono sul semaforo)
const documentiFacoltativi = [
  {
    id: "rapporto-posa",
    title: "Rapporto di Posa",
    description: "Report completo della posa in opera con data, condizioni ambientali e foto del cantiere",
    icon: BookOpen,
    type: "Verbale",
    required: false,
    semaphoreImpact: false // NON influisce sul semaforo
  }
]

// Tutti i documenti per retrocompatibilita
const documents = [...documentiObbligatori, ...documentiFacoltativi]

export default function CPRDocumentsPage() {
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
              <h1 className="text-2xl md:text-3xl font-bold text-cream">
                {isCustomer ? "I Tuoi Documenti" : "Documenti CPR"}
              </h1>
              <p className="text-cream/60 mt-1">
                {isCustomer 
                  ? "Documenti della tua fornitura caricati dal rivenditore" 
                  : "Archivio tecnico e dichiarazioni di conformita - Valore legale"}
              </p>
            </div>

            {/* Info Banner */}
            <Card className="bg-gold/10 border-gold/30">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="p-2 rounded-lg bg-gold/20">
                  <Scale className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-bold text-cream">Valore Legale dei Documenti</h3>
                  <p className="text-sm text-cream/70 mt-1">
                    I documenti CPR hanno valore legale e sono obbligatori per tutti i prodotti da costruzione commercializzati 
                    nell'UE. Conservali per tutta la durata di vita del pavimento e in caso di controversie.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Semaforo Documenti Info (solo per dealer) */}
            {!isCustomer && (
              <Card className="bg-wood-medium border-gold/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Info className="h-5 w-5 text-gold" />
                    <h3 className="font-bold text-cream">Logica Semaforo Documenti</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-cream/70">VERDE: 4/4 obbligatori caricati</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="text-cream/70">GIALLO: 1-3/4 obbligatori caricati</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-cream/70">ROSSO: Nessun documento caricato</span>
                    </div>
                  </div>
                  <p className="text-xs text-cream/50 mt-2">
                    Nota: Il "Rapporto di Posa" e facoltativo e NON influisce sul colore del semaforo.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Documenti OBBLIGATORI */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <h2 className="text-lg font-bold text-cream">Documenti Obbligatori</h2>
                <Badge variant="outline" className="bg-cpr-green/10 text-cpr-green border-cpr-green/30 text-xs">
                  Influiscono sul semaforo
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {documentiObbligatori.map((doc) => {
                  const IconComponent = doc.icon
                  return (
                    <Card key={doc.id} className="bg-wood-medium border-gold/20 hover:border-gold/40 transition-all">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="p-3 rounded-xl bg-gold/10">
                            <IconComponent className="h-6 w-6 text-gold" />
                          </div>
                          <Badge className="bg-cpr-green/20 text-cpr-green border-cpr-green/30 text-[10px]">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Obbligatorio
                          </Badge>
                        </div>
                        <CardTitle className="text-cream text-base mt-3">{doc.title}</CardTitle>
                        <CardDescription className="text-cream/60 text-xs">{doc.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-cream/50 uppercase tracking-wide">{doc.type}</span>
                          <Button 
                            size="sm" 
                            className="bg-gold hover:bg-gold-light text-wood-dark text-xs"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            PDF
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Documenti FACOLTATIVI */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-cream/50" />
                <h2 className="text-lg font-bold text-cream">Documenti Facoltativi</h2>
                <Badge variant="outline" className="bg-charcoal/20 text-cream/60 border-charcoal/30 text-xs">
                  Non influiscono sul semaforo
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {documentiFacoltativi.map((doc) => {
                  const IconComponent = doc.icon
                  return (
                    <Card key={doc.id} className="bg-wood-medium border-charcoal/20 hover:border-charcoal/40 transition-all">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="p-3 rounded-xl bg-charcoal/10">
                            <IconComponent className="h-6 w-6 text-cream/60" />
                          </div>
                          <Badge variant="outline" className="bg-charcoal/10 text-cream/50 border-charcoal/20 text-[10px]">
                            Facoltativo
                          </Badge>
                        </div>
                        <CardTitle className="text-cream text-base mt-3">{doc.title}</CardTitle>
                        <CardDescription className="text-cream/60 text-xs">{doc.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-cream/50 uppercase tracking-wide">{doc.type}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-transparent border-charcoal/30 text-cream/60 hover:bg-charcoal/10 text-xs"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            PDF
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* CPR Info Card */}
            <Card className="bg-wood-medium border-gold/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gold/10">
                    <Shield className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <CardTitle className="text-cream">Regolamento CPR (UE) 305/2011</CardTitle>
                    <CardDescription className="text-cream/60">
                      Construction Products Regulation - Cosa devi sapere
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-wood-light/50 border border-gold/10">
                    <h4 className="font-semibold text-cream mb-2">Cos'e il CPR?</h4>
                    <p className="text-sm text-cream/60">
                      Il Regolamento Prodotti da Costruzione stabilisce condizioni armonizzate per la commercializzazione 
                      dei prodotti da costruzione nell'UE.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-wood-light/50 border border-gold/10">
                    <h4 className="font-semibold text-cream mb-2">Perche e importante?</h4>
                    <p className="text-sm text-cream/60">
                      Garantisce che i prodotti rispettino standard di sicurezza, prestazione energetica e 
                      sostenibilita ambientale verificati.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-wood-light/50 border border-gold/10">
                    <h4 className="font-semibold text-cream mb-2">Cosa devo conservare?</h4>
                    <p className="text-sm text-cream/60">
                      DoP, marcatura CE e certificato di garanzia sono documenti essenziali. Conservali in caso 
                      di ispezioni o controversie.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
