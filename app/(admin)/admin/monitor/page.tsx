'use client'

import {useQueryClient} from '@tanstack/react-query'
import {format} from 'date-fns'
import Image from 'next/image'
import {useEffect, useState} from 'react'
import {LuFilter, LuLogOut, LuUsers} from 'react-icons/lu'
import {toast} from 'sonner'

import TablesLoading from '@/app/components/TablesLoading'
import {Button} from '@/app/components/ui/button'
import {useCloseActivity} from '@/app/services/mutations/monitor'
import {useUpdatePartner} from '@/app/services/mutations/partner'
import {useMonitor} from '@/app/services/queries/monitor'
import {MonitorType} from '@/app/types/monitor'
import formatTrulyUTC from '@/app/utils/formatTrulyUTC'
import {Checkbox} from '@/components/ui/checkbox'
import {cn} from '@/lib/utils'

import {FilterModal, OpenImage} from './_components'
import {useTime, useTimer} from 'react-timer-hook';
import router from "next/router"
import {useRouter} from "next/navigation"


export default function Page() {
	const queryClient = useQueryClient()
	const updatePartnerMutation = useUpdatePartner()
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [filteredData, setFilteredData] = useState<any[]>([])
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [activeFilters, setActiveFilters] = useState<any>({})
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const [selectedImageProfile, setSelectedImageProfile] = useState('')
	const [isImageProfileOpen, setIsImageProfileOpen] = useState(false)
	const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('active')
	const [selectedItems, setSelectedItems] = useState<number[]>([])
	const router = useRouter()
	
	const {data, isLoading, isFetching} = useMonitor()
	const closeActivityMutation = useCloseActivity()
	
	const {
		milliseconds,
		seconds,
		minutes,
		hours,
		ampm,
	} = useTime({format: undefined, interval: 20});
	
	/** @description Para limpiar el monitor */
	const cleanMonitor = () => {
		if (hours == 23 && minutes == 59 && seconds == 59) {
			toast.success('En breve se borrara el monitor')
			
			/** mejorar modo de refresh envia a la pagina de las pizarras */
			router.refresh()
			router.push('/')
		}
	}
	
	
	useEffect(() => {
		cleanMonitor()
		if (!isLoading && data) {
			applyFilters(activeFilters)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading, isFetching, data, activeFilters, statusFilter, (hours == 23 && minutes == 59 && seconds == 59)])
	
	const handleFilter = (filters: Partial<MonitorType['socio']>) => {
		setActiveFilters(filters)
	}
	
	const handleSelect = (id: number) => {
		setSelectedItems((prev) =>
			prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
		)
	}
	
	const handleOnCloseActivity = () => {
		if (selectedItems.length > 0)
			closeActivityMutation.mutate(
				{data: selectedItems},
				{
					onSuccess() {
						queryClient.invalidateQueries({queryKey: ['monitor']})
						setSelectedItems([])
						toast.info('Dia finalizado para los socios seleccionados')
					},
					onError(error) {
						console.error(error)
						toast.error('Error al marcar final del día. Intenta más tarde')
					},
				},
			)
	}
	
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const applyFilters = (filters: any = {}) => {
		if (!data) return
		
		let filtered = data.filter((visita) => {
			let matches = true
			
			if (filters.Nombre) {
				matches =
					matches && !!visita.socio?.Nombre?.toLowerCase().includes(filters.Nombre.toLowerCase())
			}
			
			if (filters.DNI) {
				matches = matches && !!visita.socio?.DNI?.includes(filters.DNI)
			}
			
			if (filters.idUsuario) {
				matches = matches && visita.socio.plan?.idUsuario?.toString() === filters.idUsuario
			}
			
			if (filters.nivel) {
				matches = matches && visita.socio.nivel === filters.nivel
			}
			
			if (filters.Observaciones) {
				matches = matches && visita.socio.Observaciones === filters.Observaciones
			}
			
			if (filters.idPlan !== undefined) {
				if (filters.idPlan === null) {
					matches = matches && visita.socio.idPlan === null
				} else {
					matches = matches && visita.socio.idPlan !== null
				}
			}
			
			return matches
		})
		
		if (statusFilter === 'active') {
			filtered = filtered.filter((visita) => visita.horaFinalizacion === null)
		} else if (statusFilter === 'inactive') {
			filtered = filtered.filter((visita) => visita.horaFinalizacion !== null)
		}
		
		setFilteredData(filtered)
	}
	
	const getLevelColor = (level: string | null) => {
		switch (level) {
			case 'AVANZADO':
				return 'ring-green-500'
			
			case 'INTERMEDIO':
				return 'ring-yellow-200'
			
			case 'INICIAL':
				return 'ring-red-400'
			
			default:
				return 'ring-gray-600'
		}
	}
	
	if (isLoading) {
		return <TablesLoading/>
	}
	
	
	function handleEnableActivity(data) {
		const data_partner = data.socio
		const values = {
			Nombre: data_partner?.Nombre !== null ? data_partner?.Nombre : '',
			Paterno: data_partner?.Paterno !== null ? data_partner?.Paterno : '',
			Materno: data_partner?.Materno !== null ? data_partner?.Materno : '',
			DNI: data_partner?.DNI !== null ? data_partner?.DNI : '',
			Telefono:
				data_partner?.Telefono !== null
					? data_partner?.Telefono.includes('+')
						? data_partner?.Telefono
						: `+54${data_partner?.Telefono}`
					: '',
			Observaciones: data_partner?.Observaciones !== null ? data_partner?.Observaciones : '',
			clave: data_partner?.clave !== null ? data_partner?.clave : '',
			fechaNacimiento: data_partner?.fechaNacimiento ? data_partner.fechaNacimiento : undefined,
			correo: data_partner?.correo !== null ? data_partner?.correo : '',
			nivel: data_partner?.nivel ?? 'INICIAL',
			condicionMedica: data_partner?.condicionMedica ?? '',
			authorization: 1,
		}
		// localStorage.setItem('userAuthActivity', JSON.stringify(enabled))
		updatePartnerMutation.mutate(
			{data: {...values}, id: data_partner.idSocio},
			{
				onSuccess() {
					queryClient.invalidateQueries({
						queryKey: ['partner', data_partner.idSocio.toString()],
					})
					toast.success('Socio actualizado exitosamente')
				},
				onError(error) {
					console.error(error)
					toast.error('Error inesperado. Intente mas tarde')
				},
			},
		)
		
		
	}
	
	return (
		<div>
			{/*<div style={{fontSize: '100px'}}>*/}
			{/*    <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>*/}
			{/*</div>*/}
			<FilterModal
				isOpen={isFilterOpen}
				onClose={() => setIsFilterOpen(false)}
				onFilter={handleFilter}
			/>
			<OpenImage
				isOpen={isImageProfileOpen}
				onClose={() => setIsImageProfileOpen(false)}
				src={selectedImageProfile}
			/>
			<h1 className="mb-4 text-4xl font-semibold">Monitor de sala</h1>
			<div className="flex justify-between">
				<div className="mb-4 flex gap-4">
					<Button variant="outline" onClick={() => setIsFilterOpen(true)}>
						<LuFilter size={20}/>
						Filtrar Visitas
					</Button>
					<Button
						variant={statusFilter === 'all' ? 'default' : 'outline'}
						onClick={() => setStatusFilter('all')}
					>
						Todos
					</Button>
					<Button
						variant={statusFilter === 'active' ? 'default' : 'outline'}
						onClick={() => setStatusFilter('active')}
					>
						Activos
					</Button>
					<Button
						variant={statusFilter === 'inactive' ? 'default' : 'outline'}
						onClick={() => setStatusFilter('inactive')}
					>
						Inactivos
					</Button>
				</div>
				<div
					className={`transition-all duration-300 ease-in-out ${
						selectedItems.length > 0
							? 'translate-y-0 opacity-100'
							: 'pointer-events-none translate-y-2 opacity-0'
					}`}
				>
					<Button variant="destructive" onClick={() => handleOnCloseActivity()}>
						<LuLogOut size={20} className="mr-2"/>
						Cerrar actividad
					</Button>
				</div>
			</div>
			<div className="h-10"></div>
			{filteredData.length > 0 ? (
				<div className="grid grid-cols-3 gap-x-6 gap-y-10">
					{filteredData.length > 0 &&
						filteredData.map((item) => (
							<div
								key={item.idVisita}
								className={cn(
									'transition-discrete group relative rounded-xl bg-gray-400 p-4 shadow-lg ring-4 transition-all',
									getLevelColor(item.socio?.nivel),
									selectedItems.includes(item.idVisita) &&
									'outline outline-offset-4 outline-primary-dark',
								)}
							>
								<Checkbox
									id={`checkbox-${item.idVisita}`}
									checked={selectedItems.includes(item.idVisita)}
									onCheckedChange={() => handleSelect(item.idVisita)}
									className={cn(
										'absolute right-3 top-3 rounded-full bg-white/90 opacity-0 transition-opacity duration-200 group-hover:opacity-100',
										selectedItems.includes(item.idVisita) && 'opacity-100',
									)}
									color="#FFFF00"
								/>
								<div>
									
									{(item.socio?.sociomembresia?.includes('PILATES')
										|| item.socio?.sociomembresia?.includes('SIN PLAN')
										|| item.socio.sociomembresia == undefined)
									|| item.porcentajeProgreso > 0
										? ''
										: (<Button variant="outline"
										           className={cn('absolute -bottom-[1.5em] left-[40%] right-[40%] animate-pulse ' +
											           'hover:animate-none hover:bg-primary-foreground hover:text-white border-0')}
										           onClick={() => handleEnableActivity(item)}>
											Activar Plan
										</Button>)}
								
								
								</div>
								<div className="flex gap-x-6">
									<div
										className="relative h-16 w-16 overflow-auto rounded-full bg-gray-300"
										onClick={() => {
											if (item.socio?.image_profile) {
												setSelectedImageProfile(item.socio.image_profile)
												setIsImageProfileOpen(true)
											}
										}}
									>
										<Image
											src={item.socio?.image_profile ?? '/images/Logo_2.png'}
											alt=""
											priority
											sizes="100%"
											fill
											style={{objectFit: `${item.socio?.image_profile ? 'cover' : 'contain'}`}}
											className={`${item.socio?.image_profile ? 'p-0' : 'p-2 pt-3'}`}
										/>
									</div>
									<div className="mb-2 space-y-2">
										<div className="text-lg font-bold">{item.name}</div>
										<div>
                                            <span
	                                            className="font-bold">Tipo de entrenamiento:</span>{' '}
											{item.socio?.idPlan || item.socio?.sociomembresia?.includes('PILATES')
												? 'con plan'
												: 'sin plan'}
										</div>
										<div className={'flex row gap-2'}>
											<span className="font-bold ">Membresia:</span>{' '}
											{item.socio?.sociomembresia
												? item.socio?.sociomembresia
												: 'No posee membresía aún'}
										
										</div>
										<div>
											<span className="font-bold">Entrenador:</span>{' '}
											{item.socio.plan?.usuario?.Nombre || 'No tiene'}
										</div>
									</div>
								</div>
								<div className="mb-2 grid grid-cols-2 gap-x-4">
									<div>
										<span className="font-bold">Patologías: </span>
										<span className="text-sm font-medium">
                      {item.socio?.Observaciones ? (
	                      ` ${item.socio?.Observaciones}`
                      ) : (
	                      <span className="text-xm text-gray-900"> No añadido</span>
                      )}
                    </span>
									</div>
									<div>
										<span className="font-bold">Nivel: </span>
										<span className="text-sm font-medium">
                      {item.socio?.nivel ? (
	                      ` ${item.socio?.nivel}`
                      ) : (
	                      <span className="text-xm font-semibold text-gray-900"> No añadido</span>
                      )}
                    </span>
									</div>
								</div>
								<div className="grid grid-cols-3 gap-x-4">
									<div>
										<span className="font-bold">Hora inicio: </span>
										<span className="block whitespace-nowrap font-medium">
                      {item.fechaCreacion && format(formatTrulyUTC(item.fechaCreacion), 'p')}
                    </span>
									</div>
									<div>
										<span className="font-bold">Hora final: </span>
										<span className="block whitespace-nowrap font-medium">
                      {item.horaFinalizacion ? format(item.horaFinalizacion, 'p') : 'Aun activo'}
                    </span>
									</div>
									<div>
										<span className="font-bold">% de avance: </span>
										
										<span className="block whitespace-nowrap font-medium">
                      {item.porcentajeProgreso ? item.porcentajeProgreso + '%' : '0%'}
                    </span>
									</div>
								</div>
							</div>
						))}
				</div>
			) : (
				<div className="flex h-full flex-col items-center justify-center p-6 text-center">
					<div className="rounded-full bg-gray-100 p-4">
						<LuUsers className="h-12 w-12 text-gray-500"/>
					</div>
					<h2 className="mt-4 text-xl font-semibold text-gray-800">No hay socios
						registrados</h2>
					<p className="mt-2 max-w-md text-sm text-gray-500">
						Aún no hay socios registrados en el sistema. Los miembros deben ingresar
						mediante el
						molinete y esta página solo permite monitorizar su actividad.
					</p>
				</div>
			)}
		</div>
	)
}
