'use client'

import { $Enums } from '@prisma/client'
import { useState } from 'react'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { BorgScale } from '@/app/components/ui/borg-scale'
import { Textarea } from '@/app/components/ui/textarea'
import { useCreatePlanFeedback } from '@/app/services/mutations/plan'

type ModalFeedbackProps = {
  onClose: () => void
  open: boolean
  planId: number
}

export default function ModalFeedback({ onClose, open, planId }: ModalFeedbackProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [borgValue, setBorgValue] = useState<$Enums.borg>()
  const [comment, setComment] = useState('')
  const createFeedbackMutation = useCreatePlanFeedback()

  function handleSubmit() {
    if (step === 1) {
      if (!borgValue) return
      setStep(2)
      return
    }

    if (!borgValue) return

    createFeedbackMutation.mutate(
      {
        planId,
        borg: borgValue,
        comentario: comment,
      },
      {
        onSuccess() {
          toast.success('Feedback enviado exitosamente')
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
      <Textarea
        placeholder="Escribe tus comentarios sobre el plan..."
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
      title={step === 1 ? '¿Qué tan intenso fue el entrenamiento?' : 'Comentarios adicionales'}
      body={step === 1 ? borgContent : commentContent}
      onSubmit={handleSubmit}
      actionLabel={step === 1 ? 'Siguiente' : 'Enviar'}
      disabled={
        step === 1
          ? !borgValue || createFeedbackMutation.isPending
          : createFeedbackMutation.isPending
      }
      isLoading={createFeedbackMutation.isPending}
    />
  )
}
