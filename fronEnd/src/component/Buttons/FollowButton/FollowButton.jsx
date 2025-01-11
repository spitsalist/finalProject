import React,{useEffect} from "react";
import { Button, CircularProgress } from "@mui/material";
import { useFollow } from "../../../context/FollowContext";

export const FollowButton = ({ userId, username, initialFollowing }) => {
  const { followingState, toggleFollow, loadingState, setFollowingState } = useFollow();
  const isFollowing = followingState[userId] ?? false;
  const isLoading = loadingState[userId] ??

  useEffect(() => {
    if(followingState[userId] === undefined && initialFollowing !== undefined)
      setFollowingState((prev) => ({...prev, [userId]: initialFollowing}))
  }, [userId, initialFollowing, followingState, setFollowingState])

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
