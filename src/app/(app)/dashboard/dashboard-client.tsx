"use client"

import { useState } from "react"
import { motion } from "framer-motion"
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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
        className="space-y-6"
      >
        {/* Page header */}
        <motion.div variants={cardVariants}>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "Poppins, sans-serif" }}>
                Zdravo, {displayName}! 👋
              </h1>
              <p className="text-[#6B7280] mt-1">{dailyMotivation}</p>
            </div>
            {program && (
              <Badge variant={program.status === "ACTIVE" ? "default" : "warning"}>
                {program.status === "ACTIVE" ? "Program aktivan" : "Potreban fokus"}
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={cardVariants}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              onClick={() => setShowCravingModal(true)}
              variant="warning"
              className="h-14 text-base font-semibold"
            >
              <Zap className="w-5 h-5" />
              Imam želju za cigaretom
            </Button>
            <Button
              onClick={() => setShowLogModal(true)}
              variant="secondary"
              className="h-14 text-base font-semibold"
            >
              <Cigarette className="w-5 h-5" />
              Zabilježi cigaretu
            </Button>
            <Button
              variant="outline"
              className="h-14 text-base font-semibold"
              onClick={() => window.location.href = "/program"}
            >
              <Target className="w-5 h-5" />
              Današnji zadatak
            </Button>
          </div>
        </motion.div>

        {/* Main stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Days counter */}
          <motion.div variants={cardVariants}>
            <Card className="bg-gradient-to-br from-[#2EC4B6] to-[#4F7BFF] border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium opacity-80">Dana u programu</div>
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-5xl font-bold mb-1">{stats.daysSinceQuit}</div>
                <div className="text-sm opacity-80">
                  {stats.daysSinceQuit === 0
                    ? "Danas počinješ! 🌱"
                    : stats.daysSinceQuit === 1
                    ? "Odličan početak! 🎉"
                    : `${stats.daysSinceQuit} dana napretka! 💪`}
                </div>
                {program && (
                  <div className="mt-4">
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
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-[#6B7280]">Ušteđeni novac</div>
                  <div className="w-8 h-8 bg-[#fff8e6] rounded-lg flex items-center justify-center">
                    <Euro className="w-4 h-4 text-[#FFD166]" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#1F2937] mb-1">
                  {formatCurrency(stats.moneySaved)}
                </div>
                <div className="text-sm text-[#2EC4B6] font-medium">
                  {getMoneyEquivalent(stats.moneySaved)} 🎉
                </div>
                <div className="mt-3 text-xs text-[#9CA3AF]">
                  +{formatCurrency(stats.moneySavedDaily)} dnevno
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Cigarettes avoided */}
          <motion.div variants={cardVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-[#6B7280]">Preskočene cigarete</div>
                  <div className="w-8 h-8 bg-[#eef2ff] rounded-lg flex items-center justify-center">
                    <Cigarette className="w-4 h-4 text-[#4F7BFF]" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#1F2937] mb-1">
                  {stats.cigarettesAvoided}
                </div>
                <div className="text-sm text-[#6B7280]">
                  cigareta koje nisi zapalio/la
                </div>
                <div className="mt-3 text-xs text-[#9CA3AF]">
                  Tvoja pluća ti hvale! 🫁
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Health milestones */}
          <motion.div variants={cardVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-[#6B7280]">Zdravstveni napredak</div>
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#1F2937] mb-1">
                  {stats.achievedMilestones}/{stats.totalMilestones}
                </div>
                <div className="text-sm text-[#6B7280]">
                  prekretnica dostignutih
                </div>
                {nextMilestone && (
                  <div className="mt-3 text-xs text-emerald-600">
                    Sljedeća: {nextMilestone.title} za {formatMinutesRemaining(nextMilestone.minutesRemaining)}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Grace cigarettes & Program status */}
        {program && (
          <motion.div variants={cardVariants}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Grace cigarettes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-[#FF8C42]" />
                    Grace cigarete
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex gap-2">
                      {graceDotsArray.map((used, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            used
                              ? "bg-[#FF8C42] border-[#FF8C42] text-white"
                              : "border-[#E5E7EB] text-[#9CA3AF]"
                          }`}
                        >
                          {used ? "✓" : "○"}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-[#6B7280]">
                      {program.graceUsed}/{program.graceLimit} iskorišteno
                    </span>
                  </div>
                  <div className={`text-sm p-3 rounded-xl ${
                    program.graceUsed === 0
                      ? "bg-emerald-50 text-emerald-700"
                      : program.graceUsed < program.graceLimit
                      ? "bg-amber-50 text-amber-700"
                      : "bg-red-50 text-red-700"
                  }`}>
                    {program.graceUsed === 0
                      ? "✨ Odlično! Još nisi iskoristio/la nijednu grace cigaretu."
                      : program.graceUsed < program.graceLimit
                      ? `💪 I dalje si na pravom putu. Ostalo ti je ${program.graceLimit - program.graceUsed} grace cigareta.`
                      : "🔄 Program je uzdrman, ali nije kraj. Nastavi dalje!"}
                  </div>
                </CardContent>
              </Card>

              {/* Program info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#2EC4B6]" />
                    {getProgramName(program.type)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#6B7280]">Trenutni dan</span>
                      <span className="font-semibold text-[#1F2937]">Dan {program.currentDay}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#6B7280]">Status</span>
                      <Badge variant={program.status === "ACTIVE" ? "success" : "warning"}>
                        {program.status === "ACTIVE" ? "Aktivan" : "Potreban fokus"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#6B7280]">Način</span>
                      <span className="text-sm font-medium text-[#374151]">
                        {program.isWithFriend ? "S prijateljem 👥" : "Samostalno 🧘"}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-[#9CA3AF] mb-1">
                        <span>Napredak programa</span>
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

        {/* Health milestones timeline */}
        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-500" />
                Napredak zdravlja
              </CardTitle>
            </CardHeader>
            <CardContent>
              {achievedMilestones.length === 0 && !nextMilestone ? (
                <div className="text-center py-8 text-[#6B7280]">
                  <div className="text-4xl mb-3">🌱</div>
                  <p>Tvoje tijelo već počinje oporavak. Prati napredak ovdje!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {achievedMilestones.slice(-3).map((milestone) => (
                    <div key={milestone.key} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                        {milestone.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#1F2937]">{milestone.title}</span>
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        </div>
                        <p className="text-xs text-[#6B7280]">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                  {nextMilestone && (
                    <div className="flex items-start gap-3 opacity-60">
                      <div className="w-8 h-8 bg-[#F3F4F6] rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                        {nextMilestone.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#6B7280]">{nextMilestone.title}</span>
                          <Clock className="w-4 h-4 text-[#9CA3AF]" />
                        </div>
                        <p className="text-xs text-[#9CA3AF]">{nextMilestone.description}</p>
                        <p className="text-xs text-[#2EC4B6] mt-0.5">
                          Za {formatMinutesRemaining(nextMilestone.minutesRemaining)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent activity */}
        <motion.div variants={cardVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recent cigarette logs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Cigarette className="w-4 h-4 text-[#6B7280]" />
                  Nedavno zabilježene cigarete
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentLogs.cigarettes.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="text-3xl mb-2">🎉</div>
                    <p className="text-sm text-[#6B7280]">Nema zabilježenih cigareta!</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">Odlično radiš!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentLogs.cigarettes.map((log) => (
                      <div key={log.id} className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${log.isGrace ? "bg-[#FF8C42]" : "bg-red-400"}`} />
                          <span className="text-sm text-[#374151]">
                            {log.trigger ? getTriggerLabel(log.trigger) : "Bez okidača"}
                          </span>
                          {log.isGrace && (
                            <Badge variant="warning" className="text-xs py-0">grace</Badge>
                          )}
                        </div>
                        <span className="text-xs text-[#9CA3AF]">
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
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#FF8C42]" />
                  Nedavne žudnje
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentLogs.cravings.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="text-3xl mb-2">💪</div>
                    <p className="text-sm text-[#6B7280]">Nema zabilježenih žudnji.</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">Ili si ih sve prebrodio/la!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentLogs.cravings.map((log) => (
                      <div key={log.id} className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${log.resolved ? "bg-emerald-400" : "bg-amber-400"}`} />
                          <span className="text-sm text-[#374151]">
                            {log.trigger ? getTriggerLabel(log.trigger) : "Žudnja"}
                          </span>
                          <Badge variant={log.resolved ? "success" : "warning"} className="text-xs py-0">
                            {log.resolved ? "riješeno" : "u tijeku"}
                          </Badge>
                        </div>
                        <span className="text-xs text-[#9CA3AF]">
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

        {/* Today's summary */}
        {todayProgress && (
          <motion.div variants={cardVariants}>
            <Card className="bg-gradient-to-r from-[#e8faf9] to-[#eef2ff] border-[#2EC4B6]/20">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#1F2937] mb-4">Danas</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#1F2937]">{todayProgress.cigarettesSmoked}</div>
                    <div className="text-xs text-[#6B7280]">cigareta</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#1F2937]">{todayProgress.cravingsLogged}</div>
                    <div className="text-xs text-[#6B7280]">žudnji</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#1F2937]">{todayProgress.cravingsResolved}</div>
                    <div className="text-xs text-[#6B7280]">riješenih žudnji</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#1F2937]">
                      {todayProgress.taskCompleted ? "✓" : "—"}
                    </div>
                    <div className="text-xs text-[#6B7280]">zadatak</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
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
