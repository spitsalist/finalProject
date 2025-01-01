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