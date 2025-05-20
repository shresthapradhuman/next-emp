'use server'
import { v2 as cloudinary } from 'cloudinary'
import { writeFile } from 'fs/promises'
import path from 'path'
import os from 'os'
import fs from 'fs'
import config from './config'

cloudinary.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.key,
  api_secret: config.cloudinary.secret,
})

export async function uploadImageAction(
  folderName: string,
  formData: FormData,
) {
  const file = formData.get('file') as File
  if (!file) return { error: 'No file uploaded' }
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const tempFilePath = path.join(os.tmpdir(), file.name)
  await writeFile(tempFilePath, buffer)
  try {
    const result = await cloudinary.uploader.upload(tempFilePath, {
      resource_type: 'image',
      folder: folderName,
    })
    fs.unlinkSync(tempFilePath)

    return {
      success: true,
      message: 'Upload Successfully',
      url: result.secure_url,
    }
  } catch (error) {
    console.log(error)
    return { success: false, error: 'Upload failed' }
  }
}
