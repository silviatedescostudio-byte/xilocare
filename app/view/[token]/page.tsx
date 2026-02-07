"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import useSWR from "swr"
import { cn } from "@/lib/utils"
import { 
  ShieldCheck, 
  Thermometer, 
  Droplets, 
  Check, 
  AlertTriangle, 
  X,
  RefreshCw,
  Wifi,
  WifiOff
} from "lucide-react"

interface ShareData {
  customerId: string
  customerName: string
  shellyDeviceId: string
  expiresAt: string
}

interface ShellyData {
  temperature: number
  humidity: number
  batteryLevel: number
  lastUpdate: string
  isOnline: boolean
  isSimulated?: boolean
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

// Thresholds for floor health
const THRESHOLDS = {
  temperature: { min: 15, max: 25, warningMin: 13, warningMax: 28 },
  humidity: { min: 45, max: 65, warningMin: 40, warningMax: 70 }
}

type Status = "optimal" | "warning" | "critical"

function calculateStatus(data: ShellyData): Status {
  const { temperature, humidity } = data
  
  if (
    temperature < THRESHOLDS.temperature.warningMin ||
    temperature > THRESHOLDS.temperature.warningMax ||
    humidity < THRESHOLDS.humidity.warningMin ||
    humidity > THRESHOLDS.humidity.warningMax
  ) {
    return "critical"
  }
  
  if (
    temperature < THRESHOLDS.temperature.min ||
    temperature > THRESHOLDS.temperature.max ||
    humidity < THRESHOLDS.humidity.min ||
    humidity > THRESHOLDS.humidity.max
  ) {
    return "warning"
  }
  
  return "optimal"
}

const statusConfig = {
  optimal: {
    title: "Il tuo pavimento e protetto",
    subtitle: "Le condizioni ambientali sono ottimali",
    bgColor: "bg-emerald-500",
    borderColor: "border-emerald-600",
    glowColor: "shadow-[0_0_60px_rgba(16,185,129,0.5)]",
    label: "SICURO",
    labelBg: "bg-emerald-100",
    labelText: "text-emerald-800",
    Icon: Check,
  },
  warning: {
    title: "Ambiente da monitorare",
    subtitle: "Alcuni parametri richiedono attenzione",
    bgColor: "bg-amber-500",
    borderColor: "border-amber-600",
    glowColor: "shadow-[0_0_60px_rgba(245,158,11,0.5)]",
    label: "ATTENZIONE",
    labelBg: "bg-amber-100",
    labelText: "text-amber-800",
    Icon: AlertTriangle,
  },
  critical: {
    title: "Intervento necessario",
    subtitle: "Contatta il tuo rivenditore",
    bgColor: "bg-red-600",
    borderColor: "border-red-700",
    glowColor: "shadow-[0_0_60px_rgba(220,38,38,0.5)]",
    label: "ALLARME",
    labelBg: "bg-red-100",
    labelText: "text-red-800",
    Icon: X,
  },
}

export default function CustomerViewPage() {
  const params = useParams()
  const token = params.token as string
  const [shareData, setShareData] = useState<ShareData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingShare, setIsLoadingShare] = useState(true)

