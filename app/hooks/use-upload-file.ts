'use client'

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { getSignedURL } from '@/lib/s3'
export function useUploadFile(prefix: string) {
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [fileURL, setFileURL] = useState('')

  const R2_DOMAIN = process.env.NEXT_PUBLIC_R2_DOMAIN || ''

  async function uploadFiles(files: File[]) {
    setIsUploading(true)
    const key = `${prefix}_${uuidv4()}`
    try {
      const signedURLResult = await getSignedURL(key)
      if (signedURLResult.failure !== undefined) {
        console.error(signedURLResult.failure)
        return
      }
      const { url } = signedURLResult.success
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': files[0].type,
        },
        body: files[0],
      })
      setFileURL(`${R2_DOMAIN}${key}`)
      setUploadSuccess(true)
    } catch (err) {
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  return {
    uploadFiles,
    fileURL,
    isUploading,
    uploadSuccess,
  }
}
