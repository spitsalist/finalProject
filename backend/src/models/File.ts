import {Schema, model, Document} from 'mongoose'

interface IFile extends Document {
    filename:string,
    contentType:string,
    fileData: Buffer,
    user: string
}

const fileSchema = new Schema({
    filename: {type: String, required: true},
    contentType:{type: String, required: true},
    fileData: {type: Buffer, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
}, {timestamps: true})

export const File = model<IFile>('File', fileSchema)