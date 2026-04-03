import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { KODELAB_CONFIG } from "@/lib/kodelab"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nisi prijavljen/a." }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { trigger, note } = body

    // Get active program
    const activeProgram = await prisma.program.findFirst({
      where: { userId, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    })

    let isGrace = false
    let message = "Zabilježeno. Jedna cigareta ne briše sav trud."

    if (activeProgram) {
      const newGraceUsed = activeProgram.graceUsed + 1
      isGrace = true

      if (newGraceUsed <= activeProgram.graceLimit) {
        const remaining = activeProgram.graceLimit - newGraceUsed
        message = remaining > 0
          ? `Iskoristio/la si jednu grace cigaretu. I dalje si na pravom putu. Ostalo ti je ${remaining} grace cigareta.`
          : "Iskoristio/la si posljednju grace cigaretu. Program je uzdrman, ali nije kraj. Nastavi dalje!"

        await prisma.program.update({
          where: { id: activeProgram.id },
          data: {
            graceUsed: newGraceUsed,
            status: newGraceUsed >= activeProgram.graceLimit ? "NEEDS_FOCUS" : "ACTIVE",
          },
        })
      } else {
        message = "Program je uzdrman, ali nije kraj. Pogledaj što te najčešće potiče i nastavi dalje."
        await prisma.program.update({
          where: { id: activeProgram.id },
          data: { status: "NEEDS_FOCUS" },
        })
      }
    }

    // Log the cigarette
    await prisma.cigaretteLog.create({
      data: {
        userId,
        trigger: trigger || null,
        note: note || null,
        isGrace,
        loggedAt: new Date(),
      },
    })

    // Update daily progress
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await prisma.dailyProgress.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      update: {
        cigarettesSmoked: { increment: 1 },
      },
      create: {
        userId,
        date: today,
        cigarettesSmoked: 1,
      },
    })

    // Update Kodelab totalConsumption if log is during challenge period
    const now = new Date()
    if (now >= KODELAB_CONFIG.startDate && now <= KODELAB_CONFIG.endDate) {
      const kodelabReg = await prisma.kodelabRegistration.findUnique({
        where: { userId },
      })

      if (kodelabReg && kodelabReg.role === "ACTIVE_PARTICIPANT") {
        await prisma.kodelabRegistration.update({
          where: { userId },
          data: {
            totalConsumption: { increment: 1 },
            graceUsed: isGrace ? { increment: 1 } : undefined,
          },
        })
      }
    }

    return NextResponse.json({ message, isGrace }, { status: 201 })
  } catch (error) {
    console.error("Cigarette log error:", error)
    return NextResponse.json(
      { error: "Došlo je do pogreške. Pokušaj ponovno." },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nisi prijavljen/a." }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "20")

    const logs = await prisma.cigaretteLog.findMany({
      where: { userId: session.user.id },
      orderBy: { loggedAt: "desc" },
      take: limit,
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error("Get cigarettes error:", error)
    return NextResponse.json(
      { error: "Došlo je do pogreške." },
      { status: 500 }
    )
  }
}
