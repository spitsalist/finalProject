import { Message } from "../models/Message";
import { User } from "../models/User";
import { sendError, sendSuccess } from "../utils/helpers/responseHelper";
import { messageNotification } from "../services/notificationService/notificationService";
import { Response } from "express";
import { handleFileUpload } from "../services/fileService";

export const sendMessage = async (req: any, res: Response) => {
    try {
        const { userId, message, content, fileId } = req.body;
        const senderId = req.user.id;
        const imageFile = req.file

        const user = await User.findById(userId)
        if(!user){
            return sendError(res, 'User not found', 404)
        }
        
        const file = await handleFileUpload(imageFile, senderId)
        if(file === null) return

        const newMessage = new Message({
            sender: senderId,
            recipient: userId,
            message,
            content,
            file:  fileId, //file ? file._id : null,
            isRead: false,
        })
        await newMessage.save()

    await messageNotification(userId, 'message', `${req.user.username} sent you a message`, senderId, newMessage._id as string)

        return sendSuccess(res, {newMessage}, 'Message sent successfully', 200)
    } catch (error:any) {
        return sendError(res,'Error sending message', 500, error)
    }
}

export const getMessage = async (req: any, res: Response) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;
        const messages = await Message.find({
            $or: [
                { sender: currentUserId, recipient: userId },
                { sender: userId, recipient: currentUserId }
            ]
        })
        .populate('sender', 'username')
        .populate('recipient', 'username')
        .sort({createdAt: 1})

        if (!messages) {
            return sendError(res, 'No messages found', 404)
          }
        return sendSuccess(res, {messages}, 'Message recived succesfully', 200)
    } catch (error:any) {
        return sendError(res, 'Error receiving message', 500, error)
    }
}