'use client'

import { useState, createContext, ReactNode, useEffect } from 'react'

interface WeekContextType {
  week: number
  setWeek: (week: number) => void
  currentDay: number
  setCurrentDay: (week: number) => void
}

const weekContextDefaultValues: WeekContextType = {
  week: 1,
  setWeek: () => {},
  currentDay: 1,
  setCurrentDay: () => {},
}

export const WeekContext = createContext(weekContextDefaultValues)

type PlanType =
  | {
      idPlan: number
      NombrePlan: string
      idUsuario: number | null
      fechaCreacion: Date | null
      idSocio: number | null
      idLink: number | null
      dias: number | null
      semanas: number | null
      diaactual: number | null
      semanaactual: number | null
      fechamod: Date | null
    }
  | null
  | undefined
export function WeekProvider({ children, plan }: { children?: ReactNode; plan: PlanType }) {
  const [week, setWeek] = useState<number>(1)
  const [currentDay, setCurrentDay] = useState<number>(1)

  useEffect(() => {
    if (plan?.semanaactual) {
      if (plan.diaactual === plan.dias) {
        setWeek(plan.semanaactual + 1)
      } else {
        setWeek(plan.semanaactual)
      }
    }
  }, [plan])

  return (
    <WeekContext.Provider value={{ week, setWeek, currentDay, setCurrentDay }}>
      {children}
    </WeekContext.Provider>
  )
}
