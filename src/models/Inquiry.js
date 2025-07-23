const { getDb } = require('../utils/database');

class Inquiry {
  static async create({ name, email, subject, message }) {
    const db = await getDb();
    const [result] = await db.execute(
      'INSERT INTO inquiries (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    );
    const id = result.insertId;
    return { id, name, email, subject, message };
  }

  static async findAll() {
    const db = await getDb();
    const [rows] = await db.execute(
      'SELECT * FROM inquiries ORDER BY created_at DESC'
    );
    return rows;
  }

  static async delete(id) {
    const db = await getDb();
    const [result] = await db.execute(
      'DELETE FROM inquiries WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Inquiry;
