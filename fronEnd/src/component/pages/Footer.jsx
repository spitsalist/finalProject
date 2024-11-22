import React from "react";
import { Box,  Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();

  const footerItems = [
    { label: "Home", path: "/home" },
    { label: "Search", path: "/search" },
    { label: "Explore", path: "/explore" },
    { label: "Messages", path: "/messages" },
    { label: "Notifications", path: "/notifications" },
    { label: "Create", path: "/create" },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        height: '100px',
        padding: '20px',
        width: "100%",
        backgroundColor: "#fff",
        // padding: "10px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        left: 0,
        right:0,
        zIndex:2000,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        {footerItems.map((item, index) => (
          <Typography
            key={index}
            variant="body2"
            onClick={() => navigate(item.path)}
            sx={{
              cursor: "pointer",
              color: "#737373",
              fontWeight: 500,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            {item.label}
          </Typography>
        ))}
      </Box>

      <Typography
        variant="body2"
        sx={{
          marginTop: "32px",
          color: "#aaa",
          fontSize: "12px",
          textAlign: "center",
        }}
      >
        © 2024 ICHgram.
      </Typography>
    </Box>
  );
};