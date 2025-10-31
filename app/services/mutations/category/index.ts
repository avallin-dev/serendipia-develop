import { useMutation } from '@tanstack/react-query'

import { createCategory, deleteCategory, updateCategory } from '@/app/actions/category'
import { categorySchmaType, updateCategoryType } from '@/app/schemas/category'

export function useCreateCategory() {
  return useMutation({
    mutationFn: ({ data }: { data: categorySchmaType }) => createCategory(data),
  })
}

export function useUpdateCategory() {
  return useMutation({
    mutationFn: ({ data, id }: { data: updateCategoryType; id: number }) =>
      updateCategory(id, data),
  })
}

export function useDeleteCategory() {
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
  })
}
