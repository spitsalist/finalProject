import {authRouter} from './src/routes/authRouter'
import {postMessage} from './src/routes/messageRouter'
import { postRouter } from "./src/routes/userPost"
import { followRouter } from "./src/routes/followRouter"
import { notifyRouter } from "./src/routes/notificationRouter"
import { likeRouter } from "./src/routes/likeRouter"
import { commentRouter } from "./src/routes/commentRouter"
import { searchUserRouter } from "./src/routes/searchUserRouter"
import express from "express"
import cors from 'cors'
import { isPrivate } from './src/routes/privateRouter'
import {userRouter} from './src/routes/userRouter'

export const createApp =()=>{
const app = express()

// const FRONTEND_URL = 'http://localhost:5173'

// const corsOptions = {
//   origin: FRONTEND_URL,
// //   credentials: true,

// app.use(cors(corsOptions))
// app.use(cors())
app.use(cors({ origin: "*" }))

app.use(express.json())

app.use('/auth', authRouter)
app.use('/post', postRouter)
app.use('/message', postMessage)
app.use('/follow', followRouter)
app.use('/notification', notifyRouter)
app.use('/like', likeRouter)
app.use('/comment', commentRouter)
app.use('/search', searchUserRouter)
app.use('/privacy', isPrivate)
app.use('/user',userRouter)

return app
}
