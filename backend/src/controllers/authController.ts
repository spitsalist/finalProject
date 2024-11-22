import {User} from '../models/User'
import jwt  from 'jsonwebtoken'
import { sendSuccess, sendError } from '../utils/helpers/responseHelper'
import {  Response} from 'express'



export const register = async (req:any, res:Response) => {
    try{
        const {fullName, username, email, password} = req.body
        const existingUser = await User.findOne({email})
        if(existingUser){
        return sendError(res, 'Email already is use', 400)
    }
    const newUser = new User({fullName, username, email, password})
    await newUser.save()

        return sendSuccess(res, {newUser}, 'User registred succesfully', 201)
    }catch(error: any){
       return sendError(res, 'Registration failed', 500, error)
    }
}

export const login = async(req:any, res:Response) => { 
    try{
        const {email, password} = req.body

        if(!email || !password){
            return sendError(res, 'Please provide email and password', 400)
        }
        const user = await User.findOne({ email})

        if(!user){
            return sendError(res, 'User not found', 404)
        }
                const isMatch = await user.comparePassword(password)
                if(!isMatch){
                    return sendError(res, 'Invalid password', 400)
                }
                const token = jwt.sign({id: user._id}, process.env.JWT_SECRET as string, {
                    expiresIn: '1d',
                })
              return sendSuccess(res, {token}, 'Login succesfully')
    }catch(error:any){
       return sendError(res, 'Login failed', 500, error)
    }
}

