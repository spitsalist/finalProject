import React, { useState } from "react";
import { IconButton, Box } from "@mui/material";
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { likePost, unlikePost } from "../../../api/auth";

export const PostActions = ({ postId, initialLikesCount, initialLiked, onLikeToggle }) => {
  const [likesCount, setLikesCount] = useState(initialLikesCount || 0);
  // console.log(initialLiked)
  const [isLiked, setIsLiked] = useState(initialLiked || false);

  const handleLikeToggle = async () => {

    try {
      if (isLiked) {
        await unlikePost(postId);
        setLikesCount((prev) => prev - 1);
      } else {
        await likePost(postId);
        setLikesCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
      onLikeToggle({ isLiked: !isLiked, likesCount });
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0 }}>
      <IconButton onClick={handleLikeToggle} disabled={!postId}>
        {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
      </IconButton>
 
    </Box>
  );
};

