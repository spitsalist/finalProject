import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { usePosts } from "../../../context/PostContext"
import { PostLoader } from "./PostLoader";
import { PostCard } from "./PostCard";

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