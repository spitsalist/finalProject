import { Box, Avatar, Typography } from "@mui/material";

export const ChatHeader = ({ selectedUserInfo }) => {
  if (!selectedUserInfo) return null;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "8px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <Avatar
        src={selectedUserInfo.profileImage}
        alt={selectedUserInfo.username}
        sx={{ width: 48, height: 48, marginRight: "16px" }}
      />
      <Typography variant="h6">{selectedUserInfo.username}</Typography>
    </Box>
  );
};