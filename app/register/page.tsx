"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"
import { RegistrationForm } from "@/components/registration/registration-form"
import { ArrowLeft, Menu } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bone">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Simple Header */}
        <header className="sticky top-0 z-30 bg-bone/95 backdrop-blur-sm border-b border-charcoal/5 px-6 md:px-8 lg:px-14 py-6">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 hover:opacity-70 transition-opacity"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5 text-charcoal" strokeWidth={1.25} />
            </button>
            <Link 
              href="/"
              className="flex items-center gap-2 text-sm font-light text-charcoal-light hover:text-charcoal transition-colors tracking-wide"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.25} />
              Torna alla Dashboard
            </Link>
          </div>
        </header>

        <main className="p-6 md:p-10 lg:p-14 xl:p-20">
          <RegistrationForm />
        </main>

        {/* Footer */}
        <footer className="px-6 py-12 text-center">
          <p className="text-[10px] text-charcoal-light/40 tracking-[0.15em]">
            Powered by WoodFloor Safe & Care
          </p>
        </footer>
      </div>
    </div>
  )
}
