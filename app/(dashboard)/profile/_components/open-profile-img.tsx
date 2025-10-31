'use client'

import { DialogTrigger } from '@radix-ui/react-dialog'
import Image from 'next/image'
import { ReactNode, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'

interface FilterModalProps {
  src: string | null
  children: ReactNode
  disabled: boolean
}

export function OpenImage({ children, src, disabled }: FilterModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={disabled} className={`${disabled && 'pointer-events-none'}`}>
        {children}
      </DialogTrigger>
      <DialogContent className="aspect-square border-0 bg-transparent sm:max-w-[768px]">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogClose asChild className="absolute inset-0 z-10 h-full w-full">
          <Image
            src={src || ''}
            alt=""
            priority
            sizes="100%"
            fill
            style={{ objectFit: 'contain' }}
            className="absolute w-full object-contain"
          />
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
