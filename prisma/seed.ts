import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create achievements
  const achievements = [
    {
      key: "first_24h",
      name: "Prvih 24 sata",
      description: "Proveo/la si cijeli dan bez cigarete!",
      icon: "🌟",
      condition: "1 dan u programu",
    },
    {
      key: "three_days",
      name: "3 dana napretka",
      description: "Tri dana zaredom — to je pravi napredak!",
      icon: "🔥",
      condition: "3 dana u programu",
    },
    {
      key: "first_week",
      name: "Prvi tjedan",
      description: "Cijeli tjedan! Tvoje tijelo se već mijenja.",
      icon: "🏅",
      condition: "7 dana u programu",
    },
    {
      key: "ten_days",
      name: "10 dana programa",
      description: "Završio/la si 10-dnevni reset. Nevjerojatno!",
      icon: "🎯",
      condition: "10 dana u programu",
    },
    {
      key: "first_challenge",
      name: "Prvi izazov",
      description: "Prihvatio/la si izazov i krenuo/la naprijed!",
      icon: "⚡",
      condition: "Pridružio/la se izazovu",
    },
    {
      key: "saved_10_eur",
      name: "Ušteđeno 10 €",
      description: "Već si uštedjeo/la 10 eura. Nastavi!",
      icon: "💰",
      condition: "Ušteđeno 10 €",
    },
    {
      key: "50_skipped",
      name: "50 preskočenih cigareta",
      description: "50 cigareta koje nisi zapalio/la. Tvoja pluća ti hvale!",
      icon: "🫁",
      condition: "50 preskočenih cigareta",
    },
    {
      key: "craving_warrior",
      name: "Borac sa žudnjom",
      description: "Uspješno si prebrodio/la 10 žudnji!",
      icon: "🛡️",
      condition: "10 riješenih žudnji",
    },
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { key: achievement.key },
      update: achievement,
      create: achievement,
    })
  }

  console.log("✅ Achievements created")

  // Create demo user
  const hashedPassword = await bcrypt.hash("demo1234", 12)

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@puffless.app" },
    update: {},
    create: {
      name: "Ana Horvat",
      email: "demo@puffless.app",
      password: hashedPassword,
    },
  })

  console.log("✅ Demo user created:", demoUser.email)

  // Create demo profile
  const quitDate = new Date()
  quitDate.setDate(quitDate.getDate() - 7) // 7 days ago

  await prisma.userProfile.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      displayName: "Ana",
      cigarettesPerDay: 20,
      cigarettesPerPack: 20,
      pricePerPack: 4.5,
      quitDate,
      onboardingCompleted: true,
      triggers: ["STRESS", "COFFEE", "SOCIAL"],
    },
  })

  console.log("✅ Demo profile created")

  // Create demo program
  const program = await prisma.program.upsert({
    where: { id: "demo-program-1" },
    update: {},
    create: {
      id: "demo-program-1",
      userId: demoUser.id,
      type: "TEN_DAY",
      status: "ACTIVE",
      startDate: quitDate,
      graceUsed: 1,
      graceLimit: 3,
      currentDay: 7,
      isWithFriend: false,
    },
  })

  console.log("✅ Demo program created")

  // Create demo cigarette logs
  const cigaretteLogs = [
    { daysAgo: 6, trigger: "COFFEE" as const, isGrace: true },
    { daysAgo: 4, trigger: "STRESS" as const, isGrace: false },
  ]

  for (const log of cigaretteLogs) {
    const logDate = new Date()
    logDate.setDate(logDate.getDate() - log.daysAgo)
    logDate.setHours(9, 30, 0, 0)

    await prisma.cigaretteLog.create({
      data: {
        userId: demoUser.id,
        trigger: log.trigger,
        isGrace: log.isGrace,
        loggedAt: logDate,
      },
    })
  }

  console.log("✅ Demo cigarette logs created")

  // Create demo craving logs
  const cravingLogs = [
    { daysAgo: 7, trigger: "COFFEE" as const, resolved: true },
    { daysAgo: 6, trigger: "STRESS" as const, resolved: true },
    { daysAgo: 5, trigger: "SOCIAL" as const, resolved: false },
    { daysAgo: 4, trigger: "COFFEE" as const, resolved: true },
    { daysAgo: 3, trigger: "BOREDOM" as const, resolved: true },
    { daysAgo: 2, trigger: "STRESS" as const, resolved: true },
    { daysAgo: 1, trigger: "COFFEE" as const, resolved: true },
    { daysAgo: 0, trigger: "AFTER_MEAL" as const, resolved: true },
  ]

  for (const log of cravingLogs) {
    const logDate = new Date()
    logDate.setDate(logDate.getDate() - log.daysAgo)
    logDate.setHours(10, 0, 0, 0)

    await prisma.cravingLog.create({
      data: {
        userId: demoUser.id,
        trigger: log.trigger,
        resolved: log.resolved,
        resolutionType: log.resolved ? "breathing" : null,
        loggedAt: logDate,
      },
    })
  }

  console.log("✅ Demo craving logs created")

  // Create demo daily progress
  for (let i = 7; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    await prisma.dailyProgress.upsert({
      where: {
        userId_date: {
          userId: demoUser.id,
          date,
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        date,
        cigarettesSmoked: i === 6 ? 1 : 0,
        cravingsLogged: Math.floor(Math.random() * 3) + 1,
        cravingsResolved: Math.floor(Math.random() * 2) + 1,
        taskCompleted: i > 0,
      },
    })
  }

  console.log("✅ Demo daily progress created")

  // Create demo achievements for user
  const achievementsToUnlock = ["first_24h", "three_days", "first_week"]
  for (const key of achievementsToUnlock) {
    const achievement = await prisma.achievement.findUnique({ where: { key } })
    if (achievement) {
      await prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId: demoUser.id,
            achievementId: achievement.id,
          },
        },
        update: {},
        create: {
          userId: demoUser.id,
          achievementId: achievement.id,
        },
      })
    }
  }

  console.log("✅ Demo achievements unlocked")

  // Create invite code for demo user
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)

  await prisma.inviteCode.upsert({
    where: { code: "DEMO1234" },
    update: {},
    create: {
      code: "DEMO1234",
      senderId: demoUser.id,
      expiresAt,
    },
  })

  console.log("✅ Demo invite code created")

  console.log("\n🎉 Seeding complete!")
  console.log("\nDemo credentials:")
  console.log("  Email: demo@puffless.app")
  console.log("  Password: demo1234")
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
