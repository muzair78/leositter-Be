const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - Missing authentication token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    if (!decoded) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid authentication token" });
  }
};

module.exports = auth;
