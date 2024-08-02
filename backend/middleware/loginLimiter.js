import rateLimit from "express-rate-limit";

// rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 login requests per minute
  message: {
    error:
      "Too many login attempts from this IP, please try again after a 60 second pause",
  },
  // when the rate limit is exceeded. it handles
  handler: (req, res, next, options) => {
    res.status(options.statusCode).send(options.message); // 429 Too Many Requests
  },
  standardHeaders: true, // enable RateLimit-* headers in the response, which provide info about the rate limit
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export default loginLimiter;
