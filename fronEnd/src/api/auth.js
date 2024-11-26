import axios from "axios";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;


export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    console.log("login succesfullly:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error login");
    throw error;
  }
};

export const register = async (fullName, username, email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      fullName,
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.log("Error registration");
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/resetPassword`, { email });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const confirmResetPassword = async (newPassword) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/confirmReset`, { newPassword });
    return response.data;
  } catch (error) {
    console.error("Error confirming reset password:", error);
    throw error;
  }
};

export const searchUsers = async (query) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/search`, {
      params: { query },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};

export const fetchPosts = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/post`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const getTimePost = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/follow/post`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const updateProfile = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${BASE_URL}/user/edit`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/user/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("API response:", response.data);
    return response.data; 
  } catch (error) {
    throw error;
  }
};

export const togglePrivacy = async (isPrivate) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${BASE_URL}/privacy`,
      { isPrivate },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const followUser = async (userToFollowId, username) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${BASE_URL}/follow`,
      { userToFollowId, user: username },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const unfollowUser = async (userToUnfollowId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${BASE_URL}/follow/unfollow`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { userToUnfollowId },
    });
    return response.data;
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw error;
  }
};

export const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const likePost = async (postId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${BASE_URL}/like`,
      { postId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

export const likeComment = async (commentId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${BASE_URL}/comment/like`,
      { commentId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error liking comment:", error);
    throw error;
  }
};


export const unlikePost = async (postId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${BASE_URL}/like/unlike`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { postId },
    });
    return response.data;
  } catch (error) {
    console.error("Error unliking post:", error);
    throw error;
  }
};


export const fetchMessages = async (recipientId, currentUserId) => {
  try {
    const token = localStorage.getItem('token'); 
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/messages/${recipientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        currentUserId, 
      },
    });
    return response.data; 
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const chatSocket = io(`${import.meta.env.VITE_SOCKET_URL}/chat`, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  auth: {
    token: localStorage.getItem("token"),
  },
});

export const joinChatRoom = (roomId) => {
  chatSocket.emit("joinChat", roomId);
};

export const sendChatMessage = (messageData) => {
  chatSocket.emit("sendMessage", messageData);
};

export const subscribeToChatMessages = (callback) => {
  chatSocket.on("newMessage", callback);
};

export const disconnectChatSocket = () => {
  chatSocket.disconnect();
};


export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  auth: {
    token: localStorage.getItem("token"),
  },
});

export const subscribeToNotifications = (callback) => {
  socket.on("newNotification", callback);
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const getNotifications = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/notification`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const markNotificationAsRead = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${BASE_URL}/notifications/read/`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

export const createPost = async (caption, imageFile) => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("caption", caption);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    const response = await axios.post(`${BASE_URL}/post/create`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const fetchComments = async (postId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/comment/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const addComment = async (postId, text, parentCommentId = null) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${BASE_URL}/comment`,
      { postId, text, parentCommentId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};