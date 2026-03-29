import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { useApp } from '../context/AppContext'

const STAGES = [
  { label: 'Analyzing your answers', icon: 'psychology', duration: 1200 },
  { label: 'Finding resources in your borough', icon: 'location_on', duration: 1400 },
  { label: 'Prioritizing your needs', icon: 'sort', duration: 1000 },
  { label: 'Building your step-by-step plan', icon: 'route', duration: 1200 },
  { label: 'Finalizing your roadmap', icon: 'check_circle', duration: 800 },
]

const TIPS = [
  "Tip: You can always redo your roadmap from your Profile page.",
  "Tip: Tap any step on your roadmap to see a detailed guide.",
  "Tip: Chat with Fresh anytime — the chat icon is in the bottom right.",
  "Tip: 311 is NYC's free helpline. They can connect you to almost anything.",
  "Tip: Your progress is saved automatically. Come back anytime.",
]

export default function GeneratingRoadmap() {
  const navigate = useNavigate()
  const { roadmap } = useApp()
  const [currentStage, setCurrentStage] = useState(0)
  const [progress, setProgress] = useState(0)
  const [tipIndex] = useState(() => Math.floor(Math.random() * TIPS.length))

  // Advance through stages
  useEffect(() => {
    if (currentStage >= STAGES.length) {
      // All done — navigate
      const timer = setTimeout(() => navigate('/roadmap'), 400)
      return () => clearTimeout(timer)
    }

    const stage = STAGES[currentStage]
    const timer = setTimeout(() => {
      setCurrentStage(prev => prev + 1)
    }, stage.duration)

    return () => clearTimeout(timer)
  }, [currentStage, navigate])

  // Smooth progress bar
  useEffect(() => {
    const targetProgress = currentStage >= STAGES.length
      ? 100
      : Math.round(((currentStage + 0.5) / STAGES.length) * 100)

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= targetProgress) { clearInterval(interval); return targetProgress }
        return prev + 1
      })
    }, 30)

    return () => clearInterval(interval)
  }, [currentStage])

  // If roadmap doesn't exist yet, redirect to onboarding
  useEffect(() => {
    if (!roadmap) {
      const timeout = setTimeout(() => {
        if (!roadmap) navigate('/home')
      }, 8000)
      return () => clearTimeout(timeout)
    }
  }, [roadmap, navigate])

  const stagesDone = currentStage
  const allDone = currentStage >= STAGES.length

  return (
    <main className="relative flex flex-col items-center justify-center min-h-[819px] px-6 py-12 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary-fixed opacity-20 rounded-full floating-blob" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-primary-container opacity-10 rounded-full floating-blob" />

      <div className="w-full max-w-2xl text-center space-y-10 z-10">
        {/* Mascot with Progress Ring */}
        <div className="relative inline-block">
          <div className="w-56 h-56 mx-auto rounded-full bg-surface-container-lowest shadow-[0_32px_64px_-16px_rgba(0,113,100,0.08)] flex items-center justify-center overflow-visible relative">
            {/* Progress ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 scale-110">
              <circle
                cx="50%"
                cy="50%"
                fill="transparent"
                r="48%"
                stroke="#eae9dd"
                strokeWidth="6"
              />
              <circle
                cx="50%"
                cy="50%"
                fill="transparent"
                r="48%"
                stroke="#007164"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${progress * 3} 300`}
                style={{ transition: 'stroke-dasharray 0.3s ease-out' }}
              />
            </svg>
            <img
              alt="Mascot thinking"
              className={`w-44 h-44 object-contain z-10 transition-transform duration-700 ${allDone ? 'scale-110' : ''}`}
              src="/images/mascot-generating.png"
            />
          </div>

          {/* Percentage badge */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary px-4 py-1.5 rounded-full font-headline font-black text-sm shadow-[0_3px_0_0_#00635d]">
            {progress}%
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
            {allDone ? (
              <>Your plan is <span className="text-secondary">ready!</span></>
            ) : (
              <>Building your <span className="text-primary italic">personal plan...</span></>
            )}
          </h1>
          <p className="font-body text-lg text-on-surface-variant max-w-md mx-auto leading-relaxed">
            {allDone
              ? "Let's get started on your fresh start."
              : STAGES[currentStage]?.label ?? 'Almost there...'}
          </p>
        </div>

        {/* Stage checklist */}
        <div className="max-w-sm mx-auto space-y-2 text-left">
          {STAGES.map((stage, i) => {
            const done = i < stagesDone
            const active = i === currentStage && !allDone
            return (
              <div
                key={stage.label}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-500 ${
                  done ? 'bg-secondary-container/30' : active ? 'bg-primary-container/15' : 'opacity-40'
                }`}
              >
                {done ? (
                  <Icon name="check_circle" filled className="text-secondary text-xl" />
                ) : active ? (
                  <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                ) : (
                  <Icon name="radio_button_unchecked" className="text-outline-variant text-xl" />
                )}
                <span className={`text-sm font-medium ${done ? 'text-on-surface' : active ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                  {stage.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Tip */}
        <div className="mt-8 inline-flex items-center gap-2 text-on-surface-variant bg-surface-container-low py-3 px-5 rounded-full border border-outline-variant/10">
          <Icon name="lightbulb" className="text-sm text-primary-fixed-dim" />
          <span className="text-sm font-medium">{TIPS[tipIndex]}</span>
        </div>
      </div>
    </main>
  )
}
