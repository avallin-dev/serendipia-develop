import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export function useQueryString(name?: string) {
  const [queryParams, setQueryParams] = useState<string | null | undefined>(null)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (name) {
      const param = searchParams?.get(name!)
      setQueryParams(param!)
    }
  }, [name, searchParams])

  const setQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const pushQueryString = useCallback(
    (name: string, value: string) => {
      router.push(pathname + '?' + setQueryString(name, value))
    },
    [pathname, router, setQueryString]
  )

  return { pushQueryString, queryParams }
}
