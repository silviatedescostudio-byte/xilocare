"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, BookOpen, Shield, FileText, Award, ClipboardCheck, Package, ArrowDownToLine, User, Droplets, Thermometer, RefreshCw } from "lucide-react"

/**
 * PAGINA CLIENTE - SAFE & CARE
 * Layout mobile-first con estetica premium
 * Integrazione Shelly H&T Live
 * PIN Protection gestita globalmente dal layout
 */

// Fallback State per resilienza UI
const FALLBACK_DATA = {
  humidity: 50,
  temperature: 20,
  batteryLevel: 100,
  isOnline: false,
  isSimulated: true,
  isSyncing: true
}

// Interfaccia dati sensore
interface SensorData {
  humidity: number
  temperature: number
  batteryLevel: number
  lastUpdate?: string
  isOnline: boolean
  isSimulated: boolean
  isSyncing: boolean
}

// Logica colori semaforo CPR
function getSemaphoreStatus(humidity: number, isSyncing: boolean): {
  color: "green" | "yellow" | "red" | "gray"
  label: string
  message: string
  bgClass: string
  ringClass: string
} {
  // Se in SINCRONIZZAZIONE o OFFLINE, mostra stato neutro
  if (isSyncing) {
    return {
      color: "gray",
      label: "OFFLINE / SLEEP",
      message: "Sensore offline o in modalita sleep",
      bgClass: "from-gold/60 to-gold/40",
      ringClass: "ring-gold/30"
    }
  }
  
  // VERDE: 45-65%
  if (humidity >= 45 && humidity <= 65) {
    return {
      color: "green",
      label: "PROTETTO",
      message: "Il tuo pavimento e in condizioni ottimali",
      bgClass: "from-cpr-green to-cpr-green/70",
      ringClass: "ring-cpr-green/30"
    }
  }
  // GIALLO: 40-44% o 66-70%
  if ((humidity >= 40 && humidity < 45) || (humidity > 65 && humidity <= 70)) {
    return {
      color: "yellow",
      label: "ATTENZIONE",
      message: humidity < 45 
        ? "Umidita in calo - considera un umidificatore"
        : "Umidita elevata - considera un deumidificatore",
      bgClass: "from-cpr-yellow to-cpr-yellow/70",
      ringClass: "ring-cpr-yellow/30"
    }
  }
  // ROSSO: <40% o >70%
  if (humidity < 40 || humidity > 70) {
    return {
      color: "red",
      label: "CRITICO",
      message: humidity < 40
        ? "URGENTE: Ambiente troppo secco - rischio fessurazioni"
        : "URGENTE: Ambiente troppo umido - rischio rigonfiamenti",
      bgClass: "from-cpr-red to-cpr-red/70",
      ringClass: "ring-cpr-red/30"
    }
  }
  // GRIGIO: fallback
  return {
    color: "gray",
    label: "IN ATTESA",
    message: "Connessione al sensore in corso...",
    bgClass: "from-gray-400 to-gray-600",
    ringClass: "ring-gray-500/20"
  }
}

