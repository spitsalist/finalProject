import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import HomeIcon from "../../assets/home_icon.svg";
import SearchIcon from "../../assets/search_icon.svg";
import ExploreIcon from "../../assets/explore_icon.svg";
import ChatIcon from "../../assets/Messenger_icon.svg";
import NotificationsIcon from "../../assets/like_icon.svg";
import AddBoxIcon from "../../assets/create_icon.svg";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/ICHGRA.svg';
import { DropMenu } from "../DropMenu/DropMenu";
import { NotificationList } from "../Notification/NotificationList";
import { CreatePostModal } from "../pages/Post/createPost";
import { Button } from "@mui/material";
import { useNotifications } from "../Notification/NotificationContext";
import { UserSearch } from "../DropMenu/UserSearch";
import { UsersList } from "../UsersList";

export const SideMenu = ({profileImage, exernalOpenMenu, setExternalOpenMenu, users, selectedUserId, onSelectUser}) => {
  const {notifications} = useNotifications()
  const unreadCount = Array.isArray(notifications)
  ? notifications.filter((n) => !n.isRead).length
  : 0;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null); 

  useEffect(()=>{
    setOpenMenu(exernalOpenMenu)
  },[exernalOpenMenu])

  const menuItems = [
    {key:'home', text: "Home", icon: <img src={HomeIcon}/>, path: "/home" },
    {key: 'search', text: "Search", icon: <img src={SearchIcon} />, path: "/search", hasDropMenu: true },
    {key: "explore", text: "Explore", icon: <img src={ExploreIcon} />, path: "/explore" },
    {key: "message", text: "Message", icon: <img src={ChatIcon} />,path: '/messages', hasDropMenu: true},
    { key: "notification",
      text: `Notification${unreadCount > 0 ? ` (${unreadCount})` : ''}`,
      icon: <img src={NotificationsIcon} />,
      path: "/notification",
      hasDropMenu: true,
    },
    {key: "create", text: "Create", icon: <img src={AddBoxIcon} />, action: handleOpenModal },
  ];

  const handleItemClick = (path, hasDropMenu, action, key) => {
    if (action) {
      action();
    } else if (hasDropMenu) {
      setOpenMenu(openMenu === key ? null : key);
      setExternalOpenMenu(openMenu === key ? null : key)
    } else if (path){
      navigate(path);
      setOpenMenu(null);
      setExternalOpenMenu(null)
    }
  };

  const closeMenu = () => {
    setOpenMenu(null);
    setExternalOpenMenu(null)
    if(location.pathname.startsWith('/messages')){
      navigate('/home')
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "250px",
        height: "100vh",
        borderRight: "1px solid #DBDBDB",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "#fff",
        paddingLeft: '10px',
        zIndex:'1000'
      }}
    >
      <Box
        sx={{
          width: '120px',
          cursor: "pointer",
        }}
        onClick={() => navigate("/home")}
      >
        <img src={logo} alt="ICHgram logo" style={{ width: '100%' }} />
      </Box>
  
      <List sx={{ display: "flex", flexDirection: "column" }}>
        {menuItems.map((item) => (
          <ListItem
            component={Button}
            key={item.key}
            onClick={() => handleItemClick(item.path, item.hasDropMenu, item.action, item.key)}
            sx={{
              display: "flex",
              alignItems: "center",
              padding: '10px',
              cursor:'pointer',
              textTransform:'none',
              color:'#262626'
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem 
          component={Button}
          key="Profile"
          onClick={() => navigate("/profile")}
          sx={{
            display: "flex",
            alignItems: "center",
            marginTop: "40px",
            padding: '10px',
            cursor:'pointer',
            textTransform:'none',
            color:'#262626'
          }}
        >
          <ListItemIcon sx={{ minWidth: '45px' }}>
            <Avatar src={profileImage} alt="profile"/>
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
      </List>

      <DropMenu
        title="Search"
        isOpen={openMenu === "search"}
        onClose={closeMenu}
      >
        <UserSearch/>
      </DropMenu>

      <DropMenu
        title="Notifications"
        isOpen={openMenu === "notification"}
        onClose={closeMenu}
      >
        <NotificationList />
      </DropMenu>

      <DropMenu title='Messages'
      isOpen={openMenu === 'message'}
      onClose={closeMenu}
      >
        <UsersList 
        users={users}
        selectedUserId={selectedUserId}
        onSelectUser={onSelectUser}
        />
      </DropMenu>

      <CreatePostModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <Box sx={{ padding: "10px", marginTop: '60px' }}>
  <Button
    variant="outlined"
    color="error"
    onClick={() => {
      localStorage.removeItem("token");
      navigate("/login", {replace: true});
    }}
    sx={{
      width: "80px",
      fontSize: "14px",
      textTransform: "none",
      borderRadius: "8px",
    }}
  >
    Logout
  </Button>
    </Box>
    </Box>
  );
};