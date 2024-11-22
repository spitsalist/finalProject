import { Server } from "socket.io";

export const io = new Server({
        cors: ({
            origin: '*',
            methods: ['GET', 'POST'],
            credentials: true,
        })
    })
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id)

        socket.on('joinChat', (userId) => {
            socket.join(userId)
            console.log(`User ${userId} joined the chat`)
        })
        socket.on('disconnect', () => {
            console.log('User disconnected', socket.id)
        })
    })

