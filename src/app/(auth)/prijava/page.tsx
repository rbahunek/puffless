"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const loginSchema = z.object({
  email: z.string().email("Unesi ispravnu email adresu."),
  password: z.string().min(8, "Lozinka mora imati najmanje 8 znakova."),
})

type LoginForm = z.infer<typeof loginSchema>

export default function PrijavaPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Pogrešan email ili lozinka. Pokušaj ponovno.")
      } else {
        router.push("/dashboard")
        router.refresh()
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
            Dobrodošao/la natrag! 👋
          </h1>
          <p className="text-[#6B7280] mb-8">
            Prijavi se i nastavi s napretkom.
          </p>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-600">⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                placeholder="Tvoja lozinka"
                error={errors.password?.message}
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

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-[#2EC4B6] hover:underline"
              >
                Zaboravljena lozinka?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isLoading}
            >
              Prijava
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6B7280]">
              Nemaš račun?{" "}
              <Link href="/registracija" className="text-[#2EC4B6] font-semibold hover:underline">
                Registriraj se besplatno
              </Link>
            </p>
          </div>
        </div>

        {/* Motivational note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#6B7280] italic">
            &ldquo;Svaki dan bez cigarete je velika pobjeda.&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}
