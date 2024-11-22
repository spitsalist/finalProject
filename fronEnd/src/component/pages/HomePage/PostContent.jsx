import React, { useState } from "react";
import { CardContent, Divider, Typography, Box, IconButton, Modal } from "@mui/material";
import { PostActions } from "./PostActions";
import { useNotifications } from "../../Notification/NotificationContext"; 
import msgIco from "../../../assets/msg_ico.svg";
import { PostModal } from "../modal/PostModal";

export const PostContent = ({
  user,
  caption,
  commentsCount,
  postId,
  postImage, 
  initialLikesCount,
  initialLiked,
}) => {
  const { createNotification } = useNotifications(); 
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLiked, setIsLiked] = useState(initialLiked)
  // console.log(initialLiked)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleLikeClick = (newLikeState) => {
    setIsLiked(newLikeState.isLiked);
    setLikesCount(newLikeState.likesCount);

    if (newLikeState.isLiked) {
      createNotification({
        content: `${user?.username || ""} liked your post!`,
        postId,
        type: "like",
        postImage, 
      });
    }
  };
  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)
  const isFollowing = true;

  const maxLength = 50;
  const isCaptionTruncated = caption && caption.length > maxLength;
  const shortCaption = isCaptionTruncated ? caption.slice(0, maxLength) : caption;

  return (
    <>
      <CardContent sx={{ padding: 1 }}>
        {/* <PostMedia image={postImage} onClick={handleOpenModal} /> */}
        
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PostActions
              postId={postId}
              initialLikesCount={likesCount}
              initialLiked={isLiked}
              onLikeToggle={handleLikeClick} 
            />
            <IconButton onClick={handleOpenModal} sx={{ padding: 0 }}>
              <img src={msgIco} alt="Message Icon" />
            </IconButton>
          </Box>
          <Typography variant="inherit" color="#262626" sx={{ fontWeight: "bold" }}>
            {likesCount} {likesCount === 1 ? "like" : "likes"}
          </Typography>
        </Box>

        <Typography variant="body2" component="p">
          <strong>{user?.username || ""}</strong> {shortCaption || ""}
          {isCaptionTruncated && (
            <span
              style={{ color: "grey", cursor: 'pointer' }}
              onClick={handleOpenModal}
            >
              {' '}... more
            </span>
          )}
        </Typography>

        <Typography variant="caption" color="textSecondary">
          View all {commentsCount || 0} comments
        </Typography>

        <Divider sx={{ flex: 1, mt: 3 }} />

      </CardContent>
      
      <PostModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        postId={postId}
        user={user}
        caption={caption}
        likesCount={likesCount}
        isLiked={isLiked}
        postImage={postImage}
        commentsCount={commentsCount}
        initialFollowing={isFollowing ? 'true' : 'false'}
        currentUserId='userA'
      />
    </>
  );
};