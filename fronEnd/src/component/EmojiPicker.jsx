import React, { useState } from 'react';
import { Box, IconButton, Button } from '@mui/material';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

const EmojiPicker = ({ onEmojiSelect }) => {
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const standardEmojis = ['😊', '😂', '😍', '😢', '👍', '😎', '😉', '🙌', '🎉', '❤️'];

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <IconButton
        onClick={() => setEmojiPickerOpen((prev) => !prev)}
      >
        <InsertEmoticonIcon />
      </IconButton>

      {emojiPickerOpen && (
        <Box
          sx={{
            position: 'relative', 
            width: '100%',
            height: '100%', 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'center',
            alignItems: 'center',

          }}
        >
          {standardEmojis.map((emoji, index) => (
            <Button
              key={index}
              onClick={() => {
                onEmojiSelect(emoji)
                setEmojiPickerOpen(false)
              }}
              sx={{
                minWidth: '40px',
                height: '40px',
                fontSize: '20px',
              }}
            >
              {emoji}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default EmojiPicker;