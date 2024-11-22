import React, { useEffect, useState } from "react";
import { fetchProfile, getTimePost } from "../../api/auth";
import { PostMedia } from "./HomePage/PostMedia";
import { Box, Typography, Avatar, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    const loadProfileAndPosts = async () => {
      try {
        const profileData = await fetchProfile();
        setProfile(profileData);

        const postsData = await getTimePost();
        setPosts(postsData.data.posts || []);
      } catch (err) {
        console.error("Error loading profile or posts:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadProfileAndPosts();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ maxWidth: "935px", margin: "auto", padding: "20px", marginBottom:'120px' }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          gap:'30px',
          marginLeft:'60px'
        }}
      >
        <Avatar
          src={profile.profileImage || "/default-avatar.png"}
          alt={profile.username}
          sx={{
            width: 100,
            height: 100,
            border: "2px solid #DBDBDB",
          }}
        />

        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "30px",
              marginBottom: "10px",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {profile.username}
            </Typography>
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                padding: "5px 30px",
                fontSize: "14px",
              }}
              onClick={() => navigate('/edit-profile')}

            >
              Edit Profile
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              gap: "80px",
            }}
          >
            <Typography variant="body1">
              <strong>{posts.length}</strong> posts
            </Typography>
            <Typography variant="body1">
              <strong>{profile.followers || 0}</strong> followers
            </Typography>
            <Typography variant="body1">
              <strong>{profile.following || 0}</strong> following
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ textAlign: "left", marginBottom: "30px", marginLeft:'195px' }}>
        <Typography sx={{ fontWeight: "bold" }}>{profile.fullName}</Typography>
        <Typography>{profile.bio || "Short bio placeholder"}</Typography>
        {profile.webSite && (
          <Typography
            component="a"
            href={profile.webSite}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "#00376b", textDecoration: "none", fontWeight: "bold" }}
          >
            {profile.webSite}
          </Typography>
        )}
      </Box>

      <Grid container spacing={2} justifyContent="center">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post, index) => (
            <Grid item key={post._id || index}>
              <Box
                sx={{
                  width: "270px", 
                  height: "270px",
                  overflow: "hidden",
                  borderRadius: "5px",
                  border: "1px solid #DBDBDB",
                }}
              >
                <PostMedia image={post.image} />
              </Box>
            </Grid>
          ))
        ) : (
          <Typography>No posts available</Typography>
        )}
      </Grid>
    </Box>
  );
};





