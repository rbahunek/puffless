import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

// DEMO MODE: Using in-memory storage since database is not available
// In production, this should use a real database
let usersStore: any[] = []

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
    const existingUser = usersStore.find(u => u.email === email)

    if (existingUser) {
      return NextResponse.json(
        { error: "Korisnik s ovom email adresom već postoji." },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user (in-memory for demo)
    const user = {
      id: `user_${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      profile: {
        displayName: name,
        onboardingCompleted: false,
      }
    }

    usersStore.push(user)

    return NextResponse.json(
      { 
        message: "Korisnik uspješno kreiran. (DEMO MODE - podaci se ne spremaju trajno)", 
        userId: user.id 
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

// Export users store for use in other API routes
export { usersStore }
