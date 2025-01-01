import { Response } from "express"
import { Post } from "../models/Post"
import { sendError } from "../utils/helpers/responseHelper"

export const checkPostOwnership = async (
  res: Response,
  postId: string,
  userId: string,
  forLike = false
) => {
  const post = await Post.findById(postId);

  if (!post) {
      return sendError(res, "Post not found", 404);
  }

  if (forLike && post.user.toString() === userId) {
      return sendError(res, 'You cannot like your own post', 403);
  }

  return post;
};

// if is subscribed ...
// export const getAllPosts = async(_res:Response,followingIds?:string[])=>{
//     const query = followingIds ? {user: {$in: followingIds}} : {}
//         const posts = await Post.find(query)
//         .populate('user')
//         .populate('likes')
//         .populate('comments')
//         .populate('image')
//         // .populate('following')
//         .sort({createdAt: -1})
//         return posts
// }


export const getAllPosts = async (_res: any, userId: string, forProfile: boolean = false) => {
  const query = forProfile
    ? { user: userId }
    : { user: { $ne: userId } }

  const posts = await Post.find(query)
    // .populate("user")
    .populate({
      path: 'user',
      select: 'username profileImage followers'
  })
    .populate("likes")
    .populate("comments")
    .populate("image")
    .sort({ createdAt: -1 })
    .lean()

    if(forProfile && (!posts || posts.length === 0)){
      return[]
    }

  return posts;
};


export const createPost =async(userId:string,image:any,caption:string,_res:Response)=>{
        const newPost =new Post({user:userId, image,caption,likes:[],comments:[]})
        await newPost.save()
        return newPost
}