import React from "react";
import { Box } from "@mui/material";
import { Chat } from "./Chat";

export const ChatSlideMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
      <Chat currentUserId={localStorage.getItem("userId")} />
    </Box>
  );
};