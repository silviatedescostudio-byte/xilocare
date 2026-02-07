"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldCheck, Lock, User, AlertCircle, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const success = await login(username, password)
    
    if (success) {
      router.push("/")
    } else {
      setError("Credenziali non valide. Riprova.")
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-wood-dark flex items-center justify-center p-4">
      {/* Decorative wood grain overlay */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZGVmcz48cGF0dGVybiBpZD0id29vZCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiPjxwYXRoIGQ9Ik0wIDBoMTAwdjEwMEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDI1aDEwME0wIDUwaDEwME0wIDc1aDEwMCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCN3b29kKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')]" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-wood-medium border-2 border-gold/30 mb-4 shadow-lg shadow-black/20">
            <ShieldCheck className="w-10 h-10 text-gold" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-bold text-cream tracking-tight">WoodFloor</h1>
          <p className="text-xs text-gold font-semibold tracking-[0.25em] uppercase mt-2">Safe & Care</p>
        </div>

        {/* Login Card */}
        <Card className="bg-wood-medium border-gold/20 shadow-2xl shadow-black/30">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl text-cream">Accesso Riservato</CardTitle>
            <CardDescription className="text-cream/70">
              Inserisci le tue credenziali per accedere al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-900/30 border-red-500/50 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-cream font-medium">
                  Nome Utente
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cream/50" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="dealer, bianchi, cliente"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-wood-light border-gold/20 text-cream placeholder:text-cream/40 focus:border-gold focus:ring-gold/30"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-cream font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cream/50" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Inserisci password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-wood-light border-gold/20 text-cream placeholder:text-cream/40 focus:border-gold focus:ring-gold/30"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gold hover:bg-gold-light text-wood-dark font-bold shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Accesso in corso...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Accedi
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-gold/10">
              <p className="text-xs text-center text-cream/60 leading-relaxed">
                <strong className="text-gold">Rivenditori:</strong> accedi con "dealer"
                <br />
                <strong className="text-gold">Clienti:</strong> accedi con "bianchi" o "cliente"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-cream/40 mt-6">
          WoodFloor Safe & Care - Sistema Protetto
        </p>
      </div>
    </div>
  )
}
