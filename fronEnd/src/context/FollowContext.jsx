import React, { createContext, useContext, useEffect, useState } from "react";
import { followUser, unfollowUser } from "../api/auth";

const FollowContext = createContext();

export const FollowProvider = ({ children, initialFollowing ={} }) => {
  const [followingState, setFollowingState] = useState(initialFollowing);
  const [loadingState, setLoadingState] = useState({});

  useEffect(() =>{
    
  })

  const toggleFollow = async (userId) => {
    console.log("API Request Data:", { userId });
    try {
      setLoadingState((prev) => ({ ...prev, [userId]: true }));
      const isFollowing = followingState[userId] || false;
      if (isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }

      setFollowingState((prev) => ({
        ...prev,
        [userId]: !isFollowing,
      }));
    } catch (error) {
      console.error("Error toggling follow state", error);
    } finally {
      setLoadingState((prev) => ({ ...prev, [userId]: false }));
    }
  }

  return (
    <FollowContext.Provider value={{ followingState,setFollowingState,  toggleFollow, loadingState }}>
      {children}
    </FollowContext.Provider>
  );
};

export const useFollow = () => {
  return useContext(FollowContext);
};