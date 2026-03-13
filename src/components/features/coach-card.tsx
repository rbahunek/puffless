"use client"

import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface CoachCardProps {
  message: string
  context?: string
}

export function CoachCard({ message, context }: CoachCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-200/20 rounded-full blur-3xl" />
        
        <div className="p-5 relative">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-teal-900">Puffless Coach</h3>
                {context && (
                  <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                    {context}
                  </span>
                )}
              </div>
              <p className="text-sm text-teal-800 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
