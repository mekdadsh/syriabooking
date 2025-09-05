const jwt = require("jsonwebtoken");
const { createError } = require("../utils/error.js");

const verifyToken = (req, res, next) => {
  // Check both cookie and authorization header
  const token = req.cookies.access_token || 
                req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};
const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
      req.userId = req.user.id; // Make user ID easily accessible
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

module.exports = { verifyToken, verifyUser, verifyAdmin };
