import { CoachMessageContext } from "@prisma/client"

export interface CoachMessageOptions {
  context: CoachMessageContext
  userName?: string
  streakDays?: number
  moneySaved?: number
  cigarettesAvoided?: number
  graceUsed?: number
  graceLimit?: number
  milestone?: string
}

/**
 * Puffless Coach - Supportive message generator
 */
export function generateCoachMessage(options: CoachMessageOptions): string {
  const { context, userName, streakDays, moneySaved, cigarettesAvoided, graceUsed, graceLimit } = options

  const name = userName ? userName.split(" ")[0] : ""

  switch (context) {
    case "DASHBOARD":
      return getDashboardMessage({ name, streakDays, cigarettesAvoided })
    
    case "CRAVING_MODAL":
      return getCravingMessage({ name })
    
    case "END_OF_DAY":
      return getEndOfDayMessage({ name, cigarettesAvoided })
    
    case "MILESTONE":
      return getMilestoneMessage({ name, milestone: options.milestone })
    
    case "DIFFICULT_MOMENT":
      return getDifficultMomentMessage({ name })
    
    case "STREAK":
      return getStreakMessage({ name, streakDays })
    
    case "GRACE_USED":
      return getGraceMessage({ name, graceUsed, graceLimit })
    
    default:
      return "Nastavi tako! Svaki korak broji."
  }
}

function getDashboardMessage(data: any): string {
  const messages = [
    `Svakim danom postaje lakše. Nastavi tako!`,
    `Tvoje tijelo već osjeća promjenu. Nastavi korak po korak.`,
    `Svaki dan bez nikotina je pobjeda. Ponosni smo na tebe!`,
    `Gradimo navike lagano, bez pritiska. Odlično napreduješ.`,
    `Već si preskočio/la ${data.cigarettesAvoided || 0} nikotinskih kriza. To je nevjerojatno!`,
  ]

  if (data.streakDays > 7) {
    messages.push(`${data.streakDays} dana! Tvoj tijelo te već hvali.`)
  }

  if (data.streakDays > 14) {
    messages.push(`Više od 2 tjedna! Velika većina fizičkih simptoma već prolazi.`)
  }

  return messages[Math.floor(Math.random() * messages.length)]
}

function getCravingMessage(data: any): string {
  const messages = [
    `Nikotinska kriza prolazi za par minuta. Možeš izdržati.`,
    `Odličan posao što si prepoznao/la krizu. Probaj duboko disanje.`,
    `Ovo je privremeno. Tijelo se prilagođava novim navikama.`,
    `Svaki put kad prevladaš krizu, moždane veze postaju jače.`,
    `Popij čašu vode i čekaj 3 minute. Kriza će oslabjeti.`,
    `Prisjetit se zašto si počeo/la. Ti razlozi su i dalje tu.`,
  ]

  return messages[Math.floor(Math.random() * messages.length)]
}

function getEndOfDayMessage(data: any): string {
  const messages = [
    `Danas si napravio/la veliki korak. Budi ponosan/na.`,
    `Još jedan dan iza tebe. Svaki dan je mala pobjeda.`,
    `Tvoj napredak je stvaran. Nastavi ovim tempom.`,
    `Možda je bilo teško, ali izdržao/la si. To je ono što broji.`,
  ]

  if (data.cigarettesAvoided > 10) {
    messages.push(`Danas si preskočio/la ${data.cigarettesAvoided} cigareta! Nevjerojatan rezultat.`)
  }

  return messages[Math.floor(Math.random() * messages.length)]
}

function getMilestoneMessage(data: any): string {
  if (data.milestone === "24_hours") {
    return "🎉 Čestitamo! Prva 24 sata su najtežа. Već si uspio/la!"
  }
  
  if (data.milestone === "3_days") {
    return "💪 3 dana! Nikotin već napušta tijelo. Nastavi ovako!"
  }
  
  if (data.milestone === "1_week") {
    return "🌟 Tjedan dana! Ovo je ogromna prekretnica. Ponosni smo na tebe!"
  }
  
  if (data.milestone === "2_weeks") {
    return "🚀 Dva tjedna! Cirkulacija i pluća već rade bolje!"
  }

  return "🎊 Još jedna prekretnica postignuta! Svaka ti čast!"
}

function getDifficultMomentMessage(data: any): string {
  const messages = [
    `${data.name}, znam da je teško. Ali već si dokazao/la da možeš.`,
    `Teški trenutci prolaze. Ti si jači/a nego što misliš.`,
    `Pamti koliko si već stigao/la. Ne odustaji sad.`,
    `Kontaktiraj prijatelja, prošetaj, popij vode. Ova želja će proći.`,
    `Svaki težak trenutak koji prevladaš čini te jačim/om.`,
  ]

  return messages[Math.floor(Math.random() * messages.length)]
}

function getStreakMessage(data: any): string {
  if (!data.streakDays) {
    return "Svaki dan broji. Nastavi graditi svoj streak!"
  }

  if (data.streakDays < 3) {
    return `${data.streakDays} ${data.streakDays === 1 ? "dan" : "dana"}! Odličan početak!`
  }

  if (data.streakDays < 7) {
    return `Već ${data.streakDays} dana! Prvi tjedan je najteži - ti ga osvajаš!`
  }

  if (data.streakDays < 14) {
    return `${data.streakDays} dana bez nikotina! Tvoje tijelo već puno bolje diše.`
  }

  return `Nevjerojatnih ${data.streakDays} dana! To je ozbiljan uspjeh.`
}

function getGraceMessage(data: any): string {
  const remaining = (data.graceLimit || 3) - (data.graceUsed || 0)

  if (data.graceUsed === 1) {
    return `Jedno posrtanje ne briše sav trud. Imaš još ${remaining} grace. Nastavi dalje!`
  }

  if (remaining === 1) {
    return `Pazi - ostao ti je samo 1 grace. Ali vjerujemo u tebe!`
  }

  if (remaining === 0) {
    return `Iskoristio/la si sve grace, ali to ne znači da si propao/la. Program je uzdrman, ali još uvijek možeš nastaviti. Fokusiraj se na sljedeći dan.`
  }

  return `Iskoristio/la si ${data.graceUsed} od ${data.graceLimit} grace. To je okej - napredak je važniji od savršenstva.`
}

/**
 * Get time-sensitive suggestion based on risk windows
 */
export function getTimeSensitiveSuggestion(
  currentHour: number,
  riskWindows: Array<{ hour: number; riskScore: number }>
): string | null {
  const upcomingRisk = riskWindows.find(w => 
    w.hour === currentHour || w.hour === currentHour + 1
  )

  if (!upcomingRisk) {
    return null
  }

  const suggestions = [
    "Obično imaš nikotinsku krizu u ovo vrijeme. Probaj sada uzeti čašu vode.",
    "Uskoro dolazi tvoje rizično vrijeme. Pripremi se s dubokim disanjem.",
    "U ovo doba dana obično dobiješ krizu. Možda kratka šetnja?",
    "Tvoji obrasci pokazuju da uskoro može doći nikotinska kriza. Budi spreman/na.",
  ]

  return suggestions[Math.floor(Math.random() * suggestions.length)]
}
