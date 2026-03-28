import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { QUESTION_BANK, getNextQuestion, getQuestionPath, FIRST_QUESTION } from '../data/questions.js'
import { useApp } from '../context/AppContext'
import { buildRoadmapFromAnswers } from '../data/roadmapEngine'
import Icon from '../components/Icon'

const MASCOT_MAP: Record<string, string> = {
  timeAway: '/images/mascot-timeaway.png',
  borough: '/images/mascot-borough.png',
  needs: '/images/mascot-sparky.png',
}

const MASCOT_MESSAGES: Record<string, string> = {
  timeAway: "Whether it's been months or decades, I'll help you navigate what's changed.",
  borough: "Knowing your borough helps me find programs and offices close to you.",
  hasID: "Your ID status affects almost every next step — there are no wrong answers here.",
  hasBirthCert: "A birth certificate is the first link in the ID chain — we'll sort it together.",
  housingStatus: "Be honest — this helps me find the right kind of help for tonight.",
  hasChildren: "This determines which shelter intake path is right for your family.",
  paroleProbation: "This helps me show which housing and benefit options are open to you.",
  needs: "Select everything that applies. Your roadmap will cover all of it.",
}

export default function QuestionPage() {
  const { questionId } = useParams<{ questionId: string }>()
  const navigate = useNavigate()
  const { answers, setAnswer, setRoadmap } = useApp()
  const [multiSelected, setMultiSelected] = useState<string[]>([])

  const question = questionId ? (QUESTION_BANK as any)[questionId] : null

  if (!question) {
    navigate(`/question/${FIRST_QUESTION}`, { replace: true })
    return null
  }

  const path = getQuestionPath(answers)
  const currentIndex = path.indexOf(questionId ?? '')
  const stepNum = currentIndex >= 0 ? currentIndex + 1 : path.length + 1
  const TOTAL_STEPS = 8
  const progress = Math.max(10, Math.round((stepNum / TOTAL_STEPS) * 100))

  const mascotSrc = MASCOT_MAP[questionId ?? ''] ?? '/images/mascot-urgent.png'
  const mascotMsg = MASCOT_MESSAGES[questionId ?? ''] ?? question.sub ?? ''

  function handleSingle(value: string) {
    const newAnswers = { ...answers, [questionId!]: value }
    setAnswer(questionId!, value)
    const next = getNextQuestion(questionId!, value)
    if (next === null) {
      const roadmap = buildRoadmapFromAnswers(newAnswers)
      setRoadmap(roadmap)
      navigate('/generating')
    } else {
      navigate(`/question/${next}`)
    }
  }

  function handleMultiToggle(value: string) {
    setMultiSelected(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  function handleMultiSubmit() {
    if (multiSelected.length === 0) return
    const newAnswers = { ...answers, [questionId!]: multiSelected }
    setAnswer(questionId!, multiSelected)
    const next = (question as any).next(multiSelected)
    if (next === null) {
      const roadmap = buildRoadmapFromAnswers(newAnswers)
      setRoadmap(roadmap)
      navigate('/generating')
    } else {
      navigate(`/question/${next}`)
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 md:py-16">
      {/* Progress */}
      <div className="mb-10">
        <div className="flex justify-between items-end mb-3">
          <span className="font-headline font-bold text-primary tracking-tight">Step {stepNum}</span>
          <span className="text-on-surface-variant font-medium text-sm">Building your plan</span>
        </div>
        <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Question + Options */}
        <div className="lg:col-span-8 order-2 lg:order-1">
          <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-8 leading-tight">
            {question.question}
          </h1>

          {question.type === 'single' && (
            <div className="flex flex-col gap-3">
              {(question.options as any[]).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSingle(opt.value)}
                  className="group flex items-center justify-between p-5 bg-surface-container-lowest hover:bg-primary-container/10 border-2 border-transparent hover:border-primary-container rounded-xl transition-all duration-200 text-left active:scale-[0.98] cursor-pointer"
                >
                  <div>
                    <span className="font-headline text-lg font-bold text-on-surface">{opt.label}</span>
                    {opt.sub && <p className="text-sm text-on-surface-variant mt-0.5">{opt.sub}</p>}
                  </div>
                  <Icon name="arrow_forward" className="text-on-surface-variant group-hover:translate-x-1 transition-transform flex-shrink-0 ml-4" />
                </button>
              ))}
            </div>
          )}

          {question.type === 'multi' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {(question.options as any[]).map((opt) => {
                  const selected = multiSelected.includes(opt.value)
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleMultiToggle(opt.value)}
                      className={`group flex items-start gap-4 p-5 rounded-xl border-2 transition-all duration-200 text-left active:scale-[0.98] cursor-pointer ${
                        selected
                          ? 'bg-primary-container/20 border-primary'
                          : 'bg-surface-container-lowest border-transparent hover:border-primary-container hover:bg-primary-container/10'
                      }`}
                    >
                      {opt.icon && <span className="text-2xl flex-shrink-0">{opt.icon}</span>}
                      <div className="flex-1">
                        <span className="font-headline text-base font-bold text-on-surface">{opt.label}</span>
                        {opt.sub && <p className="text-xs text-on-surface-variant mt-0.5">{opt.sub}</p>}
                      </div>
                      {selected && <Icon name="check_circle" filled className="text-primary ml-auto flex-shrink-0 mt-0.5" />}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={handleMultiSubmit}
                disabled={multiSelected.length === 0}
                className="w-full py-5 bg-primary text-on-primary font-headline font-bold text-xl rounded-xl shadow-[0_4px_0_0_#7a3c00] active:shadow-none active:translate-y-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Build My Roadmap →
              </button>
            </>
          )}

          <div className="mt-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-on-surface-variant font-headline font-bold hover:text-primary transition-colors cursor-pointer"
            >
              <Icon name="arrow_back" />
              Go back
            </button>
          </div>
        </div>

        {/* Right: Mascot */}
        <div className="lg:col-span-4 order-1 lg:order-2 sticky top-32">
          <div className="relative p-8 bg-secondary-container rounded-xl shadow-lg transform rotate-1">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary-container rounded-full blur-2xl opacity-40 [contain:strict] [will-change:transform]" />
            <div className="flex flex-col gap-4 relative z-10">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md -mt-12 self-start border-4 border-secondary-container overflow-hidden">
                <img alt="FreshStart Mascot" className="w-10 h-10 object-contain" src={mascotSrc} />
              </div>
              <p className="text-on-secondary-container leading-relaxed text-sm">
                "{mascotMsg}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
