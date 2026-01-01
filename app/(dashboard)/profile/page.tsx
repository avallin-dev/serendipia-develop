import type {socio} from '@prisma/client'
import {differenceInYears, format, isBefore} from 'date-fns'
import {es} from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'
import {MdCreate, MdEmail, MdFeed, MdLocalPhone, MdOutlineContentPaste} from 'react-icons/md'

import {getSessionSocio} from '@/app/actions'
import {getActivePlan} from '@/app/actions/plan'
import {Button} from '@/app/components/ui/button'
import prisma from '@/app/config/db/prisma'
import EditableInput from '@/components/EditableInput'

import {DialogImageProfile, DialogUploader, OpenImage} from './_components'
import MercadoPagoButton from './_components/mercado-pago-button'
import MercadoPagoStatusHandler from './MercadoPagoStatusHandler'

export default async function Page() {
    const {
        correo,
        idSocio: id,
        Nombre: name,
        DNI: dni,
        Paterno: last_name,
        Telefono: phone,
        Observaciones: review,
        fechaNacimiento: born_date,
        image_profile,
    }: socio = await getSessionSocio()

    const email = correo?.toLocaleLowerCase()
    let age: number | undefined
    if (born_date) {
        age = differenceInYears(new Date(), born_date)
    }
    const memberships = await prisma.sociomembresia.findFirst({
        where: {
            idSocio: id,
        },
        orderBy: {fechaCreacion: 'desc'},
        include: {
            membresia: true,
        },
    })

    const allmemberships = await prisma.membresia.findMany()

    const sample = await prisma.socio_muestra.findFirst({
        where: {
            idSocio: id,
        },
        orderBy: {fechaMuestra: 'desc'},
    })

    const plan = await getActivePlan(id)

    return (
        <>

            <MercadoPagoStatusHandler/>
            <div className="relative">
                <div
                    className="grid grid-cols-2 grid-rows-2 gap-x-3 gap-y-3 lg:grid-cols-profile ">
                    <div
                        className="border-gallery-100 col-span-2 row-span-2 rounded-lg border bg-white px-2 py-4 lg:col-span-1 xl:px-6">
                        <div className="relative mx-auto mb-3 h-28 w-28 rounded-full bg-secondary ">
                            <OpenImage src={image_profile} disabled={image_profile ? false : true}>
                                <Image
                                    src={image_profile ?? '/images/Logo_2.png'}
                                    alt=""
                                    priority
                                    sizes="100%"
                                    fill
                                    style={{objectFit: `${image_profile ? 'cover' : 'contain'}`}}
                                    className={`rounded-full ${image_profile ? 'p-1' : 'p-5 pt-7'}`}
                                />
                            </OpenImage>
                            <DialogImageProfile>
                                <MdCreate
                                    size={30}
                                    className="absolute bottom-0 right-1 cursor-pointer rounded-full border-2 bg-white p-1 text-slate-600"
                                />
                            </DialogImageProfile>
                        </div>
                        <div>
                            <div className="mb-1 text-center text-xl font-medium">
                                {name} {last_name}
                            </div>
                            <div
                                className="text-center text-sm font-light text-secondary-dark">DNI: {dni}</div>
                            <div className="h-5"></div>
                            {plan?.usuario?.Telefono && (
                                <>
                                    <div className="mb-2 text-center text-sm">
                                        ¿Tenes dudas sobre algún ejercicio o comentarios sobre el
                                        plan de entrenamiento?
                                    </div>
                                    <Link
                                        target="_blank"
                                        href={`https://wa.me/${plan?.usuario?.Telefono}`}
                                        rel="noopener noreferrer"
                                    >
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            className="h-14 w-full gap-x-2 rounded-lg xl:gap-x-4"
                                        >
                                            <MdLocalPhone size={24} className="flex-shrink-0"/>
                                            <span className="text-white xl:text-lg">
                        Enviar un WhatsApp a tu entrenador{' '}
                      </span>
                                        </Button>
                                    </Link>
                                </>
                            )}
                            <div className="mt-8 space-y-5">
                                <div className="flex items-center gap-x-2">
                                    <MdEmail size={20}/>
                                    <EditableInput
                                        value={email || ''}
                                        type="text"
                                        partnerKey="correo"
                                        partnerId={id}
                                        className="truncate"
                                    />
                                </div>
                                <div className="flex items-center gap-x-2">
                                    <MdLocalPhone size={20}/>
                                    <EditableInput
                                        value={phone || ''}
                                        type="text"
                                        partnerKey="Telefono"
                                        partnerId={id}
                                        className="truncate"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="border-gallery-100 col-span-2 space-y-6 rounded-lg border bg-white px-5 pt-5 sm:col-auto">
                        <div className="flex items-center gap-x-5">
                            <Image src="/images/icons/peso_icon.png" alt="" width={26} height={26}/>
                            <div>
                                <p className="font-medium	text-black">Peso actual</p>
                                <p className="text-sm text-[#ACACAC]">{sample?.peso?.toString()} KG</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-x-5">
                            <Image src="/images/icons/altura_icon.png" alt="" width={26}
                                   height={26}/>
                            <div>
                                <p className="font-medium	text-black">Altura / medida</p>
                                <p className="text-sm text-[#ACACAC]">{sample?.estatura?.toString()} KG</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-x-5">
                            <Image src="/images/icons/edad_icon.png" alt="" width={26} height={26}/>
                            <div>
                                <p className="font-medium	text-black">Edad</p>
                                <p className="text-sm text-[#ACACAC]">{age} años</p>
                            </div>
                        </div>
                    </div>
                    <div
                        className="border-gallery-100 col-span-2 rounded-lg border bg-white px-5 py-2 sm:col-auto">
                        {memberships ? (
                            <>
                                <div className="text-center text-xl font-semibold">
                                    {memberships?.membresia?.Nombre}
                                </div>
                                <div className="text-center font-light text-[#6A6A6A]">Membresia
                                    actual
                                </div>
                                <div className="h-3"></div>
                                <div className="text-center text-2xl font-bold">
                                    ARS {memberships?.Precio?.toString()}{' '}
                                    <span className="text-sm font-light">/mes</span>
                                </div>
                                <div className="h-5"></div>
                                <div
                                    className="mx-auto flex h-8 w-fit px-4 items-center justify-center rounded bg-gradient-to-bl from-amber-800 to-slate-600 text-sm font-medium text-white">
                                    Membresía {memberships?.estadoMembresia}
                                </div>
                                <MercadoPagoButton
                                    idSocio={id}
                                    idSocioMembresia={memberships.idSocioMembresia}
                                    nombreMembresia={memberships.membresia?.Nombre || 'Membresía'}
                                    idMembresia={memberships.membresia?.idMembresia || 0}
                                    monto={Number(memberships.Precio)}
                                    socioNombre={name || ''}
                                    socioEmail={email || ''}
                                    membresias={allmemberships}
                                />
                                <div className="h-3"></div>

                                <div className="h-3"></div>

                                <div
                                    className=" flex justify-center text-center text-2xl font-bold bg-gradient-to-r from-red-600 via-black to-indigo-400 text-transparent bg-clip-text">
                                    {memberships?.Vencimiento
                                        ? isBefore(new Date(), memberships.Vencimiento)
                                            ? `Vence el ${format(memberships.Vencimiento, 'dd \'de\' MMMM', {
                                                locale: es,
                                            })}`
                                            : `Vencida el ${format(memberships.Vencimiento, 'dd \'de\' MMMM', {
                                                locale: es,
                                            })}`
                                        : null}
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-xl font-semibold">No hay
                                membresia</div>
                        )}
                    </div>

                    <div
                        className="border-gallery-100 col-span-2 rounded-lg border bg-white px-5 py-8">
                        <h2 className="mb-2 font-medium text-secondary-dark">Mi reseña</h2>
                        <EditableInput
                            value={review || ''}
                            type="textarea"
                            className="text-sm text-secondary-dark opacity-50"
                            partnerKey="Observaciones"
                            partnerId={id}
                        />
                    </div>

                    <div className={'flex flex-row gap-2'}>
                        <div
                            className="border-gallery-100 col-span-2 flex items-center gap-x-2 rounded-lg border bg-white p-4 pr-6 xl:col-span-1">
                            <div
                                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                                <MdFeed size={24} color="#0B0E26"/>
                            </div>
                            <DialogUploader>
                                Certificado de aptitud física
                                <MdOutlineContentPaste size={17}/>
                            </DialogUploader>
                        </div>
                        <div
                            className="border-gallery-100 col-span-2 flex items-center gap-x-2 rounded-lg border bg-white p-4 pr-6 xl:col-span-1 xl:col-start-1">
                            <div
                                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                                <MdFeed size={24} color="#0B0E26"/>
                            </div>
                            <Link href="/qr">
                                <Button variant="secondary" className="h-12 gap-x-3 rounded-md">
                                    <p className="uppercase text-white">Mostrar QR de socio</p>
                                </Button>
                            </Link>
                        </div>
                    </div>


                </div>
            </div>
        </>
    )
}
