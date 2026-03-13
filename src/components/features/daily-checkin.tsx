"use client"

import { useState } from "react"
import { Smile, Meh, Frown, AlertCircle, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type MoodType = "EXCELLENT" | "GOOD" | "DIFFICULT" | "STRONG_CRAVING"

interface DailyCheckinProps {
  onSubmit: (mood: MoodType, note?: string) => Promise<void>
  hasCheckedInToday?: boolean
}

export function DailyCheckin({ onSubmit, hasCheckedInToday }: DailyCheckinProps) {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(hasCheckedInToday || false)

  const moods = [
    {
      type: "EXCELLENT" as MoodType,
      icon: Smile,
      label: "Odlično",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      hoverBg: "hover:bg-emerald-100",
    },
    {
      type: "GOOD" as MoodType,
      icon: Smile,
      label: "Dobro",
      color: "text-teal-600",
      bg: "bg-teal-50",
      hoverBg: "hover:bg-teal-100",
    },
    {
      type: "DIFFICULT" as MoodType,
      icon: Meh,
      label: "Teško mi je",
      color: "text-amber-600",
      bg: "bg-amber-50",
      hoverBg: "hover:bg-amber-100",
    },
    {
      type: "STRONG_CRAVING" as MoodType,
      icon: AlertCircle,
      label: "Imam veliku želju",
      color: "text-red-600",
      bg: "bg-red-50",
      hoverBg: "hover:bg-red-100",
    },
  ]

  const handleSubmit = async () => {
    if (!selectedMood) return

    setIsSubmitting(true)
    try {
      await onSubmit(selectedMood, note || undefined)
      setSubmitted(true)
    } catch (error) {
      console.error("Failed to submit check-in:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-emerald-900">Hvala na check-in-u!</p>
              <p className="text-sm text-emerald-700">Vidimo se sutra 🌱</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold text-slate-900 mb-1">Kako se danas osjećaš?</h3>
        <p className="text-sm text-slate-600 mb-4">
          Tvoj dnevni check-in pomaže nam razumjeti tvoje obrasce.
        </p>

        {/* Mood options */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {moods.map((mood) => {
            const Icon = mood.icon
            const isSelected = selectedMood === mood.type

            return (
              <button
                key={mood.type}
                onClick={() => setSelectedMood(mood.type)}
                className={`
                  p-4 rounded-xl border-2 transition-all
                  ${isSelected 
                    ? `${mood.bg} border-current ${mood.color}` 
                    : `bg-white border-slate-200 ${mood.hoverBg}`
                  }
                `}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? mood.color : 'text-slate-400'}`} />
                <p className={`text-sm font-medium ${isSelected ? mood.color : 'text-slate-700'}`}>
                  {mood.label}
                </p>
              </button>
            )
          })}
        </div>

        {/* Support suggestions for difficult moods */}
        {(selectedMood === "DIFFICULT" || selectedMood === "STRONG_CRAVING") && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <p className="text-sm font-semibold text-amber-900 mb-2">💪 Probaj ovo:</p>
            <ul className="space-y-1 text-sm text-amber-800">
              <li>• Vježba disanja (3 minute)</li>
              <li>• Kratka šetnja (5 minuta)</li>
              <li>• Popij veliku čašu vode</li>
              <li>• Kontaktiraj prijatelja</li>
            </ul>
          </div>
        )}

        {/* Optional note */}
        {selectedMood && (
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Želiš nešto dodati? (opcionalno)"
            className="w-full p-3 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
            rows={2}
          />
        )}

        {/* Submit button */}
        {selectedMood && (
          <Button
            onClick={handleSubmit}
            loading={isSubmitting}
            className="w-full"
          >
            Pošalji check-in
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
