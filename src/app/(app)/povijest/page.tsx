import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { HistoryClient } from "./history-client"

export default async function PovijestPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/prijava")

  const userId = session.user.id

  const [profile, cigaretteLogs, cravingLogs, dailyProgress] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.cigaretteLog.findMany({
      where: { userId },
      orderBy: { loggedAt: "desc" },
      take: 50,
    }),
    prisma.cravingLog.findMany({
      where: { userId },
      orderBy: { loggedAt: "desc" },
      take: 50,
    }),
    prisma.dailyProgress.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 30,
    }),
  ])

  if (!profile?.onboardingCompleted) redirect("/onboarding")

  // Calculate trigger analytics
  const triggerCounts: Record<string, number> = {}
  cigaretteLogs.forEach((log) => {
    if (log.trigger) {
      triggerCounts[log.trigger] = (triggerCounts[log.trigger] || 0) + 1
    }
  })
  cravingLogs.forEach((log) => {
    if (log.trigger) {
      triggerCounts[log.trigger] = (triggerCounts[log.trigger] || 0) + 1
    }
  })

  const topTriggers = Object.entries(triggerCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([trigger, count]) => ({ trigger, count }))

  // Calculate time of day analytics
  const hourCounts: Record<number, number> = {}
  cravingLogs.forEach((log) => {
    const hour = new Date(log.loggedAt).getHours()
    hourCounts[hour] = (hourCounts[hour] || 0) + 1
  })

  const peakHour = Object.entries(hourCounts)
    .sort(([, a], [, b]) => b - a)[0]

  return (
    <HistoryClient
      cigaretteLogs={cigaretteLogs.map((l) => ({
        id: l.id,
        trigger: l.trigger,
        note: l.note,
        isGrace: l.isGrace,
        loggedAt: l.loggedAt.toISOString(),
      }))}
      cravingLogs={cravingLogs.map((l) => ({
        id: l.id,
        trigger: l.trigger,
        note: l.note,
        resolved: l.resolved,
        resolutionType: l.resolutionType,
        loggedAt: l.loggedAt.toISOString(),
      }))}
      dailyProgress={dailyProgress.map((p) => ({
        date: p.date.toISOString(),
        cigarettesSmoked: p.cigarettesSmoked,
        cravingsLogged: p.cravingsLogged,
        cravingsResolved: p.cravingsResolved,
        taskCompleted: p.taskCompleted,
      }))}
      analytics={{
        topTriggers,
        peakHour: peakHour ? parseInt(peakHour[0]) : null,
        totalCigarettes: cigaretteLogs.length,
        totalCravings: cravingLogs.length,
        resolvedCravings: cravingLogs.filter((l) => l.resolved).length,
      }}
    />
  )
}
