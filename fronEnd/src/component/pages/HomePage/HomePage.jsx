import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Typography,
  Grid,
} from '@mui/material';
import { getTimePost } from '../../../api/auth';
import { PostLoader } from './PostLoader';
import { FollowButton } from '../../Buttons/FollowButton/FollowButton';
import { PostCard } from './PostCard';
import { SideMenu } from '../../SideMenu/SideMenu';

export const PostHeader = ({ user, currentUserId }) => {
// console.log(user)
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px', justifyContent: 'space-between' }}>
      <SideMenu profileImage={user.profileImage} />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar 
          src={user.profileImage || ''} 
          alt={user.username || ''} 
          sx={{ marginRight: '10px' }} 
        />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {user?.username || ''}
          </Typography>
        </Box>
      </Box>
      <FollowButton 
        userId={user?._id} 
        initialFollowing={user?.isFollowing} 
        username={user?.username} 
        currentUserId={currentUserId}
      />
    </Box>
  );
};

export const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await getTimePost();  
        // console.log(fetchedPosts);
        setPosts(fetchedPosts.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);
// console.log(posts)
  return (
    
    <Box sx={{   padding:'25px 80px ', marginBottom:'85px', width:'700px'  }}> 
    {/* position:'absolute', left:'330px', right:'200px', */}
      {loading ? (
        <PostLoader />
      ) : posts.length === 0 ? (

        <Typography>No posts available</Typography>
      ) : (
        <Grid container spacing={2}  >
          {posts.map((post) => (
            <Grid item xs={8} md={6} lg={6}key={post._id}>
              <PostCard post={post} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};