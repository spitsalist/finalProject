import { Notification } from "../models/Notification"
import { sendError, sendSuccess } from "../utils/helpers/responseHelper"
import { Response } from "express"

export const getNotifications = async (req:any, res: Response)=>{
    try{
        const userId = req.user.id
        const notification = await Notification.find({
            user: userId})
            .sort({createdAt: -1})
            .populate('relatedUser', 'username profileImage')
            .populate('relatedPost', 'postImage')

            // console.log(`Fetched notifications: ${JSON.stringify(notification)}`)

            return sendSuccess(res, {notification})
    }catch(error:any){
        return sendError(res, 'Error fetching notifications', 500, error)
    }
}

export const markNotificationAsRead = async (req:any, res:any) => {
    try {
      // const notificationId = req.params.id;
      const userId = req.user.id;
  
      await Notification.updateMany(
        {  user: userId },
        { isRead: true }
      );
  
      return sendSuccess(res, { message: 'notification as read' });
    } catch (error) {
      return sendError(res, 'Error marking notification as read', 500, error);
    }
  };