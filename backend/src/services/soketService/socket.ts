import { Server } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Message } from "../../models/Message"; 
import { User } from "../../models/User"; 
import { Notification } from "../../models/Notification";

export const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", async (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("getCurrentUser", (_data, callback) => {
    if (socket.data.userId) {
      callback({ success: true, userId: socket.data.userId, profileImage: socket.data.profileImage, lastLogin: socket.data.lastLogin });
    } else {
      callback({ success: false, error: "User ID not available." });
    }
  });
  
  const token = socket.handshake.auth.token;
  if (!token) {
    console.error("Connection rejected: token is missing");
    socket.disconnect();
    return;
  }

  let userId //: { toString: () => string | string[]; };
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
    userId = decoded.id;

    const user = await User.findById(userId).select("username profileImage status lastLogin");
    if (!user) {
      socket.disconnect();
      console.error("User not found");
      return;
    }

    socket.data.userId = userId;
    socket.data.profileImage = user.profileImage;
    socket.join(userId.toString())

    socket.on('fetchNotifications', async(callback) => {
      console.log("Fetching notifications for user:", socket.data.userId);

      try{
        const notifications = await Notification.find({user: socket.data.userId})
        .populate({
          path: 'relatedPost',
          populate: [
              { path: 'likes', select: 'username' },
          ],
      })
      .populate('relatedUser', 'username profileImage');
        console.log("Fetched notifications:", notifications);


        
        callback({success: true, notifications})
      }catch(error:any){
        console.error('error fetching notifications', error)
      }
    })    
    

    }catch(error:any){
      console.error('invalid token', error)
      socket.disconnect()
      return
    }
  
      socket.on("chatOpened", async ({ chatUserId }) => {
        try {
            // console.log(chatUserId);

          const chatUser = await User.findById(chatUserId);
          if (chatUser) {
            // chatUser.lastLogin = new Date();
            // await chatUser.save();

        io.to(socket.id).emit("updateLastLogin", {
            userId: chatUserId,
            lastLogin: chatUser.lastLogin ? chatUser.lastLogin.toISOString() : null
        });
        }
        } catch (error) {
          console.error("Error handling chatOpened:", error);
        }
      });

    socket.on("sendMessage", async ({ recipientId, message }, callback) => {
    if (recipientId === userId) {
      return callback({ success: false, error: "Cannot send messages to yourself" });
    }

    try {
      const newMessage = new Message({
        sender: userId,
        recipient: recipientId,
        message,
      });

      await newMessage.save();

      socket.emit("newMessage", newMessage);
      const recipientSocket = [...io.sockets.sockets.values()].find(
        (s) => s.data.userId === recipientId
      );

      if (recipientSocket) {
        recipientSocket.emit("newMessage", newMessage);
      }

      callback({ success: true, message: newMessage });
    } catch (error) {
      console.error("Error sending message:", error);
      callback({ success: false, error: "Failed to send message" });
    }
  });

  socket.on("markAsRead", async ({ messageId, recipientId }, callback) => {
    console.log("markAsRead received:", { messageId, recipientId });

    try {
      const message = await Message.findById(messageId);
      console.log("Found message:", message);

      if (!message) {
        callback({ success: false, error: "Message not found" });
        return;
      }
  
      message.isRead = true;
      await message.save();
  
    const messageIdString = message._id.toString();

  io.to(message.sender.toString()).emit("messageRead", { messageId: messageIdString });
  io.to(message.recipient.toString()).emit("messageRead", { messageId: messageIdString });
      callback({ success: true });
    } catch (error) {
      console.error("Error marking message as read:", error);
      callback({ success: false, error: "Internal server error" });
    }
  });

  socket.on("fetchMessages", async ({ recipientId }, callback) => {
    try {
      const messages = await Message.find({
        $or: [
          { sender: userId, recipient: recipientId },
          { sender: recipientId, recipient: userId },
        ],
      }).sort({ createdAt: 1 })

      callback({ success: true, messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      callback({ success: false, error: "Failed to fetch messages" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    socket.removeAllListeners("chatOpened");

  });
});