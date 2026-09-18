import { z } from 'zod'
const UploadResult = z.object({
    message: z
        .string()
        .url()
        .refine(url => new URL(url).protocol === 'https:'),
})
export async function uploadImage(file: File) {
    const data = new FormData()
    data.append('file', file)
    const response = await fetch('/api/uploadImage', {
        method: 'POST',
        body: data,
    })
    if (!response.ok) throw new Error('Image upload failed')
    return UploadResult.parse(await response.json()).message
}
