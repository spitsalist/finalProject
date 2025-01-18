import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Footer } from "../pages/Footer";
import { HomePage } from "../pages/HomePage/HomePage";
import { SideMenu } from "../SideMenu/SideMenu";
import { ExploreFeed } from "../pages/ExploreFeed/ExploreFeed";
import { Profile } from "../pages/Profile";
import { EditProfile } from "../pages/EditProfile";
import { NotFoundPage } from "../pages/NotFoundPage";
import { UserProfile } from "../UserProfile";
import { useUser } from "../../context/userContext";
import { Chat } from "../Chat/Chat";
import { useChat } from "../../hooks/useChat";

function ProtectedLayout() {
  const {user} = useUser()
  const currentUserId = user?._id
  const {users } = useChat(currentUserId, null)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [openMenu, setOpenMenu] = useState(null)
  const location = useLocation();
  const navigate = useNavigate()

  const handleSelectUser =(id)=>{
    setSelectedUserId(id)
    navigate(`/messages/${id}`)
  }

  useEffect(()=>{
    if(location.pathname.startsWith('/messages')){
      setOpenMenu('message')
    }else{
      setOpenMenu(null)
    }
  },[location])

  const routesWithSideMenu = ["/home", "/explore", "/profile", "/edit-profile",'/messages'];
  const isSideMenuVisible = routesWithSideMenu.some((path) =>
    location.pathname.startsWith(path)
  );

  const isNotFoundPage = location.pathname === "/not-found";

  return (
    <>
      {isSideMenuVisible && (<SideMenu  
      profileImage={user?.profileImage}
      users={users}
      selectedUserId={selectedUserId}
      onSelectUser={handleSelectUser}
      exernalOpenMenu={openMenu}
      setExternalOpenMenu={setOpenMenu}
      />)}

      <div style={{ flex: 1, marginLeft: isSideMenuVisible ? "250px" : "0px" }}>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/explore" element={<ExploreFeed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<UserProfile/>} />
          <Route path="/messages/:id" element={ <Chat/>}/>
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {!isNotFoundPage && <Footer />}
    </>
  );
}

export default ProtectedLayout;