import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Edge runtime for Cloudflare compatibility
export const runtime = "edge"

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

// CLOUDFLARE EDGE MODE: No database, returns success
// For production with database, deploy to Node.js environment (Vercel, Railway, etc.)
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

    const { name, email } = parsed.data

    // Return success - client will handle storage via localStorage
    // For production: use Prisma Accelerate or deploy to Node.js runtime
    return NextResponse.json(
      { 
        message: "Korisnik uspješno kreiran. (Demo mode - Cloudflare Edge)", 
        user: {
          id: `user_${Date.now()}`,
          name,
          email,
          createdAt: new Date().toISOString()
        }
      },
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
