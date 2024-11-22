import mongoose from "mongoose";

const resetPasswordSchema = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    token:{type: String, required: true},
    expires:{type: Date, required:true}
})

export const PasswordReset = mongoose.model('PasswordReset', resetPasswordSchema)