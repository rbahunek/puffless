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
    const { code } = body

    if (!code) {
      return NextResponse.json({ error: "Kod je obavezan." }, { status: 400 })
    }

    const inviteCode = await prisma.inviteCode.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!inviteCode) {
      return NextResponse.json({ error: "Nevažeći pozivni kod." }, { status: 404 })
    }

    if (inviteCode.usedAt) {
      return NextResponse.json({ error: "Ovaj kod je već iskorišten." }, { status: 400 })
    }

    if (inviteCode.expiresAt < new Date()) {
      return NextResponse.json({ error: "Ovaj kod je istekao." }, { status: 400 })
    }

    if (inviteCode.senderId === userId) {
      return NextResponse.json({ error: "Ne možeš koristiti vlastiti pozivni kod." }, { status: 400 })
    }

    // Mark invite as used
    await prisma.inviteCode.update({
      where: { code: code.toUpperCase() },
      data: {
        receiverId: userId,
        usedAt: new Date(),
      },
    })

    return NextResponse.json(
      { message: "Uspješno si se pridružio/la! Sada možete zajedno pratiti napredak." },
      { status: 200 }
    )
  } catch (error) {
    console.error("Join invite error:", error)
    return NextResponse.json(
      { error: "Došlo je do pogreške. Pokušaj ponovno." },
      { status: 500 }
    )
  }
}
