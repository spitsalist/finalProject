import { Router } from "express";
import { updatePrivacy } from "../controllers/privateController";
import { middlewareAuth } from "../middlewares/middlewareAuth";


export const isPrivate = Router()

isPrivate.patch('/', middlewareAuth, updatePrivacy)
