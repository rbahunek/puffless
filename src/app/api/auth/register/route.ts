import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Edge runtime for Cloudflare compatibility
export const runtime = "edge"

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

// Direct SQL over HTTP using Neon's serverless driver
async function executeSQL(query: string, params: any[] = []) {
  const response = await fetch("https://ep-aged-recipe-adcvkxjs-pooler.c-2.us-east-1.aws.neon.tech/sql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer npg_TGShD8vMFJ3d",
    },
    body: JSON.stringify({ query, params }),
  })
  
  if (!response.ok) {
    throw new Error(`SQL error: ${response.statusText}`)
  }
  
  return response.json()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Nevažeći podaci. Provjeri unos." },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data

    // Check if user already exists
    const existingResult = await executeSQL(
      'SELECT id FROM "User" WHERE email = $1',
      [email]
    )

    if (existingResult.rows && existingResult.rows.length > 0) {
      return NextResponse.json(
        { error: "Korisnik s ovom email adresom već postoji." },
        { status: 409 }
      )
    }

    // Hash password using Web Crypto API (Edge-compatible)
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Generate user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create user
    await executeSQL(
      'INSERT INTO "User" (id, name, email, password, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW())',
      [userId, name, email, hashedPassword]
    )

    // Create profile
    await executeSQL(
      'INSERT INTO "UserProfile" (id, "userId", "displayName", "onboardingCompleted", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW())',
      [`profile_${userId}`, userId, name, false]
    )

    return NextResponse.json(
      { message: "Korisnik uspješno kreiran.", userId },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Došlo je do pogreške. Pokušaj ponovno." },
      { status: 500 }
    )
  }
}
