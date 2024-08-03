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

const authRoute = express.Router();

// /api/auth...
authRoute.post("/signup", signup);
authRoute.post("/login", loginLimiter, login);
authRoute.get("/refresh", refresh);
authRoute.post("/logout", logout);
authRoute.get("/me", protectRoute, getMe);

export default authRoute;
