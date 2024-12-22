import React, { useState, useEffect } from 'react';
import { followUser, unfollowUser } from '../../../api/auth';
import { Button } from '@mui/material';
import { useNotifications } from '../../Notification/NotificationContext';

export const FollowButton = ({ userId, username, initialFollowing }) => {
  const [following, setFollowing] = useState(initialFollowing)
  const { createNotification } = useNotifications();

  useEffect(() => {
    setFollowing(initialFollowing);
  }, [initialFollowing]);

  const handleFollowClick = async () => {
    try {
      if (following) {
        await unfollowUser(userId);
      } else {
        await followUser(userId, username);
        createNotification?.({
          content: `You started following ${username}`,
          type: 'follow',
          userId,
        });
      }
      setFollowing(!following)
    } catch (error) {
      console.error('Error updating follow state:', error);
    }
  };

  return (
    <Button onClick={handleFollowClick}>
      {following ? 'Unfollow' : 'Follow'}
    </Button>
  );
};