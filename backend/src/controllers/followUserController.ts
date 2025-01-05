import { Response } from "express"
import { sendError, sendSuccess } from "../utils/helpers/responseHelper"
import { followNotification } from "../services/notificationService/notificationService"
import { checkFollowStatus, checkUserExists, getFollowingIds } from "../utils/followUtils/followUtils" //checkFollowStatus
import { getAllPosts } from "../services/postService"
import { User } from "../models/User"

export const followUser = async (req: any, res:Response) => {
    try{
        const {userToFollowId} = req.body
        const userId  = req.user.id

        await checkUserExists(userToFollowId)

        if(userId === userToFollowId){
            return sendError(res, 'you cannot follow yourself', 400)
        }

        const isAlreadyFollowing = await checkFollowStatus(userId, userToFollowId)
        if(isAlreadyFollowing){
            return sendSuccess(res, {}, 'you are already following this user', 200)
        }

        const currentUser = await User.findByIdAndUpdate(userId, 
            {$addToSet: {following: userToFollowId}},
            {new: true}
        )
        if(!currentUser){
            return sendError(res, 'current user not found', 404)
        }

        const userToFollow = await User.findByIdAndUpdate(userToFollowId,
            {$addToSet: {followers: userId}},
            {new: true}
        )
        if(!userToFollow){
            return sendError(res, 'user to follow not found', 404)
        }

          
          await followNotification(userId, userToFollowId, req.user.username)
          return sendSuccess(res, {}, 'User followed successfully', 200)
        
    }catch(error:any){
    return sendError(res, 'Error following', 500, error)
}
}

export const unfollowUser = async(req: any, res: Response) => {
    try {
        const {userToUnfollowId} = req.body
        const userId = req.user.id

        await checkUserExists(userToUnfollowId)

        const isFollowing = await checkFollowStatus(userId, userToUnfollowId)
        if(!isFollowing){
            return sendSuccess(res, {}, 'you are not following this user', 200)
        }

        const currentUser = await User.findByIdAndUpdate(userId,
            {$pull:{following: userToUnfollowId}},
            {new: true}
        )
        if(!currentUser){
            return sendError(res,'current user not found', 404)
        }

        const userToUnfollow = await User.findByIdAndUpdate(userToUnfollowId,
            {$pull: {followers: userId}},
            {new: true}
        )
        if(!userToUnfollow){
            return sendError(res, 'user to unfollow not found', 404)
        }

        return sendSuccess(res, {}, 'User unfollowed succesfully',200)
       
    }catch(error:any){
        return sendError(res, 'Error unfollowing user',500,error)
    }
}

export const getTimePosts = async (req:any, res:any) => {
    try {
      const userId = req.user.id; 
      const posts = await getAllPosts(res, userId, false); 
  
      if(!posts || posts.length === 0) {
        return res.status(404).json({message: 'no post found'})
      }

      const followingIds = await getFollowingIds(userId)
  
      const updatedPosts =  posts.map((post: any) => {
        const isFollowing = followingIds.includes(post.user._id.toString())
        return {...post, user:{...post.user, isFollowing}}
      });
    //   console.log(updatedPosts); 
    // console.log(JSON.stringify(updatedPosts, null, 2))

      return sendSuccess(res, { posts: updatedPosts }, "Posts fetched successfully", 200);
    } catch (error) {
      return sendError(res, "Error fetching timeline posts", 500, error);
    }
  };