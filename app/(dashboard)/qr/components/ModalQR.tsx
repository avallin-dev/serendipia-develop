'use client'

import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'

import { getSocioQR } from '@/app/actions'
import { useAuth } from '@/app/hooks/useAuth'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'

export default function ModalQR({ qr }: { qr?: string }) {
  const { user } = useAuth()
  const id = user?.idSocio
  const [qrPass, setQR] = useState<string | null | undefined>()

  useEffect(() => {
    async function fetch() {
      const data = await getSocioQR(id!)
      setQR(data!)
    }
    if (qr) {
      setQR(qr)
    } else {
      fetch()
    }
  }, [id, qr])
  if (qrPass) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative mx-auto aspect-square w-60 cursor-pointer md:w-80">
            <QRCode
              size={256}
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              value={qrPass}
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
              value={qrPass}
              viewBox={`0 0 256 256`}
            />
          </DialogClose>
        </DialogContent>
      </Dialog>
    )
  }
}
