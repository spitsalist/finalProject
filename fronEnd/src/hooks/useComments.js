import { useState, useEffect, useCallback } from "react";
import { fetchComments, addComment, likeComment } from "../api/auth";

export const useComments = (postId, currentUserId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadComments = useCallback(async () => {
    if (!postId) return;

    setLoading(true);
    setError("");

    try {
      const commentsData = await fetchComments(postId);
      if (commentsData.status === "success" && Array.isArray(commentsData.data?.comments)) {
        const enrichedComments = commentsData.data.comments.map((comment) => ({
          ...comment,
          isLiked: comment.isLiked ?? false,
          likeCounter: comment.likeCounter ?? 0,
          isOwner: comment.user === currentUserId
        }));
        setComments(enrichedComments);
      } else {
        setComments([]);
        setError("Failed to load comments.");
      }
    } catch (err) {
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const addNewComment = async (text, parentCommentId = null) => {
    if (!text.trim()) return;

    try {
      const response = await addComment(postId, text, parentCommentId);
      if (response.status === "success" && response.data?.comment) {
        setComments((prev) => [...prev, response.data.comment]);
      } else {
        throw new Error(response.message || "Invalid response structure");
      }
    } catch (err) {
      setError(err.message || "Failed to add comment.");
    }
  };

  const toggleLikeComment = async (commentId) => {
    try {
      const response = await likeComment(commentId);
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                isLiked: response.data.isLiked,
                likeCounter: response.data.likeCounter,
              }
            : comment
        )
      );
    } catch (err) {
      setError("Failed to like/unlike comment.");
    }
  };

  useEffect(() => {
    if (postId) loadComments();
  }, [postId, loadComments]);

  return {
    comments,
    loading,
    error,
    addNewComment,
    toggleLikeComment,
    loadComments,
  };
};