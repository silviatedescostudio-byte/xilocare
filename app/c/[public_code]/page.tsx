"use client"

import { useParams } from "next/navigation"
import { Shield, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function PublicCustomerPage() {
  const params = useParams()
  const code = (params.public_code as string | undefined)?.toLowerCase()

  const [customer, setCustomer] = useState<{ nome: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from("clienti")
          .select("nome")
          .eq("public_code", code ?? "")
          .maybeSingle()

        if (error || !data) setCustomer(null)
        else setCustomer({ nome: data.nome })
      } finally {
        setLoading(false)
      }
    }

    if (code) load()
    else setLoading(false)
  }, [code])

  if (loading) {
    return (
      <div className="min-h-screen bg-wood-dark flex items-center justify-center px-6">
        <Card className="max-w-sm w-full bg-wood-medium border-gold/20">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-cream/70 text-sm">Caricamento...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

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
              Il codice <span className="font-mono text-gold">"{params.public_code as string}"</span> non corrisponde a nessun cliente registrato.
            </p>
            <p className="text-cream/40 text-xs">Verifica il link ricevuto dal tuo rivenditore.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

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
            <p className="text-gold text-sm font-semibold mt-1">{customer.nome}</p>
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
