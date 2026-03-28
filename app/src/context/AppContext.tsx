import { createContext, useContext, useState } from 'react'
import type { ReactNode, Dispatch, SetStateAction } from 'react'
import type { GeneratedRoadmap } from '../data/roadmapEngine'

interface AppContextType {
  answers: Record<string, string | string[]>
  setAnswer: (questionId: string, value: string | string[]) => void
  roadmap: GeneratedRoadmap | null
  setRoadmap: (r: GeneratedRoadmap) => void
  currentStep: number
  setCurrentStep: Dispatch<SetStateAction<number>>
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [roadmap, setRoadmap] = useState<GeneratedRoadmap | null>(null)
  const [currentStep, setCurrentStep] = useState(0)

  function setAnswer(questionId: string, value: string | string[]) {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  return (
    <AppContext.Provider value={{ answers, setAnswer, roadmap, setRoadmap, currentStep, setCurrentStep }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
