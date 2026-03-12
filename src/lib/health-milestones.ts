export interface HealthMilestone {
  key: string
  timeMinutes: number
  title: string
  description: string
  icon: string
}

export const HEALTH_MILESTONES: HealthMilestone[] = [
  {
    key: "20_minutes",
    timeMinutes: 20,
    title: "20 minuta",
    description: "Puls i krvni tlak počinju se stabilizirati.",
    icon: "❤️",
  },
  {
    key: "8_hours",
    timeMinutes: 8 * 60,
    title: "8 sati",
    description: "Razina ugljičnog monoksida u krvi pada na normalnu razinu.",
    icon: "🫁",
  },
  {
    key: "24_hours",
    timeMinutes: 24 * 60,
    title: "24 sata",
    description: "Tijelo započinje oporavak. Rizik od srčanog udara počinje padati.",
    icon: "💪",
  },
  {
    key: "48_hours",
    timeMinutes: 48 * 60,
    title: "48 sati",
    description: "Osjeti okusa i mirisa postaju izraženiji. Živčani završeci se obnavljaju.",
    icon: "👃",
  },
  {
    key: "72_hours",
    timeMinutes: 72 * 60,
    title: "3 dana",
    description: "Bronhijalne cijevi se opuštaju. Disanje postaje lakše.",
    icon: "🌬️",
  },
  {
    key: "2_weeks",
    timeMinutes: 14 * 24 * 60,
    title: "2 tjedna",
    description: "Cirkulacija i disanje mogu biti primjetno bolji.",
    icon: "🏃",
  },
  {
    key: "1_month",
    timeMinutes: 30 * 24 * 60,
    title: "1 mjesec",
    description: "Svakodnevno disanje može biti lakše. Kašalj i kratkoća daha se smanjuju.",
    icon: "🌟",
  },
  {
    key: "3_months",
    timeMinutes: 90 * 24 * 60,
    title: "3 mjeseca",
    description: "Plućna funkcija se poboljšava za do 30%. Energija raste.",
    icon: "⚡",
  },
  {
    key: "1_year",
    timeMinutes: 365 * 24 * 60,
    title: "1 godina",
    description: "Rizik od koronarne bolesti srca prepolovljen u usporedbi s pušačem.",
    icon: "🏆",
  },
]

export function getAchievedMilestones(minutesSinceQuit: number): HealthMilestone[] {
  return HEALTH_MILESTONES.filter((m) => minutesSinceQuit >= m.timeMinutes)
}

export function getNextMilestone(minutesSinceQuit: number): HealthMilestone | null {
  return HEALTH_MILESTONES.find((m) => minutesSinceQuit < m.timeMinutes) || null
}

export function getTimeUntilNextMilestone(minutesSinceQuit: number): {
  milestone: HealthMilestone | null
  minutesRemaining: number
  percentComplete: number
} {
  const next = getNextMilestone(minutesSinceQuit)
  if (!next) {
    return { milestone: null, minutesRemaining: 0, percentComplete: 100 }
  }

  const prev = HEALTH_MILESTONES[HEALTH_MILESTONES.indexOf(next) - 1]
  const prevTime = prev ? prev.timeMinutes : 0
  const totalRange = next.timeMinutes - prevTime
  const elapsed = minutesSinceQuit - prevTime
  const percentComplete = Math.min(100, Math.max(0, (elapsed / totalRange) * 100))

  return {
    milestone: next,
    minutesRemaining: next.timeMinutes - minutesSinceQuit,
    percentComplete,
  }
}
