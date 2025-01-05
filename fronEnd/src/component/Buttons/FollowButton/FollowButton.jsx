import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { useFollow } from "../../../context/FollowContext";

export const FollowButton = ({ userId, username, initialFollowing }) => {
  const { followingState, toggleFollow, loadingState } = useFollow();
  const isFollowing = followingState[userId] ?? initialFollowing ?? false;
  const isLoading = loadingState[userId] ?? false;

  const handleFollowClick = () => {
    if (!isLoading) { 
      toggleFollow(userId, username); 
    }
  };

  return (
    <Button onClick={handleFollowClick} disabled={isLoading}>
      {isLoading ? (
        <CircularProgress size={16} /> 
      ) : isFollowing ? (
        "Unfollow"
      ) : (
        "Follow"
      )}
    </Button>
  );
};
