import mongoose from "mongoose";

export const connectDB = async(url) => {
    await mongoose.connect(url)
    .then(() => console.log("MongoDB Connected!"))
    .catch((err) => console.log("MongoDB Error: ",err));
}
