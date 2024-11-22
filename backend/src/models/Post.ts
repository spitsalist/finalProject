import mongoose,{Document,Schema} from "mongoose";

    interface IPost extends Document {
    user: mongoose.Types.ObjectId
    image?: string
    caption?: string
    likes: mongoose.Types.ObjectId[]
    comments: mongoose.Types.ObjectId[]
}

 const postSchema: Schema<IPost> = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    image:{type: String},
    caption: {type: String},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
}, {timestamps: true})

postSchema.index({ user: 1})

export const Post = mongoose.model<IPost>('Post', postSchema)