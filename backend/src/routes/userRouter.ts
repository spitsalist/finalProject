import { Router } from "express";
import { middlewareAuth } from "../middlewares/middlewareAuth";
import { getUserProfile, updateUserProfile, getAllUsers } from "../controllers/userController";
import { upload } from "../utils/multer";

export const userRouter = Router()

userRouter.get('/all',middlewareAuth, getAllUsers)

userRouter.get('/:id?',middlewareAuth, getUserProfile)
userRouter.put('/edit', middlewareAuth, upload.single('profileImage'), updateUserProfile)


