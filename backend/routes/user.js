import express from "express";
import {
  getUserProfile,
  followUnfollowUser,
  getSuggestedUsers,
  updateUserProfile,
} from "../controllers/userContoller.js";

const userRoute = express.Router();

userRoute.get("/profile/:username", getUserProfile);
userRoute.get("/suggested", getSuggestedUsers);
userRoute.post("/follow/:idToModify", followUnfollowUser);
userRoute.post("/update", updateUserProfile);

export default userRoute;
