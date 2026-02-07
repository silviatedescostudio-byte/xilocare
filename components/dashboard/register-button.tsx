"use client"

import Link from "next/link"
import { Plus } from "lucide-react"

export function RegisterButton() {
  return (
    <Link
      href="/register"
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-charcoal text-white text-sm font-bold rounded-lg hover:bg-charcoal-medium transition-colors shadow-sm"
    >
      <Plus className="h-4 w-4" strokeWidth={2.5} />
      Nuova Installazione
    </Link>
  )
}
