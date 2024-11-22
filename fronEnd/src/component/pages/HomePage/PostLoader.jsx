import React from 'react';
import { Box, CircularProgress } from '@mui/material';

export const PostLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
    <CircularProgress />
  </Box>
);

