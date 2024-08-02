import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import connectMongoDB from "./db/connectMongoDB.js";
import mongoose from "mongoose";

dotenv.config();

connectMongoDB();

const app = express();
const PORT = process.env.PORT || 8000;

// routing API routes
app.use("/api/auth", authRouter);

mongoose.connection.once("open", () => {
  console.log("MongoDB connected");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
