import mongoose, { Document, Schema, } from "mongoose";
import bcrypt from 'bcrypt'

interface IUser extends Document {
    fullName:string
    username: string 
    email: string 
    password: string
    profileImage?: string 
    bio?: string
    followers: mongoose.Schema.Types.ObjectId[]
    following: mongoose.Schema.Types.ObjectId[]
    isActive: boolean
    lastLogin: Date 
    resetPasswordToken: string
    resetPasswordExpires: Date
    isPrivate: boolean
    webSite: string

    comparePassword: (password: string) => Promise<boolean>
}

 const userSchema:Schema<IUser> = new Schema({
    fullName: {type:String, required:true},
    username:{type: String, required: true,  unique: true, trim: true, minlength: 3, maxlength: 20},
    email:{type: String, required: true, unique:true, lowercase:true, match:[/^\S+@\S+\.\S+$/, 'Please enter valid email']},
    password: {type: String, minlength: 6, required: [true, 'Password is required']},
    profileImage: {type: String, default: 'image.jpg',},
    bio: {type: String, maxlength: 150,},
    followers:[{type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isActive: {type: Boolean, default: true},
    resetPasswordToken:{type: String},
    resetPasswordExpires:{type: Date},
    lastLogin:{type: Date, default: Date.now},
    isPrivate:{type: Boolean, default: false},
    webSite: {type: String,}
}, {timestamps: true})

userSchema.index({email: 1})
userSchema.index({username: 1})

userSchema.pre<IUser>('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
  userSchema.methods.comparePassword = function(password: string) {
    return bcrypt.compare(password, this.password);
  };

export const User = mongoose.model<IUser>('User', userSchema)