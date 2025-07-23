const express = require('express');
const router = express.Router();
const { getDb } = require('../utils/database');

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const [rows] = await db.query('SELECT * FROM settings WHERE id = 1 LIMIT 1');
    if (rows.length === 0) {
      // If no row exists, insert a default row
      await db.query(`INSERT INTO settings (id) VALUES (1)`);
      return res.json({});
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings', details: err.message });
  }
});

// POST /api/settings
router.post('/', async (req, res) => {
  try {
    const db = await getDb();
    const settings = req.body;
    // Upsert (insert or update) the singleton row
    await db.query(`REPLACE INTO settings (id, website_name, email, phone, address, district, about, photo_url, photo1_url, facebook_link, instagram_link, linkedin_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [1, settings.websiteName, settings.email, settings.phone, settings.address, settings.district, settings.about, settings.photoUrl, settings.photo1Url, settings.facebook, settings.instagram, settings.linkedin]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings', details: err.message });
  }
});

module.exports = router;
