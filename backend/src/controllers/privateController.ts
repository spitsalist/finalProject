import { User } from "../models/User";
import { sendError, sendSuccess } from "../utils/helpers/responseHelper";


export const updatePrivacy = async (req: any, res: any) => {
    try {
      const userId = req.user.id;  
      const { isPrivate } = req.body;  
      
      const user = await User.findById(userId);
      if (!user) return sendError(res,'user not found', 404)
      
      user.isPrivate = isPrivate;
      await user.save();
      
      sendSuccess(res, {},'Privacy updated successfully', 200)
    } catch (error) {
      sendError(res, 'Error updating privacy', 500)
    }
  };