import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ChallengeClient } from "./challenge-client"
import { getDaysSince, calculateMoneySaved } from "@/lib/utils"

export default async function IzazovPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/prijava")

  const userId = session.user.id

  const [profile, activeProgram, challenges] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.program.findFirst({
      where: { userId, status: { in: ["ACTIVE", "NEEDS_FOCUS"] } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.challenge.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              include: { profile: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ])

  if (!profile?.onboardingCompleted) redirect("/onboarding")

  const quitDate = profile?.quitDate || new Date()
  const daysSinceQuit = getDaysSince(quitDate)
  const moneySaved = calculateMoneySaved(
    profile?.cigarettesPerDay || 20,
    profile?.cigarettesPerPack || 20,
    profile?.pricePerPack || 4.0,
    daysSinceQuit
  )

  const challengeData = challenges.map((challenge) => ({
    id: challenge.id,
    name: challenge.name,
    type: challenge.type,
    status: challenge.status,
    startDate: challenge.startDate.toISOString(),
    participants: challenge.participants.map((p) => {
      const pDays = getDaysSince(challenge.startDate)
      const pProfile = p.user.profile
      const pMoney = calculateMoneySaved(
        pProfile?.cigarettesPerDay || 20,
        pProfile?.cigarettesPerPack || 20,
        pProfile?.pricePerPack || 4.0,
        pDays
      )
      return {
        userId: p.userId,
        name: p.user.name || p.user.email || "Korisnik",
        graceUsed: p.graceUsed,
        graceLimit: challenge.type === "TEN_DAY" ? 3 : challenge.type === "FOURTEEN_DAY" ? 4 : 6,
        daysSince: pDays,
        moneySaved: pMoney.total,
        cigarettesAvoided: pMoney.cigarettesAvoided,
        isCurrentUser: p.userId === userId,
      }
    }),
  }))

  return (
    <ChallengeClient
      currentUser={{
        daysSinceQuit,
        moneySaved: moneySaved.total,
        cigarettesAvoided: moneySaved.cigarettesAvoided,
        graceUsed: activeProgram?.graceUsed || 0,
        graceLimit: activeProgram?.graceLimit || 3,
      }}
      activeProgram={activeProgram ? {
        id: activeProgram.id,
        type: activeProgram.type,
        status: activeProgram.status,
      } : null}
      challenges={challengeData}
    />
  )
}
