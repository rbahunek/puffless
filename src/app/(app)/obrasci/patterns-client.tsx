"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Clock, Calendar, Target, Lightbulb, BarChart3 } from "lucide-react"
import { detectTimePatterns, detectTriggerPatterns, detectWeekdayPatterns, generateInsights } from "@/lib/pattern-detection"
import { getTriggerLabel } from "@/lib/utils"

interface PatternInsightsClientProps {
  cigaretteLogs: any[]
  cravingLogs: any[]
  existingInsights: any[]
}

export function PatternInsightsClient({ cigaretteLogs, cravingLogs, existingInsights }: PatternInsightsClientProps) {
  const insights = useMemo(() => {
    return generateInsights(cigaretteLogs, cravingLogs)
  }, [cigaretteLogs, cravingLogs])

  const timePatterns = useMemo(() => {
    return detectTimePatterns([...cigaretteLogs, ...cravingLogs]).slice(0, 5)
  }, [cigaretteLogs, cravingLogs])

  const triggerPatterns = useMemo(() => {
    return detectTriggerPatterns([...cigaretteLogs, ...cravingLogs]).slice(0, 5)
  }, [cigaretteLogs, cravingLogs])

  const weekdayPatterns = useMemo(() => {
    return detectWeekdayPatterns([...cigaretteLogs, ...cravingLogs])
  }, [cigaretteLogs, cravingLogs])

  const totalLogs = cigaretteLogs.length + cravingLogs.length

  return (
    <div className="space-y-6 pb-safe-bottom">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Okidači i obrasci</h1>
        <p className="text-slate-600">
          Analizirano {totalLogs} zapisa da bi pronašli tvoje obrasce.
        </p>
      </div>

      {/* Insights */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h2 className="font-semibold text-slate-900">Tvoji obrasci</h2>
        </div>

        {insights.map((insight, i) => (
          <Card key={i} className="border-l-4 border-l-teal-500">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">{insight.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{insight.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
                    <span className="text-sm font-bold text-teal-600">
                      {Math.round(insight.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Time of Day Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            Vrijeme dana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timePatterns.map((pattern) => (
              <div key={pattern.hour} className="flex items-center gap-3">
                <div className="w-16 text-sm font-medium text-slate-700">
                  {pattern.hour}:00
                </div>
                <div className="flex-1">
                  <div className="bg-slate-100 rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-teal-600 h-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${pattern.percentage}%` }}
                    >
                      {pattern.percentage > 15 && (
                        <span className="text-xs font-semibold text-white">
                          {pattern.percentage.toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-12 text-right text-sm text-slate-600">
                  {pattern.count}x
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trigger Frequency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-600" />
            Najčešći okidači
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {triggerPatterns.map((pattern, i) => (
              <div key={pattern.trigger} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-900">
                      {getTriggerLabel(pattern.trigger)}
                    </span>
                    <span className="text-xs text-slate-600">
                      {pattern.count}x · {pattern.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full transition-all duration-500"
                      style={{ width: `${pattern.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Pattern */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Dani u tjednu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekdayPatterns.map((pattern) => {
              const maxCount = Math.max(...weekdayPatterns.map(p => p.count))
              const heightPercent = (pattern.count / maxCount) * 100

              return (
                <div key={pattern.day} className="flex flex-col items-center gap-2">
                  <div className="w-full h-24 flex items-end justify-center">
                    <div
                      className="w-8 bg-blue-500 rounded-t-lg transition-all duration-500"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-600">
                    {pattern.dayName.slice(0, 2)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {pattern.count}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Suggestion Cards */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-teal-600" />
          <h2 className="font-semibold text-slate-900">Prijedlozi</h2>
        </div>

        {triggerPatterns.length > 0 && (
          <Card className="bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
            <CardContent className="pt-5">
              <p className="text-sm text-slate-800 leading-relaxed">
                💡 <strong>Primijetili smo da se želja često javlja uz {getTriggerLabel(triggerPatterns[0].trigger).toLowerCase()}.</strong>
                {" "}Pokušaj zamijeniti taj trenutak alternativnom aktivnošću - čaša vode, kratka šetnja ili duboko disanje.
              </p>
            </CardContent>
          </Card>
        )}

        {timePatterns.length > 0 && timePatterns[0].percentage > 20 && (
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="pt-5">
              <p className="text-sm text-slate-800 leading-relaxed">
                ⏰ <strong>Najveći rizik je oko {timePatterns[0].hour}:00.</strong>
                {" "}Pripremi se unaprijed - pripremi alternativnu aktivnost prije tog vremena.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
