import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { chatSocket } from "../../api/auth";
import { useChat } from "../../hooks/useChat";
import { ChatHeader } from "./ChatHeader";
import { MessagesList } from "./MessagesList";
import { useUser } from "../../context/userContext";
import { useNavigate, useParams } from "react-router-dom";

export const Chat = () => {
  const {id: paramUserId} = useParams()
  const {user} = useUser()
  const currentUserId = user?._id
  const [newMessage, setNewMessage] = useState("");
  const chatBoxRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    chatSocket.on("connect", () => {
      console.log("Socket connected:", chatSocket.id);
    });

    return () => {
      chatSocket.off("connect");
    };
  }, []);

  useEffect(() => {
    if (paramUserId) {
      chatSocket.emit("chatOpened", { chatUserId: paramUserId });
    }
  }, [paramUserId]);

  const { users, messages, selectedUserInfo, setMessages } = useChat(
    currentUserId,
    paramUserId
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !paramUserId) {
      console.error("Recipient ID or message is missing");
      return;
    }

    chatSocket.emit("sendMessage", { recipientId: paramUserId, message: newMessage }, (response) => {
      if (response.success) {
        setNewMessage("");
      } else {
        console.error("Error sending message:", response.error);
      }
    });
  };

  useEffect(() => {
    if (chatBoxRef.current && messages.length) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight; 
    }
  }, [messages]);

  if(!paramUserId){
    return <Box p={2}>Please select a user to Chat with.</Box>
  }

  return (
    <Box sx={{ height: "100vh", overflowY: "auto" }}>
      {paramUserId && (
        <Box
          sx={{
            position: "fixed",
            left: "540px", 
            top: 0,
            right: 0,
            height: "85vh",
            backgroundColor: "#fff",
            // zIndex: 1200,
            display: "flex",
            flexDirection: "column",
            borderLeft: '1px solid #ccc',
          }}
        >
          <ChatHeader
            selectedUserInfo={selectedUserInfo}
            onClose={() => navigate('/home')} 
          />
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
            }}
          >
            <MessagesList
              messages={messages}
              currentUserId={currentUserId}
              selectedUserInfo={selectedUserInfo}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
              chatBoxRef={chatBoxRef}
              setMessages={setMessages}
              users={users}
              user={user}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};