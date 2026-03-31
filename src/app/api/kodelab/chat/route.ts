import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const messageSchema = z.object({
  message: z.string().min(1).max(500),
})

// POST - Send message
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is Fantasy participant
    const registration = await prisma.kodelabRegistration.findUnique({
      where: { userId: session.user.id },
    })

    if (!registration || registration.role !== "FANTASY_PARTICIPANT") {
      return NextResponse.json(
        { error: "Samo Fantasy sudionici mogu pisati u chat." },
        { status: 403 }
      )
    }

    const body = await request.json()
    const parsed = messageSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Nevažeća poruka." }, { status: 400 })
    }

    const message = await prisma.fantasyChatMessage.create({
      data: {
        userId: session.user.id,
        message: parsed.data.message,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error("Chat message error:", error)
    return NextResponse.json({ error: "Došlo je do pogreške." }, { status: 500 })
  }
}

// GET - Fetch messages
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "50")
    const since = searchParams.get("since") // ISO timestamp for polling

    const messages = await prisma.fantasyChatMessage.findMany({
      where: since ? {
        createdAt: {
          gt: new Date(since),
        },
      } : undefined,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    return NextResponse.json({ 
      messages: messages.reverse(), // Oldest first for chat display
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Fetch messages error:", error)
    return NextResponse.json({ error: "Došlo je do pogreške." }, { status: 500 })
  }
}
