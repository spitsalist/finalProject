import bg from "../../assets/Background.svg";
import React from "react";
import { Box, Typography } from "@mui/material";
import { Footer } from "./Footer";

export const NotFoundPage = () => {

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 60px)", 
          textAlign: "left",
          width: "100%",
        }}
      >
        <Box
          sx={{
            flex: "1",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={bg}
            alt="Logo ICHgram"
            style={{
              maxWidth: "300px",
              height: "auto",
              borderRadius: "10px",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "20px",
            maxWidth: "500px",
          }}
        >
          <Typography
            variant="h4"
            sx={{ marginBottom: "10px", fontWeight: "bold", color: "#333" }}
          >
            Oops! Page Not Found (404 Error)
          </Typography>
          <Typography
            variant="body1"
            sx={{ marginBottom: "20px", color: "#737373" }}
          >
            We're sorry, but the page you're looking for doesn't seem to exist.
            If you typed the URL manually, please double-check the spelling.
            If you clicked on a link, it may be outdated or broken.
          </Typography>
        </Box>
      </Box>
      <Footer />
    </>
  );
};