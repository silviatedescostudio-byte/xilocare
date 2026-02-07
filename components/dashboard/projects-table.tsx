"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"

const projects = [
  {
    id: "bianchi",
    clientName: "Residenza Bianchi",
    woodSpecies: "Rovere Europeo",
    installationDate: "2024-01-15",
    healthStatus: "healthy",
    hasRealSensor: true,
  },
  {
    id: "1",
    clientName: "Mario Rossi",
    woodSpecies: "Rovere Europeo",
    installationDate: "2024-03-15",
    healthStatus: "healthy",
    hasRealSensor: false,
  },
  {
    id: "2",
    clientName: "Laura Neri",
    woodSpecies: "Noce Americano",
    installationDate: "2024-06-20",
    healthStatus: "warning",
    hasRealSensor: false,
  },
  {
    id: "3",
    clientName: "Giuseppe Verdi",
    woodSpecies: "Ciliegio",
    installationDate: "2024-01-10",
    healthStatus: "critical",
    hasRealSensor: false,
  },
  {
    id: "4",
    clientName: "Anna Marino",
    woodSpecies: "Frassino",
    installationDate: "2024-09-05",
    healthStatus: "healthy",
    hasRealSensor: false,
  },
]

const statusConfig = {
  healthy: {
    color: "bg-cpr-green",
    label: "OK",
    textColor: "text-cpr-green",
    bgColor: "bg-cpr-green-bg",
  },
  warning: {
    color: "bg-cpr-yellow",
    label: "Attenzione",
    textColor: "text-cpr-yellow",
    bgColor: "bg-cpr-yellow-bg",
  },
  critical: {
    color: "bg-cpr-red",
    label: "Critico",
    textColor: "text-cpr-red",
    bgColor: "bg-cpr-red-bg",
  },
}

export function ProjectsTable() {
  return (
    <div className="bg-wood-medium p-5 rounded-xl border border-gold/20 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm text-cream font-bold tracking-tight mb-1">
          Stato Installazioni
        </h3>
        <p className="text-xs text-cream/60 font-medium">
          Monitora lo stato di salute dei tuoi clienti
        </p>
      </div>

      <div className="space-y-0">
        {/* Header */}
        <div className="grid grid-cols-4 gap-3 pb-3 border-b border-gold/20">
          <span className="text-[11px] text-cream/70 font-bold uppercase">Cliente</span>
          <span className="text-[11px] text-cream/70 font-bold uppercase">Essenza</span>
          <span className="text-[11px] text-cream/70 font-bold uppercase">Data</span>
          <span className="text-[11px] text-cream/70 font-bold uppercase text-right">Stato</span>
        </div>

        {/* Rows */}
        {projects.map((project) => {
          const status = statusConfig[project.healthStatus as keyof typeof statusConfig]
          return (
            <Link
              key={project.id}
              href={`/customer/${project.id}`}
              className={cn(
                "grid grid-cols-4 gap-3 py-3.5 border-b border-gold/10 hover:bg-gold/5 transition-colors cursor-pointer",
                project.healthStatus === "critical" && "bg-cpr-red-bg",
                project.hasRealSensor && "ring-1 ring-gold/30 bg-gold/5"
              )}
            >
              <span className="text-sm font-bold text-cream flex items-center gap-2">
                {project.clientName}
                {project.hasRealSensor && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold text-wood-dark font-semibold">LIVE</span>
                )}
              </span>
              <span className="text-sm font-medium text-cream/70">{project.woodSpecies}</span>
              <span className="text-sm font-medium text-cream/50">
                {new Date(project.installationDate).toLocaleDateString("it-IT", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
              <div className="flex justify-end items-center">
                <div className={cn(
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border",
                  status.bgColor,
                  project.healthStatus === "healthy" && "border-cpr-green/30",
                  project.healthStatus === "warning" && "border-cpr-yellow/30",
                  project.healthStatus === "critical" && "border-cpr-red/30"
                )}>
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    status.color,
                    project.healthStatus === "critical" && "animate-pulse"
                  )} />
                  <span className={cn(
                    "text-xs font-bold uppercase",
                    status.textColor
                  )}>
                    {status.label}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
