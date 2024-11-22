import { configDotenv } from "dotenv"
import { mongoDB } from "./src/config/db"
import { createApp } from "./app"
import { io } from "./src/services/soketService/socket"
configDotenv({path: '.env'})

const port = process.env.PORT || 4001

const start = async() => {
   try{
   await mongoDB() 
   const app = createApp()
   const server = app.listen(port,()=> console.log(`Server is running on port: ${port}`))
    io.attach(server);
   }catch(error){
    console.error('Internal server error', error)
   }
}
start()

