import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getProgramGraceLimit } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nisi prijavljen/a." }, { status: 401 })
    }

    const body = await request.json()
    const {
      consumptionType,
      displayName,
      cigarettesPerDay,
      cigarettesPerPack,
      pricePerPack,
      usagePerDay,
      estimatedDailyCost,
      quitDate,
      programType,
      isWithFriend,
      triggers,
    } = body

    const userId = session.user.id

    // Update user profile with consumption type support
    await prisma.userProfile.upsert({
      where: { userId },
      update: {
        consumptionType: consumptionType || "SMOKING",
        displayName: displayName || undefined,
        cigarettesPerDay: parseInt(cigarettesPerDay) || 20,
        cigarettesPerPack: parseInt(cigarettesPerPack) || 20,
        pricePerPack: parseFloat(pricePerPack) || 4.0,
        usagePerDay: usagePerDay ? parseInt(usagePerDay) : null,
        estimatedDailyCost: estimatedDailyCost ? parseFloat(estimatedDailyCost) : null,
        quitDate: new Date(quitDate),
        onboardingCompleted: true,
        triggers: triggers || [],
      },
      create: {
        userId,
        consumptionType: consumptionType || "SMOKING",
        displayName: displayName || undefined,
        cigarettesPerDay: parseInt(cigarettesPerDay) || 20,
        cigarettesPerPack: parseInt(cigarettesPerPack) || 20,
        pricePerPack: parseFloat(pricePerPack) || 4.0,
        usagePerDay: usagePerDay ? parseInt(usagePerDay) : null,
        estimatedDailyCost: estimatedDailyCost ? parseFloat(estimatedDailyCost) : null,
        quitDate: new Date(quitDate),
        onboardingCompleted: true,
        triggers: triggers || [],
      },
    })

    // Create program
    const graceLimit = getProgramGraceLimit(programType)
    const programDuration = programType === "TEN_DAY" ? 10 : programType === "FOURTEEN_DAY" ? 14 : 30
    const startDate = new Date(quitDate)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + programDuration)

    await prisma.program.create({
      data: {
        userId,
        type: programType,
        status: "ACTIVE",
        startDate,
        endDate,
        graceLimit,
        graceUsed: 0,
        currentDay: 1,
        isWithFriend: isWithFriend || false,
      },
    })

    return NextResponse.json({ message: "Onboarding završen." }, { status: 200 })
  } catch (error) {
    console.error("Onboarding error:", error)
    return NextResponse.json(
      { error: "Došlo je do pogreške. Pokušaj ponovno." },
      { status: 500 }
    )
  }
}
