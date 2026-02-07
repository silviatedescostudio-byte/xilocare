"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface EnvironmentCardProps {
  icon: ReactNode
  label: string
  value: string
  status: "optimal" | "action-needed"
}

export function EnvironmentCard({ icon, label, value, status }: EnvironmentCardProps) {
  const isOptimal = status === "optimal"

  return (
    <div className={cn(
      "py-5 px-4 rounded-xl border-2",
      isOptimal 
        ? "bg-warm-surface border-charcoal/10" 
        : "bg-amber-50 border-amber-400"
    )}>
      {/* Label + Icon row */}
      <div className="flex items-center justify-between mb-3">
        <p className={cn(
          "text-xs font-bold tracking-wide uppercase",
          isOptimal ? "text-charcoal-medium" : "text-amber-800"
        )}>
          {label}
        </p>
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          isOptimal ? "bg-charcoal/5 text-charcoal" : "bg-amber-200 text-amber-700"
        )}>
          {icon}
        </div>
      </div>

      {/* Value - Large and bold */}
      <p className={cn(
        "text-4xl font-bold tracking-tight mb-3",
        isOptimal ? "text-charcoal" : "text-amber-900"
      )}>
        {value}
      </p>

      {/* Status indicator - Clear and decisive */}
      <div className={cn(
        "flex items-center gap-2",
        isOptimal ? "text-emerald-700" : "text-amber-700"
      )}>
        <span className={cn(
          "w-2.5 h-2.5 rounded-full",
          isOptimal ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
        )} />
        <span className="text-sm font-semibold">
          {isOptimal ? "Nella norma" : "Da verificare"}
        </span>
      </div>
    </div>
  )
}
