"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { WifiOff } from "lucide-react"

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState<boolean | null>(null)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    // Set initial state via event listeners pattern
    handleOnline()
    if (!navigator.onLine) {
      handleOffline()
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <AnimatePresence>
      {isOffline === true && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-[#FF8C42] text-white px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <WifiOff className="w-4 h-4 flex-shrink-0" />
          <span>Nema internetske veze. Prikazujemo zadnje dostupne podatke.</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
