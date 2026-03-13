"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getConfidenceLabel } from "@/lib/kodelab"

interface FantasyRatingProps {
  participant: {
    id: string
    name: string
    coefficient: number
    userRating: number | null
  }
  onRate: (registrationId: string, confidence: number) => Promise<void>
}

export function FantasyRating({ participant, onRate }: FantasyRatingProps) {
  const [selectedRating, setSelectedRating] = useState<number>(participant.userRating || 0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRate = async (confidence: number) => {
    setSelectedRating(confidence)
    setIsSubmitting(true)
    try {
      await onRate(participant.id, confidence)
    } catch (error) {
      console.error("Rating failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={`${selectedRating > 0 ? "border-amber-300 bg-amber-50/30" : ""}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-slate-900">{participant.name}</h3>
            <p className="text-xs text-slate-500">
              Koeficijent: <span className="font-bold text-teal-600">{participant.coefficient.toFixed(2)}</span>
            </p>
          </div>
          {selectedRating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-bold text-amber-700">{selectedRating}</span>
            </div>
          )}
        </div>

        {/* Rating buttons */}
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRate(rating)}
              disabled={isSubmitting}
              className={`
                flex-1 py-2 rounded-lg text-sm font-semibold transition-all
                ${selectedRating === rating
                  ? "bg-amber-500 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }
              `}
            >
              {rating}
            </button>
          ))}
        </div>

        {selectedRating > 0 && (
          <p className="text-xs text-slate-600 mt-2 text-center">
            {getConfidenceLabel(selectedRating)}
          </p>
        )}
      </div>
    </Card>
  )
}
