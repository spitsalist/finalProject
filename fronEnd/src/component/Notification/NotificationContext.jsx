import React, { createContext, useState, useEffect, useContext } from "react";
import {
  subscribeToNotifications,
  getNotifications,
  markNotificationAsRead,
} from "../../api/auth";

export const NotificationContext = createContext(null);

 const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications(); 
        if (response.status === "success") {
          setNotifications(response.data.notifications); 
          setUnreadCount(response.data.notifications.filter((notif) =>
          !notif.isRead).length)
        } else {
          console.error("Failed to fetch notifications:", response.message);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
  
    fetchNotifications();
  
    const unsubscribe = subscribeToNotifications((notification) => {
      setNotifications((prev) => {
        const exists = prev.some((notif) => notif._id === notification._id);
        if (!exists) {
          setUnreadCount((prevCount) => prevCount + 1)
          return [notification, ...prev]; 
        }
        return prev; 
      });
    });
  
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);


  const markAsRead = async (notificationId) => {
    try {
      const response = await markNotificationAsRead(notificationId);
      if (response.success) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId? { ...notif, isRead: true  } : notif
          )
        );
        setUnreadCount((prevCount) => prevCount -1)
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, markAsRead,unreadCount, setUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

 const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export  {NotificationProvider, useNotifications}