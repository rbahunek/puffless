"use client"

import Link from "next/link"
import { Cigarette } from "lucide-react"

interface AppHeaderProps {
  user: {
    name?: string | null
    email?: string | null
  }
}

export function AppHeader({ user }: AppHeaderProps) {
  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Dobro jutro"
    if (hour < 18) return "Dobar dan"
    return "Dobra večer"
  }

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB] px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
      {/* Mobile: Logo */}
      <Link href="/dashboard" className="lg:hidden flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2EC4B6] to-[#4F7BFF] flex items-center justify-center flex-shrink-0">
          <Cigarette className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold text-[#1F2937]" style={{ fontFamily: "Poppins, sans-serif" }}>
          Puffless
        </span>
      </Link>

      {/* Desktop: Greeting */}
      <div className="hidden lg:block">
        <p className="text-sm text-[#6B7280]">
          {greeting()},{" "}
          <span className="font-semibold text-[#1F2937]">
            {user.name?.split(" ")[0] || "korisniče"}
          </span>{" "}
          👋
        </p>
      </div>

      {/* Right side - empty for now, can add notifications later */}
      <div className="flex items-center gap-2 ml-auto lg:ml-0">
        {/* Future: notification bell */}
      </div>
    </header>
  )
}
