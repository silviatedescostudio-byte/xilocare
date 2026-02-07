"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon,
  Thermometer, 
  Droplets,
  Battery,
  Wifi,
  WifiOff,
  RefreshCw,
  Lightbulb,
  Phone,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react"
import Link from "next/link"

interface ShellyData {
  temperature: number
  humidity: number
  batteryLevel: number
  lastUpdate: string
  isOnline: boolean
  isSimulated?: boolean
  error?: string
}

type CPRStatus = "green" | "yellow" | "red"

interface CPRSemaphoreProps {
  shellyDeviceId: string
  customerName: string
}

/**
 * LOGICA SEMAFORO CPR - Basata ESCLUSIVAMENTE su humidity
 * 
 * VERDE: 45% - 65%
 * GIALLO: 40-44% oppure 66-70%
 * ROSSO: < 40% oppure > 70%
 */
function calculateCPRStatus(humidity: number, temperature: number): { 
  status: CPRStatus
  message: string
  advice: string[]
  humidityStatus: "low" | "optimal" | "high"
  tempStatus: "low" | "optimal" | "high"
} {
  let humidityStatus: "low" | "optimal" | "high" = "optimal"
  let tempStatus: "low" | "optimal" | "high" = "optimal"
  
  // Temperature status (solo informativo, non influisce sul semaforo)
  if (temperature < 18) tempStatus = "low"
  else if (temperature > 22) tempStatus = "high"
  
  // LOGICA SEMAFORO BASATA SU HUMIDITY
  // VERDE: 45% - 65%
  if (humidity >= 45 && humidity <= 65) {
    humidityStatus = "optimal"
    return {
      status: "green",
      message: "Il tuo pavimento e protetto",
      advice: [
        "Mantieni queste condizioni ottimali",
        "Il legno e in equilibrio con l'ambiente"
      ],
      humidityStatus,
      tempStatus
    }
  }
  
  // ROSSO: < 40% oppure > 70%
  if (humidity < 40 || humidity > 70) {
    humidityStatus = humidity < 40 ? "low" : "high"
    const isLow = humidity < 40
    return {
      status: "red",
      message: isLow 
        ? "ATTENZIONE CRITICA: Ambiente troppo secco" 
        : "ATTENZIONE CRITICA: Ambiente troppo umido",
      advice: isLow
        ? [
            "Rischio fessurazioni del legno",
            "Attiva immediatamente un umidificatore",
            "Evita fonti di calore diretto",
            "Contatta il tecnico se il problema persiste"
          ]
        : [
            "Rischio rigonfiamenti del legno",
            "Attiva immediatamente un deumidificatore",
            "Arieggia gli ambienti",
            "Verifica infiltrazioni o perdite",
            "Contatta il tecnico se il problema persiste"
          ],
      humidityStatus,
      tempStatus
    }
  }
  
  // GIALLO: 40-44% oppure 66-70%
  humidityStatus = humidity < 45 ? "low" : "high"
  const isLowHumidity = humidity < 45
  return {
    status: "yellow",
    message: isLowHumidity 
      ? "Attenzione: Umidita in calo" 
      : "Attenzione: Umidita elevata",
    advice: isLowHumidity
      ? [
          "Considera l'uso di un umidificatore",
          "Evita di tenere i riscaldamenti troppo alti",
          "Monitora l'evoluzione nei prossimi giorni"
        ]
      : [
          "Considera l'uso di un deumidificatore",
          "Arieggia regolarmente gli ambienti",
          "Monitora l'evoluzione nei prossimi giorni"
        ],
    humidityStatus,
    tempStatus
  }
}

