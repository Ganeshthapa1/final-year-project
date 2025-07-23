const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");

const MYSQL_CONFIG = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "petcare",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection(MYSQL_CONFIG);
      console.log("✅ Connected to MySQL database:", MYSQL_CONFIG.database);
    } catch (error) {
      console.error("Database connection error:", error.message);
      throw error;
    }
  }

  async close() {
    try {
      if (this.connection) {
        await this.connection.end();
        console.log("📴 MySQL database connection closed");
      }
    } catch (error) {
      console.error("Error closing database:", error.message);
      throw error;
    }
  }

  async run(sql, params = []) {
    try {
      const [result] = await this.connection.execute(sql, params);
      return {
        id: result.insertId || null,
        changes: result.affectedRows || 0,
        result,
      };
    } catch (error) {
      console.error("Database run error:", error.message);
      throw error;
    }
  }

  async get(sql, params = []) {
    try {
      const [rows] = await this.connection.execute(sql, params);
      return rows[0] || null;
    } catch (error) {
      console.error("Database get error:", error.message);
      throw error;
    }
  }

  async all(sql, params = []) {
    try {
      const [rows] = await this.connection.execute(sql, params);
      return rows;
    } catch (error) {
      console.error("Database all error:", error.message);
      throw error;
    }
  }
}

const db = new Database();

async function initDatabase() {
  try {
    await db.connect();
    await createTables();
    await seedDate();
    console.log("🏗️ Database initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  }
}

async function seedDate() {
  (async () => {
    try {
      const hashedPassword = await bcrypt.hash("password123", 10);
      await db.run(
        `
      INSERT INTO users (email, password, remember, created_at, updated_at)
      SELECT 'admin@petcare.com', ?, 0, NOW(), NOW()
      WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@petcare.com')
    `,
        [hashedPassword]
      );
      console.log("Admin user inserted");
    } catch (err) {
      console.error("Failed to insert admin user:", err.message);
    }
  })();
}
async function createTables() {
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
    // Appointments
    `CREATE TABLE IF NOT EXISTS appointments (
      id INT PRIMARY KEY AUTO_INCREMENT,
      pet_id INT NOT NULL,
      client_id INT NOT NULL,
      doctor_id INT NOT NULL,
      appointment_date DATE NOT NULL,
      appointment_time TIME NOT NULL,
      reason VARCHAR(255),
      status VARCHAR(255) DEFAULT 'scheduled',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
      FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
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
    
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      remember TINYINT(1) DEFAULT 0,
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
    )`,
  ];

  for (const table of tables) {
    await db.run(table);
  }

  const indexDefinitions = [
    {
      name: "idx_pets_client_id",
      sql: "CREATE INDEX idx_pets_client_id ON pets(client_id)",
    },
    {
      name: "idx_pets_species_id",
      sql: "CREATE INDEX idx_pets_species_id ON pets(species_id)",
    },
    {
      name: "idx_pets_breed_id",
      sql: "CREATE INDEX idx_pets_breed_id ON pets(breed_id)",
    },
    {
      name: "idx_appointments_pet_id",
      sql: "CREATE INDEX idx_appointments_pet_id ON appointments(pet_id)",
    },
    {
      name: "idx_appointments_date",
      sql: "CREATE INDEX idx_appointments_date ON appointments(appointment_date)",
    },
    {
      name: "idx_appointments_status",
      sql: "CREATE INDEX idx_appointments_status ON appointments(status)",
    },
    {
      name: "idx_appointments_doctor_date_time", // Added index for doctor_id, date, and time
      sql: "CREATE INDEX idx_appointments_doctor_date_time ON appointments(doctor_id, appointment_date, appointment_time)",
    },
    {
      name: "idx_medical_histories_pet_id",
      sql: "CREATE INDEX idx_medical_histories_pet_id ON medical_histories(pet_id)",
    },
    {
      name: "idx_vaccinations_pet_id",
      sql: "CREATE INDEX idx_vaccinations_pet_id ON vaccinations(pet_id)",
    },
  ];

  for (const idx of indexDefinitions) {
    const [rows] = await db.connection.query(
      `SELECT COUNT(1) as count FROM information_schema.statistics WHERE table_schema = ? AND index_name = ?`,
      [MYSQL_CONFIG.database, idx.name]
    );
    if (rows[0].count === 0) {
      await db.run(idx.sql);
    }
  }
}

async function getDb() {
  if (!global._db) {
    global._db = await mysql.createConnection(MYSQL_CONFIG);
  }
  return global._db;
}

module.exports = {
  db,
  initDatabase,
  createTables,
  getDb,
  Database,
};
