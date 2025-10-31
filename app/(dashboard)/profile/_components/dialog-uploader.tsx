'use client'

import { ReactNode, useEffect, useState } from 'react'

import { createPartnerAddon } from '@/app/actions'
import { FileUploader } from '@/components/file-uploader'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useUploadFile } from '@/hooks/use-upload-file'

export function DialogUploader({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { uploadFiles, uploadSuccess, isUploading, fileURL } = useUploadFile('pa_certif')
  useEffect(() => {
    async function postOnChange() {
      setOpen(false)
      await createPartnerAddon(fileURL)
    }
    if (uploadSuccess) {
      postOnChange()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadSuccess])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="h-12 gap-x-3 rounded-md">
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Subir archivo PDF</DialogTitle>
          <DialogDescription>
            Arrastre y suelte sus archivos aquí o haga clic para examinarlos.
          </DialogDescription>
        </DialogHeader>
        <FileUploader
          maxFiles={1}
          accept={{ 'application/pdf': ['.pdf'] }}
          maxSize={8 * 1024 * 1024}
          onUpload={uploadFiles}
          disabled={isUploading}
        />
      </DialogContent>
    </Dialog>
  )
}
