import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { fetchPosts } from '../../../api/auth';
import { PostModal } from '../modal/PostModal';

const imageStyles = [
  { width: '280px', height: '280px', gridRow: 'span 1' },
  { width: '280px', height: '280px', gridRow: 'span 1' },
  { width: '280px', height: '569px', gridRow: 'span 2' },
  { width: '280px', height: '280px', gridRow: 'span 1' },
  { width: '280px', height: '280px', gridRow: 'span 1' },
  { width: '280px', height: '569px', gridRow: 'span 2' },
  { width: '280px', height: '280px', gridRow: 'span 1' },
  { width: '280px', height: '280px', gridRow: 'span 1' },
  { width: '280px', height: '280px', gridRow: 'span 1' },
  { width: '280px', height: '280px', gridRow: 'span 1' },
];

export const ExploreFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetchPosts();
        console.log('respnose', response.data.posts)
        setPosts(response.data.posts || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching explore feed:', error);
        setLoading(false);
      }
    };
    loadPosts();
  }, []);
  
  const handlePostClick = (post) => {
    setSelectedPost({
      postId: post._id,
      user: post.user,
      postImage: post.image,
      caption: post.caption || "",
      likesCount: post.likes?.length || 0,
      commentId: null,
    });
  };
  

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ marginTop: '60px', marginBottom: '180px' }}>
      {posts.length === 0 ? (
        <Typography>No posts available</Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 280px)',
            gridAutoRows: '280px',
            gap: '8px',
            justifyContent: 'center',
          }}
        >
         {posts.filter(post => post.user).map((post, index) => {
          const style = imageStyles[index % imageStyles.length]; 
          return (
            <Box
              key={index}
              component="img"
              src={`data:image/png;base64, ${post.image}`}
              alt={`Post image ${index + 1}`}
              sx={{
                ...style,
                objectFit: 'cover',
                borderRadius: '5px',
                cursor:'pointer'
              }}
              onClick={() => handlePostClick(post)}
            />
          );
        })}
        </Box>
      )}
      {selectedPost && (
        <PostModal 
        isOpen={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
        postId={selectedPost.postId}
        user={selectedPost.user}
        caption={selectedPost.caption}
        postImage={selectedPost.postImage}
        likesCount={selectedPost.likesCount}
        currentUserId='userA'
        commentId={selectedPost.commentId}
         />
      )}
    </Box>
  );
};