import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle, Droplets, Sun, Scissors, Footprints } from "lucide-react"

/**
 * PAGINA SOS - PRONTO SOCCORSO
 * Lista dei 10 protocolli di emergenza
 */

const protocolli = [
  { id: 1, nome: "Macchie organiche", descrizione: "Cibo, bevande, sangue" },
  { id: 2, nome: "Inchiostro e pennarelli", descrizione: "Penne, evidenziatori, marker" },
  { id: 3, nome: "Urina / Vomito / Escrementi", descrizione: "Animali domestici, incidenti" },
  { id: 4, nome: "Grasso e oli", descrizione: "Olio da cucina, creme, unguenti" },
  { id: 5, nome: "Cosmetici e trucchi", descrizione: "Smalto, fondotinta, rossetto" },
  { id: 6, nome: "Graffi e trascinamento", descrizione: "Mobili, oggetti pesanti" },
  { id: 7, nome: "Fessurazioni e ritiri", descrizione: "Ambiente troppo secco" },
  { id: 8, nome: "Rigonfiamenti e imbarcamenti", descrizione: "Ambiente troppo umido" },
  { id: 9, nome: "Luce del sole e colore", descrizione: "Scolorimento da UV" },
  { id: 10, nome: "Macchie d'acqua e aloni neri", descrizione: "Infiltrazioni, ristagni" },
]

export default function SOSPage() {
  return (
    <div className="min-h-screen bg-wood-dark">
      {/* Header */}
      <header className="bg-cpr-red/20 border-b border-cpr-red/40 p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/customer" className="inline-flex items-center gap-2 text-cream/70 hover:text-cream mb-4">
            <ArrowLeft className="h-4 w-4" />
            Torna alla dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-cpr-red/30">
              <AlertTriangle className="h-8 w-8 text-cpr-red" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-cpr-red">SOS - PRONTO SOCCORSO</h1>
              <p className="text-cream/60 mt-1">Seleziona il tipo di problema</p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {protocolli.map((p) => (
            <Card 
              key={p.id} 
              className="bg-wood-medium border-gold/20 hover:border-gold/40 transition-all cursor-pointer"
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-cpr-red/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-cpr-red font-bold">{p.id}</span>
                  </div>
                  <div>
                    <h3 className="text-cream font-semibold">{p.nome}</h3>
                    <p className="text-cream/60 text-sm mt-1">{p.descrizione}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
