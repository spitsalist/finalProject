import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload }  from 'jsonwebtoken';
import { sendError } from '../utils/helpers/responseHelper';
import { User } from '../models/User';


export interface AuthUser extends Request {
    file?:Express.Multer.File;
    user?:  JwtPayload | any
}

export const middlewareAuth = async (req: AuthUser, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendError(res, 'Authorization header is missing', 400);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return sendError(res, 'Access denied', 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        if (!decoded.id) {
            return sendError(res, 'Invalid token payload', 400);
        }

        const user = await User.findById(decoded.id).select('-password')

        if (!user) {
            return sendError(res, 'User not found', 401);
        }

        req.user = user; 

        // console.log('authMiddleware - req.user:', req.user);

        next();
    }catch(error:any){
        return sendError(res, 'Invalid token', 400, error)
    }
}