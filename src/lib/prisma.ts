import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// TEMPORARY: Hardcoded DATABASE_URL for online app builder
// In production, this should come from environment variables
const databaseUrl = process.env.DATABASE_URL || 
  "postgresql://neondb_owner:npg_TGShD8vMFJ3d@ep-aged-recipe-adcvkxjs-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
