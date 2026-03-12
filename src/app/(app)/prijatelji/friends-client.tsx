"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Copy, CheckCircle, Share2, Link, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProgramName } from "@/lib/utils"

interface Friend {
  id: string
  name: string
  email: string
  joinedAt: string
  programType: string | null
  programStatus: string | null
}

interface FriendsClientProps {
  inviteCode: string
  friends: Friend[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function FriendsClient({ inviteCode, friends }: FriendsClientProps) {
  const [copied, setCopied] = useState(false)
  const [joinCode, setJoinCode] = useState("")
  const [joining, setJoining] = useState(false)
  const [joinMessage, setJoinMessage] = useState("")

  const inviteLink = typeof window !== "undefined"
    ? `${window.location.origin}/pridruzi-se?kod=${inviteCode}`
    : `https://puffless.app/pridruzi-se?kod=${inviteCode}`

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const el = document.createElement("textarea")
      el.value = inviteCode
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleJoinWithCode = async () => {
    if (!joinCode.trim()) return
    setJoining(true)
    setJoinMessage("")
    try {
      const response = await fetch("/api/invite/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: joinCode.trim().toUpperCase() }),
      })
      const data = await response.json()
      setJoinMessage(response.ok ? "✅ " + data.message : "❌ " + data.error)
    } catch {
      setJoinMessage("❌ Došlo je do pogreške. Pokušaj ponovno.")
    } finally {
      setJoining(false)
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-2xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "Poppins, sans-serif" }}>
          Prijatelji 👥
        </h1>
        <p className="text-[#6B7280] mt-1">
          Pozovi prijatelja i zajedno gradite zdravije navike.
        </p>
      </motion.div>

      {/* Invite section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#2EC4B6]" />
              Pozovi prijatelja
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#6B7280]">
              Podijeli ovaj kod ili link s prijateljem. Kada se registrira, bit ćete povezani.
            </p>

            {/* Invite code */}
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                Tvoj pozivni kod
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-4 py-3">
                  <span className="text-2xl font-bold tracking-widest text-[#1F2937] font-mono">
                    {inviteCode}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyCode}
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Invite link */}
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                Ili podijeli link
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl px-4 py-3 overflow-hidden">
                  <span className="text-sm text-[#6B7280] truncate block">
                    {inviteLink}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  className="flex-shrink-0"
                >
                  <Link className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Share button */}
            {typeof navigator !== "undefined" && "share" in navigator && (
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  navigator.share({
                    title: "Puffless — Prestani pušiti",
                    text: `Pridruži mi se na Puffless! Koristimo kod: ${inviteCode}`,
                    url: inviteLink,
                  })
                }}
              >
                <Share2 className="w-4 h-4" />
                Podijeli pozivnicu
              </Button>
            )}

            {copied && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 rounded-xl p-3 text-center"
              >
                <p className="text-sm text-emerald-600 font-medium">✅ Kopirano!</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Join with code */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#4F7BFF]" />
              Pridruži se izazovu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#6B7280]">
              Imaš pozivni kod od prijatelja? Unesi ga ovdje.
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="ABCD1234"
                maxLength={8}
                className="flex-1 h-11 rounded-xl border border-[#E5E7EB] px-4 text-sm font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-[#4F7BFF]"
              />
              <Button
                onClick={handleJoinWithCode}
                loading={joining}
                disabled={joinCode.length < 6}
                variant="secondary"
              >
                Pridruži se
              </Button>
            </div>
            {joinMessage && (
              <p className={`text-sm ${joinMessage.startsWith("✅") ? "text-emerald-600" : "text-red-600"}`}>
                {joinMessage}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Friends list */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#6B7280]" />
              Moji prijatelji
              {friends.length > 0 && (
                <Badge variant="default">{friends.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {friends.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">👥</div>
                <p className="text-[#6B7280] text-sm mb-2">Još nemaš prijatelja na Puffless.</p>
                <p className="text-xs text-[#9CA3AF]">
                  Podijeli pozivni kod i zajedno krenite na put prema zdravijem životu!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center gap-4 p-3 bg-[#F7FAFC] rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F7BFF] to-[#2EC4B6] flex items-center justify-center text-white font-bold flex-shrink-0">
                      {friend.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-[#1F2937] truncate">{friend.name}</div>
                      <div className="text-xs text-[#6B7280]">
                        {friend.programType ? getProgramName(friend.programType) : "Bez programa"}
                      </div>
                    </div>
                    {friend.programStatus && (
                      <Badge variant={friend.programStatus === "ACTIVE" ? "success" : "warning"}>
                        {friend.programStatus === "ACTIVE" ? "Aktivan" : "Fokus"}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* How it works */}
      <motion.div variants={itemVariants}>
        <div className="bg-gradient-to-r from-[#e8faf9] to-[#eef2ff] rounded-2xl p-6">
          <h3 className="font-semibold text-[#1F2937] mb-4">Kako funkcionira natjecanje?</h3>
          <div className="space-y-3">
            {[
              { step: "1", text: "Pozovi prijatelja putem koda ili linka" },
              { step: "2", text: "Prijatelj se registrira i unese tvoj kod" },
              { step: "3", text: "Kreiraj izazov na stranici Izazovi" },
              { step: "4", text: "Pratite napredak zajedno na ljestvici" },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2EC4B6] to-[#4F7BFF] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {item.step}
                </div>
                <span className="text-sm text-[#374151]">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
