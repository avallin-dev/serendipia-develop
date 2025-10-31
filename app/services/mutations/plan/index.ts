import { $Enums } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'

import {
  createPlan,
  copyPlan,
  deletePlan,
  updatePlan,
  activePlan,
  deActivePlan,
  UnFinishPlanDay,
  FinishPlanDay,
  updatePlanComment,
  updatePlanState,
  createPlanFeedback,
} from '@/app/actions/plan'
import { planSchmaType } from '@/app/schemas/plan'

export function useCreatePlan() {
  return useMutation({
    mutationFn: ({ data }: { data: planSchmaType }) => createPlan(data),
  })
}

export function useCopyPlan() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: planSchmaType }) => copyPlan(id, data),
  })
}

export function useUpdatePlan() {
  return useMutation({
    mutationFn: ({ data, id }: { data: planSchmaType; id: number }) => updatePlan(id, data),
  })
}

export function useUpdatePlanComment() {
  return useMutation({
    mutationFn: ({ comments, id }: { comments: string; id: number }) =>
      updatePlanComment(id, comments),
  })
}

export function useUpdatePlanState() {
  return useMutation({
    mutationFn: ({ state, id }: { state: $Enums.state_of_training; id: number }) =>
      updatePlanState(id, state),
  })
}
export function useDeletePlan() {
  return useMutation({
    mutationFn: (id: number) => deletePlan(id),
  })
}

export function useFinishPlanDay() {
  return useMutation({
    mutationFn: ({
      day,
      week,
      idPlan,
      idSocio,
    }: {
      day: number
      week: number
      idPlan: number
      idSocio: number
    }) => FinishPlanDay({ day, week, idPlan, idSocio }),
  })
}

export function useUnFinishPlanDay() {
  return useMutation({
    mutationFn: ({ day, idPlan }: { day: number; idPlan: number }) =>
      UnFinishPlanDay({ day, idPlan }),
  })
}

export function useActivePlan() {
  return useMutation({
    mutationFn: ({ idSocio, idPlan }: { idSocio: number; idPlan: number }) =>
      activePlan(idSocio, idPlan),
  })
}

export function useDeActivePlan() {
  return useMutation({
    mutationFn: ({ idSocio }: { idSocio: number }) => deActivePlan(idSocio),
  })
}

export function useCreatePlanFeedback() {
  return useMutation({
    mutationFn: ({
      planId,
      borg,
      comentario,
    }: {
      planId: number
      borg: $Enums.borg
      comentario: string
    }) => createPlanFeedback(planId, borg, comentario),
  })
}
