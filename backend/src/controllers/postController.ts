import { Response } from "express"
import { sendError, sendSuccess } from '../utils/helpers/responseHelper'
import { checkPostOwnership, createPost, getAllPosts } from "../services/postService"
import { handleFileUpload } from "../services/fileService"
import { Post } from "../models/Post"
import { User } from "../models/User"

export const addPost = async (req: any, res: Response) => {
    try {
      const { caption } = req.body;
      const userId = req.user.id;
      const imageFile = req.file;
  
      const user = await User.findById(userId);
      if (!user) {
        return sendError(res, 'User not found', 404);
      }
  
      const file = imageFile ? await handleFileUpload(imageFile, userId) : null;
      if (imageFile && !file) {
       
        return sendError(res, 'File upload failed', 500);
      }
  
      const fileId = file ? file._id : null;
//   console.log(imageFile)
      const newPost = new Post({
        user: userId,
        caption,
        image: Buffer.from(imageFile.buffer,
            "binary").toString("base64"),
        createdAt: new Date(),

      });
  
      await newPost.save();
  
      return sendSuccess(res, { post: newPost, image: fileId }, 'Post created', 201);
    } catch (error) {
      return sendError(res, 'Error creating post', 500, error);
    }
  };



export const fetchPosts = async (req:any, res: Response) => {
    try{
        const {userId} = req.query
        const posts = await getAllPosts(res, userId)
        if(!posts) return
    
        return sendSuccess(res, {posts}, 'Posts fetched successfully', 200)
    }catch(error){
        sendError(res, 'Error fetching posts', 500, error)
    }
}


export const updatePost = async(req: any, res:Response) =>{
    try{
        const {postId, caption, image} = req.body
        const userId = req.user.id
        const post = await checkPostOwnership(res,postId, userId)
        if(!post) return

        post.caption = caption || post.caption
        post.image = image || post.image
        await post.save()

        return sendSuccess(res, {post}, 'Post updated succesfully', 200)
    }catch(error:any){
        return sendError(res, 'Error updating post', error)
    }
}

export const deletePost = async(req:any, res:Response) => {
    try{
        const {postId} = req.body
        const userId = req.user.id
        const post = await checkPostOwnership(res,postId, userId)
        if(!post) return

        await post.deleteOne()
        return sendSuccess(res, {},'Post deleted succesfully', 200)
    }catch(error:any){
        return sendError(res, 'Error deleting post', 500, error)
    }
}

