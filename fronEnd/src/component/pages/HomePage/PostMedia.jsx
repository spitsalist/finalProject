import React from 'react';
import { CardMedia } from '@mui/material';

export const PostMedia = ({ image }) => (
  image ? (
    <CardMedia
      component="img"
      image={`data:image/png;base64, ${image}`}
      alt='Post image'
      style={{width:'100%', maxWidth:'100%', height:'auto', borderRadius: '3.5px', objectFit:'cover'}}
      
    />
  ) : null
);

