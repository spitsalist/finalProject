import { PasswordReset } from "../../models/PasswordReset";
import { User } from "../../models/User";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { sendSuccess, sendError } from "../../utils/helpers/responseHelper";

export const confirmResetPassword = async(req:any, res:any) => {
    try{
        const {token, newPassword} = req.body
        const resetRecord = await PasswordReset.findOne({token})
        if(!resetRecord){
            return sendError(res, 'Invalid or exired token', 400)
        }
        if(resetRecord.expires < new Date()){
            return sendError(res, 'Token expired', 400)
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload

        const user = await User.findById(decoded.id)
        if(!user){
            return sendError(res, 'User not found', 404)
        }

        // console.log('Old password hash:', user.password);

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        // console.log('New password hash:', hashedPassword);

        await PasswordReset.deleteOne({token})
        return sendSuccess(res,  'Password reset succesfully')
    }catch(error:any){
        return sendError(res, 'Password reset failed', 500, error)
    }
}