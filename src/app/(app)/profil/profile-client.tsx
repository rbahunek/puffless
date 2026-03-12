"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Settings, Trophy, Edit3, Save, X, Calendar, Cigarette, Euro } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate, getProgramName, getTriggerLabel } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface ProfileClientProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
  }
  profile: {
    displayName?: string | null
    cigarettesPerDay: number
    cigarettesPerPack: number
    pricePerPack: number
    quitDate: string
    triggers: string[]
  }
  activeProgram: {
    type: string
    status: string
    startDate: string
    graceUsed: number
    graceLimit: number
  } | null
  achievements: Array<{
    key: string
    name: string
    description: string
    icon: string
    unlockedAt: string
  }>
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function ProfileClient({ user, profile, activeProgram, achievements }: ProfileClientProps) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    displayName: profile.displayName || user.name || "",
    cigarettesPerDay: profile.cigarettesPerDay,
    cigarettesPerPack: profile.cigarettesPerPack,
    pricePerPack: profile.pricePerPack,
    quitDate: profile.quitDate.split("T")[0],
  })

  const initials = (profile.displayName || user.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setEditing(false)
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to save profile:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-2xl mx-auto"
    >
      {/* Profile header */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2EC4B6] to-[#4F7BFF] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-[#1F2937]" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {profile.displayName || user.name || "Korisnik"}
                </h2>
                <p className="text-[#6B7280] text-sm">{user.email}</p>
                {activeProgram && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={activeProgram.status === "ACTIVE" ? "success" : "warning"}>
                      {getProgramName(activeProgram.type)}
                    </Badge>
                  </div>
                )}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditing(!editing)}
              >
                {editing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                {editing ? "Odustani" : "Uredi"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profile settings */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#6B7280]" />
              Postavke profila
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <>
                <Input
                  label="Ime za prikaz"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">
                      Cigareta dnevno
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.cigarettesPerDay}
                      onChange={(e) => setFormData({ ...formData, cigarettesPerDay: parseInt(e.target.value) || 1 })}
                      className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">
                      Cigareta u kutiji
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={formData.cigarettesPerPack}
                      onChange={(e) => setFormData({ ...formData, cigarettesPerPack: parseInt(e.target.value) || 1 })}
                      className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">
                    Cijena kutije (€)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="50"
                    step="0.1"
                    value={formData.pricePerPack}
                    onChange={(e) => setFormData({ ...formData, pricePerPack: parseFloat(e.target.value) || 0.5 })}
                    className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">
                    Datum početka
                  </label>
                  <input
                    type="date"
                    value={formData.quitDate}
                    onChange={(e) => setFormData({ ...formData, quitDate: e.target.value })}
                    className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]"
                  />
                </div>
                <Button onClick={handleSave} loading={saving} className="w-full">
                  <Save className="w-4 h-4" />
                  Spremi promjene
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                {[
                  {
                    icon: User,
                    label: "Ime",
                    value: profile.displayName || user.name || "—",
                    color: "#2EC4B6",
                    bg: "#e8faf9",
                  },
                  {
                    icon: Cigarette,
                    label: "Cigareta dnevno",
                    value: `${profile.cigarettesPerDay} cigareta`,
                    color: "#4F7BFF",
                    bg: "#eef2ff",
                  },
                  {
                    icon: Euro,
                    label: "Cijena kutije",
                    value: `${profile.pricePerPack.toFixed(2)} € (${profile.cigarettesPerPack} kom)`,
                    color: "#FFD166",
                    bg: "#fff8e6",
                  },
                  {
                    icon: Calendar,
                    label: "Datum početka",
                    value: formatDate(profile.quitDate),
                    color: "#FF8C42",
                    bg: "#fff4ed",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: item.bg }}
                    >
                      <item.icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <div>
                      <div className="text-xs text-[#9CA3AF] font-medium">{item.label}</div>
                      <div className="text-sm font-semibold text-[#1F2937]">{item.value}</div>
                    </div>
                  </div>
                ))}

                {profile.triggers.length > 0 && (
                  <div>
                    <div className="text-xs text-[#9CA3AF] font-medium mb-2">Okidači</div>
                    <div className="flex flex-wrap gap-2">
                      {profile.triggers.map((trigger) => (
                        <Badge key={trigger} variant="muted">
                          {getTriggerLabel(trigger)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Active program */}
      {activeProgram && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#FFD166]" />
                Aktivni program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6B7280]">Program</span>
                  <span className="font-semibold text-[#1F2937]">{getProgramName(activeProgram.type)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6B7280]">Status</span>
                  <Badge variant={activeProgram.status === "ACTIVE" ? "success" : "warning"}>
                    {activeProgram.status === "ACTIVE" ? "Aktivan" : "Potreban fokus"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6B7280]">Početak</span>
                  <span className="text-sm font-medium text-[#374151]">{formatDate(activeProgram.startDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6B7280]">Grace cigarete</span>
                  <span className="text-sm font-medium text-[#374151]">
                    {activeProgram.graceUsed}/{activeProgram.graceLimit} iskorišteno
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Achievements */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#FFD166]" />
              Dostignuća
              {achievements.length > 0 && (
                <Badge variant="accent">{achievements.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {achievements.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🏆</div>
                <p className="text-[#6B7280] text-sm">Još nemaš dostignuća.</p>
                <p className="text-xs text-[#9CA3AF] mt-1">Nastavi s programom i osvoji prve nagrade!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.key}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gradient-to-br from-[#fff8e6] to-[#fff4ed] rounded-xl p-4 border border-[#FFD166]/30"
                  >
                    <div className="text-2xl mb-2">{achievement.icon}</div>
                    <div className="font-semibold text-sm text-[#1F2937]">{achievement.name}</div>
                    <div className="text-xs text-[#6B7280] mt-1">{achievement.description}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
