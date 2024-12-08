import mongoose, {Document, Schema} from "mongoose"

interface IMessage extends Document {
    _id: string
    sender: mongoose.Types.ObjectId
    recipient: mongoose.Types.ObjectId
    message: string
    content?: string
    isRead: boolean
    createdAt: Date; 
    updatedAt: Date; 
}

const messageSchema: Schema<IMessage> = new Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    recipient: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    message:{type: String, required: true},
    content: {type: String},
    isRead: {type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now },


}, {timestamps: true})

export const Message = mongoose.model<IMessage>('Message', messageSchema)


