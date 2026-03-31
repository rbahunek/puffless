"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SurveyData {
  motivation: number
  difficulty: number
  previousAttempts: "never" | "1-2" | "many"
  hasSupport: "yes" | "partial" | "no"
  biggestTrigger: string
  successBelief: number
  strategy: "FULL_QUIT" | "MAJOR_REDUCTION" | "TRYING"
}

interface KodelabSurveyModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: SurveyData) => Promise<void>
}

export function KodelabSurveyModal({ open, onClose, onSubmit }: KodelabSurveyModalProps) {
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [data, setData] = useState<SurveyData>({
    motivation: 7,
    difficulty: 5,
    previousAttempts: "1-2",
    hasSupport: "partial",
    biggestTrigger: "STRESS",
    successBelief: 7,
    strategy: "FULL_QUIT",
  })

  const totalSteps = 7

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      onClose()
    } catch (error) {
      console.error("Survey submission failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const triggers = [
    { key: "STRESS", label: "Stres" },
    { key: "COFFEE", label: "Kava" },
    { key: "ALCOHOL", label: "Alkohol" },
    { key: "SOCIAL", label: "Društvo" },
    { key: "BOREDOM", label: "Dosada" },
    { key: "AFTER_MEAL", label: "Nakon obroka" },
    { key: "OTHER", label: "Drugo" },
  ]

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-6 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <h2 className="text-2xl font-bold mb-1">Prijava u izazov</h2>
              <p className="text-teal-100 text-sm">
                Pitanje {step + 1} od {totalSteps}
              </p>
              <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Survey Steps */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="font-semibold text-slate-900 mb-3">
                      Koliko si motiviran/a da izdržiš izazov?
                    </h3>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={data.motivation}
                        onChange={(e) => setData({ ...data, motivation: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Nimalo</span>
                        <span className="text-2xl font-bold text-teal-600">{data.motivation}</span>
                        <span>Ekstremno</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="font-semibold text-slate-900 mb-3">
                      Koliko ti je teško izdržati bez nikotina?
                    </h3>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={data.difficulty}
                        onChange={(e) => setData({ ...data, difficulty: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Lako</span>
                        <span className="text-2xl font-bold text-teal-600">{data.difficulty}</span>
                        <span>Jako teško</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <h3 className="font-semibold text-slate-900 mb-3">
                      Koliko često si već pokušao/la prestati?
                    </h3>
                    {[
                      { key: "never", label: "Nikad" },
                      { key: "1-2", label: "1-2 puta" },
                      { key: "many", label: "Više puta" },
                    ].map((option) => (
                      <button
                        key={option.key}
                        onClick={() => setData({ ...data, previousAttempts: option.key as any })}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          data.previousAttempts === option.key
                            ? "border-teal-500 bg-teal-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <p className={`font-medium ${data.previousAttempts === option.key ? "text-teal-900" : "text-slate-700"}`}>
                          {option.label}
                        </p>
                      </button>
                    ))}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <h3 className="font-semibold text-slate-900 mb-3">
                      Imaš li podršku okoline?
                    </h3>
                    {[
                      { key: "yes", label: "Da", desc: "Obitelj i prijatelji me podržavaju" },
                      { key: "partial", label: "Djelomično", desc: "Neka podrška, ali ne puno" },
                      { key: "no", label: "Ne", desc: "Radim ovo sam/a" },
                    ].map((option) => (
                      <button
                        key={option.key}
                        onClick={() => setData({ ...data, hasSupport: option.key as any })}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          data.hasSupport === option.key
                            ? "border-teal-500 bg-teal-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <p className={`font-medium mb-1 ${data.hasSupport === option.key ? "text-teal-900" : "text-slate-700"}`}>
                          {option.label}
                        </p>
                        <p className="text-xs text-slate-500">{option.desc}</p>
                      </button>
                    ))}
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <h3 className="font-semibold text-slate-900 mb-3">
                      Koji ti je najveći okidač?
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {triggers.map((trigger) => (
                        <button
                          key={trigger.key}
                          onClick={() => setData({ ...data, biggestTrigger: trigger.key })}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            data.biggestTrigger === trigger.key
                              ? "border-teal-500 bg-teal-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <p className={`text-sm font-medium ${data.biggestTrigger === trigger.key ? "text-teal-900" : "text-slate-700"}`}>
                            {trigger.label}
                          </p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="font-semibold text-slate-900 mb-3">
                      Koliko vjeruješ da ćeš uspjeti završiti izazov?
                    </h3>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={data.successBelief}
                        onChange={(e) => setData({ ...data, successBelief: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Nimalo</span>
                        <span className="text-2xl font-bold text-teal-600">{data.successBelief}</span>
                        <span>Potpuno</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 6 && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <h3 className="font-semibold text-slate-900 mb-3">
                      Odaberi svoju strategiju:
                    </h3>
                    {[
                      { key: "FULL_QUIT", label: "Potpuno bez nikotina", desc: "Ciljam na 0 cigareta/vape" },
                      { key: "MAJOR_REDUCTION", label: "Veliko smanjenje", desc: "Cilj je dramatično smanjiti" },
                      { key: "TRYING", label: "Pokušavam", desc: "Još nisam siguran/na, ali želim pokušati" },
                    ].map((option) => (
                      <button
                        key={option.key}
                        onClick={() => setData({ ...data, strategy: option.key as any })}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          data.strategy === option.key
                            ? "border-teal-500 bg-teal-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <p className={`font-medium mb-1 ${data.strategy === option.key ? "text-teal-900" : "text-slate-700"}`}>
                          {option.label}
                        </p>
                        <p className="text-xs text-slate-500">{option.desc}</p>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex gap-3 mt-6">
                {step > 0 && (
                  <Button
                    variant="secondary"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Natrag
                  </Button>
                )}
                {step < totalSteps - 1 ? (
                  <Button onClick={handleNext} className="flex-1">
                    Dalje
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    className="flex-1"
                  >
                    Potvrdi prijavu
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
