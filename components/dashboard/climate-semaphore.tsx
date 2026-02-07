"use client"

import { cn } from "@/lib/utils"
import { Thermometer, Droplets, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Simulazione dati Shelly H&T Gen3
export interface ShellyData {
  temperature: number
  humidity: number
  batteryLevel: number
  lastUpdate: string
  isOnline: boolean
}

// Soglie definite da Fase A
const THRESHOLDS = {
  temperature: { min: 15, max: 25, warningMin: 13, warningMax: 28 },
  humidity: { min: 45, max: 65, warningMin: 40, warningMax: 70 }
}

export type SemaphoreStatus = "green" | "yellow" | "red"

export function calculateSemaphoreStatus(data: ShellyData): SemaphoreStatus {
  const { temperature, humidity } = data
  
  // RED: Pericolo grave
  if (
    temperature < THRESHOLDS.temperature.warningMin ||
    temperature > THRESHOLDS.temperature.warningMax ||
    humidity < THRESHOLDS.humidity.warningMin ||
    humidity > THRESHOLDS.humidity.warningMax
  ) {
    return "red"
  }
  
  // YELLOW: Allerta Fase B
  if (
    temperature < THRESHOLDS.temperature.min ||
    temperature > THRESHOLDS.temperature.max ||
    humidity < THRESHOLDS.humidity.min ||
    humidity > THRESHOLDS.humidity.max
  ) {
    return "yellow"
  }
  
  // GREEN: Condizioni ottimali
  return "green"
}

const statusConfig = {
  green: {
    label: "Ottimale",
    description: "Condizioni climatiche ideali per il pavimento",
    color: "bg-green-500",
    ringColor: "ring-green-500/30",
    textColor: "text-green-700",
    bgLight: "bg-green-50",
    borderColor: "border-green-200",
    icon: CheckCircle
  },
  yellow: {
    label: "Allerta",
    description: "Fase B - Intervenire sul clima",
    color: "bg-amber-500",
    ringColor: "ring-amber-500/30",
    textColor: "text-amber-700",
    bgLight: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: AlertCircle
  },
  red: {
    label: "Pericolo",
    description: "Rischio grave per la stabilita del legno",
    color: "bg-red-500",
    ringColor: "ring-red-500/30",
    textColor: "text-red-700",
    bgLight: "bg-red-50",
    borderColor: "border-red-200",
    icon: AlertTriangle
  }
}

interface ClimateSemaphoreProps {
  data: ShellyData
  compact?: boolean
  showDetails?: boolean
}

export function ClimateSemaphore({ data, compact = false, showDetails = true }: ClimateSemaphoreProps) {
  const status = calculateSemaphoreStatus(data)
  const config = statusConfig[status]
  const StatusIcon = config.icon

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full cursor-help",
              config.bgLight,
              config.borderColor,
              "border"
            )}>
              <div className={cn(
                "w-3 h-3 rounded-full",
                config.color,
                status !== "green" && "animate-pulse"
              )} />
              <span className={cn("text-xs font-semibold", config.textColor)}>
                {config.label}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <div className="space-y-2">
              <p className="font-semibold">{config.description}</p>
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <Thermometer className="h-3 w-3" />
                  {data.temperature}°C
                </span>
                <span className="flex items-center gap-1">
                  <Droplets className="h-3 w-3" />
                  {data.humidity}%
                </span>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className={cn(
      "rounded-xl border p-4",
      config.bgLight,
      config.borderColor
    )}>
      <div className="flex items-center gap-4">
        {/* Semaforo visuale */}
        <div className="flex flex-col gap-1.5 p-2 bg-charcoal/80 rounded-lg">
          <div className={cn(
            "w-4 h-4 rounded-full transition-all",
            status === "red" ? "bg-red-500 shadow-lg shadow-red-500/50" : "bg-red-900/30"
          )} />
          <div className={cn(
            "w-4 h-4 rounded-full transition-all",
            status === "yellow" ? "bg-amber-500 shadow-lg shadow-amber-500/50" : "bg-amber-900/30"
          )} />
          <div className={cn(
            "w-4 h-4 rounded-full transition-all",
            status === "green" ? "bg-green-500 shadow-lg shadow-green-500/50" : "bg-green-900/30"
          )} />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <StatusIcon className={cn("h-5 w-5", config.textColor)} />
            <span className={cn("font-bold text-lg", config.textColor)}>
              {config.label}
            </span>
          </div>
          <p className="text-sm text-charcoal-medium">{config.description}</p>
        </div>

        {/* Dati Shelly */}
        {showDetails && (
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="flex items-center gap-1 text-charcoal-medium">
                <Thermometer className="h-4 w-4" />
                <span className="font-mono font-bold text-charcoal">{data.temperature}°C</span>
              </div>
              <span className="text-xs text-charcoal-light">Temperatura</span>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-charcoal-medium">
                <Droplets className="h-4 w-4" />
                <span className="font-mono font-bold text-charcoal">{data.humidity}%</span>
              </div>
              <span className="text-xs text-charcoal-light">Umidita</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente per mostrare solo il pallino del semaforo (per tabelle)
export function SemaphoreDot({ status, size = "md" }: { status: SemaphoreStatus; size?: "sm" | "md" | "lg" }) {
  const config = statusConfig[status]
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "rounded-full cursor-help",
            sizeClasses[size],
            config.color,
            status !== "green" && "animate-pulse"
          )} />
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">{config.label}</p>
          <p className="text-xs">{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
