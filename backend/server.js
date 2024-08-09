import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import postRoute from "./routes/post.js";
import notificationRoute from "./routes/notification.js";
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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "10mb" })); // to parse req.body as JSON
app.use((err, req, res, next) => {
  if (err.type === "entity.too.large")
    return res
      .status(413)
      .json({ error: "File Size is too large (Maximum - 10mb)" });
  next(err);
});
app.use(express.urlencoded({ extended: true })); // to parse req.body as URL-encoded
app.use(cookieParser()); // to parse cookies from req.headers

// routing API routes
app.use("/api/auth", authRoute);
app.use("/api/users", protectRoute, userRoute);
app.use("/api/posts", protectRoute, postRoute);
app.use("/api/notifications", protectRoute, notificationRoute);

if (process.env.NODE_ENV === "production") {
  const frontendBuildPath = path.join(__dirname, "..", "frontend", "dist");
  app.use(express.static(frontendBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

mongoose.connection.once("open", () => {
  console.log("MongoDB connected");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
