import jwt from "jsonwebtoken";

export const generateAccessToken = (username) => {
  const accessToken = jwt.sign(
    { username },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: "30m",
    }
  );
  // payload : userId
  return accessToken;
};

export const generateRefreshTokenAndSetCookie = async (user, res) => {
  const refreshToken = jwt.sign(
    { username: user.username },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("jwt", refreshToken, {
    httpOnly: true, // prevent XSS attacks
    sameSite: "Strict", // prevents CSRF attacks
    secure: process.env.NODE_ENV !== "development", // only send cookie over HTTPS(prevent XSS attacks)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
