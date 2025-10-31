import { FC, ReactElement, useCallback, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import CustomButton from './CustomButton'
import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

interface ModalWrapperProps {
  isOpen: boolean
  isLoading?: boolean
  onClose: () => void
  onSubmit?: () => void
  onDelete?: () => void
  title?: string
  description?: string
  body?: ReactElement
  actionLabel?: string
  disabled?: boolean
  hideFooter?: boolean
  isDelete?: boolean
  className?: string
}

const ModalWrapper: FC<ModalWrapperProps> = ({
  isOpen,
  onClose,
  isLoading,
  onSubmit,
  onDelete,
  title,
  description,
  body,
  actionLabel,
  disabled,
  hideFooter,
  isDelete,
  className,
}) => {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setShowModal(isOpen)
  }, [isOpen])

  const handleClose = useCallback(() => {
    setShowModal(false)
    onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, onClose])

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return
    }

    onSubmit && onSubmit()
  }, [disabled, onSubmit])

  const handleDelete = useCallback(() => {
    if (disabled) {
      return
    }

    onDelete && onDelete()
  }, [disabled, onDelete])

  if (!isOpen) {
    return null
  }

  return (
    <Dialog open={showModal} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          'scrollbar max-h-[calc(100%-20px)] overflow-y-auto sm:max-w-[750px]',
          className
        )}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {body}
        {!hideFooter && (
          <DialogFooter className="mt-4 gap-y-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            {onDelete && (
              <CustomButton
                variant="destructive"
                disabled={disabled}
                label="Eliminar"
                onClick={handleDelete}
                isLoading={isLoading}
              />
            )}
            {actionLabel && (
              <CustomButton
                variant={isDelete ? 'destructive' : 'default'}
                disabled={disabled}
                label={actionLabel}
                onClick={handleSubmit}
                isLoading={isLoading}
              />
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ModalWrapper
