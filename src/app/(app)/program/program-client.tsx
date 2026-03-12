"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Lock, BookOpen, MessageCircle, Lightbulb, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProgramName } from "@/lib/utils"
import type { ProgramDay } from "@/lib/program-data"
import { useRouter } from "next/navigation"

interface ProgramClientProps {
  program: {
    id: string
    type: string
    status: string
    startDate: string
    graceUsed: number
    graceLimit: number
    currentDay: number
  } | null
  programDays: ProgramDay[]
  completedDays: number[]
  currentDay: number
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export function ProgramClient({ program, programDays, completedDays, currentDay }: ProgramClientProps) {
  const router = useRouter()
  const [expandedDay, setExpandedDay] = useState<number | null>(currentDay)
  const [completingDay, setCompletingDay] = useState<number | null>(null)
  const [reflection, setReflection] = useState("")

  const handleCompleteDay = async (day: number) => {
    setCompletingDay(day)
    try {
      await fetch("/api/program/complete-day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day, reflection }),
      })
      router.refresh()
    } catch (error) {
      console.error("Failed to complete day:", error)
    } finally {
      setCompletingDay(null)
      setReflection("")
    }
  }

  const getDayStatus = (day: number): "completed" | "current" | "locked" => {
    if (completedDays.includes(day)) return "completed"
    if (day === currentDay) return "current"
    if (day < currentDay) return "current" // Allow access to past days
    return "locked"
  }

  if (!program) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="text-6xl mb-6">📚</div>
        <h2 className="text-2xl font-bold text-[#1F2937] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
          Nemaš aktivan program
        </h2>
        <p className="text-[#6B7280] mb-8">
          Postavi program u postavkama profila ili se vrati na onboarding.
        </p>
        <Button onClick={() => router.push("/onboarding")}>
          Postavi program
        </Button>
      </div>
    )
  }

  const programDuration = program.type === "TEN_DAY" ? 10 : program.type === "FOURTEEN_DAY" ? 14 : 30
  const progressPercent = Math.round((completedDays.length / programDuration) * 100)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-3xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "Poppins, sans-serif" }}>
              {getProgramName(program.type)}
            </h1>
            <p className="text-[#6B7280] mt-1">
              Dan {currentDay} od {programDuration} · {completedDays.length} zadataka završeno
            </p>
          </div>
          <Badge variant={program.status === "ACTIVE" ? "success" : "warning"}>
            {program.status === "ACTIVE" ? "Aktivan" : "Potreban fokus"}
          </Badge>
        </div>
      </motion.div>

      {/* Progress overview */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[#374151]">Ukupni napredak</span>
              <span className="text-sm font-bold text-[#2EC4B6]">{progressPercent}%</span>
            </div>
            <div className="h-3 bg-[#F3F4F6] rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#2EC4B6] to-[#4F7BFF] rounded-full"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: programDuration }).map((_, i) => {
                const day = i + 1
                const status = getDayStatus(day)
                return (
                  <div
                    key={day}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                      status === "completed"
                        ? "bg-[#2EC4B6] text-white"
                        : status === "current"
                        ? "bg-[#4F7BFF] text-white ring-2 ring-[#4F7BFF] ring-offset-2"
                        : "bg-[#F3F4F6] text-[#9CA3AF]"
                    }`}
                  >
                    {status === "completed" ? "✓" : day}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Program days */}
      <div className="space-y-3">
        {programDays.map((dayData) => {
          const status = getDayStatus(dayData.day)
          const isExpanded = expandedDay === dayData.day
          const isCompleted = status === "completed"
          const isCurrent = dayData.day === currentDay
          const isLocked = status === "locked"

          return (
            <motion.div key={dayData.day} variants={itemVariants}>
              <Card
                className={`overflow-hidden transition-all duration-200 ${
                  isLocked ? "opacity-60" : ""
                } ${isCurrent ? "ring-2 ring-[#4F7BFF] ring-offset-2" : ""}`}
              >
                {/* Day header */}
                <button
                  className="w-full text-left"
                  onClick={() => !isLocked && setExpandedDay(isExpanded ? null : dayData.day)}
                  disabled={isLocked}
                >
                  <div className="flex items-center gap-4 p-5">
                    {/* Day number / status icon */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${
                        isCompleted
                          ? "bg-[#2EC4B6] text-white"
                          : isCurrent
                          ? "bg-[#4F7BFF] text-white"
                          : isLocked
                          ? "bg-[#F3F4F6] text-[#9CA3AF]"
                          : "bg-[#e8faf9] text-[#2EC4B6]"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        dayData.icon
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-[#9CA3AF]">Dan {dayData.day}</span>
                        {isCurrent && (
                          <Badge variant="secondary" className="text-xs py-0">Danas</Badge>
                        )}
                        {isCompleted && (
                          <Badge variant="success" className="text-xs py-0">Završeno</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-[#1F2937] mt-0.5">{dayData.title}</h3>
                    </div>

                    {!isLocked && (
                      <div className="flex-shrink-0 text-[#9CA3AF]">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    )}
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && !isLocked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 space-y-4 border-t border-[#F3F4F6] pt-4">
                      {/* Task */}
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-[#eef2ff] rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-4 h-4 text-[#4F7BFF]" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#4F7BFF] uppercase tracking-wide mb-1">Zadatak</div>
                          <p className="text-sm text-[#374151]">{dayData.task}</p>
                        </div>
                      </div>

                      {/* Question */}
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-[#fff4ed] rounded-lg flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-4 h-4 text-[#FF8C42]" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#FF8C42] uppercase tracking-wide mb-1">Pitanje za razmišljanje</div>
                          <p className="text-sm text-[#374151] italic">&ldquo;{dayData.question}&rdquo;</p>
                        </div>
                      </div>

                      {/* Note */}
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-[#e8faf9] rounded-lg flex items-center justify-center flex-shrink-0">
                          <Lightbulb className="w-4 h-4 text-[#2EC4B6]" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#2EC4B6] uppercase tracking-wide mb-1">Motivacija</div>
                          <p className="text-sm text-[#374151]">{dayData.note}</p>
                        </div>
                      </div>

                      {/* Reflection & Complete */}
                      {!isCompleted && (
                        <div className="pt-2 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-[#374151] mb-1.5">
                              Tvoja refleksija (opcionalno)
                            </label>
                            <textarea
                              value={reflection}
                              onChange={(e) => setReflection(e.target.value)}
                              placeholder="Što si naučio/la danas?"
                              rows={2}
                              className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] resize-none"
                            />
                          </div>
                          <Button
                            onClick={() => handleCompleteDay(dayData.day)}
                            loading={completingDay === dayData.day}
                            variant="success"
                            className="w-full"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Označi dan kao završen
                          </Button>
                        </div>
                      )}

                      {isCompleted && (
                        <div className="bg-emerald-50 rounded-xl p-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <p className="text-sm text-emerald-700 font-medium">
                            Odlično! Ovaj dan si uspješno završio/la.
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
