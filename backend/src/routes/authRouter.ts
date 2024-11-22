import { Router } from "express";
import { register, login } from "../controllers/authController";
import { confirmResetPassword } from "../services/passwordResetService/confirmResetPasswordController";
import { resetPassword } from '../services/passwordResetService/passwordService';

export const authRouter  = Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/resetPassword', resetPassword)
authRouter.post('/confirmReset', confirmResetPassword)


