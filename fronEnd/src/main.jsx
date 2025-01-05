import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FollowProvider } from './context/FollowContext.jsx'
import { NotificationProvider } from './component/Notification/NotificationContext.jsx'
import { PostsProvider } from './context/PostContext.jsx'

createRoot(document.getElementById('root')).render(
    <FollowProvider>
        <NotificationProvider>
            <PostsProvider>
            <App />
            </PostsProvider>
        </NotificationProvider>
    </FollowProvider>
)
