import User from "../models/User.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!text && !img)
      return res.status(400).json({ message: "Post need Text or Image" });

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in createPost controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ message: "You are not unauthorized to delete this post!" });

    if (post.img)
      await cloudinary.uploader.destroy(
        post.img.split("/").pop().split(".")[0]
      );

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error in deletePost controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text)
      return res.status(400).json({ message: "Comment text is required" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = { text, user: userId };

    post.comments.push(newComment);
    await post.save();

    // send notification to post owner
    const notification = new Notification({
      from: req.user._id,
      to: post.user,
      type: "COMMENT",
      post: postId,
    });
    await notification.save();

    res.status(200).json(newComment);
  } catch (error) {
    console.error("Error in commentOnPost controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // Unlike the post
      await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
      await User.findByIdAndUpdate(userId, { $pull: { likedPosts: postId } });

      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // Like the post
      post.likes.push(userId);
      await post.save();
      await User.findByIdAndUpdate(userId, { $push: { likedPosts: postId } });

      // send notification to post owner
      const notification = new Notification({
        from: req.user._id,
        to: post.user,
        type: "LIKE",
        post: postId,
      });
      await notification.save();

      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.error("Error in likeUnlikePost controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password -refreshToken",
      })
      .populate({
        path: "likes",
        select: "-password -refreshToken",
      })
      .populate({
        path: "comments.user",
        select: "-password -refreshToken",
      });
    // Populate user information because user is referenced in posts array

    if (posts.length === 0)
      return res.status(200).json({ message: "No posts found" });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getAllPosts controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getLikedPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const likedPosts = await Post.find({
      _id: { $in: user.likedPosts },
    })
      .populate({
        path: "user",
        select: "-password -refreshToken",
      })
      .populate({
        path: "likes",
        select: "-password -refreshToken",
      })
      .populate({
        path: "comments.user",
        select: "-password -refreshToken",
      });

    res.status(200).json(likedPosts);
  } catch (error) {
    console.error("Error in getLikedPosts controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const following = user.following;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password -refreshToken",
      })
      .populate({
        path: "likes",
        select: "-password -refreshToken",
      })
      .populate({
        path: "comments.user",
        select: "-password -refreshToken",
      });

    res.status(200).json(feedPosts);
  } catch (error) {
    console.error("Error in getFollowingPosts controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password -refreshToken",
      })
      .populate({
        path: "likes",
        select: "-password -refreshToken",
      })
      .populate({
        path: "comments.user",
        select: "-password -refreshToken",
      });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getUserPosts controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
