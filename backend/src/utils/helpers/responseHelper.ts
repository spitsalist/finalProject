import { Response } from "express";

export const sendSuccess =(res:Response, data:any, message = 'Operation succesful', statusCode = 200) =>{
    res.status(statusCode).json({
        status: 'success',
        message,
        data,
        });
}

export const sendError =(res:any, message = 'Operation failed', statusCode = 500, error:any = null) =>{
    res.status(statusCode).json({
        status: 'error',
        message,
        error: error ? error.message : null, 
        statusCode
        });
    }