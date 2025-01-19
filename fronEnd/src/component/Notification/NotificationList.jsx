import React, { useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useNotifications } from "./NotificationContext";
import { PostModal } from "../pages/modal/PostModal";
import { PostMedia } from "../pages/HomePage/PostMedia";
import {  Link } from "react-router-dom";

export const NotificationList = () => {

  const { notifications, markAsRead, setNotifications, setUnreadCount, unreadCount } = useNotifications();
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNotificationClick = async (notif) => {
    if (notif.type === "follow") {
      return;
    }
    // console.log('notif:', notif)
    try {
      await markAsRead(notif._id);
  
      const modalData = {
        postId: notif.relatedPost?._id || null,
        user: notif.relatedUser || notif.user || {},
        // commentId: notif.relatedComment?._id || null,
        // commentText: notif.relatedComment?.text || "No comment text available",

        // caption: notif.relatedPost?.caption || "No caption available",
        postImage: notif.relatedPost?.image || null,
        likesCount: notif.relatedPost?.likes?.length || 0,
      };
      // console.log("Modal Data", modalData);

      setSelectedPost(modalData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error handling notification click", error);
    }
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null); 
  };

  return (
    <>
      <Box sx={{ maxHeight: "485px", overflowY: "auto" }}>
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
                    backgroundColor: notif.isRead ? "#fff" : "#EEF0F0",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": { transform: "translateX(2px)" },
                  }}
                  onClick={async (e) => {
                    if (notif.type !== "follow") {
                      e.preventDefault()
                    }
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
              {notif.type === "follow" ? (
                <Typography variant="body3">
                  <Link
                    to={`/profile/${notif.relatedUser?._id}`}
                    style={{ textDecoration: "none", color:'#262626' }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {notif.content}
                  </Link>{' '}
                </Typography>
              ) : (
                <Typography variant="body3">{notif.content}</Typography>
              )}                  </Box>
                  {notif.relatedPost?.image && (
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        overflow: "hidden",
                        borderRadius: "4px",
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

      {isModalOpen && selectedPost && (
  <PostModal
    isOpen={isModalOpen}
    onClose={handleCloseModal}
    // commentId={selectedPost.commentId}
    postId={selectedPost.postId}
    user={selectedPost.user}
    // caption={selectedPost.caption}
    postImage={selectedPost.postImage}
    likesCount={selectedPost.likesCount}
    currentUserId='userA'
  />
)}
    </>
  );
};
