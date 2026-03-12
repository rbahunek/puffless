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
    const { day, reflection } = body

    // Get active program
    const activeProgram = await prisma.program.findFirst({
      where: { userId, status: { in: ["ACTIVE", "NEEDS_FOCUS"] } },
      orderBy: { createdAt: "desc" },
    })

    if (!activeProgram) {
      return NextResponse.json({ error: "Nema aktivnog programa." }, { status: 404 })
    }

    // Calculate the date for this day
    const dayDate = new Date(activeProgram.startDate)
    dayDate.setDate(dayDate.getDate() + day - 1)
    dayDate.setHours(0, 0, 0, 0)

    // Update daily progress
    await prisma.dailyProgress.upsert({
      where: {
        userId_date: {
          userId,
          date: dayDate,
        },
      },
      update: {
        taskCompleted: true,
        reflectionNote: reflection || null,
      },
      create: {
        userId,
        date: dayDate,
        taskCompleted: true,
        reflectionNote: reflection || null,
      },
    })

    // Update program current day if needed
    if (day >= activeProgram.currentDay) {
      const programDuration = activeProgram.type === "TEN_DAY" ? 10 : activeProgram.type === "FOURTEEN_DAY" ? 14 : 30
      const newDay = Math.min(day + 1, programDuration)

      await prisma.program.update({
        where: { id: activeProgram.id },
        data: {
          currentDay: newDay,
          status: day >= programDuration ? "COMPLETED" : activeProgram.status,
          endDate: day >= programDuration ? new Date() : undefined,
        },
      })
    }

    return NextResponse.json({ message: "Dan uspješno završen! 🎉" }, { status: 200 })
  } catch (error) {
    console.error("Complete day error:", error)
    return NextResponse.json(
      { error: "Došlo je do pogreške. Pokušaj ponovno." },
      { status: 500 }
    )
  }
}
