// Migration script to drop the 'unit' column from the inventory table
const { db } = require('./database');

async function dropUnitColumn() {
  try {
    await db.connect(); // Ensure DB connection is established
    await db.run('ALTER TABLE inventory DROP COLUMN unit');
    console.log('✅ Dropped unit column from inventory table');
    await db.close();
  } catch (error) {
    console.error('❌ Error dropping unit column:', error.message);
  }
}

dropUnitColumn().then(() => process.exit());
