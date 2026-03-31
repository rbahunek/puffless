/**
 * Kodelab Izazov - Special Company Challenge
 * Dates: 01.04.2026 - 30.04.2026
 */

import { KodelabStrategy } from "@prisma/client"

export const KODELAB_CONFIG = {
  name: "Kodelab izazov",
  startDate: new Date("2026-04-01T00:00:00"),
  endDate: new Date("2026-04-30T23:59:59"),
  registrationCloseDate: new Date("2026-04-01T23:59:59"),
  fantasyBudget: 100, // Puff bodova
}

export type KodelabState = "najava" | "prijave_otvorene" | "aktivno" | "prijave_zatvorene" | "završeno"

/**
 * Determine current Kodelab challenge state based on current date
 */
export function getKodelabState(now: Date = new Date()): KodelabState {
  const { startDate, endDate, registrationCloseDate } = KODELAB_CONFIG

  if (now < startDate) {
    return "najava"
  }

  if (now >= startDate && now <= registrationCloseDate) {
    return "prijave_otvorene"
  }

  if (now > registrationCloseDate && now <= endDate) {
    return "prijave_zatvorene"
  }

  if (now > endDate) {
    return "završeno"
  }

  return "aktivno"
}

/**
 * Check if registrations are still open
 */
export function canRegisterForKodelab(now: Date = new Date()): boolean {
  const state = getKodelabState(now)
  return state === "najava" || state === "prijave_otvorene"
}

/**
 * Calculate self score from survey responses (0-100)
 */
export function calculateSelfScore(survey: {
  motivation: number // 1-10
  difficulty: number // 1-10
  previousAttempts: string
  hasSupport: string
  successBelief: number // 1-10
  strategy: KodelabStrategy
}): number {
  let score = 0

  // Motivation (0-30 points)
  score += (survey.motivation / 10) * 30

  // Difficulty (inverted - lower difficulty = higher score, 0-20 points)
  score += ((10 - survey.difficulty) / 10) * 20

  // Previous attempts (0-15 points)
  const attemptsScore = {
    never: 15, // No previous attempts might mean less experience
    "1-2": 12, // Some attempts show learning
    many: 8, // Many attempts might indicate harder challenge
  }
  score += attemptsScore[survey.previousAttempts as keyof typeof attemptsScore] || 10

  // Support (0-15 points)
  const supportScore = {
    yes: 15,
    partial: 10,
    no: 5,
  }
  score += supportScore[survey.hasSupport as keyof typeof supportScore] || 10

  // Success belief (0-15 points)
  score += (survey.successBelief / 10) * 15

  // Strategy (0-5 points)
  const strategyScore = {
    FULL_QUIT: 5,
    MAJOR_REDUCTION: 3,
    TRYING: 2,
  }
  score += strategyScore[survey.strategy] || 2

  return Math.min(Math.max(score, 0), 100)
}

/**
 * Calculate final probability from self score and crowd score
 */
export function calculateProbability(selfScore: number, crowdScore: number): number {
  const selfNormalized = selfScore / 100 // 0-1
  const crowdNormalized = crowdScore / 5 // 0-1

  // Weighted combination
  const probability = 0.6 * selfNormalized + 0.4 * crowdNormalized

  return Math.min(Math.max(probability, 0.05), 0.95) // Clamp to 5%-95%
}

/**
 * Calculate odds coefficient from probability
 */
export function calculateCoefficient(probability: number): number {
  const rawOdds = 1 / probability
  
  // Clamp to reasonable range 1.20 - 5.00
  return Math.min(Math.max(rawOdds, 1.2), 5.0)
}

/**
 * Calculate fantasy winnings
 */
export function calculateFantasyWinnings(
  allocatedPoints: number,
  coefficient: number,
  participantSucceeded: boolean
): number {
  if (!participantSucceeded) {
    return 0 // Lost all allocated points
  }

  return allocatedPoints * coefficient
}

/**
 * Get state labels in Croatian
 */
export function getKodelabStateLabel(state: KodelabState): string {
  const labels: Record<KodelabState, string> = {
    najava: "Najava",
    prijave_otvorene: "Prijave otvorene",
    aktivno: "Aktivno",
    prijave_zatvorene: "Prijave zatvorene",
    završeno: "Završeno",
  }
  return labels[state]
}

/**
 * Get confidence label in Croatian
 */
export function getConfidenceLabel(confidence: number): string {
  const labels: Record<number, string> = {
    1: "Vrlo mala vjerojatnost",
    2: "Teško, ali moguće",
    3: "Solidna šansa",
    4: "Vrlo izgledno",
    5: "Gotovo sigurno",
  }
  return labels[confidence] || "Nepoznato"
}
