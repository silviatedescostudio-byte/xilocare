"use client"

import { FileText, Award, BookOpen, ArrowDownToLine, ClipboardCheck, Package } from "lucide-react"

/**
 * ===============================================
 * STRUTTURA DOCUMENTI CLIENTE
 * ===============================================
 * 
 * Il cliente vede SOLO i documenti caricati specificamente
 * dal suo rivenditore per la sua fornitura.
 * 
 * Documenti disponibili:
 * - Etichetta CE
 * - Dichiarazione di Conformita
 * - DoP (Dichiarazione di Prestazione)
 * - Scheda Prodotto
 * - Rapporto di Posa (facoltativo)
 * ===============================================
 */

interface DocumentVaultProps {
  documents: {
    etichettaCE?: string      // URL documento Etichetta CE
    conformita?: string        // URL Dichiarazione di Conformita
    dop?: string               // URL DoP
    schedaProdotto?: string    // URL Scheda Prodotto
    rapportoPosa?: string      // URL Rapporto di Posa (facoltativo)
  }
}

const documentTypes = [
  {
    key: "etichettaCE" as const,
    label: "Etichetta CE",
    shortLabel: "CE",
    icon: Award,
    required: true,
  },
  {
    key: "conformita" as const,
    label: "Dichiarazione di Conformita",
    shortLabel: "Conformita",
    icon: ClipboardCheck,
    required: true,
  },
  {
    key: "dop" as const,
    label: "Dichiarazione di Prestazione",
    shortLabel: "DoP",
    icon: FileText,
    required: true,
  },
  {
    key: "schedaProdotto" as const,
    label: "Scheda Prodotto",
    shortLabel: "Scheda",
    icon: Package,
    required: true,
  },
  {
    key: "rapportoPosa" as const,
    label: "Rapporto di Posa",
    shortLabel: "Posa",
    icon: BookOpen,
    required: false, // FACOLTATIVO
  },
]

export function DocumentVault({ documents }: DocumentVaultProps) {
  const handleDownload = (url: string, name: string) => {
    console.log(`Downloading ${name} from ${url}`)
    // In produzione, questo aprira il file o avviera il download
  }

  // Filtra solo i documenti effettivamente caricati dal rivenditore
  const availableDocuments = documentTypes.filter(doc => documents[doc.key])

  if (availableDocuments.length === 0) {
    return (
      <div className="p-6 text-center bg-wood-dark/30 rounded-xl border-2 border-dashed border-gold/20">
        <FileText className="h-8 w-8 text-cream/40 mx-auto mb-3" />
        <p className="text-cream/70 text-sm font-medium">
          Nessun documento ancora disponibile
        </p>
        <p className="text-cream/50 text-xs mt-1">
          Il tuo rivenditore caricherà i documenti della tua fornitura
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {availableDocuments.map((doc) => (
        <button
          key={doc.key}
          onClick={() => handleDownload(documents[doc.key]!, doc.label)}
          className="w-full flex items-center justify-between p-4 bg-wood-dark/50 rounded-xl border-2 border-gold/20 hover:border-gold/40 hover:bg-wood-dark/70 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
              <doc.icon className="h-5 w-5 text-gold" strokeWidth={2} />
            </div>
            <div className="text-left">
              <p className="text-cream text-sm font-semibold">{doc.shortLabel}</p>
              <p className="text-cream/60 text-xs">
                {doc.label}
              </p>
            </div>
          </div>

          <div className="w-9 h-9 rounded-lg bg-gold/20 flex items-center justify-center">
            <ArrowDownToLine className="h-4 w-4 text-gold" strokeWidth={2} />
          </div>
        </button>
      ))}
    </div>
  )
}
