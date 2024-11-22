import mongoose, {Document, Schema} from "mongoose";

interface ILike extends Document{
    user: mongoose.Types.ObjectId
    post?: mongoose.Types.ObjectId
}
const likeSchema: Schema<ILike> = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
}, {timestamps: true})

likeSchema.index({ user:1, post: 1}, {unique: true})

export const Like = mongoose.model<ILike>('Like', likeSchema)