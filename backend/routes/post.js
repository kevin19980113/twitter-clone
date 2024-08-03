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

const postRoute = express.Router();

postRoute.get("/all", getAllPosts);
postRoute.get("/following", getFollowingPosts);
postRoute.get("/likes/:id", getLikedPosts);
postRoute.get("/user/:username", getUserPosts);
postRoute.post("/create", createPost);
postRoute.post("/like/:id", likeUnlikePost);
postRoute.post("/comment/:id", commentOnPost);
postRoute.delete("/delete/:id", deletePost);

export default postRoute;
