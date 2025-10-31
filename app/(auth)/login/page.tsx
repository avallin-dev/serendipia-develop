'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosResponse } from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineLoading } from 'react-icons/ai'
import { BsPersonCircle, BsLock } from 'react-icons/bs'
import { toast } from 'sonner'

import { Button } from '@/app/components/ui/button'
import { Form, FormControl, FormField, FormMessage, FormItem } from '@/app/components/ui/form'
import { InputLabel } from '@/app/components/ui/input'
import { userLoginSchema, userLoginType } from '@/app/schemas/user/user'
import { UserLogin } from '@/app/types/user'
import { Checkbox } from '@/components/ui/checkbox'
import apiClient from '@/lib/api-client'

export default function Page() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isCheck, setIsCheck] = useState(false)
  const form = useForm<UserLogin>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(values: userLoginType) {
    setLoading(true)
    const { username, password } = values

    try {
      const res = await apiClient.post('/auth/login', { username, password, remember: isCheck })
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.userFound))
        toast.success(res.data.message)
        router.push('/admin/boards')
      }
    } catch (e) {
      const error = e as AxiosResponse
      toast.error(error?.data.message || 'Error inesperado. Intente mas tarde')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full max-w-lg flex-grow flex-col items-center justify-center sm:flex-grow-0">
      <div className="relative w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormControl>
                    <InputLabel
                      label="Username"
                      icon={<BsPersonCircle className="absolute left-4 top-5" size={24} />}
                      type="text"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <div className="h-4">
                    <FormMessage className="mt-1 text-xs tracking-wide" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormControl>
                    <InputLabel
                      label="Password"
                      className="pr-14"
                      icon={<BsLock className="absolute left-4 top-5" size={24} />}
                      isPasswordVisible={isVisible}
                      setIsPasswordVisible={setIsVisible}
                      type={isVisible ? 'text' : 'password'}
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <div className="h-4">
                    <FormMessage className="mt-1 text-xs tracking-wide" />
                  </div>
                </FormItem>
              )}
            />
            <div className="mx-3 flex items-center space-x-2 space-y-0">
              <Checkbox
                id="remember"
                onCheckedChange={(e: boolean) => setIsCheck(e)}
                disabled={loading}
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none text-secondary-foreground"
              >
                Recordar
              </label>
            </div>
            <Button
              type="submit"
              size="md"
              disabled={loading}
              className="mx-auto mt-5 flex shadow-md shadow-black/20 sm:mt-10"
            >
              {loading ? (
                <AiOutlineLoading className="animate-spin text-2xl text-white" />
              ) : (
                <span>Iniciar sesión</span>
              )}
            </Button>
          </form>
          <div className="h-3"></div>
          <Link href="/login-partner">
            <div className="text-center text-secondary-foreground">Soy socio</div>
          </Link>
        </Form>
      </div>
    </div>
  )
}
