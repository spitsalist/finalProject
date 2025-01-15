import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export const DropMenu = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        left: "250px",
        top: 0,
        width: "250px",
        height: "100vh",
        backgroundColor: "#fff",
        borderRight: "1px solid #EFEFEF",
        borderTopRightRadius: "10px",
        borderBottomRightRadius: "10px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "-2px 0px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: "35px", marginTop: "2px" }}>
        {title}
      </Typography>

        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: "10px",
            top: "20px",
          }}
        >
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      <Box sx={{flex:1, overflowY: 'auto'}}>{children}</Box>
    </Box>
  );
};