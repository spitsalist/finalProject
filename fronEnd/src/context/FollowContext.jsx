import React, { createContext, useContext, useState } from "react";
import { followUser, unfollowUser } from "../api/auth";

const FollowContext = createContext();

export const FollowProvider = ({ children }) => {
  const [followingState, setFollowingState] = useState({});
  const [loadingState, setLoadingState] = useState({});

  const toggleFollow = async (userId, username) => {
    try {
      setLoadingState((prev) => ({ ...prev, [userId]: true }));
      const isFollowing = followingState[userId] || false;
      if (isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId, username);
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
    <FollowContext.Provider value={{ followingState, setFollowingState, toggleFollow, loadingState }}>
      {children}
    </FollowContext.Provider>
  );
};

export const useFollow = () => {
  return useContext(FollowContext);
};