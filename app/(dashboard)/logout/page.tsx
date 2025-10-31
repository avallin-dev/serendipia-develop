'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'

import api from '@/lib/api-client'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    async function doLogout() {
      try {
        await api.get('/auth/logout')
        localStorage.removeItem('user')
      } catch (error) {
        console.error(error)
      } finally {
        router.replace('/login-partner')
      }
    }
    doLogout()
  }, [router])

  return (
    <div className="absolute flex size-full flex-col items-center justify-center gap-y-4">
      <AiOutlineLoading className="animate-spin text-secondary" size={100} />
      <p className="text-lg font-medium text-secondary">Cerrando sesión...</p>
    </div>
  )
}
