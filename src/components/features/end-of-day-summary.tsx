"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, Euro, Heart } from "lucide-react"
import { motion } from "framer-motion"

interface EndOfDaySummaryProps {
  data: {
    cigarettesAvoided: number
    moneySaved: number
    graceUsed: number
    cravingsResolved: number
  }
  coachMessage: string
  onClose: () => void
}

export function EndOfDaySummary({ data, coachMessage, onClose }: EndOfDaySummaryProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-teal-500 to-blue-600 p-8 text-white text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-5xl mb-3"
          >
            🌙
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Danas si napravio/la veliki korak</h2>
          <p className="text-teal-100 text-sm">Tvoj dnevni pregled</p>
        </div>

        {/* Stats */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-emerald-50 border-emerald-200">
              <div className="p-4 text-center">
                <TrendingUp className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-emerald-900">{data.cigarettesAvoided}</div>
                <p className="text-xs text-emerald-700">cigareta izbjegnuto</p>
              </div>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
              <div className="p-4 text-center">
                <Euro className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-amber-900">{data.moneySaved.toFixed(2)} €</div>
                <p className="text-xs text-amber-700">novac ušteđen</p>
              </div>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <div className="p-4 text-center">
                <Heart className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">{data.cravingsResolved}</div>
                <p className="text-xs text-blue-700">želja prebrođeno</p>
              </div>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <div className="p-4 text-center">
                <Sparkles className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-900">{data.graceUsed}</div>
                <p className="text-xs text-orange-700">grace iskorišteno</p>
              </div>
            </Card>
          </div>

          {/* Coach Message */}
          <Card className="bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-semibold text-teal-900">Poruka od Puffless Coach</span>
              </div>
              <p className="text-sm text-teal-800 leading-relaxed italic">
                &ldquo;{coachMessage}&rdquo;
              </p>
            </div>
          </Card>

          {/* Close button */}
          <Button onClick={onClose} className="w-full" size="lg">
            Hvala! Nastavi sutra
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
