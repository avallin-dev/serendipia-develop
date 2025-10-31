import { $Enums } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { useUpdatePlanState } from '@/app/services/mutations/plan'
import { cn } from '@/lib/utils'

const stateOptions = {
  actualizar: 'Actualizar',
  en_proceso: 'En Proceso',
  ok: 'Ok',
}

const SelectStatePlan = ({ defaultState, idPlan }) => {
  const updatePlanCommentMutation = useUpdatePlanState()
  const queryClient = useQueryClient()

  const handleChange = (value: $Enums.state_of_training) => {
    updatePlanCommentMutation.mutate(
      { state: value || '', id: idPlan! },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['seguimiento_planes'],
          })
          toast.success('Estado actualizado exitosamente')
        },
        onError(error) {
          console.error(error)
          toast.error('Error inesperado. Intente mas tarde')
        },
      }
    )
  }

  return (
    <Select value={defaultState} onValueChange={handleChange}>
      <SelectTrigger
        className={cn(
          'max-w-40 rounded-full bg-orange-200 data-[disabled]:opacity-100',
          defaultState === 'actualizar' && 'bg-red-300',
          defaultState === 'en_proceso' && 'bg-yellow-200',
          defaultState === 'ok' && 'bg-green-300'
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(stateOptions).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SelectStatePlan
