const { db } = require('../utils/database');
const { cloudinary } = require('../middleware/cloudinary');

class Doctor {
  static async findAll() {
    return db.all('SELECT * FROM doctors ORDER BY last_name ASC, first_name ASC');
  }

  static async findById(id) {
    return db.get('SELECT * FROM doctors WHERE id = ?', [id]);
  }

  static async findByEmail(email) {
    return db.get('SELECT * FROM doctors WHERE email = ?', [email]);
  }

  static async create(data) {
    const { 
      first_name, 
      last_name, 
      email, 
      phone, 
      specialization, 
      experience_years, 
      status,
      profile_image
    } = data;
    
    return db.run(
      `INSERT INTO doctors (
        first_name, last_name, email, phone, specialization, experience_years, status, profile_image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        first_name ?? null,
        last_name ?? null,
        email ?? null,
        phone ?? null,
        specialization ?? null,
        experience_years ?? null,
        status ?? null,
        profile_image ?? null
      ]
    );
  }

  static async update(id, data) {
    const { 
      first_name, 
      last_name, 
      email, 
      phone, 
      specialization, 
      experience_years, 
      status,
      profile_image
    } = data;
    
    return db.run(
      `UPDATE doctors SET 
        first_name=?, last_name=?, email=?, phone=?, specialization=?, 
        experience_years=?, status=?, profile_image=?, updated_at=NOW() 
      WHERE id=?`,
      [
        first_name ?? null,
        last_name ?? null,
        email ?? null,
        phone ?? null,
        specialization ?? null,
        experience_years ?? null,
        status ?? null,
        profile_image ?? null,
        id
      ]
    );
  }

  static async delete(id) {
    return db.run('DELETE FROM doctors WHERE id = ?', [id]);
  }

  static async count() {
    const row = await db.get('SELECT COUNT(*) as count FROM doctors');
    return row ? row.count : 0;
  }

  static async countActiveDocotrs() {
    const row = await db.get('SELECT COUNT(*) as count FROM doctors WHERE status = ?', ['active']);
    return row ? row.count : 0;
  }

  static async getBySpecialization(specialization) {
    return db.all('SELECT * FROM doctors WHERE specialization = ? AND status = ?', [specialization, 'active']);
  }

  static async getStats() {
    const [totalDoctors, activeDoctors] = await Promise.all([
      this.count(),
      this.countActiveDocotrs()
    ]);
    
    return {
      totalDoctors,
      activeDoctors,
      inactiveDoctors: totalDoctors - activeDoctors
    };
  }

  static async searchDoctors(searchTerm) {
    const term = `%${searchTerm}%`;
    return db.all(`
      SELECT * FROM doctors 
      WHERE (first_name LIKE ? OR last_name LIKE ? OR specialization LIKE ?) 
      AND status = 'active'
      ORDER BY last_name ASC, first_name ASC
    `, [term, term, term]);
  }

  // Get all unique statuses from doctors
  static async getAllStatuses() {
    const rows = await db.all('SELECT DISTINCT status FROM doctors');
    return rows.map(row => row.status);
  }

  // Fetch all images from a specific Cloudinary folder and store their URLs in the database
  static async syncPhotosFromCloudinary(folder = 'homepage') {
    // Fetch images from the specified folder (e.g., 'homepage' or 'about')
    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by('public_id', 'desc')
      .max_results(100)
      .execute();

    // Store each image URL in a new table or a dedicated field as needed
    // Example: Insert into a 'photos' table (pseudo-code, adjust for your schema)
    for (const img of result.resources) {
      // You can store img.secure_url, img.public_id, etc.
      await db.run('INSERT OR IGNORE INTO photos (url, public_id, folder) VALUES (?, ?, ?)', [img.secure_url, img.public_id, folder]);
    }
    return result.resources.map(img => img.secure_url);
  }

  // Fetch images for doctors from the 'doctors' folder in Cloudinary and store their URLs in the database
  static async syncDoctorPhotosFromCloudinary() {
    // Fetch images from the 'doctors' folder in Cloudinary
    const result = await cloudinary.search
      .expression('folder:doctors')
      .sort_by('public_id', 'desc')
      .max_results(100)
      .execute();

    // Store each image URL in a new table or a dedicated field as needed
    for (const img of result.resources) {
      // Example: Insert into a 'doctor_photos' table (pseudo-code, adjust for your schema)
      await db.run('INSERT OR IGNORE INTO doctor_photos (url, public_id) VALUES (?, ?)', [img.secure_url, img.public_id]);
    }
    return result.resources.map(img => img.secure_url);
  }
}

module.exports = Doctor;
