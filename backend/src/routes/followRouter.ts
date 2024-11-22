import { Router } from "express";
import { followUser, unfollowUser, getTimePosts } from "../controllers/followUserController";
import { middlewareAuth } from "../middlewares/middlewareAuth";

export const followRouter = Router()
followRouter.get('/post', middlewareAuth, getTimePosts)
followRouter.post('/',middlewareAuth, followUser)
followRouter.delete('/unfollow',middlewareAuth, unfollowUser)
