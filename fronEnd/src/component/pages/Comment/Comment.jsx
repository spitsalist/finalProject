import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";

const UserAvatar = ({ profileImage, size = "40px", altText = "User Avatar" }) => (
  <img
    src={profileImage}
    alt={altText}
    style={{ width: size, height: size, borderRadius: "50%", marginRight: "8px" }}
  />
);

export const Comment = ({
  comment,
  currentUserId,
//   onReply,
  onLike,
  renderReplies,
  isLiked
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const isAuthor = comment.user._id === currentUserId;
//   const canReply =
//     !isAuthor ||
//     (isAuthor && comment.replies?.some((reply) => reply.user._id !== currentUserId));

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
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
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

      {/* {canReply && (
        <Button size="small" onClick={() => onReply(comment._id)} sx={{ mt: 1 }}>
          Reply
        </Button>
      )} */}

      {renderReplies(comment._id)}
    </Box>
  );
};