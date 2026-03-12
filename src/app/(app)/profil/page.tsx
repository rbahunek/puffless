import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ProfileClient } from "./profile-client"

export default async function ProfilPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/prijava")

  const userId = session.user.id

  const [profile, activeProgram, achievements] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.program.findFirst({
      where: { userId, status: { in: ["ACTIVE", "NEEDS_FOCUS"] } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { unlockedAt: "desc" },
    }),
  ])

  if (!profile?.onboardingCompleted) redirect("/onboarding")

  return (
    <ProfileClient
      user={{
        id: userId,
        name: session.user.name,
        email: session.user.email,
      }}
      profile={{
        displayName: profile?.displayName,
        cigarettesPerDay: profile?.cigarettesPerDay || 20,
        cigarettesPerPack: profile?.cigarettesPerPack || 20,
        pricePerPack: profile?.pricePerPack || 4.0,
        quitDate: profile?.quitDate?.toISOString() || new Date().toISOString(),
        triggers: profile?.triggers || [],
      }}
      activeProgram={activeProgram ? {
        type: activeProgram.type,
        status: activeProgram.status,
        startDate: activeProgram.startDate.toISOString(),
        graceUsed: activeProgram.graceUsed,
        graceLimit: activeProgram.graceLimit,
      } : null}
      achievements={achievements.map((a) => ({
        key: a.achievement.key,
        name: a.achievement.name,
        description: a.achievement.description,
        icon: a.achievement.icon,
        unlockedAt: a.unlockedAt.toISOString(),
      }))}
    />
  )
}
