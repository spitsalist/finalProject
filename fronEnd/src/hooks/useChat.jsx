import { useState, useEffect, useCallback } from "react";
import { fetchUsers, fetchMessages, chatSocket, markAsRead } from "../api/auth";

export const useChat = (currentUserId, selectedUserId) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      const response = await fetchUsers();
      const allUsers = response?.data?.users || [];
      if (currentUserId) {
        setUsers(allUsers.filter((user) => user?._id !== currentUserId));
      }
    } catch (error) {
      console.error("Error loading users:", error);
    }
  }, [currentUserId]);

  const loadMessages = useCallback(async () => {
    if (!selectedUserId || !currentUserId) return;
    try {
      setLoadingMessages(true);
      const fetchedMessages = await fetchMessages(selectedUserId, currentUserId);
      setMessages(fetchedMessages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  }, [selectedUserId, currentUserId]);

  useEffect(() => {
    if (selectedUserId) {
      const recipient = users.find((u) => u._id === selectedUserId);
      if (recipient) {
        setSelectedUserInfo(recipient);
      } else {
        setSelectedUserInfo(null);
      }
    } else {
      setSelectedUserInfo(null);
    }
  }, [selectedUserId, users]);

  useEffect(() => {
    const handleUpdateLastLogin = ({ userId, lastLogin }) => {
        // console.log(userId, lastLogin);

      if (userId === selectedUserId) {
        // console.log(lastLogin);

        setSelectedUserInfo((prev) => ({
          ...prev,
          lastLogin,
        }));
      }
    };

    chatSocket.on("updateLastLogin", handleUpdateLastLogin);

    return () => {
      chatSocket.off("updateLastLogin", handleUpdateLastLogin);
    };
  }, [selectedUserId]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      const isRelevant =
        (message.sender === selectedUserId && message.recipient === currentUserId) ||
        (message.sender === currentUserId && message.recipient === selectedUserId);

      if (isRelevant) {
        setMessages((prev) => {
          const alreadyExists = prev.some((msg) => msg._id === message._id);
          return alreadyExists ? prev : [...prev, message];
        });
        if (message.sender === selectedUserId && document.hasFocus()) {
            // console.log( message._id, currentUserId);

          markAsRead(message._id, currentUserId)
        }
    }
}

    chatSocket.on("newMessage", handleNewMessage);

    return () => {
      chatSocket.off("newMessage", handleNewMessage);
    };
  }, [selectedUserId, currentUserId]);

  useEffect(() => {
    const handleMessageRead = ({ messageId }) => {
        // console.log( messageId);

      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, isRead: true } : msg))
      );
    };

    const handleFetchMessages = async ({ recipientId }) => {
      const response = await fetchMessages(recipientId);
      if (response.success) {
        setMessages(response.messages);
      }
    };

    chatSocket.on("messageRead", handleMessageRead);
    chatSocket.on("fetchMessages", handleFetchMessages);

    return () => {
      chatSocket.off("messageRead", handleMessageRead);
      chatSocket.off("fetchMessages", handleFetchMessages);
    };
  }, []);

  useEffect(() => {
    if (selectedUserId && messages.length > 0) {
      messages.forEach((msg) => {
        if (!msg.isRead && msg.sender === selectedUserId && currentUserId) {
          markAsRead(msg._id, currentUserId);
        }
      });
    }
  }, [selectedUserId, messages, currentUserId]);

  useEffect(() => {
    if (currentUserId) loadUsers();
  }, [currentUserId, loadUsers]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    users,
    messages,
    selectedUserInfo,
    loadingMessages,
    setMessages,
  };
};