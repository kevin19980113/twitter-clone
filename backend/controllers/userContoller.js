import User from "../models/User.js";
import Notification from "../models/Notification.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select(
      "-password -refreshToken"
    );
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" }); // 500 Internal Server Error
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { idToModify } = req.params;
    const userToModify = await User.findById(idToModify);
    const currentUser = await User.findById(req.user._id);

    if (idToModify === req.user._id)
      return res.status(400).json({ error: "Cannot follow yourself" });

    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(idToModify);

    if (isFollowing) {
      // Unfollow user
      await User.findByIdAndUpdate(idToModify, {
        $pull: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: idToModify },
      });
      res
        .status(200)
        .json({ username: userToModify.username, status: "UNFOLLOWED" });
    } else {
      // Follow user

      // update userToModify's follower array
      await User.findByIdAndUpdate(idToModify, {
        $push: { followers: req.user._id },
      });
      // update currentUser's following array
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: idToModify },
      });

      //send notification to userToModify
      const newNotification = new Notification({
        from: req.user._id,
        to: userToModify._id,
        type: "FOLLOW",
      });

      await newNotification.save();

      res
        .status(200)
        .json({ username: userToModify.username, status: "FOLLOWED" });
    }
  } catch (error) {
    console.log("Error in followUnfollowUser controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" }); // 500 Internal Server Error
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const usersFollowedByMe = await User.findById(userId).select("following");

    const randomUsers = await User.aggregate([
      {
        $match: {
          // Filters the documents to pass only the documents that match the specified condition(s)
          _id: {
            // filter by _id not equal to userId
            $ne: userId, // negative condition: userId
          },
        },
      },
      { $sample: { size: 10 } }, // selects 10 random document from the input array
    ]);

    const filteredUsers = randomUsers.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );

    const suggestedUsers = filteredUsers.slice(0, 5);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error in getSUggestedUsers controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" }); // 500 Internal Server Error
  }
};

export const updateUserProfile = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;

  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if ((!newPassword && currentPassword) || (newPassword && !currentPassword))
      return res.status(400).json({
        error: "Please provide both current password and new password",
      });

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(401).json({ error: "Incorrect current password" });

      if (newPassword.length < 6)
        return res
          .status(400)
          .json({ error: "New password must be at least 6 characters long" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      return res.status(200).json({ message: "Password updated successfully" });
    }

    if (profileImg) {
      if (user.profileImg) {
        // delete old profile image from cloudinary
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0] // get just the id from the URL
        );
      }
      // upload new profile image to cloudinary
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      // delete old cover image from cloudinary
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0] // get just the id from the URL
        );
      }
      // upload new cover image to cloudinary
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();
    user.password = null;

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in updateUserProfile controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" }); // 500 Internal Server Error
  }
};
