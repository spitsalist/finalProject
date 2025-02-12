import { Notification } from "../../models/Notification";
import { io } from "../soketService/socket";

export const createNotification = async(
    userId: string,
    type: string,
    content: string,
    relatedUser?: string,
    relatedPost?: string,
    relatedComment?: string,
    relatedMessage?: string,
)=>{
    // console.log("Creating notification with data:", {
    //     userId, type, content, relatedUser, relatedPost, relatedComment,
    // });

    const notification = new Notification({
        user:userId,
        type,
        content,
        relatedUser,
        relatedPost,
        relatedComment,
        relatedMessage,
        isRead: false,
        })
          
        await notification.save()
        
        const populatedNotification = await notification.populate([
            {
                path: 'relatedPost',
                populate: [
                  { path: 'user', select: 'username profileImage isFollowing' },
                  { path: 'likes', select:'username' } 
                ]
              },
              {
                path: 'relatedUser',
                select: 'username profileImage isFollowing'
              },
              {
                path: 'relatedComment',
                select: 'text user',
                populate:{
                    path: 'user',
                    select:'username profileImage'
                }
              }
            
          ])

        // console.log("Populated notification relatedPost:", populatedNotification.relatedPost);
        
        io.to(userId).emit('newNotification', populatedNotification)
        return populatedNotification
}

export const messageNotification =async(userId:string, username:string, content:string, senderId:string, relatedMessage: string)=>{
    return createNotification(userId, 'message', username,content, senderId, relatedMessage)
}

export const likeNotification = async(userId:string, postOwner:string, username:string, postId:string)=> {
    if(postOwner !== userId){
        await createNotification(postOwner, 'like', `${username} liked your post`, userId, postId)
    }
}


export const createLikeNotification = async(userId: string, username:string, commentId:string,commentOwnerId:string, postId:string)=> {
    if(userId === commentOwnerId) return
    await createNotification(commentOwnerId, 'like', `${username} liked your comment`, userId,postId, commentId)
}


export const commentNotification = async(userId:string,username:string, commentId:string,postId:string, targetUserId:string)=>{
    if(userId !== targetUserId){
        await createNotification(targetUserId, 'comment', `${username} comment your post`, userId, postId, commentId)
    }
}

export const followNotification =async(followerId:string, userToFollowId:string, followerUsername:string)=>{    
    if( followerId !== userToFollowId){
        const content = `${followerUsername} started following you`
     await createNotification(userToFollowId, 'follow', content,followerId)
    }
}

export const replyNotification = async(userId:string, username:string, postId:string,commentId:string,parentCommentId:string)=>{
    if(userId === parentCommentId) return
    const content = `${username} replied to your comment`
    await createNotification(parentCommentId, 'reply', content, userId, postId, commentId)
    console.log('parentCommentId', parentCommentId)
}

