"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { 
  Activity, 
  AlertTriangle, 
  BookOpen, 
  FileText, 
  LogOut, 
  ShieldCheck 
} from "lucide-react"

interface CustomerMobileSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Menu di Navigazione Semplificato (4 voci tassative)
const customerNavItems = [
  { 
    href: "/", 
    label: "Il mio Parquet", 
    icon: Activity,
    description: "Semaforo e dati live"
  },
  { 
    href: "/sos-protocols", 
    label: "SOS - Pronto Soccorso", 
    icon: AlertTriangle,
    description: "Protocolli di intervento"
  },
  { 
    href: "/manutenzione", 
    label: "Uso e Manutenzione", 
    icon: BookOpen,
    description: "Guida alla cura del pavimento"
  },
  { 
    href: "/cpr-documents", 
    label: "I miei Documenti", 
    icon: FileText,
    description: "File caricati per la tua fornitura"
  },
]

export function CustomerMobileSidebar({ open, onOpenChange }: CustomerMobileSidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0 bg-wood-dark border-r border-gold/15">
        <SheetHeader className="px-4 py-4 border-b border-gold/15">
          <SheetTitle className="flex items-center gap-3 text-left">
            <div className="p-2 rounded-lg bg-gold/10">
              <ShieldCheck className="w-6 h-6 text-gold" strokeWidth={2} />
            </div>
            <div>
              <span className="text-cream font-bold block">WoodFloor</span>
              <span className="text-[10px] text-gold font-semibold tracking-[0.15em] uppercase">Safe & Care</span>
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* User Info */}
        <div className="px-4 py-3 border-b border-gold/10">
          <div className="px-3 py-2 rounded-lg bg-wood-medium">
            <p className="text-xs text-cream/60">Benvenuto</p>
            <p className="text-sm font-semibold text-cream">{user?.displayName || "Cliente"}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1">
          {customerNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-start gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                  isActive 
                    ? "text-gold bg-gold/10" 
                    : "text-cream/70 hover:text-cream hover:bg-white/5",
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 mt-0.5 shrink-0",
                  isActive ? "text-gold" : "text-cream/50"
                )} strokeWidth={isActive ? 2 : 1.5} />
                <div>
                  <span className="font-medium block">{item.label}</span>
                  <span className="text-xs text-cream/50 block">{item.description}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-4 border-t border-gold/10">
          <button 
            onClick={() => {
              logout()
              onOpenChange(false)
            }}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-cream/50 hover:text-cream hover:bg-white/5 transition-all duration-200 w-full"
          >
            <LogOut className="h-5 w-5" strokeWidth={1.5} />
            Esci
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
