import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateInsights, predictRiskWindows } from "@/lib/pattern-detection"
import { generateCoachMessage, getTimeSensitiveSuggestion } from "@/lib/coach-messages"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Fetch logs for analysis
    const [cigaretteLogs, cravingLogs, profile] = await Promise.all([
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
      prisma.userProfile.findUnique({
        where: { userId },
      }),
    ])

    // Generate insights
    const insights = generateInsights(cigaretteLogs, cravingLogs)

    // Store new insights in database
    for (const insight of insights) {
      await prisma.patternInsight.upsert({
        where: {
          userId_type: {
            userId,
            type: insight.type,
          },
        },
        update: {
          title: insight.title,
          description: insight.description || "",
          data: JSON.stringify(insight.data),
          confidence: insight.confidence,
          isActive: true,
        },
        create: {
          userId,
          type: insight.type,
          title: insight.title,
          description: insight.description || "",
          data: JSON.stringify(insight.data),
          confidence: insight.confidence,
        },
      })
    }

    // Generate risk windows
    const riskWindows = predictRiskWindows(cigaretteLogs, cravingLogs)
    const currentHour = new Date().getHours()
    const timeSensitiveSuggestion = getTimeSensitiveSuggestion(currentHour, riskWindows)

    // Generate coach message
    const coachMessage = generateCoachMessage({
      context: "DASHBOARD",
      userName: session.user.name || undefined,
      cigarettesAvoided: cigaretteLogs.length,
    })

    // Store prediction if there's a suggestion
    if (timeSensitiveSuggestion && riskWindows.length > 0) {
      const upcomingRisk = riskWindows.find(w => w.hour === currentHour || w.hour === currentHour + 1)
      
      if (upcomingRisk) {
        await prisma.cravingPrediction.create({
          data: {
            userId,
            predictedTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
            riskScore: upcomingRisk.riskScore,
            basedOnTriggers: upcomingRisk.triggers,
            basedOnTimes: [upcomingRisk.hour.toString()],
            suggestion: timeSensitiveSuggestion,
          },
        })
      }
    }

    return NextResponse.json({
      insights,
      riskWindows,
      timeSensitiveSuggestion,
      coachMessage,
    })
  } catch (error) {
    console.error("Insights error:", error)
    return NextResponse.json(
      { error: "Došlo je do pogreške." },
      { status: 500 }
    )
  }
}
