"use client"

import { Sheet, SheetContent } from "@/components/ui/sheet"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, AlertTriangle, FileText, Settings, LogOut, ShieldCheck } from "lucide-react"

const navItems = [
  { href: "/", label: "Centro di Controllo", icon: LayoutDashboard },
  { href: "/catalog", label: "Catalogo Prodotti", icon: Package },
  { href: "/sos-protocols", label: "Protocolli SOS", icon: AlertTriangle },
  { href: "/cpr-documents", label: "Documenti CPR", icon: FileText },
  { href: "/settings", label: "Impostazioni", icon: Settings },
]

interface MobileSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0 bg-warm-surface border-charcoal/8">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-charcoal/8">
          <ShieldCheck className="w-7 h-7 text-champagne" strokeWidth={2} />
          <div className="flex flex-col">
            <h1 className="text-charcoal text-base font-bold tracking-tight">WoodFloor</h1>
            <p className="text-[10px] text-champagne font-semibold tracking-[0.15em] uppercase">Safe & Care</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "text-charcoal bg-charcoal/5 border-l-3 border-champagne" 
                    : "text-charcoal-medium hover:text-charcoal hover:bg-charcoal/[0.02]",
                )}
              >
                <item.icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.5} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-6 border-t border-charcoal/8">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-charcoal-light hover:text-charcoal hover:bg-charcoal/[0.02] transition-all duration-200 w-full">
            <LogOut className="h-5 w-5" strokeWidth={1.5} />
            Esci
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
