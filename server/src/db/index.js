import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDB = async () => {
    try {
        let mongoURL = process.env.MONGODB_URL;

        if (!mongoURL) {
            console.error("MONGODB_URL is missing in environment variables!");
            process.exit(1);
        }
        mongoURL = mongoURL.replace(/\/$/, "");

        console.log(`⏳ Connecting to Database: ${DB_NAME}...`);
        const connectionInstance = await mongoose.connect(`${mongoURL}/${DB_NAME}`);
        console.log(`\nMongoDB Connected! DB HOST: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.error("MONGODB connection error:", error.message);
        process.exit(1);
    }
}

export default connectDB;