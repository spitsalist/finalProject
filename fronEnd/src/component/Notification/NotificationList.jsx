import React, { useContext } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { NotificationContext } from "./NotificationContext";
import { useNavigate } from "react-router-dom";
import { PostMedia } from "../pages/HomePage/PostMedia";

export const NotificationList = () => {
  const { notifications, markAsRead } = useContext(NotificationContext);
  const navigate = useNavigate();
  // console.log("Notifications:", notifications);

  const handleNotificationClick = async (notif) => {
    try {
      markAsRead(notif._id);
      let path = `/posts/${notif.relatedPost?._id || notif.relatedPost}`
      if (notif.relatedComment) {
        path += `?commentId=${notif.relatedComment}`;
      }
      navigate(path);
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  return (
    <Box sx={{ maxHeight: "425px", overflowY: "auto", padding: "10px" }}>
      {notifications && notifications.length > 0 ? (
        notifications.map((notif, index) => {
          const notificationId = notif._id || `notif-${index}`;
          return (
            <Box
              key={notificationId}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px",
                borderBottom: "1px solid #ddd",
                backgroundColor: notif.isRead ? "#f9f9f9" : "#fff",
                cursor: "pointer",
              }}
              onClick={() => handleNotificationClick(notif)}
            >
              <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                <Avatar
                  src={notif.relatedUser?.profileImage}
                  alt={notif.relatedUser?.username}
                  sx={{ width: 30, height: 30, marginRight: "10px" }}
                />
                <Box>
                  <Typography variant="body3" color="#262626">
                    {notif.content || "No content available"}
                  </Typography>
                </Box>
              </Box>

              {notif.relatedPost && notif.relatedPost.postImage &&(
                <Box sx={{ marginLeft: "10px" }}>
                  <PostMedia
                    image={notif.relatedPost.postImage}
                    alt="Post Image"
                    style={{ width: "30px", height: "30px", borderRadius: "8px" }}
                  />
                </Box>
              )}
            </Box>
          );
        })
      ) : (
        <Typography sx={{ textAlign: "center" }}>
          No new notifications
        </Typography>
      )}
    </Box>
  );
};