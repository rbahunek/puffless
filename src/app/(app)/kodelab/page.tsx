import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { KodelabClient } from "./kodelab-client"
import { getKodelabState, canRegisterForKodelab, KODELAB_CONFIG } from "@/lib/kodelab"

export default async function KodelabPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/prijava")

  const userId = session.user.id

  // Fetch Kodelab data
  const [userRegistration, allRegistrations, profile] = await Promise.all([
    prisma.kodelabRegistration.findUnique({
      where: { userId },
      include: {
        fantasyRatingsReceived: true,
      },
    }),
    prisma.kodelabRegistration.findMany({
      where: { role: "ACTIVE_PARTICIPANT" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        fantasyRatingsReceived: true,
      },
      orderBy: { coefficient: "asc" }, // Lower coefficient = higher probability
    }),
    prisma.userProfile.findUnique({
      where: { userId },
    }),
  ])

  if (!profile?.onboardingCompleted) redirect("/onboarding")

  const state = getKodelabState()
  const canRegister = canRegisterForKodelab()

  // Calculate fantasy ratings for active participants
  const participantsWithRatings = allRegistrations.map((reg) => {
    const ratings = reg.fantasyRatingsReceived
    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.confidence, 0) / ratings.length
      : null

    const userRating = ratings.find((r) => r.raterId === userId)

    return {
      id: reg.id,
      user: {
        name: reg.user.name,
        email: reg.user.email,
      },
      strategy: reg.strategy,
      selfScore: reg.selfScore,
      crowdScore: reg.crowdScore,
      coefficient: reg.coefficient,
      avgRating,
      userRating: userRating?.confidence || null,
      totalConsumption: reg.totalConsumption,
      completedChallenge: reg.completedChallenge,
    }
  })

  // Get user's fantasy allocations if fantasy participant
  let fantasyAllocations: any[] = []
  if (userRegistration?.role === "FANTASY_PARTICIPANT") {
    fantasyAllocations = await prisma.fantasyAllocation.findMany({
      where: { userId },
    })
  }

  return (
    <KodelabClient
      state={state}
      canRegister={canRegister}
      config={KODELAB_CONFIG}
      userRegistration={userRegistration ? {
        id: userRegistration.id,
        role: userRegistration.role,
        strategy: userRegistration.strategy,
        selfScore: userRegistration.selfScore,
        coefficient: userRegistration.coefficient,
        totalConsumption: userRegistration.totalConsumption,
      } : null}
      participants={participantsWithRatings}
      fantasyAllocations={fantasyAllocations}
      consumptionType={profile?.consumptionType || "SMOKING"}
      isFantasyParticipant={userRegistration?.role === "FANTASY_PARTICIPANT"}
    />
  )
}
