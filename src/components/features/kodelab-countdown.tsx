"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Clock, Calendar } from "lucide-react"

interface KodelabCountdownProps {
  targetDate: Date
  title: string
}

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

function calculateTimeRemaining(targetDate: Date): TimeRemaining {
  const now = new Date().getTime()
  const target = new Date(targetDate).getTime()
  const difference = target - now

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
    isExpired: false,
  }
}

export function KodelabCountdown({ targetDate, title }: KodelabCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(
    calculateTimeRemaining(targetDate)
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  if (timeRemaining.isExpired) {
    return null
  }

  const timeUnits = [
    { value: timeRemaining.days, label: "dana", color: "from-teal-500 to-blue-500" },
    { value: timeRemaining.hours, label: "sati", color: "from-blue-500 to-indigo-500" },
    { value: timeRemaining.minutes, label: "min", color: "from-indigo-500 to-purple-500" },
    { value: timeRemaining.seconds, label: "sek", color: "from-purple-500 to-pink-500" },
  ]

  return (
    <Card className="border-2 border-teal-300 bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl" />

      <div className="p-6 relative">
        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-6 h-6 text-teal-600" />
          <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
        </div>

        {/* Countdown grid */}
        <div className="grid grid-cols-4 gap-3">
          {timeUnits.map((unit, i) => (
            <div key={i} className="text-center">
              <div className={`bg-gradient-to-br ${unit.color} rounded-2xl p-4 shadow-lg mb-2`}>
                <div className="text-3xl md:text-4xl font-bold text-white">
                  {unit.value.toString().padStart(2, "0")}
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                {unit.label}
              </p>
            </div>
          ))}
        </div>

        {/* Footer message */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-teal-700">
          <Calendar className="w-4 h-4" />
          <span className="font-medium">
            01.04.2026. · 00:00
          </span>
        </div>
      </div>
    </Card>
  )
}
