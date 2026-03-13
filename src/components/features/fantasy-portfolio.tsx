"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, TrendingUp, AlertCircle } from "lucide-react"

interface Participant {
  id: string
  name: string
  coefficient: number
}

interface FantasyPortfolioProps {
  participants: Participant[]
  budget: number
  existingAllocations: Array<{ registrationId: string; pointsAllocated: number }>
  onAllocate: (allocations: Array<{ registrationId: string; points: number; coefficient: number }>) => Promise<void>
}

export function FantasyPortfolio({ participants, budget, existingAllocations, onAllocate }: FantasyPortfolioProps) {
  const [allocations, setAllocations] = useState<Record<string, number>>(
    existingAllocations.reduce((acc, a) => ({ ...acc, [a.registrationId]: a.pointsAllocated }), {})
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalAllocated = useMemo(() => {
    return Object.values(allocations).reduce((sum, val) => sum + val, 0)
  }, [allocations])

  const remaining = budget - totalAllocated

  const handleChange = (participantId: string, value: number) => {
    const newValue = Math.max(0, Math.min(value, remaining + (allocations[participantId] || 0)))
    setAllocations({
      ...allocations,
      [participantId]: newValue,
    })
  }

  const handleSubmit = async () => {
    const allocationArray = Object.entries(allocations)
      .filter(([_, points]) => points > 0)
      .map(([regId, points]) => {
        const participant = participants.find(p => p.id === regId)
        return {
          registrationId: regId,
          points,
          coefficient: participant?.coefficient || 1.5,
        }
      })

    setIsSubmitting(true)
    try {
      await onAllocate(allocationArray)
    } catch (error) {
      console.error("Allocation failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const potentialWinnings = useMemo(() => {
    return Object.entries(allocations).reduce((sum, [regId, points]) => {
      const participant = participants.find(p => p.id === regId)
      if (!participant || points === 0) return sum
      return sum + (points * participant.coefficient)
    }, 0)
  }, [allocations, participants])

  return (
    <div className="space-y-4">
      {/* Budget Card */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coins className="w-6 h-6 text-amber-600" />
              <div>
                <p className="text-sm text-amber-900 font-semibold">Tvoj budžet</p>
                <p className="text-2xl font-bold text-amber-700">{remaining} Puff bodova</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-600">Potencijalna dobit</p>
              <p className="text-lg font-bold text-emerald-600">
                {potentialWinnings.toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {remaining < 0 && (
        <Card className="border-red-300 bg-red-50">
          <div className="p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800 font-medium">
              Premašio/la si budžet! Smanji raspodjelu.
            </p>
          </div>
        </Card>
      )}

      {/* Allocation List */}
      <div className="space-y-3">
        {participants.map((p) => (
          <Card key={p.id}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-sm">{p.name}</h3>
                  <p className="text-xs text-teal-600">
                    Koeficijent: <strong>{p.coefficient.toFixed(2)}</strong>
                    {allocations[p.id] > 0 && (
                      <span className="text-slate-500 ml-2">
                        → {(allocations[p.id] * p.coefficient).toFixed(0)} bodova
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max={remaining + (allocations[p.id] || 0)}
                  step="5"
                  value={allocations[p.id] || 0}
                  onChange={(e) => handleChange(p.id, parseInt(e.target.value))}
                  className="flex-1"
                />
                <input
                  type="number"
                  min="0"
                  max={remaining + (allocations[p.id] || 0)}
                  value={allocations[p.id] || 0}
                  onChange={(e) => handleChange(p.id, parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-center border border-slate-200 rounded-lg text-sm font-semibold"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={remaining < 0 || totalAllocated === 0}
        loading={isSubmitting}
        className="w-full"
        size="lg"
      >
        <TrendingUp className="w-5 h-5" />
        Potvrdi raspodjelu
      </Button>
    </div>
  )
}
