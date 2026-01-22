'use client'

import {zodResolver} from '@hookform/resolvers/zod'
import {sociomembresia, sociomembresia_pago} from '@prisma/client'
import {useQueryClient} from '@tanstack/react-query'
import React from 'react'
import {useForm} from 'react-hook-form'

import {Combobox} from '@/app/components/Combobox'
import ModalWrapper from '@/app/components/ModalWrapper'
import {Button} from '@/app/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/app/components/ui/form'
import {Input} from '@/app/components/ui/input'
import {Separator} from '@/app/components/ui/separator'
import {Switch} from '@/app/components/ui/switch'
import {partnerMembershipSchema, partnerMembershipType} from '@/app/schemas/partner-membership'
import {payMembershipSchema} from '@/app/schemas/pay-membership'
import {useCreatePayMembership, useUpdatePayMembership} from '@/app/services/mutations/membership'
import {useUpdateClassAvailable, useUpdatePartnerMembership} from '@/app/services/mutations/partner'
import {useAllMemberships} from '@/app/services/queries/membership'
import {usePartnerMembershipWithPilates, usePilatesByPartner} from "@/app/services/queries/pilate";
import {usePartnerWithPilates} from "@/app/services/queries/partner";
import {useCreatePilate} from "@/app/services/mutations/pilate";
import formatUTC from "@/app/utils/formatUTC";
import {toast} from "sonner"
import differenceInMonths from "date-fns/differenceInMonths"
import {partnerLoginSchema} from "@/app/schemas/user/partner";


interface FusionFormType extends partnerMembershipType {
	observacion: string
	importe: number
}

type FusionPartnerMembershipProps = {
	onClose: () => void
	open: boolean
	partnerMembership?: sociomembresia & { sociomembresia_pago: sociomembresia_pago[] }
	setStep: (arg: string) => void
	partnerId?: number
}

