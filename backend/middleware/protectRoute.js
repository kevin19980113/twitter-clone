import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader?.startsWith("Bearer "))
      return res.status(401).json({
        error: "No Bearer Header Provided",
      }); // Unauthorized

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err)
        return res.status(403).json({ error: "Unauthorized Access Token" }); // Forbidden

      req.username = decoded.username;
      next();
    });
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ error: "Internal Server Error" }); // 500 Internal Server Error
  }
};

export default protectRoute;
