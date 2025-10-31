import Image from 'next/image'
import Link from 'next/link'
import QRCode from 'react-qr-code'

import { Button } from '@/app/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'

import Background from '/public/images/Background.jpg'
import Logo from '/public/images/logo-back.png'

import { typeMembership } from './actions/partner'
export default async function Home() {
  const typeMembershipPartner = await typeMembership()
  const clave = typeMembershipPartner?.socio?.clave ?? '0'
  const hasPlan = typeMembershipPartner?.socio?.idPlan
  return (
    <main className="relative flex min-h-screen flex-col bg-black">
      <Image
        alt="Stretch"
        src={Background}
        placeholder="blur"
        quality={100}
        fill
        sizes="100vw"
        className="pointer-events-none select-none object-cover object-[center_20%] opacity-35 blur-sm"
      />
      <div className="absolute inset-0 h-full w-full bg-white/80"></div>
      <div className="relative flex flex-grow flex-col items-center justify-center gap-y-9 px-5 py-10 md:px-24 md:py-24">
        <Image
          src={Logo}
          alt="Logo"
          quality={100}
          className="pointer-events-none relative w-full max-w-xs select-none object-contain"
        />
        <h2 className="text-center text-6xl font-extrabold text-black">Bienvenido</h2>
        {clave !== '0' && (
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative mx-auto aspect-square w-60 cursor-pointer border border-primary-foreground md:w-80">
                <QRCode
                  size={256}
                  style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                  value={clave}
                  viewBox={`0 0 256 256`}
                />
              </div>
            </DialogTrigger>
            <DialogContent className="aspect-square sm:max-w-[768px]">
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <DialogClose asChild className="absolute inset-0 z-10 h-full w-full">
                <QRCode
                  size={256}
                  style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                  className="p-5"
                  value={clave}
                  viewBox={`0 0 256 256`}
                />
              </DialogClose>
            </DialogContent>
          </Dialog>
        )}
        <div className="flex max-w-96 flex-wrap justify-center gap-4 md:max-w-max">
          {typeMembershipPartner?.membresia?.Nombre?.includes('PILATES') && (
            <Link href="/pilates">
              <Button
                variant="secondary"
                className="w-72 max-w-none rounded-full bg-[#e1005f] uppercase hover:bg-[#b0044a] md:w-full md:max-w-max"
                size="lg"
              >
                <span className="text-lg font-bold tracking-wide text-white drop-shadow-lg">
                  Pilates
                </span>
              </Button>
            </Link>
          )}
          <Link href={hasPlan ? '/routines' : '/boards'}>
            <Button
              variant="secondary"
              className="w-72 max-w-none rounded-full bg-gray-500 text-lg font-bold uppercase md:w-full md:max-w-max "
              size="lg"
            >
              <span className="text-white drop-shadow-lg">Sala de entrenamiento</span>
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