export default function FusionPartnerMembership({
	                                                onClose,
	                                                open,
	                                                partnerMembership,
	                                                setStep,
	                                                partnerId,
                                                }: FusionPartnerMembershipProps) {
	const queryClient = useQueryClient()
	const updatePartnerMembershipMutation = useUpdatePartnerMembership()
	const createPayMembershipMutation = useCreatePayMembership()
	const updatePayMembershipMutation = useUpdatePayMembership()
	const createPilateMutation = useCreatePilate()
	const updateClassAvailable = useUpdateClassAvailable()
	
	const dataPartnerPilates = usePartnerMembershipWithPilates(partnerId)
	const dataPartnerPil = usePartnerWithPilates()
	const {pilates, isLoading, isFetching} = usePilatesByPartner(partnerId)
	const {memberships} = useAllMemberships()
	const membershipData = memberships?.map((e) => ({
		value: e.idMembresia.toString(),
		label: e.Nombre!,
	}))
	
	const [isEdition, setIsEdition] = React.useState(false)
	const defaultImporte = 0.0
	
	
	const form = useForm<FusionFormType>({
		resolver: zodResolver(partnerMembershipSchema.merge(payMembershipSchema)),
		defaultValues: {
			fechaInicioMembresia: partnerMembership?.fechaInicioMembresia ?? undefined,
			Vencimiento: partnerMembership?.Vencimiento ?? undefined,
			idMembresia: partnerMembership?.idMembresia?.toString() ?? '',
			observacion:
				partnerMembership?.sociomembresia_pago?.[partnerMembership?.sociomembresia_pago.length - 1]
					?.observacion ?? '',
			importe: partnerMembership?.sociomembresia_pago
				? Number(
					partnerMembership?.sociomembresia_pago?.[
					partnerMembership?.sociomembresia_pago.length - 1
						]?.importe
				)
				: 0.0,
		},
	})
	
	const isSwitchDisabled = form.watch('importe') <= defaultImporte
	
	React.useEffect(() => {
		if (isSwitchDisabled) {
			setIsEdition(true)
		} else {
			setIsEdition(false)
		}
	}, [isSwitchDisabled])
	
	
	function newDate(value): Date {
		const day = new Date(value).toISOString().split('T')[0].split('-')[2];
		const month = new Date(value).getUTCMonth();
		const year = new Date(value).getFullYear();
		let output = new Date(year, month + 1, Number(day));
		if (month == 11)
			output = new Date(year + 1, 0, Number(day));
		return output
	}
	
	async function onSubmit(values: FusionFormType) {
		const id = partnerMembership?.idSocioMembresia
		
		/**
		 * @description primero actualizar las clases ocupadas a 0 para que se puedan poner las nuevas y evitar el error de no clases
		 * disponibles, este comportamiento lleva que se analice, es una mejor variante para eliminar la necesidad de
		 * interaccion entre el cliente y el sistema, ya no debe mostrar el error de las camas llenas
		 * */
		updateClassAvailable.mutate({
			idSocioMembresia: id
		})
		
		
		/** segundo actualizar membresía */
		updatePartnerMembershipMutation.mutate(
			{
				data: {
					idMembresia: parseInt(values.idMembresia),
					fechaInicioMembresia: formatUTC(new Date(Date.now())),
					Vencimiento: formatUTC(newDate(new Date(Date.now()))),
				},
				id: id!,
			},
			{
				async onSuccess() {
					if (isEdition) {
						updatePayMembershipMutation.mutate(
							{
								data: {
									observacion: values.observacion,
									importe: values.importe,
									idSocioMembresia: id!,
								},
								idSocioMembresia: id!,
							},
							{
								onSuccess() {
									queryClient.invalidateQueries({
										queryKey: ['partner-membership', partnerMembership?.idSocio?.toString()],
									})
									toast.success('Edición y pago exitosos')
									setStep('table')
								},
								onError(error) {
									console.error(error)
									toast.error('Error al guardar el pago. Intente más tarde')
								},
							}
						)
					} else {
						
						createPayMembershipMutation.mutate(
							{
								data: {
									observacion: values.observacion,
									importe: values.importe,
									idSocioMembresia: id!,
								},
								id: partnerId!,
							},
							{
								onSuccess() {
									queryClient.invalidateQueries({
										queryKey: ['partner-membership', partnerMembership?.idSocio?.toString()],
									})
									toast.success('Edición y pago exitosos')
									setStep('table')
								},
								onError(error) {
									console.error(error)
									toast.error('Error al guardar el pago. Intente más tarde')
								},
							}
						)
					}
				},
				onError(error) {
					console.error(error)
					toast.error('Error al editar la membresía. Intente más tarde')
				},
			}
		)
		
		/** Creando los pilates para que se muestren en el calendario para el nuevo mes de validez
		 * del pago de la membresia
		 * */
		
		/** verificar si el socio tiene pilates o no */
		
		const valid_days: number[] = []
		if (dataPartnerPilates && dataPartnerPilates.partnerMembership) {
			dataPartnerPilates?.partnerMembership?.map(p => valid_days.push(Number(p.day)))
		}
		
		/** recorrer las fechas desde el inicio al vencimiento y cada dia que coicida con los dias
		 *  de pilates crear un nuevo pilate y mostrar en calendario
		 **/
		
		/** necesita ser la fecha actual */
		
		const newStartDate = new Date(Date.now())
		
		/** necesita ser el vencimiento un mes despues */
		const newEndDate = newDate(newStartDate)
		const currentDate = new Date(newStartDate)
		
		if (currentDate.getHours() > 11 && currentDate.getHours() <= 14) {
			currentDate.setHours(14)
		}
		
		while (currentDate <= newEndDate) {
			const dayOfWeek = currentDate.getDay()
			if (partnerMembership?.idSocio && valid_days.includes(dayOfWeek)) {
				createPilateMutation.mutate(
					{
						data: {
							start: new Date(currentDate.getTime()),
							end: new Date(currentDate.getTime() + 60 * 60 * 1000),
							idSocio: partnerMembership?.idSocio.toString(),
							// title: `${partnerMembership?.Nombre} ${partnerMembership?.Paterno}`,
							title: '',
							classType: 'disponible',
						}
					},
					{
						onSuccess({message}) {
							queryClient.invalidateQueries({
								queryKey: ['pilate'],
							})
							toast.success(message)
							onClose()
						},
						onError(error) {
							toast.error(error.message)
						},
					}
				)
			}
			currentDate.setDate(currentDate.getDate() + 1)
		}
		return
	}
	
	const createContent = (
		<>
			<div className="mb-2 flex justify-end gap-x-2">
				<Button
					variant="outline"
					className="h-10 px-3 text-xs"
					type="button"
					size="sm"
					onClick={() => {
						setStep('table')
					}}
				>
					Volver
				</Button>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="grid gap-4 py-0">
						<div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
							<FormField
								control={form.control}
								name="idMembresia"
								render={({field}) => (
									<FormItem className="col-span-2 space-y-2">
										<FormLabel>Selecciona membresía</FormLabel>
										<Combobox
											data={membershipData || []}
											placeholder="Nombre de la membresía"
											onChange={field.onChange}
											value={field.value!}
										/>
										<div className="h-4">
											<div className="h-4">
												<FormMessage
													className="mt-1 text-xs tracking-wide"/>
											</div>
										</div>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="fechaInicioMembresia"
								render={({field}) => (
									<FormItem>
										<FormLabel>Fecha de inicio</FormLabel>
										<Input
											type="date"
											className="rounded-full"
											{...field}
											value={
												field.value instanceof Date
													? new Date(
														field.value.getTime() - field.value.getTimezoneOffset() * 60000
													)
														.toISOString()
														.split('T')[0]
													: field.value
											}
											onBlur={() => {
												form.setValue('Vencimiento', newDate(form.getValues('fechaInicioMembresia')));
											}}
										/>
										<FormMessage/>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="Vencimiento"
								render={({field}) => (
									<FormItem>
										<FormLabel>Vencimiento</FormLabel>
										<Input
											type="date"
											className="rounded-full"
											{...field}
											value={
												field.value instanceof Date
													? new Date(
														field.value.getTime() - field.value.getTimezoneOffset() * 60000
													)
														.toISOString()
														.split('T')[0]
													: field.value
											}
										/>
										<FormMessage/>
									</FormItem>
								)}
							/>
						</div>
						<Separator className="my-4"/>
						<div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
							<FormField
								control={form.control}
								name="observacion"
								render={({field}) => (
									<FormItem>
										<FormLabel>Observaciones</FormLabel>
										<FormControl>
											<Input {...field} type="text" className="rounded-full"/>
										</FormControl>
										<div className="h-4">
											<FormMessage className="mt-1 text-xs tracking-wide"/>
										</div>
									</FormItem>
								)}
							/>
							{/* Importe */}
							<FormField
								control={form.control}
								name="importe"
								render={({field}) => (
									<FormItem>
										<FormLabel>Importe</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
												onChange={(event) => field.onChange(+event.target.value)}
												className="hide_arrows rounded-full"
												step="0.01"
												min={0}
											/>
										</FormControl>
										<div className="h-4">
											<FormMessage className="mt-1 text-xs tracking-wide"/>
										</div>
									</FormItem>
								)}
							/>
						</div>
						<div className="mt-4 flex items-center justify-end gap-2">
							<FormLabel htmlFor="is-edition">Es edición</FormLabel>
							<Switch
								id="is-edition"
								checked={isEdition}
								onCheckedChange={setIsEdition}
								disabled={isSwitchDisabled}
							/>
						</div>
					</div>
				</form>
			</Form>
		</>
	)
	
	return (
		<ModalWrapper
			isOpen={open}
			onClose={onClose}
			title="Editar afiliación y pago de membresía"
			body={createContent}
			onSubmit={form.handleSubmit(onSubmit)}
			className="overflow-y-visible"
			actionLabel="Guardar"
			disabled={updatePartnerMembershipMutation.isPending || createPayMembershipMutation.isPending}
			isLoading={updatePartnerMembershipMutation.isPending || createPayMembershipMutation.isPending}
		/>
	)
}
