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
    console.log("Creating notification with data:", {
        userId, type, content, relatedUser, relatedPost, relatedComment,
    });

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
              }
            
          ])

        console.log("Populated notification relatedPost:", populatedNotification.relatedPost);
        
        io.to(userId).emit('newNotification', populatedNotification)
        return populatedNotification
}

export const messageNotification =async(userId:string, username:string, content:string, senderId:string, relatedMessage: string)=>{
    return createNotification(userId, 'message', username,content, senderId, relatedMessage)
}

export const likeNotification = async(userId:string, postOwner:string, username:string, postId:string)=> {
    if(postOwner !== userId){
        // console.log("postOwner:", postOwner, "postId:", postId);    
        await createNotification(postOwner, 'like', `${username} liked your post`, userId, postId)
    }
}


export const createLikeNotification = async(userId: string, username:string, commentId:string,commentOwnerId:string, postId:string)=> {
    if(userId === commentOwnerId) return
    await createNotification(commentOwnerId, 'like', `${username} liked your comment`, userId, commentId,postId)
}


export const commentNotification = async(userId:string,username:string, commentId:string,postId:string, targetUserId:string)=>{
    if(userId !== targetUserId){
        await createNotification(targetUserId, 'comment', `${username} comment your post`, userId, postId, commentId)
    }
}

export const followNotification =async(followerId:string, userToFollowId:string, followerUsername:string)=>{
    console.log("followUser invoked with:", {
        userToFollowId,
        followerId, 
      });
    try{
        
    
    if( followerId !== userToFollowId){
        const content = `${followerUsername} started following you`
        console.log("Creating follow notification with data:", {
            userToFollowId,
            type: "follow",
            content,
            relatedUser: followerId,
        });
     const notification = await createNotification(userToFollowId, 'follow', content,followerId)
     if(notification){
        console.log('follow notification created', notification)
     }else{
        console.error('failed to create follow notification')
     }
    }else{
        console.warn(`cannot create follow notification: userToFollowId (${userToFollowId}) is the same as followerId (${followerId})`)
    }
}catch(error){ console.error('error in followNotification', error)}
} 

export const replyNotification = async(userId:string, username:string, postId:string,commentId:string,parentCommentId:string)=>{
    if(userId === parentCommentId) return
    const content = `${username} replied to your comment`
    await createNotification(parentCommentId, 'reply', content, userId, postId, commentId)
}

