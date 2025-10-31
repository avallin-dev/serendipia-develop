'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export const useConfirm = (
  title: string,
  message: string
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void
  } | null>(null)

  const confirm = () => new Promise((resolve, _) => setPromise({ resolve }))

  const handleClose = () => {
    setPromise(null)
  }

  const handleConfirm = () => {
    promise?.resolve(true)
    handleClose()
  }

  const handleCancel = () => {
    promise?.resolve(false)
    handleClose()
  }

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{message}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2 flex flex-col-reverse items-center gap-y-2 space-y-2 md:flex-row md:space-y-0">
          <Button
            className="w-52 max-w-none md:w-full md:max-w-max"
            variant="outline"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button className="w-52 max-w-none md:w-full md:max-w-max" onClick={handleConfirm}>
            {title}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return [ConfirmationDialog, confirm]
}

export default useConfirm
