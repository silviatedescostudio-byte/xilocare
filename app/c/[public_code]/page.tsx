"use client"

import { useParams } from "next/navigation"
import { Shield, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function PublicCustomerPage() {
  const params = useParams()
  const code = (params.public_code as string)?.toLowerCase()

  const [customer, setCustomer] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const loadCustomer = async () => {
      if (!code) return

      const { data } = await supabase
        .from("clienti")
        .select("nome, shelly_id")
        .eq("public_code", code)
        .single()

      setCustomer(data)
      setLoading(false)
    }

    loadCustomer()
  }, [code])

  if (loading) return null

  // Invalid code
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
              Il codice <span className="font-mono text-gold">"{code}"</span> non corrisponde a nessun cliente registrato.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Valid code
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
              className="block w-full py-3 px-4 rounded-xl bg-gold text-wood-dark font-bold text-center"
            >
              Accedi alla Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
