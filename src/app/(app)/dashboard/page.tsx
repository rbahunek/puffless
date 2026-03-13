import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { DashboardClient } from "./dashboard-client"
import { calculateMoneySaved, getDaysSince, getMinutesSince } from "@/lib/utils"
import { getAchievedMilestones, getNextMilestone } from "@/lib/health-milestones"
import { getDailyMotivation } from "@/lib/program-data"
import { generateCoachMessage } from "@/lib/coach-messages"
import { predictRiskWindows, generateInsights } from "@/lib/pattern-detection"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/prijava")

  const userId = session.user.id

  // Fetch user data
  const [profile, activeProgram, recentCigaretteLogs, recentCravingLogs, todayProgress, allCigaretteLogs, allCravingLogs, todayMoodCheckin] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.program.findFirst({
      where: { userId, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.cigaretteLog.findMany({
      where: { userId },
      orderBy: { loggedAt: "desc" },
      take: 5,
    }),
    prisma.cravingLog.findMany({
      where: { userId },
      orderBy: { loggedAt: "desc" },
      take: 5,
    }),
    prisma.dailyProgress.findFirst({
      where: {
        userId,
        date: new Date(new Date().toISOString().split("T")[0]),
      },
    }),
    prisma.cigaretteLog.findMany({
      where: { userId },
      orderBy: { loggedAt: "desc" },
      take: 100,
    }),
    prisma.cravingLog.findMany({
      where: { userId },
      orderBy: { loggedAt: "desc" },
      take: 100,
    }),
    prisma.moodCheckin.findFirst({
      where: {
        userId,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ])

  // Redirect to onboarding if not completed
  if (!profile?.onboardingCompleted) {
    redirect("/onboarding")
  }

  const quitDate = profile?.quitDate || new Date()
  const daysSinceQuit = getDaysSince(quitDate)
  const minutesSinceQuit = getMinutesSince(quitDate)

  const moneySaved = calculateMoneySaved(
    profile?.cigarettesPerDay || 20,
    profile?.cigarettesPerPack || 20,
    profile?.pricePerPack || 4.0,
    daysSinceQuit
  )

  const achievedMilestones = getAchievedMilestones(minutesSinceQuit)
  const nextMilestone = getNextMilestone(minutesSinceQuit)
  const dailyMotivation = getDailyMotivation(daysSinceQuit)

  const programDay = activeProgram
    ? Math.min(
        getDaysSince(activeProgram.startDate) + 1,
        activeProgram.type === "TEN_DAY" ? 10 : activeProgram.type === "FOURTEEN_DAY" ? 14 : 30
      )
    : 0

  // Generate smart features
  const insights = generateInsights(allCigaretteLogs, allCravingLogs)
  const riskWindows = predictRiskWindows(allCigaretteLogs, allCravingLogs)
  const currentHour = new Date().getHours()
  const upcomingRisk = riskWindows.find(w => w.hour === currentHour || w.hour === currentHour + 1)
  
  const coachMessage = generateCoachMessage({
    context: "DASHBOARD",
    userName: session.user.name || undefined,
    streakDays: daysSinceQuit,
    cigarettesAvoided: moneySaved.cigarettesAvoided,
    graceUsed: activeProgram?.graceUsed,
    graceLimit: activeProgram?.graceLimit,
  })

  return (
    <DashboardClient
      user={{
        name: session.user.name,
        email: session.user.email,
      }}
      profile={{
        displayName: profile?.displayName,
        cigarettesPerDay: profile?.cigarettesPerDay || 20,
        cigarettesPerPack: profile?.cigarettesPerPack || 20,
        pricePerPack: profile?.pricePerPack || 4.0,
        quitDate: quitDate.toISOString(),
        triggers: profile?.triggers || [],
      }}
      program={activeProgram ? {
        id: activeProgram.id,
        type: activeProgram.type,
        status: activeProgram.status,
        startDate: activeProgram.startDate.toISOString(),
        graceUsed: activeProgram.graceUsed,
        graceLimit: activeProgram.graceLimit,
        currentDay: programDay,
        isWithFriend: activeProgram.isWithFriend,
      } : null}
      stats={{
        daysSinceQuit,
        moneySaved: moneySaved.total,
        moneySavedDaily: moneySaved.daily,
        cigarettesAvoided: moneySaved.cigarettesAvoided,
        achievedMilestones: achievedMilestones.length,
        totalMilestones: 9,
      }}
      nextMilestone={nextMilestone ? {
        title: nextMilestone.title,
        description: nextMilestone.description,
        icon: nextMilestone.icon,
        minutesRemaining: nextMilestone.timeMinutes - minutesSinceQuit,
      } : null}
      achievedMilestones={achievedMilestones.map(m => ({
        key: m.key,
        title: m.title,
        description: m.description,
        icon: m.icon,
      }))}
      dailyMotivation={dailyMotivation}
      recentLogs={{
        cigarettes: recentCigaretteLogs.map(l => ({
          id: l.id,
          trigger: l.trigger,
          loggedAt: l.loggedAt.toISOString(),
          isGrace: l.isGrace,
        })),
        cravings: recentCravingLogs.map(l => ({
          id: l.id,
          trigger: l.trigger,
          resolved: l.resolved,
          loggedAt: l.loggedAt.toISOString(),
        })),
      }}
      todayProgress={todayProgress ? {
        cigarettesSmoked: todayProgress.cigarettesSmoked,
        cravingsLogged: todayProgress.cravingsLogged,
        cravingsResolved: todayProgress.cravingsResolved,
        taskCompleted: todayProgress.taskCompleted,
      } : null}
      smartFeatures={{
        coachMessage,
        hasCheckedInToday: !!todayMoodCheckin,
        upcomingRisk: upcomingRisk ? {
          hour: upcomingRisk.hour,
          riskScore: upcomingRisk.riskScore,
          triggers: upcomingRisk.triggers,
        } : null,
        topInsight: insights[0] || null,
      }}
    />
  )
}
