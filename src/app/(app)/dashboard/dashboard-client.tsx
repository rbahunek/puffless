"use client"

import { useState } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import {
  Euro,
  Cigarette,
  Heart,
  Zap,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CravingModal } from "@/components/features/craving-modal"
import { LogCigaretteModal } from "@/components/features/log-cigarette-modal"
import { formatCurrency, getMoneyEquivalent, getProgramName, getTriggerLabel } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { hr } from "date-fns/locale"

interface DashboardClientProps {
  user: { name?: string | null; email?: string | null }
  profile: {
    displayName?: string | null
    cigarettesPerDay: number
    cigarettesPerPack: number
    pricePerPack: number
    quitDate: string
    triggers: string[]
  }
  program: {
    id: string
    type: string
    status: string
    startDate: string
    graceUsed: number
    graceLimit: number
    currentDay: number
    isWithFriend: boolean
  } | null
  stats: {
    daysSinceQuit: number
    moneySaved: number
    moneySavedDaily: number
    cigarettesAvoided: number
    achievedMilestones: number
    totalMilestones: number
  }
  nextMilestone: {
    title: string
    description: string
    icon: string
    minutesRemaining: number
  } | null
  achievedMilestones: Array<{
    key: string
    title: string
    description: string
    icon: string
  }>
  dailyMotivation: string
  recentLogs: {
    cigarettes: Array<{
      id: string
      trigger: string | null
      loggedAt: string
      isGrace: boolean
    }>
    cravings: Array<{
      id: string
      trigger: string | null
      resolved: boolean
      loggedAt: string
    }>
  }
  todayProgress: {
    cigarettesSmoked: number
    cravingsLogged: number
    cravingsResolved: number
    taskCompleted: boolean
  } | null
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export function DashboardClient({
  user,
  profile,
  program,
  stats,
  nextMilestone,
  achievedMilestones,
  dailyMotivation,
  recentLogs,
  todayProgress,
}: DashboardClientProps) {
  const [showCravingModal, setShowCravingModal] = useState(false)
  const [showLogModal, setShowLogModal] = useState(false)
  const [healthExpanded, setHealthExpanded] = useState(false)

  const displayName = profile.displayName || user.name?.split(" ")[0] || "korisniče"
  const programProgress = program
    ? (program.currentDay / (program.type === "TEN_DAY" ? 10 : program.type === "FOURTEEN_DAY" ? 14 : 30)) * 100
    : 0

  const graceDotsArray = program
    ? Array.from({ length: program.graceLimit }, (_, i) => i < program.graceUsed)
    : []

  const formatMinutesRemaining = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`
    if (minutes < 1440) return `${Math.floor(minutes / 60)} h`
    return `${Math.floor(minutes / 1440)} dana`
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 lg:space-y-6"
      >
        {/* Page header - mobile optimized */}
        <motion.div variants={cardVariants}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1F2937] truncate" style={{ fontFamily: "Poppins, sans-serif" }}>
                Zdravo, {displayName}! 👋
              </h1>
              <p className="text-sm text-[#6B7280] mt-0.5 leading-snug">{dailyMotivation}</p>
            </div>
            {program && (
              <Badge variant={program.status === "ACTIVE" ? "default" : "warning"} className="flex-shrink-0 text-xs">
                {program.status === "ACTIVE" ? "Aktivan" : "Fokus"}
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Quick actions - mobile: 2 cols, desktop: 3 cols */}
        <motion.div variants={cardVariants}>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            <Button
              onClick={() => setShowCravingModal(true)}
              variant="warning"
              className="h-12 sm:h-14 text-sm sm:text-base font-semibold col-span-2 lg:col-span-1"
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              Imam želju za cigaretom
            </Button>
            <Button
              onClick={() => setShowLogModal(true)}
              variant="secondary"
              className="h-12 sm:h-14 text-sm sm:text-base font-semibold"
            >
              <Cigarette className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Zabilježi cigaretu</span>
              <span className="sm:hidden">Cigareta</span>
            </Button>
            <Button
              variant="outline"
              className="h-12 sm:h-14 text-sm sm:text-base font-semibold"
              onClick={() => window.location.href = "/program"}
            >
              <Target className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Današnji zadatak</span>
              <span className="sm:hidden">Zadatak</span>
            </Button>
          </div>
        </motion.div>

        {/* Main stats grid - mobile: 2x2, desktop: 4 cols */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {/* Days counter - hero card */}
          <motion.div variants={cardVariants} className="col-span-2 lg:col-span-1">
            <Card className="bg-gradient-to-br from-[#2EC4B6] to-[#4F7BFF] border-0 text-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="text-xs sm:text-sm font-medium opacity-80">Dana u programu</div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
                <div className="text-5xl sm:text-6xl font-bold mb-1 stat-number">{stats.daysSinceQuit}</div>
                <div className="text-xs sm:text-sm opacity-80">
                  {stats.daysSinceQuit === 0
                    ? "Danas počinješ! 🌱"
                    : stats.daysSinceQuit === 1
                    ? "Odličan početak! 🎉"
                    : `${stats.daysSinceQuit} dana napretka! 💪`}
                </div>
                {program && (
                  <div className="mt-3 sm:mt-4">
                    <div className="flex justify-between text-xs opacity-70 mb-1">
                      <span>Dan {program.currentDay}</span>
                      <span>{program.type === "TEN_DAY" ? "10" : program.type === "FOURTEEN_DAY" ? "14" : "30"} dana</span>
                    </div>
                    <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-1000"
                        style={{ width: `${programProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Money saved */}
          <motion.div variants={cardVariants}>
            <Card className="h-full">
              <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="text-xs sm:text-sm font-medium text-[#6B7280]">Ušteđeno</div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#fff8e6] rounded-lg flex items-center justify-center">
                    <Euro className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFD166]" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[#1F2937] mb-1 stat-number">
                  {formatCurrency(stats.moneySaved)}
                </div>
                <div className="text-xs sm:text-sm text-[#2EC4B6] font-medium">
                  {getMoneyEquivalent(stats.moneySaved)} 🎉
                </div>
                <div className="mt-auto pt-2 text-xs text-[#9CA3AF]">
                  +{formatCurrency(stats.moneySavedDaily)}/dan
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Cigarettes avoided */}
          <motion.div variants={cardVariants}>
            <Card className="h-full">
              <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="text-xs sm:text-sm font-medium text-[#6B7280]">Preskočeno</div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#eef2ff] rounded-lg flex items-center justify-center">
                    <Cigarette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4F7BFF]" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[#1F2937] mb-1 stat-number">
                  {stats.cigarettesAvoided}
                </div>
                <div className="text-xs sm:text-sm text-[#6B7280]">
                  cigareta
                </div>
                <div className="mt-auto pt-2 text-xs text-[#9CA3AF]">
                  Pluća ti hvale! 🫁
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Health milestones */}
          <motion.div variants={cardVariants}>
            <Card className="h-full">
              <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="text-xs sm:text-sm font-medium text-[#6B7280]">Zdravlje</div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[#1F2937] mb-1 stat-number">
                  {stats.achievedMilestones}/{stats.totalMilestones}
                </div>
                <div className="text-xs sm:text-sm text-[#6B7280]">
                  prekretnica
                </div>
                {nextMilestone && (
                  <div className="mt-auto pt-2 text-xs text-emerald-600 leading-snug">
                    Sljedeća za {formatMinutesRemaining(nextMilestone.minutesRemaining)}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Today's summary - mobile optimized */}
        {todayProgress && (
          <motion.div variants={cardVariants}>
            <Card className="bg-gradient-to-r from-[#e8faf9] to-[#eef2ff] border-[#2EC4B6]/20">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold text-[#1F2937] mb-3 text-sm sm:text-base">Danas</h3>
                <div className="grid grid-cols-4 gap-2 sm:gap-4">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-[#1F2937] stat-number">{todayProgress.cigarettesSmoked}</div>
                    <div className="text-[10px] sm:text-xs text-[#6B7280] leading-tight">cigareta</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-[#1F2937] stat-number">{todayProgress.cravingsLogged}</div>
                    <div className="text-[10px] sm:text-xs text-[#6B7280] leading-tight">žudnji</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-[#1F2937] stat-number">{todayProgress.cravingsResolved}</div>
                    <div className="text-[10px] sm:text-xs text-[#6B7280] leading-tight">riješeno</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-[#1F2937]">
                      {todayProgress.taskCompleted ? "✓" : "—"}
                    </div>
                    <div className="text-[10px] sm:text-xs text-[#6B7280] leading-tight">zadatak</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Grace cigarettes & Program status */}
        {program && (
          <motion.div variants={cardVariants}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
              {/* Grace cigarettes */}
              <Card>
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF8C42]" />
                    Grace cigarete
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex gap-1.5 sm:gap-2">
                      {graceDotsArray.map((used, i) => (
                        <div
                          key={i}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            used
                              ? "bg-[#FF8C42] border-[#FF8C42] text-white"
                              : "border-[#E5E7EB] text-[#9CA3AF]"
                          }`}
                        >
                          {used ? "✓" : "○"}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-[#6B7280]">
                      {program.graceUsed}/{program.graceLimit}
                    </span>
                  </div>
                  <div className={`text-xs sm:text-sm p-2.5 sm:p-3 rounded-xl ${
                    program.graceUsed === 0
                      ? "bg-emerald-50 text-emerald-700"
                      : program.graceUsed < program.graceLimit
                      ? "bg-amber-50 text-amber-700"
                      : "bg-red-50 text-red-700"
                  }`}>
                    {program.graceUsed === 0
                      ? "✨ Odlično! Još nisi iskoristio/la nijednu grace cigaretu."
                      : program.graceUsed < program.graceLimit
                      ? `💪 I dalje si na pravom putu. Ostalo: ${program.graceLimit - program.graceUsed} grace.`
                      : "🔄 Program je uzdrman, ali nije kraj. Nastavi dalje!"}
                  </div>
                </CardContent>
              </Card>

              {/* Program info */}
              <Card>
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#2EC4B6]" />
                    {getProgramName(program.type)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-[#6B7280]">Trenutni dan</span>
                      <span className="text-sm font-semibold text-[#1F2937]">Dan {program.currentDay}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-[#6B7280]">Status</span>
                      <Badge variant={program.status === "ACTIVE" ? "success" : "warning"} className="text-xs">
                        {program.status === "ACTIVE" ? "Aktivan" : "Fokus"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-[#6B7280]">Način</span>
                      <span className="text-xs sm:text-sm font-medium text-[#374151]">
                        {program.isWithFriend ? "S prijateljem 👥" : "Samostalno 🧘"}
                      </span>
                    </div>
                    <div className="mt-1">
                      <div className="flex justify-between text-xs text-[#9CA3AF] mb-1">
                        <span>Napredak</span>
                        <span>{Math.round(programProgress)}%</span>
                      </div>
                      <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#2EC4B6] to-[#4F7BFF] rounded-full transition-all duration-1000"
                          style={{ width: `${programProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Health milestones timeline - collapsible on mobile */}
        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader className="pb-2 sm:pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                  Napredak zdravlja
                </CardTitle>
                {/* Collapse toggle on mobile */}
                <button
                  onClick={() => setHealthExpanded(!healthExpanded)}
                  className="lg:hidden flex items-center gap-1 text-xs text-[#6B7280] py-1 px-2 rounded-lg hover:bg-[#F3F4F6]"
                >
                  {healthExpanded ? (
                    <>Sakrij <ChevronUp className="w-3.5 h-3.5" /></>
                  ) : (
                    <>Prikaži <ChevronDown className="w-3.5 h-3.5" /></>
                  )}
                </button>
              </div>
            </CardHeader>
            <AnimatePresence>
              {(healthExpanded || true) && (
                <motion.div
                  initial={false}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="lg:block"
                >
                  <CardContent className={`${!healthExpanded ? "hidden lg:block" : ""}`}>
                    {achievedMilestones.length === 0 && !nextMilestone ? (
                      <div className="text-center py-6 text-[#6B7280]">
                        <div className="text-3xl mb-2">🌱</div>
                        <p className="text-sm">Tvoje tijelo već počinje oporavak. Prati napredak ovdje!</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5 sm:space-y-3">
                        {achievedMilestones.slice(-3).map((milestone) => (
                          <div key={milestone.key} className="flex items-start gap-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                              {milestone.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-semibold text-[#1F2937]">{milestone.title}</span>
                                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 flex-shrink-0" />
                              </div>
                              <p className="text-xs text-[#6B7280] leading-snug">{milestone.description}</p>
                            </div>
                          </div>
                        ))}
                        {nextMilestone && (
                          <div className="flex items-start gap-3 opacity-60">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#F3F4F6] rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                              {nextMilestone.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-semibold text-[#6B7280]">{nextMilestone.title}</span>
                                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9CA3AF] flex-shrink-0" />
                              </div>
                              <p className="text-xs text-[#9CA3AF] leading-snug">{nextMilestone.description}</p>
                              <p className="text-xs text-[#2EC4B6] mt-0.5">
                                Za {formatMinutesRemaining(nextMilestone.minutesRemaining)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* Recent activity */}
        <motion.div variants={cardVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
            {/* Recent cigarette logs */}
            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <Cigarette className="w-4 h-4 text-[#6B7280]" />
                  Nedavne cigarete
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentLogs.cigarettes.length === 0 ? (
                  <div className="text-center py-4 sm:py-6">
                    <div className="text-2xl sm:text-3xl mb-2">🎉</div>
                    <p className="text-xs sm:text-sm text-[#6B7280]">Nema zabilježenih cigareta!</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">Odlično radiš!</p>
                  </div>
                ) : (
                  <div className="space-y-1.5 sm:space-y-2">
                    {recentLogs.cigarettes.map((log) => (
                      <div key={log.id} className="flex items-center justify-between py-1.5 sm:py-2 border-b border-[#F3F4F6] last:border-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${log.isGrace ? "bg-[#FF8C42]" : "bg-red-400"}`} />
                          <span className="text-xs sm:text-sm text-[#374151] truncate">
                            {log.trigger ? getTriggerLabel(log.trigger) : "Bez okidača"}
                          </span>
                          {log.isGrace && (
                            <Badge variant="warning" className="text-[10px] py-0 flex-shrink-0">grace</Badge>
                          )}
                        </div>
                        <span className="text-[10px] sm:text-xs text-[#9CA3AF] flex-shrink-0 ml-2">
                          {formatDistanceToNow(new Date(log.loggedAt), { addSuffix: true, locale: hr })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent craving logs */}
            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#FF8C42]" />
                  Nedavne žudnje
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentLogs.cravings.length === 0 ? (
                  <div className="text-center py-4 sm:py-6">
                    <div className="text-2xl sm:text-3xl mb-2">💪</div>
                    <p className="text-xs sm:text-sm text-[#6B7280]">Nema zabilježenih žudnji.</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">Ili si ih sve prebrodio/la!</p>
                  </div>
                ) : (
                  <div className="space-y-1.5 sm:space-y-2">
                    {recentLogs.cravings.map((log) => (
                      <div key={log.id} className="flex items-center justify-between py-1.5 sm:py-2 border-b border-[#F3F4F6] last:border-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${log.resolved ? "bg-emerald-400" : "bg-amber-400"}`} />
                          <span className="text-xs sm:text-sm text-[#374151] truncate">
                            {log.trigger ? getTriggerLabel(log.trigger) : "Žudnja"}
                          </span>
                          <Badge variant={log.resolved ? "success" : "warning"} className="text-[10px] py-0 flex-shrink-0">
                            {log.resolved ? "riješeno" : "u tijeku"}
                          </Badge>
                        </div>
                        <span className="text-[10px] sm:text-xs text-[#9CA3AF] flex-shrink-0 ml-2">
                          {formatDistanceToNow(new Date(log.loggedAt), { addSuffix: true, locale: hr })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <CravingModal
        open={showCravingModal}
        onClose={() => setShowCravingModal(false)}
      />
      <LogCigaretteModal
        open={showLogModal}
        onClose={() => setShowLogModal(false)}
        graceUsed={program?.graceUsed || 0}
        graceLimit={program?.graceLimit || 3}
      />
    </>
  )
}
