"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, Smartphone } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

// Check if running in standalone mode (already installed)
function checkIsInstalled(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(display-mode: standalone)").matches
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  // Initialize with lazy function to avoid SSR issues
  const [isInstalled] = useState(checkIsInstalled)

  useEffect(() => {
    if (isInstalled) return

    // Check if user dismissed before
    const dismissed = localStorage.getItem("pwa-install-dismissed")
    if (dismissed) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show prompt after a short delay
      const timer = setTimeout(() => setShowPrompt(true), 3000)
      return () => clearTimeout(timer)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [isInstalled])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setShowPrompt(false)
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("pwa-install-dismissed", "true")
  }

  if (isInstalled || !showPrompt) return null

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-24 left-4 right-4 z-50 lg:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-[#E5E7EB] p-4 flex items-start gap-3">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2EC4B6] to-[#4F7BFF] flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 h-6 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1F2937] mb-0.5">
                Instaliraj Puffless
              </p>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Instaliraj Puffless na početni zaslon za brži pristup.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleInstall}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-[#2EC4B6] to-[#4F7BFF] text-white text-xs font-semibold px-3 py-2 rounded-xl"
                >
                  <Download className="w-3.5 h-3.5" />
                  Instaliraj
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-xs text-[#6B7280] px-3 py-2 rounded-xl border border-[#E5E7EB]"
                >
                  Kasnije
                </button>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={handleDismiss}
              className="w-7 h-7 rounded-full bg-[#F3F4F6] flex items-center justify-center flex-shrink-0"
            >
              <X className="w-3.5 h-3.5 text-[#6B7280]" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
