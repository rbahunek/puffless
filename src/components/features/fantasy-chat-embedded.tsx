"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Send } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { hr } from "date-fns/locale"

interface ChatMessage {
  id: string
  message: string
  createdAt: string
  user: {
    name: string | null
    email: string | null
  }
}

interface FantasyChatEmbeddedProps {
  isFantasyParticipant: boolean
}

const QUICK_EMOJIS = ["🔥", "💪", "😂", "❤️", "🚀", "👍", "🎯", "⭐", "💯", "🙌"]

export function FantasyChatEmbedded({ isFantasyParticipant }: FantasyChatEmbeddedProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [lastTimestamp, setLastTimestamp] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch messages
  const fetchMessages = async (initial = false) => {
    try {
      const url = initial 
        ? "/api/kodelab/chat?limit=50"
        : lastTimestamp 
        ? `/api/kodelab/chat?since=${lastTimestamp}`
        : "/api/kodelab/chat?limit=50"

      const response = await fetch(url)
      const data = await response.json()

      if (data.messages && data.messages.length > 0) {
        if (initial) {
          setMessages(data.messages)
        } else {
          setMessages((prev) => [...prev, ...data.messages])
        }
        setLastTimestamp(data.timestamp)
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    }
  }

  // Initial load
  useEffect(() => {
    fetchMessages(true)
  }, [])

  // Polling every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages(false)
    }, 3000)

    return () => clearInterval(interval)
  }, [lastTimestamp])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() || !isFantasyParticipant) return

    setIsSending(true)
    try {
      await fetch("/api/kodelab/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      })
      setNewMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const addEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji)
  }

  return (
    <Card className="border-amber-200">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
        <CardTitle className="flex items-center gap-2 text-amber-900">
          <MessageCircle className="w-5 h-5" />
          Fantasy Chat
        </CardTitle>
        <p className="text-xs text-amber-700 mt-1">
          {isFantasyParticipant ? "Razgovaraj s ekipom! 💬" : "Samo za Fantasy sudionike"}
        </p>
      </CardHeader>

      <CardContent className="p-0">
        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Još nema poruka.</p>
              <p className="text-xs text-slate-400 mt-1">Budi prvi! 🔥</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="bg-white rounded-xl p-3 shadow-sm">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-semibold text-slate-900 text-sm">
                    {msg.user.name?.split(" ")[0] || "Anonim"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatDistanceToNow(new Date(msg.createdAt), { locale: hr, addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-slate-700 break-words">{msg.message}</p>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {isFantasyParticipant ? (
          <div className="p-4 border-t border-slate-200 bg-white">
            {/* Quick emojis */}
            <div className="flex gap-1 mb-3 flex-wrap">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => addEmoji(emoji)}
                  className="w-9 h-9 hover:bg-slate-100 rounded-lg transition-colors text-xl flex items-center justify-center"
                >
                  {emoji}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Napiši poruku..."
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                maxLength={500}
              />
              <Button
                onClick={handleSend}
                loading={isSending}
                disabled={!newMessage.trim()}
                size="sm"
                className="bg-amber-500 hover:bg-amber-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500">
              Pridruži se Fantasy igri da bi mogao/la pisati! 💬
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
