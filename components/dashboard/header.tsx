"use client"

import { Bell, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()
  
  return (
    <header className="sticky top-0 z-30 h-16 bg-wood-dark/95 backdrop-blur-sm border-b border-gold/15 px-6 flex items-center justify-between">
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="lg:hidden text-cream/70 hover:text-cream hover:bg-white/10" onClick={onMenuClick}>
        <Menu className="h-5 w-5" strokeWidth={2} />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Spacer for desktop */}
      <div className="hidden lg:block" />

      {/* Right side actions */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
          <Bell className="h-5 w-5 text-cream/70" strokeWidth={2} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-cpr-red border-2 border-wood-dark" />
          <span className="sr-only">Notifiche</span>
        </button>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
              <Avatar className="h-9 w-9 border-2 border-gold/30">
                <AvatarImage src="/professional-dealer.jpg" alt="Dealer" />
                <AvatarFallback className="bg-gold/20 text-gold font-bold text-sm">
                  {user?.displayName?.charAt(0) || "R"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-cream">{user?.displayName || "Rivenditore"}</p>
                <p className="text-[11px] text-cream/60 font-medium">Rivenditore Premium</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-wood-medium border-gold/20">
            <DropdownMenuItem className="text-sm font-medium text-cream hover:bg-white/5 cursor-pointer">Profilo</DropdownMenuItem>
            <DropdownMenuItem className="text-sm font-medium text-cream hover:bg-white/5 cursor-pointer">Fatturazione</DropdownMenuItem>
            <DropdownMenuItem className="text-sm font-medium text-cream hover:bg-white/5 cursor-pointer">Supporto</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gold/10" />
            <DropdownMenuItem 
              className="text-sm font-medium text-cream/60 hover:bg-white/5 cursor-pointer"
              onClick={logout}
            >
              Esci
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
