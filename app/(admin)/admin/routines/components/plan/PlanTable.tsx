'use client'

import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Combobox } from '@/app/components/Combobox'
import { Button } from '@/app/components/ui/button'
import { Checkbox } from '@/app/components/ui/checkbox'
import { Dialog, DialogTrigger } from '@/app/components/ui/dialog'
import { Separator } from '@/app/components/ui/separator'
import { useActivePlan, useDeActivePlan } from '@/app/services/mutations/plan'
import { usePlansByPartner } from '@/app/services/queries/plan'
import { PartnerRoutine } from '@/app/types/partner'
import { PlanType } from '@/app/types/plan'

import { TableRoutines } from '../RoutineTable'

import CopyPlan from './CopyPlan'
import CreatePlan from './CreatePlan'
import DeletePlan from './DeletePlan'
import PlanSummary from './PlanSummary'
import UpdatePlan from './UpdatePlan'

type PlanTableProps = {
  partner?: PartnerRoutine | null
  setPartner: (partner: PartnerRoutine) => void
  plan: PlanType | null
  setPlan: (arg: PlanType) => void
  selectedType: 'socio' | 'grupo' | 'bloque'
}

export function PlanTable({ partner, setPartner, plan, setPlan, selectedType }: PlanTableProps) {
  const queryClient = useQueryClient()
  const idSocio = partner?.idSocio
  const { plans, isFetching } = usePlansByPartner(idSocio!)
  useEffect(() => {
    if (!isFetching && plans) {
      setPlan(plans?.find((e) => e.idPlan === partner?.idPlan) || plans[0] || null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plans, isFetching])

  const activePlanMutation = useActivePlan()
  const deActivePlanMutation = useDeActivePlan()
  const [createIsOpen, setCreateIsOpen] = useState(false)
  const [updateIsOpen, setUpdateIsOpen] = useState(false)
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const [copyIsOpen, setCopyIsOpen] = useState(false)
  const [summaryIsOpen, setSummaryIsOpen] = useState(false)
  const planData =
    plans?.map((e) => ({
      value: e.idPlan.toString(),
      label: e.NombrePlan,
    })) || []

  const handleUpdatePartner = (id?: number | null) => {
    const currentState = partner

    if (partner?.idSocio !== undefined) {
      const updatedPartner: PartnerRoutine = {
        ...currentState,
        idPlan: id!,
        DNI: partner.DNI,
        idSocio: partner.idSocio,
        Nombre: partner.Nombre,
        Observaciones: partner.Observaciones,
        Paterno: partner.Paterno,
        plan: partner.plan,
        Telefono: partner.Telefono,
      }
      setPartner(updatedPartner)
    }
  }

  async function onHandleCheck(state: boolean) {
    const idPlan = plan?.idPlan
    if (state) {
      activePlanMutation.mutate(
        {
          idSocio: idSocio!,
          idPlan: idPlan!,
        },
        {
          onSuccess() {
            queryClient.invalidateQueries({
              queryKey: ['plan', idSocio?.toString()],
            })
            handleUpdatePartner(idPlan)
            toast.success('Plan activado exitosamente')
          },
          onError() {
            toast.error('Error inesperado. Intente mas tarde')
          },
        }
      )
    } else {
      deActivePlanMutation.mutate(
        {
          idSocio: idSocio!,
        },
        {
          onSuccess() {
            queryClient.invalidateQueries({
              queryKey: ['plan', idSocio?.toString()],
            })
            handleUpdatePartner(null)
            toast.success('Plan desactivado exitosamente')
          },
        }
      )
    }
  }
  if (plans) {
    return (
      <>
        <div className="grid grid-cols-2 gap-x-5">
          <div className="space-y-3">
            <div className="flex flex-col gap-y-1">
              <div className="mt-[4px] text-sm font-medium leading-[19.2px]">Nombre</div>
              <Combobox
                data={planData}
                placeholder="partner"
                onChange={(value) => setPlan(plans.find((e) => e.idPlan === parseInt(value))!)}
                value={plan ? plan?.idPlan.toString() : planData[0]?.value || '1'}
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <h3 className="font-semibold">Dias</h3>
              <div>{plan && plan?.dias?.toString()}</div>
            </div>
            <div className="flex flex-col gap-y-1">
              <h3 className="font-semibold">Semanas</h3>
              <div>{plan && plan?.semanas?.toString()}</div>
            </div>
            <div className="flex flex-col gap-y-1">
              <h3 className="font-semibold">Fecha</h3>
              {plan?.fechaCreacion ? (
                <div>
                  {plan?.fechaCreacion && format(plan.fechaCreacion, 'PPP', { locale: es })}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col gap-y-1">
              <h3 className="font-semibold">Usuario</h3>
              <div>{plan?.usuario && plan.usuario?.Nombre}</div>
            </div>

            <div className="flex flex-col gap-y-1">
              <h3 className="font-semibold">Tipo de entrenamiento</h3>
              <div>{plan?.type_of_training || 'Desconocido'}</div>
            </div>
            {plan?.teacher_comments && (
              <div className="flex flex-col gap-y-1">
                <h3 className="font-semibold">Comentarios del instructor</h3>
                <div>{plan?.teacher_comments}</div>
              </div>
            )}
            {idSocio! >= 10 && (
              <div className="flex items-center space-x-2 space-y-0">
                <label htmlFor="remember" className="font-semibold">
                  Plan Activo
                </label>
                <Checkbox
                  id="remember"
                  onCheckedChange={onHandleCheck}
                  checked={plan?.idPlan === plan?.socio?.idPlan}
                />
              </div>
            )}
          </div>
          <div className="flex flex-wrap content-start gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="h-12 w-48 rounded-md"
                  onClick={() => setCreateIsOpen(true)}
                >
                  Nuevo
                </Button>
              </DialogTrigger>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="h-12 w-48 rounded-md"
                  onClick={() => setUpdateIsOpen(true)}
                >
                  Editar
                </Button>
              </DialogTrigger>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="h-12 w-48 rounded-md"
                  onClick={() => setDeleteIsOpen(true)}
                >
                  Eliminar
                </Button>
              </DialogTrigger>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="h-12 w-48 rounded-md"
                  onClick={() => setCopyIsOpen(true)}
                >
                  Copiar
                </Button>
              </DialogTrigger>
              {selectedType === 'socio' && (
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    className="h-12 w-48 rounded-md"
                    onClick={() => setSummaryIsOpen(true)}
                  >
                    Resumen plan
                  </Button>
                </DialogTrigger>
              )}
              {createIsOpen && (
                <CreatePlan
                  open={createIsOpen}
                  onClose={() => setCreateIsOpen(false)}
                  partnerId={idSocio}
                  setPlan={setPlan}
                />
              )}
              {copyIsOpen && (
                <CopyPlan
                  open={copyIsOpen}
                  onClose={() => setCopyIsOpen(false)}
                  plan={plan!}
                  setPartner={setPartner}
                  setPlan={setPlan}
                />
              )}
              {updateIsOpen && (
                <UpdatePlan
                  open={updateIsOpen}
                  onClose={() => setUpdateIsOpen(false)}
                  plan={plan!}
                />
              )}
              {deleteIsOpen && (
                <DeletePlan
                  id={plan?.idPlan}
                  open={deleteIsOpen}
                  onClose={() => setDeleteIsOpen(false)}
                  idPartner={plan?.idSocio}
                />
              )}
              {summaryIsOpen && plan && (
                <PlanSummary
                  open={summaryIsOpen}
                  onClose={() => setSummaryIsOpen(false)}
                  plan={plan}
                />
              )}
            </Dialog>
          </div>
        </div>
        <Separator className="my-5" />
        {plan && (
          <TableRoutines id={plan?.idPlan} semanas={plan.semanas} selectedType={selectedType} />
        )}
      </>
    )
  } else {
    return null
  }
}
