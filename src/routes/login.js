const express = require("express");
const router = express.Router();
const { db } = require("../utils/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// POST /api/login
router.post("/", async (req, res) => {
  // Debug log
  const { email, password } = req.body;
  console.log("Login attempt body:", email);
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  try {
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "24h" }
    );

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

// POST /api/login/logout
router.post("/logout", (req, res) => {
  // Client should remove token; backend can log event if needed
  res.json({ message: "Logged out successfully" });
});

// GET /api/login (for clarity, not for authentication)
router.get("/", (req, res) => {
  res.status(405).json({
    error: "Method Not Allowed",
    message: "Please use POST to log in.",
  });
});

module.exports = router;
