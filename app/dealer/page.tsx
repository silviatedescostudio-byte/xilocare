"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  SemaphoreDot, 
  calculateSemaphoreStatus, 
  type ShellyData,
  type SemaphoreStatus 
} from "@/components/dashboard/climate-semaphore"
import { 
  Users, 
  FileWarning, 
  Eye, 
  MapPin, 
  Calendar,
  AlertTriangle,
  FileText,
  CheckCircle,
  XCircle
} from "lucide-react"
import Link from "next/link"

// Dati simulati dei clienti
interface Cliente {
  id: string
  nome: string
  indirizzo: string
  dataInstallazione: string
  shellyData: ShellyData
  // NUOVA STRUTTURA DOCUMENTI secondo specifiche
  documenti: {
    etichettaCE: boolean      // Obbligatorio
    conformita: boolean        // Obbligatorio (Dichiarazione di Conformita)
    dop: boolean               // Obbligatorio (DoP)
    schedaProdotto: boolean    // Obbligatorio
    rapportoPosa?: boolean     // FACOLTATIVO - NON influisce sul semaforo
  }
}

// LOGICA SEMAFORO DOCUMENTI:
// VERDE: CE, Conformita, DoP e Scheda Prodotto tutti caricati
// GIALLO: Solo alcuni dei 4 obbligatori caricati
// ROSSO: Nessun documento obbligatorio caricato
// NOTA: Il "Rapporto di Posa" e facoltativo e NON influisce sul colore del semaforo
type DocumentSemaphore = "green" | "yellow" | "red"

function calculateDocumentSemaphore(docs: Cliente["documenti"]): DocumentSemaphore {
  const obbligatori = [docs.etichettaCE, docs.conformita, docs.dop, docs.schedaProdotto]
  const caricati = obbligatori.filter(Boolean).length
  
  if (caricati === 4) return "green"
  if (caricati === 0) return "red"
  return "yellow"
}

const clientiSimulati: Cliente[] = [
  {
    id: "bianchi",
    nome: "Residenza Bianchi",
    indirizzo: "Via Roma 123, Milano",
    dataInstallazione: "2024-01-15",
    shellyData: { temperature: 21, humidity: 52, batteryLevel: 85, lastUpdate: new Date().toISOString(), isOnline: true },
    // VERDE: tutti i 4 obbligatori caricati
    documenti: { etichettaCE: true, conformita: true, dop: true, schedaProdotto: true, rapportoPosa: true }
  },
  {
    id: "1",
    nome: "Mario Rossi",
    indirizzo: "Via Verdi 45, Torino",
    dataInstallazione: "2024-03-15",
    shellyData: { temperature: 22, humidity: 55, batteryLevel: 90, lastUpdate: new Date().toISOString(), isOnline: true },
    // VERDE: tutti i 4 obbligatori caricati
    documenti: { etichettaCE: true, conformita: true, dop: true, schedaProdotto: true }
  },
  {
    id: "2",
    nome: "Laura Neri",
    indirizzo: "Corso Italia 45, Roma",
    dataInstallazione: "2024-06-20",
    shellyData: { temperature: 28, humidity: 72, batteryLevel: 65, lastUpdate: new Date().toISOString(), isOnline: true },
    // GIALLO: solo 3 obbligatori caricati
    documenti: { etichettaCE: true, conformita: true, dop: true, schedaProdotto: false }
  },
  {
    id: "3",
    nome: "Giuseppe Verdi",
    indirizzo: "Piazza Duomo 8, Firenze",
    dataInstallazione: "2024-01-10",
    shellyData: { temperature: 12, humidity: 38, batteryLevel: 45, lastUpdate: new Date().toISOString(), isOnline: true },
    // ROSSO: nessun documento obbligatorio
    documenti: { etichettaCE: false, conformita: false, dop: false, schedaProdotto: false }
  },
  {
    id: "4",
    nome: "Anna Marino",
    indirizzo: "Via Garibaldi 67, Torino",
    dataInstallazione: "2024-09-05",
    shellyData: { temperature: 21, humidity: 50, batteryLevel: 88, lastUpdate: new Date().toISOString(), isOnline: true },
    // VERDE: tutti i 4 obbligatori + facoltativo
    documenti: { etichettaCE: true, conformita: true, dop: true, schedaProdotto: true, rapportoPosa: true }
  },
  {
    id: "5",
    nome: "Francesco Costa",
    indirizzo: "Via Mazzini 12, Bologna",
    dataInstallazione: "2024-04-22",
    shellyData: { temperature: 26, humidity: 68, batteryLevel: 72, lastUpdate: new Date().toISOString(), isOnline: true },
    // GIALLO: solo 2 obbligatori caricati
    documenti: { etichettaCE: true, conformita: false, dop: true, schedaProdotto: false, rapportoPosa: true }
  },
]

// Restituisce solo i documenti OBBLIGATORI mancanti
function getDocumentiMancanti(cliente: Cliente): string[] {
  const mancanti: string[] = []
  if (!cliente.documenti.etichettaCE) mancanti.push("Etichetta CE")
  if (!cliente.documenti.conformita) mancanti.push("Dich. Conformita")
  if (!cliente.documenti.dop) mancanti.push("DoP")
  if (!cliente.documenti.schedaProdotto) mancanti.push("Scheda Prodotto")
  // NOTA: rapportoPosa e FACOLTATIVO e NON viene incluso nei mancanti
  return mancanti
}

