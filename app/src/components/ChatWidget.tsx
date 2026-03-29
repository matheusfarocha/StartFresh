import { useState, useRef, useEffect, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  'Where do I start?',
  'I need a place to stay',
  'How do I get my ID?',
  'What is FreshStart?',
]

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export default function ChatWidget() {
  const { responses, roadmap, currentStep } = useApp()
  const { displayName } = useAuth()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [showNudge, setShowNudge] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const nudgeTimer = useRef<ReturnType<typeof setTimeout>>()

  // Build user context string from their answers + roadmap
  const userContext = useMemo(() => {
    const parts: string[] = []

    if (displayName) parts.push(`User's name: ${displayName}`)

    if (responses && Object.keys(responses).length > 0) {
      parts.push('== USER ONBOARDING ANSWERS ==')
      for (const [key, value] of Object.entries(responses)) {
        const val = Array.isArray(value) ? value.join(', ') : String(value)
        parts.push(`${key}: ${val}`)
      }
    }

    if (roadmap) {
      const allSteps: { title: string; category: string; detail: string; done: boolean }[] = []
      let stepIndex = 0
      for (const section of roadmap.sections) {
        for (const step of section.steps) {
          allSteps.push({
            title: step.text,
            category: section.label,
            detail: step.detail,
            done: stepIndex < currentStep,
          })
          stepIndex++
        }
      }

      const total = allSteps.length
      const completed = allSteps.filter(s => s.done).length
      parts.push(`== USER'S ROADMAP (${completed}/${total} completed) ==`)
      allSteps.forEach((s, i) => {
        parts.push(`${i + 1}. [${s.done ? 'DONE' : i === currentStep ? 'CURRENT' : 'TODO'}] ${s.title} (${s.category}) — ${s.detail}`)
      })
    }

    return parts.length > 0 ? parts.join('\n') : ''
  }, [responses, roadmap, currentStep, displayName])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  // Focus input when opened
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // Nudge after 15s
  useEffect(() => {
    if (!open && messages.length === 0) {
      nudgeTimer.current = setTimeout(() => setShowNudge(true), 15000)
    }
    return () => clearTimeout(nudgeTimer.current)
  }, [open, messages.length])

  const sendMessage = async (text: string) => {
    if (!text.trim() || streaming) return

    setShowNudge(false)
    const userMsg: Message = { role: 'user', content: text.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setStreaming(true)

    // Add placeholder for streaming response
    const assistantMsg: Message = { role: 'assistant', content: '' }
    setMessages([...newMessages, assistantMsg])

    try {
      const res = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          userContext,
        }),
      })

      if (!res.ok) throw new Error('Chat request failed')

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let fullText = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            if (parsed.text) {
              fullText += parsed.text
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = { role: 'assistant', content: fullText }
                return updated
              })
            }
          } catch {
            // skip
          }
        }
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: "I'm having trouble connecting right now. If you need immediate help, call 311 or 988.",
        }
        return updated
      })
    }

    setStreaming(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <>
      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-[250] w-[380px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-background rounded-xl shadow-[0_8px_0_0_#9d4f00] border-2 border-primary-container/30 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary-container px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">
                🌱
              </div>
              <div>
                <h3 className="font-headline font-bold text-on-primary-container text-sm">Fresh</h3>
                <span className="text-[10px] text-on-primary-container/70 font-medium">Your reentry guide</span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-on-primary-container text-xl">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto px-4 py-4 space-y-3">
            {/* Welcome message */}
            {messages.length === 0 && (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">🌱</div>
                <h4 className="font-headline font-bold text-on-surface text-lg mb-1">Hey, I'm Fresh</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed max-w-[260px] mx-auto">
                  I'm here to help you navigate your reentry. Ask me anything about IDs, housing, jobs, or your roadmap.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 bg-secondary-container rounded-full flex items-center justify-center text-xs shrink-0 mr-2 mt-1">
                    🌱
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary-container text-on-primary-container rounded-xl rounded-br-sm'
                      : 'bg-surface-container text-on-surface rounded-xl rounded-bl-sm'
                  }`}
                >
                  {msg.content || (streaming && i === messages.length - 1 && (
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 0 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="px-3 py-1.5 bg-surface-container-high text-on-surface text-xs font-medium rounded-full hover:bg-primary-container/20 transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-outline-variant/10 shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Fresh anything..."
                disabled={streaming}
                className="flex-grow bg-surface-container-highest rounded-full px-4 py-2.5 text-sm text-on-surface placeholder:text-outline-variant outline-none focus:ring-2 focus:ring-primary-container disabled:opacity-50 font-body"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || streaming}
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-on-primary shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-xl">send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nudge Bubble */}
      {!open && showNudge && (
        <button
          onClick={() => { setOpen(true); setShowNudge(false) }}
          className="fixed bottom-20 right-6 z-[250] bg-surface-container-lowest px-4 py-3 rounded-xl rounded-br-sm shadow-[0_4px_0_0_#bcb9b3] max-w-[240px] text-left cursor-pointer hover:scale-105 transition-transform"
        >
          <p className="text-sm font-medium text-on-surface">
            Need help getting started? I'm here for you 🌱
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); setShowNudge(false) }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-surface-container-highest rounded-full flex items-center justify-center text-on-surface-variant text-xs cursor-pointer"
          >
            &times;
          </button>
        </button>
      )}

      {/* FAB */}
      <button
        onClick={() => { setOpen(!open); setShowNudge(false) }}
        className="fixed bottom-6 right-6 z-[250] w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-[0_4px_0_0_#6e3600] active:translate-y-1 active:shadow-[0_1px_0_0_#6e3600] transition-all cursor-pointer hover:scale-105"
      >
        <span className="material-symbols-outlined text-on-primary text-2xl">
          {open ? 'close' : 'chat'}
        </span>
      </button>
    </>
  )
}
