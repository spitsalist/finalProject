import React, { useState } from "react";
import { Button, Typography, Box, Alert } from "@mui/material";
import {  useLocation, useNavigate } from "react-router-dom";
import { InputField } from "./CustomTextField";
import { confirmResetPassword } from "../../../api/auth";

export const ConfirmResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get('token')
  const [isConfirm, setIsConfirm] = useState(false)

  if (!token) {
    setErrorMessage("Token is missing or invalid.");
    return;
  }

  const handleConfirmResetPassword = async (e) => {
    e.preventDefault();
    setIsConfirm(true)
    setErrorMessage('')

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsConfirm(false)
      return;
    }
    try {
      await confirmResetPassword(token, password); 
      setSuccessMessage("Your password has been reset successfully!");
      navigate("/")
    } catch (error) {
      console.error('Error during password reset:', error); 
      setIsConfirm(false)
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" padding="20px">
      <Box maxWidth="sm" sx={{ maxWidth: "350px", width: "100%" }}>
        <form onSubmit={handleConfirmResetPassword}>
          <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
            Confirm Reset Password
          </Typography>
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          
          <InputField
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your new password"
          />
          <InputField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isConfirm}
            fullWidth
            sx={{ marginTop: "20px", borderRadius: "8px" }}
          >
            {isConfirm ? 'Loading...' : 'Reset Password'}
          </Button>
        </form>
      </Box>
    </Box>
  );
};