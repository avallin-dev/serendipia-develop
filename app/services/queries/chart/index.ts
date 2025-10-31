import { useQuery } from '@tanstack/react-query'

import {
  getConcurrencia,
  getHistorialPagos,
  getHistorialCheckins,
  getHistorialVisitantes,
  getExportIndicators,
  getExpiredMembershipsPie,
  getStudentsByMembership,
  getFacturationByType,
  getFacturationByMembership,
  getPendingFacturation,
  getAverageMembershipValue,
  getBankVsCash,
  getPlansByTrainer,
} from '@/app/actions/chart'

export interface VisitaExport {
  nombre: string
  membresia: string
  fechaCreacion: string
  horaFinalizacion: string | null
}

export interface ConcurrenciaResult {
  concurrencia: Record<string, Record<number, number>>
  visitasExport: VisitaExport[]
}

export const useConcurrencia = ({ from, to }: { from: string; to: string }) => {
  const {
    data = { concurrencia: {}, visitasExport: [] },
    isLoading,
    isFetching,
  } = useQuery<ConcurrenciaResult>({
    queryKey: ['concurrencia', from, to],
    queryFn: async () => {
      const data = await getConcurrencia({ from: new Date(from), to: new Date(to) })
      return data
    },
  })

  return {
    concurrencia: data.concurrencia,
    visitasExport: data.visitasExport,
    isLoading,
    isFetching,
  }
}

export const useHistorialPagos = ({ from, to }: { from: string; to: string }) =>
  useQuery({
    queryKey: ['historialPagos', from, to],
    queryFn: async () => {
      const data = await getHistorialPagos({ from: new Date(from), to: new Date(to) })
      return data
    },
  })

export const useHistorialCheckins = ({ from, to }: { from: string; to: string }) =>
  useQuery({
    queryKey: ['historialCheckins', from, to],
    queryFn: async () => {
      const data = await getHistorialCheckins({ from: new Date(from), to: new Date(to) })
      return data
    },
  })

export const useHistorialVisitantes = ({ from, to }: { from: string; to: string }) =>
  useQuery({
    queryKey: ['historialVisitantes', from, to],
    queryFn: async () => {
      const data = await getHistorialVisitantes({ from: new Date(from), to: new Date(to) })
      return data
    },
  })

export const useExportIndicators = () =>
  useQuery({
    queryKey: ['exportIndicators'],
    queryFn: async () => {
      const data = await getExportIndicators()
      return data
    },
  })

export const useExpiredMembershipsPie = (
  filtro: 'con_plan' | 'sin_plan' | 'todos' = 'todos',
  { from, to }: { from: Date; to: Date }
) =>
  useQuery({
    queryKey: ['expiredMembershipsPie', filtro, from.toISOString(), to.toISOString()],
    queryFn: async () =>
      getExpiredMembershipsPie(filtro, { from: new Date(from), to: new Date(to) }),
  })

export const useStudentsByMembership = ({ from, to }: { from: Date; to: Date }) =>
  useQuery({
    queryKey: ['studentsByMembership', from.toISOString(), to.toISOString()],
    queryFn: async () => getStudentsByMembership({ from: new Date(from), to: new Date(to) }),
  })

export const useFacturationByType = ({ from, to }: { from: Date; to: Date }) =>
  useQuery({
    queryKey: ['facturationByType', from.toISOString(), to.toISOString()],
    queryFn: async () => getFacturationByType({ from, to }),
  })

export const useFacturationByMembership = ({ from, to }: { from: Date; to: Date }) =>
  useQuery({
    queryKey: ['facturationByMembership', from.toISOString(), to.toISOString()],
    queryFn: async () => getFacturationByMembership({ from, to }),
  })

export const usePendingFacturation = () =>
  useQuery({
    queryKey: ['pendingFacturation'],
    queryFn: async () => getPendingFacturation(),
  })

export const useAverageMembershipValue = ({ from, to }: { from: Date; to: Date }) =>
  useQuery({
    queryKey: ['averageMembershipValue', from.toISOString(), to.toISOString()],
    queryFn: async () => getAverageMembershipValue({ from, to }),
  })

export const useBankVsCash = ({ from, to }: { from: Date; to: Date }) =>
  useQuery({
    queryKey: ['bankVsCash', from.toISOString(), to.toISOString()],
    queryFn: async () => getBankVsCash({ from, to }),
  })

export const usePlansByTrainer = () =>
  useQuery({
    queryKey: ['plansByTrainer'],
    queryFn: async () => getPlansByTrainer(),
  })
