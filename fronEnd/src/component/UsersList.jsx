import { Box, List, ListItem, Avatar, ListItemText, Button } from "@mui/material";

export const UsersList = ({ users, selectedUserId, onSelectUser }) => (
  <Box sx={{overflowY: "auto" }}>
    <List>
      {users.map((user) => (
        <ListItem
        component={Button}
          key={user._id}
          onClick={() => onSelectUser(user._id)}
          selected={selectedUserId === user._id}
          sx={{display: 'flex', alignItems:'center', gap:'10px', textTransform:'none', color:'#262626'}}
        >
          <Avatar src={user.profileImage} alt={user.username} />
          <ListItemText primary={user.username} />
        </ListItem>
      ))}
    </List>
  </Box>
);