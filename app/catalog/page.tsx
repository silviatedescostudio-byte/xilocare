"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package } from "lucide-react"

export default function CatalogPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-warm-light">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <MobileSidebar />

        <div className="lg:pl-64">
          <Header />

          <main className="p-4 md:p-6 lg:p-8">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-charcoal">Catalogo Prodotti</h1>
              <p className="text-charcoal-medium mt-1">Esplora la gamma completa di pavimenti in legno</p>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-champagne/10 rounded-lg">
                    <Package className="h-6 w-6 text-champagne" />
                  </div>
                  <div>
                    <CardTitle>Prodotti Disponibili</CardTitle>
                    <CardDescription>Pavimenti in legno, accessori e prodotti per la manutenzione</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-charcoal-medium">
                  Questa sezione conterrà il catalogo completo dei prodotti disponibili, inclusi pavimenti in legno massello, 
                  prefiniti, laminati, prodotti per la pulizia e la manutenzione, accessori e ricambi.
                </p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
