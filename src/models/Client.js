// src/models/Client.js
const { db } = require("../utils/database");

class Client {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.phone = data.phone;
    this.email = data.email;
    this.address = data.address;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll() {
    const sql = "SELECT * FROM clients ORDER BY name";
    const rows = await db.all(sql);
    return rows.map((row) => new Client(row));
  }

  static async findById(id) {
    const sql = "SELECT * FROM clients WHERE id = ?";
    const row = await db.get(sql, [id]);
    return row ? new Client(row) : null;
  }

  static async findByPhone(phone) {
    const sql = "SELECT * FROM clients WHERE phone = ?";
    const row = await db.get(sql, [phone]);
    return row ? new Client(row) : null;
  }
  static async count() {
    const row = await db.get("SELECT COUNT(*) as count FROM clients");
    return row ? row.count : 0;
  }
  static async create(clientData) {
    const sql =
      "INSERT INTO clients (name, phone, email, address) VALUES (?, ?, ?, ?)";
    const params = [
      clientData.name,
      clientData.phone,
      clientData.email || null,
      clientData.address || null,
    ];
    const result = await db.run(sql, params);
    return this.findById(result.id);
  }

  static async update(id, clientData) {
    const sql = `
      UPDATE clients SET 
        name = ?, 
        phone = ?, 
        email = ?, 
        address = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const params = [
      clientData.name,
      clientData.phone,
      clientData.email || null,
      clientData.address || null,
      id,
    ];
    await db.run(sql, params);
    return this.findById(id);
  }

  static async delete(id) {
    const sql = "DELETE FROM clients WHERE id = ?";
    const result = await db.run(sql, [id]);
    return result.changes > 0;
  }
  static async findByEmail(email) {
    const sql = "SELECT * FROM clients WHERE email = ?";
    const row = await db.get(sql, [email]);
    return row ? new Client(row) : null;
  }

  async getPets() {
    return Pet.getByClientId(this.id);
  }
}

module.exports = Client;
