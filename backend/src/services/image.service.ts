import { v2 as cloudinary } from 'cloudinary'
import axios from 'axios'
import { ImageType } from '@/type'
import ImageModel from '../models/image.model'
import EntryModel from '../models/entry.model'

export const uploadImageService = async (imagePath: string) => {
    try {
        const options = {
            unique_filename: true,
            folder: 'images',
            overwrite: true,
        }
        const result = await cloudinary.uploader.upload(imagePath, options)
        return result.secure_url
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

export const analyzeImageService = async (imageUrls: string[]) => {
    try {
        if (!imageUrls || imageUrls.length === 0) {
            throw new Error('No images uploaded')
        }

        console.log('Analyzing images:', imageUrls)

        const response = await axios.post(
            process.env.PYTHON_API_URL + '/analyze',
            { images: imageUrls },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 100000,
            }
        )

        let data = response.data

        await saveImagesService(data)

        return data
    } catch (error) {
        console.error('Error analyzing image:', error)
        throw new Error((error as Error).message)
    }
}

export const saveImagesService = async (data: ImageType[]) => {
    try {
        const imageUrls = data.map((image) => image.imageUrl)
        const imageObjects = data.map((image) => image.objects)
        const imageReasonings = data.map((image) => image.reasoning)

        const entry = new EntryModel({ createdAt: new Date() })
        const images = await ImageModel.insertMany(
            imageUrls.map((imageUrl, index) => ({
                imageUrl,
                objects: imageObjects[index],
                reasoning: imageReasonings[index],
            }))
        )

        entry.images = images.map((image) => image._id)

        await entry.save()
    } catch (error) {
        console
        throw new Error((error as Error).message)
    }
}

export const getHistoryService = async () => {
    try {
        const entries = await EntryModel.find().populate('images')
        return entries
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

export const getEntryDetailsService = async (entryId: string) => {
    try {
        const entry = await EntryModel.findById(entryId).populate('images')
        return entry
    } catch (error) {
        throw new Error((error as Error).message)
    }
}
