import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { FriendsClient } from "./friends-client"
import { generateInviteCode } from "@/lib/utils"

export default async function PrijateljiPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/prijava")

  const userId = session.user.id

  // Get or create invite code
  let inviteCode = await prisma.inviteCode.findFirst({
    where: {
      senderId: userId,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  })

  if (!inviteCode) {
    const code = generateInviteCode()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    inviteCode = await prisma.inviteCode.create({
      data: {
        code,
        senderId: userId,
        expiresAt,
      },
    })
  }

  // Get friends who joined via invite
  const friends = await prisma.inviteCode.findMany({
    where: {
      senderId: userId,
      usedAt: { not: null },
    },
    include: {
      receiver: {
        include: {
          profile: true,
          programs: {
            where: { status: { in: ["ACTIVE", "NEEDS_FOCUS"] } },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
  })

  const friendsData = friends
    .filter((f) => f.receiver)
    .map((f) => ({
      id: f.receiver!.id,
      name: f.receiver!.name || f.receiver!.email || "Korisnik",
      email: f.receiver!.email || "",
      joinedAt: f.usedAt!.toISOString(),
      programType: f.receiver!.programs[0]?.type || null,
      programStatus: f.receiver!.programs[0]?.status || null,
    }))

  return (
    <FriendsClient
      inviteCode={inviteCode.code}
      friends={friendsData}
    />
  )
}
