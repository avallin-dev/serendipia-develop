import { useMutation } from '@tanstack/react-query'

import {
  createNotification,
  deleteNotification,
  updateNotification,
} from '@/app/actions/notification/index'
import { notificationType } from '@/app/schemas/notification'

export function useCreateNotification() {
  return useMutation({
    mutationFn: ({ data }: { data: notificationType }) => createNotification(data),
  })
}

export function useUpdateNotification() {
  return useMutation({
    mutationFn: ({ data, id }: { data: notificationType; id: number }) =>
      updateNotification(id, data),
  })
}

export function useDeleteNotification() {
  return useMutation({
    mutationFn: (id: number) => deleteNotification(id),
  })
}
