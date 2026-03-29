import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { useApp } from '../context/AppContext'
import { buildRoadmapFromAnswers } from '../data/roadmapEngine'
import type { GeneratedRoadmap, RoadmapStep } from '../data/roadmapEngine'

const FUNC_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-tasks`
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

interface GeminiQuestion {
  id: string
  question: string
  options: { value: string; label: string }[]
}

interface GeminiTask {
  title: string
  what: string
  detail: string
  time: string
  icon: string
}

export default function FollowUpQuestions() {
  const navigate = useNavigate()
  const { answers, setAnswer, setRoadmap } = useApp()
  const [questions, setQuestions] = useState<GeminiQuestion[]>([])
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({})
  const [currentQ, setCurrentQ] = useState(0)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(false)
  const [showCustom, setShowCustom] = useState(false)
  const [customText, setCustomText] = useState('')

  // Fetch follow-up questions from Gemini
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(FUNC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ANON_KEY}` },
          body: JSON.stringify({ action: 'questions', answers }),
        })
        if (!res.ok) throw new Error()
        const { questions: qs } = await res.json()
        setQuestions(qs)
      } catch {
        setError(true)
      }
      setLoading(false)
    })()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (value: string) => {
    const q = questions[currentQ]
    const updated = { ...followUpAnswers, [q.id]: value }
    setFollowUpAnswers(updated)
    setAnswer(q.id, value)
    setShowCustom(false)
    setCustomText('')

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      finalize(updated)
    }
  }

  const handleCustomSubmit = () => {
    if (!customText.trim()) return
    handleAnswer(customText.trim())
  }

  const finalize = async (fAnswers: Record<string, string>) => {
    setGenerating(true)

    // Build base roadmap from engine
    const baseRoadmap = buildRoadmapFromAnswers(answers)

    try {
      // Get Gemini-generated tasks
      const res = await fetch(FUNC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ANON_KEY}` },
        body: JSON.stringify({ action: 'tasks', answers, followUpAnswers: fAnswers }),
      })

      if (res.ok) {
        const { tasks } = await res.json() as { tasks: GeminiTask[] }

        // Count base steps and cap total at 10
        const baseStepCount = baseRoadmap.sections.reduce((sum, s) => sum + s.steps.length, 0)
        const maxAi = Math.max(0, 10 - baseStepCount)
        const trimmedTasks = tasks.slice(0, maxAi)

        const aiSteps: RoadmapStep[] = trimmedTasks.map((t, i) => ({
          id: `ai-${i + 1}`,
          text: t.title,
          what: t.what,
          detail: t.detail,
          time: t.time,
        }))

        const enrichedRoadmap: GeneratedRoadmap = {
          ...baseRoadmap,
          sections: [
            ...baseRoadmap.sections,
            {
              key: 'ai-personalized',
              label: 'Personalized For You',
              icon: 'auto_awesome',
              color: '#9d4f00',
              score: 35, // appears after main sections
              isAuto: true,
              steps: aiSteps,
            },
          ],
        }

        setRoadmap(enrichedRoadmap)
      } else {
        // Gemini failed — use base roadmap
        setRoadmap(baseRoadmap)
      }
    } catch {
      // Gemini failed — use base roadmap
      setRoadmap(baseRoadmap)
    }

    navigate('/generating')
  }

  // Skip if Gemini fails — just use the base engine
  const handleSkip = () => {
    const baseRoadmap = buildRoadmapFromAnswers(answers)
    setRoadmap(baseRoadmap)
    navigate('/generating')
  }

  if (loading) {
    return (
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-16">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-6" />
        <p className="font-headline font-bold text-on-surface-variant">Preparing a few more questions for you...</p>
      </main>
    )
  }

  if (error || questions.length === 0) {
    // Silently skip — go straight to roadmap generation
    handleSkip()
    return null
  }

  if (generating) {
    return (
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-16">
        <div className="w-12 h-12 rounded-full border-4 border-secondary border-t-transparent animate-spin mb-6" />
        <p className="font-headline font-bold text-on-surface-variant">Creating your personalized tasks...</p>
      </main>
    )
  }

  const q = questions[currentQ]
  const progress = Math.round(((currentQ + 1) / questions.length) * 100)

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 md:py-16">
      {/* Progress */}
      <div className="mb-10">
        <div className="flex justify-between items-end mb-3">
          <span className="font-headline font-bold text-primary tracking-tight">
            Follow-up {currentQ + 1} of {questions.length}
          </span>
          <span className="text-on-surface-variant font-medium text-sm">Almost done</span>
        </div>
        <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Question */}
        <div className="lg:col-span-8 order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container/30 rounded-full text-xs font-bold text-secondary mb-4">
            <Icon name="auto_awesome" className="text-sm" />
            AI-powered question
          </div>

          <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-8 leading-tight">
            {q.question}
          </h1>

          <div className="flex flex-col gap-3">
            {q.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                className="group flex items-center justify-between p-5 bg-surface-container-lowest hover:bg-primary-container/10 border-2 border-transparent hover:border-primary-container rounded-xl transition-all duration-200 text-left active:scale-[0.98] cursor-pointer"
              >
                <span className="font-headline text-lg font-bold text-on-surface">{opt.label}</span>
                <Icon name="arrow_forward" className="text-on-surface-variant group-hover:translate-x-1 transition-transform shrink-0 ml-4" />
              </button>
            ))}

            {/* Something else — custom input */}
            {!showCustom ? (
              <button
                onClick={() => setShowCustom(true)}
                className="group flex items-center justify-between p-5 bg-surface-container-lowest hover:bg-primary-container/10 border-2 border-dashed border-outline-variant/30 hover:border-primary-container rounded-xl transition-all duration-200 text-left active:scale-[0.98] cursor-pointer"
              >
                <span className="font-headline text-lg font-bold text-on-surface-variant">Something else...</span>
                <Icon name="edit" className="text-on-surface-variant shrink-0 ml-4" />
              </button>
            ) : (
              <div className="p-5 bg-surface-container-lowest border-2 border-primary-container rounded-xl">
                <div className="flex items-center gap-3 bg-surface-container-highest rounded-lg px-4 py-4 focus-within:ring-3 focus-within:ring-primary-fixed transition-all">
                  <input
                    type="text"
                    autoFocus
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleCustomSubmit() }}
                    placeholder="Type your answer..."
                    className="bg-transparent outline-none w-full text-on-surface placeholder:text-outline-variant font-body"
                  />
                  <button
                    onClick={handleCustomSubmit}
                    disabled={!customText.trim()}
                    className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-on-primary shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
                  >
                    <Icon name="arrow_forward" className="text-xl" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <button
              onClick={handleSkip}
              className="flex items-center gap-2 text-on-surface-variant font-headline font-bold hover:text-primary transition-colors cursor-pointer"
            >
              <Icon name="skip_next" />
              Skip and build my roadmap
            </button>
          </div>
        </div>

        {/* Mascot */}
        <div className="lg:col-span-4 order-1 lg:order-2 sticky top-32">
          <div className="relative p-8 bg-secondary-container rounded-xl shadow-lg transform rotate-1">
            <div className="flex flex-col gap-4 relative z-10">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md -mt-12 self-start border-4 border-secondary-container overflow-hidden">
                <img alt="FreshStart Mascot" className="w-10 h-10 object-contain" src="/images/mascot-sparky.png" />
              </div>
              <p className="text-on-secondary-container leading-relaxed text-sm">
                "Just a few more — these help me find resources that are specific to your situation."
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
