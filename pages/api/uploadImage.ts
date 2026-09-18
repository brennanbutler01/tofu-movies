import { withVisitorGuard } from 'server/visitor'
import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import formidable, { File } from 'formidable'
import { v2 as cloudinary } from 'cloudinary'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'

export const config = { api: { bodyParser: false } }
export type ImageReturn = { status: 'fail' | 'ok'; message: string }

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST')
        return res
            .status(405)
            .json({ status: 'fail', message: 'Method not allowed.' })
    if (!(await getServerSession(req, res, authOptions))?.user?.userId)
        return res
            .status(401)
            .json({ status: 'fail', message: 'Please sign in.' })
    if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
    )
        return res.status(503).json({
            status: 'fail',
            message: 'Image uploads are not configured.',
        })
    const temporaryPaths: string[] = []
    try {
        const files = await new Promise<File[]>((resolve, reject) => {
            const uploaded: File[] = []
            const form = new formidable.IncomingForm({
                maxFileSize: 5 * 1024 * 1024,
                maxTotalFileSize: 5 * 1024 * 1024,
                maxFiles: 1,
                maxFields: 5,
                multiples: false,
            })
            form.on('fileBegin', (_field, file) =>
                temporaryPaths.push(file.filepath)
            )
            form.on('file', (_field, file) => uploaded.push(file))
            form.parse(req, error =>
                error ? reject(error) : resolve(uploaded)
            )
        })
        if (
            files.length !== 1 ||
            !['image/jpeg', 'image/png', 'image/webp'].includes(
                files[0].mimetype || ''
            )
        )
            return res.status(400).json({
                status: 'fail',
                message: 'Choose one JPEG, PNG or WebP image.',
            })
        // Use the parser-generated path, never a filename supplied by the visitor.
        const result = await cloudinary.uploader.upload(files[0].filepath, {
            resource_type: 'image',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            format: 'webp',
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        })
        return res
            .status(200)
            .json({ status: 'ok', message: result.secure_url })
    } catch {
        return res.status(400).json({
            status: 'fail',
            message: 'Could not upload that image. Maximum size is 5 MB.',
        })
    } finally {
        await Promise.all(
            temporaryPaths.map(path => fs.rm(path, { force: true }))
        )
    }
}

export default withVisitorGuard(handler)
