import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { chatSocket } from "../../api/auth";
import { useChat } from "../../hooks/useChat";
import { UsersList } from "../UsersList";
import { ChatHeader } from "./ChatHeader";
import { MessagesList } from "./MessagesList";
import { useUser } from "../../context/userContext";

export const Chat = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const chatBoxRef = useRef(null)
  const {user} = useUser()

  useEffect(() => {
    chatSocket.on("connect", () => {
      console.log("Socket connected:", chatSocket.id);
    });

    chatSocket.emit("getCurrentUser", {}, (response) => {
      if (response.success) {
        setCurrentUserId(response.userId);
      } else {
        console.error("Error fetching current user ID:", response.error);
      }
    });

    return () => {
      chatSocket.off("connect");
      chatSocket.off("getCurrentUser");
    };
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      // console.log(selectedUserId);
      chatSocket.emit("chatOpened", { chatUserId: selectedUserId });
    }
  }, [selectedUserId]);

  const { users, messages, selectedUserInfo, setMessages } = useChat(
    currentUserId,
    selectedUserId
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUserId) {
      console.error("Recipient ID or message is missing");
      return;
    }

    chatSocket.emit("sendMessage", { recipientId: selectedUserId, message: newMessage }, (response) => {
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

  return (
    <Box sx={{ height: "100%", overflowY: "auto" }}>
      <UsersList
        users={users}
        selectedUserId={selectedUserId}
        onSelectUser={setSelectedUserId}
      />

      {selectedUserId && (
        <Box
          sx={{
            position: "fixed",
            left: "540px", 
            top: 0,
            right: 0,
            height: "85vh",
            backgroundColor: "#fff",
            zIndex: 1200,
            display: "flex",
            flexDirection: "column",
            borderLeft: '1px solid #ccc'
          }}
        >
          <ChatHeader
            selectedUserInfo={selectedUserInfo}
            onClose={() => setSelectedUserId(null)} 
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