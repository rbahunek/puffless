"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Users, Zap, Crown, Medal, Star, Plus, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, getProgramName } from "@/lib/utils"

interface Participant {
  userId: string
  name: string
  graceUsed: number
  graceLimit: number
  daysSince: number
  moneySaved: number
  cigarettesAvoided: number
  isCurrentUser: boolean
}

interface Challenge {
  id: string
  name: string
  type: string
  status: string
  startDate: string
  participants: Participant[]
}

interface ChallengeClientProps {
  currentUser: {
    daysSinceQuit: number
    moneySaved: number
    cigarettesAvoided: number
    graceUsed: number
    graceLimit: number
  }
  activeProgram: {
    id: string
    type: string
    status: string
  } | null
  challenges: Challenge[]
}

const CHALLENGE_OPTIONS = [
  {
    type: "FOURTEEN_DAY",
    name: "14-dnevni izazov",
    days: 14,
    grace: 4,
    color: "from-[#4F7BFF] to-[#2EC4B6]",
    description: "Dva tjedna intenzivnog rada na novim navikama.",
  },
  {
    type: "THIRTY_DAY",
    name: "30-dnevni izazov",
    days: 30,
    grace: 6,
    color: "from-[#FF8C42] to-[#FFD166]",
    description: "Cijeli mjesec transformacije za trajnu promjenu.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function ChallengeClient({ currentUser, activeProgram, challenges }: ChallengeClientProps) {
  const [selectedChallengeType, setSelectedChallengeType] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [created, setCreated] = useState(false)
  const [newChallengeId, setNewChallengeId] = useState<string | null>(null)

  const handleCreateChallenge = async () => {
    if (!selectedChallengeType || !activeProgram) return
    setCreating(true)
    try {
      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedChallengeType,
          programId: activeProgram.id,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        setNewChallengeId(data.challengeId)
        setCreated(true)
      }
    } catch (error) {
      console.error("Failed to create challenge:", error)
    } finally {
      setCreating(false)
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-[#FFD166]" />
    if (rank === 2) return <Medal className="w-5 h-5 text-[#9CA3AF]" />
    if (rank === 3) return <Star className="w-5 h-5 text-[#FF8C42]" />
    return <span className="text-sm font-bold text-[#6B7280]">#{rank}</span>
  }

  const sortParticipants = (participants: Participant[]) => {
    return [...participants].sort((a, b) => {
      // Sort by days, then by grace used (less is better)
      if (b.daysSince !== a.daysSince) return b.daysSince - a.daysSince
      return a.graceUsed - b.graceUsed
    })
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-3xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "Poppins, sans-serif" }}>
          Izazovi 🏆
        </h1>
        <p className="text-[#6B7280] mt-1">
          Natječi se s prijateljem i zajedno gradite zdravije navike.
        </p>
      </motion.div>

      {/* Active challenges */}
      {challenges.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-lg font-semibold text-[#1F2937]">Aktivni izazovi</h2>
          {challenges.map((challenge) => {
            const sorted = sortParticipants(challenge.participants)
            return (
              <Card key={challenge.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-[#FFD166]" />
                      {challenge.name}
                    </CardTitle>
                    <Badge variant={challenge.status === "ACTIVE" ? "success" : "muted"}>
                      {challenge.status === "ACTIVE" ? "Aktivan" : "Završen"}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#6B7280]">
                    {getProgramName(challenge.type)} · {challenge.participants.length} sudionika
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Leaderboard */}
                  <div className="space-y-3">
                    {sorted.map((participant, index) => (
                      <div
                        key={participant.userId}
                        className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                          participant.isCurrentUser
                            ? "bg-gradient-to-r from-[#e8faf9] to-[#eef2ff] border border-[#2EC4B6]/20"
                            : "bg-[#F7FAFC]"
                        }`}
                      >
                        {/* Rank */}
                        <div className="w-8 flex items-center justify-center flex-shrink-0">
                          {getRankIcon(index + 1)}
                        </div>

                        {/* Avatar */}
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                          style={{
                            background: participant.isCurrentUser
                              ? "linear-gradient(135deg, #2EC4B6, #4F7BFF)"
                              : "linear-gradient(135deg, #9CA3AF, #6B7280)",
                          }}
                        >
                          {participant.name[0].toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-[#1F2937] truncate">
                              {participant.name}
                            </span>
                            {participant.isCurrentUser && (
                              <Badge variant="default" className="text-xs py-0">Ti</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-[#6B7280]">
                              {participant.daysSince} dana
                            </span>
                            <span className="text-xs text-[#6B7280]">
                              {participant.graceUsed}/{participant.graceLimit} grace
                            </span>
                            <span className="text-xs text-[#6B7280]">
                              {participant.cigarettesAvoided} preskočenih
                            </span>
                          </div>
                        </div>

                        {/* Money */}
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-bold text-[#1F2937]">
                            {formatCurrency(participant.moneySaved)}
                          </div>
                          <div className="text-xs text-[#9CA3AF]">ušteđeno</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </motion.div>
      )}

      {/* Create new challenge */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#2EC4B6]" />
              Novi izazov
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!activeProgram ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">🎯</div>
                <p className="text-[#6B7280] text-sm mb-4">
                  Trebaš aktivan program da bi kreirao/la izazov.
                </p>
                <Button onClick={() => window.location.href = "/onboarding"}>
                  Postavi program
                </Button>
              </div>
            ) : created && newChallengeId ? (
              <div className="text-center py-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="text-5xl mb-4"
                >
                  🎉
                </motion.div>
                <h3 className="text-lg font-bold text-[#1F2937] mb-2">Izazov kreiran!</h3>
                <p className="text-sm text-[#6B7280] mb-4">
                  Pozovi prijatelja na stranicu Prijatelji da se pridruži.
                </p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-emerald-600 font-medium">Izazov je aktivan</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-[#6B7280]">
                  Odaberi vrstu izazova i pozovi prijatelja da se natječete zajedno.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CHALLENGE_OPTIONS.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => setSelectedChallengeType(
                        selectedChallengeType === option.type ? null : option.type
                      )}
                      className={`text-left rounded-2xl border-2 overflow-hidden transition-all duration-200 ${
                        selectedChallengeType === option.type
                          ? "border-[#2EC4B6] shadow-lg"
                          : "border-[#E5E7EB] hover:border-[#2EC4B6]/50"
                      }`}
                    >
                      <div className={`bg-gradient-to-r ${option.color} p-4 text-white`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-sm">{option.name}</div>
                            <div className="text-xs opacity-80">{option.days} dana · {option.grace} grace</div>
                          </div>
                          {selectedChallengeType === option.type && (
                            <CheckCircle className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                      <div className="p-3 bg-white">
                        <p className="text-xs text-[#6B7280]">{option.description}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="bg-[#eef2ff] rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-[#4F7BFF] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#4F7BFF]">Kako funkcionira?</p>
                      <p className="text-xs text-[#6B7280] mt-1">
                        Kreiraj izazov, a zatim idi na stranicu Prijatelji da generiraš pozivni link za svog prijatelja.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCreateChallenge}
                  loading={creating}
                  disabled={!selectedChallengeType}
                  className="w-full"
                >
                  <Zap className="w-4 h-4" />
                  Kreiraj izazov
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Empty state */}
      {challenges.length === 0 && (
        <motion.div variants={itemVariants}>
          <div className="text-center py-8 text-[#6B7280]">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-lg font-semibold text-[#1F2937] mb-2">Nema aktivnih izazova</h3>
            <p className="text-sm">Kreiraj izazov i pozovi prijatelja da se natječete zajedno!</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
