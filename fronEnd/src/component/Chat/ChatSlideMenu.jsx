import React from "react";
import { Box } from "@mui/material";
import { Chat } from "./Chat";

// export const ChatSlideMenu = ({ isOpen }) => {
//   if (!isOpen) return null;

//   return (
//     <Box
//       sx={{
//         position: "fixed",
//         top: 0,
//         right: 0,
//         width: "80vw",
//         height: "100vh",
//         backgroundColor: "#fff",
//         zIndex: 1200,
//         boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//         // display: "flex", 
//         // flexDirection: "column",
//       }}
//     >
//       <Chat currentUserId={localStorage.getItem("userId")} />
//     </Box>
//   );
// };




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




// import React, { useState, useEffect } from "react";
// import { fetchUsers } from "../../api/auth"; // Предполагаем, что есть API для получения текущего пользователя
// import { Chat } from "./Chat";
// import { Box } from "@mui/material";

// export const ChatSlideMenu = ({ isOpen }) => {
//   const [currentUserId, setCurrentUserId] = useState(null);

//   useEffect(() => {
//     const loadCurrentUser = async () => {
//       try {
//         const response = await fetchUsers();
//         setCurrentUserId(response.id); // Установите текущего пользователя
//       } catch (error) {
//         console.error("Failed to fetch current user:", error);
//       }
//     };

//     loadCurrentUser();
//   }, []);

//   if (!isOpen) return null;

//   return (
//     <Box
//       sx={{
//         position: "fixed",
//         top: 0,
//         right: 0,
//         width: "80vw",
//         height: "100vh",
//         backgroundColor: "#fff",
//         zIndex: 1200,
//         boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//       }}
//     >
//       {currentUserId ? (
//         <Chat initialUserId={currentUserId} />
//       ) : (
//         <p>Loading current user...</p>
//       )}
//     </Box>
//   );
// };



// import React, { useState, useEffect } from "react";
// import { Box } from "@mui/material";
// import { Chat } from "./Chat";
// import { useNavigate } from "react-router-dom";

// export const ChatSlideMenu = ({ isOpen }) => {
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const userId = localStorage.getItem("userId");
//     console.log("Retrieved userId from localStorage:", userId);
//     if (userId) {
//       setCurrentUserId(userId);
//     } else {
//       console.error("Error: userId is not set in localStorage.");
//       navigate("/login"); // Перенаправляем пользователя на страницу входа
//     }
//     setLoading(false);
//   }, [navigate]);

//   if (!isOpen) return null;

//   return (
//     <Box
//       sx={{
//         position: "fixed",
//         top: 0,
//         right: 0,
//         width: "80vw",
//         height: "100vh",
//         backgroundColor: "#fff",
//         zIndex: 1200,
//         boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//       }}
//     >
//       {loading ? (
//         <p>Loading...</p>
//       ) : currentUserId ? (
//         <Chat currentUserId={currentUserId} />
//       ) : (
//         <p>User not logged in</p>
//       )}
//     </Box>
//   );
// };