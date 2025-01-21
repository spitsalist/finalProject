import React, { useEffect, useRef, useState } from "react";
import { Modal, Box, Typography, TextField, Button, InputAdornment } from "@mui/material";
import { PostMedia } from "../HomePage/PostMedia";
import { FollowButton } from "../../Buttons/FollowButton/FollowButton";
import { useComments } from "../../../hooks/useComments";
import { Comment } from "../Comment/Comment"; 
import { ChatEmojiPicker } from "../../Chat/ChatEmojiPicker";
import { useNavigate } from "react-router-dom";

const UserAvatar = ({ profileImage, size = "40px", altText = "User Avatar" }) => (
  <img
    src={profileImage}
    alt={altText}
    style={{ width: size, height: size, borderRadius: "50%", marginRight: "8px", cursor:'pointer' }}
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
  currentUserId,
  commentId,
}) => {
  const navigate = useNavigate()
  const handleNavigateToProfile =()=>{
    navigate(`/profile/${user._id}`)
  }
  const [newComment, setNewComment] = useState("");
  const {
    comments,
    loading,
    error,
    addNewComment,
    toggleLikeComment,
  } = useComments(postId, currentUserId, commentId);

  const commentsContainerRef = useRef(null)
  useEffect(() => {
    if(commentsContainerRef.current){
      commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight
    }
  }, [comments])

  const handleAddComment = async (parentCommentId = null) => {
    await addNewComment(newComment, parentCommentId);
    setNewComment("");
  };

  const renderComments = (parentId = null) => {
    if (!Array.isArray(comments)) return null;

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
        isLiked={comment.isLiked}
        onUsernameClick={handleNavigateToProfile}
      />
    ));
  };

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          display: "flex",
          width: "850px",
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
            <Typography variant="h6" onClick={handleNavigateToProfile} sx={{cursor:'pointer', transition: 'color 0.3 ease', '&:hover': {color:'primary.main'}}}>
              <strong>{user?.username}</strong>
            </Typography>
            <FollowButton userId={user._id} username={user.username} />
          </Box>
          <Typography variant="body2" sx={{ marginBottom: "10px" }}>
            {caption}
          </Typography>

          <Box 
          ref={commentsContainerRef}
          sx={{ flexGrow: 1, overflowY: "auto", marginBottom: "10px", maxHeight:'240px' }}>
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
              <strong>{likesCount}</strong> {likesCount === 1 ? "like" : "likes"}
            </Typography>
            <TextField
              fullWidth
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                  <ChatEmojiPicker setNewMessage={setNewComment} />
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleAddComment()}
                      disabled={!newComment.trim()}
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