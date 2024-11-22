import "./App.css";
import { btnTheme } from "./component/Buttons/Buttons";
import LoginPage from "./component/pages/AuthUser/loginPage";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignUpPage } from "./component/pages/AuthUser/SignUp";
import { ResetPassword } from "./component/pages/AuthUser/ResetPassword";
import { ConfirmResetPassword } from "./component/pages/AuthUser/ConfirmResetPassword";
import ProtectedLayout from "./component/ProtectedLayout/ProtectedLayout";
import { NotificationProvider } from "./component/Notification/NotificationContext";
import { NotFoundPage } from './component/pages/NotFoundPage';

const PrivateRoute = ({ element }) => {
  const token = Boolean(localStorage.getItem("token"));
  return token ? element : <Navigate to="/login" />;
};

function App() {
  const routes = [
    { path: "/login", component: <LoginPage /> },
    { path: "/register", component: <SignUpPage /> },
    { path: "/reset-password", component: <ResetPassword /> },
    { path: "/confirm-reset-password", component: <ConfirmResetPassword /> },
  ];

  return (
    <BrowserRouter>
    <NotificationProvider>
      <ThemeProvider theme={btnTheme}>
        <Routes>
          {routes.map(({ path, component }, index) => (
            <Route key={index} path={path} element={component} />
          ))}

          <Route
            path="/*"
            element={<PrivateRoute element={<ProtectedLayout />} />}
          />
          <Route path="*" element={<NotFoundPage />} />
          
        </Routes>
      </ThemeProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;