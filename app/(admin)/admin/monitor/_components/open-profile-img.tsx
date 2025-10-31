'use client'

import Image from 'next/image'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  src: string
}

export function OpenImage({ src, onClose, isOpen }: FilterModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="aspect-square border-0 bg-transparent sm:max-w-[768px]">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogClose asChild className="absolute inset-0 z-10 h-full w-full">
          <Image
            src={src}
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
