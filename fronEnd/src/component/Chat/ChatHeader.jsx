import { Box, Avatar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const ChatHeader = ({ selectedUserInfo }) => {
  const navigate = useNavigate()
  if (!selectedUserInfo) return null;
  const handleNavigateToProfile =()=>{
    navigate(`/profile/${selectedUserInfo._id}`)
  }
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
        sx={{ width: 48, height: 48, marginRight: "16px", cursor:'pointer', transition:'opacity 0.3s ease', '&:hover': { opacity: 0.7} }}
        onClick={handleNavigateToProfile}
      />
      <Typography sx={{cursor:'pointer', transition: 'color 0.3 ease', '&:hover': {color:'primary.main'}}} onClick={handleNavigateToProfile} variant="h6">{selectedUserInfo.username}</Typography>
    </Box>
  );
};