"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Menu, Bell, User } from "lucide-react"

interface CustomerHeaderProps {
  onMenuClick?: () => void
}

export function CustomerHeader({ onMenuClick }: CustomerHeaderProps) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 bg-wood-dark/95 backdrop-blur-sm border-b border-gold/15">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden text-cream/70 hover:text-cream hover:bg-white/10"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Title - Hidden on mobile */}
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold text-cream">Dashboard Cliente</h1>
          <p className="text-xs text-cream/50">Monitoraggio del tuo pavimento in legno</p>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon"
            className="relative text-cream/70 hover:text-cream hover:bg-white/10"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cpr-red rounded-full" />
          </Button>

          {/* User */}
          <div className="flex items-center gap-3 pl-3 border-l border-gold/15">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-cream">{user?.displayName || "Cliente"}</p>
              <p className="text-xs text-cream/50">Cliente Finale</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center">
              <User className="h-5 w-5 text-gold" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
