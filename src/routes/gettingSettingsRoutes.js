const express = require("express");
const router = express.Router();
const { getDb } = require("../utils/database");
router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    const [rows] = await db.query(
      "SELECT * FROM settings WHERE id = 1 LIMIT 1"
    );
    if (rows.length === 0) {
      // If no row exists, insert a default row
      await db.query(`INSERT INTO settings (id) VALUES (1)`);
      return res.json({});
    }
    res.json(rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch settings", details: err.message });
  }
});

module.exports = router;
