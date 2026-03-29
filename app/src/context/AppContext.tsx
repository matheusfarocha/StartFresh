import { createContext, useContext, useState, ReactNode } from 'react'
import type { GeneratedRoadmap } from '../data/roadmapEngine'

interface AppState {
  borough: string | null
  timeAway: string | null
  needs: string[]
  roadmap: GeneratedRoadmap | null
  currentStep: number
  setBorough: (b: string) => void
  setTimeAway: (t: string) => void
  setNeeds: (n: string[]) => void
  setRoadmap: (r: GeneratedRoadmap) => void
  setCurrentStep: (s: number | ((prev: number) => number)) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [borough, setBorough] = useState<string | null>(null)
  const [timeAway, setTimeAway] = useState<string | null>(null)
  const [needs, setNeeds] = useState<string[]>([])
  const [roadmap, setRoadmap] = useState<GeneratedRoadmap | null>(null)
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <AppContext.Provider value={{
      borough, setBorough,
      timeAway, setTimeAway,
      needs, setNeeds,
      roadmap, setRoadmap,
      currentStep, setCurrentStep,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
