import { Response } from "express"
import { Post } from "../models/Post"
import { sendError } from "../utils/helpers/responseHelper"


export const checkPostOwnership =async (res:Response, postId:string, userId:string, forLike = false) => {

    const post = await Post.findById(postId)


    if(!post){
        // console.log("Post not found in database for ID:", postId);

        return sendError(res, "Post not found", 404)
    }
    // if(!forLike && post.user.toString() !== userId){
    //     console.log("User does not own the post:", userId);

    //     return sendError(res,'You can only modify your own post',403 )
    // }

    // if (forLike === false && modifyingPost && post.user.toString() !== userId) {
    //     return sendError(res, 'You can only modify your own post', 403);
    // }

    if(forLike && post.user.toString() === userId){
        // console.log("User cannot like their own post:", userId);

        return sendError(res,'You can not like your own post',403 )
    }
    // console.log("Post ownership confirmed for post:", postId);

    return post
}

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


export const getAllPosts = async (_res:any, userId:string[]) => {
    const posts = await Post.find({ user: { $ne: userId } }) 
      .populate("user")
      .populate("likes")
      .populate("comments")
      .populate("image")
      .sort({ createdAt: -1 });
  
    return posts;
  };



export const createPost =async(userId:string,image:any,caption:string,_res:Response)=>{
        const newPost =new Post({user:userId, image,caption,likes:[],comments:[]})
        await newPost.save()
        return newPost
}