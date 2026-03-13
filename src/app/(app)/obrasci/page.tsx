import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PatternInsightsClient } from "./patterns-client"

export default async function ObrasciPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/prijava")
  }

  // Fetch user logs
  const [cigaretteLogs, cravingLogs, insights] = await Promise.all([
    prisma.cigaretteLog.findMany({
      where: { userId: session.user.id },
      orderBy: { loggedAt: "desc" },
      take: 100,
    }),
    prisma.cravingLog.findMany({
      where: { userId: session.user.id },
      orderBy: { loggedAt: "desc" },
      take: 100,
    }),
    prisma.patternInsight.findMany({
      where: { userId: session.user.id, isActive: true },
      orderBy: { confidence: "desc" },
    }),
  ])

  return (
    <PatternInsightsClient
      cigaretteLogs={JSON.parse(JSON.stringify(cigaretteLogs))}
      cravingLogs={JSON.parse(JSON.stringify(cravingLogs))}
      existingInsights={JSON.parse(JSON.stringify(insights))}
    />
  )
}
