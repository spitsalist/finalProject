import React, { useState } from "react";
import { IconButton, Box } from "@mui/material";
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { likePost, unlikePost } from "../../../api/auth";

export const PostActions = ({ postId, initialLiked = false, onLikeToggle }) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLikeToggle = async () => {
    if (isUpdating || !postId) return;

    setIsUpdating(true);
    try {
      const response = await (isLiked ? unlikePost(postId) : likePost(postId));
      const newState = response.data;

      setIsLiked(newState.isLiked);
      onLikeToggle?.(newState);
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0 }}>
      <IconButton onClick={handleLikeToggle} disabled={!postId || isUpdating}>
        {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
      </IconButton>
    </Box>
  );
};