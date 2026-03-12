"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Wind } from "lucide-react"
import { CravingModal } from "@/components/features/craving-modal"

export function FloatingActionButton() {
  const [showCravingModal, setShowCravingModal] = useState(false)

  return (
    <>
      {/* FAB - only visible on mobile */}
      <div
        className="lg:hidden fixed right-4 z-40"
        style={{
          bottom: `calc(72px + env(safe-area-inset-bottom) + 12px)`,
        }}
      >
        <motion.button
          onClick={() => setShowCravingModal(true)}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          className="relative flex items-center gap-2 bg-gradient-to-r from-[#FF8C42] to-[#FFD166] text-white font-semibold text-sm px-4 py-3.5 rounded-2xl shadow-lg"
          style={{
            boxShadow: "0 4px 20px rgba(255, 140, 66, 0.4)",
          }}
        >
          {/* Pulse ring animation */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FF8C42] to-[#FFD166]"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <Wind className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Imam želju</span>
        </motion.button>
      </div>

      {/* Craving Modal */}
      <CravingModal
        open={showCravingModal}
        onClose={() => setShowCravingModal(false)}
      />
    </>
  )
}
