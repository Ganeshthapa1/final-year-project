const { db } = require("../utils/database");
const Pet = require("./Pet");

class Appointment {
  constructor(data) {
    this.id = data.id;
    this.pet_id = data.pet_id;
    this.client_id = data.client_id;
    this.doctor_id = data.doctor_id; // Added doctor_id
    this.appointment_date = data.appointment_date;
    this.appointment_time = data.appointment_time;
    this.reason = data.reason;
    this.status = data.status;
    this.notes = data.notes;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.pet_name = data.pet_name;
    this.client_name = data.client_name;
    this.species_name = data.species_name;
    this.breed_name = data.breed_name;
    this.doctor_name = data.doctor_name; // Added doctor_name for joined queries
  }

  static async findAll() {
    const sql = `
      SELECT 
        a.*,
        p.name AS pet_name,
        c.name AS client_name,
        s.name AS species_name,
        b.name AS breed_name,
        CONCAT(d.first_name, ' ', d.last_name) AS doctor_name
      FROM appointments a
      JOIN pets p ON a.pet_id = p.id
      JOIN clients c ON a.client_id = c.id
      JOIN species s ON p.species_id = s.id
      JOIN breeds b ON p.breed_id = b.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.appointment_date, a.appointment_time
    `;
    const rows = await db.all(sql);
    return rows.map((row) => new Appointment(row));
  }

  static async findById(id) {
    const sql = `
      SELECT 
        a.*,
        p.name AS pet_name,
        c.name AS client_name,
        s.name AS species_name,
        b.name AS breed_name,
        CONCAT(d.first_name, ' ', d.last_name) AS doctor_name
      FROM appointments a
      JOIN pets p ON a.pet_id = p.id
      JOIN clients c ON a.client_id = c.id
      JOIN species s ON p.species_id = s.id
      JOIN breeds b ON p.breed_id = b.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.id = ?
    `;
    const row = await db.get(sql, [id]);
    return row ? new Appointment(row) : null;
  }
  static async count() {
    const row = await db.get("SELECT COUNT(*) as count FROM appointments");
    return row ? row.count : 0;
  }

  static async findByDoctorId(doctorId) {
    const sql = `
      SELECT 
        a.*,
        p.name AS pet_name,
        c.name AS client_name,
        s.name AS species_name,
        b.name AS breed_name,
        CONCAT(d.first_name, ' ', d.last_name) AS doctor_name
      FROM appointments a
      JOIN pets p ON a.pet_id = p.id
      JOIN clients c ON a.client_id = c.id
      JOIN species s ON p.species_id = s.id
      JOIN breeds b ON p.breed_id = b.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.doctor_id = ?
      ORDER BY a.appointment_date, a.appointment_time
    `;
    const rows = await db.all(sql, [doctorId]);
    return rows.map((row) => new Appointment(row));
  }

  static async create(appointmentData) {
    const sql = `
      INSERT INTO appointments (
        pet_id, client_id, doctor_id, appointment_date, appointment_time, reason, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      appointmentData.pet_id,
      appointmentData.client_id,
      appointmentData.doctor_id,
      appointmentData.appointment_date,
      appointmentData.appointment_time,
      appointmentData.reason,
      appointmentData.status || "scheduled",
      appointmentData.notes || null,
    ];
    const result = await db.run(sql, params);
    return this.findById(result.id);
  }

  static async update(id, appointmentData) {
    const sql = `
      UPDATE appointments SET
        pet_id = ?,
        doctor_id = ?,
        appointment_date = ?,
        appointment_time = ?,
        reason = ?,
        status = ?,
        notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const params = [
      appointmentData.pet_id || null,

      appointmentData.doctor_id || null, // Added doctor_id
      appointmentData.appointment_date || null,
      appointmentData.appointment_time || null,
      appointmentData.reason || null,
      appointmentData.status || null,
      appointmentData.notes || null,
      id,
    ];
    await db.run(sql, params);
    return this.findById(id);
  }

  static async delete(id) {
    const sql = "DELETE FROM appointments WHERE id = ?";
    const result = await db.run(sql, [id]);
    return result.changes > 0;
  }

  static async search(query) {
    const sql = `
      SELECT 
        a.*,
        p.name AS pet_name,
        c.name AS client_name,
        s.name AS species_name,
        b.name AS breed_name,
        CONCAT(d.first_name, ' ', d.last_name) AS doctor_name
      FROM appointments a
      JOIN pets p ON a.pet_id = p.id
      JOIN clients c ON a.client_id = c.id
      JOIN species s ON p.species_id = s.id
      JOIN breeds b ON p.breed_id = b.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE p.name LIKE ? OR c.name LIKE ? OR a.reason LIKE ?
    `;
    const searchTerm = `%${query}%`;
    const rows = await db.all(sql, [searchTerm, searchTerm, searchTerm]);
    return rows.map((row) => new Appointment(row));
  }

  static async getTodaysAppointments() {
    const today = new Date().toISOString().split("T")[0];
    const sql = `
      SELECT 
        a.*,
        p.name AS pet_name,
        c.name AS client_name,
        s.name AS species_name,
        b.name AS breed_name,
        CONCAT(d.first_name, ' ', d.last_name) AS doctor_name
      FROM appointments a
      JOIN pets p ON a.pet_id = p.id
      JOIN clients c ON a.client_id = c.id
      JOIN species s ON p.species_id = s.id
      JOIN breeds b ON p.breed_id = b.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.appointment_date = ?
    `;
    const rows = await db.all(sql, [today]);
    return rows.map((row) => new Appointment(row));
  }

  static async getUpcomingAppointments(days) {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + days);
    const sql = `
      SELECT 
        a.*,
        p.name AS pet_name,
        c.name AS client_name,
        s.name AS species_name,
        b.name AS breed_name,
        CONCAT(d.first_name, ' ', d.last_name) AS doctor_name
      FROM appointments a
      JOIN pets p ON a.pet_id = p.id
      JOIN clients c ON a.client_id = c.id
      JOIN species s ON p.species_id = s.id
      JOIN breeds b ON p.breed_id = b.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.appointment_date BETWEEN ? AND ?
      ORDER BY a.appointment_date, a.appointment_time
    `;
    const rows = await db.all(sql, [
      today.toISOString().split("T")[0],
      futureDate.toISOString().split("T")[0],
    ]);
    return rows.map((row) => new Appointment(row));
  }

  static async getByPetId(petId) {
    const sql = `
      SELECT 
        a.*,
        p.name AS pet_name,
        c.name AS client_name,
        s.name AS species_name,
        b.name AS breed_name,
        CONCAT(d.first_name, ' ', d.last_name) AS doctor_name
      FROM appointments a
      JOIN pets p ON a.pet_id = p.id
      JOIN clients c ON a.client_id = c.id
      JOIN species s ON p.species_id = s.id
      JOIN breeds b ON p.breed_id = b.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.pet_id = ?
      ORDER BY a.appointment_date, a.appointment_time
    `;
    const rows = await db.all(sql, [petId]);
    return rows.map((row) => new Appointment(row));
  }

  static async checkAvailability(doctorId, appointmentDate, appointmentTime) {
    const sql = `
      SELECT id 
      FROM appointments 
      WHERE doctor_id = ? 
      AND appointment_date = ? 
      AND appointment_time = ? 
      AND status = 'scheduled'
    `;
    const rows = await db.all(sql, [
      doctorId,
      appointmentDate,
      appointmentTime,
    ]);
    return rows.length === 0; // Return true if no conflicting appointments
  }
}

module.exports = Appointment;
