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
  Wind,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CravingModal } from "@/components/features/craving-modal"
import { LogCigaretteModal } from "@/components/features/log-cigarette-modal"
import { DailyCheckin } from "@/components/features/daily-checkin"
import { CoachCard } from "@/components/features/coach-card"
import { CravingAlert } from "@/components/features/craving-alert"
import { formatCurrency, getMoneyEquivalent, getProgramName, getTriggerLabel } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { hr } from "date-fns/locale"
import { getTimeSensitiveSuggestion } from "@/lib/coach-messages"

interface DashboardClientProps {
  user: { name?: string | null; email?: string | null }
  profile: {
    displayName?: string | null
    cigarettesPerDay: number
    cigarettesPerPack: number
    pricePerPack: number
    quitDate: string
    triggers: string[]
    consumptionType: string
  }
  consumptionLabels: {
    itemSingular: string
    itemPlural: string
    avoided: string
    logged: string
    loggedLabel: string
    grace: string
    actionLog: string
    actionCraving: string
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
  smartFeatures: {
    coachMessage: string
    hasCheckedInToday: boolean
    upcomingRisk: {
      hour: number
      riskScore: number
      triggers: string[]
    } | null
    topInsight: {
      type: string
      title: string
      description: string
      confidence: number
    } | null
  }
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

const numberVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
  smartFeatures,
  consumptionLabels,
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
        className="space-y-6"
      >
        {/* Page header */}
        <motion.div variants={cardVariants}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 truncate">
                Zdravo, {displayName}! 👋
              </h1>
              <p className="text-sm text-slate-500 mt-1">{dailyMotivation}</p>
            </div>
            {program && (
              <Badge variant={program.status === "ACTIVE" ? "default" : "warning"} className="flex-shrink-0">
                {program.status === "ACTIVE" ? "Aktivan" : "Fokus"}
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Progress hero card */}
        {program && (
          <motion.div variants={cardVariants}>
            <Card className="bg-gradient-to-br from-teal-500 to-blue-500 border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm opacity-90 mb-1">
                      {getProgramName(program.type)}
                    </div>
                    <div className="text-3xl font-bold">
                      Dan {program.currentDay}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-sm opacity-90 mb-4">
                  {stats.daysSinceQuit === 0
                    ? "Danas počinješ! 🌱"
                    : stats.daysSinceQuit === 1
                    ? "Odličan početak! 🎉"
                    : `${stats.daysSinceQuit} dana napretka! 💪`}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs opacity-75">
                    <span>Napredak</span>
                    <span>{Math.round(programProgress)}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-1000"
                      style={{ width: `${programProgress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick actions */}
        <motion.div variants={cardVariants}>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setShowCravingModal(true)}
              variant="warning"
              size="lg"
              className="h-14 text-sm font-medium"
            >
              <Zap className="w-5 h-5" />
              {consumptionLabels.actionCraving}
            </Button>
            <Button
              onClick={() => setShowLogModal(true)}
              variant="secondary"
              size="lg"
              className="h-14 text-sm font-medium"
            >
              {profile.consumptionType === "VAPING" ? (
                <Wind className="w-5 h-5" />
              ) : (
                <Cigarette className="w-5 h-5" />
              )}
              {consumptionLabels.actionLog}
            </Button>
          </div>
        </motion.div>

        {/* Stats grid - mobile: 2x2 */}
        <div className="grid grid-cols-2 gap-4">
          {/* Money saved */}
          <motion.div variants={cardVariants}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-medium text-slate-500">Ušteđeno</div>
                  <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                    <Euro className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
                <motion.div
                  className="text-3xl font-bold text-slate-900 mb-1 stat-number"
                  variants={numberVariants}
                >
                  {formatCurrency(stats.moneySaved)}
                </motion.div>
                <div className="text-xs text-teal-600 font-medium">
                  {getMoneyEquivalent(stats.moneySaved)}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Cigarettes avoided */}
          <motion.div variants={cardVariants}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-medium text-slate-500">Preskočeno</div>
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    {profile.consumptionType === "VAPING" ? (
                      <Wind className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Cigarette className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                </div>
                <motion.div
                  className="text-3xl font-bold text-slate-900 mb-1 stat-number"
                  variants={numberVariants}
                >
                  {stats.cigarettesAvoided}
                </motion.div>
                <div className="text-xs text-slate-500">
                  {consumptionLabels.logged}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Grace cigarettes */}
          {program && (
            <motion.div variants={cardVariants} className="col-span-2">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-slate-900">{consumptionLabels.grace}</div>
                    <div className="text-xs text-slate-500">
                      {program.graceUsed}/{program.graceLimit}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    {graceDotsArray.map((used, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                          used
                            ? "bg-orange-500 border-orange-500 text-white"
                            : "border-slate-200 text-slate-300"
                        }`}
                      >
                        {used ? "●" : "○"}
                      </div>
                    ))}
                  </div>
                  <div className={`text-xs p-2.5 rounded-lg ${
                    program.graceUsed === 0
                      ? "bg-emerald-50 text-emerald-700"
                      : program.graceUsed < program.graceLimit
                      ? "bg-amber-50 text-amber-700"
                      : "bg-red-50 text-red-700"
                  }`}>
                    {program.graceUsed === 0
                      ? "Još uvijek si na pravom putu."
                      : program.graceUsed < program.graceLimit
                      ? `Ostalo: ${program.graceLimit - program.graceUsed} grace.`
                      : "Program je uzdrman, ali nije kraj."}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Smart Features Section */}
        
        {/* Craving Prediction Alert */}
        {smartFeatures.upcomingRisk && (
          <motion.div variants={cardVariants}>
            <CravingAlert
              prediction={{
                riskScore: smartFeatures.upcomingRisk.riskScore,
                suggestion: getTimeSensitiveSuggestion(
                  new Date().getHours(),
                  [smartFeatures.upcomingRisk]
                ) || "Obično imaš želju u ovo vrijeme. Budi spreman/na."
              }}
              onDismiss={() => {}}
              onOpenCravingSupport={() => setShowCravingModal(true)}
            />
          </motion.div>
        )}

        {/* Puffless Coach */}
        <motion.div variants={cardVariants}>
          <CoachCard message={smartFeatures.coachMessage} />
        </motion.div>

        {/* Daily Check-in */}
        {!smartFeatures.hasCheckedInToday && (
          <motion.div variants={cardVariants}>
            <DailyCheckin
              hasCheckedInToday={smartFeatures.hasCheckedInToday}
              onSubmit={async (mood, note) => {
                await fetch("/api/mood", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ mood, note }),
                })
                window.location.reload()
              }}
            />
          </motion.div>
        )}

        {/* Top Pattern Insight */}
        {smartFeatures.topInsight && smartFeatures.topInsight.type !== "insufficient_data" && (
          <motion.div variants={cardVariants}>
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-1">
                      {smartFeatures.topInsight.title}
                    </h3>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      {smartFeatures.topInsight.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Health milestones */}
          <motion.div variants={cardVariants} className="col-span-2">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-slate-900">Zdravstveni napredak</div>
                  <button
                    onClick={() => setHealthExpanded(!healthExpanded)}
                    className="flex items-center gap-1 text-xs text-slate-500 py-1 px-2 rounded-lg hover:bg-slate-50"
                  >
                    {healthExpanded ? (
                      <>Sakrij <ChevronUp className="w-3.5 h-3.5" /></>
                    ) : (
                      <>Prikaži <ChevronDown className="w-3.5 h-3.5" /></>
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 stat-number">
                      {stats.achievedMilestones}/{stats.totalMilestones}
                    </div>
                    <div className="text-xs text-slate-500">prekretnica</div>
                  </div>
                </div>
                {nextMilestone && (
                  <div className="text-xs text-emerald-600 mb-3">
                    Sljedeća za {formatMinutesRemaining(nextMilestone.minutesRemaining)}
                  </div>
                )}
                <AnimatePresence>
                  {healthExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2 pt-3 border-t border-slate-100"
                    >
                      {achievedMilestones.length === 0 ? (
                        <div className="text-center py-4 text-slate-500">
                          <div className="text-2xl mb-1">🌱</div>
                          <p className="text-xs">Tvoje tijelo već počinje oporavak.</p>
                        </div>
                      ) : (
                        achievedMilestones.slice(-3).map((milestone) => (
                          <div key={milestone.key} className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 text-xs">
                              {milestone.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-medium text-slate-900">{milestone.title}</div>
                              <div className="text-xs text-slate-500">{milestone.description}</div>
                            </div>
                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Daily focus */}
        {program && (
          <motion.div variants={cardVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-teal-600" />
                  Današnji fokus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-900 mb-1">
                      Dan {program.currentDay} programa
                    </div>
                    <div className="text-xs text-slate-500">
                      {todayProgress?.taskCompleted ? "Zadatak završen ✓" : "Pogledaj današnji zadatak"}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = "/program"}
                  >
                    Otvori
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recent activity */}
        {(recentLogs.cigarettes.length > 0 || recentLogs.cravings.length > 0) && (
          <motion.div variants={cardVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-600" />
                  Nedavna aktivnost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentLogs.cigarettes.slice(0, 3).map((log) => (
                    <div key={log.id} className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <Cigarette className="w-3.5 h-3.5 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-slate-900">
                          Cigareta {log.isGrace && "(grace)"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {log.trigger && getTriggerLabel(log.trigger)} · {formatDistanceToNow(new Date(log.loggedAt), { addSuffix: true, locale: hr })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {recentLogs.cravings.slice(0, 2).map((log) => (
                    <div key={log.id} className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 bg-teal-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <Zap className="w-3.5 h-3.5 text-teal-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-slate-900">
                          Žudnja {log.resolved && "✓"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {log.trigger && getTriggerLabel(log.trigger)} · {formatDistanceToNow(new Date(log.loggedAt), { addSuffix: true, locale: hr })}
                        </div>
                      </div>
                    </div>
                  ))}
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
        graceUsed={program?.graceUsed ?? 0}
        graceLimit={program?.graceLimit ?? 0}
        itemLabel={consumptionLabels.itemSingular}
      />
    </>
  )
}
