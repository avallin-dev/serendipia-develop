'use client'

import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

import { updateImageProfile } from '@/app/actions/partner'
import { FileUploader } from '@/components/file-uploader'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useUploadFile } from '@/hooks/use-upload-file'
export function DialogImageProfile({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { uploadFiles, uploadSuccess, isUploading, fileURL } = useUploadFile('profile_img')
  useEffect(() => {
    async function postOnChange() {
      setOpen(false)
      await updateImageProfile(fileURL)
    }
    if (uploadSuccess) {
      postOnChange()
      router.refresh()
      const storedData = localStorage.getItem('user')

      if (storedData) {
        const socio = JSON.parse(storedData)
        socio.image_profile = fileURL
        localStorage.setItem('user', JSON.stringify(socio))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadSuccess])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Subir imagen de perfil</DialogTitle>
          <DialogDescription>
            Arrastre y suelte su imagen aquí o haga clic para examinarlos.
          </DialogDescription>
        </DialogHeader>
        <FileUploader
          maxFiles={1}
          accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
          maxSize={8 * 1024 * 1024}
          onUpload={uploadFiles}
          disabled={isUploading}
        />
      </DialogContent>
    </Dialog>
  )
}
