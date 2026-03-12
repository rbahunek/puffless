import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nisi prijavljen/a." }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { displayName, cigarettesPerDay, cigarettesPerPack, pricePerPack, quitDate } = body

    await prisma.userProfile.update({
      where: { userId },
      data: {
        displayName: displayName || undefined,
        cigarettesPerDay: parseInt(cigarettesPerDay) || undefined,
        cigarettesPerPack: parseInt(cigarettesPerPack) || undefined,
        pricePerPack: parseFloat(pricePerPack) || undefined,
        quitDate: quitDate ? new Date(quitDate) : undefined,
      },
    })

    // Also update user name if displayName changed
    if (displayName) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: displayName },
      })
    }

    return NextResponse.json({ message: "Profil ažuriran." }, { status: 200 })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Došlo je do pogreške. Pokušaj ponovno." },
      { status: 500 }
    )
  }
}
