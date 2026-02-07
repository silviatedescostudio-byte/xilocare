"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { LayoutDashboard, Package, AlertTriangle, FileText, Settings, LogOut, ShieldCheck, LifeBuoy, Users } from "lucide-react"

const navItems = [
  { href: "/", label: "Centro di Controllo", icon: LayoutDashboard },
  { href: "/dealer", label: "Gestione Clienti", icon: Users },
  { href: "/catalog", label: "Catalogo Prodotti", icon: Package },
  { href: "/manutenzione", label: "Uso e Manutenzione", icon: LifeBuoy },
  { href: "/sos-protocols", label: "SOS - Pronto Soccorso", icon: AlertTriangle },
  { href: "/cpr-documents", label: "Documenti CPR", icon: FileText },
  { href: "/settings", label: "Impostazioni", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-wood-dark border-r border-gold/15 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gold/15">
        <div className="p-2 rounded-lg bg-gold/10">
          <ShieldCheck className="w-7 h-7 text-gold" strokeWidth={2} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-cream text-base font-bold tracking-tight">WoodFloor</h1>
          <p className="text-[10px] text-gold font-semibold tracking-[0.15em] uppercase">Safe & Care</p>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-gold/10">
        <div className="px-3 py-3 rounded-lg bg-wood-medium">
          <p className="text-xs text-cream/60 mb-1">Area Rivenditore</p>
          <p className="text-sm font-semibold text-cream">{user?.displayName || "Rivenditore"}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "text-gold bg-gold/10 border-l-3 border-gold" 
                  : "text-cream/70 hover:text-cream hover:bg-white/5",
              )}
            >
              <item.icon className={cn(
                "h-5 w-5",
                isActive ? "text-gold" : "text-cream/50"
              )} strokeWidth={isActive ? 2 : 1.5} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gold/10">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-cream/50 hover:text-cream hover:bg-white/5 transition-all duration-200 w-full"
        >
          <LogOut className="h-5 w-5" strokeWidth={1.5} />
          Esci
        </button>
      </div>
    </aside>
  )
}
