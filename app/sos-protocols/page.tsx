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
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Leaf,
  PenTool,
  Dog,
  Droplet,
  Sparkles,
  Move,
  GitBranch,
  Expand,
  Sun,
  CircleDot,
  X,
  FileText,
  Phone
} from "lucide-react"

// Lista tassativa dei 10 protocolli SOS
const protocolliSOS = [
  { 
    id: "macchie-organiche", 
    nome: "Macchie organiche", 
    icona: Leaf,
    contenuto: "Protocollo per la rimozione di macchie organiche dal pavimento in legno."
  },
  { 
    id: "inchiostro-pennarelli", 
    nome: "Inchiostro e pennarelli", 
    icona: PenTool,
    contenuto: "Protocollo per la rimozione di macchie di inchiostro e pennarelli."
  },
  { 
    id: "urina-vomito-escrementi", 
    nome: "Urina, vomito ed escrementi", 
    icona: Dog,
    contenuto: "Protocollo per la pulizia e sanificazione di urina, vomito ed escrementi."
  },
  { 
    id: "grasso-oli", 
    nome: "Grasso e oli", 
    icona: Droplet,
    contenuto: "Protocollo per la rimozione di macchie di grasso e oli."
  },
  { 
    id: "cosmetici-trucchi", 
    nome: "Cosmetici e trucchi", 
    icona: Sparkles,
    contenuto: "Protocollo per la rimozione di macchie di cosmetici e trucchi."
  },
  { 
    id: "graffi-trascinamento", 
    nome: "Graffi e segni di trascinamento", 
    icona: Move,
    contenuto: "Protocollo per il trattamento di graffi e segni di trascinamento."
  },
  { 
    id: "fessurazioni-ritiri", 
    nome: "Fessurazioni e ritiri strutturali", 
    icona: GitBranch,
    contenuto: "Protocollo per la gestione di fessurazioni e ritiri strutturali del legno."
  },
  { 
    id: "rigonfiamenti-imbarcamenti", 
    nome: "Rigonfiamenti ed imbarcamenti", 
    icona: Expand,
    contenuto: "Protocollo per la gestione di rigonfiamenti e imbarcamenti del pavimento."
  },
  { 
    id: "luce-sole-colore", 
    nome: "Luce del sole e colore", 
    icona: Sun,
    contenuto: "Protocollo per la prevenzione e gestione dello scolorimento da luce solare."
  },
  { 
    id: "macchie-acqua-aloni", 
    nome: "Macchie d'acqua e aloni neri", 
    icona: CircleDot,
    contenuto: "Protocollo per la rimozione di macchie d'acqua e aloni neri."
  },
]

export default function SOSProtocolsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedProtocol, setSelectedProtocol] = useState<typeof protocolliSOS[0] | null>(null)
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
            {/* Titolo Sezione */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-cream">SOS - PRONTO SOCCORSO</h1>
              </div>
              <Button className="bg-cpr-red hover:bg-cpr-red/80 text-white font-bold">
                <Phone className="h-4 w-4 mr-2" />
                Chiama Tecnico
              </Button>
            </div>

            {/* Griglia 10 Pulsanti Protocolli */}
            <Card className="bg-wood-medium border-gold/20">
              <CardContent className="p-6">
                <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
                  {protocolliSOS.map((protocollo) => {
                    const IconComponent = protocollo.icona
                    return (
                      <button
                        key={protocollo.id}
                        onClick={() => setSelectedProtocol(protocollo)}
                        className="flex flex-col items-center justify-center p-4 rounded-xl border border-gold/20 bg-wood-light/30 hover:bg-gold/10 hover:border-gold/40 transition-all text-center group"
                      >
                        <div className="p-3 rounded-full bg-gold/10 group-hover:bg-gold/20 transition-colors mb-3">
                          <IconComponent className="h-6 w-6 text-gold" />
                        </div>
                        <span className="text-cream text-sm font-medium leading-tight">
                          {protocollo.nome}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Modal Visualizzatore Documento (NO Download) */}
            {selectedProtocol && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                <div className="bg-wood-dark border border-gold/30 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                  {/* Header Modal */}
                  <div className="flex items-center justify-between p-4 border-b border-gold/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gold/10">
                        <FileText className="h-5 w-5 text-gold" />
                      </div>
                      <h2 className="text-cream font-bold text-lg">{selectedProtocol.nome}</h2>
                    </div>
                    <button
                      onClick={() => setSelectedProtocol(null)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <X className="h-5 w-5 text-cream/70" />
                    </button>
                  </div>
                  
                  {/* Contenuto Documento (Sola Visualizzazione) */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="prose prose-invert max-w-none">
                      <div className="p-6 rounded-xl bg-wood-medium border border-gold/10">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="p-4 rounded-full bg-gold/10">
                            <selectedProtocol.icona className="h-10 w-10 text-gold" />
                          </div>
                          <div>
                            <h3 className="text-cream text-xl font-bold">{selectedProtocol.nome}</h3>
                            <p className="text-cream/60 text-sm">Protocollo di intervento</p>
                          </div>
                        </div>
                        <div className="text-cream/80 leading-relaxed">
                          <p className="mb-4">{selectedProtocol.contenuto}</p>
                          <p className="text-cream/50 text-sm italic">
                            Contenuto completo del protocollo in fase di caricamento.
                            Per assistenza immediata contattare il rivenditore autorizzato.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Modal - Solo Chiudi, NO Download */}
                  <div className="flex justify-end gap-3 p-4 border-t border-gold/20">
                    <Button 
                      onClick={() => setSelectedProtocol(null)}
                      className="bg-gold hover:bg-gold/90 text-wood-dark font-semibold"
                    >
                      Chiudi
                    </Button>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
