import React, { useState } from "react";
import { Box, IconButton, InputBase, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { searchUsers } from "../../api/auth";
import { Link } from "react-router-dom";
import { useUser } from "../../context/userContext";

export const DropMenu = ({ title, isOpen, onClose, children }) => {
  const {user} = useUser()
  const currentUserId = user?._id 
  // console.log('currend user id', currentUserId)
  const [query, setQuery] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [isLoading, setLoading] = useState(false)

  const handleSearchChange = async (event) => {
    const searchTerm = event.target.value;
    setQuery(searchTerm);

    if (searchTerm.trim() && currentUserId) {
      try {
        setLoading(true)
        const response = await searchUsers(searchTerm)
        const users = Array.isArray(response.users) ? response.users : []
        const filtredUsers = users.filter((user) => user._id !== currentUserId)
        // console.log('filtred user', filtredUsers)
        setUserResults(filtredUsers);
      } catch (error) {
        console.error("Error searching users:", error);
        setUserResults([]);

      }finally{
        setLoading(false)
      }
    } else {
      setUserResults([]);
    }
  }

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

      <Box sx={{ position: "relative", marginBottom: "20px" }}>
        <InputBase
          placeholder="Search"
          value={query}
          onChange={handleSearchChange}
          sx={{
            width: "100%",
            padding: "5px",
            paddingRight: "40px",
            background: "#EFEFEF",
            borderRadius: "4px",
            border: "0.5px solid #fff",
            transition: "border-color 0.3s ease, border-radius 0.3s ease",
            "&:hover": {
              backgroundColor: "#fff",
              borderColor: "#ccc",
              borderRadius: "6px",
            },
            "&:focus": {
              borderColor: "#0066FF",
            },
          }}
        />

        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            padding: "5px",
          }}
        >
          <CloseIcon sx={{ fontSize: "14px" }} />
        </IconButton>
      </Box>

      <Box sx={{flex:1, overflowY: 'auto'}}>
        {isLoading ? (
          <Typography sx={{textAlign: 'center', marginTop: '20px'}}>Loading...</Typography>
        ) :
        userResults.length > 0 ? (
          userResults.map((user) => (
            <Link
              key={user._id}
              to={`/profile/${user._id}`} 
              style={{
                textDecoration: "none",
                display: "block",
                color: "inherit",
              }}
            >
              <Typography
                sx={{
                  padding: "8px 0",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#FAFAFA",
                  },
                }}
              >
                {user.fullName}
              </Typography>
            </Link>
          ))
        ) : (
          <Typography sx={{ color: "#aaa" }}>No users found</Typography>
        )}
      </Box>

      <Box>{children}</Box>
    </Box>
  );
};







