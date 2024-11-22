import { Router } from "express"
import { likePost, unlikePost} from "../controllers/likeController"
import { middlewareAuth } from "../middlewares/middlewareAuth"

export const likeRouter = Router() 

likeRouter.put('/', middlewareAuth, likePost)
likeRouter.delete('/unlike', middlewareAuth, unlikePost)