export function CPRSemaphore({ shellyDeviceId, customerName }: CPRSemaphoreProps) {
  const [data, setData] = useState<ShellyData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`/api/shelly/${shellyDeviceId}`)
      if (response.ok) {
        const shellyData = await response.json()
        setData(shellyData)
        setLastFetchTime(new Date())
      }
    } catch (error) {
      console.error("Error fetching Shelly data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [shellyDeviceId])

  useEffect(() => {
    fetchData()
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [fetchData])

  if (isLoading || !data) {
    return (
      <Card className="bg-wood-medium border-gold/20">
        <CardContent className="p-8 flex flex-col items-center justify-center min-h-[400px]">
          <RefreshCw className="h-12 w-12 text-gold animate-spin mb-4" />
          <p className="text-cream/70 text-lg">Connessione al sensore in corso...</p>
          <p className="text-cream/50 text-sm mt-2">Shelly ID: {shellyDeviceId}</p>
        </CardContent>
      </Card>
    )
  }

  const cprResult = calculateCPRStatus(data.humidity, data.temperature)
  const { status, message, advice, humidityStatus, tempStatus } = cprResult

  const statusConfig = {
    green: {
      bgColor: "bg-cpr-green-bg",
      borderColor: "border-cpr-green/30",
      iconColor: "text-cpr-green",
      icon: ShieldCheck,
      label: "PROTETTO",
      glowColor: "shadow-cpr-green/20"
    },
    yellow: {
      bgColor: "bg-cpr-yellow-bg",
      borderColor: "border-cpr-yellow/30",
      iconColor: "text-cpr-yellow",
      icon: AlertTriangle,
      label: "ATTENZIONE",
      glowColor: "shadow-cpr-yellow/20"
    },
    red: {
      bgColor: "bg-cpr-red-bg",
      borderColor: "border-cpr-red/30",
      iconColor: "text-cpr-red",
      icon: AlertOctagon,
      label: "CRITICO",
      glowColor: "shadow-cpr-red/20"
    }
  }

  const config = statusConfig[status]
  const StatusIcon = config.icon

  const getTrendIcon = (status: "low" | "optimal" | "high") => {
    if (status === "low") return <TrendingDown className="h-4 w-4" />
    if (status === "high") return <TrendingUp className="h-4 w-4" />
    return <Minus className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Main Semaphore Card */}
      <Card className={`${config.bgColor} ${config.borderColor} border-2 shadow-xl ${config.glowColor}`}>
        <CardContent className="p-6 md:p-8">
          {/* Header with connection status */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-cream">Stato Pavimento</h2>
              <p className="text-cream/70">{customerName}</p>
            </div>
            <div className="flex items-center gap-3">
              {data.isSimulated && (
                <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                  Demo
                </Badge>
              )}
              <div className="flex items-center gap-2">
                {data.isOnline ? (
                  <Wifi className="h-4 w-4 text-cpr-green" />
                ) : (
                  <WifiOff className="h-4 w-4 text-cpr-red" />
                )}
                <span className="text-xs text-cream/60">
                  {data.isOnline ? "Online" : "Offline"}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={fetchData}
                className="h-8 w-8 text-cream/60 hover:text-cream hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Central Semaphore Display */}
          <div className="flex flex-col items-center py-8">
            <div className={`relative p-8 rounded-full ${config.bgColor} border-4 ${config.borderColor} mb-6`}>
              {status === "red" && (
                <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-cpr-red" />
              )}
              <StatusIcon className={`h-20 w-20 md:h-24 md:w-24 ${config.iconColor}`} strokeWidth={1.5} />
            </div>
            
            <Badge 
              className={`text-lg md:text-xl px-6 py-2 font-bold tracking-wider ${
                status === "green" ? "bg-cpr-green text-white" :
                status === "yellow" ? "bg-cpr-yellow text-wood-dark" :
                "bg-cpr-red text-white"
              }`}
            >
              {config.label}
            </Badge>
            
            <p className={`mt-4 text-lg md:text-xl font-medium text-center ${config.iconColor}`}>
              {message}
            </p>
          </div>

          {/* Environmental Readings */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {/* Humidity */}
            <div className={`p-4 rounded-xl bg-wood-dark/50 border ${
              humidityStatus === "optimal" ? "border-cpr-green/30" :
              humidityStatus === "low" || humidityStatus === "high" ? 
                (data.humidity < 35 || data.humidity > 70 ? "border-cpr-red/30" : "border-cpr-yellow/30") :
                "border-gold/20"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Droplets className={`h-5 w-5 ${
                  humidityStatus === "optimal" ? "text-cpr-green" :
                  data.humidity < 35 || data.humidity > 70 ? "text-cpr-red" : "text-cpr-yellow"
                }`} />
                <span className="text-cream/70 text-sm">Umidita</span>
                {getTrendIcon(humidityStatus)}
              </div>
              <p className="text-3xl font-bold text-cream">{data.humidity}<span className="text-lg">%</span></p>
              <p className="text-xs text-cream/50 mt-1">Ottimale: 45-65%</p>
            </div>

            {/* Temperature */}
            <div className={`p-4 rounded-xl bg-wood-dark/50 border ${
              tempStatus === "optimal" ? "border-cpr-green/30" : "border-cpr-yellow/30"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className={`h-5 w-5 ${
                  tempStatus === "optimal" ? "text-cpr-green" : "text-cpr-yellow"
                }`} />
                <span className="text-cream/70 text-sm">Temperatura</span>
                {getTrendIcon(tempStatus)}
              </div>
              <p className="text-3xl font-bold text-cream">{data.temperature}<span className="text-lg">°C</span></p>
              <p className="text-xs text-cream/50 mt-1">Ottimale: 18-22°C</p>
            </div>

            {/* Battery */}
            <div className="p-4 rounded-xl bg-wood-dark/50 border border-gold/20">
              <div className="flex items-center gap-2 mb-2">
                <Battery className={`h-5 w-5 ${
                  data.batteryLevel > 50 ? "text-cpr-green" :
                  data.batteryLevel > 20 ? "text-cpr-yellow" : "text-cpr-red"
                }`} />
                <span className="text-cream/70 text-sm">Batteria</span>
              </div>
              <p className="text-3xl font-bold text-cream">{data.batteryLevel}<span className="text-lg">%</span></p>
              <p className="text-xs text-cream/50 mt-1">Sensore Shelly</p>
            </div>

            {/* Last Update */}
            <div className="p-4 rounded-xl bg-wood-dark/50 border border-gold/20">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="h-5 w-5 text-gold" />
                <span className="text-cream/70 text-sm">Aggiornato</span>
              </div>
              <p className="text-lg font-bold text-cream">
                {lastFetchTime ? lastFetchTime.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
              </p>
              <p className="text-xs text-cream/50 mt-1">Auto-refresh: 60s</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons based on status */}
      {status === "yellow" && (
        <Card className="bg-cpr-yellow-bg border-cpr-yellow/30 border">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-cpr-yellow/20">
                <Lightbulb className="h-6 w-6 text-cpr-yellow" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-cream mb-2">Consigli di Prevenzione</h3>
                <ul className="space-y-2">
                  {advice.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-cream/80">
                      <span className="text-cpr-yellow">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {status === "red" && (
        <Card className="bg-cpr-red-bg border-cpr-red/30 border-2 animate-pulse">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="p-3 rounded-full bg-cpr-red/20">
                <AlertOctagon className="h-6 w-6 text-cpr-red" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-cream mb-2">Procedure di Emergenza</h3>
                <ul className="space-y-2 mb-4">
                  {advice.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-cream/80">
                      <span className="text-cpr-red">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <Link href="/sos-protocols">
                    <Button className="bg-cpr-red hover:bg-cpr-red/80 text-white font-bold">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      SOS PAVIMENTO
                    </Button>
                  </Link>
                  <Button variant="outline" className="border-cpr-red/50 text-cpr-red hover:bg-cpr-red/20 bg-transparent">
                    <Phone className="mr-2 h-4 w-4" />
                    Chiama Tecnico
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
