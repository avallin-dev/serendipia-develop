'use client'

import type { socio } from '@prisma/client'
import { useState, useEffect, useCallback, createContext, ReactNode } from 'react'

interface AuthContextType {
  user: socio | null
}

const authContextDefaultValues: AuthContextType = {
  user: null,
}

export const AuthContext = createContext(authContextDefaultValues)

export function AuthProvider({ children }: { children?: ReactNode }) {
  const [user, setUser] = useState<socio | null>(null)

  const verifyCookies = useCallback(async () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    verifyCookies()
  }, [verifyCookies])

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}
