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
        await commentNotification(userId, username, comment._id as string, postId, post.user.toString());
      }
      if (parentCommentId && parentComment){
        if(
        parentComment.user.toString() !== userId &&
        parentComment.user.toString() !== post.user.toString())
       {
        await replyNotification(userId, username, postId, comment._id as string, parentComment.user.toString());
      }
    }
      return sendSuccess(res, { comment }, 'Comment created successfully', 200);
    } catch (error: any) {  
      return sendError(res, 'Error creating comment', 500, error);
    }
  };

  export const getComments = async (req: any, res: Response) => {
    try {
      const { postId } = req.params;
      const userId = req.user._id
  
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
        .sort({ createdAt: 1 })
        .lean()

        const enrichedComments = await Promise.all(
          comments.map(async(comment)=>{
            const likeCounter = await Like.countDocuments({comment: comment._id})
            const isLiked = await Like.exists({comment: comment._id, user:userId})
            return {
              ...comment,
              likeCounter,
              isLiked: !!isLiked,
            }
          })
        )
  
      sendSuccess(res, { comments: enrichedComments }, "Comments fetched successfully");
    } catch (error) {
      sendError(res, "Failed to fetch comments", 500, error);
    }
  };


export const likeComment = async (req: any, res: Response) => {
  try {
    const { commentId } = req.body;
    const userId = req.user.id;
    const username = req.user.username;

    const comment = await Comment.findById(commentId).populate('post')
    if (!comment || !comment.post) {
      return sendError(res, "Comment not found", 404);
    }

    const existingLike = await Like.findOne({ user: userId, comment: commentId })
    console.log("Existing Like:", existingLike);

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      const likeCounter = await Like.countDocuments({ comment: commentId });
      return sendSuccess(
        res,
        { likeCounter, isLiked: false },
        "Comment unliked successfully",
        200
      );
    }

    const like = new Like({
      user: userId,
      post: comment.post._id.toString(),
      comment: commentId,
    });
    await like.save();
    const likeCounter = await Like.countDocuments({ comment: commentId })
    await createLikeNotification(userId, username, commentId, comment.user.toString(), comment.post._id.toString());
    return sendSuccess(
      res,
      { likeCounter, isLiked: true },
      "Comment liked successfully",
      200
    );
  } catch (error: any) {
    console.error("Error liking comment:", error);
    return sendError(res, "Error liking comment", 500, error);
  }
};

