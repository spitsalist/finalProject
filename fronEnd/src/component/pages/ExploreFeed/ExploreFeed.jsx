import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { fetchPosts } from '../../../api/auth';

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

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetchPosts();
        setPosts(response.data.posts || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching explore feed:', error);
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

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
          {posts.slice(0, imageStyles.length).map((post, index) => (
            <Box
              key={index}
              component="img"
              src={`data:image/png;base64, ${post.image}`}
              alt={`Post image ${index + 1}`}
              sx={{
                ...imageStyles[index],
                objectFit: 'cover',
                borderRadius: '5px',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};