"use client"

import { Bell } from "lucide-react"

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
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between lg:pl-8">
      <div className="lg:hidden w-10" /> {/* Spacer for mobile menu button */}
      <div className="hidden lg:block">
        <p className="text-sm text-[#6B7280]">
          {greeting()},{" "}
          <span className="font-semibold text-[#1F2937]">
            {user.name?.split(" ")[0] || "korisniče"}
          </span>{" "}
          👋
        </p>
      </div>
      <div className="flex items-center gap-3 ml-auto">
        <button className="w-9 h-9 rounded-xl bg-[#F7FAFC] border border-[#E5E7EB] flex items-center justify-center hover:bg-[#e8faf9] hover:border-[#2EC4B6] transition-all duration-200">
          <Bell className="w-4 h-4 text-[#6B7280]" />
        </button>
      </div>
    </header>
  )
}
