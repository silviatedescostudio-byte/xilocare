"use client"

import { useParams } from "next/navigation"
import { Shield, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

// Valid public codes mapped to customer data
const VALID_CODES: Record<string, { name: string; deviceId: string }> = {
  bianchi: { name: "Residenza Bianchi", deviceId: "e4b3232f9708" },
}

export default function PublicCustomerPage() {
  const params = useParams()
  const code = (params.public_code as string)?.toLowerCase()
  const customer = VALID_CODES[code]

  // Invalid code - show error page (no redirect to login)
  if (!customer) {
    return (
      <div className="min-h-screen bg-wood-dark flex items-center justify-center px-6">
        <Card className="max-w-sm w-full bg-wood-medium border-gold/20">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-cpr-red/10 flex items-center justify-center mx-auto border border-cpr-red/20">
              <AlertTriangle className="h-8 w-8 text-cpr-red" />
            </div>
            <h1 className="text-xl font-bold text-cream">Codice non valido</h1>
            <p className="text-cream/60 text-sm">
              Il codice <span className="font-mono text-gold">"{params.public_code}"</span> non corrisponde a nessun cliente registrato.
            </p>
            <p className="text-cream/40 text-xs">
              Verifica il link ricevuto dal tuo rivenditore.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Valid code - redirect to customer dashboard with context
  return (
    <div className="min-h-screen bg-wood-dark flex flex-col items-center justify-center px-6">
      <Card className="max-w-sm w-full bg-wood-medium border-gold/20">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-gold/70 flex items-center justify-center shadow-lg shadow-gold/20">
              <Shield className="h-7 w-7 text-wood-dark" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-cream">WoodFloor Safe & Care</h1>
            <p className="text-gold text-sm font-semibold mt-1">{customer.name}</p>
          </div>
          <div className="space-y-3">
            <Link
              href="/customer"
              className="block w-full py-3 px-4 rounded-xl bg-gold text-wood-dark font-bold text-center hover:bg-gold/90 transition-colors"
            >
              Accedi alla Dashboard
            </Link>
            <Link
              href="/manutenzione"
              className="block w-full py-3 px-4 rounded-xl bg-wood-dark/50 border border-gold/30 text-cream font-medium text-center hover:bg-wood-dark/70 transition-colors"
            >
              Uso e Manutenzione
            </Link>
            <Link
              href="/sos"
              className="block w-full py-3 px-4 rounded-xl bg-cpr-red/10 border border-cpr-red/30 text-cpr-red font-medium text-center hover:bg-cpr-red/20 transition-colors"
            >
              SOS - Pronto Soccorso
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
