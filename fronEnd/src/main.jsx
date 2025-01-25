import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FollowProvider } from './context/FollowContext.jsx'
import { NotificationProvider } from './component/Notification/NotificationContext.jsx'
import { PostsProvider } from './context/PostContext.jsx'
import { UserProvider } from './context/userContext';

createRoot(document.getElementById('root')).render(
    <UserProvider>
    <FollowProvider initialFollowing>
        <NotificationProvider>
            <PostsProvider>
            <App />
            </PostsProvider>
        </NotificationProvider>
    </FollowProvider>
    </UserProvider>
)
