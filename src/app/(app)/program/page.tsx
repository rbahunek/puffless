import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ProgramClient } from "./program-client"
import { getDaysSince } from "@/lib/utils"
import { TEN_DAY_PROGRAM } from "@/lib/program-data"

export default async function ProgramPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/prijava")

  const userId = session.user.id

  const [profile, activeProgram, dailyProgressList] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.program.findFirst({
      where: { userId, status: { in: ["ACTIVE", "NEEDS_FOCUS"] } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.dailyProgress.findMany({
      where: { userId },
      orderBy: { date: "asc" },
    }),
  ])

  if (!profile?.onboardingCompleted) redirect("/onboarding")

  const programDay = activeProgram
    ? Math.min(
        getDaysSince(activeProgram.startDate) + 1,
        activeProgram.type === "TEN_DAY" ? 10 : activeProgram.type === "FOURTEEN_DAY" ? 14 : 30
      )
    : 1

  const completedDays = dailyProgressList
    .filter((p) => p.taskCompleted)
    .map((p) => {
      const d = new Date(p.date)
      const start = activeProgram ? new Date(activeProgram.startDate) : new Date()
      return Math.floor((d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    })

  return (
    <ProgramClient
      program={activeProgram ? {
        id: activeProgram.id,
        type: activeProgram.type,
        status: activeProgram.status,
        startDate: activeProgram.startDate.toISOString(),
        graceUsed: activeProgram.graceUsed,
        graceLimit: activeProgram.graceLimit,
        currentDay: programDay,
      } : null}
      programDays={TEN_DAY_PROGRAM}
      completedDays={completedDays}
      currentDay={programDay}
    />
  )
}
