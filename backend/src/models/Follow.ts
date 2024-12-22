// import mongoose, {Document, Schema} from "mongoose";

// interface IFollow extends Document {
//     follower: mongoose.Types.ObjectId
//     following: mongoose.Types.ObjectId
//     isDeleted: boolean
// }

// const followSchema: Schema<IFollow> = new Schema({
//     follower: {type: Schema.Types.ObjectId, ref: 'User', required: true},
//     following: {type: Schema.Types.ObjectId, ref: 'User', required: true},
//     isDeleted: {type: Boolean, default: false},
// }, {timestamps: true})

// followSchema.index({follower: 1, following: 1}, {unique: true})

// export const Follow = mongoose.model<IFollow>('Follow', followSchema)