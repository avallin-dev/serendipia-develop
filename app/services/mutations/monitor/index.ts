import { useMutation } from '@tanstack/react-query'

import { closeActivity, closeActivityByPartner } from '@/app/actions/monitor'

export function useCloseActivity() {
  return useMutation({
    mutationFn: ({ data }: { data: number[] }) => closeActivity(data),
  })
}

export function useCloseActivityByPartner() {
  return useMutation({
    mutationFn: (idSocio: number) => closeActivityByPartner(idSocio),
  })
}
