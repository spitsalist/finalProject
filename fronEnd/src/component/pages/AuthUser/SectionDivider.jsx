import React from 'react';
import { Box, Divider, Typography } from '@mui/material';

export const SectionDivider = ({ text }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
    <Divider sx={{ flex: 1 }} />
    <Typography variant="body2" sx={{ mx: 2 }}>
      {text || 'OR'}
    </Typography>
    <Divider sx={{ flex: 1 }} />
  </Box>
);

