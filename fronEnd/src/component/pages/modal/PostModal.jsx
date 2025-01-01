
const Comment = ({
    comment,
    currentUserId, 
    onReply,
    onLike,
    renderReplies,
  }) => {
    const isAuthor = comment.user._id === currentUserId; 
    const canReply = !isAuthor || (isAuthor && comment.replies?.some((reply) => reply.user._id !== currentUserId));
    
  
    return (
      <Box key={comment._id} sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            <UserAvatar profileImage={comment.user?.profileImage} size="24px" />
            {comment.user?.username}
          </Typography>
          <Button size="small" onClick={() => onLike(comment._id)}
             style={{
              color: comment.isLiked ? "red" : "gray",
            }}
            >
            ❤️ {comment.likeCounter > 0 ? comment.likeCounter : ''}
          </Button>
        </Box>
        <Typography variant="body2">{comment.text}</Typography>
        {canReply && (
          <Button size="small" onClick={() => onReply(comment._id)} sx={{ mt: 1 }}>
            Reply
          </Button>
        )}
        {renderReplies(comment._id)}
      </Box>
    );
  };





import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button, InputAdornment } from "@mui/material";
import { useComments } from "../../../hooks/useComments";
import { PostMedia } from "../HomePage/PostMedia";
import { FollowButton } from "../../Buttons/FollowButton/FollowButton";
// import { UserAvatar } from "./UserAvatar";
// import { Comment } from "./Comment";


const UserAvatar = ({ profileImage, size = "40px", altText = "User Avatar" }) => (
  <img
    src={profileImage}
    alt={altText}
    style={{ width: size, height: size, borderRadius: "50%", marginRight: "8px" }}
  />
);

export const PostModal = ({
  isOpen,
  onClose,
  postId,
  user,
  caption,
  postImage,
  likesCount,
  initialFollowing,
  currentUserId,
}) => {

//  console.log(postId)
  const [newComment, setNewComment] = useState("");
  const {
    comments,
    loading,
    error,
    addNewComment,
    toggleLikeComment,
  } = useComments(postId, currentUserId);

  const handleAddComment = async (parentCommentId = null) => {
    await addNewComment(newComment, parentCommentId);
    setNewComment("");
  };

  const renderComments = (parentId = null) => {
    const filteredComments = comments.filter(
      (comment) => String(comment.parentComment) === String(parentId)
    );

    return filteredComments.map((comment) => (
      <Comment
        key={comment._id}
        comment={comment}
        currentUserId={currentUserId}
        onReply={(id) => handleAddComment(id)}
        onLike={toggleLikeComment}
        renderReplies={(id) => renderComments(id)}
      />
    ));
  };

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          display: "flex",
          width: "800px",
          margin: "0 auto",
          marginTop: "50px",
          bgcolor: "background.paper",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: 24,
        }}
      >
        <Box
          sx={{
            flex: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "#f5f5f5",
          }}
        >
          {postImage ? (
            <PostMedia image={postImage} />
          ) : (
            <Typography variant="caption" color="textSecondary">
              No image available
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            flex: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "20px",
          }}
        >
          <Box
            sx={{
              borderBottom: "1px solid #ddd",
              paddingBottom: "10px",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <UserAvatar profileImage={user?.profileImage} altText={user?.username} />
            <Typography variant="h6">
              <strong>{user?.username}</strong>
            </Typography>
            <FollowButton
              userId={user._id}
              username={user.username}
              initialFollowing={initialFollowing}
            />
          </Box>
          <Typography variant="body2" sx={{ marginBottom: "10px" }}>
            {caption}
          </Typography>

          <Box sx={{ flexGrow: 1, overflowY: "auto", marginBottom: "10px" }}>
            {loading ? (
              <Typography>Loading comments...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              renderComments()
            )}
          </Box>

          <Box sx={{ paddingTop: "10px" }}>
            <Typography variant="body2" sx={{ marginBottom: "10px" }}>
              <strong>{likesCount}</strong> {likesCount ? "like" : "likes"}
            </Typography>
            <TextField
              fullWidth
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleAddComment()}
                    >
                      Send
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};