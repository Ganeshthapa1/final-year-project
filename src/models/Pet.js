// src/models/Pet.js
const { db } = require("../utils/database");

class Pet {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.species_id = data.species_id;
    this.breed_id = data.breed_id;
    this.client_id = data.client_id;
    this.age = data.age;
    
    this.weight = data.weight;
    this.color = data.color;
    this.gender = data.gender;
    this.microchip_id = data.microchip_id;
    this.medical_notes = data.medical_notes;
    this.last_visit = data.last_visit;
    this.next_appointment = data.next_appointment;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll() {
    const sql = `
      SELECT 
        p.*,
        s.name as species_name,
        b.name as breed_name,
        c.name as client_name
      FROM pets p
      JOIN species s ON p.species_id = s.id
      JOIN breeds b ON p.breed_id = b.id
      JOIN clients c ON p.client_id = c.id
    `;
    const rows = await db.all(sql);
    return rows.map((row) => new Pet(row));
  }

  static async findById(id) {
    const sql = `
      SELECT 
        p.*,
        s.name as species_name,
        b.name as breed_name,
        c.name as client_name
      FROM pets p
      JOIN species s ON p.species_id = s.id
      JOIN breeds b ON p.breed_id = b.id
      JOIN clients c ON p.client_id = c.id
      WHERE p.id = ?
    `;
    const row = await db.get(sql, [id]);
    return row ? new Pet(row) : null;
  }

  static async findByNameAndClientId(name, clientId) {
    const sql = `
      SELECT 
        p.*,
        s.name as species_name,
        b.name as breed_name,
        c.name as client_name
      FROM pets p
      JOIN species s ON p.species_id = s.id
      JOIN breeds b ON p.breed_id = b.id
      JOIN clients c ON p.client_id = c.id
      WHERE p.name = ? AND p.client_id = ?
    `;
    const row = await db.get(sql, [name, clientId]);
    return row ? new Pet(row) : null;
  }

  static async getByClientId(clientId) {
    const sql = `
      SELECT 
        p.*,
        s.name as species_name,
        b.name as breed_name
      FROM pets p
      JOIN species s ON p.species_id = s.id
      JOIN breeds b ON p.breed_id = b.id
      WHERE p.client_id = ?
    `;
    const rows = await db.all(sql, [clientId]);
    return rows.map((row) => new Pet(row));
  }

  static async create(petData) {
    const sql = `
      INSERT INTO pets (
        name, species_id, breed_id, client_id, age, weight, color, 
        gender, microchip_id, medical_notes, last_visit, next_appointment
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      petData.name,
      petData.species_id,
      petData.breed_id,
      petData.client_id,
      petData.age || null,
      petData.weight || null,
      petData.color || null,
      petData.gender || null,
      petData.microchip_id || null,
      petData.medical_notes || null,
      petData.last_visit || null,
      petData.next_appointment || null,
    ];
    const result = await db.run(sql, params);
    return this.findById(result.id);
  }

  static async update(id, petData) {
    const sql = `
      UPDATE pets SET 
        name = ?, species_id = ?, breed_id = ?, client_id = ?, 
        age = ?, weight = ?, color = ?, gender = ?, 
        microchip_id = ?, medical_notes = ?, last_visit = ?, 
        next_appointment = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const params = [
      petData.name,
      petData.species_id,
      petData.breed_id,
      petData.client_id,
      petData.age || null,
      petData.weight || null,
      petData.color || null,
      petData.gender || null,
      petData.microchip_id || null,
      petData.medical_notes || null,
      petData.last_visit || null,
      petData.next_appointment || null,
      id,
    ];
    await db.run(sql, params);
    return this.findById(id);
  }

  static async delete(id) {
    const sql = "DELETE FROM pets WHERE id = ?";
    const result = await db.run(sql, [id]);
    return result.changes > 0;
  }

  static async count() {
    const row = await db.get("SELECT COUNT(*) as count FROM pets");
    return row ? row.count : 0;
  }

  static async search(query) {
    const sql = `
      SELECT 
        p.*,
        s.name as species_name,
        b.name as breed_name,
        c.name as client_name
      FROM pets p
      JOIN species s ON p.species_id = s.id
      JOIN breeds b ON p.breed_id = b.id
      JOIN clients c ON p.client_id = c.id
      WHERE p.name LIKE ? OR s.name LIKE ? OR b.name LIKE ?
    `;
    const searchTerm = `%${query}%`;
    const rows = await db.all(sql, [searchTerm, searchTerm, searchTerm]);
    return rows.map((row) => new Pet(row));
  }

  async getAppointments() {
    const Appointment = require("./Appointment");
    return Appointment.getByPetId(this.id);
  }
}

module.exports = Pet;
