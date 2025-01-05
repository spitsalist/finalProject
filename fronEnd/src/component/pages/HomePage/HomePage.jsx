import { FollowButton } from '../../Buttons/FollowButton/FollowButton';
import React from "react";
import { Box, Typography, Grid, Avatar } from "@mui/material";
import { usePosts } from "../../../context/PostContext"
import { PostLoader } from "./PostLoader";
import { PostCard } from "./PostCard";

export const PostHeader = ({ user, currentUserId }) => {  
// console.log(user)
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar 
          src={user?.profileImage} 
          alt={user?.username} 
          sx={{ marginRight: '10px' }} 
        />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {user?.username}
          </Typography>
        </Box>
      </Box>
      <FollowButton 
        userId={user._id} 
        initialFollowing={user.isFollowing } 
        username={user.username} 
        currentUserId={currentUserId}
      />
    </Box>
  );
};



export const HomePage = () => {
  const { posts, loading} = usePosts(); 

  if (loading) return <PostLoader />;

  return (
    <Box sx={{ padding: "25px 80px", marginBottom: "85px", width: "700px" }}>
      {posts.length === 0 ? (
        <Typography>No posts available</Typography>
      ) : (
        <Grid container spacing={2}>
          {posts.map((post) => (
            <Grid item xs={8} md={6} lg={6} key={post._id}>
              <PostCard post={post} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};