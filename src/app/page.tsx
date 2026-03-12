import Link from "next/link"
import { ArrowRight, TrendingUp, Heart, Users, Shield, Star, CheckCircle, Cigarette, Euro, Brain, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2EC4B6] to-[#4F7BFF] flex items-center justify-center">
                <span className="text-white text-sm font-bold">P</span>
              </div>
              <span className="text-xl font-bold text-[#1F2937]" style={{ fontFamily: "Poppins, sans-serif" }}>
                Puffless
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/prijava">
                <Button variant="secondary" size="sm">Prijava</Button>
              </Link>
              <Link href="/registracija">
                <Button size="sm">Započni besplatno</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#e8faf9] text-[#2EC4B6] rounded-full px-4 py-2 text-sm font-semibold mb-8">
              <span className="w-2 h-2 bg-[#2EC4B6] rounded-full animate-pulse"></span>
              Napredak, ne savršenstvo
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1F2937] mb-6 leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
              Prestani pušiti uz{" "}
              <span className="bg-gradient-to-r from-[#2EC4B6] to-[#4F7BFF] bg-clip-text text-transparent">
                podršku
              </span>
              ,{" "}
              <span className="bg-gradient-to-r from-[#4F7BFF] to-[#2EC4B6] bg-clip-text text-transparent">
                napredak
              </span>{" "}
              i male pobjede svaki dan.
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-[#6B7280] mb-10 max-w-2xl mx-auto leading-relaxed">
              Puffless ti pomaže pratiti ušteđeni novac, prepoznati okidače, izdržati žudnju i graditi navike bez osjećaja krivnje.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/registracija">
                <Button size="xl" className="w-full sm:w-auto group">
                  Započni danas
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/prijava">
                <Button variant="secondary" size="xl" className="w-full sm:w-auto">
                  Već imam račun
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-[#6B7280]">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["A", "M", "J", "K"].map((letter, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        background: `hsl(${i * 60 + 160}, 60%, 55%)`,
                      }}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <span>Pridruži se tisućama korisnika</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FFD166] text-[#FFD166]" />
                ))}
                <span className="ml-1">4.9/5 ocjena</span>
              </div>
            </div>
          </div>

          {/* Hero illustration / mockup */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2EC4B6]/10 to-[#4F7BFF]/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl border border-[#E5E7EB] overflow-hidden p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Mock dashboard cards */}
                <div className="bg-gradient-to-br from-[#2EC4B6] to-[#4F7BFF] rounded-2xl p-6 text-white">
                  <div className="text-sm font-medium opacity-80 mb-1">Dana u programu</div>
                  <div className="text-4xl font-bold mb-1">7</div>
                  <div className="text-sm opacity-80">Odlično napredujete! 🎉</div>
                  <div className="mt-4 bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2 w-[70%]"></div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
                  <div className="flex items-center gap-2 text-[#6B7280] text-sm mb-3">
                    <Euro className="w-4 h-4 text-[#FFD166]" />
                    Ušteđeni novac
                  </div>
                  <div className="text-3xl font-bold text-[#1F2937]">23,10 €</div>
                  <div className="text-sm text-[#2EC4B6] mt-1">To je pizza i piće! 🍕</div>
                  <div className="mt-3 text-xs text-[#6B7280]">+3,30 € danas</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
                  <div className="flex items-center gap-2 text-[#6B7280] text-sm mb-3">
                    <Cigarette className="w-4 h-4 text-[#4F7BFF]" />
                    Preskočene cigarete
                  </div>
                  <div className="text-3xl font-bold text-[#1F2937]">140</div>
                  <div className="text-sm text-[#6B7280] mt-1">Tvoja pluća ti hvale!</div>
                  <div className="mt-3 flex gap-1">
                    {[1,2,3,4,5,6,7].map(i => (
                      <div key={i} className="flex-1 h-6 bg-[#e8faf9] rounded-sm flex items-end">
                        <div
                          className="w-full bg-[#2EC4B6] rounded-sm"
                          style={{ height: `${Math.random() * 80 + 20}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1F2937] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
              Sve što ti treba za uspjeh
            </h2>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              Puffless kombinira praćenje napretka, podršku u teškim trenucima i gamifikaciju u jednu cjelinu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                color: "#2EC4B6",
                bg: "#e8faf9",
                title: "Praćenje napretka",
                description: "Prati dane, preskočene cigarete i zdravstvene prekretnice u realnom vremenu.",
              },
              {
                icon: Euro,
                color: "#FFD166",
                bg: "#fff8e6",
                title: "Ušteđeni novac",
                description: "Vidi točno koliko si uštedjeo/la i što si mogao/la kupiti s tim novcem.",
              },
              {
                icon: Brain,
                color: "#4F7BFF",
                bg: "#eef2ff",
                title: "Podrška pri žudnji",
                description: "Vježbe disanja, 3-minutni izazov i zamjenske aktivnosti kada je najteže.",
              },
              {
                icon: Users,
                color: "#FF8C42",
                bg: "#fff4ed",
                title: "Izazovi s prijateljem",
                description: "Pozovi prijatelja i zajedno se natječite tko će dulje izdržati bez cigarete.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-[#F7FAFC] rounded-2xl p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: feature.bg }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-semibold text-[#1F2937] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grace System Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#fff4ed] text-[#FF8C42] rounded-full px-4 py-2 text-sm font-semibold mb-6">
                <Shield className="w-4 h-4" />
                Bez osjećaja krivnje
              </div>
              <h2 className="text-4xl font-bold text-[#1F2937] mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
                Jedna cigareta ne briše sav trud.
              </h2>
              <p className="text-lg text-[#6B7280] mb-6 leading-relaxed">
                Puffless koristi sustav &ldquo;grace cigareta&rdquo; — mali broj dopuštenih posrtanja koji te drže na putu bez osjećaja da si sve izgubio/la.
              </p>
              <div className="space-y-4">
                {[
                  { text: "Napredak, ne savršenstvo.", icon: "✨" },
                  { text: "Ovo je ovisnost, ne test savršenstva.", icon: "💙" },
                  { text: "Manje nego prije = veliki napredak.", icon: "📈" },
                  { text: "I dalje si na pravom putu.", icon: "🛤️" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-[#374151] font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#E5E7EB]">
              <h3 className="text-lg font-semibold text-[#1F2937] mb-6">Grace cigarete po programu</h3>
              <div className="space-y-6">
                {[
                  { name: "10-dnevni reset", grace: 3, total: 3, color: "#2EC4B6" },
                  { name: "14-dnevni izazov", grace: 4, total: 4, color: "#4F7BFF" },
                  { name: "30-dnevni izazov", grace: 6, total: 6, color: "#FF8C42" },
                ].map((program, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#374151]">{program.name}</span>
                      <span className="text-sm text-[#6B7280]">{program.grace} grace cigareta</span>
                    </div>
                    <div className="flex gap-2">
                      {Array.from({ length: program.total }).map((_, j) => (
                        <div
                          key={j}
                          className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs"
                          style={{
                            borderColor: program.color,
                            backgroundColor: j < 1 ? program.color : "transparent",
                            color: j < 1 ? "white" : program.color,
                          }}
                        >
                          {j < 1 ? "✓" : "○"}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-[#e8faf9] rounded-xl">
                <p className="text-sm text-[#2EC4B6] font-medium">
                  💡 Iskoristio/la si jednu grace cigaretu. I dalje si na pravom putu!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1F2937] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
              Strukturirani programi za svaki cilj
            </h2>
            <p className="text-lg text-[#6B7280]">
              Odaberi program koji odgovara tvojim potrebama i kreni korak po korak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "10-dnevni reset",
                days: 10,
                grace: 3,
                description: "Savršen početak. Strukturirani program s dnevnim zadacima i podrškom.",
                color: "from-[#2EC4B6] to-[#4F7BFF]",
                features: ["Dnevni zadaci", "3 grace cigarete", "Praćenje okidača", "Zdravstvene prekretnice"],
                badge: "Preporučeno",
              },
              {
                name: "14-dnevni izazov",
                days: 14,
                grace: 4,
                description: "Dva tjedna intenzivnog rada na novim navikama i identitetu.",
                color: "from-[#4F7BFF] to-[#2EC4B6]",
                features: ["Sve iz 10-dnevnog", "4 grace cigarete", "Izazov s prijateljem", "Napredna analitika"],
                badge: "Popularno",
              },
              {
                name: "30-dnevni izazov",
                days: 30,
                grace: 6,
                description: "Cijeli mjesec transformacije. Za one koji žele trajnu promjenu.",
                color: "from-[#FF8C42] to-[#FFD166]",
                features: ["Sve iz 14-dnevnog", "6 grace cigareta", "Ljestvica prijatelja", "Posebna dostignuća"],
                badge: "Napredno",
              },
            ].map((program, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
              >
                <div className={`bg-gradient-to-r ${program.color} p-6 text-white`}>
                  <div className="inline-block bg-white/20 rounded-full px-3 py-1 text-xs font-semibold mb-3">
                    {program.badge}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{program.name}</h3>
                  <p className="text-sm opacity-80">{program.days} dana · {program.grace} grace cigareta</p>
                </div>
                <div className="p-6">
                  <p className="text-sm text-[#6B7280] mb-4">{program.description}</p>
                  <ul className="space-y-2">
                    {program.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-[#374151]">
                        <CheckCircle className="w-4 h-4 text-[#2EC4B6] flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1F2937] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
              Što kažu korisnici
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Ana K.",
                days: 23,
                text: "Konačno aplikacija koja me ne tjera da se osjećam loše kada posrnem. Grace cigarete su genijalna ideja!",
                avatar: "A",
                color: "#2EC4B6",
              },
              {
                name: "Marko P.",
                days: 14,
                text: "Uštedjeo sam već 46 eura za 14 dana. To je bila moja motivacija da nastavim. Hvala Puffless!",
                avatar: "M",
                color: "#4F7BFF",
              },
              {
                name: "Jelena S.",
                days: 31,
                text: "Natjecanje s prijateljicom je bilo presudno. Nismo htjele jedna drugoj dopustiti da odustane.",
                avatar: "J",
                color: "#FF8C42",
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-[#E5E7EB]">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: testimonial.color }}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-[#1F2937]">{testimonial.name}</div>
                    <div className="text-xs text-[#6B7280]">{testimonial.days} dana bez cigarete</div>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[1,2,3,4,5].map(j => (
                    <Star key={j} className="w-4 h-4 fill-[#FFD166] text-[#FFD166]" />
                  ))}
                </div>
                <p className="text-sm text-[#374151] leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#2EC4B6] to-[#4F7BFF] rounded-3xl p-12 text-center text-white">
            <div className="text-5xl mb-6">🚭</div>
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
              Spreman/a za promjenu?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Svaki dan bez cigarete je pobjeda. Počni danas i vidi koliko daleko možeš doći.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/registracija">
                <Button
                  size="xl"
                  className="bg-white text-[#2EC4B6] hover:bg-[#F7FAFC] w-full sm:w-auto"
                >
                  Započni besplatno
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            <p className="text-sm opacity-70 mt-4">Besplatno · Bez kreditne kartice · Odmah</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F2937] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2EC4B6] to-[#4F7BFF] flex items-center justify-center">
                <span className="text-white text-sm font-bold">P</span>
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>Puffless</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/prijava" className="hover:text-white transition-colors">Prijava</Link>
              <Link href="/registracija" className="hover:text-white transition-colors">Registracija</Link>
            </div>
            <p className="text-sm text-gray-400">
              © 2024 Puffless. Napravljeno s ❤️ za zdraviji život.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
