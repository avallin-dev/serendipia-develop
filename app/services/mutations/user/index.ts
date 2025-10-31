import { useMutation } from '@tanstack/react-query'

import { createUser, deleteUser, updateUser } from '@/app/actions/user'
import { usuarioSchmaType, updateUserType } from '@/app/schemas/admin-user'

export function useCreateUser() {
  return useMutation({
    mutationFn: ({ data }: { data: usuarioSchmaType }) => createUser(data),
  })
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: ({ data, id }: { data: updateUserType; id: number }) => updateUser(id, data),
  })
}

export function useDeleteUser() {
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
  })
}
