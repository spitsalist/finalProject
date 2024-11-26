import React, { useState, useEffect } from "react";
import {
  joinChatRoom,
  sendChatMessage,
  subscribeToChatMessages,
  fetchMessages,
  fetchUsers,
} from "../../api/auth";
import { Box, List, ListItem, ListItemText } from "@mui/material";

export const Chat = ({ currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]); 
  const [recipientId, setRecipientId] = useState(null); 
  const [loadingMessages, setLoadingMessages] = useState(false); 

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    if (recipientId && currentUserId) {
      setLoadingMessages(true); 
      setMessages([]);
      joinChatRoom(currentUserId);
      fetchMessages(recipientId, currentUserId)
        .then((messages) => setMessages(messages))
        .catch((error) =>
          console.error("Error fetching messages:", error)
        )
        .finally(() => setLoadingMessages(false));
    }
  }, [recipientId, currentUserId]);

  useEffect(() => {
    subscribeToChatMessages((message) => {
      if (message.sender === recipientId || message.recipient === recipientId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });
  }, [recipientId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    sendChatMessage({ userId: recipientId, message: newMessage });
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: currentUserId, message: newMessage },
    ]);
    setNewMessage("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row", 
        height: "80vh",
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: "30%",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        <List>
          {users.map((user) => (
            <ListItem
              button
              key={user.id || user._id}
              onClick={() => setRecipientId(user.id || user._id)} 
              selected={recipientId === (user.id || user._id)}
            >
              <ListItemText primary={user.username} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "10px",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            marginBottom: "10px",
          }}
        >
          {loadingMessages ? (
            <p>Loading messages...</p>
          ) : messages.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  textAlign: msg.sender === currentUserId ? "right" : "left",
                  margin: "5px",
                  padding: "10px",
                  backgroundColor:
                    msg.sender === currentUserId ? "#DCF8C6" : "#FFF",
                  borderRadius: "10px",
                }}
              >
                {msg.message}
              </Box>
            ))
          )}
        </Box>

        {recipientId && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              borderTop: "1px solid #ddd",
              padding: "10px",
            }}
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                marginLeft: "10px",
                padding: "10px 20px",
                backgroundColor: "#007BFF",
                color: "#FFF",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </Box>
        )}
      </Box>
    </Box>
  );
};