"use client"

import { useState } from "react"
import { Wind, Timer, Droplets, Footprints, Heart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface RescueToolkitProps {
  onToolUsed: (tool: string) => void
}

export function RescueToolkit({ onToolUsed }: RescueToolkitProps) {
  const [activeTimer, setActiveTimer] = useState<number | null>(null)
  const [completedTools, setCompletedTools] = useState<string[]>([])

  const tools = [
    {
      id: "breathing",
      icon: Wind,
      title: "Disanje",
      description: "Vođena vježba disanja",
      color: "teal",
      bgColor: "bg-teal-50",
      textColor: "text-teal-700",
      iconColor: "text-teal-600",
    },
    {
      id: "delay",
      icon: Timer,
      title: "Odgodi 3 min",
      description: "Čekaj - želja prolazi",
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      iconColor: "text-blue-600",
    },
    {
      id: "water",
      icon: Droplets,
      title: "Popij vodu",
      description: "Velika čaša hladne vode",
      color: "cyan",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-700",
      iconColor: "text-cyan-600",
    },
    {
      id: "walk",
      icon: Footprints,
      title: "Kratka šetnja",
      description: "5 minuta svježeg zraka",
      color: "emerald",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      iconColor: "text-emerald-600",
    },
    {
      id: "why",
      icon: Heart,
      title: "Zašto sam počeo/la",
      description: "Prisjetit se razloga",
      color: "pink",
      bgColor: "bg-pink-50",
      textColor: "text-pink-700",
      iconColor: "text-pink-600",
    },
  ]

  const handleToolClick = (toolId: string) => {
    if (completedTools.includes(toolId)) return

    setCompletedTools([...completedTools, toolId])
    onToolUsed(toolId)

    if (toolId === "delay") {
      setActiveTimer(180) // 3 minutes
      const interval = setInterval(() => {
        setActiveTimer((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval)
            return null
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-slate-900 mb-1">Rescue Toolkit</h3>
        <p className="text-sm text-slate-600">
          Odaberi alat koji ti može pomoći upravo sada.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tools.map((tool) => {
          const Icon = tool.icon
          const isCompleted = completedTools.includes(tool.id)
          const isTimer = tool.id === "delay" && activeTimer !== null

          return (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              disabled={isCompleted}
              className={`
                relative p-4 rounded-xl border-2 transition-all text-left
                ${isCompleted 
                  ? 'bg-slate-50 border-slate-200 opacity-60' 
                  : `${tool.bgColor} border-transparent hover:border-current ${tool.textColor}`
                }
              `}
            >
              {isCompleted && (
                <div className="absolute top-2 right-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
              )}
              
              <Icon className={`w-6 h-6 mb-2 ${isCompleted ? 'text-slate-400' : tool.iconColor}`} />
              <p className={`text-sm font-semibold mb-1 ${isCompleted ? 'text-slate-500' : tool.textColor}`}>
                {tool.title}
              </p>
              
              {isTimer ? (
                <p className="text-2xl font-bold text-blue-600">
                  {formatTime(activeTimer)}
                </p>
              ) : (
                <p className={`text-xs ${isCompleted ? 'text-slate-400' : 'text-slate-600'}`}>
                  {tool.description}
                </p>
              )}
            </button>
          )
        })}
      </div>

      {completedTools.length > 0 && (
        <Card className="bg-teal-50 border-teal-200">
          <div className="p-4">
            <p className="text-sm text-teal-800">
              <strong>Odlično!</strong> Koristiš aktivne strategije umjesto pasivnog čekanja. To je pravi put! 💪
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
