import mongoose, {Document, Schema} from "mongoose";

interface INotification extends Document{
    user: mongoose.Types.ObjectId
    type: string
    content: string
    isRead: boolean
    relatedUser?: mongoose.Types.ObjectId
    relatedPost?: mongoose.Types.ObjectId
    relatedComment?: mongoose.Types.ObjectId
}

const notificationSchema: Schema<INotification> = new Schema({
    user:{type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    type: {type: String, required: true},
    content:{type: String, required: true},
    isRead:{type: Boolean, default: false},
    relatedUser:{type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    relatedPost:{type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    relatedComment:{type: mongoose.Schema.Types.ObjectId, ref:'Comment'},
}, {timestamps: true})

export const Notification = mongoose.model<INotification>('Notification', notificationSchema)