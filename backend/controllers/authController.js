import User from "../models/User.js";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshTokenAndSetCookie,
} from "../lib/utils/generateTokenAndSetCookie.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { username, fullName, password, email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" }); // 400 Bad Request
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      email,
    });

    if (newUser) {
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      }); // 201 Created
    } else {
      res.status(400).json({ error: "Invalid user Data" });
    }
  } catch (error) {
    console.log("Error in Signup contoller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" }); // 500 Internal Server Error
  }
};
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid username or password" }); // 401 Unauthorized
    }

    const accessToken = generateAccessToken(user.username);
    await generateRefreshTokenAndSetCookie(user, res);

    res.status(200).json({ accessToken });
  } catch (error) {
    console.log("Error in login contoller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" }); // 500 Internal Server Error
  }
};
export const refresh = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt)
      return res.status(401).json({
        error: "No Token Provided",
      }); // Unauthorized

    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser)
      return res.status(403).json({ error: "Invaild refreshToken" }); // Forbidden

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.username !== decoded.username)
          return res
            .status(403)
            .json({ error: "Failed verifying refresh token" }); // Forbidden

        const accessToken = generateAccessToken(foundUser.username);
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log("Error in refresh contoller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" }); // 500 Internal Server Error
  }
};
export const logout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No Content (that's fine anyway I'm gonna delete the cookie)

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV !== "development",
      });
      return res.sendStatus(204);
    }

    foundUser.refreshToken = null;
    await foundUser.save();

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in log out contoller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" }); // 500 Internal Server Error
  }
};
export const getUser = async (req, res) => {
  try {
    const username = req.username;
    const user = await User.findOne({ username }).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUser contoller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" }); // 500 Internal Server Error
  }
};
