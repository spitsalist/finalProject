import { Notification } from "../models/Notification"
import { sendError, sendSuccess } from "../utils/helpers/responseHelper"
import { Response } from "express"

export const getNotifications = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user.id; 
        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(20)

            .populate({
                path: "relatedPost",
                    select: "image user likes comments",
                    populate:{path: 'user', select: 'username profileImage '},
               })
            .populate({
                path: "relatedUser",
                select: "username profileImage ",
            }).lean()
    
            console.log("Fetched notifications:", notifications);
  

        sendSuccess(res, {success: true, notifications });
    } catch (error: any) {
        sendError(res, "Error fetching notifications", 500, error);
    }
};

export const markNotificationAsRead = async (req:any, res:any) => {
    try {
    const {notificationId} = req.params;
    //   console.log(`Marking notification as read: ${notificationId}`); 

    const updateNotification = await Notification.findByIdAndUpdate(
        notificationId,
        {isRead: true},
        {new: true}
    )

    .populate({
        path: "relatedPost",
        select: "image user likes comments", 
        populate: { path: "user", select: "username profileImage" },
    })
    .populate({
        path: "relatedUser",
        select: "username profileImage",
    });
    console.log("Scheduled deletion for notification:", notificationId);
    if(!updateNotification){
        console.error("Notification not found");

        return sendError(res,'notification not found',404)
    }

    setTimeout(async()=>{
        try{
        await Notification.findByIdAndDelete(notificationId)
        console.log("Deleted notification:", notificationId);

        }catch(error){
            console.error('Error deleting notification', error)
        }
    },3600000)
      return sendSuccess(res, { success: true, message: 'notification as read', data: updateNotification });
    } catch (error) {
      return sendError(res, 'Error marking notification as read', 500, error);
    }
  };

