import express from "express";
import {
  getUserProfile,
  followUnfollowUser,
  getSuggestedUsers,
  updateUserProfile,
} from "../controllers/userContoller.js";

const userRoutes = express.Router();

userRoutes.get("/profile/:username", getUserProfile);
userRoutes.get("/suggested", getSuggestedUsers);
userRoutes.post("/follow/:idToModify", followUnfollowUser);
userRoutes.post("/update/", updateUserProfile);

export default userRoutes;
