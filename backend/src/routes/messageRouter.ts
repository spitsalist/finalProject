import { sendMessage } from "../controllers/messageController";
import { middlewareAuth } from "../middlewares/middlewareAuth";
import { Router } from "express";
import { upload } from "../utils/multer";

export const postMessage  = Router()


postMessage.post('/send',upload.single('image'), middlewareAuth, sendMessage)
// postMessage.get('/:userId', middlewareAuth, getMessage)