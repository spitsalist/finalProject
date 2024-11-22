import { Like } from "../models/Like"
import { sendError, sendSuccess } from "../utils/helpers/responseHelper"
import { Response } from "express"
import { likeNotification } from "../services/notificationService/notificationService"
import { checkPostOwnership } from "../services/postService"

export const likePost = async(req: any, res:any)=>{

    try{
        const{postId} = req.body
        const userId = req.user.id
    
        const post = await checkPostOwnership(res, postId, userId, true)
        if(!post) return
      const existingLike = await Like.findOne({
        user: userId, 
        post: postId
    })
    
    if(!existingLike){
        const like = new Like({
            user: userId,
            post: postId
        })
        await like.save()
        post.likes.push(userId)
        await post.save()
        return 
    }
  
   

        await likeNotification(userId, post.user.toString(), req.user.username, postId)
        return sendSuccess(res, {},'Post liked succesfully', 200)
    }catch(error:any){
        return sendError(res, 'Error liking post',500, error)
    }
}

export const unlikePost = async(req: any, res:Response) => {
    try{
        const {postId} = req.body
        const userId = req.user.id

        const post = await checkPostOwnership(res, postId, userId,true )
        if(!post) return
        
        const existingLike = await Like.findOne({
            user: userId, 
            post: postId
        })
        if(existingLike){
             await Like.deleteOne({_id: existingLike._id}) 
        }
      
        
        post.likes = post.likes.filter((likeUserId) => likeUserId.toString() !== userId.toString())
        await post.save()
        
        return sendSuccess(res, {}, 'Post unliked succesfully', 200)
    }catch(error:any){
        return sendError(res, 'Error unliked succesfully', 500, error)
    }
}