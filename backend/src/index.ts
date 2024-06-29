import 'module-alias/register'
import dotenv from 'dotenv'
import express, { Application, Request, Response } from 'express'
import { v2 as cloundinary } from 'cloudinary'
import {
    uploadImageController,
    getHistoryController,
    getImagesController
} from 'controllers/image.controller'
import mongoose from 'mongoose'
import cors from 'cors'
import morgan from 'morgan'

//For env File
dotenv.config()

// Cloundinary Configurations
try {
    cloundinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
    })
    console.log('[CLOUDINARY] Cloundinary Configured')
} catch (error) {
    console.log('[CLOUDINARY] Cloundinary Configured Error', error)
}

const app: Application = express()

try {
    mongoose
        .connect(process.env.MONGO_URL as string)
        .then(() => {
            console.log('[MONGO] Successfully connect to MongoDB.')
            app.listen(process.env.PORT , () => {
                console.log('====================================')
                console.log(`Server is running on port ${process.env.PORT}`)
                console.log('====================================')
            })
        })
        .catch((err) => {
            console.error('[MONGO] Connection error', err.message)
            process.exit()
        })
} catch (error) {
    console.log('Mongo Error', error)
}

// cors
app.use(cors())

app.use(morgan('dev'))

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server')
})

app.post('/upload', uploadImageController)

app.get('/history', getHistoryController)

app.get('/history/:id', getImagesController)
