import Link from "next/link"
import { ArrowRight, TrendingUp, Euro, Brain, Users, CheckCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">P</span>
              </div>
              <span className="text-lg font-semibold text-slate-900">
                Puffless
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/prijava">
                <Button variant="ghost" size="sm">Prijava</Button>
              </Link>
              <Link href="/registracija">
                <Button size="sm">Započni</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 md:px-6 bg-gradient-to-b from-teal-50/50 to-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 rounded-full px-4 py-2 text-sm font-semibold mb-6 shadow-sm">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
              Napredak, ne savršenstvo
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
              Prestani pušiti uz podršku i male <span className="text-teal-600">pobjede</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl mx-auto leading-relaxed">
              Prati napredak, prepoznaj okidače, izdržaj žudnju i gradi navike bez osjećaja krivnje.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              <Link href="/registracija">
                <Button size="xl" className="w-full sm:w-auto shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30">
                  Započni danas
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/prijava">
                <Button variant="secondary" size="xl" className="w-full sm:w-auto">
                  Već imam račun
                </Button>
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["A", "M", "J"].map((letter, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-white bg-teal-500 flex items-center justify-center text-xs font-medium text-white"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <span>Tisuće korisnika</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3">
              Sve što ti treba
            </h2>
            <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto">
              Praćenje napretka, podrška i gamifikacija u jednoj aplikaciji.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                color: "text-teal-600",
                bg: "bg-teal-50",
                title: "Praćenje napretka",
                description: "Prati dane, cigarete i zdravstvene prekretnice.",
              },
              {
                icon: Euro,
                color: "text-amber-600",
                bg: "bg-amber-50",
                title: "Ušteđeni novac",
                description: "Vidi koliko si uštedjeo i što možeš kupiti.",
              },
              {
                icon: Brain,
                color: "text-blue-600",
                bg: "bg-blue-50",
                title: "Podrška pri žudnji",
                description: "Vježbe disanja i 3-minutni izazov.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-5`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-base text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Section */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3">
              Odaberi svoj program
            </h2>
            <p className="text-sm md:text-base text-slate-600">
              Strukturirani programi s dnevnim zadacima i podrškom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "10-dnevni reset",
                days: 10,
                grace: 3,
                description: "Savršen početak za nove navike.",
                features: ["Dnevni zadaci", "3 grace cigarete", "Praćenje okidača"],
                badge: "Preporučeno",
                accent: "border-t-4 border-t-teal-500",
              },
              {
                name: "14-dnevni izazov",
                days: 14,
                grace: 4,
                description: "Dva tjedna intenzivnog rada.",
                features: ["Sve iz 10-dnevnog", "4 grace cigarete", "Izazov s prijateljem"],
                badge: "Popularno",
                accent: "border-t-4 border-t-blue-500",
              },
              {
                name: "30-dnevni izazov",
                days: 30,
                grace: 6,
                description: "Cijeli mjesec transformacije.",
                features: ["Sve iz 14-dnevnog", "6 grace cigareta", "Posebna dostignuća"],
                badge: "Napredno",
                accent: "border-t-4 border-t-orange-500",
              },
            ].map((program, i) => (
              <div
                key={i}
                className={`bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${program.accent}`}
              >
                <div className="p-8">
                  <div className="inline-block bg-teal-50 text-teal-700 rounded-full px-4 py-1.5 text-xs font-semibold mb-4">
                    {program.badge}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{program.name}</h3>
                  <p className="text-sm text-slate-500 mb-4 font-medium">{program.days} dana · {program.grace} grace cigareta</p>
                  <p className="text-base text-slate-600 mb-6 leading-relaxed">{program.description}</p>
                  <ul className="space-y-3 mb-8">
                    {program.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-slate-700">
                        <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/registracija">
                    <Button variant="outline" className="w-full">Započni</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 md:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3">
              Što kažu korisnici
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Ana K.",
                text: "Grace cigarete su genijalna ideja. Konačno aplikacija koja me ne tjera da se osjećam loše.",
                avatar: "A",
              },
              {
                name: "Marko P.",
                text: "Uštedjeo sam 46 eura za 14 dana. To je bila moja motivacija da nastavim.",
                avatar: "M",
              },
              {
                name: "Jelena S.",
                text: "Natjecanje s prijateljicom je bilo presudno. Nismo htjele odustati.",
                avatar: "J",
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {testimonial.avatar}
                  </div>
                  <div className="font-semibold text-slate-900 text-base">{testimonial.name}</div>
                </div>
                <p className="text-base text-slate-600 leading-relaxed italic">&ldquo;{testimonial.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-10 md:p-16 text-center text-white shadow-xl">
            <div className="text-5xl mb-6">🚭</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
              Spreman/a za promjenu?
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto leading-relaxed">
              Svaki dan bez cigarete je pobjeda. Počni danas i promijeni život.
            </p>
            <Link href="/registracija">
              <Button
                size="xl"
                className="bg-white text-teal-600 hover:bg-slate-50 shadow-2xl hover:scale-105 transition-transform"
              >
                Započni besplatno
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <p className="text-sm mt-6 opacity-90">Besplatno · Bez kreditne kartice · Bez obaveza</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">P</span>
              </div>
              <span className="text-lg font-semibold">Puffless</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link href="/prijava" className="hover:text-white transition-colors">Prijava</Link>
              <Link href="/registracija" className="hover:text-white transition-colors">Registracija</Link>
            </div>
            <p className="text-sm text-slate-400">
              © 2024 Puffless
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
