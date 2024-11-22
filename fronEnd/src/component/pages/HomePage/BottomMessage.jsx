import React from 'react';
import { Box, Typography } from '@mui/material';
import refreshConfirm from '../../../assets/refresh_confirm.svg';

export const BottomMessage = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
    <Box
      component="svg"
      src={refreshConfirm}
      alt="End of content image"
      sx={{ width: '100px', height: '100px', objectFit: 'contain' }}
    />
    <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
      You've seen all the updates<br />
      You have viewed all new publications
    </Typography>
  </Box>
);

