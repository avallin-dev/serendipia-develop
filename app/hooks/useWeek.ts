import { useContext } from 'react'

import { WeekContext } from '@/app/context/WeekProvider'

export const useWeek = () => {
  return useContext(WeekContext)
}
