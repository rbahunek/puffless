"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const registerSchema = z.object({
  name: z.string().min(2, "Ime mora imati najmanje 2 znaka."),
  email: z.string().email("Unesi ispravnu email adresu."),
  password: z.string().min(8, "Lozinka mora imati najmanje 8 znakova."),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Lozinke se ne podudaraju.",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegistracijaPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Došlo je do pogreške. Pokušaj ponovno.")
        return
      }

      // Auto sign in after registration
      const { signIn } = await import("next-auth/react")
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.error) {
        router.push("/prijava")
      } else {
        router.push("/onboarding")
      }
    } catch {
      setError("Došlo je do pogreške. Pokušaj ponovno.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#2EC4B6] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Natrag na početnu
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-[#E5E7EB] p-8">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2EC4B6] to-[#4F7BFF] flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "Poppins, sans-serif" }}>
              Puffless
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
            Kreni prema zdravijem životu 🌱
          </h1>
          <p className="text-[#6B7280] mb-8">
            Registracija je besplatna i traje manje od minute.
          </p>

          {/* Benefits */}
          <div className="bg-[#e8faf9] rounded-xl p-4 mb-6">
            <div className="space-y-2">
              {[
                "Prati napredak i ušteđeni novac",
                "Podrška u teškim trenucima",
                "Bez osjećaja krivnje — grace sustav",
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-[#2EC4B6]">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-600">⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Ime i prezime"
              type="text"
              placeholder="Tvoje ime"
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="Email adresa"
              type="email"
              placeholder="tvoj@email.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="relative">
              <Input
                label="Lozinka"
                type={showPassword ? "text" : "password"}
                placeholder="Najmanje 8 znakova"
                error={errors.password?.message}
                hint="Lozinka mora imati najmanje 8 znakova."
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-[#6B7280] hover:text-[#1F2937] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Potvrdi lozinku"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Ponovi lozinku"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-[#6B7280] hover:text-[#1F2937] transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isLoading}
            >
              Registriraj se besplatno
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6B7280]">
              Već imaš račun?{" "}
              <Link href="/prijava" className="text-[#2EC4B6] font-semibold hover:underline">
                Prijavi se
              </Link>
            </p>
          </div>
        </div>

        {/* Motivational note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#6B7280] italic">
            &ldquo;Nastavi korak po korak. Svaki korak broji.&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}
