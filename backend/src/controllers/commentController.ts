import { Response } from "express"
import { Comment } from "../models/Comment"
import { Like } from "../models/Like"
import { sendError, sendSuccess } from "../utils/helpers/responseHelper"
import { commentNotification, createLikeNotification, replyNotification } from "../services/notificationService/notificationService"
import { checkPostOwnership } from "../services/postService"


export const commentOnPost = async (req: any, res: Response) => {
    try {
        // console.log('req.user:', req.user);
      const { postId, text, parentCommentId } = req.body;
      const userId = req.user._id.toString() 
      const username = req.user.username;

    //   console.log('userId:', userId);
    //   console.log('username:', username);
  
      const post = await checkPostOwnership(res, postId, userId);
      if (!post) return;
  
      let parentComment = null;
      if (parentCommentId) {
        parentComment = await Comment.findById(parentCommentId);
        if (!parentComment || !parentComment.post.equals(postId)) {
          return sendError(res, "Invalid comment id", 400);
        }
      }
  
      const comment = new Comment({
        user: userId,
        post: postId,
        parentComment: parentCommentId || null,
        text,
      });
  
      await comment.save();
  
      await comment.populate('user');
  
      post.comments.push(comment._id as any);
      await post.save();
  
      if (post.user.toString() !== userId) {
        await commentNotification(userId, username, comment._id as string, postId, post.user.toString() as string);
      }
      if (
        parentCommentId &&
        parentComment &&
        parentComment.user.toString() !== userId &&
        parentComment.user.toString() !== post.user.toString()
      ) {
        await replyNotification(userId, username, postId, comment._id as string, parentComment.user.toString());
      }
  
      return sendSuccess(res, { comment }, 'Comment created successfully', 200);
    } catch (error: any) {
    //   console.error("Error creating comment:", error);
  
      return sendError(res, 'Error creating comment', 500, error);
    }
  };

  export const getComments = async (req: any, res: Response) => {
    try {
      const { postId } = req.params;
  
      const comments = await Comment.find({ post: postId })
        .populate("user", "username profileImage")
        .populate({
          path: "parentComment",
          select: "text user",
          populate: {
            path: "user",
            select: "username profileImage",
          },
        })
        .sort({ createdAt: 1 });
  
      sendSuccess(res, { comments }, "Comments fetched successfully");
    } catch (error) {
    //   console.error("Error fetching comments:", error);
      sendError(res, "Failed to fetch comments", 500, error);
    }
  };



export const likeComment = async(req:any, res:Response) => {
    try{
        const {commentId} = req.body
        const userId = req.user.id
        // console.log('userId:', userId);

        const username = req.user.username
        // console.log('username:', username);

        const comment = await Comment.findById(commentId)
        if(!comment){
            return sendError(res,'Comment not found', 404)
        }
        const existingLike = await Like.findOne({
            user: userId,
            comment: commentId,
        })
        if(existingLike){
            return sendError(res, 'You have already liked this comment', 400)
        }
        const like = new Like({
            user: userId,
            comment: commentId,
        })
        await like.save()

        await createLikeNotification(userId, username, commentId, comment.user.toString())
        return sendSuccess(res, {},'Comment liked succsefully', 200)
    }catch(error:any){
        return sendError(res, 'Error liking comment',500,error)
    }
}