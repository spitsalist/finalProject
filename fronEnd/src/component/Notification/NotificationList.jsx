import React, { useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useNotifications } from "./NotificationContext";
import { PostModal } from "../pages/modal/PostModal";
import { PostMedia } from "../pages/HomePage/PostMedia";
import { usePosts } from "../../context/PostContext";

export const NotificationList = () => {
  const { posts, postImage } = usePosts();
  console.log("Posts from PostContext:", posts);
  const { notifications, markAsRead, setNotifications, setUnreadCount, unreadCount } = useNotifications();
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);



  const handleNotificationClick = async (notif) => {
    console.log("Notification clicked:", notif);
    try {
      await markAsRead(notif._id);
  
      const relatedPostId = notif.relatedPost?._id;
      const relatedPost = posts.find((post) => post._id === relatedPostId);
  
      if (relatedPost) {
        console.log("Selected Post:", relatedPost);
        setSelectedPost({
          ...relatedPost, 
          postId: relatedPost._id,
          // postImage: notif.relatedPost.image || notif.relatedPost.postImage
          postImage: relatedPost.image
    });
      } else {
        setSelectedPost({
          user: notif.relatedUser,
          caption: notif.content,
          postId: notif._id,
          likesCount: 0,
          postImage: notif.relatedUser?.profileImage || undefined
        });
      }
  
      setIsModalOpen(true);  
      console.log("Setting isModalOpen to true");
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  const handleCloseModal = () => {
    console.log("Closing Modal...");
    setIsModalOpen(false);
    setSelectedPost(null);
  };


  return (
    <>
      <Box sx={{ maxHeight: "425px", overflowY: "auto" }}>
        {notifications && notifications.length > 0 ? (
          [...notifications]
            .sort((a, b) => (a.isRead === b.isRead ? 0 : a.isRead ? 1 : -1))
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
                    "&:hover": {
                      transform: "translateX(2px)",
                    },
                  }}
                  onClick={async () => {
                    try {
                      await handleNotificationClick(notif);
                      setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
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
                    <Box>
                      <Typography variant="body3" color="#262626">
                        {notif.content}
                      </Typography>
                    </Box>
                  </Box>
                  {notif.relatedPost?.postImage && (
                    <Box sx={{ marginLeft: "10px" }}>
                      < PostMedia
                        image={notif.relatedPost.postImage}
                        alt={notif.relatedPost?.user?.username || "Post Image"}
                        style={{ width: "30px", height: "30px", borderRadius: "8px" }}
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
          postId={selectedPost.postId || selectedPost._id}
          user={selectedPost.user}
          caption={selectedPost.caption}
          likesCount={selectedPost.likesCount}
          postImage={selectedPost.postImage}
          currentUserId="userA"
        />
      )}
    </>
  );
};