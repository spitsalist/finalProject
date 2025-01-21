import { Box, Typography, Avatar, Button } from "@mui/material";
import { ChatEmojiPicker } from "./ChatEmojiPicker";

export const MessagesList = ({
  messages,
  chatBoxRef,
  currentUserId,
  selectedUserInfo,
  newMessage,
  setNewMessage,
  handleSendMessage,
  user
}) => {

  const getUserInfo = (userId) => {
    if (userId === currentUserId) {
      return {
        name: user?.username,
        avatar: user?.profileImage
      };
    }    
    return {
      name: selectedUserInfo?.username,
      avatar: selectedUserInfo?.profileImage
    };
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%", 
      }}
    >
      <Box
        sx={{
          flex: 1, 
          overflowY: "auto", 
          padding: "16px",
        }}
        ref={chatBoxRef}
      >
        {selectedUserInfo && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <Avatar
              src={selectedUserInfo.profileImage}
              alt={selectedUserInfo.username}
              sx={{ width: 80, height: 80 }}
            />
            <Typography variant="h6">{selectedUserInfo.username}</Typography>
            <Button
            
              sx={{
                marginTop: "8px",
                borderRadius: "14px",
                background: "#EFEFEF",
                textTransform: "lowercase",
                color: "#000",
                padding: "6px",
                width: "145px",
                "&:hover": {
                  background: "#d6d6d6",
                },
              }}
                          
              onClick={() => {
                  window.location.href = `/profile/${selectedUserInfo._id}`;
              }}
            >
              View Profile
            </Button>
            <Typography variant="body2" color="textSecondary" mt={6}>
              {selectedUserInfo?.lastLogin
                ? new Date(selectedUserInfo.lastLogin).toLocaleString(navigator.language, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"}
            </Typography>
          </Box>
        )}

        {messages.map((msg, index) => {
          const isCurrentUserSender = msg.sender === currentUserId || msg.sender.id === currentUserId;
          const userInfo = getUserInfo(msg.sender);

          return (
            <Box
              key={index}
              id={`message-${msg._id}`}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: isCurrentUserSender ? "flex-end" : "flex-start",
                marginBottom: "16px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {!isCurrentUserSender && (
                  <Avatar
                    src={userInfo.avatar}
                    alt={userInfo.name}
                    sx={{ width: 32, height: 32, marginRight: "8px" }}
                  />
                )}
                <Box
                  sx={{
                    padding: "10px",
                    backgroundColor: isCurrentUserSender ? "#673ab7" : "#e0e0e0",
                    color: isCurrentUserSender ? "#fff" : "#000",
                    borderRadius: "16px",
                    textAlign: isCurrentUserSender ? "right" : "left",
                  }}
                >
                  <Typography variant="body2">{msg.message}</Typography>
                </Box>
                {isCurrentUserSender && (
                  <Avatar
                    src={userInfo.avatar}
                    alt={userInfo.name}
                    sx={{ width: 32, height: 32, marginLeft: "8px" }}
                  />
                )}
              </Box>

              {isCurrentUserSender && msg.isRead && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "#999",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  read
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      {selectedUserInfo && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "16px",
            borderTop: "1px solid #ddd",
            position: "sticky", 
            bottom: 0, 
          }}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write a message"
            style={{
              flex: 1,
              padding: "10px 45px 10px 10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px",
              marginRight: "8px",
            }}
          />
          <ChatEmojiPicker  setNewMessage={setNewMessage}/>
          <button
            onClick={handleSendMessage}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
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
  );
};