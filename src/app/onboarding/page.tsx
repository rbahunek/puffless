"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, CheckCircle, Users, User, Cigarette, Wind } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getConsumptionLabels, getOnboardingQuestions } from "@/lib/consumption-types"
import { ConsumptionType } from "@prisma/client"

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

const PROGRAMS = [
  {
    key: "TEN_DAY",
    name: "10-dnevni reset",
    days: 10,
    grace: 3,
    description: "Savršen početak. Strukturirani program s dnevnim zadacima.",
    color: "from-[#2EC4B6] to-[#4F7BFF]",
    recommended: true,
  },
  {
    key: "FOURTEEN_DAY",
    name: "14-dnevni izazov",
    days: 14,
    grace: 4,
    description: "Dva tjedna intenzivnog rada na novim navikama.",
    color: "from-[#4F7BFF] to-[#2EC4B6]",
    recommended: false,
  },
  {
    key: "THIRTY_DAY",
    name: "30-dnevni izazov",
    days: 30,
    grace: 6,
    description: "Cijeli mjesec transformacije za trajnu promjenu.",
    color: "from-[#FF8C42] to-[#FFD166]",
    recommended: false,
  },
]

interface OnboardingData {
  consumptionType: ConsumptionType
  displayName: string
  cigarettesPerDay: number
  cigarettesPerPack: number
  pricePerPack: number
  usagePerDay: number // for vapers
  estimatedDailyCost: number // for vapers
  quitDate: string
  programType: string
  isWithFriend: boolean
  triggers: string[]
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    consumptionType: "SMOKING",
    displayName: "",
    cigarettesPerDay: 20,
    cigarettesPerPack: 20,
    pricePerPack: 4.0,
    usagePerDay: 20, // for vapers
    estimatedDailyCost: 5.0, // for vapers
    quitDate: new Date().toISOString().split("T")[0],
    programType: "TEN_DAY",
    isWithFriend: false,
    triggers: [],
  })

  const consumptionLabels = getConsumptionLabels(data.consumptionType)
  const onboardingQuestions = getOnboardingQuestions(data.consumptionType)

  const steps = [
    { title: "Dobrodošao/la!", subtitle: "Što želiš pratiti?" },
    { title: "Recimo nam nešto o tebi", subtitle: "Tvoje osnovne informacije" },
    { title: "Tvoje navike", subtitle: "Ovo nam pomaže izračunati ušteđeni novac" },
    { title: "Odaberi program", subtitle: "Koji program ti odgovara?" },
    { title: "Tvoji okidači", subtitle: `Što te najčešće potiče na ${consumptionLabels.activityType.toLowerCase()}?` },
    { title: "Samostalno ili s prijateljem?", subtitle: "Zajedno je lakše!" },
  ]

  const totalSteps = steps.length

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const toggleTrigger = (key: string) => {
    setData((prev) => ({
      ...prev,
      triggers: prev.triggers.includes(key)
        ? prev.triggers.filter((t) => t !== key)
        : [...prev.triggers, key],
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push("/dashboard")
      } else {
        console.error("Onboarding failed")
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Onboarding error:", error)
      router.push("/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8faf9] via-[#F7FAFC] to-[#eef2ff] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2EC4B6] to-[#4F7BFF] flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <span className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "Poppins, sans-serif" }}>
            Puffless
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6B7280]">Korak {step + 1} od {totalSteps}</span>
            <span className="text-sm text-[#2EC4B6] font-medium">{Math.round(((step + 1) / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#2EC4B6] to-[#4F7BFF] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-[#E5E7EB] overflow-hidden">
          <AnimatePresence mode="wait" custom={1}>
            <motion.div
              key={step}
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="p-8"
            >
              {/* Step header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {steps[step].title}
                </h2>
                <p className="text-[#6B7280]">{steps[step].subtitle}</p>
              </div>

              {/* Step content */}
              {step === 0 && (
                <div className="space-y-6">
                  <div className="text-center py-4">
                    <div className="text-6xl mb-4">🌱</div>
                    <p className="text-[#374151] leading-relaxed mb-6">
                      Drago nam je što si ovdje. Puffless će ti pomoći pratiti napredak, uštedjeti novac i izgraditi zdravije navike — bez osjećaja krivnje.
                    </p>
                  </div>

                  {/* Consumption type selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-[#374151] mb-2">
                      Što želiš pratiti?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setData({ ...data, consumptionType: "SMOKING" })}
                        className={`
                          p-5 rounded-xl border-2 transition-all
                          ${data.consumptionType === "SMOKING"
                            ? "border-teal-500 bg-teal-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                          }
                        `}
                      >
                        <Cigarette className={`w-8 h-8 mx-auto mb-2 ${data.consumptionType === "SMOKING" ? "text-teal-600" : "text-slate-400"}`} />
                        <p className={`font-semibold text-sm ${data.consumptionType === "SMOKING" ? "text-teal-900" : "text-slate-700"}`}>
                          Pušenje
                        </p>
                      </button>
                      <button
                        onClick={() => setData({ ...data, consumptionType: "VAPING" })}
                        className={`
                          p-5 rounded-xl border-2 transition-all
                          ${data.consumptionType === "VAPING"
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                          }
                        `}
                      >
                        <Wind className={`w-8 h-8 mx-auto mb-2 ${data.consumptionType === "VAPING" ? "text-blue-600" : "text-slate-400"}`} />
                        <p className={`font-semibold text-sm ${data.consumptionType === "VAPING" ? "text-blue-900" : "text-slate-700"}`}>
                          Vaping
                        </p>
                      </button>
                    </div>
                  </div>

                  <Input
                    label="Kako te možemo zvati?"
                    type="text"
                    placeholder="Tvoje ime"
                    value={data.displayName}
                    onChange={(e) => setData({ ...data, displayName: e.target.value })}
                    hint="Ovo će se prikazivati u aplikaciji."
                  />
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  {data.consumptionType === "SMOKING" ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#374151] mb-1.5">
                            Cigareta dnevno
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={data.cigarettesPerDay}
                            onChange={(e) => setData({ ...data, cigarettesPerDay: parseInt(e.target.value) || 1 })}
                            className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#374151] mb-1.5">
                            Cigareta u kutiji
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={data.cigarettesPerPack}
                            onChange={(e) => setData({ ...data, cigarettesPerPack: parseInt(e.target.value) || 1 })}
                            className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#374151] mb-1.5">
                          Cijena kutije (€)
                        </label>
                        <input
                          type="number"
                          min="0.5"
                          max="50"
                          step="0.1"
                          value={data.pricePerPack}
                          onChange={(e) => setData({ ...data, pricePerPack: parseFloat(e.target.value) || 0.5 })}
                          className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent"
                        />
                      </div>

                      {/* Preview for smokers */}
                      <div className="bg-[#e8faf9] rounded-xl p-4">
                        <p className="text-sm text-[#2EC4B6] font-medium">
                          💰 Dnevno trošiš otprilike{" "}
                          <strong>
                            {((data.cigarettesPerDay / data.cigarettesPerPack) * data.pricePerPack).toFixed(2)} €
                          </strong>{" "}
                          na cigarete.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Vaping fields */}
                      <div>
                        <label className="block text-sm font-medium text-[#374151] mb-1.5">
                          {onboardingQuestions.usageQuestion}
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="200"
                          value={data.usagePerDay}
                          onChange={(e) => setData({ ...data, usagePerDay: parseInt(e.target.value) || 1 })}
                          className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent"
                        />
                        <p className="text-xs text-slate-500 mt-1">{onboardingQuestions.usageHint}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#374151] mb-1.5">
                          {onboardingQuestions.costQuestion}
                        </label>
                        <input
                          type="number"
                          min="0.5"
                          max="50"
                          step="0.5"
                          value={data.estimatedDailyCost}
                          onChange={(e) => setData({ ...data, estimatedDailyCost: parseFloat(e.target.value) || 0.5 })}
                          className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent"
                        />
                        <p className="text-xs text-slate-500 mt-1">{onboardingQuestions.costHint}</p>
                      </div>

                      {/* Preview for vapers */}
                      <div className="bg-[#e8faf9] rounded-xl p-4">
                        <p className="text-sm text-[#2EC4B6] font-medium">
                          💰 Dnevno trošiš otprilike{" "}
                          <strong>{data.estimatedDailyCost.toFixed(2)} €</strong> na vape.
                        </p>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">
                      Datum početka programa
                    </label>
                    <input
                      type="date"
                      value={data.quitDate}
                      onChange={(e) => setData({ ...data, quitDate: e.target.value })}
                      className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  {PROGRAMS.map((program) => (
                    <button
                      key={program.key}
                      onClick={() => setData({ ...data, programType: program.key })}
                      className={`w-full text-left rounded-2xl border-2 overflow-hidden transition-all duration-200 ${
                        data.programType === program.key
                          ? "border-[#2EC4B6] shadow-lg"
                          : "border-[#E5E7EB] hover:border-[#2EC4B6]/50"
                      }`}
                    >
                      <div className={`bg-gradient-to-r ${program.color} p-4 text-white`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold">{program.name}</div>
                            <div className="text-sm opacity-80">{program.days} dana · {program.grace} grace cigareta</div>
                          </div>
                          {program.recommended && (
                            <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs font-semibold">
                              Preporučeno
                            </span>
                          )}
                          {data.programType === program.key && (
                            <CheckCircle className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                      <div className="p-4 bg-white">
                        <p className="text-sm text-[#6B7280]">{program.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-sm text-[#6B7280]">
                    Odaberi sve okidače koji se odnose na tebe. Ovo nam pomaže personalizirati podršku.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {TRIGGERS.map((trigger) => (
                      <button
                        key={trigger.key}
                        onClick={() => toggleTrigger(trigger.key)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                          data.triggers.includes(trigger.key)
                            ? "border-[#2EC4B6] bg-[#e8faf9] text-[#2EC4B6]"
                            : "border-[#E5E7EB] hover:border-[#2EC4B6]/50 text-[#374151]"
                        }`}
                      >
                        <span className="text-xl">{trigger.emoji}</span>
                        <span className="text-sm font-medium">{trigger.label}</span>
                        {data.triggers.includes(trigger.key) && (
                          <CheckCircle className="w-4 h-4 ml-auto flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                  {data.triggers.length === 0 && (
                    <p className="text-xs text-[#9CA3AF] text-center">
                      Možeš preskočiti ovaj korak ako nisi siguran/a.
                    </p>
                  )}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <p className="text-sm text-[#6B7280] mb-6">
                    Istraživanja pokazuju da je lakše prestati pušiti uz podršku prijatelja ili partnera.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setData({ ...data, isWithFriend: false })}
                      className={`p-6 rounded-2xl border-2 text-center transition-all duration-200 ${
                        !data.isWithFriend
                          ? "border-[#2EC4B6] bg-[#e8faf9]"
                          : "border-[#E5E7EB] hover:border-[#2EC4B6]/50"
                      }`}
                    >
                      <User className={`w-8 h-8 mx-auto mb-3 ${!data.isWithFriend ? "text-[#2EC4B6]" : "text-[#9CA3AF]"}`} />
                      <div className={`font-semibold ${!data.isWithFriend ? "text-[#2EC4B6]" : "text-[#374151]"}`}>
                        Samostalno
                      </div>
                      <div className="text-xs text-[#6B7280] mt-1">Kreni sam/a</div>
                    </button>
                    <button
                      onClick={() => setData({ ...data, isWithFriend: true })}
                      className={`p-6 rounded-2xl border-2 text-center transition-all duration-200 ${
                        data.isWithFriend
                          ? "border-[#4F7BFF] bg-[#eef2ff]"
                          : "border-[#E5E7EB] hover:border-[#4F7BFF]/50"
                      }`}
                    >
                      <Users className={`w-8 h-8 mx-auto mb-3 ${data.isWithFriend ? "text-[#4F7BFF]" : "text-[#9CA3AF]"}`} />
                      <div className={`font-semibold ${data.isWithFriend ? "text-[#4F7BFF]" : "text-[#374151]"}`}>
                        S prijateljem
                      </div>
                      <div className="text-xs text-[#6B7280] mt-1">Pozovi nekoga</div>
                    </button>
                  </div>
                  {data.isWithFriend && (
                    <div className="bg-[#eef2ff] rounded-xl p-4">
                      <p className="text-sm text-[#4F7BFF]">
                        🎉 Odlično! Nakon postavljanja programa moći ćeš pozvati prijatelja putem linka.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="px-8 pb-8 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Natrag
            </Button>

            <Button
              onClick={handleNext}
              loading={isLoading}
              className="flex items-center gap-2"
            >
              {step === totalSteps - 1 ? "Kreni!" : "Dalje"}
              {step < totalSteps - 1 && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-6 bg-[#2EC4B6]"
                  : i < step
                  ? "w-2 bg-[#2EC4B6]/50"
                  : "w-2 bg-[#E5E7EB]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
