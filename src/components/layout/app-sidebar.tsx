"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Users,
  History,
  User,
  LogOut,
  X,
  Cigarette,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Nadzorna ploča", icon: LayoutDashboard },
  { href: "/program", label: "Program", icon: BookOpen },
  { href: "/izazov", label: "Izazov", icon: Trophy },
  { href: "/prijatelji", label: "Prijatelji", icon: Users },
  { href: "/povijest", label: "Povijest", icon: History },
  { href: "/profil", label: "Profil", icon: User },
]

interface SidebarContentProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  pathname: string
  onNavClick: () => void
}

function SidebarContent({ user, pathname, onNavClick }: SidebarContentProps) {
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.[0].toUpperCase() || "U"

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-[#E5E7EB]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2EC4B6] to-[#4F7BFF] flex items-center justify-center flex-shrink-0">
            <Cigarette className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[#1F2937]" style={{ fontFamily: "Poppins, sans-serif" }}>
            Puffless
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-[#2EC4B6]/10 to-[#4F7BFF]/10 text-[#2EC4B6] border border-[#2EC4B6]/20"
                  : "text-[#6B7280] hover:bg-[#F7FAFC] hover:text-[#1F2937]"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-[#2EC4B6]" : "text-[#9CA3AF]"
                )}
              />
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2EC4B6]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-[#E5E7EB]">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F7FAFC] mb-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2EC4B6] to-[#4F7BFF] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-[#1F2937] truncate">
              {user.name || "Korisnik"}
            </div>
            <div className="text-xs text-[#6B7280] truncate">{user.email}</div>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-[#6B7280] hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Odjava
        </button>
      </div>
    </div>
  )
}

interface AppSidebarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-[#E5E7EB] flex-col z-40">
        <SidebarContent user={user} pathname={pathname} onNavClick={() => {}} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white z-50 transform transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F7FAFC]"
        >
          <X className="w-5 h-5 text-[#374151]" />
        </button>
        <SidebarContent user={user} pathname={pathname} onNavClick={() => setMobileOpen(false)} />
      </aside>
    </>
  )
}
