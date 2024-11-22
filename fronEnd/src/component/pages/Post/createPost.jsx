import React, { useState } from 'react';
import {
  Box,
  Modal,
  TextField,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import EmojiPicker from '../../EmojiPicker';
import loadImage from '../../../assets/load_image.svg'
import { createPost } from '../../../api/auth';

export const CreatePostModal = ({ isOpen, onClose }) => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);

  const maxCaptionLength = 200;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = event.dataTransfer.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) {
      alert('Please upload an image.');
      return;
    }
    try {

      await createPost(caption, image)
      // console.log('Server Response:', response);
      setCaption('');
      setImage(null);
      onClose();
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="create-post-modal">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          display: 'flex',
          flexDirection: 'column',
          height: 400, 
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1,
          }}
        >
          <Typography id="create-post-modal" variant="h6" sx={{ textAlign: 'center', flex: 1, ml:10 }}>
            Create New Post
          </Typography>
          <Button
            onClick={handleSubmit}
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              height: '40px',
              textTransform: 'none',
              fontSize:'17px'
            }}
          >
            Share
          </Button>
        </Box>
        <Divider />

        <Box sx={{ display: 'flex', flex: 1 }}>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #ccc',
              textAlign: 'center',
              position: 'relative',
            }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('file-input').click()}
          >
          {!image ? (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    }}
  >
    <img
      src={loadImage}
      alt="Loading placeholder"
      style={{
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
      }}
    />
  </Box>
) : (
  <img
    src={URL.createObjectURL(image)}
    alt="preview"
    style={{
      maxWidth: '200px',
      maxHeight: '200px',
      objectFit: 'cover',
    }}
  />
)}
            <input
              type="file"
              id="file-input"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </Box>

          <Box sx={{ flex: 1}}>
            <TextField
              placeholder="Write your caption..."
              multiline
              value={caption}
              onChange={(e) => setCaption(e.target.value.slice(0, maxCaptionLength))}
              InputProps={{
                sx: {
                    fontSize: '16px',
                    padding: '10px', 
                    textAlign: 'left', 
                    alignItems: 'flex-start', 
                    height:'100%'
                },
              }}
              sx={{
                width: '350px',
                height:'150px'
              }}
            />
            <Typography
              sx={{
                textAlign: 'right',
                color: caption.length >= maxCaptionLength ? 'red' : 'black',
              }}
            >
              {caption.length}/{maxCaptionLength}
            </Typography>



            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
              }}
            >
              <EmojiPicker
                onEmojiSelect={(emoji) => setCaption((prev) => prev + emoji)}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};