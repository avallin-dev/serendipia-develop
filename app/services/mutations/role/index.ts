import { useMutation } from '@tanstack/react-query'

import { createRole, deleteRole, updateRole } from '@/app/actions/rol'
import { roleSchmaType } from '@/app/schemas/role'

export function useCreateRole() {
  return useMutation({
    mutationFn: ({ data }: { data: roleSchmaType }) => createRole(data),
  })
}

export function useUpdateRole() {
  return useMutation({
    mutationFn: ({ data, id }: { data: roleSchmaType; id: number }) => updateRole(id, data),
  })
}

export function useDeleteRole() {
  return useMutation({
    mutationFn: (id: number) => deleteRole(id),
  })
}
