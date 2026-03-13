"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Star, TrendingUp, Calendar, AlertCircle } from "lucide-react"
import { KodelabState } from "@/lib/kodelab"
import { getKodelabStateLabel } from "@/lib/kodelab"
import { format } from "date-fns"
import { hr } from "date-fns/locale"
import { KodelabSurveyModal } from "@/components/features/kodelab-survey-modal"
import { FantasyRating } from "@/components/features/fantasy-rating"
import { FantasyPortfolio } from "@/components/features/fantasy-portfolio"
import { FantasyChat } from "@/components/features/fantasy-chat"

interface KodelabClientProps {
  state: KodelabState
  canRegister: boolean
  config: {
    name: string
    startDate: Date
    endDate: Date
    registrationCloseDate: Date
    fantasyBudget: number
  }
  userRegistration: {
    id: string
    role: string
    strategy: string | null
    selfScore: number | null
    coefficient: number | null
    totalConsumption: number
  } | null
  participants: Array<{
    id: string
    user: { name: string | null; email: string | null }
    strategy: string | null
    selfScore: number | null
    crowdScore: number | null
    coefficient: number | null
    avgRating: number | null
    userRating: number | null
    totalConsumption: number
    completedChallenge: boolean
  }>
  fantasyAllocations: any[]
  consumptionType: string
  isFantasyParticipant: boolean
}

