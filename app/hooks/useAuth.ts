import { useContext } from 'react'

import { AuthContext } from '@/app/context/AuthProvider'

export const useAuth = () => {
  return useContext(AuthContext)
}
