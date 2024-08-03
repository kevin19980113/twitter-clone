import express from "express";
import {
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
  createPost,
  deletePost,
  commentOnPost,
  likeUnlikePost,
} from "../controllers/postController.js";

const postRoutes = express.Router();

postRoutes.get("/all", getAllPosts);
postRoutes.get("/following", getFollowingPosts);
postRoutes.get("/likes/:id", getLikedPosts);
postRoutes.get("/user/:username", getUserPosts);
postRoutes.post("/create", createPost);
postRoutes.post("/like/:id", likeUnlikePost);
postRoutes.post("/comment/:id", commentOnPost);
postRoutes.delete("/delete/:id", deletePost);

export default postRoutes;
