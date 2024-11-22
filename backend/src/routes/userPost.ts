import { Router } from "express";
import { addPost, updatePost,deletePost, fetchPosts } from "../controllers/postController";
import { middlewareAuth } from "../middlewares/middlewareAuth";
import { upload } from "../utils/multer";

export const postRouter = Router()


postRouter.get('/',middlewareAuth, fetchPosts)
postRouter.post('/create', middlewareAuth,upload.single('image'), addPost)
postRouter.put('/update', middlewareAuth,updatePost)
postRouter.delete('/delete', middlewareAuth, deletePost)



