import { User } from '../models/User';
import { sendError, sendSuccess } from '../utils/helpers/responseHelper';
import { handleFileUpload } from '../services/fileService';

export const getUserProfile = async (req:any, res:any) => {
  try {
    const userId = req.params.id || req.user.id   
    const currentUserId = req.user.id
    const user = await User.findById(userId).select('-password');

    if (!user) return sendError(res, 'User not found', 404);

    const isFollowing = user.followers.includes(currentUserId)
    sendSuccess(res, {
      _id: user._id,
      username: user.username,
      isPrivate: user.isPrivate,
      fullName: user.fullName,
      profileImage: user.profileImage,
      bio: user.bio,
      webSite: user.webSite,
      followers: user.followers.length, 
      following: user.following.length, 
      isFollowing,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    sendError(res, 'Error fetching user profile', 500, error);
  }
};


export const updateUserProfile = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { fullName, username, bio, webSite } = req.body;
    const profileImage = req.file; 

    const user = await User.findById(userId);
    if (!user) return sendError(res, "User not found", 404);

    if (profileImage) {
      const uploadedFile = await handleFileUpload(profileImage, userId);
      if (!uploadedFile) {
        return sendError(res, "File upload failed", 500);
      }
      user.profileImage = `data:${uploadedFile.contentType};base64,${uploadedFile.fileData.toString("base64")}`;
    }

    if (fullName) user.fullName = fullName;
    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (webSite) user.webSite = webSite;

    await user.save();

    sendSuccess(res, {
      fullName: user.fullName,
      username: user.username,
      bio: user.bio,
      webSite: user.webSite,
      profileImage: user.profileImage,
    }, "Profile updated successfully");
  } catch (error) {
    sendError(res, "Error updating profile", 500, error);
  }
};


export const getAllUsers = async (_req: any, res: any) => {
  try {
    const users = await User.find().select("username fullName profileImage");
    // console.log(users)
    return sendSuccess(res, { users })
  } catch (error: any) {
    return sendError(res, "Error fetching users", 500, error);
  }
};



