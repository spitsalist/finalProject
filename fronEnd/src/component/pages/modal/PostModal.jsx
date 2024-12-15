import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button, InputAdornment } from "@mui/material";
import { fetchComments, addComment, likeComment } from "../../../api/auth";
import { PostMedia } from "../HomePage/PostMedia";
import { FollowButton } from "../../Buttons/FollowButton/FollowButton";

const UserAvatar = ({ profileImage, size = "40px", altText = "User Avatar" }) => (
  <img
    src={profileImage || "default-avatar.png"}
    alt={altText}
    style={{ width: size, height: size, borderRadius: "50%", marginRight: "8px" }}
  />
);

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
            {comment.user?.username || "Unknown User"}
          </Typography>
          <Button size="small" onClick={() => onLike(comment._id)}>
            ❤️ {comment.likesCount || 0}
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

export const PostModal = ({
  isOpen,
  onClose,
  postId,
  user,
  caption,
  postImage,
  likesCount,
  initialFollowing,
  currentUserId
}) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadComments = async () => {
    if (!postId) return;

    setLoading(true);
    setError("");

    try {
      const commentsData = await fetchComments(postId);
      if (commentsData.status === "success" && Array.isArray(commentsData.data?.comments)) {
        setComments(commentsData.data.comments);
      } else {
        setComments([]);
        setError("Failed to load comments.");
      }
    } catch {
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (parentCommentId = null) => {
    if (!newComment.trim()) return;
  
    try {
      const response = await addComment(postId, newComment, parentCommentId);
      if (response.status === "success" && response.data?.comment) {
        setComments((prev) => [...prev, response.data.comment]);
        setNewComment("");
      } else {
        throw new Error(response.message || "Invalid response structure");
      }
    } catch (err) {
      setError(err.message || "Failed to add comment.");
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await likeComment(commentId);
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, likesCount: (comment.likesCount || 0) + 1 }
            : comment
        )
      );
    } catch (err) {
      console.error("Failed to like comment:", err);
    }
  };

  const getReplies = (parentId) =>
    comments.filter((comment) => String(comment.parentComment) === String(parentId));

  const renderComments = (parentId = null) => {
    const filteredComments = getReplies(parentId);
  
    return filteredComments.map((comment) => (
      <Comment
        key={comment._id}
        comment={comment}
        currentUserId={currentUserId} 
        onReply={(id) => handleAddComment(id)}
        onLike={handleLikeComment}
        renderReplies={(id) => renderComments(id)}
      />
    ));
  };

  useEffect(() => {
    if (isOpen) loadComments();
  }, [isOpen, postId]);

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          display: "flex",
          width: "70%",
          maxWidth: "1000px",
          height: "60vh",
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
            height: "100%",
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
              flexShrink: 0,
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
            initialFollowing={initialFollowing ? 'true' : 'false'} 
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

          <Box sx={{ flexShrink: 0, paddingTop: "10px" }}>
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