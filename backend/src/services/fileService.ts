import { File } from "../models/File";

export const handleFileUpload = async (imageFile:Express.Multer.File, userId: string)=>{
    if(!imageFile){
        return null
    }
    const file = new File({
        filename: imageFile.originalname,
        contentType: imageFile.mimetype,
        fileData: imageFile.buffer,
        user: userId
        })
        await file.save()
        return file

        
}


