import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv({path: '.env'})
const uri = process.env.MONGO_URL || 'mongodb://localhost:27017/testdb'

export const mongoDB = async () => {
    try {
         await mongoose.connect(uri)
        console.log('DB Conneted succesfully')
    }catch(error){
        console.error('Connnection to MongoDB atemt Error:', error)
    }
}