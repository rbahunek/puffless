"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Wind, Droplets, Footprints, PenLine, CheckCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CravingModalProps {
  open: boolean
  onClose: () => void
}

type Phase = "breathing" | "tips" | "resolved" | "still-hard"

export function CravingModal({ open, onClose }: CravingModalProps) {
  const [phase, setPhase] = useState<Phase>("breathing")
  const [breathePhase, setBreathePhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [countdown, setCountdown] = useState(180) // 3 minutes
  const [countdownActive, setCountdownActive] = useState(false)
  const [trigger, setTrigger] = useState("")
  const [saving, setSaving] = useState(false)

  const breatheLabels = {
    inhale: "Udahni...",
    hold: "Zadrži...",
    exhale: "Izdahni...",
  }

  // Breathing cycle
  useEffect(() => {
    if (!open || phase !== "breathing") return

    const cycle = [
      { phase: "inhale" as const, duration: 4000 },
      { phase: "hold" as const, duration: 4000 },
      { phase: "exhale" as const, duration: 4000 },
    ]

    let currentIndex = 0
    let timeout: NodeJS.Timeout

    const runCycle = () => {
      setBreathePhase(cycle[currentIndex].phase)
      timeout = setTimeout(() => {
        currentIndex = (currentIndex + 1) % cycle.length
        runCycle()
      }, cycle[currentIndex].duration)
    }

    runCycle()
    return () => clearTimeout(timeout)
  }, [open, phase])

  // Countdown timer
  useEffect(() => {
    if (!countdownActive) return
    if (countdown <= 0) {
      setCountdownActive(false)
      return
    }

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [countdownActive, countdown])

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const handleLogCraving = useCallback(async (resolved: boolean) => {
    setSaving(true)
    try {
      await fetch("/api/cravings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trigger: trigger || null,
          resolved,
          resolutionType: resolved ? "breathing" : "still_hard",
        }),
      })
    } catch (error) {
      console.error("Failed to log craving:", error)
    } finally {
      setSaving(false)
    }
  }, [trigger])

  const handleResolved = async () => {
    await handleLogCraving(true)
    setPhase("resolved")
  }

  const handleStillHard = async () => {
    await handleLogCraving(false)
    setPhase("still-hard")
  }

  const handleClose = () => {
    setPhase("breathing")
    setCountdown(180)
    setCountdownActive(false)
    setTrigger("")
    onClose()
  }

  const breatheScale = {
    inhale: 1.3,
    hold: 1.3,
    exhale: 1.0,
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-[#E5E7EB] transition-colors"
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </button>

            <AnimatePresence mode="wait">
              {phase === "breathing" && (
                <motion.div
                  key="breathing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8"
                >
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-[#fff4ed] text-[#FF8C42] rounded-full px-4 py-2 text-sm font-semibold mb-4">
                      <Wind className="w-4 h-4" />
                      Podrška pri žudnji
                    </div>
                    <h2 className="text-2xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                      Žudnja prolazi. 💙
                    </h2>
                    <p className="text-[#6B7280] text-sm">
                      Pričekaj 3 minute. Žudnja često prođe sama od sebe.
                    </p>
                  </div>

                  {/* Breathing circle */}
                  <div className="flex justify-center mb-8">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      {/* Outer ring */}
                      <motion.div
                        animate={{ scale: breatheScale[breathePhase] }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-[#2EC4B6]/20 to-[#4F7BFF]/20"
                      />
                      {/* Middle ring */}
                      <motion.div
                        animate={{ scale: breatheScale[breathePhase] * 0.85 }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                        className="absolute inset-4 rounded-full bg-gradient-to-br from-[#2EC4B6]/30 to-[#4F7BFF]/30"
                      />
                      {/* Inner circle */}
                      <motion.div
                        animate={{ scale: breatheScale[breathePhase] * 0.7 }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                        className="absolute inset-8 rounded-full bg-gradient-to-br from-[#2EC4B6] to-[#4F7BFF] flex items-center justify-center"
                      >
                        <span className="text-white text-xs font-semibold text-center px-1">
                          {breatheLabels[breathePhase]}
                        </span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="space-y-3 mb-6">
                    {[
                      { icon: Droplets, text: "Popij čašu hladne vode" },
                      { icon: Footprints, text: "Prošetaj 2 minute" },
                      { icon: PenLine, text: "Zapiši što te potaknulo" },
                    ].map((tip, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-[#F7FAFC] rounded-xl">
                        <div className="w-8 h-8 bg-[#e8faf9] rounded-lg flex items-center justify-center flex-shrink-0">
                          <tip.icon className="w-4 h-4 text-[#2EC4B6]" />
                        </div>
                        <span className="text-sm text-[#374151]">{tip.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Countdown */}
                  <div className="text-center mb-6">
                    {!countdownActive ? (
                      <Button
                        variant="outline"
                        onClick={() => setCountdownActive(true)}
                        className="w-full"
                      >
                        Pokreni 3-minutni izazov
                      </Button>
                    ) : (
                      <div className="bg-[#e8faf9] rounded-xl p-4">
                        <div className="text-3xl font-bold text-[#2EC4B6] mb-1">
                          {formatCountdown(countdown)}
                        </div>
                        <p className="text-sm text-[#6B7280]">
                          {countdown > 0 ? "Samo još malo..." : "Odlično! Izdržao/la si! 🎉"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="success"
                      onClick={handleResolved}
                      loading={saving}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Prošlo je!
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setPhase("tips")}
                    >
                      I dalje mi je teško
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {phase === "tips" && (
                <motion.div
                  key="tips"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8"
                >
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-3">💙</div>
                    <h2 className="text-xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                      Razumijemo. Ovo je teško.
                    </h2>
                    <p className="text-sm text-[#6B7280]">
                      Ovo je ovisnost, ne test savršenstva. Pokušaj ovo:
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    {[
                      {
                        emoji: "☕",
                        title: "Zamijeni kavu",
                        text: "Pokušaj čaj od mente ili toplu vodu s limunom umjesto kave.",
                      },
                      {
                        emoji: "🌍",
                        title: "Uzemljenje",
                        text: "Imenuj 5 stvari koje vidiš, 4 koje možeš dotaknuti, 3 koje čuješ.",
                      },
                      {
                        emoji: "💪",
                        title: "Motivacija",
                        text: "Jedna cigareta ne briše sve što si već postigao/la. Nastavi dalje!",
                      },
                    ].map((tip, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-[#F7FAFC] rounded-xl">
                        <span className="text-2xl flex-shrink-0">{tip.emoji}</span>
                        <div>
                          <div className="font-semibold text-[#1F2937] text-sm mb-1">{tip.title}</div>
                          <p className="text-xs text-[#6B7280]">{tip.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1.5">
                        Što te potaknulo? (opcionalno)
                      </label>
                      <input
                        type="text"
                        placeholder="npr. stres na poslu, kava s kolegama..."
                        value={trigger}
                        onChange={(e) => setTrigger(e.target.value)}
                        className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="success"
                        onClick={handleResolved}
                        loading={saving}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Prošlo je!
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleStillHard}
                        loading={saving}
                      >
                        Zabilježi okidač
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {phase === "resolved" && (
                <motion.div
                  key="resolved"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="text-6xl mb-4"
                  >
                    🎉
                  </motion.div>
                  <h2 className="text-2xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Bravo! Izdržao/la si!
                  </h2>
                  <p className="text-[#6B7280] mb-6">
                    Svaka prebrodena žudnja čini te jačim/om. Tvoje tijelo ti zahvaljuje!
                  </p>
                  <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-emerald-700 font-medium">
                      ✨ Napredak, ne savršenstvo. I dalje si na pravom putu.
                    </p>
                  </div>
                  <Button onClick={handleClose} className="w-full">
                    Nastavi dalje
                  </Button>
                </motion.div>
              )}

              {phase === "still-hard" && (
                <motion.div
                  key="still-hard"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 text-center"
                >
                  <div className="text-5xl mb-4">💙</div>
                  <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Hvala što si to zabilježio/la.
                  </h2>
                  <p className="text-[#6B7280] mb-6 text-sm">
                    Prepoznavanje okidača je važan korak. Svaki put kad to napraviš, postaje lakše.
                  </p>
                  <div className="bg-[#eef2ff] rounded-xl p-4 mb-6">
                    <p className="text-sm text-[#4F7BFF]">
                      💡 Ako si zapalio/la cigaretu, možeš je zabilježiti kao grace cigaretu. Jedna cigareta ne briše sav trud.
                    </p>
                  </div>
                  <Button onClick={handleClose} className="w-full">
                    Razumijem, nastavljam
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
