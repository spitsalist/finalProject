import React from 'react';
import { CardMedia } from '@mui/material';

export const PostMedia = ({ image }) => (
  image ? (
    <CardMedia
      component="img"
      image={`data:image/png;base64, ${image}`}
      alt='Post image'      
    />
  ) : null
);

