"use client"

import { Droplet, Ruler, SprayCanIcon, Shield, Lightbulb, ChevronRight } from "lucide-react"
import Link from "next/link"

/**
 * ===============================================
 * CONSIGLI TECNICI DI PREVENZIONE
 * ===============================================
 * 
 * Questa sezione sostituisce i vecchi testi "SOS" con
 * "Consigli Tecnici di Prevenzione".
 * 
 * I contenuti sono placeholder pronti per l'inserimento
 * dei protocolli tecnici definitivi da parte di Silvia.
 * 
 * ===============================================
 * |   CONTENUTI DA PRODURRE - SILVIA           |
 * ===============================================
 * 
 * Per ogni azione/consiglio, Silvia dovra fornire:
 * 1. Titolo breve (max 20 caratteri)
 * 2. Descrizione dettagliata del protocollo
 * 3. Lista di passi da seguire
 * 4. Eventuali avvertenze
 * 
 * ===============================================
 */

const preventionTips = [
  {
    id: "liquid-spills",
    label: "Liquidi versati",
    icon: Droplet,
    href: "/consigli/liquidi",
    // CONTENUTI DA PRODURRE - SILVIA: Protocollo per liquidi versati
    description: "Cosa fare immediatamente in caso di versamento"
  },
  {
    id: "scratches",
    label: "Graffi e segni",
    icon: Ruler,
    href: "/consigli/graffi",
    // CONTENUTI DA PRODURRE - SILVIA: Protocollo per graffi e segni
    description: "Come prevenire e trattare i graffi"
  },
  {
    id: "cleaning",
    label: "Come pulire",
    icon: SprayCanIcon,
    href: "/consigli/pulizia",
    // CONTENUTI DA PRODURRE - SILVIA: Guida pulizia quotidiana
    description: "Guida alla pulizia quotidiana corretta"
  },
  {
    id: "protection",
    label: "Protezione UV",
    icon: Shield,
    href: "/consigli/protezione",
    // CONTENUTI DA PRODURRE - SILVIA: Protocollo protezione UV
    description: "Proteggere il pavimento dalla luce solare"
  },
]

export function SOSActions() {
  return (
    <div className="space-y-4">
      {/* Titolo sezione aggiornato */}
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="h-4 w-4 text-champagne" />
        <span className="text-xs font-semibold text-charcoal-medium uppercase tracking-wide">
          Consigli Tecnici di Prevenzione
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {preventionTips.map((tip) => (
          <Link
            key={tip.id}
            href={tip.href}
            className="flex items-center gap-3 p-4 bg-warm-surface rounded-xl border-2 border-charcoal/8 hover:border-champagne/30 hover:bg-champagne/5 transition-all text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-charcoal/5 flex items-center justify-center flex-shrink-0 group-hover:bg-champagne/10 transition-colors">
              <tip.icon className="h-5 w-5 text-charcoal group-hover:text-champagne transition-colors" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-charcoal leading-tight block">
                {tip.label}
              </span>
              <span className="text-xs text-charcoal-light line-clamp-1">
                {tip.description}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-charcoal-light group-hover:text-champagne transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
