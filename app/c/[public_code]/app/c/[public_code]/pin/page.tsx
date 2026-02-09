"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent } from "@/components/ui/card"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function PinPage() {
  const params = useParams()
  const router = useRouter()
  const code = (params.public_code as string | undefined)?.toLowerCase()

  const [pin, setPin] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data } = await supabase
        .from("clienti")
        .select("pin")
        .eq("public_code", code ?? "")
        .maybeSingle()

      if (!data?.pin) return setError("Cliente non trovato.")
      if (String(data.pin).trim() !== pin.trim()) return setError("PIN errato.")

      sessionStorage.setItem("xilocare_public_code", code ?? "")
      router.push("/customer")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-wood-dark flex items-center justify-center px-6">
      <Card className="max-w-sm w-full bg-wood-medium border-gold/20">
        <CardContent className="p-8 space-y-4">
          <h1 className="text-xl font-bold text-cream text-center">Inserisci PIN</h1>

          <form onSubmit={onSubmit} className="space-y-3">
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN"
              className="w-full rounded-xl px-4 py-3 bg-wood-dark/50 border border-gold/30 text-cream outline-none"
            />
            {error && <div className="text-cpr-red text-sm">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gold text-wood-dark font-bold"
            >
              {loading ? "Verifico..." : "Continua"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
