import { Box, List, ListItem, Avatar, ListItemText } from "@mui/material";

export const UsersList = ({ users, selectedUserId, onSelectUser }) => (
  <Box sx={{ width: "30%", borderRight: "1px solid #ddd", overflowY: "auto" }}>
    <List>
      {users.map((user) => (
        <ListItem
          button
          key={user._id}
          onClick={() => onSelectUser(user._id)}
          selected={selectedUserId === user._id}
        >
          <Avatar src={user.profileImage} alt={user.username} />
          <ListItemText primary={user.username} />
        </ListItem>
      ))}
    </List>
  </Box>
);