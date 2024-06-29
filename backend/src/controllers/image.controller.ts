import { Request, Response } from 'express'
import {
    uploadImageService,
    analyzeImageService,
    getHistoryService,
    getEntryDetailsService,
} from 'services/image.service'
import multer, { diskStorage } from 'multer'
import fs from 'fs'

const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '_' + Date.now())
    },
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == 'image/png' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/jpeg'
        ) {
            cb(null, true)
        } else {
            cb(null, false)
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err)
        }
    },
}).array('images', 10)

export const uploadImageController = async (req: Request, res: Response) => {
    let current = Date.now()
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: err.message })
        } else if (err) {
            return res.status(400).json({ message: err.message })
        }

        const files = req.files as Express.Multer.File[]
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' })
        }

        try {
            let filePaths = files.map((file) => file.path)
            // filePaths = [
            //     'https://res.cloudinary.com/do032rq2s/image/upload/v1719664384/images/vckvcllat1l5x4e6w5u8.jpg',
            // ]
            const uploadPromises = files.map((file) =>
                uploadImageService(file.path)
            )
            filePaths = await Promise.all(uploadPromises)

            // Remove files from uploads folder after processing
            files.forEach((file) => {
                fs.unlink(file.path, (err) => {
                    if (err)
                        console.error(`Error deleting file ${file.path}:`, err)
                })
            })

            console.log('Time taken (cloudinary):', Date.now() - current)
            current = Date.now()

            const data = await analyzeImageService(filePaths)

            console.log('Time taken (python):', Date.now() - current)

            res.status(200).json({
                message: 'Images processed successfully',
                data,
            })
        } catch (error) {
            res.status(500).json({
                message: 'Error processing images',
                error: (error as Error).message,
            })
        }
    })
}

export const getHistoryController = async (req: Request, res: Response) => {
    try {
        const history = await getHistoryService()
        res.status(200).json({
            message: 'History fetched successfully',
            data: history,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching history',
            error: (error as Error).message,
        })
    }
}

export const getImagesController = async (req: Request, res: Response) => {
    try {
        const entryId = req.params.id
        const images = await getEntryDetailsService(entryId)
        res.status(200).json({
            message: 'Images fetched successfully',
            data: images,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching images',
            error: (error as Error).message,
        })
    }
}
