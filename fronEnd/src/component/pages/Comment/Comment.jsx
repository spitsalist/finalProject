import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";

const UserAvatar = ({ profileImage, size = "40px", altText = "User Avatar" }) => (
  <img
    src={profileImage}
    alt={altText}
    style={{ width: size, height: size, borderRadius: "50%", marginRight: "8px", cursor:'pointer' }}
  />
);

export const Comment = ({
  comment,
  currentUserId,
  onLike,
  renderReplies,
  isLiked,
  onUsernameClick
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

   comment.user._id === currentUserId;

  const handleLike = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onLike(comment._id);
    } catch (error) {
      console.error("error liking comment", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box key={comment._id} sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="body2" sx={{ fontWeight: "bold", cursor:'pointer', transition: 'color 0.3 ease','&:hover': {color:'primary.main'} }}
        onClick={() => onUsernameClick(comment.user._id)}
        >
          <UserAvatar profileImage={comment.user?.profileImage} size="24px" />
          {comment.user?.username}
        </Typography>
        <Button
          size="small"
          onClick={handleLike}
          disabled={isProcessing}
          style={{
            color: isLiked ? "red" : "gray",
          }}
        >
          ❤️ {comment.likeCounter > 0 ? comment.likeCounter : ""}
        </Button>
      </Box>

      <Typography variant="body2">{comment.text}</Typography>

      {renderReplies(comment._id)}
    </Box>
  );
};