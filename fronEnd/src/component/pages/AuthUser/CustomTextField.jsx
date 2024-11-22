import React from 'react';
import { TextField } from '@mui/material';

export const InputField = ({ label, type = "text", value, onChange }) => (
    <TextField
      label={label}
      type={type}
      variant="outlined"
      fullWidth
      required
      size='small'
      value={value}
      onChange={onChange}
      sx={{marginBottom: '10px', 
        backgroundColor: '#f0f0f0',
        '& .MuiOutlinedInput-root': {
        padding: '4px ',
        '&:hover .MuiOutlinedInput-notchedOutline': { 
          borderColor: '#ccc', 
        },
        '&:hover': { 
          backgroundColor: '#fff'
        },
      },
      }}
    />
  );

  export const EditProfileField = ({ label, value, onChange, multiline = false, rows = 1 }) => (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      variant="outlined"
      fullWidth
      multiline={multiline}
      rows={rows}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2',
          },
        },
      }}
    />
  );