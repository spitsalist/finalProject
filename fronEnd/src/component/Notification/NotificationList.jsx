import React, { useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useNotifications } from "./NotificationContext";
import { PostModal } from "../pages/modal/PostModal";
import { PostMedia } from "../pages/HomePage/PostMedia";
import { usePosts } from "../../context/PostContext";
import { useNavigate } from "react-router-dom";
import { useFollow } from "../../context/FollowContext";

export const NotificationList = () => {
  const { posts } = usePosts();
  const { notifications, markAsRead, setNotifications, setUnreadCount, unreadCount } = useNotifications();
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { followingState } = useFollow();

  const navigate = useNavigate();

  const handleNotificationClick = async (notif) => {
    try {
      await markAsRead(notif._id);

      if (notif.type === "follow") {
        navigate(`/profile/${notif.relatedUser._id}`);
        return;
      }

      const relatedPost = posts.find((post) => post._id === notif.relatedPost?._id);

      const userData = relatedPost?.user?._id 
      ? relatedPost?.user
      : notif.relatedUser;
      setSelectedPost({
      postId: relatedPost?._id || notif.relatedPost?._id,
      postImage: relatedPost?.image || notif.relatedPost?.image || null,
      likesCount: relatedPost?.likes?.length || 0,
      comments: relatedPost?.comments || [],
      caption: notif.content,
      user: userData,
    });

      setIsModalOpen(true);
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <>
      <Box sx={{ maxHeight: "425px", overflowY: "auto" }}>
        {notifications && notifications.length > 0 ? (
          [...notifications]
            .sort((a, b) => a.isRead === b.isRead ? 0 : a.isRead ? 1 : -1)
            .map((notif, index) => {
              const notificationId = notif._id || `notif-${index}`;
              return (
                <Box
                  key={notificationId}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px",
                    marginTop: "5px",
                    backgroundColor: notif.isRead ? "#fff" : "#f0f0f0",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": { transform: "translateX(2px)" },
                  }}
                  onClick={async () => {
                    try {
                      await handleNotificationClick(notif);
                      // setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
                      setNotifications((prev) => {
                        const updated = prev.map(n => 
                          n._id === notif._id ? {...n, isRead: true} : n
                        );
                        updated.sort((a, b) => a.isRead - b.isRead);
                        return updated;
                      });
                      setUnreadCount((prevCount) => prevCount - 1);
                    } catch (error) {
                      console.error("Error deleting notification", error);
                    }
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <Avatar
                      src={notif.relatedUser?.profileImage}
                      alt={notif.relatedUser?.username}
                      sx={{ width: 30, height: 30, marginRight: "10px" }}
                    />
                    <Typography variant="body3">{notif.content}</Typography>
                  </Box>
                  {notif.relatedPost?.image && (
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        overflow: "hidden",
                        borderRadius: "8px",
                        marginLeft: "10px",
                      }}
                    >
                      <PostMedia
                        image={notif.relatedPost?.image}
                        alt="Post Image"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  )}
                </Box>
              );
            })
        ) : (
          <Typography sx={{ textAlign: "center" }}>
            {unreadCount > 0
              ? `You have ${unreadCount} unread notifications`
              : "No new notifications"}
          </Typography>
        )}
      </Box>

      {selectedPost && (
        <PostModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          {...selectedPost}
          initialFollowing={followingState}
          // currentUserId="userA"
        />
       )} 
    </>
  );
};