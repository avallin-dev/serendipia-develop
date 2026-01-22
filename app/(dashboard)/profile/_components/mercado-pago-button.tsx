    'use client'

import React from 'react'
import {useMercadoPagoPreferenceMutation} from '@/app/services/mutations/mercado-pago'
import {MembresiaUpdate} from '@/app/types/monitor'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import PaymentButton from "@/app/(dashboard)/profile/_components/paymentButton";
import {DataUser, Membership} from "@/app/types/payments";
import {usePartnerWithPilates} from "@/app/services/queries/partner";

interface MercadoPagoButtonProps {
    idSocio: number
    idSocioMembresia: number
    nombreMembresia: string,
    idMembresia: number,
    monto: number
    socioNombre: string
    socioEmail: string,
    membresias: MembresiaUpdate[]
}

export default function MercadoPagoButton({
                                              idSocio,
                                              idSocioMembresia,
                                              nombreMembresia,
                                              monto,
                                              socioNombre,
                                              socioEmail,
                                              membresias,
                                              idMembresia,
                                          }: MercadoPagoButtonProps) {
    const mercadoPagoPreferenceMutation = useMercadoPagoPreferenceMutation()

    const [value, setValue] = React.useState(nombreMembresia)
    const [dataMembership, setDataMembership] = React.useState<Membership>({
        nombreMembresia,
        monto,
        idMembresia
    })

    const dataUser: DataUser = {
        idSocio: idSocio,
        idSocioMembresia: idSocioMembresia,
        nombreMembresia: nombreMembresia,
        monto: monto,
        socioNombre: socioNombre,
        socioEmail: socioEmail,
    }

    console.log(dataUser.idSocio)
    const { partners } = usePartnerWithPilates()
    const  t = partners.filter(p=> p.idSocio == dataUser.idSocio)
    console.log(t)

    const handlePay = () => {
        nombreMembresia = dataMembership.nombreMembresia
        monto = dataMembership.monto

        mercadoPagoPreferenceMutation.mutate(
            {
                idSocio,
                idSocioMembresia,
                nombreMembresia,
                monto,
                socioNombre,
                socioEmail,
            },
            {
                onSuccess: (data) => {
                    if (data?.url) {
                        window.location.href = data.url
                    }
                },
                onError: () => {
                    alert('Error al iniciar el pago. Intenta nuevamente.')
                },
            },
        )
    }

    function setData(index) {
        setValue(index)
        const dataMembresia = membresias.filter((membresia) => membresia.Nombre == index)[0]
        dataMembership.monto = dataMembresia.Precio
        dataMembership.idMembresia = dataMembresia.idMembresia
        if (dataMembresia?.Nombre != null) {
            dataMembership.nombreMembresia = dataMembresia?.Nombre
        }
        setDataMembership(dataMembership)
        return
    }

    return (
        <>
            {/*Seleccione la nueva membresia a la que se quiere subscribir*/}
            <div className="h-5"></div>
            <div className="flex flex-col justify-center items-center gap-x-2">
                <div className="text-center font-medium text-secondary-dark">Seleccione la nueva
                    membresía o renueve la actual
                </div>

                <Select defaultValue={nombreMembresia} value={value} onValueChange={setData}>
                    <SelectTrigger className="md:w-[95%] lg:w-[90%] 2xl:w-[65%]">
                        <SelectValue placeholder="Seleccione su membresía"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Seleccione su memebresía</SelectLabel>
                            {membresias.map((membership, index) => (
                                <SelectItem
                                    value={membership.Nombre !== null ? membership.Nombre : ''}
                                    key={index}>
                                    {membership.Nombre} - <b>{Number(membership.Precio)}/mes</b>
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="h-5"></div>
            {/*<Button*/}
            {/*  type="button"*/}
            {/*  className="mt-4 w-full rounded bg-[#009ee3] py-3 font-bold text-white transition-colors hover:bg-[#0077b6]"*/}
            {/*  onClick={handlePay}*/}
            {/*  disabled={mercadoPagoPreferenceMutation.isPending}*/}
            {/*>*/}
            {/*    */}
            {/*  {mercadoPagoPreferenceMutation.isPending ? 'Redirigiendo...' : 'Pagar con Mercado Pago'}*/}
            {/*</Button>*/}

            <PaymentButton amount={dataMembership.monto} dataUser={dataUser}
                           membershipData={dataMembership}/>
        </>
    )
}