  // Fetch share data
  useEffect(() => {
    async function fetchShareData() {
      try {
        const res = await fetch(`/api/share?token=${token}`)
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Link non valido")
        }
        const data = await res.json()
        setShareData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Link non valido o scaduto")
      } finally {
        setIsLoadingShare(false)
      }
    }
    fetchShareData()
  }, [token])

  // Fetch Shelly data with auto-refresh
  const { data: shellyData, isLoading: isLoadingShelly, mutate } = useSWR<ShellyData>(
    shareData ? `/api/shelly/${shareData.shellyDeviceId}` : null,
    fetcher,
    { refreshInterval: 60000 } // Refresh every minute
  )

  if (isLoadingShare) {
    return (
      <div className="min-h-screen bg-warm-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-champagne border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-charcoal-medium">Caricamento...</p>
        </div>
      </div>
    )
  }

  if (error || !shareData) {
    return (
      <div className="min-h-screen bg-warm-bg flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-charcoal mb-2">Link non valido</h1>
          <p className="text-charcoal-medium">
            {error || "Questo link non esiste o e scaduto. Contatta il tuo rivenditore per ottenere un nuovo link."}
          </p>
        </div>
      </div>
    )
  }

  const status = shellyData ? calculateStatus(shellyData) : "optimal"
  const config = statusConfig[status]

  return (
    <div className="min-h-screen bg-warm-bg">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between bg-warm-surface border-b border-charcoal/8">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-champagne" strokeWidth={2} />
          <span className="text-charcoal text-sm font-semibold tracking-tight">WoodFloor Safe & Care</span>
        </div>
        <div className="flex items-center gap-2">
          {shellyData?.isOnline ? (
            <Wifi className="w-4 h-4 text-emerald-600" />
          ) : (
            <WifiOff className="w-4 h-4 text-charcoal-light" />
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-10 max-w-md mx-auto">
        {/* Title */}
        <section className="pt-8 pb-4 text-center">
          <h1 className="text-xl font-bold text-charcoal mb-1">
            Stato Pavimento di {shareData.customerName}
          </h1>
          <p className="text-sm text-charcoal-medium">
            Monitoraggio in tempo reale
          </p>
        </section>

        {/* Hero Section */}
        <section className="py-8 text-center">
          {isLoadingShelly ? (
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full bg-charcoal/10 animate-pulse" />
            </div>
          ) : (
            <>
              {/* Primary Message */}
              <h2 className="text-charcoal text-2xl font-bold tracking-tight mb-2">
                {config.title}
              </h2>
              <p className="text-charcoal-medium text-base font-medium mb-10">
                {config.subtitle}
              </p>

              {/* Large Semaphore */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-48 h-48 rounded-full flex items-center justify-center border-4 transition-all",
                    config.bgColor,
                    config.borderColor,
                    config.glowColor
                  )}
                >
                  <config.Icon className="w-20 h-20 text-white" strokeWidth={3} />
                </div>

                <div className={cn(
                  "mt-6 px-6 py-2 rounded-full text-lg font-bold tracking-widest",
                  config.labelBg,
                  config.labelText
                )}>
                  {config.label}
                </div>
              </div>
            </>
          )}
        </section>

        {/* Environment Values */}
        {shellyData && (
          <section className="py-6">
            <h3 className="text-charcoal text-sm font-bold tracking-wide uppercase mb-5">
              Valori Ambientali
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-warm-surface rounded-xl p-5 border-2 border-charcoal/8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Droplets className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <span className="text-xs font-semibold text-charcoal-medium uppercase tracking-wide">
                  Umidita
                </span>
                <div className="text-3xl font-bold text-charcoal mt-1">
                  {shellyData.humidity}%
                </div>
                <div className={cn(
                  "text-xs font-semibold mt-2",
                  shellyData.humidity >= THRESHOLDS.humidity.min && 
                  shellyData.humidity <= THRESHOLDS.humidity.max 
                    ? "text-emerald-600" 
                    : "text-amber-600"
                )}>
                  {shellyData.humidity >= THRESHOLDS.humidity.min && 
                   shellyData.humidity <= THRESHOLDS.humidity.max 
                    ? "Nella norma" 
                    : "Fuori range"}
                </div>
              </div>

              <div className="bg-warm-surface rounded-xl p-5 border-2 border-charcoal/8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Thermometer className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
                <span className="text-xs font-semibold text-charcoal-medium uppercase tracking-wide">
                  Temperatura
                </span>
                <div className="text-3xl font-bold text-charcoal mt-1">
                  {shellyData.temperature}°C
                </div>
                <div className={cn(
                  "text-xs font-semibold mt-2",
                  shellyData.temperature >= THRESHOLDS.temperature.min && 
                  shellyData.temperature <= THRESHOLDS.temperature.max 
                    ? "text-emerald-600" 
                    : "text-amber-600"
                )}>
                  {shellyData.temperature >= THRESHOLDS.temperature.min && 
                   shellyData.temperature <= THRESHOLDS.temperature.max 
                    ? "Nella norma" 
                    : "Fuori range"}
                </div>
              </div>
            </div>

            {/* Refresh Button */}
            <button 
              onClick={() => mutate()}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-charcoal/10 text-charcoal-medium hover:bg-charcoal/5 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-semibold">Aggiorna dati</span>
            </button>

            {/* Last Update */}
            <p className="text-center text-xs text-charcoal-light mt-3">
              Ultimo aggiornamento: {new Date(shellyData.lastUpdate).toLocaleString("it-IT")}
              {shellyData.isSimulated && " (demo)"}
            </p>
          </section>
        )}

        {/* Info Box */}
        <section className="py-6">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
            <h3 className="font-bold text-blue-900 mb-2">Come leggere i dati</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li><strong>SICURO:</strong> Condizioni ideali (15-25°C, 45-65% UR)</li>
              <li><strong>ATTENZIONE:</strong> Valori da monitorare</li>
              <li><strong>ALLARME:</strong> Contatta subito il rivenditore</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 bg-warm-surface border-t border-charcoal/8">
        <p className="text-charcoal-light text-xs font-semibold tracking-wide">
          Sistema di monitoraggio WoodFloor Safe & Care
        </p>
      </footer>
    </div>
  )
}
