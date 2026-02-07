"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

type UserRole = "dealer" | "customer"

interface User {
  username: string
  role: UserRole
  displayName: string
  shellyDeviceId?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isDealer: boolean
  isCustomer: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Utenti validi del sistema
const VALID_USERS: Record<string, { password: string; role: UserRole; displayName: string; shellyDeviceId?: string }> = {
  // Rivenditore
  "dealer": {
    password: "sts2026$",
    role: "dealer",
    displayName: "Rivenditore Autorizzato"
  },
  "admin": {
    password: "sts2026$",
    role: "dealer",
    displayName: "Amministratore"
  },
  // Cliente finale - Residenza Bianchi (con sensore Shelly reale)
  "bianchi": {
    password: "sts2026$",
    role: "customer",
    displayName: "Residenza Bianchi",
    shellyDeviceId: "e4b3232f9708"
  },
  // Altri clienti demo
  "cliente": {
    password: "sts2026$",
    role: "customer",
    displayName: "Cliente Demo",
    shellyDeviceId: "demo-device-001"
  }
}

// Pagine pubbliche (non richiedono login)
const PUBLIC_PATHS = ["/login", "/view", "/c", "/customer", "/manutenzione", "/sos", "/sos-protocols"]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check for existing session
    const storedUser = sessionStorage.getItem("woodfloor_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        sessionStorage.removeItem("woodfloor_user")
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Redirect to login if not authenticated and not on public page
    const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path))
    if (!isLoading && !user && !isPublicPath) {
      router.push("/login")
    }
  }, [user, isLoading, pathname, router])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const normalizedUsername = username.toLowerCase().trim()
    const userConfig = VALID_USERS[normalizedUsername]
    
    if (userConfig && userConfig.password === password) {
      const loggedInUser: User = {
        username: normalizedUsername,
        role: userConfig.role,
        displayName: userConfig.displayName,
        shellyDeviceId: userConfig.shellyDeviceId
      }
      setUser(loggedInUser)
      sessionStorage.setItem("woodfloor_user", JSON.stringify(loggedInUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem("woodfloor_user")
    router.push("/login")
  }

  const isDealer = user?.role === "dealer"
  const isCustomer = user?.role === "customer"

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      isDealer,
      isCustomer,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
