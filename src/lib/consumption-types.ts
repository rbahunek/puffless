import { ConsumptionType } from "@prisma/client"
import { calculateMoneySaved as calculateMoneySavedSmoker } from "./utils"

/**
 * Type-aware labels and calculations for smokers and vapers
 */

export interface ConsumptionLabels {
  // Nouns - for actual consumption
  itemSingular: string // "cigaretu" / "vape"
  itemPlural: string // "cigarete" / "vape"
  itemGenitive: string // "cigareta" / "vape"
  
  // Actions
  actionPresent: string // "pušiš" / "koristiš vape"
  actionPast: string // "popušio/la" / "koristio/la vape"
  actionLog: string // "Zabilježi cigaretu" / "Zabilježi vape"
  actionCraving: string // "Imam nikotinsku krizu" (universal)
  
  // Stats - using "nikotinske krize" for avoided moments
  avoided: string // "Preskočene nikotinske krize" (universal)
  logged: string // "cigareta" / "vape"
  loggedLabel: string // "Cigarete" / "Vape" for UI labels
  
  // Grace
  grace: string // "Grace nikotinske krize" (universal)
  graceUsed: string // "grace iskorišteno"
  
  // User type
  userType: string // "Pušač/ica" / "Vaper/ica"
  activityType: string // "Pušenje" / "Vaping"
}

export function getConsumptionLabels(type: ConsumptionType): ConsumptionLabels {
  if (type === "VAPING") {
    return {
      itemSingular: "vape",
      itemPlural: "vape",
      itemGenitive: "vape",
      actionPresent: "koristiš vape",
      actionPast: "koristio/la vape",
      actionLog: "Zabilježi vape",
      actionCraving: "Imam nikotinsku krizu", // Universal
      avoided: "Preskočene nikotinske krize", // Universal
      logged: "vape",
      loggedLabel: "Vape",
      grace: "Grace vape", // Dynamic for vapers
      graceUsed: "grace iskorišteno",
      userType: "Vaper/ica",
      activityType: "Vaping",
    }
  }

  // Default: SMOKING
  return {
    itemSingular: "cigaretu",
    itemPlural: "cigarete",
    itemGenitive: "cigareta",
    actionPresent: "pušiš",
    actionPast: "popušio/la",
    actionLog: "Zabilježi cigaretu",
    actionCraving: "Imam nikotinsku krizu", // Universal
    avoided: "Preskočene nikotinske krize", // Universal
    logged: "cigareta",
    loggedLabel: "Cigarete",
    grace: "Grace cigarete", // Dynamic for smokers
    graceUsed: "grace iskorišteno",
    userType: "Pušač/ica",
    activityType: "Pušenje",
  }
}

/**
 * Calculate money saved for vapers
 * Keeps existing smoking logic intact, adds parallel vaper logic
 */
export function calculateMoneySavedVaper(
  usagePerDay: number,
  estimatedDailyCost: number,
  daysSinceQuit: number
): {
  total: number
  daily: number
  weekly: number
  monthly: number
  usageAvoided: number
} {
  const dailySavings = estimatedDailyCost
  const total = dailySavings * daysSinceQuit
  const weekly = dailySavings * 7
  const monthly = dailySavings * 30
  const usageAvoided = usagePerDay * daysSinceQuit

  return {
    total,
    daily: dailySavings,
    weekly,
    monthly,
    usageAvoided,
  }
}

/**
 * Get onboarding questions based on consumption type
 */
export function getOnboardingQuestions(type: ConsumptionType) {
  if (type === "VAPING") {
    return {
      usageQuestion: "Koliko puta dnevno koristiš vape?",
      usageHint: "Procijeni prosječan broj puffera ili sesija dnevno",
      costQuestion: "Koliko otprilike trošiš dnevno na vape?",
      costHint: "Tekućina, podovi, ili trošak uređaja podijeljen na dane",
      quitQuestion: "Kada želiš prestati s vapingom?",
    }
  }

  // Default: SMOKING
  return {
    usageQuestion: "Koliko cigareta dnevno pušiš?",
    usageHint: "Prosječan broj cigareta koje popušiš u jednom danu",
    costQuestion: "Kolika je cijena jedne kutije?",
    costHint: "Prosječna cijena kutije cigareta",
    quitQuestion: "Kada želiš prestati pušiti?",
  }
}

/**
 * Format usage count with proper grammar
 */
export function formatUsageCount(count: number, type: ConsumptionType): string {
  const labels = getConsumptionLabels(type)
  
  if (count === 1) {
    return `1 ${labels.itemSingular}`
  }
  
  if (type === "VAPING") {
    return `${count} ${labels.itemGenitive}`
  }
  
  // Smoking grammar rules
  if (count >= 2 && count <= 4) {
    return `${count} ${labels.itemPlural}`
  }
  
  return `${count} ${labels.itemGenitive}`
}

/**
 * Get neutral phrases for mixed contexts (challenges, analytics)
 */
export function getNeutralLabels() {
  return {
    craving: "Imam nikotinsku krizu",
    cravings: "Nikotinske krize",
    logItem: "Zabilježi cigaretu/vape",
    avoided: "Preskočene nikotinske krize",
    grace: "Grace nikotinske krize",
    challenge: "Nikotinski izazov",
    consumption: "Cigarete/vape",
  }
}

/**
 * Universal money calculation - routes to correct logic based on consumption type
 */
export function calculateMoneySavedUniversal(
  consumptionType: ConsumptionType,
  profile: {
    cigarettesPerDay?: number
    cigarettesPerPack?: number
    pricePerPack?: number
    usagePerDay?: number | null
    estimatedDailyCost?: number | null
  },
  daysSinceQuit: number
): {
  total: number
  daily: number
  weekly: number
  monthly: number
  itemsAvoided: number // cigarettes or vape sessions
  costPerItem?: number
} {
  if (consumptionType === "VAPING") {
    const usagePerDay = profile.usagePerDay || 20
    const estimatedDailyCost = profile.estimatedDailyCost || 5.0
    const vaperSavings = calculateMoneySavedVaper(usagePerDay, estimatedDailyCost, daysSinceQuit)
    
    return {
      total: vaperSavings.total,
      daily: vaperSavings.daily,
      weekly: vaperSavings.weekly,
      monthly: vaperSavings.monthly,
      itemsAvoided: vaperSavings.usageAvoided,
      costPerItem: estimatedDailyCost / usagePerDay,
    }
  }

  // Default: SMOKING
  const cigarettesPerDay = profile.cigarettesPerDay || 20
  const cigarettesPerPack = profile.cigarettesPerPack || 20
  const pricePerPack = profile.pricePerPack || 4.0
  const smokerSavings = calculateMoneySavedSmoker(cigarettesPerDay, cigarettesPerPack, pricePerPack, daysSinceQuit)
  
  return {
    total: smokerSavings.total,
    daily: smokerSavings.daily,
    weekly: smokerSavings.weekly,
    monthly: smokerSavings.monthly,
    itemsAvoided: smokerSavings.cigarettesAvoided,
    costPerItem: smokerSavings.costPerCigarette,
  }
}
