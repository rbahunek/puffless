import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getProgramName } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nisi prijavljen/a." }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { type, programId } = body

    const program = await prisma.program.findFirst({
      where: { id: programId, userId },
    })

    if (!program) {
      return NextResponse.json({ error: "Program nije pronađen." }, { status: 404 })
    }

    const duration = type === "TEN_DAY" ? 10 : type === "FOURTEEN_DAY" ? 14 : 30
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + duration)

    const challenge = await prisma.challenge.create({
      data: {
        programId,
        name: getProgramName(type),
        type,
        startDate: new Date(),
        endDate,
        status: "ACTIVE",
        participants: {
          create: {
            userId,
            graceUsed: 0,
          },
        },
      },
    })

    return NextResponse.json(
      { message: "Izazov kreiran!", challengeId: challenge.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create challenge error:", error)
    return NextResponse.json(
      { error: "Došlo je do pogreške. Pokušaj ponovno." },
      { status: 500 }
    )
  }
}
