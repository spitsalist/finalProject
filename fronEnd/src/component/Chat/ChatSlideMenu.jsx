import React from "react";
import { Box } from "@mui/material";
import { Chat } from "./Chat";

export const ChatSlideMenu = ({ isOpen }) => {
  if (!isOpen) return null;

  const currentUserId = localStorage.getItem("userId");
  if (!currentUserId) {
    console.error("Current user ID not found in localStorage");
    return <p>Error: User not logged in</p>;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "80vw",
        height: "100vh",
        backgroundColor: "#fff",
        zIndex: 1200,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <Chat currentUserId={currentUserId} />
    </Box>
  );
};
