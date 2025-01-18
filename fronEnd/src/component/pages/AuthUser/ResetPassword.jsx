import React, { useState } from "react";
import { Button, Typography, Box, Link, Divider } from "@mui/material";
import ichLogo from "../../../assets/ICHGRA.svg";
import { useNavigate } from "react-router-dom";
import { InputField } from "./CustomTextField";
import { SectionDivider } from "./SectionDivider";
import lockIcon from "../../../assets/lockIcon.svg";
import { resetPassword } from "../../../api/auth";

export const ResetPassword = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true)
    // console.log("Reset password sent to:", emailOrUsername);
    try {
      const resultData = await resetPassword(emailOrUsername);
      localStorage.setItem("token", resultData.data.token);
      setSuccessMessage("Password reset link sent successfully!");
      navigate("/login", {replace:true})
    } catch (error) {
      console.error(
        "No email or username found in database, please try again.",error)
    } finally{
      setIsSubmitting(false)
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "100vw",
          top: 0,
          left: 0,
        }}
      >
        <Box display="flex" alignItems="center" ml={1} mt={1}>
          <Link onClick={() => navigate("/home")}>
            <img alt="ICHGRAM LOGO " src={ichLogo} style={{ width: "100px" }} />
          </Link>
        </Box>

        <Divider sx={{ marginTop: "10px", width: "100vw", marginBottom:'20px' }} />
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        padding="20px"
        mt={6}
      >
        <Box maxWidth="sm" sx={{ maxWidth: "350px", width: "100%" }}>
          <Box>
            <Box
              sx={{ padding: 2, border: "1px solid #DBDBDB", borderRadius: 1 }}
            >
              <Box display="flex" justifyContent="center" sx={{ padding: 2 }}>
                <img
                  alt="Lock Icon"
                  src={lockIcon}
                  style={{ width: "50px", height: "50px" }}
                />
              </Box>
              <Typography
                variant="h6"
                align="center"
                sx={{ color: "#000", padding: 1 }}
              >
                Trouble Logging In?
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                align="center"
                sx={{ fontSize: "14px", marginBottom: 2 }}
              >
                Enter your email, phone, or username, and we'll send you a link
                to get back into your account.
              </Typography>

              <form onSubmit={handleResetPassword} sx={{ padding: 2 }}>
                <InputField
                  label="Email"
                  placeholder="Enter your email"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                />

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                  disabled={isSubmitting}
                  sx={{
                    marginTop: "20px",
                    marginBottom: "20px",
                    borderRadius: "8px",
                    textTransform: "none",
                  }}
                >
                  {isSubmitting ? 'Loading...' : 'Reset Your Password'}
                </Button>
                {successMessage && (
                  <Typography
                    variant="body2"
                    color="success.main"
                    align="center"
                    sx={{ mt: 2 }}
                  >
                    {successMessage}
                  </Typography>
                )}
              </form>

              <SectionDivider />

              <Box display="flex" justifyContent="center" alignItems="center">
                <Typography variant="body4" color="textSecondary">
                  <Link
                    underline="hover"
                    component="button"
                    onClick={() => navigate("/register")}
                    sx={{
                      color: "#262626",
                      fontSize: "16px",
                      marginTop: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    Create new cccount
                  </Link>
                </Typography>
              </Box>
            </Box>
            <button
              onClick={() => navigate("/login")}
              style={{
                backgroundColor: "#DBDBDB",
                color: "#262626",
                border: "none",
                width: "100%",
                padding: "15px",
                fontWeight: "bold",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#BDBDBD")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#DBDBDB")}
            >
              Back to your account
            </button>
          </Box>
        </Box>
      </Box>
    </>
  );
};
