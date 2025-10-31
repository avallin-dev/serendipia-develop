'use client'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useCloseActivityByPartner } from '@/app/services/mutations/monitor'
import { useMonitorByPartner } from '@/app/services/queries/monitor'
import { Button } from '@/components/ui/button'

export function FinishDayButton({ idSocio }: { idSocio: number | null }) {
  const closeActivityMutation = useCloseActivityByPartner()
  const { data } = useMonitorByPartner(idSocio!)
  const queryClient = useQueryClient()

  async function handleOnClick() {
    if (data && data?.horaFinalizacion === null)
      closeActivityMutation.mutate(idSocio!, {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['monitor', idSocio],
          })
          toast.info('Entrenamiento Finalizado')
        },
        onError(error) {
          console.error(error)
          toast.error('Error al desmarcar el día. Intenta más tarde')
        },
      })
  }

  if (!data) return null

  // const fechaCreacion = data?.fechaCreacion ? new Date(data.fechaCreacion) : null
  // const now = new Date()
  // const showButton = fechaCreacion && now.getTime() - fechaCreacion.getTime() > 60 * 60 * 1000

  return (
    <div className="flex gap-2">
      {true && (
        <Button
          className={`h-14 flex-wrap whitespace-normal text-nowrap rounded-sm py-0 text-xs uppercase md:h-10 ${
            data?.horaFinalizacion !== null
              ? 'pointer-events-none bg-primary-dark text-white hover:bg-primary-dark'
              : ''
          }`}
          onClick={handleOnClick}
        >
          {data?.horaFinalizacion !== null ? 'Día Completado' : 'Finalizar Entrenamiento'}
        </Button>
      )}
      {data?.horaFinalizacion !== null ? (
        <p
          className="flex h-14 flex-col items-center justify-center rounded-sm border-2 border-black bg-red-500 px-3 py-0 text-center text-xs text-white md:h-10">
          <span className="uppercase">¡Excelente entrenamiento!</span>
          <span>Recorda alimentarte y descansar bien</span>
        </p>
      ) : null}
    </div>
  )
}
