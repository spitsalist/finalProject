import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Footer } from "../pages/Footer";
import { HomePage } from "../pages/HomePage/HomePage";
import { SideMenu } from "../SideMenu/SideMenu";
import { ExploreFeed } from "../pages/ExploreFeed/ExploreFeed";
import { Profile } from "../pages/Profile";
import { EditProfile } from "../pages/EditProfile";
import { NotFoundPage } from "../pages/NotFoundPage";
import { UserProfile } from "../UserProfile";
function ProtectedLayout() {
  const location = useLocation();

  const routesWithSideMenu = ["/home", "/explore", "/profile", "/edit-profile"];
  const isSideMenuVisible = routesWithSideMenu.some((path) =>
    location.pathname.startsWith(path)
  );

  const isNotFoundPage = location.pathname === "/not-found";

  return (
    <>
      {isSideMenuVisible && <SideMenu />}

      <div style={{ flex: 1, marginLeft: isSideMenuVisible ? "250px" : "0px" }}>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/explore" element={<ExploreFeed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {!isNotFoundPage && <Footer />}
    </>
  );
}

export default ProtectedLayout;