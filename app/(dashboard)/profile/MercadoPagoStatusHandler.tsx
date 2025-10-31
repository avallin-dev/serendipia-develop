'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useUpdateMercadoPagoPaymentStatusQuery } from '@/app/services/queries/membership'
import { useValidateMercadoPagoSubscriptionQuery } from '@/app/services/queries/membership'

export default function MercadoPagoStatusHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const payment_id = searchParams.get('payment_id') || undefined
  const preference_id = searchParams.get('preference_id') || undefined
  const preapproval_id = searchParams.get('preapproval_id') || undefined
  const subscription_status = searchParams.get('status') || undefined

  const { data, isLoading, isSuccess } = useUpdateMercadoPagoPaymentStatusQuery({
    payment_id,
    preference_id,
  })

  const {
    data: subscriptionData,
    isLoading: isLoadingSubscription,
    isSuccess: isSuccessSubscription,
  } = useValidateMercadoPagoSubscriptionQuery({
    preapproval_id,
    status: subscription_status,
  })

  const [showModal, setShowModal] = useState((!!payment_id && !!preference_id) || !!preapproval_id)

  useEffect(() => {
    if ((isSuccess || isSuccessSubscription) && showModal) {
      const timeout = setTimeout(() => {
        router.replace(window.location.pathname)
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [isSuccess, isSuccessSubscription, showModal, router])

  useEffect(() => {
    if (!payment_id && !preference_id && !preapproval_id) setShowModal(false)
  }, [payment_id, preference_id, preapproval_id])

  if (!showModal) return null

  if (preapproval_id) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="flex min-w-[300px] flex-col items-center rounded-lg bg-white p-8 shadow-lg">
          {isLoadingSubscription && (
            <>
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
              <p className="text-lg font-semibold">Verificando suscripción...</p>
            </>
          )}
          {isSuccessSubscription && subscriptionData?.active && (
            <>
              <div className="mb-2 text-green-500">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M9.5 16.5l-4-4 1.41-1.41L9.5 13.67l7.09-7.09L18 7l-8.5 8.5z"
                  />
                </svg>
              </div>
              <p className="mb-2 text-lg font-semibold">¡Suscripción activa!</p>
              <p className="text-sm text-gray-500">Redirigiendo...</p>
            </>
          )}
          {isSuccessSubscription && !subscriptionData?.active && (
            <>
              <div className="mb-2 text-red-500">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path stroke="currentColor" strokeWidth="2" d="M8 8l8 8M16 8l-8 8" />
                </svg>
              </div>
              <p className="mb-2 text-lg font-semibold">No se pudo activar la suscripción.</p>
              <p className="text-sm text-gray-500">Redirigiendo...</p>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="flex min-w-[300px] flex-col items-center rounded-lg bg-white p-8 shadow-lg">
        {isLoading && (
          <>
            <div className="mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            <p className="text-lg font-semibold">Verificando pago...</p>
          </>
        )}
        {isSuccess && data?.alreadyPaid && (
          <>
            <div className="mb-2 text-yellow-500">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                />
              </svg>
            </div>
            <p className="mb-2 text-lg font-semibold">Este pago ya fue procesado.</p>
            <p className="text-sm text-gray-500">Redirigiendo...</p>
          </>
        )}
        {isSuccess && !data?.alreadyPaid && (
          <>
            <div className="mb-2 text-green-500">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M9.5 16.5l-4-4 1.41-1.41L9.5 13.67l7.09-7.09L18 7l-8.5 8.5z"
                />
              </svg>
            </div>
            <p className="mb-2 text-lg font-semibold">¡Pago registrado con éxito!</p>
            <p className="text-sm text-gray-500">Redirigiendo...</p>
          </>
        )}
      </div>
    </div>
  )
}
