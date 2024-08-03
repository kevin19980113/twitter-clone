import express from "express";
import {
  signup,
  login,
  refresh,
  logout,
  getMe,
} from "../controllers/authController.js";
import protectRoute from "../middleware/protectRoute.js";
import loginLimiter from "../middleware/loginLimiter.js";

const authRoutes = express.Router();

// /api/auth...
authRoutes.post("/signup", signup);
authRoutes.post("/login", loginLimiter, login);
authRoutes.get("/refresh", refresh);
authRoutes.post("/logout", logout);
authRoutes.get("/me", protectRoute, getMe);

export default authRoutes;
