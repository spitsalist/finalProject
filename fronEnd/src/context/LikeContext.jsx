import { createContext, useContext, useState } from 'react';
import { likePost, unlikePost } from '../api/auth';

const LikeContext = createContext()

export const LikeProvider =({children}) =>{
    const [likeStates, setLikeStates] = useState({})

    const toggleLike = async (postId) => {
        try {
            const isLiked = likeStates[postId]?.isLiked || false;
            console.log(`Toggling like for postId: ${postId}, current state: ${isLiked}`);
    
            const response = await (isLiked ? unlikePost(postId) : likePost(postId));
            console.log('API response for toggleLike:', response);
    
            if (response.status === 'success') {
                const { likesCount, isLiked: updatedIsLiked } = response.data;
    
                setLikeStates((prev) => {
                    const updatedStates = {
                        ...prev,
                        [postId]: { likesCount, isLiked: updatedIsLiked },
                    };
                    // console.log("Updated likeStates after toggle:", updatedStates);
                    return updatedStates;
                });
            } else {
                throw new Error('Failed to toggle like');
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };
    console.log("LikeContext current state:", { likeStates });

    return (
        <LikeContext.Provider value={{likeStates, toggleLike, setLikeStates}}>
            {children}
        </LikeContext.Provider>
    )
}
export const useLike = ()  => useContext(LikeContext)