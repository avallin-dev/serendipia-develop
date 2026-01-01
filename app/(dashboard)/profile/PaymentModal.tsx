'use client'
import {CardPayment, initMercadoPago} from '@mercadopago/sdk-react'
import {toast} from "sonner";
import {useRouter} from 'next/navigation';
import {useUpdatePartnerMembership} from "@/app/services/mutations/partner";
import {useCreatePayMembership, useUpdatePayMembership} from "@/app/services/mutations/membership";
import {useQueryClient} from "@tanstack/react-query";
import {DataUser, Membership} from "@/app/types/payments";
import {ICardPaymentBrickPayer, ICardPaymentFormData } from "@mercadopago/sdk-react/esm/bricks/cardPayment/type";


/** eliminar el public key de aqui no es buena practica */
initMercadoPago('APP_USR-6e3b8e37-94b2-4002-9272-a203adbf8de8');

export default function PaymentModal({onClose, amount, membershipData, dataUser}: {
    onClose: () => void;
    amount: number,
    dataUser: DataUser,
    membershipData: Membership,
}) {
    const initialization = {
        amount: amount,
        payer: {
            email: dataUser.socioEmail,
            name: dataUser.socioNombre,
        },
    }
    const router = useRouter();

    const updatePartnerMembershipMutation = useUpdatePartnerMembership()
    const createPayMembershipMutation = useCreatePayMembership()
    const updatePayMembershipMutation = useUpdatePayMembership()
    const queryClient = useQueryClient()

    const customization = {
        visual: {
            style: {
                theme: 'bootstrap', // | 'dark' | 'bootstrap' | 'flat'
                customVariables: {},
            },
        }
    };

    const onSubmit = async (formData: ICardPaymentFormData<ICardPaymentBrickPayer>) => {
        const res = await fetch('/api/mercadopago/process-payment', {
            method: 'POST',
            body: JSON.stringify(formData),
        })

        const data = await res.json()

        if (data.status !== 'approved') {
            toast.error('El pago no fue aprobado, compruebe los datos ingresados')
            return
        } else {
            /** Actualizar esado de la membresia */
            toast.promise(UpdatePartnerMembership(), {
                success: 'Membresía actualizada',
                error: 'Error al actualizar la membresía'
            })

            return data
        }
    }

    async function UpdatePartnerMembership() {
        const id = dataUser.idSocioMembresia
        const currentDate = new Date(Date.now())
        const day = currentDate.toISOString().split('T')[0].split('-')[2];
        const month = currentDate.getUTCMonth();
        const year = currentDate.getFullYear();
        let expirationDate = new Date(year, month + 1, Number(day));
        if (month == 11) {
            expirationDate = new Date(year + 1, 0, Number(day));
        }

        // Primero actualizar membresía
        updatePartnerMembershipMutation.mutate(
            {
                data: {
                    idMembresia: membershipData.idMembresia,
                    fechaInicioMembresia: currentDate,
                    Vencimiento: expirationDate,
                },
                id: id!,
            },
            {
                async onSuccess() {
                    if (id) {
                        updatePayMembershipMutation.mutate(
                            {
                                data: {
                                    observacion: 'Pago con tarjeta',
                                    importe: amount,
                                    idSocioMembresia: id!,
                                },
                                idSocioMembresia: id!,
                            },
                            {
                                onSuccess() {
                                    queryClient.invalidateQueries({
                                        queryKey: ['partner-membership', dataUser.idSocio?.toString()],
                                    })

                                    setTimeout(() => {
                                        onClose()
                                        router.push('/memberships');
                                    }, 2000);
                                },
                                onError(error) {
                                    console.error(error)
                                },
                            }
                        )
                    } else {
                        createPayMembershipMutation.mutate(
                            {
                                data: {
                                    observacion: 'Nueva membresía',
                                    importe: amount,
                                    idSocioMembresia: id!,
                                },
                                id: dataUser.idSocio!,
                            },
                            {
                                onSuccess() {
                                    queryClient.invalidateQueries({
                                        queryKey: ['partner-membership', dataUser?.idSocio?.toString()],
                                    })
                                    setTimeout(() => {
                                        onClose()
                                        router.push('/memberships');
                                    }, 2000);
                                },
                                onError(error) {
                                    console.error(error)
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
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-md rounded-2xl bg-white p-6">
                <div className="mb-4 flex justify-between">
                    <h2 className="text-lg font-semibold">Pago con tarjeta</h2>
                    <button onClick={onClose}>✕</button>
                </div>


                <CardPayment
                    initialization={initialization}
                    customization={customization}
                    onSubmit={onSubmit}
                    onReady={() => console.log('Brick listo')}
                    onError={(e) => console.error(e)}
                />
            </div>
        </div>
    )
}