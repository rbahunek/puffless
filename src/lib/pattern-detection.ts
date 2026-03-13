import { CigaretteLog, CravingLog, TriggerType } from "@prisma/client"

export interface TimePattern {
  hour: number
  count: number
  percentage: number
}

export interface TriggerPattern {
  trigger: TriggerType
  count: number
  percentage: number
}

export interface PatternInsight {
  type: string
  title: string
  description: string
  confidence: number
  data: any
}

/**
 * Detect time-of-day patterns from craving/cigarette logs
 */
export function detectTimePatterns(
  logs: Array<{ loggedAt: Date }>
): TimePattern[] {
  const hourCounts: Record<number, number> = {}
  
  logs.forEach(log => {
    const hour = new Date(log.loggedAt).getHours()
    hourCounts[hour] = (hourCounts[hour] || 0) + 1
  })

  const total = logs.length
  const patterns = Object.entries(hourCounts)
    .map(([hour, count]) => ({
      hour: parseInt(hour),
      count,
      percentage: (count / total) * 100
    }))
    .sort((a, b) => b.count - a.count)

  return patterns
}

/**
 * Detect most common triggers
 */
export function detectTriggerPatterns(
  logs: Array<{ trigger: TriggerType | null }>
): TriggerPattern[] {
  const triggerCounts: Record<string, number> = {}
  
  logs.forEach(log => {
    if (log.trigger) {
      triggerCounts[log.trigger] = (triggerCounts[log.trigger] || 0) + 1
    }
  })

  const total = logs.filter(l => l.trigger).length
  const patterns = Object.entries(triggerCounts)
    .map(([trigger, count]) => ({
      trigger: trigger as TriggerType,
      count,
      percentage: (count / total) * 100
    }))
    .sort((a, b) => b.count - a.count)

  return patterns
}

/**
 * Detect day-of-week patterns
 */
export function detectWeekdayPatterns(
  logs: Array<{ loggedAt: Date }>
): Array<{ day: number; dayName: string; count: number }> {
  const dayCounts: Record<number, number> = {}
  
  logs.forEach(log => {
    const day = new Date(log.loggedAt).getDay()
    dayCounts[day] = (dayCounts[day] || 0) + 1
  })

  const dayNames = ["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"]
  
  return Object.entries(dayCounts)
    .map(([day, count]) => ({
      day: parseInt(day),
      dayName: dayNames[parseInt(day)],
      count
    }))
    .sort((a, b) => b.count - a.count)
}

/**
 * Generate insights from patterns
 */
export function generateInsights(
  cigaretteLogs: CigaretteLog[],
  cravingLogs: CravingLog[]
): PatternInsight[] {
  const insights: PatternInsight[] = []
  const allLogs = [...cigaretteLogs, ...cravingLogs]

  if (allLogs.length < 5) {
    // Not enough data yet
    return [{
      type: "insufficient_data",
      title: "Prikupljamo podatke",
      description: "Nastavi bilježiti cigarete i želje kako bi vidjeli obrasce.",
      confidence: 1.0,
      data: {}
    }]
  }

  // Time of day pattern
  const timePatterns = detectTimePatterns(allLogs)
  if (timePatterns.length > 0 && timePatterns[0].percentage > 20) {
    const topHour = timePatterns[0]
    const timeRange = `${topHour.hour}:00 - ${topHour.hour + 1}:00`
    insights.push({
      type: "time_of_day",
      title: `Najviše želja javlja se između ${timeRange}`,
      description: `${topHour.percentage.toFixed(0)}% tvoje želje za cigaretom događa se u ovom periodu. Pripremi se unaprijed s alternativnom aktivnošću.`,
      confidence: Math.min(topHour.percentage / 50, 1.0),
      data: { hour: topHour.hour, count: topHour.count, percentage: topHour.percentage }
    })
  }

  // Trigger pattern
  const triggerPatterns = detectTriggerPatterns([...cigaretteLogs, ...cravingLogs])
  if (triggerPatterns.length > 0 && triggerPatterns[0].percentage > 25) {
    const topTrigger = triggerPatterns[0]
    const triggerLabels: Record<TriggerType, string> = {
      STRESS: "stres",
      COFFEE: "kava",
      ALCOHOL: "alkohol",
      SOCIAL: "društvo",
      BOREDOM: "dosada",
      AFTER_MEAL: "nakon obroka",
      DRIVING: "vožnja",
      OTHER: "ostalo"
    }
    
    insights.push({
      type: "trigger_frequency",
      title: `Najčešći okidač je ${triggerLabels[topTrigger.trigger]}`,
      description: `${topTrigger.percentage.toFixed(0)}% tvojih cigareta povezano je s ovim okidačem. Razmisli o alternativama u tim situacijama.`,
      confidence: Math.min(topTrigger.percentage / 40, 1.0),
      data: { trigger: topTrigger.trigger, count: topTrigger.count, percentage: topTrigger.percentage }
    })
  }

  // Weekend vs weekday pattern
  const weekdayPatterns = detectWeekdayPatterns(allLogs)
  const weekendLogs = weekdayPatterns.filter(p => p.day === 0 || p.day === 6).reduce((sum, p) => sum + p.count, 0)
  const weekdayLogs = weekdayPatterns.filter(p => p.day > 0 && p.day < 6).reduce((sum, p) => sum + p.count, 0)
  
  if (weekendLogs > weekdayLogs * 1.5) {
    insights.push({
      type: "weekly_pattern",
      title: "Vikendom imaš više želja",
      description: "社交 situacije ili opušteniji raspored mogu biti okidači. Pripremi plan za vikend.",
      confidence: 0.7,
      data: { weekendCount: weekendLogs, weekdayCount: weekdayLogs }
    })
  }

  return insights
}

/**
 * Predict high-risk windows based on historical data
 */
export function predictRiskWindows(
  cigaretteLogs: CigaretteLog[],
  cravingLogs: CravingLog[]
): Array<{ hour: number; riskScore: number; triggers: TriggerType[] }> {
  const allLogs = [...cigaretteLogs, ...cravingLogs]
  
  if (allLogs.length < 10) {
    return [] // Not enough data
  }

  const timePatterns = detectTimePatterns(allLogs)
  const triggerPatterns = detectTriggerPatterns(allLogs)
  
  // Calculate risk score for each hour
  return timePatterns
    .filter(p => p.percentage > 10)
    .map(pattern => ({
      hour: pattern.hour,
      riskScore: pattern.percentage / 100,
      triggers: triggerPatterns.slice(0, 2).map(t => t.trigger)
    }))
    .sort((a, b) => b.riskScore - a.riskScore)
}
