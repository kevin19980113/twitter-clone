import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader?.startsWith("Bearer "))
      return res.status(403).json({
        error: "No Bearer Token",
      });

    const token = authHeader.split(" ")[1];

    jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err)
          return res.status(401).json({ error: "Unauthorized Access Token" });

        const user = await User.findById(decoded.userId).select(
          "-password -refreshToken"
        );

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        req.user = user;
        next();
      }
    );
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ error: "Internal Server Error" }); // 500 Internal Server Error
  }
};

export default protectRoute;
