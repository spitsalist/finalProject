import {  Response } from "express";
import { Message } from "../models/Message";
import { User } from "../models/User";
import { io } from "../services/soketService/socket";
import { sendError, sendSuccess } from "../utils/helpers/responseHelper";

export const sendMessage = async (req: any, res: Response) => {
  try {
    const { recipientId, message, content } = req.body; 
    const senderId = req.user?.id; 

    if (!senderId) {
      return sendError(res, "Sender ID is missing", 401);
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return sendError(res, "Recipient not found", 404);
    }

    const newMessage = new Message({
      sender: senderId,
      recipient: recipientId,
      message,
      content,
      isRead: false,
    });

    await newMessage.save();

    io.to(recipientId.toString()).emit("newMessage", {
      id: newMessage._id,
      sender: senderId,
      recipient: recipientId,
      message,
      content,
      isRead: false,
      createdAt: newMessage.createdAt,
      updatedAt: newMessage.updatedAt,
    });

    return sendSuccess(res, { message: newMessage }, "Message sent successfully", 201);
  } catch (error) {
    console.error("Error sending message:", error);
    return sendError(res, "Failed to send message", 500, error);
  }
};