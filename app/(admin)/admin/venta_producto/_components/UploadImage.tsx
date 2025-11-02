'use client' // This component must be a client component

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from '@imagekit/next'
import * as React from 'react'
import { useState } from 'react'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/shadcn-io/dropzone'
import { Progress } from '@/components/ui/progress'

// UploadImage component demonstrates file uploading using ImageKit's Next.js SDK.
const UploadImage = () => {
  // State to keep track of the current upload progress (percentage)
  const [progress, setProgress] = useState(0)

  // Create a ref for the file input element to access its files easily
  // const fileInputRef = useRef<HTMLInputElement>(null)

  // Create an AbortController instance to provide an option to cancel the upload if needed.
  const abortController = new AbortController()

  /**
   * Authenticates and retrieves the necessary upload credentials from the server.
   *
   * This function calls the authentication API endpoint to receive upload parameters like signature,
   * expire time, token, and publicKey.
   *
   * @returns {Promise<{signature: string, expire: string, token: string, publicKey: string}>} The authentication parameters.
   * @throws {Error} Throws an error if the authentication request fails.
   */
  const authenticator = async () => {
    try {
      // Perform the request to the upload authentication endpoint.
      const response = await fetch('/api/upload-auth')
      if (!response.ok) {
        // If the server response is not successful, extract the error text for debugging.
        const errorText = await response.text()
        throw new Error(`Request failed with status ${response.status}: ${errorText}`)
      }

      // Parse and destructure the response JSON for upload credentials.
      const data = await response.json()
      const { signature, expire, token, publicKey } = data
      return { signature, expire, token, publicKey }
    } catch (error) {
      // Log the original error for debugging before rethrowing a new error.
      console.error('Authentication error:', error)
      throw new Error('Authentication request failed')
    }
  }

  /**
   * Handles the file upload process.
   *
   * This function:
   * - Validates file selection.
   * - Retrieves upload authentication credentials.
   * - Initiates the file upload via the ImageKit SDK.
   * - Updates the upload progress.
   * - Catches and processes errors accordingly.
   */
  const handleUpload = async (files: File[]) => {
    const file = files[0]
    // Retrieve authentication parameters for the upload.
    let authParams
    try {
      authParams = await authenticator()
      console.log(authParams)
    } catch (authError) {
      console.error('Failed to authenticate for upload:', authError)
      return
    }
    const { signature, expire, token, publicKey } = authParams

    // Call the ImageKit SDK upload function with the required parameters and callbacks.
    if (token) {
      try {
        const uploadResponse = await upload({
          // Authentication parameters
          expire,
          token,
          signature,
          publicKey,
          file,
          fileName: file.name, // Optionally set a custom file name
          // Progress callback to update upload progress state
          onProgress: (event) => {
            setProgress((event.loaded / event.total) * 100)
          },
          // Abort signal to allow cancellation of the upload if needed.
          abortSignal: abortController.signal,
        })

        setFiles(files)
        if (files.length > 0) {
          const reader = new FileReader()
          reader.onload = (e) => {
            if (typeof e.target?.result === 'string') {
              setFilePreview(e.target?.result)
            }
          }
          reader.readAsDataURL(files[0])
        }
        localStorage.setItem('upload-file', JSON.stringify(uploadResponse.fileId).replaceAll('"', '').trim())
        localStorage.setItem('upload-filePath', JSON.stringify(uploadResponse.filePath).replaceAll('"', '').trim())
      } catch (error) {
        // Handle specific error types provided by the ImageKit SDK.
        if (error instanceof ImageKitAbortError) {
          console.error('Upload aborted:', error.reason)
        } else if (error instanceof ImageKitInvalidRequestError) {
          console.error('Invalid request:', error.message)
        } else if (error instanceof ImageKitUploadNetworkError) {
          console.error('Network error:', error.message)
        } else if (error instanceof ImageKitServerError) {
          console.error('Server error:', error.message)
        } else {
          // Handle any other errors that may occur.
          console.error('Upload error:', error)
        }
      }
    }

  }


  const [files, setFiles] = useState<File[] | undefined>()
  const [filePreview, setFilePreview] = useState<string | undefined>()

  return (
    <>
      <Dropzone
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
        onDrop={handleUpload}
        onError={console.error}
        src={files}
      >
        <DropzoneEmptyState />
        <DropzoneContent>
          {filePreview && (
            <div className="h-[200px] w-full">
              <img
                alt="Preview"
                className="absolute top-0 left-0 w-full object-center"
                src={filePreview}
              />
            </div>
          )}
        </DropzoneContent>
      </Dropzone>
      <div className={'mt-4'}>
        <Progress className={'bg-primary-foreground'} value={progress} />
        <div className={'mt-4 flex justify-center font-light italic'}>
          {progress === 100 ? 'Archivo subido con éxito' : 'Sea paciente, espere hasta que se muestre el archivo'}
        </div>

      </div>

    </>
  )
}

export default UploadImage


