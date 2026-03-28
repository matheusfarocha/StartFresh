import { useApp } from '../context/AppContext'
import type { RoadmapSection } from '../data/roadmapEngine'

type StepStatus = 'completed' | 'current' | 'upcoming' | 'locked'

// Maps section keys from the engine to Material Symbol icon names
const sectionIcons: Record<string, string> = {
  id:           'badge',
  housing:      'house',
  food:         'restaurant',
  employment:   'work',
  mentalHealth: 'psychology',
  family:       'family_restroom',
  education:    'school',
  community:    'groups',
}

const stepOffsets = [
  '-translate-x-12',
  'translate-x-12',
  '-translate-x-8',
  'translate-x-6',
  '-translate-x-12',
  'translate-x-10',
  '-translate-x-6',
  'translate-x-12',
]

interface FlatStep {
  id: string
  title: string
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
        category: section.label,
        sectionKey: section.key,
        detail: step.detail,
        time: step.time,
      })
    }
  }
  return flat
}

export default function Roadmap() {
  const { roadmap, currentStep, setCurrentStep } = useApp()

  const allSteps: FlatStep[] = roadmap ? flattenSections(roadmap.sections) : []
  const totalSteps = allSteps.length
  const progressPercent = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0
  const currentStepData = allSteps[currentStep]

  const getStatus = (index: number): StepStatus => {
    if (index < currentStep) return 'completed'
    if (index === currentStep) return 'current'
    if (index === currentStep + 1) return 'upcoming'
    return 'locked'
  }

  const handleStepClick = (index: number) => {
    if (getStatus(index) === 'current') {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
    }
  }

  if (!roadmap || allSteps.length === 0) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-on-surface-variant font-headline text-lg">No roadmap yet — complete the questions first.</p>
      </main>
    )
  }

  return (
    <>
      <main className="pt-4 pb-32 min-h-screen px-6 max-w-2xl mx-auto overflow-hidden relative">
        {/* Progress Overview */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold font-headline tracking-tighter text-on-surface mb-2">My Journey</h1>
          <p className="text-on-surface-variant font-medium">
            Step {currentStep + 1} of {totalSteps} &bull; {currentStepData?.category}
          </p>
          <div className="mt-6 w-full h-4 bg-surface-container-highest rounded-full overflow-hidden relative">
            <div
              className="h-full bg-secondary rounded-full relative transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
            </div>
          </div>
        </section>

        {/* Winding Path UI */}
        <div className="relative flex flex-col items-center py-10">
          {/* SVG Curved Path Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none opacity-20">
            <svg className="w-full h-full fill-none stroke-outline-variant stroke-[12]" style={{ strokeDasharray: 12 }} viewBox="0 0 200 800">
              <path d="M100,0 C150,100 50,200 100,300 C150,400 50,500 100,600 C150,700 50,800 100,900" />
            </svg>
          </div>

          {allSteps.map((step, index) => {
            const status = getStatus(index)
            const icon = sectionIcons[step.sectionKey] || 'task_alt'
            const offset = stepOffsets[index % stepOffsets.length]

            // Mascot bubble after first completed step
            if (index === 1 && currentStep >= 1) {
              return (
                <div key={`group-${step.id}`}>
                  <div className="relative w-full flex justify-end px-4 mb-16 translate-x-4">
                    <div className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-lg shadow-[0_4px_0_0_#bcb9b3] max-w-[240px]">
                      <div className="shrink-0 w-12 h-12 bg-[#fdc003] rounded-full flex items-center justify-center overflow-hidden">
                        <img alt="FreshStart mascot" src="/images/mascot-sparky.png" className="w-10 h-10 object-contain" />
                      </div>
                      <p className="text-xs font-bold leading-tight text-on-surface">You've got this! One step at a time.</p>
                    </div>
                  </div>

                  <StepNode
                    step={step}
                    index={index}
                    status={status}
                    icon={icon}
                    offset={offset}
                    onClick={() => handleStepClick(index)}
                  />
                </div>
              )
            }

            return (
              <StepNode
                key={step.id}
                step={step}
                index={index}
                status={status}
                icon={icon}
                offset={offset}
                onClick={() => handleStepClick(index)}
              />
            )
          })}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-40">
        <button
          onClick={() => setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))}
          className="w-full py-5 bg-primary-container text-on-primary-container font-black text-xl rounded-lg shadow-[0_6px_0_0_#9d4f00] active:translate-y-1 active:shadow-[0_2px_0_0_#9d4f00] transition-all flex items-center justify-center gap-3 cursor-pointer font-headline"
        >
          <span>Continue Step {currentStep + 1}</span>
          <span className="material-symbols-outlined font-bold">arrow_forward</span>
        </button>
      </div>

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-background border-t-4 border-outline-variant">
        <a href="#" className="flex flex-col items-center justify-center bg-[#F28C38] text-white rounded-lg px-6 py-2 shadow-[0_4px_0_0_#9D4F00] active:translate-y-1 transition-all duration-100">
          <span className="material-symbols-outlined">map</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1 font-headline">Journey</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-on-surface px-6 py-2 hover:text-[#F28C38] transition-all active:translate-y-1 duration-100">
          <span className="material-symbols-outlined">menu_book</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1 font-headline">Resources</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-on-surface px-6 py-2 hover:text-[#F28C38] transition-all active:translate-y-1 duration-100">
          <span className="material-symbols-outlined">face</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1 font-headline">Mascot</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-on-surface px-6 py-2 hover:text-[#F28C38] transition-all active:translate-y-1 duration-100">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1 font-headline">Profile</span>
        </a>
      </nav>

      {/* Canvas Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100]"
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/felt.png')" }}
      />
    </>
  )
}

/* ── Step Node Component ── */

interface StepNodeProps {
  step: FlatStep
  index: number
  status: StepStatus
  icon: string
  offset: string
  onClick: () => void
}

function StepNode({ step, status, icon, offset, onClick }: StepNodeProps) {
  if (status === 'completed') {
    return (
      <div className={`relative w-full flex justify-center mb-20 ${offset}`}>
        <div className="relative group">
          <div className="w-24 h-24 bg-secondary-container rounded-lg flex items-center justify-center shadow-[0_6px_0_0_#00635d] border-4 border-white">
            <span className="material-symbols-outlined text-on-secondary-container text-4xl">{icon}</span>
          </div>
          <div className="absolute -top-3 -right-3 w-10 h-10 bg-secondary rounded-full flex items-center justify-center border-4 border-white text-white">
            <span className="material-symbols-outlined text-xl">check</span>
          </div>
          <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 text-center">
            <p className="text-sm font-bold text-on-surface-variant">{step.title}</p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'current') {
    return (
      <div className={`relative w-full flex justify-center mb-24 ${offset}`}>
        <div className="relative">
          <button
            onClick={onClick}
            className="w-32 h-32 bg-primary-container rounded-lg flex flex-col items-center justify-center shadow-[0_8px_0_0_#9d4f00] border-4 border-white active:translate-y-2 active:shadow-none transition-all cursor-pointer"
            style={{ boxShadow: '0 8px 0 0 #9d4f00, 0 0 20px rgba(242, 140, 56, 0.4)' }}
          >
            <span className="material-symbols-outlined text-on-primary-container text-5xl mb-1">{icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-on-primary-container">Current</span>
          </button>
          <div className="absolute top-full mt-6 left-1/2 -translate-x-1/2 w-56 text-center">
            <p className="text-lg font-black text-primary leading-tight">{step.title}</p>
            <span className="inline-block mt-2 px-4 py-1 bg-[#fdc003] text-[#3d2b00] rounded-full text-[10px] font-black tracking-widest uppercase">
              Start Task
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'upcoming') {
    return (
      <div className={`relative w-full flex justify-center mb-24 ${offset} opacity-60`}>
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

  // locked
  return (
    <div className={`relative w-full flex justify-center mb-12 ${offset} opacity-40`}>
      <div className="relative">
        <div className="w-24 h-24 bg-surface-container-highest rounded-lg flex items-center justify-center shadow-[0_6px_0_0_#bcb9b3] border-4 border-white">
          <span className="material-symbols-outlined text-outline text-4xl">{icon}</span>
        </div>
        <div className="absolute -top-3 -right-3 w-10 h-10 bg-outline rounded-full flex items-center justify-center border-4 border-white text-white">
          <span className="material-symbols-outlined text-xl">lock</span>
        </div>
        <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 text-center">
          <p className="text-sm font-bold text-outline">{step.title}</p>
        </div>
      </div>
    </div>
  )
}
