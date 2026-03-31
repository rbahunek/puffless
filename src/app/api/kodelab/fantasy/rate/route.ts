import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { calculateProbability, calculateCoefficient } from "@/lib/kodelab"

const rateSchema = z.object({
  registrationId: z.string(),
  confidence: z.number().min(1).max(5),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = rateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Nevažeći podaci." }, { status: 400 })
    }

    const { registrationId, confidence } = parsed.data

    // Verify rater is a fantasy participant
    const raterRegistration = await prisma.kodelabRegistration.findUnique({
      where: { userId: session.user.id },
    })

    if (!raterRegistration || raterRegistration.role !== "FANTASY_PARTICIPANT") {
      return NextResponse.json(
        { error: "Samo fantasy sudionici mogu ocjenjivati." },
        { status: 403 }
      )
    }

    // Verify target registration exists and is active participant
    const targetRegistration = await prisma.kodelabRegistration.findUnique({
      where: { id: registrationId },
      include: { user: true },
    })

    if (!targetRegistration || targetRegistration.role !== "ACTIVE_PARTICIPANT") {
      return NextResponse.json(
        { error: "Nevažeći sudionik." },
        { status: 404 }
      )
    }

    // Create or update rating
    const rating = await prisma.fantasyRating.upsert({
      where: {
        raterId_registrationId: {
          raterId: session.user.id,
          registrationId,
        },
      },
      update: {
        confidence,
      },
      create: {
        raterId: session.user.id,
        participantId: targetRegistration.userId,
        registrationId,
        confidence,
      },
    })

    // Recalculate crowd score and coefficient for target participant
    const allRatings = await prisma.fantasyRating.findMany({
      where: { registrationId },
    })

    const crowdScore = allRatings.length > 0
      ? allRatings.reduce((sum, r) => sum + r.confidence, 0) / allRatings.length
      : 3.0

    const selfScore = targetRegistration.selfScore || 50
    const probability = calculateProbability(selfScore, crowdScore)
    const coefficient = calculateCoefficient(probability)

    // Update target registration with new scores
    await prisma.kodelabRegistration.update({
      where: { id: registrationId },
      data: {
        crowdScore,
        probability,
        coefficient,
      },
    })

    return NextResponse.json({
      success: true,
      rating,
      updatedCoefficient: coefficient,
    })
  } catch (error) {
    console.error("Fantasy rating error:", error)
    return NextResponse.json({ error: "Došlo je do pogreške." }, { status: 500 })
  }
}
