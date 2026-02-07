"use client"

import { useState, useEffect, useCallback, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Delete, X } from "lucide-react"

// Routes that bypass PIN protection entirely (public customer access)
const PUBLIC_ROUTES = ["/c", "/customer", "/manutenzione", "/sos", "/api/public/", "/api/customer/", "/api/shelly"]

/**
 * GLOBAL PIN PROTECTION WRAPPER
 * Protegge TUTTE le route dell'applicazione
 * PIN: 251619
 * Persistenza: 24 ore via localStorage
 * Deep linking supportato: resta sulla pagina corrente dopo autenticazione
 */

const AUTHORIZED_PIN = "251619"
const AUTH_STORAGE_KEY = "safecare_global_auth"
const AUTH_DURATION_MS = 24 * 60 * 60 * 1000 // 24 ore

interface PinProtectionProps {
  children: ReactNode
}

export function PinProtection({ children }: PinProtectionProps) {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [pinInput, setPinInput] = useState("")
  const [pinError, setPinError] = useState(false)
  const [shake, setShake] = useState(false)

  // Check if current route is public (bypass PIN)
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))

  // Check stored authentication on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
    if (storedAuth) {
      try {
        const { expiry } = JSON.parse(storedAuth)
        if (Date.now() < expiry) {
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY)
        }
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }
    setAuthChecked(true)
  }, [])

  // Handle keypad input
  const handleKeyPress = useCallback((key: string) => {
    if (key === "delete") {
      setPinInput(prev => prev.slice(0, -1))
      setPinError(false)
    } else if (key === "clear") {
      setPinInput("")
      setPinError(false)
    } else if (pinInput.length < 6) {
      const newPin = pinInput + key
      setPinInput(newPin)
      setPinError(false)
      
      // Auto-verify when 6 digits entered
      if (newPin.length === 6) {
        if (newPin === AUTHORIZED_PIN) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
            expiry: Date.now() + AUTH_DURATION_MS
          }))
          setIsAuthenticated(true)
        } else {
          setPinError(true)
          setShake(true)
          setTimeout(() => {
            setShake(false)
            setPinInput("")
          }, 500)
        }
      }
    }
  }, [pinInput])

  // Loading state while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-wood-dark flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  // Public routes bypass PIN entirely
  if (isPublicRoute) {
    return <>{children}</>
  }

  // If authenticated, render children (the actual app content)
  if (isAuthenticated) {
    return <>{children}</>
  }

  // PIN Entry Full-Screen Overlay
  return (
    <div className="min-h-screen bg-wood-dark relative overflow-hidden">
      {/* Blurred background preview - simulates app content behind */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-wood-dark via-wood-medium to-wood-dark" />
        <div className="absolute top-0 left-0 right-0 h-16 bg-wood-medium/30 border-b border-gold/10 blur-sm" />
        <div className="absolute top-24 left-4 right-4 h-32 bg-wood-medium/20 rounded-2xl blur-sm" />
        <div className="absolute top-64 left-4 right-4 h-24 bg-cpr-red/10 rounded-xl blur-sm" />
        <div className="absolute top-96 left-4 right-4 h-24 bg-gold/10 rounded-xl blur-sm" />
      </div>
      
      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-wood-dark/60" />
      
      {/* PIN Modal */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold to-gold/70 flex items-center justify-center shadow-xl shadow-gold/30">
            <Shield className="h-8 w-8 text-wood-dark" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-cream">WoodFloor</h1>
            <p className="text-sm text-gold font-semibold tracking-wide">Safe & Care</p>
          </div>
        </div>

        {/* PIN Card */}
        <Card className="w-full max-w-xs bg-wood-medium/95 border border-gold/30 shadow-2xl">
          <CardContent className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto border border-gold/20">
                <Lock className="h-7 w-7 text-gold" />
              </div>
              <h2 className="text-cream font-bold text-xl">Area Riservata</h2>
              <p className="text-cream/50 text-sm">Inserisci il PIN per accedere</p>
            </div>

            {/* PIN Display */}
            <div className={`flex justify-center gap-2 ${shake ? 'animate-shake' : ''}`}>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center transition-all ${
                    pinInput.length > index
                      ? pinError
                        ? 'bg-cpr-red/20 border-cpr-red'
                        : 'bg-gold/20 border-gold'
                      : 'bg-wood-dark/50 border-gold/20'
                  }`}
                >
                  {pinInput.length > index && (
                    <div className={`w-3 h-3 rounded-full ${pinError ? 'bg-cpr-red' : 'bg-gold'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Error Message */}
            {pinError && (
              <p className="text-cpr-red text-sm text-center font-medium">
                PIN errato. Riprova.
              </p>
            )}

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'delete'].map((key) => (
                <Button
                  key={key}
                  variant="outline"
                  onClick={() => handleKeyPress(key)}
                  className={`h-14 text-xl font-semibold transition-all active:scale-95 ${
                    key === 'clear'
                      ? 'bg-transparent border-cream/20 text-cream/50 hover:bg-cream/10 text-sm'
                      : key === 'delete'
                      ? 'bg-transparent border-gold/30 text-gold/70 hover:bg-gold/10'
                      : 'bg-wood-dark/50 border-gold/30 text-cream hover:bg-gold/20 hover:border-gold/50 active:bg-gold/30'
                  }`}
                >
                  {key === 'delete' ? (
                    <Delete className="h-5 w-5" />
                  ) : key === 'clear' ? (
                    <X className="h-5 w-5" />
                  ) : (
                    key
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-cream/30 text-xs mt-8 text-center">
          Accesso riservato ai clienti autorizzati
        </p>
      </div>

      {/* CSS for shake animation */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
