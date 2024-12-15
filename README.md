# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# **ICHgram social media platform**


### **Backend**
- RESTful API endpoints for all core features.
- WebSocket integration for real-time notifications.
- Token-based authentication and authorization (JWT).


### **Frontend**
- User authentication (login, registration, and password reset).
- Post creation with image uploads.
- Like and unlike functionality for posts and comments.
- Comments and replies implementation.
- User search functionality.
- Follow and unfollow system.
- User profile management, including editing profile and displaying posts.

## **Current Issues**

### **Notifications**

- **Problem**: Notifications are not functioning as expected. They are not being consistently received, and the system for marking them as "read" is incomplete or bugged.
- **Planned Fix**: Debug and fix the notification WebSocket events. Ensure notifications are properly stored in the database and displayed on the frontend.


### **Chat**
- **Planned Implementation**:
  - Real-time chat using WebSocket.
  - Integration with the user system for private messaging.
  - Typing indicators and read receipts.


  ### **Follow State**
- **Problem**: The follow/unfollow state does not persist correctly after page reloads.
- **Planned Fix**:
  - Store the follow state correctly in the backend and ensure it syncs with the frontend.
  - Refactor the follow/unfollow logic to eliminate inconsistencies.

### **Other Pending Fixes and Features**
- **Profile Picture**: Ensure the user's profile picture updates and displays consistently across the app.
- **Post Media Alignment**: Fix layout issues with post media to align properly in the container.
- **UI Refinements**


## **Getting Started**
- Node.js
- npm 
- Vite (for frontend development)
- running at the URL specified in `.env`

- cd frontend
- npm install
- npm run dev
