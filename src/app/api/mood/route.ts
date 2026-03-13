import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const moodSchema = z.object({
  mood: z.enum(["EXCELLENT", "GOOD", "DIFFICULT", "STRONG_CRAVING"]),
  note: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = moodSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Nevažeći podaci." },
        { status: 400 }
      )
    }

    const { mood, note } = parsed.data

    // Create mood checkin
    const checkin = await prisma.moodCheckin.create({
      data: {
        userId: session.user.id,
        mood,
        note,
      },
    })

    // Update today's daily progress
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await prisma.dailyProgress.upsert({
      where: {
        userId_date: {
          userId: session.user.id,
          date: today,
        },
      },
      update: {
        dailyMood: mood,
      },
      create: {
        userId: session.user.id,
        date: today,
        dailyMood: mood,
      },
    })

    return NextResponse.json({ success: true, checkin })
  } catch (error) {
    console.error("Mood checkin error:", error)
    return NextResponse.json(
      { error: "Došlo je do pogreške." },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has checked in today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayCheckin = await prisma.moodCheckin.findFirst({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: today,
        },
      },
    })

    return NextResponse.json({ hasCheckedIn: !!todayCheckin })
  } catch (error) {
    console.error("Get mood error:", error)
    return NextResponse.json(
      { error: "Došlo je do pogreške." },
      { status: 500 }
    )
  }
}
