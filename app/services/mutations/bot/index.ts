import { useMutation } from '@tanstack/react-query'

import { addMessage, resetThread } from '@/app/actions/bot'

export function useAdd() {
  return useMutation({
    mutationFn: ({ socioId, content }: { socioId: number; content: string }) =>
      addMessage(socioId, content),
  })
}

export function useResetThread() {
  return useMutation({
    mutationFn: (socioId: number) => resetThread(socioId),
  })
}
