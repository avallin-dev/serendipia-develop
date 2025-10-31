import { $Enums } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import { differenceInMinutes } from 'date-fns'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/app/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog'
import { useAddFAPState } from '@/app/services/mutations/pilate'
import formatTrulyUTC from '@/app/utils/formatTrulyUTC'

interface SendFeedProps {
  event: {
    id: number
    idSocio: number | null
    createdAt: Date
    updatedAt: Date
    start: Date
    end: Date
    bed: number
    color: $Enums.pilates_color
    fap: $Enums.fap | null
  }
  onClose
  open
}

export function SendFeed({ event, onClose, open }: SendFeedProps) {
  const [isLoading, setIsLoading] = useState(false)
  const addStatePilateMutation = useAddFAPState()
  const queryClient = useQueryClient()

  function isValidBeforeEvent(): boolean {
    const now = new Date()
    const fortyMinutesBefore = differenceInMinutes(formatTrulyUTC(event.start), now)
    return fortyMinutesBefore >= 40
  }

  async function onFeed(value: 'yes' | 'no') {
    setIsLoading(true)
    const id = event.id
    let fap: 'F' | 'A'
    if (value === 'yes') {
      if (isValidBeforeEvent()) fap = 'F'
      else fap = 'A'
      addStatePilateMutation.mutate(
        { fap, id },
        {
          onSuccess({ message }) {
            queryClient.invalidateQueries({
              queryKey: ['pilate-partner'],
            })
            queryClient.invalidateQueries({
              queryKey: ['pilate-recover'],
            })
            toast.success(message)
            setIsLoading(false)
            onClose()
          },
          onError(error) {
            console.error(error)
            toast.error('Error inesperado. Intente mas tarde')
            setIsLoading(false)
          },
        }
      )
    }
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="scrollbar max-h-[calc(100%-20px)] overflow-y-auto sm:max-w-[750px]"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>¿Cancelas la clase?</DialogTitle>
          <DialogDescription>
            Recorda que tenes como límite 45 minutos previo a tu clase
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="secondary" disabled={isLoading} onClick={() => onFeed('no')}>
            No
          </Button>
          <Button
            variant="default"
            className="mb-4 sm:mb-0"
            disabled={isLoading}
            onClick={() => onFeed('yes')}
          >
            Si
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
