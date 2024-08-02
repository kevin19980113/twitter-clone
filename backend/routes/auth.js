import express from "express";
import {
  signup,
  login,
  refresh,
  logout,
  getUser,
} from "../controllers/authController.js";
import protectRoute from "../middleware/protectRoute.js";
import loginLimiter from "../middleware/loginLimiter.js";

const authRouter = express.Router();

// /api/auth...
authRouter.post("/signup", signup);
authRouter.post("/login", loginLimiter, login);
authRouter.get("/refresh", refresh);
authRouter.post("/logout", logout);
authRouter.get("/me", protectRoute, getUser);
export default authRouter;
