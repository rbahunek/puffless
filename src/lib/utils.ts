import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("hr-HR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("hr-HR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d)
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("hr-HR", {
    day: "numeric",
    month: "short",
  }).format(d)
}

export function getDaysSince(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

export function getHoursSince(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60))
}

export function getMinutesSince(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  return Math.floor(diffMs / (1000 * 60))
}

export function calculateMoneySaved(
  cigarettesPerDay: number,
  cigarettesPerPack: number,
  pricePerPack: number,
  daysSinceQuit: number
): {
  total: number
  daily: number
  weekly: number
  monthly: number
  cigarettesAvoided: number
  costPerCigarette: number
} {
  const costPerCigarette = pricePerPack / cigarettesPerPack
  const dailySavings = cigarettesPerDay * costPerCigarette
  const total = dailySavings * daysSinceQuit
  const weekly = dailySavings * 7
  const monthly = dailySavings * 30
  const cigarettesAvoided = cigarettesPerDay * daysSinceQuit

  return {
    total,
    daily: dailySavings,
    weekly,
    monthly,
    cigarettesAvoided,
    costPerCigarette,
  }
}

export function getMoneyEquivalent(amount: number): string {
  if (amount < 2) return "malo više od ništa — ali svaki cent broji!"
  if (amount < 5) return "to je kava u kafiću"
  if (amount < 10) return "to su 2-3 kave"
  if (amount < 15) return "to je ručak vani"
  if (amount < 25) return "to je pizza i piće"
  if (amount < 50) return "to je večera za dvoje"
  if (amount < 100) return "to je mali fond za izlet"
  if (amount < 200) return "to je vikend putovanje"
  if (amount < 500) return "to je lijepa nagrada za tebe"
  return "to je pravi mali fond za nešto posebno!"
}

export function getProgramGraceLimit(type: string): number {
  switch (type) {
    case "TEN_DAY": return 3
    case "FOURTEEN_DAY": return 4
    case "THIRTY_DAY": return 6
    default: return 3
  }
}

export function getProgramDuration(type: string): number {
  switch (type) {
    case "TEN_DAY": return 10
    case "FOURTEEN_DAY": return 14
    case "THIRTY_DAY": return 30
    default: return 10
  }
}

export function getProgramName(type: string): string {
  switch (type) {
    case "TEN_DAY": return "10-dnevni reset"
    case "FOURTEEN_DAY": return "14-dnevni izazov"
    case "THIRTY_DAY": return "30-dnevni izazov"
    default: return "Program"
  }
}

export function getTriggerLabel(trigger: string): string {
  const labels: Record<string, string> = {
    STRESS: "Stres",
    COFFEE: "Kava",
    ALCOHOL: "Alkohol",
    SOCIAL: "Društvo",
    BOREDOM: "Dosada",
    AFTER_MEAL: "Nakon obroka",
    DRIVING: "Vožnja",
    OTHER: "Ostalo",
  }
  return labels[trigger] || trigger
}

export function getGraceStatusMessage(used: number, limit: number): {
  message: string
  color: string
  isWarning: boolean
} {
  const remaining = limit - used
  if (used === 0) {
    return {
      message: "Odlično! Još nisi iskoristio/la nijednu grace cigaretu.",
      color: "text-emerald-600",
      isWarning: false,
    }
  }
  if (remaining > 1) {
    return {
      message: `Iskoristio/la si ${used} od ${limit} grace cigareta. I dalje si na pravom putu.`,
      color: "text-amber-600",
      isWarning: false,
    }
  }
  if (remaining === 1) {
    return {
      message: `Pazi — ostala ti je samo 1 grace cigareta. Možeš to!`,
      color: "text-orange-600",
      isWarning: true,
    }
  }
  return {
    message: "Program je uzdrman, ali nije kraj. Nastavi dalje!",
    color: "text-red-600",
    isWarning: true,
  }
}

export function generateInviteCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
