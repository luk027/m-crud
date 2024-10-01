import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connection.js";
import userRouter from "./routes/user.route.js";
import cors from 'cors';
dotenv.config();
const PORT = process.env.PORT || 8080;
const MongoURL = process.env.MONGODB_URL;
const app = express();

//middlewares
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
}))

//routes
app.use("/api/users", userRouter);

//Connecting to Server
try {
    connectDB(MongoURL);
    app.listen(PORT, () => {
        console.log(`Server is running at PORT: ${PORT}`);
    })
} catch (error) {
    console.log("Server connection error: ",error);
}
