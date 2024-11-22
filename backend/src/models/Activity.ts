import mongoose, {Document, Schema} from "mongoose";

interface IActivity extends Document{
    user: mongoose.Types.ObjectId
    action: string
    targetType: string
    targetId: mongoose.Types.ObjectId
}

const activitySchema: Schema<IActivity> = new Schema({
    user:{type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    action:{type: String, required:true},
    targetType:{type: String, required: true},
    targetId:{type: mongoose.Schema.Types.ObjectId, required:true},
}, {timestamps: true})

export const Activity = mongoose.model<IActivity>('Activity',activitySchema)