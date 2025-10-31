'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export function ReminderModal() {
  const [isOpen, setIsOpen] = useState(true)

  async function handleEnabled(): Promise<void> {
    setIsOpen(!isOpen)
  }

  return (
    <Dialog open={isOpen} onOpenChange={_ => {
      handleEnabled().then()
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle
            className="text-center text-2xl font-bold bg-gradient-to-r from-yellow-600 via-red-500 to-indigo-400 inline-block text-transparent bg-clip-text">
            ¡IMPORTANTE!
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500"></DialogDescription>
          <div className="text-center text-base">
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground">Recuerda presionar el botón </p>
              <Button
                size="lg"
                className="mx-auto flex h-14 w-44 flex-wrap rounded-sm py-0 px-1 text-xs uppercase sm:h-10 font-bold"
              >
                FINALIZAR ENTRENAMIENTO
              </Button>
              <p className="text-sm text-muted-foreground">Al finalizar cada entrenamiento</p>
              <p className="text-sm text-muted-foreground">
                Es muy importante para seguir tu progreso y realizar los cambios de planes
              </p>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
