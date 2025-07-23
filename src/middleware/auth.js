// src/middleware/auth.js
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization; // Lowercase
  console.log("Raw Authorization header:", authHeader); // Debug
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Extracted token:", token); // Debug

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    console.log("Token decoded:", decoded); // Debug
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res.status(403).json({ error: "Invalid or expired token." });
  }
}

module.exports = { authenticateToken };
