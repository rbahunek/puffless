import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { canRegisterForKodelab, calculateSelfScore } from "@/lib/kodelab"

const registerSchema = z.object({
  role: z.enum(["ACTIVE_PARTICIPANT", "FANTASY_PARTICIPANT"]),
  // Survey fields (required for active participants)
  motivation: z.number().min(1).max(10).optional(),
  difficulty: z.number().min(1).max(10).optional(),
  previousAttempts: z.enum(["never", "1-2", "many"]).optional(),
  hasSupport: z.enum(["yes", "partial", "no"]).optional(),
  biggestTrigger: z.string().optional(),
  successBelief: z.number().min(1).max(10).optional(),
  strategy: z.enum(["FULL_QUIT", "MAJOR_REDUCTION", "TRYING"]).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if registrations are still open
    if (!canRegisterForKodelab()) {
      return NextResponse.json(
        { error: "Prijave za Kodelab izazov su zatvorene." },
        { status: 403 }
      )
    }

    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Nevažeći podaci." },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Check if already registered
    const existing = await prisma.kodelabRegistration.findUnique({
      where: { userId: session.user.id },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Već si registriran/a za Kodelab izazov." },
        { status: 409 }
      )
    }

    // For active participants, validate survey data
    if (data.role === "ACTIVE_PARTICIPANT") {
      if (!data.motivation || !data.difficulty || !data.previousAttempts || 
          !data.hasSupport || !data.successBelief || !data.strategy) {
        return NextResponse.json(
          { error: "Anketa je obavezna za aktivne sudionike." },
          { status: 400 }
        )
      }

      // Calculate self score
      const selfScore = calculateSelfScore({
        motivation: data.motivation,
        difficulty: data.difficulty,
        previousAttempts: data.previousAttempts,
        hasSupport: data.hasSupport,
        successBelief: data.successBelief,
        strategy: data.strategy,
      })

      // Create registration with survey data
      const registration = await prisma.kodelabRegistration.create({
        data: {
          userId: session.user.id,
          role: data.role,
          motivation: data.motivation,
          difficulty: data.difficulty,
          previousAttempts: data.previousAttempts,
          hasSupport: data.hasSupport,
          biggestTrigger: data.biggestTrigger,
          successBelief: data.successBelief,
          strategy: data.strategy,
          selfScore,
          crowdScore: 3.0, // Default until fantasy ratings come in
          probability: selfScore / 100, // Initial estimate
          coefficient: 1 / (selfScore / 100), // Initial odds
        },
      })

      return NextResponse.json({ 
        success: true, 
        registration,
        message: "Uspješno si se prijavio/la kao izazivač!"
      })
    }

    // Fantasy participant - no survey needed
    const registration = await prisma.kodelabRegistration.create({
      data: {
        userId: session.user.id,
        role: data.role,
      },
    })

    return NextResponse.json({ 
      success: true, 
      registration,
      message: "Uspješno si se prijavio/la u Puffless Fantasy!"
    })
  } catch (error) {
    console.error("Kodelab registration error:", error)
    return NextResponse.json(
      { error: "Došlo je do pogreške." },
      { status: 500 }
    )
  }
}
