// // import { Follow } from "../../models/Follow";
// import { User } from "../../models/User";
// import { sendError } from "../helpers/responseHelper";

// export const getFollowersOfUser = async(userId:string) => {
//     const followers = await Follow.find({following: userId})
//     .populate('follower', 'username')
//     // console.log(followers)
//     return followers.map(f => f.follower)
// }

// export const getFollowingOfUser = async(userId: string) => {
//     const following = await Follow.find({follower: userId})
//     return following.map(f => f.following)
// }

// export const getFollowingIds = async(userId:string):Promise<string[]> => {
//     const followingList = await Follow.find({follower: userId})
//     .populate('following')
//     return followingList.map((f) => f.following._id.toString())
// }

// export const checkUserExists = async (userId: string,) => {
//     const user = await User.findById(userId)
//     if(!user){
//         sendError('User not found')
//     }
        
//     return user
// }

// export const checkFollowStatus = async(followerId:string, followingId: string) => {
//     return await Follow.findOne({follower: followerId, following: followingId})
// }


import { User } from "../../models/User";
import { sendError } from "../helpers/responseHelper";

export const getFollowersOfUser = async(userId: string) => {
    const user = await User.findById(userId).populate('followers', 'username');
    if (!user) {
        throw new Error('User not found');
    }
    return user.followers;
}

export const getFollowingOfUser = async(userId: string) => {
    const user = await User.findById(userId).populate('following', 'username');
    if (!user) {
        throw new Error('User not found');
    }
    return user.following;
}

export const getFollowingIds = async(userId: string): Promise<string[]> => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user.following.map(id => id.toString());
}

export const checkUserExists = async (userId: string) => {
    const user = await User.findById(userId);
    if(!user){
        throw new Error('User not found');
    }
    return user;
}

export const checkFollowStatus = async(followerId: string, followingId: string): Promise<boolean> => {
    const follower = await User.findById(followerId);
    if (!follower) throw new Error('Follower not found');
    return follower.following.map(id => id.toString()).includes(followingId);
}