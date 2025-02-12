import React, { useEffect, useState } from "react";
import { fetchProfile, fetchPosts } from '../api/auth'
import { PostMedia } from './pages/HomePage/PostMedia';
import { Box, Typography, Avatar, Button, Grid } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { FollowButton } from './Buttons/FollowButton/FollowButton'

export const UserProfile = () => {
  const { userId } = useParams(); 
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleNavigateToChat = ()=> {
    if(profile._id){
      navigate(`/messages/${profile._id}`)
    }else{
      console.error('user id not available')
    }
  }
  useEffect(() => {
    const loadUserProfileAndPosts = async () => {
      try {
        setLoading(true)
        const profileData = await fetchProfile(userId)
        // console.log("profile ", profileData);

        setProfile({...profileData, _id: profileData._id || userId});

        const postsData = await fetchPosts(userId)

        setPosts(postsData.data.posts || []);
      } catch (err) {
        console.error("Error loading profile or posts:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadUserProfileAndPosts();
  }, [userId]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  
  return (
    <Box sx={{ maxWidth: "935px", margin: "auto", padding: "20px", marginBottom: "120px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          gap: "30px",
          marginLeft: "60px",
        }}
      >
        <Avatar
          src={profile.profileImage}
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
          
            <FollowButton
              userId={profile._id}
              username={profile.username}
              initialFollowing={profile.isFollowing}
            />
          
            <Button
              variant="contained"
              disabled={!profile._id}
              sx={{
                textTransform: "none",
                padding: "5px 30px",
                fontSize: "14px",
                backgroundColor: "#0095f6",
                color: "#fff",
              }}
              onClick={handleNavigateToChat}
            >
              Message
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