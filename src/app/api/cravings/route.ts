import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nisi prijavljen/a." }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { trigger, note, resolved, resolutionType, duration } = body

    await prisma.cravingLog.create({
      data: {
        userId,
        trigger: trigger || null,
        note: note || null,
        resolved: resolved || false,
        resolutionType: resolutionType || null,
        duration: duration || null,
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
        cravingsLogged: { increment: 1 },
        cravingsResolved: resolved ? { increment: 1 } : undefined,
      },
      create: {
        userId,
        date: today,
        cravingsLogged: 1,
        cravingsResolved: resolved ? 1 : 0,
      },
    })

    return NextResponse.json(
      { message: "Žudnja zabilježena." },
      { status: 201 }
    )
  } catch (error) {
    console.error("Craving log error:", error)
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

    const logs = await prisma.cravingLog.findMany({
      where: { userId: session.user.id },
      orderBy: { loggedAt: "desc" },
      take: limit,
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error("Get cravings error:", error)
    return NextResponse.json(
      { error: "Došlo je do pogreške." },
      { status: 500 }
    )
  }
}
