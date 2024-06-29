import { Schema, model } from 'mongoose'

const entrySchema = new Schema({
    createdAt: Date,
    images: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Image',
        },
    ],
})

const EntryModel = model('Entry', entrySchema)
export default EntryModel
