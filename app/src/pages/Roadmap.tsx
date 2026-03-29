import { useState } from 'react'
import confetti from 'canvas-confetti'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import type { RoadmapSection } from '../data/roadmapEngine'

type StepStatus = 'completed' | 'current' | 'upcoming' | 'locked'

const sectionIcons: Record<string, string> = {
  id:           'badge',
  housing:      'house',
  food:         'restaurant',
  employment:   'work',
  mentalHealth: 'psychology',
  family:       'family_restroom',
  education:    'school',
  community:    'groups',
  custom:       'edit_note',
  phone:        'smartphone',
  'ai-personalized': 'auto_awesome',
}

const stepOffsets = [
  '-translate-x-20',
  'translate-x-20',
  '-translate-x-14',
  'translate-x-10',
  '-translate-x-20',
  'translate-x-16',
  '-translate-x-10',
  'translate-x-20',
]

interface FlatStep {
  id: string
  title: string
  what: string
  category: string
  sectionKey: string
  detail: string
  time: string
}

function flattenSections(sections: RoadmapSection[]): FlatStep[] {
  const flat: FlatStep[] = []
  for (const section of sections) {
    for (const step of section.steps) {
      flat.push({
        id: step.id,
        title: step.text,
        what: step.what ?? '',
        category: section.label,
        sectionKey: section.key,
        detail: step.detail,
        time: step.time,
      })
    }
  }
  return flat
}

function fireConfetti() {
  const duration = 3000
  const end = Date.now() + duration

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#9d4f00', '#ffaf75', '#007164', '#97f7e4', '#fdc003'],
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#9d4f00', '#ffaf75', '#007164', '#97f7e4', '#fdc003'],
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()

  // Big burst in the middle
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#9d4f00', '#ffaf75', '#007164', '#97f7e4', '#fdc003'],
    })
  }, 300)
}

