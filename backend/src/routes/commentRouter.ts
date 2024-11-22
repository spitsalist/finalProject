import { commentOnPost, getComments, likeComment } from "../controllers/commentController"
import { middlewareAuth } from "../middlewares/middlewareAuth"
import { Router } from "express"

export const commentRouter = Router()

commentRouter.get('/:postId', middlewareAuth, getComments)
commentRouter.post('/', middlewareAuth, commentOnPost)
commentRouter.post('/like', middlewareAuth, likeComment)