import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import type { GeneratedRoadmap } from '../data/roadmapEngine'

interface CustomStep {
  id: number
  title: string
  detail: string
  icon: string
}

const ICON_OPTIONS = [
  { value: 'badge', label: 'ID' },
  { value: 'house', label: 'Housing' },
  { value: 'restaurant', label: 'Food' },
  { value: 'work', label: 'Work' },
  { value: 'psychology', label: 'Mental Health' },
  { value: 'school', label: 'Education' },
  { value: 'family_restroom', label: 'Family' },
  { value: 'groups', label: 'Community' },
  { value: 'gavel', label: 'Legal' },
  { value: 'local_hospital', label: 'Health' },
  { value: 'account_balance', label: 'Finance' },
  { value: 'directions_bus', label: 'Transport' },
]

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

let nextId = 1

export default function CustomRoadmap() {
  const navigate = useNavigate()
  const { setRoadmap } = useApp()
  const [steps, setSteps] = useState<CustomStep[]>([])
  const [editingStep, setEditingStep] = useState<number | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')
  const [draftDetail, setDraftDetail] = useState('')
  const [draftIcon, setDraftIcon] = useState('badge')
  const [showConfirm, setShowConfirm] = useState(false)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const addStep = () => {
    const newStep: CustomStep = { id: nextId++, title: '', detail: '', icon: 'badge' }
    setSteps([...steps, newStep])
    setDraftTitle('')
    setDraftDetail('')
    setDraftIcon('badge')
    setEditingStep(steps.length)
    setFullscreen(false)
  }

  const openEdit = (index: number) => {
    const step = steps[index]
    setDraftTitle(step.title)
    setDraftDetail(step.detail)
    setDraftIcon(step.icon)
    setEditingStep(index)
    setFullscreen(false)
  }

  const saveStep = () => {
    if (editingStep === null) return
    setSteps(prev => prev.map((s, i) =>
      i === editingStep ? { ...s, title: draftTitle, detail: draftDetail, icon: draftIcon } : s
    ))
    setEditingStep(null)
  }

  const deleteStep = () => {
    if (editingStep === null) return
    setSteps(prev => prev.filter((_, i) => i !== editingStep))
    setEditingStep(null)
  }

  const closePanel = () => {
    setEditingStep(null)
    setFullscreen(false)
  }

  const progressPercent = steps.length > 0 ? Math.round((steps.filter(s => s.title).length / Math.max(steps.length, 1)) * 100) : 0

  const handleConfirm = () => {
    // Build a GeneratedRoadmap from the custom steps
    const iconToCategory: Record<string, string> = {
      badge: 'ID & Documents', house: 'Housing', restaurant: 'Food & Benefits',
      work: 'Employment', psychology: 'Mental Health', school: 'Education',
      family_restroom: 'Family', groups: 'Community', gavel: 'Legal',
      local_hospital: 'Health', account_balance: 'Finance', directions_bus: 'Transport',
    }

    const roadmap: GeneratedRoadmap = {
      sections: [{
        key: 'custom',
        label: 'Custom Plan',
        icon: 'edit_note',
        color: '#9d4f00',
        score: 100,
        isAuto: false,
        steps: steps.map((s, i) => ({
          id: `custom-${i + 1}`,
          text: s.title,
          detail: s.detail || 'No additional instructions provided.',
          time: '',
        })),
      }],
      borough: 'N/A',
      timeAway: 'N/A',
      generatedAt: new Date().toISOString(),
    }

    setRoadmap(roadmap)
    setShowConfirm(false)
    navigate('/roadmap')
  }

  return (
    <>
      <main className="pt-4 pb-32 min-h-screen px-6 max-w-2xl mx-auto relative">
        {/* Header */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold font-headline tracking-tighter text-on-surface mb-2">Custom Roadmap</h1>
          <p className="text-on-surface-variant font-medium">
            {steps.length === 0
              ? 'Add steps to build a personalized reentry plan'
              : `${steps.length} step${steps.length === 1 ? '' : 's'} added`}
          </p>
          <div className="mt-6 w-full h-4 bg-surface-container-highest rounded-full overflow-hidden relative">
            <div
              className="h-full bg-secondary rounded-full relative transition-all duration-700 ease-out"
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

          {/* Existing steps */}
          {steps.map((step, index) => {
            const offset = stepOffsets[index % stepOffsets.length]
            const hasContent = !!step.title
            const isFirst = index === 0

            return (
              <div key={step.id} className={`relative w-full flex justify-center ${isFirst ? 'mb-24' : 'mb-20'} ${offset}`}>
                <div className="relative">
                  <button
                    onClick={() => openEdit(index)}
                    className={`${
                      isFirst ? 'w-32 h-32' : 'w-24 h-24'
                    } rounded-lg flex flex-col items-center justify-center border-4 border-white cursor-pointer hover:scale-105 transition-all duration-200 ${
                      hasContent
                        ? 'bg-primary-container shadow-[0_6px_0_0_#9d4f00]'
                        : 'bg-surface-container-highest border-dashed shadow-[0_6px_0_0_#bcb9b3] hover:border-primary-container'
                    } ${isFirst && hasContent ? 'shadow-[0_8px_0_0_#9d4f00] roadmap-current' : ''}`}
                  >
                    <span className={`material-symbols-outlined ${isFirst ? 'text-5xl' : 'text-4xl'} ${
                      hasContent ? 'text-on-primary-container' : 'text-outline-variant'
                    }`}>
                      {hasContent ? step.icon : 'edit'}
                    </span>
                    {isFirst && (
                      <span className={`text-[10px] font-black uppercase tracking-widest mt-1 ${
                        hasContent ? 'text-on-primary-container' : 'text-outline-variant'
                      }`}>
                        {hasContent ? 'Step 1' : 'Edit'}
                      </span>
                    )}
                  </button>
                  <div className={`absolute top-full ${isFirst ? 'mt-6' : 'mt-4'} left-1/2 -translate-x-1/2 w-48 text-center`}>
                    <p className={`${isFirst ? 'text-lg font-black' : 'text-sm font-bold'} ${
                      hasContent ? 'text-on-surface' : 'text-outline-variant'
                    }`}>
                      {step.title || `Step ${index + 1}`}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Add step node */}
          <div className={`relative w-full flex justify-center mb-20 ${stepOffsets[steps.length % stepOffsets.length]}`}>
            <button
              onClick={addStep}
              className="w-24 h-24 bg-surface-container-highest rounded-lg flex flex-col items-center justify-center border-4 border-dashed border-outline-variant/50 cursor-pointer hover:scale-105 hover:border-primary-container hover:bg-primary-container/10 transition-all duration-200 shadow-[0_6px_0_0_#bcb9b3]"
            >
              <span className="material-symbols-outlined text-outline-variant text-4xl">add</span>
            </button>
            <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 text-center">
              <p className="text-sm font-bold text-outline-variant">Add step</p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      {steps.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-40">
          <button
            onClick={() => setShowConfirm(true)}
            disabled={steps.some(s => !s.title)}
            className="w-full py-5 bg-secondary text-on-secondary font-black text-xl rounded-lg shadow-[0_6px_0_0_#00635d] active:translate-y-1 active:shadow-[0_2px_0_0_#00635d] transition-all flex items-center justify-center gap-3 cursor-pointer font-headline disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined font-bold">check</span>
            <span>Confirm Roadmap</span>
          </button>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center px-6" onClick={() => setShowConfirm(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-background rounded-xl p-8 max-w-sm w-full shadow-[0_8px_0_0_#bcb9b3]"
          >
            <div className="text-center mb-6">
              <span className="material-symbols-outlined text-error text-5xl mb-3">warning</span>
              <h3 className="font-headline font-extrabold text-xl text-on-surface mb-2">Confirm Roadmap?</h3>
              <p className="text-on-surface-variant leading-relaxed">
                This will create the roadmap with <strong>{steps.length} step{steps.length === 1 ? '' : 's'}</strong> and assign it to the user. This action cannot be undone.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleConfirm}
                className="w-full py-4 bg-secondary text-on-secondary font-headline font-black text-lg rounded-lg shadow-[0_4px_0_0_#00635d] active:translate-y-1 active:shadow-[0_1px_0_0_#00635d] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">check</span>
                Yes, Confirm
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-4 bg-surface-container-high text-on-surface font-headline font-bold text-lg rounded-lg shadow-[0_4px_0_0_#bcb9b3] active:translate-y-1 active:shadow-[0_1px_0_0_#bcb9b3] transition-all cursor-pointer"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Panel */}
      {editingStep !== null && (
        <div className={`fixed inset-0 z-[200] flex ${isMobile ? 'items-end justify-center' : 'justify-end'}`} onClick={closePanel}>
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
            {/* Top bar */}
            <div className="sticky top-0 bg-background z-10 py-3 px-6 flex items-center justify-end border-b border-outline-variant/10">
              {isMobile && !fullscreen && (
                <div className="w-10 h-1 bg-outline-variant/40 rounded-full absolute left-1/2 -translate-x-1/2 top-2" />
              )}
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="p-2 rounded-full hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-on-surface-variant">
                  {fullscreen ? 'close_fullscreen' : 'open_in_full'}
                </span>
              </button>
              <button
                onClick={closePanel}
                className="p-2 rounded-full hover:bg-surface-container transition-colors cursor-pointer ml-1"
              >
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pt-6 pb-8">
              <h2 className="font-headline font-extrabold text-2xl text-on-surface tracking-tight mb-6">
                {steps[editingStep]?.title ? 'Edit Step' : 'New Step'}
              </h2>

              <div className="space-y-6">
                {/* Icon picker */}
                <div>
                  <label className="block font-label font-bold text-sm text-on-surface mb-3 uppercase tracking-wider">
                    Category
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {ICON_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setDraftIcon(opt.value)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          draftIcon === opt.value
                            ? 'bg-primary-container/20 ring-2 ring-primary'
                            : 'bg-surface-container-highest hover:bg-primary-container/10'
                        }`}
                      >
                        <span className="material-symbols-outlined text-2xl text-on-surface">{opt.value}</span>
                        <span className="text-[10px] font-bold text-on-surface-variant">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block font-label font-bold text-sm text-on-surface mb-2 uppercase tracking-wider">
                    Step Title
                  </label>
                  <div className="flex items-center gap-3 bg-surface-container-highest rounded-lg px-4 py-4 focus-within:ring-3 focus-within:ring-primary-fixed transition-all">
                    <input
                      type="text"
                      placeholder="e.g. Get your birth certificate"
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      className="bg-transparent outline-none w-full text-on-surface placeholder:text-outline-variant font-body"
                    />
                  </div>
                </div>

                {/* Detail / Instructions */}
                <div>
                  <label className="block font-label font-bold text-sm text-on-surface mb-2 uppercase tracking-wider">
                    Instructions
                  </label>
                  <div className="bg-surface-container-highest rounded-lg px-4 py-4 focus-within:ring-3 focus-within:ring-primary-fixed transition-all">
                    <textarea
                      placeholder="Where to go, what to bring, hours, phone numbers..."
                      value={draftDetail}
                      onChange={(e) => setDraftDetail(e.target.value)}
                      rows={4}
                      className="bg-transparent outline-none w-full text-on-surface placeholder:text-outline-variant font-body resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 space-y-3">
                <button
                  onClick={saveStep}
                  disabled={!draftTitle.trim()}
                  className="w-full py-4 bg-primary-container text-on-primary-container font-headline font-black text-lg rounded-lg shadow-[0_4px_0_0_#9d4f00] active:translate-y-1 active:shadow-[0_1px_0_0_#9d4f00] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">check</span>
                  Save Step
                </button>
                <button
                  onClick={deleteStep}
                  className="w-full py-4 bg-surface-container-high text-error font-headline font-bold text-lg rounded-lg shadow-[0_4px_0_0_#bcb9b3] active:translate-y-1 active:shadow-[0_1px_0_0_#bcb9b3] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">delete</span>
                  Delete Step
                </button>
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