export default function Roadmap() {
  const { roadmap, currentStep, setCurrentStep } = useApp()
  const { displayName } = useAuth()
  const [openStep, setOpenStep] = useState<number | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const allSteps: FlatStep[] = roadmap ? flattenSections(roadmap.sections) : []
  const totalSteps = allSteps.length
  const allDone = currentStep >= totalSteps
  const progressPercent = totalSteps > 0 ? Math.round((Math.min(currentStep, totalSteps) / totalSteps) * 100) : 0
  const currentStepData = allDone ? null : allSteps[currentStep]

  const getStatus = (index: number): StepStatus => {
    if (index < currentStep) return 'completed'
    if (index === currentStep && !allDone) return 'current'
    if (index === currentStep + 1) return 'upcoming'
    return allDone ? 'completed' : 'locked'
  }

  const handleCardClick = (index: number) => {
    const status = getStatus(index)
    if (status === 'completed' || status === 'current') {
      setOpenStep(index)
      setFullscreen(false)
    }
  }

  const handleComplete = () => {
    const nextStep = currentStep + 1
    setCurrentStep(nextStep)
    setOpenStep(null)
    setFullscreen(false)

    // Last step completed — celebrate!
    if (nextStep >= totalSteps) {
      fireConfetti()
    }
  }

  const handleUndo = (index: number) => {
    setCurrentStep(index)
  }

  const closeDetail = () => {
    setOpenStep(null)
    setFullscreen(false)
  }

  if (!roadmap || allSteps.length === 0) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-on-surface-variant font-headline text-lg">No roadmap yet — complete the questions first.</p>
      </main>
    )
  }

  const openStepData = openStep !== null ? allSteps[openStep] : null
  const openStepStatus = openStep !== null ? getStatus(openStep) : null
  const openStepIcon = openStepData ? (sectionIcons[openStepData.sectionKey] || 'task_alt') : ''

  return (
    <>
      <main className="pt-4 pb-32 min-h-screen px-6 max-w-2xl mx-auto relative">
        {/* Progress Overview */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold font-headline tracking-tighter text-on-surface mb-2">
            {allDone ? 'Journey Complete!' : 'My Journey'}
          </h1>
          <p className="text-on-surface-variant font-medium">
            {allDone
              ? `You did it${displayName ? ` ${displayName}` : ''}! Every step is complete.`
              : <>Step {currentStep + 1} of {totalSteps} &bull; {currentStepData?.category}</>}
          </p>
          <div className="mt-6 w-full h-4 bg-surface-container-highest rounded-full overflow-hidden relative">
            <div
              className={`h-full rounded-full relative transition-all duration-700 ease-out ${allDone ? 'bg-secondary' : 'bg-secondary'}`}
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
            </div>
          </div>
        </section>

        {/* Winding Path UI */}
        <div className="relative flex flex-col items-center py-10">
          {allSteps.map((step, index) => {
            const status = getStatus(index)
            const icon = sectionIcons[step.sectionKey] || 'task_alt'
            const offset = stepOffsets[index % stepOffsets.length]

            return (
              <StepNode
                key={step.id}
                step={step} index={index} status={status} icon={icon}
                offset={offset}
                onCardClick={() => handleCardClick(index)}
                onUndo={() => handleUndo(index)}
              />
            )
          })}
        </div>

        {/* Completion banner */}
        {allDone && (
          <div className="mb-12 bg-secondary-container p-8 rounded-xl text-center shadow-[0_6px_0_0_#00635d]">
            <span className="material-symbols-outlined text-on-secondary-container text-6xl mb-4">celebration</span>
            <h2 className="font-headline font-extrabold text-2xl text-on-secondary-container mb-2">
              Congratulations!
            </h2>
            <p className="text-on-secondary-container leading-relaxed max-w-md mx-auto">
              You've completed every step on your roadmap. Your fresh start is in full swing. Remember, you can always come back to review any step.
            </p>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      {!allDone && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-40">
          <button
            onClick={() => handleCardClick(currentStep)}
            className="w-full py-5 bg-primary-container text-on-primary-container font-black text-xl rounded-lg shadow-[0_6px_0_0_#9d4f00] active:translate-y-1 active:shadow-[0_2px_0_0_#9d4f00] transition-all flex items-center justify-center gap-3 cursor-pointer font-headline"
          >
            <span>View Step {currentStep + 1}</span>
            <span className="material-symbols-outlined font-bold">arrow_forward</span>
          </button>
        </div>
      )}

      {/* Detail Panel / Guide */}
      {openStepData && (
        <div className={`fixed inset-0 z-[200] flex ${isMobile ? 'items-end justify-center' : 'justify-end'}`} onClick={closeDetail}>
          <div className="absolute inset-0 bg-black/40" />

          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative bg-background overflow-y-auto transition-all duration-300 ease-out ${
              isMobile
                ? fullscreen
                  ? 'w-full h-full rounded-none'
                  : 'w-full max-h-[85vh] rounded-t-xl shadow-[0_-8px_40px_rgba(0,0,0,0.15)]'
                : fullscreen
                  ? 'w-full h-full shadow-[-8px_0_40px_rgba(0,0,0,0.15)]'
                  : 'w-full max-w-md h-full shadow-[-8px_0_40px_rgba(0,0,0,0.15)]'
            }`}
          >
            <div className="sticky top-0 bg-background z-10 py-3 px-6 flex items-center justify-end border-b border-outline-variant/10">
              {isMobile && !fullscreen && (
                <div className="w-10 h-1 bg-outline-variant/40 rounded-full absolute left-1/2 -translate-x-1/2 top-2" />
              )}
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="ml-auto p-2 rounded-full hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-on-surface-variant">
                  {fullscreen ? 'close_fullscreen' : 'open_in_full'}
                </span>
              </button>
              <button
                onClick={closeDetail}
                className="p-2 rounded-full hover:bg-surface-container transition-colors cursor-pointer ml-1"
              >
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            <div className="px-6 pt-6 pb-8">
              <div className="flex items-start gap-5 mb-8">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center shrink-0 ${
                  openStepStatus === 'completed' ? 'bg-secondary-container shadow-[0_4px_0_0_#00635d]' : 'bg-primary-container shadow-[0_4px_0_0_#9d4f00]'
                }`}>
                  <span className={`material-symbols-outlined text-3xl ${
                    openStepStatus === 'completed' ? 'text-on-secondary-container' : 'text-on-primary-container'
                  }`}>
                    {openStepIcon}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                    Step {openStep! + 1} &bull; {openStepData.category}
                  </span>
                  <h2 className="font-headline font-extrabold text-2xl text-on-surface tracking-tight mt-1">
                    {openStepData.title}
                  </h2>
                  {openStepData.time && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="material-symbols-outlined text-sm text-on-surface-variant">schedule</span>
                      <span className="text-sm font-medium text-on-surface-variant">{openStepData.time}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {openStepData.what && (
                  <div>
                    <h3 className="font-headline font-bold text-lg text-on-surface mb-3">What is this</h3>
                    <div className="bg-primary-container/10 p-5 rounded-lg">
                      <p className="text-on-surface leading-relaxed">{openStepData.what}</p>
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="font-headline font-bold text-lg text-on-surface mb-3">How to do this</h3>
                  <div className="bg-surface-container-low p-5 rounded-lg">
                    <p className="text-on-surface leading-relaxed">{openStepData.detail}</p>
                  </div>
                </div>

                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                  openStepStatus === 'completed'
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'bg-primary-container/30 text-primary'
                }`}>
                  <span className="material-symbols-outlined text-sm">
                    {openStepStatus === 'completed' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  {openStepStatus === 'completed' ? 'Completed' : 'In Progress'}
                </div>
              </div>

              <div className="mt-8 space-y-3">
                {openStepStatus === 'current' && (
                  <button
                    onClick={handleComplete}
                    className="w-full py-4 bg-secondary text-on-secondary font-headline font-black text-lg rounded-lg shadow-[0_4px_0_0_#00635d] active:translate-y-1 active:shadow-[0_1px_0_0_#00635d] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">check</span>
                    Mark as Complete
                  </button>
                )}
                {openStepStatus === 'completed' && (
                  <button
                    onClick={() => { handleUndo(openStep!); closeDetail() }}
                    className="w-full py-4 bg-surface-container-high text-error font-headline font-bold text-lg rounded-lg shadow-[0_4px_0_0_#bcb9b3] active:translate-y-1 active:shadow-[0_1px_0_0_#bcb9b3] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">undo</span>
                    Mark as Incomplete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Canvas Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100]"
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/felt.png')" }}
      />
    </>
  )
}

/* ── Step Node ── */

interface StepNodeProps {
  step: FlatStep
  index: number
  status: StepStatus
  icon: string
  offset: string
  onCardClick: () => void
  onUndo: () => void
}

function StepNode({ step, status, icon, offset, onCardClick, onUndo }: StepNodeProps) {

  if (status === 'completed') {
    return (
      <div className={`relative z-10 w-full flex justify-center mb-28 ${offset}`}>
        <div className="relative overflow-visible p-3 -m-3">
          <button
            onClick={onCardClick}
            className="w-24 h-24 bg-secondary-container rounded-lg flex items-center justify-center shadow-[0_6px_0_0_#00635d] border-4 border-white cursor-pointer hover:scale-105 active:translate-y-1 active:shadow-[0_2px_0_0_#00635d] transition-all duration-200"
          >
            <span className="material-symbols-outlined text-on-secondary-container text-4xl">{icon}</span>
          </button>
          <button
            onClick={onUndo}
            className="absolute top-0 right-0 w-10 h-10 bg-error rounded-full flex items-center justify-center border-4 border-white text-white cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-200"
          >
            <span className="material-symbols-outlined text-xl">undo</span>
          </button>
          <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 text-center">
            <p className="text-sm font-bold text-on-surface-variant">{step.title}</p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'current') {
    return (
      <div className={`relative z-10 w-full flex justify-center mb-32 ${offset}`}>
        <div className="relative">
          <button
            onClick={onCardClick}
            className="w-32 h-32 bg-primary-container rounded-lg flex flex-col items-center justify-center border-4 border-white cursor-pointer hover:scale-105 active:translate-y-2 active:shadow-none transition-all duration-200 roadmap-current"
          >
            <span className="material-symbols-outlined text-on-primary-container text-5xl mb-1">{icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-on-primary-container">Current</span>
          </button>
          <div className="absolute top-full mt-6 left-1/2 -translate-x-1/2 w-56 text-center">
            <p className="text-lg font-black text-primary leading-tight">{step.title}</p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'upcoming') {
    return (
      <div className={`relative z-10 w-full flex justify-center mb-24 ${offset} opacity-60`}>
        <div className="relative">
          <div className="w-24 h-24 bg-surface-container-highest rounded-lg flex items-center justify-center shadow-[0_6px_0_0_#bcb9b3] border-4 border-white">
            <span className="material-symbols-outlined text-outline text-4xl">{icon}</span>
          </div>
          <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 text-center">
            <p className="text-sm font-bold text-outline">{step.title}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative z-10 w-full flex justify-center mb-20 ${offset} opacity-40`}>
      <div className="relative">
        <div className="w-24 h-24 bg-surface-container-highest rounded-lg flex items-center justify-center shadow-[0_6px_0_0_#bcb9b3] border-4 border-white">
          <span className="material-symbols-outlined text-outline text-4xl">{icon}</span>
        </div>
        <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 text-center">
          <p className="text-sm font-bold text-outline">{step.title}</p>
        </div>
      </div>
    </div>
  )
}
