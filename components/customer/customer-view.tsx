"use client"

import { EnvironmentCard } from "./environment-card"
import { DocumentVault } from "./document-vault"
import { Droplets, Thermometer, Phone, ShieldCheck } from "lucide-react"

interface CustomerData {
  id: string
  name: string
  floorHealth: "optimal" | "warning" | "critical"
  humidity: number
  temperature: number
  humidityStatus: "optimal" | "action-needed"
  temperatureStatus: "optimal" | "action-needed"
  installationDate?: string
  documents: {
    etichettaCE?: string
    conformita?: string
    dop?: string
    schedaProdotto?: string
    rapportoPosa?: string
  }
}

interface CustomerViewProps {
  customer: CustomerData
}

// Messaggio principale basato sullo stato
function getMainMessage(status: "optimal" | "warning" | "critical") {
  switch (status) {
    case "optimal":
      return { title: "Il tuo pavimento e protetto", subtitle: "Tutti i parametri sono nella norma" }
    case "warning":
      return { title: "Ambiente da monitorare", subtitle: "Alcuni parametri richiedono attenzione" }
    case "critical":
      return { title: "Intervento necessario", subtitle: "Contatta il tuo rivenditore" }
  }
}

// Colore semaforo basato sullo stato
function getSemaphoreColor(status: "optimal" | "warning" | "critical") {
  switch (status) {
    case "optimal":
      return { bg: "bg-cpr-green", glow: "shadow-[0_0_60px_20px_rgba(34,197,94,0.4)]", text: "text-cpr-green" }
    case "warning":
      return { bg: "bg-cpr-yellow", glow: "shadow-[0_0_60px_20px_rgba(234,179,8,0.4)]", text: "text-cpr-yellow" }
    case "critical":
      return { bg: "bg-cpr-red", glow: "shadow-[0_0_60px_20px_rgba(239,68,68,0.4)]", text: "text-cpr-red" }
  }
}

export function CustomerView({ customer }: CustomerViewProps) {
  const firstName = customer.name.split(" ")[0]
  const message = getMainMessage(customer.floorHealth)
  const semaphoreStyle = getSemaphoreColor(customer.floorHealth)
  const needsMaintenance = customer.floorHealth !== "optimal"

  return (
    <div className="min-h-screen bg-warm-bg">
      {/* Header Compatto */}
      <header className="px-6 py-4 flex items-center justify-between bg-warm-surface border-b border-charcoal/8">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-champagne" strokeWidth={2} />
          <span className="text-charcoal text-sm font-semibold tracking-tight">WoodFloor</span>
        </div>
        <span className="text-charcoal-medium text-sm font-medium">{firstName}</span>
      </header>

      {/* Contenuto Principale */}
      <main className="px-6 pb-10 max-w-md mx-auto">
        
        {/* ELEMENTO CENTRALE: Semaforo CPR Grande e Intuitivo */}
        <section className="py-10 text-center">
          {/* Messaggio Principale */}
          <h1 className="text-charcoal text-2xl font-bold tracking-tight mb-2">
            {message.title}
          </h1>
          <p className="text-charcoal-medium text-base font-medium mb-10">
            {message.subtitle}
          </p>
          
          {/* SEMAFORO CPR - Grande e Intuitivo */}
          <div className="flex flex-col items-center">
            {/* Cerchio Semaforo Grande */}
            <div 
              className={`w-40 h-40 rounded-full ${semaphoreStyle.bg} ${semaphoreStyle.glow} flex items-center justify-center mb-6 transition-all duration-500`}
            >
              <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
                <div className={`w-24 h-24 rounded-full ${semaphoreStyle.bg} flex items-center justify-center`}>
                  <span className="text-white text-4xl font-bold">
                    {customer.floorHealth === "optimal" ? "OK" : 
                     customer.floorHealth === "warning" ? "!" : "!!"}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Label Stato */}
            <p className={`text-lg font-bold uppercase tracking-wider ${semaphoreStyle.text}`}>
              {customer.floorHealth === "optimal" ? "TUTTO OK" : 
               customer.floorHealth === "warning" ? "ATTENZIONE" : "CRITICO"}
            </p>
          </div>
        </section>

        {/* Valori Ambientali */}
        <section className="py-6">
          <h2 className="text-charcoal text-sm font-bold tracking-wide uppercase mb-5">
            Valori Ambientali
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <EnvironmentCard
              icon={<Droplets className="h-5 w-5" strokeWidth={2} />}
              label="Umidita"
              value={`${customer.humidity}%`}
              status={customer.humidityStatus}
            />
            <EnvironmentCard
              icon={<Thermometer className="h-5 w-5" strokeWidth={2} />}
              label="Temperatura"
              value={`${customer.temperature}°C`}
              status={customer.temperatureStatus}
            />
          </div>
        </section>

        {/* Contatta Rivenditore (se necessario) */}
        {needsMaintenance && (
          <section className="py-6">
            <div className="p-5 rounded-xl border-2 bg-amber-50 border-amber-300">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-amber-100">
                  <Phone className="w-5 h-5 text-amber-700" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold mb-1 text-amber-900">
                    Contatta il rivenditore
                  </p>
                  <p className="text-sm leading-relaxed mb-4 text-amber-800">
                    I parametri attuali suggeriscono un intervento. Contatta il rivenditore per una valutazione.
                  </p>
                  <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-amber-600 text-white hover:bg-amber-700">
                    <Phone className="w-4 h-4" strokeWidth={2} />
                    Chiama ora
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* I miei Documenti */}
        <section className="py-6">
          <h2 className="text-charcoal text-sm font-bold tracking-wide uppercase mb-5">
            I miei documenti
          </h2>
          <DocumentVault documents={customer.documents} />
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
