import { Schema, model } from 'mongoose'

const imageSchema = new Schema({
    reasoning: String,
    imageUrl: String,
    objects: Object,
})

const ImageModel = model('Image', imageSchema)
export default ImageModel
