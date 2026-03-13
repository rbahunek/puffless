"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const TRIGGERS = [
  { key: "STRESS", label: "Stres", emoji: "😤" },
  { key: "COFFEE", label: "Kava", emoji: "☕" },
  { key: "ALCOHOL", label: "Alkohol", emoji: "🍺" },
  { key: "SOCIAL", label: "Društvo", emoji: "👥" },
  { key: "BOREDOM", label: "Dosada", emoji: "😴" },
  { key: "AFTER_MEAL", label: "Nakon obroka", emoji: "🍽️" },
  { key: "DRIVING", label: "Vožnja", emoji: "🚗" },
  { key: "OTHER", label: "Ostalo", emoji: "💭" },
]

interface LogCigaretteModalProps {
  open: boolean
  onClose: () => void
  graceUsed?: number
  graceLimit?: number
  itemLabel?: string // "cigaretu" or "vape"
}

export function LogCigaretteModal({ open, onClose, graceUsed = 0, graceLimit = 3, itemLabel = "cigaretu" }: LogCigaretteModalProps) {
  const router = useRouter()
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [message, setMessage] = useState("")

  const remaining = graceLimit - graceUsed

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/cigarettes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trigger: selectedTrigger,
          note: note || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message || "Zabilježeno.")
        setSaved(true)
        router.refresh()
      } else {
        setMessage(data.error || "Došlo je do pogreške.")
      }
    } catch {
      setMessage("Došlo je do pogreške. Pokušaj ponovno.")
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setSelectedTrigger(null)
    setNote("")
    setSaved(false)
    setMessage("")
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-[#E5E7EB] transition-colors"
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </button>

            <AnimatePresence mode="wait">
              {!saved ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8"
                >
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                      Zabilježi {itemLabel}
                    </h2>
                    <p className="text-sm text-[#6B7280]">
                      Jedno posrtanje ne briše sav trud. Nastavi dalje.
                    </p>
                  </div>

                  {/* Grace status */}
                  <div className={`rounded-xl p-4 mb-6 ${
                    remaining > 1
                      ? "bg-amber-50 border border-amber-200"
                      : remaining === 1
                      ? "bg-orange-50 border border-orange-200"
                      : "bg-red-50 border border-red-200"
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex gap-1.5">
                        {Array.from({ length: graceLimit }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
                              i < graceUsed
                                ? "bg-[#FF8C42] border-[#FF8C42] text-white"
                                : "border-[#E5E7EB] text-[#9CA3AF]"
                            }`}
                          >
                            {i < graceUsed ? "✓" : "○"}
                          </div>
                        ))}
                      </div>
                      <span className={`text-sm font-medium ${
                        remaining > 1 ? "text-amber-700" : remaining === 1 ? "text-orange-700" : "text-red-700"
                      }`}>
                        {graceUsed}/{graceLimit} grace cigareta
                      </span>
                    </div>
                    <p className={`text-xs ${
                      remaining > 1 ? "text-amber-600" : remaining === 1 ? "text-orange-600" : "text-red-600"
                    }`}>
                      {remaining > 1
                        ? `Imaš još ${remaining} grace cigareta. I dalje si na pravom putu!`
                        : remaining === 1
                        ? "Pazi — ostala ti je samo 1 grace cigareta."
                        : "Iskoristio/la si sve grace cigarete. Program je uzdrman, ali nije kraj."}
                    </p>
                  </div>

                  {/* Trigger selection */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-[#374151] mb-3">
                      Što te potaknulo? (opcionalno)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {TRIGGERS.map((trigger) => (
                        <button
                          key={trigger.key}
                          onClick={() => setSelectedTrigger(
                            selectedTrigger === trigger.key ? null : trigger.key
                          )}
                          className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all duration-200 ${
                            selectedTrigger === trigger.key
                              ? "border-[#FF8C42] bg-[#fff4ed]"
                              : "border-[#E5E7EB] hover:border-[#FF8C42]/50"
                          }`}
                        >
                          <span className="text-lg">{trigger.emoji}</span>
                          <span className="text-xs text-[#374151] text-center leading-tight">{trigger.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Note */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">
                      Bilješka (opcionalno)
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Što se događalo u tom trenutku?"
                      rows={2}
                      className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] resize-none"
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    loading={saving}
                    variant="warning"
                    className="w-full"
                  >
                    Zabilježi {itemLabel}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="text-5xl mb-4"
                  >
                    💙
                  </motion.div>
                  <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Zabilježeno.
                  </h2>
                  <p className="text-[#6B7280] mb-4 text-sm">{message}</p>
                  <div className="bg-[#e8faf9] rounded-xl p-4 mb-6">
                    <p className="text-sm text-[#2EC4B6] font-medium">
                      ✨ Napredak, ne savršenstvo. Nastavi dalje!
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="secondary" onClick={handleClose}>
                      Zatvori
                    </Button>
                    <Button onClick={() => window.location.href = "/program"}>
                      <CheckCircle className="w-4 h-4" />
                      Pogledaj program
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
