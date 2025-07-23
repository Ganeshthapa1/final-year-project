// Migration script to add 'district' column to 'settings' table if it does not exist
const db = require('./database').db;

async function addDistrictColumn() {
  try {
    await db.connect();
    // Check if 'district' column exists
    const rows = await db.all("SHOW COLUMNS FROM settings LIKE 'district'");
    const hasDistrict = rows.length > 0;
    if (!hasDistrict) {
      await db.run("ALTER TABLE settings ADD COLUMN district VARCHAR(50)");
      console.log("'district' column added to 'settings' table.");
    } else {
      console.log("'district' column already exists in 'settings' table.");
    }
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await db.close();
  }
}

addDistrictColumn();
