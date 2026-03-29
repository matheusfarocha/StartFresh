import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { GeneratedRoadmap } from '../data/roadmapEngine'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

interface Responses {
  borough?: string
  timeAway?: string
  urgentNeed?: string
  [key: string]: unknown
}

interface AppContextType {
  // Legacy field-based setters (used by question pages)
  borough: string | null
  setBorough: (b: string) => void
  timeAway: string | null
  setTimeAway: (t: string) => void
  needs: string[]
  setNeeds: (n: string[]) => void
  // Generic answers map (used by QuestionPage)
  answers: Record<string, string | string[]>
  setAnswer: (questionId: string, value: string | string[]) => void
  // Roadmap
  roadmap: GeneratedRoadmap | null
  setRoadmap: (r: GeneratedRoadmap) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  // Session
  responses: Responses
  hasSession: boolean
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn } = useAuth()
  const [borough, setBoroughLocal] = useState<string | null>(null)
  const [timeAway, setTimeAwayLocal] = useState<string | null>(null)
  const [needs, setNeedsLocal] = useState<string[]>([])
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [roadmap, setRoadmapLocal] = useState<GeneratedRoadmap | null>(null)
  const [currentStep, setCurrentStepLocal] = useState(0)
  const [responses, setResponses] = useState<Responses>({})
  const [hasSession, setHasSession] = useState(false)

  // Load session on login
  useEffect(() => {
    if (!isLoggedIn || !user) {
      setHasSession(false)
      setResponses({})
      setBoroughLocal(null)
      setTimeAwayLocal(null)
      setNeedsLocal([])
      setAnswers({})
      setRoadmapLocal(null)
      setCurrentStepLocal(0)
      return
    }

    (async () => {
      const { data } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setHasSession(true)
        const r = (data.responses ?? {}) as Responses
        setResponses(r)
        setBoroughLocal(r.borough ?? null)
        setTimeAwayLocal(r.timeAway ?? null)
        setNeedsLocal(r.urgentNeed ? [r.urgentNeed] : [])
        // Restore answers map from responses
        const restored: Record<string, string | string[]> = {}
        for (const [k, v] of Object.entries(r)) {
          if (typeof v === 'string' || Array.isArray(v)) restored[k] = v
        }
        setAnswers(restored)
        if (data.roadmap) {
          const rm = data.roadmap as GeneratedRoadmap & { currentStep?: number }
          setRoadmapLocal(rm)
          setCurrentStepLocal(rm.currentStep ?? 0)
        }
      }
    })()
  }, [isLoggedIn, user])

  const save = useCallback(async (fields: Record<string, unknown>) => {
    if (!user) return
    if (hasSession) {
      await supabase
        .from('user_sessions')
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
    } else {
      await supabase
        .from('user_sessions')
        .insert({ user_id: user.id, ...fields })
      setHasSession(true)
    }
  }, [user, hasSession])

  const setBorough = (b: string) => {
    setBoroughLocal(b)
    const updated = { ...responses, borough: b }
    setResponses(updated)
    setAnswers(prev => ({ ...prev, borough: b }))
    save({ responses: updated })
  }

  const setTimeAway = (t: string) => {
    setTimeAwayLocal(t)
    const updated = { ...responses, timeAway: t }
    setResponses(updated)
    setAnswers(prev => ({ ...prev, timeAway: t }))
    save({ responses: updated })
  }

  const setNeeds = (n: string[]) => {
    setNeedsLocal(n)
    const updated = { ...responses, urgentNeed: n[0] }
    setResponses(updated)
    setAnswers(prev => ({ ...prev, urgentNeed: n[0] }))
    save({ responses: updated })
  }

  const setAnswer = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    const updated = { ...responses, [questionId]: value }
    setResponses(updated)
    save({ responses: updated })
  }

  const setRoadmap = (r: GeneratedRoadmap) => {
    setRoadmapLocal(r)
    save({ roadmap: { ...r, currentStep: 0 } })
  }

  const setCurrentStep = (step: number) => {
    setCurrentStepLocal(step)
    if (roadmap) {
      save({ roadmap: { ...roadmap, currentStep: step } })
    }
  }

  return (
    <AppContext.Provider
      value={{
        borough, setBorough,
        timeAway, setTimeAway,
        needs, setNeeds,
        answers, setAnswer,
        roadmap, setRoadmap,
        currentStep, setCurrentStep,
        responses,
        hasSession,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}

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
