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

async function createAllTables() {
  const connection = await mysql.createConnection(MYSQL_CONFIG);

  // Enable foreign key checks
  await connection.query('SET FOREIGN_KEY_CHECKS = 1');

  const tables = [
    // Species
    `CREATE TABLE IF NOT EXISTS species (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    // Breeds
    `CREATE TABLE IF NOT EXISTS breeds (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      species_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (species_id) REFERENCES species(id) ON DELETE CASCADE,
      UNIQUE(name, species_id)
    )`,
    // Clients
    `CREATE TABLE IF NOT EXISTS clients (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE,
      phone VARCHAR(255),
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    // Pets
    `CREATE TABLE IF NOT EXISTS pets (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      species_id INT NOT NULL,
      breed_id INT NOT NULL,
      client_id INT NOT NULL,
      age INT,
      weight DECIMAL(5,2),
      color VARCHAR(255),
      gender VARCHAR(255),
      microchip_id VARCHAR(255) UNIQUE,
      medical_notes TEXT,
      last_visit DATE,
      next_appointment DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (species_id) REFERENCES species(id) ON DELETE CASCADE,
      FOREIGN KEY (breed_id) REFERENCES breeds(id) ON DELETE CASCADE,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    )`,
    // Appointments
    `CREATE TABLE IF NOT EXISTS appointments (
      id INT PRIMARY KEY AUTO_INCREMENT,
      pet_id INT NOT NULL,
      client_id INT NOT NULL,
      appointment_date DATE NOT NULL,
      appointment_time TIME NOT NULL,
      reason VARCHAR(255),
      status VARCHAR(255) DEFAULT 'scheduled',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    )`,
    // Medical Histories
    `CREATE TABLE IF NOT EXISTS medical_histories (
      id INT PRIMARY KEY AUTO_INCREMENT,
      pet_id INT NOT NULL,
      visit_date DATE NOT NULL,
      diagnosis TEXT,
      treatment TEXT,
      medications TEXT,
      notes TEXT,
      veterinarian VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
    )`,
    // Vaccinations
    `CREATE TABLE IF NOT EXISTS vaccinations (
      id INT PRIMARY KEY AUTO_INCREMENT,
      pet_id INT NOT NULL,
      vaccine_name VARCHAR(255) NOT NULL,
      vaccination_date DATE NOT NULL,
      next_due_date DATE,
      batch_number VARCHAR(255),
      veterinarian VARCHAR(255),
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
    )`,
    // Inventory
    `CREATE TABLE IF NOT EXISTS inventory (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      quantity INT NOT NULL DEFAULT 0,
      min_stock INT DEFAULT 10,
      price DECIMAL(10,2),
      category VARCHAR(100),
      expiry_date DATE,
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    // Doctors table
    `CREATE TABLE IF NOT EXISTS doctors (
      id INT PRIMARY KEY AUTO_INCREMENT,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      profile_image VARCHAR(512),
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(255),
      specialization VARCHAR(255),
      is_active TINYINT(1) DEFAULT 1,
      experience_years INT DEFAULT 0,
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      remember TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    // Settings
    `CREATE TABLE IF NOT EXISTS settings (
      id INT PRIMARY KEY DEFAULT 1,
      website_name VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(100),
      address TEXT,
      district VARCHAR(50),
      about TEXT,
      photo_url VARCHAR(512),
      photo1_url VARCHAR(512),
      facebook_link VARCHAR(512),
      instagram_link VARCHAR(512),
      linkedin_link VARCHAR(512),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    //Inquiries table
    `CREATE TABLE IF NOT EXISTS inquiries (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ]
  for (const table of tables) {
    await connection.query(table);
  }

  

  await connection.end();
  console.log('✅ All tables created in database:', MYSQL_CONFIG.database);
}

createAllTables().catch(err => {
  console.error('Error creating tables:', err);
  process.exit(1);
});
