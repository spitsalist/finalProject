import { Notification } from "../models/Notification"
import { sendError, sendSuccess } from "../utils/helpers/responseHelper"
import { Response } from "express"

export const getNotifications = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user.id; 
        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(20)

        //     .populate({
        //         path: "relatedUser",
        //         select: "username profileImage",
        //     })
        //     .populate({
        //     path: "relatedPost",
        //         select: "postImage",
        //    });
            .populate("relatedUser", "username profileImage")
            .populate("relatedPost", "postImage")

        sendSuccess(res, {success: true, notifications });
    } catch (error: any) {
        sendError(res, "Error fetching notifications", 500, error);
    }
};

export const markNotificationAsRead = async (req:any, res:any) => {
    try {
    const {notificationId} = req.params;
      console.log(`Marking notification as read: ${notificationId}`); 

    const updateNotification = await Notification.findByIdAndUpdate(
        notificationId,
        {isRead: true},
        {new: true}
    )
    // .populate("relatedUser", "username profileImage")
    // .populate({path: 'relatedPost',
    //     select:'postImage user caption',
    //     populate:{
    //         path:'user',
    //         select:'username profileImage'
    //     }
    // })
    .populate('relatedUser', 'username profileImage')
    .populate('relatedPost', 'postImage')
    if(!updateNotification){
        console.error("Notification not found");

        return sendError(res,'notification not found',404)
    }

    setTimeout(async()=>{
        try{
        await Notification.findByIdAndDelete(notificationId)
        }catch(error){
            console.error('Error deleting notification', error)
        }
    },3600000)
      return sendSuccess(res, { success: true, message: 'notification as read', data: updateNotification });
    } catch (error) {
      return sendError(res, 'Error marking notification as read', 500, error);
    }
  };

