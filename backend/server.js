import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import connectMongoDB from "./db/connectMongoDB.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

dotenv.config();

connectMongoDB();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json()); // to parse req.body as JSON
app.use(express.urlencoded({ extended: true })); // to parse req.body as URL-encoded
app.use(cookieParser()); // to parse cookies from req.headers

// routing API routes
app.use("/api/auth", authRouter);

mongoose.connection.once("open", () => {
  console.log("MongoDB connected");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
