'use client'

import {zodResolver} from '@hookform/resolvers/zod'
import {AxiosResponse} from 'axios'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {AiOutlineLoading} from 'react-icons/ai'
import {BsPersonCircle} from 'react-icons/bs'
import {toast} from 'sonner'

import {Button} from '@/app/components/ui/button'
import {Form, FormControl, FormField, FormItem, FormMessage} from '@/app/components/ui/form'
import {InputLabel} from '@/app/components/ui/input'
import {partnerLoginSchema, partnerLoginType} from '@/app/schemas/user/partner'
import {PartnerLogin} from '@/app/types/partner'
import apiClient from '@/lib/api-client'
import Bot from "@/app/(auth)/login-partner/components/_bot";

export default function Page() {
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const form = useForm<PartnerLogin>({
		resolver: zodResolver(partnerLoginSchema),
		defaultValues: {dni: ''},
	})
	
	async function onSubmit(values: partnerLoginType) {
		setLoading(true)
		try {
			const res = await apiClient.post('/auth/login-partner', values)
			if (res.data.success) {
				toast.success(res.data.message)
				localStorage.setItem('user', JSON.stringify(res.data.userFound))
				router.refresh()
				router.push('/')
			}
		} catch (e) {
			const error = e as AxiosResponse
			toast.error(error?.data.message || 'Error inesperado. Intente mas tarde')
		} finally {
			setLoading(false)
		}
	}
	
	return (
		<div
			className="flex w-full max-w-lg flex-grow flex-col items-center justify-center sm:flex-grow-0">
			{/** @function <Bot/>
           @description Para agregar el <Widget/> usado como bot a la landing page, aunque no es correcto porque necesita
            un usuario autenticado para funcionar
			     @optional modificar toda la creacion del bot a no necesitar usuario autenticado para poder agregarlo a la
					  landing page o construirlo como se piensa con n8n, ideal esos cambios hacerlos con una nueva version del sistema
					  y una refactorizacion del codigo si el cliente accede con un mejor levantamiento de requisitos desde el inicio
			 */}
			{/*<Bot/>*/}
			
			<Link href="/login" className="absolute right-2 top-2 sm:right-5 sm:top-5">
				<div className="text-center text-xs text-white/30 sm:text-sm">Soy administrador
				</div>
			</Link>
			<div className="relative w-full">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="dni"
							disabled={loading}
							render={({field}) => (
								<FormItem className="space-y-0">
									<FormControl>
										<InputLabel
											label="DNI"
											icon={<BsPersonCircle className="absolute left-4 top-5"
											                      size={24}/>}
											type="text"
											{...field}
										/>
									</FormControl>
									<div className="h-4">
										<FormMessage className="mt-1 text-xs tracking-wide"/>
									</div>
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							size="md"
							disabled={loading}
							className="mx-auto mt-5 flex shadow-md shadow-black/20 sm:mt-8"
						>
							{loading ? (
								<AiOutlineLoading className="animate-spin text-2xl text-white"/>
							) : (
								<span>Iniciar sesión</span>
							)}
						</Button>
					</form>
				</Form>
			</div>
			<div className="h-5 sm:h-4"></div>
		</div>
	)
}
