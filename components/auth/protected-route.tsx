"use client"

import React from "react"

import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-champagne mx-auto mb-4" />
          <p className="text-charcoal-medium text-sm">Caricamento...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // The auth context will handle the redirect
  }

  return <>{children}</>
}
