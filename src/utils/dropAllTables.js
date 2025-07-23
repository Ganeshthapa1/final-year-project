const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../../.env' });

const MYSQL_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'petcare',
  multipleStatements: true
};

async function dropAllTables() {
  const connection = await mysql.createConnection(MYSQL_CONFIG);
  const [tables] = await connection.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = ?`,
    [MYSQL_CONFIG.database]
  );

  if (tables.length === 0) {
    console.log('No tables found in database.');
    await connection.end();
    return;
  }

  // Disable foreign key checks
  await connection.query('SET FOREIGN_KEY_CHECKS = 0');

  for (const row of tables) {
    const table = row.TABLE_NAME || row.table_name;
    console.log(`Dropping table: ${table}`);
    await connection.query(`DROP TABLE IF EXISTS \`${table}\``);
  }

  // Enable foreign key checks
  await connection.query('SET FOREIGN_KEY_CHECKS = 1');
  await connection.end();
  console.log('✅ All tables dropped from database:', MYSQL_CONFIG.database);
}

dropAllTables().catch(err => {
  console.error('Error dropping tables:', err);
  process.exit(1);
});