export default function CustomerPage() {
  const [sensorData, setSensorData] = useState<SensorData>(FALLBACK_DATA)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  // Fetch dati LIVE dal sensore Shelly - REFRESH OGNI 30 SECONDI
  useEffect(() => {
    async function fetchShellyData() {
      try {
        const response = await fetch(`/api/shelly?_=${Date.now()}`, {
          cache: 'no-store'
        })
        const data = await response.json()
        
        // Se fetch fallisce, syncing true, o online false: mostra offline/sleep
        if (data.temperature === null || data.humidity === null || data.syncing || data.online === false) {
          setSensorData(prev => ({
            ...prev,
            isOnline: false,
            isSyncing: true
          }))
          setLastRefresh(new Date())
        } else {
          // Dati REALI dal sensore
          setSensorData({
            humidity: data.humidity,
            temperature: data.temperature,
            batteryLevel: 100,
            isOnline: true,
            isSimulated: false,
            isSyncing: false
          })
          setLastRefresh(new Date(data.ts || Date.now()))
        }
      } catch {
        // Errore di rete - mostra offline/sleep
        setSensorData(prev => ({
          ...prev,
          isOnline: false,
          isSyncing: true
        }))
        setLastRefresh(new Date())
      } finally {
        setLoading(false)
      }
    }

    fetchShellyData()
    // Refresh ogni 30 secondi
    const interval = setInterval(fetchShellyData, 30000)
    return () => clearInterval(interval)
  }, [])

  const semaphore = getSemaphoreStatus(sensorData.humidity, sensorData.isSyncing)

  const documents = [
    { key: "dop", label: "Dichiarazione di Prestazione", shortLabel: "DoP", icon: FileText },
    { key: "conformita", label: "Dichiarazione di Conformita", shortLabel: "Conformita", icon: ClipboardCheck },
    { key: "etichettaCE", label: "Etichetta CE", shortLabel: "CE", icon: Award },
    { key: "schedaProdotto", label: "Scheda Prodotto", shortLabel: "Scheda", icon: Package },
  ]

  return (
    <div className="min-h-screen bg-wood-dark">
      {/* HEADER con Logo e Nome Utente */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-wood-medium to-wood-dark border-b border-gold/30 px-4 py-4 backdrop-blur-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold/70 flex items-center justify-center shadow-lg shadow-gold/20">
              <Shield className="h-5 w-5 text-wood-dark" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-cream leading-tight">WoodFloor</h1>
              <p className="text-xs text-gold font-semibold">Safe & Care</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-wood-dark/50 border border-gold/20">
            <User className="h-4 w-4 text-gold/70" />
            <span className="text-xs text-cream/80 font-medium">Sig.ra Maria</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="px-4 py-6 max-w-md mx-auto space-y-5">
        
        {/* Semaforo Widget */}
        <Card className="bg-gradient-to-br from-wood-medium to-wood-dark border border-gold/20 shadow-xl overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${semaphore.bgClass} flex items-center justify-center shadow-lg ring-4 ${semaphore.ringClass}`}>
                {loading ? (
                  <RefreshCw className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <div className="text-center">
                    <span className="text-white text-2xl font-bold">{sensorData.humidity}</span>
                    <span className="text-white/80 text-xs block">%RH</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 className="text-cream font-bold text-lg mb-1">{semaphore.label}</h2>
                <p className="text-cream/60 text-sm leading-snug">
                  {semaphore.message}
                </p>
                
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1.5">
                    <Droplets className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-xs text-cream/70">{sensorData.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Thermometer className="h-3.5 w-3.5 text-orange-400" />
                    <span className="text-xs text-cream/70">{sensorData.temperature}°C</span>
                  </div>
                  {loading ? (
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                      <span className="text-[10px] text-gold font-semibold">Connessione...</span>
                    </div>
                  ) : sensorData.isSyncing ? (
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                      <span className="text-[10px] text-gold font-semibold">Offline / Sleep</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-cpr-green animate-pulse" />
                      <span className="text-[10px] text-cpr-green font-semibold">LIVE</span>
                    </div>
                  )}
                </div>
                {/* Last Updated timestamp sotto il gauge */}
                <p className="text-[10px] text-cream/40 mt-2">
                  Aggiornato: {lastRefresh.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Cards */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-cream/40 uppercase tracking-wider px-1">
            Accesso Rapido
          </h3>
          
          <Link href="/sos" className="block">
            <Card className="bg-gradient-to-r from-cpr-red/15 to-cpr-red/5 border-2 border-cpr-red/30 hover:border-cpr-red/60 hover:shadow-lg hover:shadow-cpr-red/10 transition-all cursor-pointer group active:scale-[0.98]">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-cpr-red/20 flex items-center justify-center group-hover:bg-cpr-red/30 transition-colors shrink-0">
                  <AlertTriangle className="h-7 w-7 text-cpr-red" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-cpr-red">SOS - PRONTO SOCCORSO</h2>
                  <p className="text-cream/60 text-sm">Protocolli di intervento</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-cpr-red/10 flex items-center justify-center shrink-0">
                  <svg className="h-5 w-5 text-cpr-red/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/manutenzione" className="block">
            <Card className="bg-gradient-to-r from-gold/15 to-gold/5 border-2 border-gold/30 hover:border-gold/60 hover:shadow-lg hover:shadow-gold/10 transition-all cursor-pointer group active:scale-[0.98]">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors shrink-0">
                  <BookOpen className="h-7 w-7 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gold">USO E MANUTENZIONE</h2>
                  <p className="text-cream/60 text-sm">Guida alla cura del pavimento</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <svg className="h-5 w-5 text-gold/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Documents Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-cream/40 uppercase tracking-wider px-1">
            I Miei Documenti
          </h3>
          
          <Card className="bg-wood-medium/50 border border-gold/20">
            <CardContent className="p-4 space-y-2">
              {documents.map((doc) => (
                <button
                  key={doc.key}
                  className="w-full flex items-center justify-between p-3 bg-wood-dark/40 rounded-xl border border-gold/10 hover:border-gold/30 hover:bg-wood-dark/60 transition-all min-h-[56px]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                      <doc.icon className="h-5 w-5 text-gold" strokeWidth={2} />
                    </div>
                    <div className="text-left">
                      <p className="text-cream text-sm font-medium">{doc.shortLabel}</p>
                      <p className="text-cream/50 text-xs">{doc.label}</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center shrink-0">
                    <ArrowDownToLine className="h-5 w-5 text-gold/70" strokeWidth={2} />
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="pt-4 pb-8 text-center space-y-1">
          <p className="text-xs text-cream/30">
            Ultimo aggiornamento: {lastRefresh.toLocaleTimeString('it-IT')}
          </p>
          <p className="text-xs text-cream/20">
            WoodFloor Safe & Care - Sistema di monitoraggio pavimenti
          </p>
        </div>

      </main>
    </div>
  )
}
