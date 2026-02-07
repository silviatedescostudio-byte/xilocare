"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"

// Dealer Components
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ClimateChart } from "@/components/dashboard/climate-chart"
import { ProjectsTable } from "@/components/dashboard/projects-table"
import { RegisterButton } from "@/components/dashboard/register-button"
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"

// Customer Components
import { CustomerSidebar } from "@/components/customer/customer-sidebar"
import { CustomerHeader } from "@/components/customer/customer-header"
import { CustomerMobileSidebar } from "@/components/customer/customer-mobile-sidebar"
import { CPRSemaphore } from "@/components/customer/cpr-semaphore"
import { DocumentVault } from "@/components/customer/document-vault"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, TrendingUp, Clock, Calendar, Eye, X, AlertTriangle, BookOpen, FileText } from "lucide-react"
import Link from "next/link"

// Default Shelly Device ID for customers without specific device
const DEFAULT_SHELLY_DEVICE = "e4b3232f9708"

export default function DashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showCustomerSimulation, setShowCustomerSimulation] = useState(false)
  const { user, isCustomer, isDealer } = useAuth()

  // Customer Dashboard
  if (isCustomer) {
    const shellyDeviceId = user?.shellyDeviceId || DEFAULT_SHELLY_DEVICE
    
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-wood-dark">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <CustomerSidebar />
          </div>

          {/* Mobile Sidebar */}
          <CustomerMobileSidebar open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

          {/* Main Content */}
          <div className="lg:ml-64">
            <CustomerHeader onMenuClick={() => setMobileMenuOpen(true)} />

            <main className="p-4 md:p-6 lg:p-8 space-y-6">
              {/* Welcome Header */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-cream tracking-tight">
                    Salute del Tuo Pavimento
                  </h2>
                  <p className="text-sm text-cream/60 font-medium mt-1">
                    Monitoraggio in tempo reale delle condizioni ambientali
                  </p>
                </div>
                <Badge className="bg-cpr-green/20 text-cpr-green border-cpr-green/30">
                  <Activity className="h-3 w-3 mr-1" />
                  Sensore Attivo
                </Badge>
              </div>

              {/* CPR Semaphore - Main Focus */}
              <CPRSemaphore 
                shellyDeviceId={shellyDeviceId} 
                customerName={user?.displayName || "Casa"} 
              />

              {/* TASTI GIGANTI SOS E MANUTENZIONE - Sotto Valori Ambientali */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tasto SOS - PRONTO SOCCORSO */}
                <Link href="/sos-protocols" className="block">
                  <Card className="bg-cpr-red-bg border-cpr-red/40 border-2 hover:border-cpr-red transition-all cursor-pointer group h-full">
                    <CardContent className="p-6 flex items-center gap-5">
                      <div className="p-4 rounded-xl bg-cpr-red/20 group-hover:bg-cpr-red/30 transition-colors">
                        <AlertTriangle className="h-10 w-10 text-cpr-red" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold text-cpr-red">SOS - PRONTO SOCCORSO</h3>
                        <p className="text-cream/70 mt-1">Protocolli di intervento per emergenze</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Tasto USO E MANUTENZIONE */}
                <Link href="/manutenzione" className="block">
                  <Card className="bg-gold/10 border-gold/40 border-2 hover:border-gold transition-all cursor-pointer group h-full">
                    <CardContent className="p-6 flex items-center gap-5">
                      <div className="p-4 rounded-xl bg-gold/20 group-hover:bg-gold/30 transition-colors">
                        <BookOpen className="h-10 w-10 text-gold" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold text-gold">USO E MANUTENZIONE</h3>
                        <p className="text-cream/70 mt-1">Guida completa alla cura del pavimento</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-wood-medium border-gold/20">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gold/10">
                      <TrendingUp className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-cream/60">Trend Settimanale</p>
                      <p className="text-lg font-bold text-cream">Stabile</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-wood-medium border-gold/20">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gold/10">
                      <Clock className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-cream/60">Ultimo Controllo</p>
                      <p className="text-lg font-bold text-cream">Ora</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-wood-medium border-gold/20">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gold/10">
                      <Calendar className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-cream/60">Prossima Manutenzione</p>
                      <p className="text-lg font-bold text-cream">30 Giorni</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Info Card */}
              <Card className="bg-wood-medium border-gold/20">
                <CardHeader>
                  <CardTitle className="text-cream">Come Funziona il Sistema</CardTitle>
                  <CardDescription className="text-cream/60">
                    Il sensore Shelly monitora costantemente temperatura e umidita del tuo ambiente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="p-4 rounded-lg bg-cpr-green-bg border border-cpr-green/20">
                      <div className="w-4 h-4 rounded-full bg-cpr-green mb-2" />
                      <p className="font-semibold text-cream">Verde - Protetto</p>
                      <p className="text-cream/60 mt-1">UR 45-65%. Condizioni ottimali.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-cpr-yellow-bg border border-cpr-yellow/20">
                      <div className="w-4 h-4 rounded-full bg-cpr-yellow mb-2" />
                      <p className="font-semibold text-cream">Giallo - Attenzione</p>
                      <p className="text-cream/60 mt-1">UR 40-44% o 66-70%. Segui i consigli di prevenzione.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-cpr-red-bg border border-cpr-red/20">
                      <div className="w-4 h-4 rounded-full bg-cpr-red mb-2" />
                      <p className="font-semibold text-cream">Rosso - Critico</p>
                      <p className="text-cream/60 mt-1">{"UR <40% o >70%. Azione immediata richiesta."}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SEZIONE DOCUMENTI */}
              <Card className="bg-wood-medium border-gold/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gold/10">
                      <FileText className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <CardTitle className="text-cream">I Tuoi Documenti</CardTitle>
                      <CardDescription className="text-cream/60">
                        Documenti caricati dal rivenditore per la tua fornitura
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <DocumentVault 
                    documents={{
                      etichettaCE: "/documents/ce-label.pdf",
                      conformita: "/documents/conformita.pdf",
                      dop: "/documents/dop.pdf",
                      schedaProdotto: "/documents/scheda.pdf"
                    }}
                  />
                </CardContent>
              </Card>
            </main>

            {/* Footer */}
            <footer className="px-6 py-6 text-center border-t border-gold/10">
              <p className="text-xs text-cream/40 font-medium tracking-wide">
                WoodFloor Safe & Care - Sistema di Protezione Pavimenti
              </p>
            </footer>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  // Dealer Dashboard (default)
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-wood-dark">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

        {/* Main Content */}
        <div className="lg:ml-64">
          <Header onMenuClick={() => setMobileMenuOpen(true)} />

          <main className="p-5 md:p-6 lg:p-8 space-y-6">
            {/* Header Row: Title + Action */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-cream tracking-tight">Centro di Controllo</h2>
                <p className="text-sm text-cream/60 font-medium mt-1">Monitoraggio installazioni in tempo reale</p>
              </div>
              <div className="flex items-center gap-3">
                {/* TASTO SIMULA VISTA CLIENTE */}
                <Button
                  onClick={() => setShowCustomerSimulation(true)}
                  variant="outline"
                  className="bg-transparent border-gold/30 text-gold hover:bg-gold/10"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Simula Vista Cliente
                </Button>
                {/* Indicatore Shelly */}
                <div className="flex items-center gap-2 px-3 py-2 bg-wood-medium rounded-lg border border-gold/20">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-cpr-green" />
                    <span className="text-xs font-medium text-cream/70 hidden sm:inline">Shelly H&T:</span>
                  </div>
                  <Badge variant="outline" className="bg-cpr-green/20 text-cpr-green border-cpr-green/30 text-xs">
                    Sincronizzato
                  </Badge>
                </div>
                <RegisterButton />
              </div>
            </div>

            {/* MODAL SIMULA VISTA CLIENTE */}
            {showCustomerSimulation && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                <div className="bg-wood-dark border border-gold/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                  {/* Header Modal */}
                  <div className="flex items-center justify-between p-4 border-b border-gold/20 bg-wood-medium">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gold/10">
                        <Eye className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <h2 className="text-cream font-bold text-lg">Simulazione Vista Cliente</h2>
                        <p className="text-cream/60 text-sm">Questa e la vista che vedra la Sig.ra Maria</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowCustomerSimulation(false)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <X className="h-5 w-5 text-cream/70" />
                    </button>
                  </div>
                  
                  {/* Contenuto - CPR Semaphore Preview */}
                  <div className="flex-1 overflow-y-auto p-6 bg-wood-dark">
                    <CPRSemaphore 
                      shellyDeviceId={DEFAULT_SHELLY_DEVICE} 
                      customerName="Sig.ra Maria (Simulazione)" 
                    />
                  </div>

                  {/* Footer Modal */}
                  <div className="flex justify-between items-center gap-3 p-4 border-t border-gold/20 bg-wood-medium">
                    <p className="text-xs text-cream/50">
                      I dati mostrati sono sincronizzati con il sensore Shelly ID: {DEFAULT_SHELLY_DEVICE}
                    </p>
                    <Button 
                      onClick={() => setShowCustomerSimulation(false)}
                      className="bg-gold hover:bg-gold/90 text-wood-dark font-semibold"
                    >
                      Chiudi Simulazione
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Cards - Alerts dominant */}
            <StatsCards />

            {/* Charts and Table Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              <ClimateChart />
              <ProjectsTable />
            </div>
          </main>

          {/* Footer */}
          <footer className="px-6 py-6 text-center border-t border-gold/10">
            <p className="text-xs text-cream/40 font-semibold tracking-wide">
              Sistema di monitoraggio WoodFloor Safe & Care - Area Rivenditore
            </p>
          </footer>
        </div>
      </div>
    </ProtectedRoute>
  )
}
