import { PostMedia } from "./HomePage/PostMedia";
import { Box, Typography, Avatar, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../../context/PostContext";
import { useUser } from "../../context/userContext";

export const Profile = () => {
  const {user, loading, error} = useUser()
  const navigate = useNavigate()
  const {posts, loading: loadingPosts} = usePosts()

  if (loading || loadingPosts) {
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
          src={user.profileImage }
          alt={user.username}
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
              {user.username}
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
              <strong>{user.followers || 0}</strong> followers
            </Typography>
            <Typography variant="body1">
              <strong>{user.following || 0}</strong> following
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ textAlign: "left", marginBottom: "30px", marginLeft:'195px' }}>
        <Typography sx={{ fontWeight: "bold" }}>{user.fullName}</Typography>
        <Typography>{user.bio || "Short bio placeholder"}</Typography>
        {user.webSite && (
          <Typography
            component="a"
            href={user.webSite}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "#00376b", textDecoration: "none", fontWeight: "bold" }}
          >
            {user.webSite}
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





