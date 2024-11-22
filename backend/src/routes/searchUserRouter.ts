import { searchUsers } from "../controllers/searchController";
import { Router } from "express";
import { middlewareAuth } from "../middlewares/middlewareAuth";

export const searchUserRouter = Router()

searchUserRouter.get('/',middlewareAuth, searchUsers)