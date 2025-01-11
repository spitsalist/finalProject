import mongoose, {Document, Schema } from "mongoose";

interface IComment extends Document {
    user: mongoose.Types.ObjectId
    post: mongoose.Types.ObjectId
    text: string
    parentComment?: mongoose.Types.ObjectId
}

const commentSchema: Schema<IComment> = new Schema({
    user: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true},
    text: {type: String, required: true, maxlength: 500},
    parentComment: {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'},
}, {timestamps: true})

commentSchema.index({post: 1, user: 1}, {unique: true})

export const Comment = mongoose.model<IComment>('Comment', commentSchema)