export function KodelabClient({
  state,
  canRegister,
  config,
  userRegistration,
  participants,
  fantasyAllocations,
  consumptionType,
  isFantasyParticipant,
}: KodelabClientProps) {
  const [activeTab, setActiveTab] = useState<"izazov" | "sudionici" | "fantasy" | "poredak">("izazov")
  const [showSurveyModal, setShowSurveyModal] = useState(false)
  const [showFantasyView, setShowFantasyView] = useState<"rating" | "portfolio" | null>(null)

  const tabs = [
    { id: "izazov" as const, label: "Izazov", icon: Trophy },
    { id: "sudionici" as const, label: "Sudionici", icon: Users },
    { id: "fantasy" as const, label: "Fantasy", icon: Star },
    { id: "poredak" as const, label: "Poredak", icon: TrendingUp },
  ]

  const stateColors: Record<KodelabState, string> = {
    najava: "bg-blue-100 text-blue-800",
    prijave_otvorene: "bg-green-100 text-green-800",
    aktivno: "bg-emerald-100 text-emerald-800",
    prijave_zatvorene: "bg-amber-100 text-amber-800",
    završeno: "bg-slate-100 text-slate-800",
  }

  return (
    <div className="space-y-6 pb-safe-bottom">
      {/* Hero Card */}
      <Card className="border-t-4 border-t-teal-500 bg-gradient-to-br from-teal-50 to-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{config.name}</h1>
              <p className="text-slate-600">
                Specijalni company event • 01.04. - 30.04.2026.
              </p>
            </div>
            <Badge className={stateColors[state]}>
              {getKodelabStateLabel(state)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span className="text-slate-700">
                Početak: {format(new Date(config.startDate), "d. MMM", { locale: hr })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span className="text-slate-700">
                Kraj: {format(new Date(config.endDate), "d. MMM", { locale: hr })}
              </span>
            </div>
          </div>

          {!userRegistration && canRegister && (
            <div className="space-y-2">
              <Button 
                onClick={() => setShowSurveyModal(true)}
                className="w-full" 
                size="lg"
              >
                Prijavi se kao Izazivač
              </Button>
              <Button 
                onClick={async () => {
                  try {
                    await fetch("/api/kodelab/register", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ role: "FANTASY_PARTICIPANT" }),
                    })
                    window.location.reload()
                  } catch (error) {
                    console.error("Fantasy registration failed:", error)
                  }
                }}
                variant="secondary" 
                className="w-full" 
                size="lg"
              >
                Pridruži se Fantasy igri
              </Button>
            </div>
          )}

          {!userRegistration && !canRegister && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <p className="text-sm text-amber-800 font-medium">
                  Prijave su zatvorene. Izazov je u tijeku!
                </p>
              </div>
            </div>
          )}

          {userRegistration && (
            <div className="bg-teal-100 border border-teal-200 rounded-xl p-4">
              <p className="text-sm text-teal-800 font-semibold">
                Registriran/a kao: {userRegistration.role === "ACTIVE_PARTICIPANT" ? "Izazivač" : "Fantasy sudionik"}
              </p>
              {userRegistration.coefficient && (
                <p className="text-xs text-teal-700 mt-1">
                  Tvoj koeficijent: <strong>{userRegistration.coefficient.toFixed(2)}</strong>
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all
                ${isActive
                  ? "bg-teal-500 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "izazov" && (
        <Card>
          <CardHeader>
            <CardTitle>O izazovu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Što je Kodelab izazov?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Specijalni company event gdje Kodelab ekipa zajedno izaziva nikotin.
                Mjesec dana podrške, natjecanja i zabave!
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Pravila</h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Trajanje: 01.04. - 30.04.2026.</li>
                <li>• Prijave otvorene do kraja 01.04.2026.</li>
                <li>• Dvije uloge: Izazivač i Fantasy sudionik</li>
                <li>• Grace sistem aktiviran</li>
                <li>• Pobjednik: najmanje cigareta/vape tijekom izazova</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Puffless Fantasy</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ne natječeš se direktno, ali možeš predviđati tko će uspjeti!
                Dobij 100 Puff bodova i rasporedi ih na sudionike u koje vjeruješ.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "sudionici" && (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            {participants.length} registriranih izazivača
          </p>

          {participants.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-500">Još nema registriranih sudionika.</p>
              </CardContent>
            </Card>
          ) : (
            participants.map((p) => (
              <Card key={p.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">
                        {p.user.name || "Anonim"}
                      </h3>
                      {p.strategy && (
                        <p className="text-xs text-slate-500 mt-1">
                          Strategija: {p.strategy}
                        </p>
                      )}
                      {p.avgRating && (
                        <div className="flex items-center gap-2 mt-2">
                          <Star className="w-4 h-4 text-amber-500" />
                          <span className="text-sm text-slate-700">
                            Fantasy ocjena: <strong>{p.avgRating.toFixed(1)}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      {p.coefficient && (
                        <div className="text-2xl font-bold text-teal-600">
                          {p.coefficient.toFixed(2)}
                        </div>
                      )}
                      <p className="text-xs text-slate-500">koeficijent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === "fantasy" && (
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3 mb-3">
                <Star className="w-6 h-6 text-amber-600" />
                <div>
                  <h3 className="font-semibold text-amber-900">Puffless Fantasy</h3>
                  <p className="text-xs text-amber-700">Predviđaj tko će uspjeti!</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Dobivaš <strong>100 Puff bodova</strong> za raspodjelu. Rasporedi ih na sudionike u koje vjeruješ.
                Na kraju izazova, tvoj rezultat ovisi o uspjehu tvojih prognoza i koeficijentima.
              </p>
            </CardContent>
          </Card>

          {userRegistration?.role === "FANTASY_PARTICIPANT" ? (
            <div className="space-y-4">
              {!showFantasyView && (
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setShowFantasyView("rating")}
                    className="flex-1"
                  >
                    Ocijeni sudionike
                  </Button>
                  <Button 
                    onClick={() => setShowFantasyView("portfolio")}
                    variant="secondary"
                    className="flex-1"
                  >
                    Raspodjela bodova
                  </Button>
                </div>
              )}

              {showFantasyView === "rating" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-700">
                      Ocijeni sudionike (1-5):
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowFantasyView(null)}
                    >
                      Zatvori
                    </Button>
                  </div>
                  {participants.map((p) => (
                    <FantasyRating
                      key={p.id}
                      participant={{
                        id: p.id,
                        name: p.user.name || "Anonim",
                        coefficient: p.coefficient || 2.0,
                        userRating: p.userRating,
                      }}
                      onRate={async (regId, confidence) => {
                        await fetch("/api/kodelab/fantasy/rate", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ registrationId: regId, confidence }),
                        })
                        window.location.reload()
                      }}
                    />
                  ))}
                </div>
              )}

              {showFantasyView === "portfolio" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-slate-700">
                      Raspodjela Puff bodova:
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowFantasyView(null)}
                    >
                      Zatvori
                    </Button>
                  </div>
                  <FantasyPortfolio
                    participants={participants.map(p => ({
                      id: p.id,
                      name: p.user.name || "Anonim",
                      coefficient: p.coefficient || 2.0,
                    }))}
                    budget={config.fantasyBudget}
                    existingAllocations={fantasyAllocations}
                    onAllocate={async (alloc) => {
                      await fetch("/api/kodelab/fantasy/allocate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ allocations: alloc }),
                      })
                      window.location.reload()
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-600 mb-4">Samo Fantasy sudionici mogu ocjenjivati.</p>
                {canRegister && (
                  <Button 
                    onClick={async () => {
                      try {
                        await fetch("/api/kodelab/register", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ role: "FANTASY_PARTICIPANT" }),
                        })
                        window.location.reload()
                      } catch (error) {
                        console.error("Fantasy registration failed:", error)
                      }
                    }}
                    variant="secondary"
                  >
                    Pridruži se Fantasy igri
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "poredak" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Ljestvica
            </CardTitle>
          </CardHeader>
          <CardContent>
            {state === "najava" || state === "prijave_otvorene" ? (
              <div className="text-center py-8">
                <p className="text-slate-500">Ljestvica će biti dostupna nakon početka izazova.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {participants
                  .sort((a, b) => a.totalConsumption - b.totalConsumption)
                  .map((p, i) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        i === 0 ? "bg-amber-500 text-white" :
                        i === 1 ? "bg-slate-300 text-slate-700" :
                        i === 2 ? "bg-orange-300 text-orange-800" :
                        "bg-slate-200 text-slate-600"
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 text-sm">
                          {p.user.name || "Anonim"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">{p.totalConsumption}</p>
                        <p className="text-xs text-slate-500">ukupno</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Survey Modal */}
      <KodelabSurveyModal
        open={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        onSubmit={async (surveyData) => {
          try {
            await fetch("/api/kodelab/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                role: "ACTIVE_PARTICIPANT",
                ...surveyData,
              }),
            })
            window.location.reload()
          } catch (error) {
            console.error("Registration failed:", error)
          }
        }}
      />

      {/* Fantasy Chat */}
      <FantasyChat isFantasyParticipant={isFantasyParticipant} />
    </div>
  )
}
