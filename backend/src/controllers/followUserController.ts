import { Response } from "express"
import { Follow } from "../models/Follow"
import { sendError, sendSuccess } from "../utils/helpers/responseHelper"
import { followNotification } from "../services/notificationService/notificationService"
import { checkFollowStatus, checkUserExists } from "../utils/followUtils/followUtils"
import { getAllPosts } from "../services/postService"
import { User } from "../models/User"

export const followUser = async (req: any, res:Response) => {
    try{
        const {userToFollowId} = req.body
        const userId  = req.user.id

        await checkUserExists(userToFollowId)

        const existingFollow =await checkFollowStatus(userId, userToFollowId)
        if(existingFollow){
            const follow = new Follow({
                follower: userId,
                following: userToFollowId
            })
            await follow.save()
            // return sendError(res, 'You are already following this user', 400)
        }
        

        const getFpllowers = await User.findByIdAndUpdate({_id: userId}, {$addToSet: {following:userToFollowId}})
    const updatedUser = await User.findByIdAndUpdate({_id: userToFollowId}, {$addToSet:{followers:userId}})
        await followNotification(userId, userToFollowId, req.user.username)

    return sendSuccess(res, {}, 'User followed succesfully', 200)
}catch(error:any){
    return sendError(res, 'Error following', 500, error)
}
}

export const unfollowUser = async(req: any, res: Response) => {
    try {
        const {userToUnfollowId} = req.body
        const userId = req.user.id

        await checkUserExists(userToUnfollowId)


        const existingFollow = await checkFollowStatus(userId, userToUnfollowId)
        if(existingFollow){
            await Follow.deleteOne({_id: existingFollow._id})
            await User.findByIdAndUpdate({_id: userToUnfollowId}, {$pull:{followers:userId}})
            const getFpllowers = await User.findByIdAndUpdate({_id: userId}, {$pull: {following:userToUnfollowId}})
        }
        return sendSuccess(res, {}, 'User unfollowed succesfully',200)

       
    }catch(error:any){
        return sendError(res, 'Error unfollowing user',500,error)
    }
}


export const getTimePosts = async (req:any, res:any) => {
    try {
      const userId = req.user.id; 
      
      const posts = await getAllPosts(res, userId); 
      if (!posts) return res.status(404).json({ message: "No posts found" });
  
      return sendSuccess(res, { posts }, "Posts fetched successfully", 200);
    } catch (error) {
      return sendError(res, "Error fetching timeline posts", 500, error);
    }
  };