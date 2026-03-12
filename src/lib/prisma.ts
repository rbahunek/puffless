import { PrismaClient } from "@prisma/client"
import { Pool, neonConfig } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import ws from "ws"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configure Neon for Edge runtime
neonConfig.webSocketConstructor = ws

const connectionString = "postgresql://neondb_owner:npg_TGShD8vMFJ3d@ep-aged-recipe-adcvkxjs-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

const pool = new Pool({ connectionString })
const adapter = new PrismaNeon(pool)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // @ts-ignore - adapter type mismatch
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
