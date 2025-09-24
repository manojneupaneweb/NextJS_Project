import mongoose from "mongoose";



export const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URI!);
        const connecton = mongoose.connection;

        connecton.on('connected', () => {
            console.log("MongoDB connected");
        })

        connecton.on('error', (err) => {
            console.log("MongoDB connection error", err);
            throw new Error("MongoDB connection failed");
            process.exit(1);
        })
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw new Error("MongoDB connection failed");
    }
};
