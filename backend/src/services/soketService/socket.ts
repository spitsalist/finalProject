import { Server } from "socket.io";
import { Message } from "../../models/Message";

export const io = new Server({
        cors: {
            origin: process.env.VITE_API_BASE_URL,
            methods: ['GET', 'POST'],
            credentials: true,
        }
    })
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id)

        socket.on('joinChat', (userId) => {
            socket.join(userId)
            console.log(`User ${userId} joined the chat`)
        })

        socket.on('fetchMessages', async ({userId, currentUserId}) => {
            try{
                const  messages = await Message.find({
                    $or:[
                        {sender: currentUserId, recipient: userId},
                        {sender: userId, recipient: currentUserId}

                    ],
                })
                .populate('sender', 'username')
                .populate('recipient', 'username')
                .sort({createdAt: 1})

                socket.emit('messageFetched', messages)
            }catch(error){
                console.error('Error fetching message:', error)
            }
        })
        socket.on('disconnect', () => {
            console.log('User disconnected', socket.id)
        })
    })

