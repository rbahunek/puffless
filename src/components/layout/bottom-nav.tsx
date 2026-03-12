"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  History,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/program", label: "Program", icon: BookOpen },
  { href: "/izazov", label: "Izazovi", icon: Trophy },
  { href: "/povijest", label: "Povijest", icon: History },
  { href: "/profil", label: "Profil", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E7EB]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2 px-1 min-h-[56px] relative transition-colors duration-200",
                isActive ? "text-[#2EC4B6]" : "text-[#9CA3AF]"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#2EC4B6] rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              {/* Icon with animation */}
              <motion.div
                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={cn(
                  "w-6 h-6 flex items-center justify-center mb-0.5",
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    isActive ? "text-[#2EC4B6]" : "text-[#9CA3AF]"
                  )}
                  strokeWidth={isActive ? 2.5 : 1.75}
                />
              </motion.div>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] font-medium leading-none transition-all duration-200",
                  isActive ? "text-[#2EC4B6]" : "text-[#9CA3AF]"
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
