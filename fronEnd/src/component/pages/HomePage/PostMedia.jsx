import React from 'react';
import { CardMedia } from '@mui/material';

export const PostMedia = ({ image }) => (
  image ? (
    <CardMedia
      component="img"
      image={`data:image/png;base64, ${image}`}
      alt='Post image'
      sx={{ width: '100%', height:'auto',maxHeight:'460px', borderRadius: '3.5px', objectFit: 'cover'}}
      
    />
  ) : null
);

