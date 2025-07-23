const express = require("express");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// GET /api/auth/verify
router.get("/verify", authenticateToken, (req, res) => {
  res.json({ message: "Token is valid", user: req.user });
});

module.exports = router;
