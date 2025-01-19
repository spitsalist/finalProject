import { useNavigate } from 'react-router-dom';
import { Box, Typography, Avatar } from "@mui/material";
import { FollowButton } from '../../Buttons/FollowButton/FollowButton';

export const PostHeader = ({ user, currentUserId }) => {  
    const navigate = useNavigate()
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', cursor:'pointer'}} onClick={() => navigate(`/profile/${user._id}`)}>
          <Avatar 
            src={user.profileImage} 
            alt={user?.username} 
            sx={{ marginRight: '10px', transition:'opacity 0.3s ease', '&:hover': { opacity: 0.7} }} 
          />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', transition: 'color 0.3 ease', '&:hover': {color:'primary.main'} }}>
              {user?.username}
            </Typography>
          </Box>
        </Box>
        <FollowButton 
          userId={user._id} 
          initialFollowing={user.isFollowing } 
          username={user.username} 
          currentUserId={currentUserId}
        />
      </Box>
    );
  };