import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  login: () => void
}

const AuthContext = createContext<AuthContextType>({ isLoggedIn: false, login: () => {} })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  return (
    <AuthContext.Provider value={{ isLoggedIn, login: () => setIsLoggedIn(true) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
