import { User } from "../models/User";
import { sendError } from "../utils/helpers/responseHelper";

export const searchUsers = async (req:any, res:any) =>{
try{
    const query = req.query.query.toString().toLowerCase().trim()
    const users = await User.find({
       $or:[
        {fullName: new RegExp(query, 'i')}
       ]
    }).select('fullName')
    
    res.json({users})
}catch(error:any){
    return sendError(res, 'Error searching users',error)
}
}




