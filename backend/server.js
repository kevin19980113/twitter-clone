import express from "express";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";
import connectMongoDB from "./db/connectMongoDB.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import protectRoute from "./middleware/protectRoute.js";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectMongoDB();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json()); // to parse req.body as JSON
app.use(express.urlencoded({ extended: true })); // to parse req.body as URL-encoded
app.use(cookieParser()); // to parse cookies from req.headers

// routing API routes
app.use("/api/auth", authRoutes);
app.use(protectRoute);
app.use("/api/users", userRoutes);
app.use("/api/post", postRoutes);

mongoose.connection.once("open", () => {
  console.log("MongoDB connected");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