function countByStatus(clienti: Cliente[]): Record<SemaphoreStatus, number> {
  return clienti.reduce((acc, cliente) => {
    const status = calculateSemaphoreStatus(cliente.shellyData)
    acc[status]++
    return acc
  }, { green: 0, yellow: 0, red: 0 } as Record<SemaphoreStatus, number>)
}

export default function DealerDashboardPage() {
  // Filtra clienti con almeno un documento OBBLIGATORIO mancante
  const clientiConDocMancanti = clientiSimulati.filter(c => 
    !c.documenti.etichettaCE || !c.documenti.conformita || !c.documenti.dop || !c.documenti.schedaProdotto
  )
  const statusCount = countByStatus(clientiSimulati)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-warm-light">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <MobileSidebar />

        <div className="lg:pl-64">
          <Header />

          <main className="p-4 md:p-6 lg:p-8">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-charcoal">Dashboard Rivenditore</h1>
              <p className="text-charcoal-medium mt-1">Panoramica completa dei tuoi clienti e delle installazioni</p>
            </div>

            <div className="space-y-6">
              {/* Alert Documenti Mancanti */}
              {clientiConDocMancanti.length > 0 && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <FileWarning className="h-5 w-5" />
                  <AlertTitle className="font-bold">Documenti Obbligatori Mancanti</AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">
                      {clientiConDocMancanti.length} cantier{clientiConDocMancanti.length === 1 ? "e ha" : "i hanno"} documenti CPR o schede tecniche mancanti.
                    </p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {clientiConDocMancanti.map(cliente => (
                        <li key={cliente.id}>
                          <strong>{cliente.nome}</strong>: mancano {getDocumentiMancanti(cliente).join(", ")}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Stats Rapide */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-charcoal-medium">Clienti Totali</p>
                        <p className="text-3xl font-bold text-charcoal">{clientiSimulati.length}</p>
                      </div>
                      <div className="p-3 bg-charcoal/5 rounded-full">
                        <Users className="h-6 w-6 text-charcoal" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-green-200 bg-green-50/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-700">Clima Ottimale</p>
                        <p className="text-3xl font-bold text-green-700">{statusCount.green}</p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-amber-200 bg-amber-50/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-amber-700">In Allerta</p>
                        <p className="text-3xl font-bold text-amber-700">{statusCount.yellow}</p>
                      </div>
                      <div className="p-3 bg-amber-100 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-red-700">Pericolo</p>
                        <p className="text-3xl font-bold text-red-700">{statusCount.red}</p>
                      </div>
                      <div className="p-3 bg-red-100 rounded-full">
                        <XCircle className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Lista Clienti */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-champagne/10 rounded-lg">
                      <Users className="h-6 w-6 text-champagne" />
                    </div>
                    <div>
                      <CardTitle>I Tuoi Clienti</CardTitle>
                      <CardDescription>Stato climatico in tempo reale e documenti per ogni installazione</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {clientiSimulati.map((cliente) => {
                      const status = calculateSemaphoreStatus(cliente.shellyData)
                      const docMancanti = getDocumentiMancanti(cliente)
                      const docSemaphore = calculateDocumentSemaphore(cliente.documenti)
                      
                      return (
                        <div 
                          key={cliente.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-charcoal/8 hover:border-champagne/30 hover:bg-champagne/5 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            {/* Semaforo */}
                            <SemaphoreDot status={status} size="lg" />
                            
                            {/* Info Cliente */}
                            <div>
                              <h3 className="font-semibold text-charcoal">{cliente.nome}</h3>
                              <div className="flex items-center gap-2 text-sm text-charcoal-light">
                                <MapPin className="h-3 w-3" />
                                {cliente.indirizzo}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-charcoal-light mt-1">
                                <Calendar className="h-3 w-3" />
                                Installato: {new Date(cliente.dataInstallazione).toLocaleDateString("it-IT")}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* Semaforo Documenti */}
                            <div className="flex items-center gap-2">
                              <div 
                                className={`w-3 h-3 rounded-full ${
                                  docSemaphore === "green" ? "bg-emerald-500" :
                                  docSemaphore === "yellow" ? "bg-amber-500" :
                                  "bg-red-500"
                                }`}
                                title={
                                  docSemaphore === "green" ? "Tutti i documenti obbligatori caricati" :
                                  docSemaphore === "yellow" ? `Mancano: ${docMancanti.join(", ")}` :
                                  "Nessun documento caricato"
                                }
                              />
                              {docSemaphore === "green" ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                                  <FileText className="h-3 w-3" />
                                  Completo
                                </Badge>
                              ) : docSemaphore === "yellow" ? (
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
                                  <FileWarning className="h-3 w-3" />
                                  {4 - docMancanti.length}/4 doc
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
                                  <FileWarning className="h-3 w-3" />
                                  Nessun doc
                                </Badge>
                              )}
                            </div>

                            {/* Dati Clima */}
                            <div className="text-right text-xs text-charcoal-medium hidden sm:block">
                              <div>{cliente.shellyData.temperature}°C</div>
                              <div>{cliente.shellyData.humidity}% UR</div>
                            </div>

                            {/* Azione */}
                            <Link href={`/customer/${cliente.id}`}>
                              <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                                <Eye className="h-4 w-4" />
                                Dettagli
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
