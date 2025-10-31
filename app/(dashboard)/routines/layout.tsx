'use client'

import { WeekProvider } from '@/app/context/WeekProvider'
import { useCurrentPlanState } from '@/app/services/queries/plan'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { plan } = useCurrentPlanState()
  return <WeekProvider plan={plan}>{children}</WeekProvider>
}
