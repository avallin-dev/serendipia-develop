'use server'

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const Bucket = process.env.R2_BUCKET_NAME || ''
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || ''
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || ''
const R2_SECRET_KEY_ID = process.env.R2_SECRET_KEY_ID || ''

type SignedURLResponse = Promise<
  { failure?: undefined; success: { url: string } } | { failure: string; success?: undefined }
>

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_KEY_ID,
  },
})

export async function getSignedURL(key: string): SignedURLResponse {
  const putObjectCommand = new PutObjectCommand({
    Bucket: Bucket!,
    Key: key,
  })

  const url = await getSignedUrl(s3, putObjectCommand, { expiresIn: 60 })

  return { success: { url } }
}
