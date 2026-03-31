import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { KODELAB_CONFIG } from "@/lib/kodelab"

const allocationSchema = z.array(
  z.object({
    registrationId: z.string(),
    points: z.number().min(0),
    coefficient: z.number(),
  })
)

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = allocationSchema.safeParse(body.allocations)

    if (!parsed.success) {
      return NextResponse.json({ error: "Nevažeći podaci." }, { status: 400 })
    }

    const allocations = parsed.data

    // Verify user is fantasy participant
    const userReg = await prisma.kodelabRegistration.findUnique({
      where: { userId: session.user.id },
    })

    if (!userReg || userReg.role !== "FANTASY_PARTICIPANT") {
      return NextResponse.json(
        { error: "Samo fantasy sudionici mogu raspodijeliti bodove." },
        { status: 403 }
      )
    }

    // Verify total doesn't exceed budget
    const total = allocations.reduce((sum, a) => sum + a.points, 0)
    if (total > KODELAB_CONFIG.fantasyBudget) {
      return NextResponse.json(
        { error: `Premašio/la si budžet od ${KODELAB_CONFIG.fantasyBudget} bodova.` },
        { status: 400 }
      )
    }

    // Delete existing allocations and create new ones
    const userId = session.user.id // TypeScript type narrowing
    
    await prisma.fantasyAllocation.deleteMany({
      where: { userId },
    })

    if (allocations.length > 0) {
      await prisma.fantasyAllocation.createMany({
        data: allocations.map((a) => ({
          userId,
          registrationId: a.registrationId,
          pointsAllocated: a.points,
          coefficient: a.coefficient,
        })),
      })
    }

    return NextResponse.json({
      success: true,
      message: "Raspodjela uspješno spremljena!",
    })
  } catch (error) {
    console.error("Fantasy allocation error:", error)
    return NextResponse.json({ error: "Došlo je do pogreške." }, { status: 500 })
  }
}
