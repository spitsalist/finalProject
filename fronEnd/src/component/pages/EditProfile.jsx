import React, { useState, useEffect } from "react";
import { updateProfile, fetchProfile } from "../../api/auth";
import { Box, Typography, Button, Avatar } from "@mui/material";
import { EditProfileField } from "./AuthUser/CustomTextField";
import { useNavigate } from "react-router-dom";

export const EditProfile = () => {
    const [formData, setFormData] = useState({
      username: "",
      bio: "",
      webSite: "",
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate()
  
    useEffect(() => {
      const loadProfile = async () => {
        try {
          const profileData = await fetchProfile();
          setFormData({
            username: profileData.username || "",
            bio: profileData.bio || "",
            webSite: profileData.webSite || "",
          });
          setPreviewImage(profileData.profileImage);
        } catch (err) {
          setError("Failed to load profile.");
        }
      };
  
      loadProfile();
    }, []);
  
    const handleChange = (e, field) => {
      setFormData({
        ...formData,
        [field]: e.target.value,
      });
    };
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedImage(file);
        setPreviewImage(URL.createObjectURL(file));
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      setSuccess("");
  
      try {
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
          data.append(key, formData[key]);
        });
  
        if (selectedImage) {
          data.append("profileImage", selectedImage);
        }
  
        const response = await updateProfile(data);
        setSuccess("Profile updated successfully!");
        navigate('/profile')
      } catch (err) {
        setError("Failed to update profile.");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Box
        sx={{
          width: "600px",
          margin: "auto",
          padding: "20px",
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: "20px", fontWeight: "bold" }}>
          Edit profile
        </Typography>
  
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="primary">{success}</Typography>}
  
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
              backgroundColor: "#EFEFEF",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <Avatar
                src={previewImage}
                alt="Profile"
                sx={{ width: 70, height: 70, border: "1px solid #ddd" }}
              />
              <Box>
                <Typography variant="h6">{formData.username}</Typography>
              </Box>
            </Box>
  
            <Button
              variant="outlined"
              component="label"
              sx={{
                textTransform: "none",
                fontSize: "14px",
                color: "#fff",
                background:'#0095F6',
                borderRadius:'8px'
              }}
            >
              New photo
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Box>
  
          <EditProfileField
            label="Username"
            value={formData.username}
            onChange={(e) => handleChange(e, "username")}
          />
          <EditProfileField
            label="Website"
            value={formData.webSite}
            onChange={(e) => handleChange(e, "webSite")}
          />
          <EditProfileField
            label="About"
            value={formData.bio}
            onChange={(e) => handleChange(e, "bio")}
            multiline
            rows={3}
            // inputProps={{maxLength: 150}}         
        />          
            
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              textTransform: "none",
              fontSize: "14px",
              alignSelf: "left",
              width: "238px",
              height:'32px',
              borderRadius:'8px'
            }}
          >
            {loading ? "Saving..." : "Save"}
            
          </Button>
        </form>
      </Box>
    );
  };
  
