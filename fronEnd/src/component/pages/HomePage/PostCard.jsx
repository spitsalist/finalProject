import { PostHeader } from "./HomePage"
import { PostMedia } from "./PostMedia"
import { PostContent } from "./PostContent"
import { Card, Grid, Typography } from "@mui/material";
import { fetchProfile } from "../../../api/auth";
import { useState, useEffect, useMemo } from "react";

export const PostCard = ({ post }) => {
  const [currentId, setCurrentId] = useState(''); 

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        const profileData = await fetchProfile();
        setCurrentId(profileData.username);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };

    fetchCurrentProfile();
  }, []);

  const isLiked = useMemo(() => {
    if (loading || !currentId || !post.likes) return false;
    return post.likes.some(
      (likeUser) => likeUser.username === currentId 
    );
  }, [post.likes, currentId, loading]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return ( 
    <Grid item>
      <Card sx={{ borderRadius: '10px', overflow: 'hidden', boxShadow: 'none' }}>
        <PostHeader user={post.user} createdAt={post.createdAt} />
        <PostMedia image={post.image} />
        <PostContent 
          user={post.user} 
          caption={post.caption} 
          commentsCount={post.comments?.length || 0}
          postId={post?._id} 
          initialLikesCount={post.likes?.length || 0}
          initialLiked={isLiked}
          postImage={post.image}
        />
      </Card>
    </Grid>
  );
};