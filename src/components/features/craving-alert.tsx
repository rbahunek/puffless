"use client"

import { AlertTriangle, Wind, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface CravingAlertProps {
  prediction: {
    riskScore: number
    suggestion: string
  }
  onDismiss: () => void
  onOpenCravingSupport: () => void
}

export function CravingAlert({ prediction, onDismiss, onOpenCravingSupport }: CravingAlertProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss()
  }

  return (
    <Card className="border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl" />
      
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
      >
        <X className="w-3 h-3 text-slate-600" />
      </button>

      <div className="p-5 relative">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          
          <div className="flex-1 pt-0.5">
            <h3 className="font-semibold text-amber-900 mb-1">
              Predviđena želja uskoro
            </h3>
            <p className="text-sm text-amber-800 leading-relaxed mb-4">
              {prediction.suggestion}
            </p>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onOpenCravingSupport}
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                <Wind className="w-4 h-4" />
                Otvori podršku
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
