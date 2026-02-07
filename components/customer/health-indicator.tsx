"use client"

import { cn } from "@/lib/utils"
import { Check, AlertTriangle, X } from "lucide-react"

interface HealthIndicatorProps {
  status: "optimal" | "warning" | "critical"
}

export function HealthIndicator({ status }: HealthIndicatorProps) {
  const statusConfig = {
    optimal: {
      bgColor: "bg-emerald-500",
      borderColor: "border-emerald-600",
      glowColor: "shadow-[0_0_40px_rgba(16,185,129,0.4)]",
      label: "SICURO",
      Icon: Check,
    },
    warning: {
      bgColor: "bg-amber-500",
      borderColor: "border-amber-600",
      glowColor: "shadow-[0_0_40px_rgba(245,158,11,0.4)]",
      label: "ATTENZIONE",
      Icon: AlertTriangle,
    },
    critical: {
      bgColor: "bg-red-600",
      borderColor: "border-red-700",
      glowColor: "shadow-[0_0_40px_rgba(220,38,38,0.4)]",
      label: "ALLARME",
      Icon: X,
    },
  }

  const config = statusConfig[status]

  return (
    <div className="flex flex-col items-center">
      {/* Large, confident traffic light indicator */}
      <div
        className={cn(
          "w-48 h-48 rounded-full flex items-center justify-center border-4",
          config.bgColor,
          config.borderColor,
          config.glowColor
        )}
      >
        <config.Icon className="w-20 h-20 text-white" strokeWidth={3} />
      </div>

      {/* Status label - bold and clear */}
      <div className={cn(
        "mt-6 px-6 py-2 rounded-full text-lg font-bold tracking-widest",
        status === "optimal" && "bg-emerald-100 text-emerald-800",
        status === "warning" && "bg-amber-100 text-amber-800",
        status === "critical" && "bg-red-100 text-red-800"
      )}>
        {config.label}
      </div>
    </div>
  )
}
