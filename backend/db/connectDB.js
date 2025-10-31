// connect to mongodb database
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const URL = process.env.NODE_ENV !== 'production' ? process.env.LOCAL_MONGO : process.env.ATLES_MONGO
        console.log(URL)
        const connect = await mongoose.connect(URL);

        if(connect.connection.readyState === 1){
            console.log("MongoDB connected successfully");
        }
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    }
}

export default connectDB;