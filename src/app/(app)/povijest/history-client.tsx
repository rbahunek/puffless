"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { History, Cigarette, Zap, TrendingUp, BarChart3, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getTriggerLabel, formatDateShort } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { hr } from "date-fns/locale"

interface CigaretteLog {
  id: string
  trigger: string | null
  note: string | null
  isGrace: boolean
  loggedAt: string
}

interface CravingLog {
  id: string
  trigger: string | null
  note: string | null
  resolved: boolean
  resolutionType: string | null
  loggedAt: string
}

interface DailyProgress {
  date: string
  cigarettesSmoked: number
  cravingsLogged: number
  cravingsResolved: number
  taskCompleted: boolean
}

interface Analytics {
  topTriggers: Array<{ trigger: string; count: number }>
  peakHour: number | null
  totalCigarettes: number
  totalCravings: number
  resolvedCravings: number
}

interface HistoryClientProps {
  cigaretteLogs: CigaretteLog[]
  cravingLogs: CravingLog[]
  dailyProgress: DailyProgress[]
  analytics: Analytics
}

type Tab = "pregled" | "cigarete" | "zudnje"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export function HistoryClient({ cigaretteLogs, cravingLogs, dailyProgress, analytics }: HistoryClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("pregled")

  const formatHour = (hour: number) => {
    if (hour === 0) return "ponoć"
    if (hour < 12) return `${hour}:00`
    if (hour === 12) return "podne"
    return `${hour}:00`
  }

  const resolutionRate = analytics.totalCravings > 0
    ? Math.round((analytics.resolvedCravings / analytics.totalCravings) * 100)
    : 0

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-3xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "Poppins, sans-serif" }}>
          Povijest i analitika 📊
        </h1>
        <p className="text-[#6B7280] mt-1">
          Pregled tvojih zapisa i uvida u obrasce.
        </p>
      </motion.div>

      {/* Analytics cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Zabilježene cigarete",
              value: analytics.totalCigarettes,
              icon: Cigarette,
              color: "#FF8C42",
              bg: "#fff4ed",
            },
            {
              label: "Zabilježene žudnje",
              value: analytics.totalCravings,
              icon: Zap,
              color: "#4F7BFF",
              bg: "#eef2ff",
            },
            {
              label: "Riješene žudnje",
              value: analytics.resolvedCravings,
              icon: CheckCircle,
              color: "#10B981",
              bg: "#f0fdf4",
            },
            {
              label: "Stopa uspjeha",
              value: `${resolutionRate}%`,
              icon: TrendingUp,
              color: "#2EC4B6",
              bg: "#e8faf9",
            },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                  style={{ backgroundColor: stat.bg }}
                >
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <div className="text-2xl font-bold text-[#1F2937]">{stat.value}</div>
                <div className="text-xs text-[#6B7280] mt-0.5">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Insights */}
      {(analytics.topTriggers.length > 0 || analytics.peakHour !== null) && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#4F7BFF]" />
                Uvidi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics.topTriggers.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-[#374151] mb-3">Najčešći okidači</div>
                  <div className="space-y-2">
                    {analytics.topTriggers.map(({ trigger, count }, i) => (
                      <div key={trigger} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2EC4B6] to-[#4F7BFF] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-[#374151]">
                              {getTriggerLabel(trigger)}
                            </span>
                            <span className="text-xs text-[#9CA3AF]">{count}×</span>
                          </div>
                          <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#2EC4B6] to-[#4F7BFF] rounded-full"
                              style={{
                                width: `${(count / analytics.topTriggers[0].count) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analytics.peakHour !== null && (
                <div className="bg-[#eef2ff] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-[#4F7BFF]" />
                    <span className="text-sm font-medium text-[#4F7BFF]">Najrizičnije vrijeme</span>
                  </div>
                  <p className="text-sm text-[#374151]">
                    Najviše žudnji javlja se oko <strong>{formatHour(analytics.peakHour)}</strong>.
                    Pripremi se unaprijed za taj dio dana.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <div className="flex gap-2 bg-[#F3F4F6] rounded-xl p-1">
          {[
            { key: "pregled" as Tab, label: "Pregled" },
            { key: "cigarete" as Tab, label: "Cigarete" },
            { key: "zudnje" as Tab, label: "Žudnje" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-white text-[#1F2937] shadow-sm"
                  : "text-[#6B7280] hover:text-[#1F2937]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab content */}
      {activeTab === "pregled" && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#6B7280]" />
                Dnevni pregled
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dailyProgress.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📅</div>
                  <p className="text-[#6B7280] text-sm">Nema podataka za prikaz.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dailyProgress.map((day) => (
                    <div
                      key={day.date}
                      className="flex items-center gap-4 p-3 bg-[#F7FAFC] rounded-xl"
                    >
                      <div className="text-center flex-shrink-0 w-12">
                        <div className="text-xs text-[#9CA3AF]">
                          {new Date(day.date).toLocaleDateString("hr-HR", { weekday: "short" })}
                        </div>
                        <div className="text-sm font-bold text-[#1F2937]">
                          {formatDateShort(day.date)}
                        </div>
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <div className="text-xs text-[#9CA3AF]">Cigarete</div>
                          <div className={`text-sm font-bold ${day.cigarettesSmoked > 0 ? "text-[#FF8C42]" : "text-emerald-600"}`}>
                            {day.cigarettesSmoked}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-[#9CA3AF]">Žudnje</div>
                          <div className="text-sm font-bold text-[#4F7BFF]">{day.cravingsLogged}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-[#9CA3AF]">Zadatak</div>
                          <div className="text-sm font-bold">
                            {day.taskCompleted ? (
                              <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                            ) : (
                              <span className="text-[#9CA3AF]">—</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === "cigarete" && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cigarette className="w-5 h-5 text-[#FF8C42]" />
                Zabilježene cigarete
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cigaretteLogs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🎉</div>
                  <p className="text-[#6B7280] text-sm">Nema zabilježenih cigareta!</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">Odlično radiš!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cigaretteLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-3 bg-[#F7FAFC] rounded-xl"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${log.isGrace ? "bg-[#FF8C42]" : "bg-red-400"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-[#374151]">
                            {log.trigger ? getTriggerLabel(log.trigger) : "Bez okidača"}
                          </span>
                          {log.isGrace && (
                            <Badge variant="warning" className="text-xs py-0">grace</Badge>
                          )}
                        </div>
                        {log.note && (
                          <p className="text-xs text-[#6B7280] mt-0.5">{log.note}</p>
                        )}
                      </div>
                      <span className="text-xs text-[#9CA3AF] flex-shrink-0">
                        {formatDistanceToNow(new Date(log.loggedAt), { addSuffix: true, locale: hr })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === "zudnje" && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#4F7BFF]" />
                Zabilježene žudnje
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cravingLogs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">💪</div>
                  <p className="text-[#6B7280] text-sm">Nema zabilježenih žudnji.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cravingLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-3 bg-[#F7FAFC] rounded-xl"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${log.resolved ? "bg-emerald-500" : "bg-[#4F7BFF]"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-[#374151]">
                            {log.trigger ? getTriggerLabel(log.trigger) : "Bez okidača"}
                          </span>
                          <Badge variant={log.resolved ? "success" : "secondary"} className="text-xs py-0">
                            {log.resolved ? "Riješeno" : "Zabilježeno"}
                          </Badge>
                        </div>
                        {log.note && (
                          <p className="text-xs text-[#6B7280] mt-0.5">{log.note}</p>
                        )}
                      </div>
                      <span className="text-xs text-[#9CA3AF] flex-shrink-0">
                        {formatDistanceToNow(new Date(log.loggedAt), { addSuffix: true, locale: hr })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
