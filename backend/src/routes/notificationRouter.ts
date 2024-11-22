import { Router } from "express";
import { getNotifications, markNotificationAsRead } from "../controllers/notificationController";
import { middlewareAuth } from "../middlewares/middlewareAuth";

export const notifyRouter = Router()

notifyRouter.get('/',middlewareAuth, getNotifications)
notifyRouter.put('/read', middlewareAuth, markNotificationAsRead)
