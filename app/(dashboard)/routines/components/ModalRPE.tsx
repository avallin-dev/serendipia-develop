'use client'

import { $Enums } from '@prisma/client'
import { useState } from 'react'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { BorgScale } from '@/app/components/ui/borg-scale'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { useUpdateRoutineFeedback } from '@/app/services/mutations/routine'

type ModalRPEProps = {
  onClose: () => void
  open: boolean
  routineDetalleId: number
}

export default function ModalRPE({ onClose, open, routineDetalleId }: ModalRPEProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [borgValue, setBorgValue] = useState<$Enums.borg>()
  const [comment, setComment] = useState('')
  const updateFeedbackMutation = useUpdateRoutineFeedback()

  const resetFields = () => {
    setBorgValue(undefined)
    setComment('')
    setStep(1)
  }

  function handleSubmit() {
    if (step === 1) {
      if (!borgValue) return
      setStep(2)
      return
    }

    if (!borgValue) return

    updateFeedbackMutation.mutate(
      {
        routineDetalleId,
        rpe: borgValue,
        comentario: comment,
      },
      {
        onSuccess() {
          toast.success('Feedback enviado exitosamente')
          resetFields()
          onClose()
        },
        onError(error) {
          console.error(error)
          toast.error('Error inesperado. Intente más tarde')
        },
      }
    )
  }

  const borgContent = (
    <div className="space-y-4">
      <BorgScale value={borgValue} onChange={setBorgValue} />
    </div>
  )

  const commentContent = (
    <div className="space-y-4">
      <Label>Comentario</Label>
      <Textarea
        placeholder="Escribe tus comentarios sobre la serie..."
        className="resize-none"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
    </div>
  )

  return (
    <ModalWrapper
      isOpen={open}
      onClose={onClose}
      title={step === 1 ? '¿Qué tan intensa fue la serie?' : 'Información adicional'}
      body={step === 1 ? borgContent : commentContent}
      onSubmit={handleSubmit}
      actionLabel={step === 1 ? 'Siguiente' : 'Enviar'}
      disabled={
        step === 1
          ? !borgValue || updateFeedbackMutation.isPending
          : updateFeedbackMutation.isPending
      }
      isLoading={updateFeedbackMutation.isPending}
    />
  )
}
