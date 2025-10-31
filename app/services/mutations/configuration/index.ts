import { useMutation } from '@tanstack/react-query'

import { updateConfig } from '@/app/actions/configuration'
import { updateConfigType } from '@/app/schemas/configuration'

export function useUpdateConfig() {
  return useMutation({
    mutationFn: ({ data }: { data: updateConfigType }) => updateConfig(data),
  })
}
