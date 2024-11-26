import React, { createContext, useState, useEffect, useContext } from "react";
import { subscribeToNotifications, getNotifications, markNotificationAsRead as apiCreateNotification} from "../../api/auth";

export const NotificationContext = createContext(); 

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try{
        const response = await getNotifications();
        if (response.status === 'success') {
          setNotifications(response.data.notification)
        } else {
          console.error(response.message || 'error fetching notifications');
        }
      }catch(error){
        console.error('error get notification', error)
      }
    }
    fetchNotifications()

    const unsubscribe = subscribeToNotifications((notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const markAsRead = async(id) => {
    try{
      await markNotificationAsRead(id)

      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
      );
    }catch(error){
      console.error('error notification as read:', error);

    }
  };

  const createNotification =async ({content, postId, type, postImage}) => {
    try{
      const response = await apiCreateNotification({content, postId, type,postImage})
      if(response.status === 'success'){
        setNotifications((prev) => [response.data.notification, ...prev])
      }else{
        console.error('error create notification:', response.message)
      }
    }catch(error){
      console.error('error creating notification', error)
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead, createNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};