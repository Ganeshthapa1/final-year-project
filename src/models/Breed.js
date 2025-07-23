const { db } = require('../utils/database');

class Breed {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.species_id = data.species_id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findByNameAndSpecies(name, species_id) {
    const sql = 'SELECT * FROM breeds WHERE name = ? AND species_id = ?';
    const row = await db.get(sql, [name, species_id]);
    return row ? new Breed(row) : null;
  }

  static async create(breedData) {
    const sql = 'INSERT INTO breeds (name, species_id) VALUES (?, ?)';
    const result = await db.run(sql, [breedData.name, breedData.species_id]);
    return this.findById(result.id);
  }

  static async findOrCreate(name, species_id) {
    let breed = await this.findByNameAndSpecies(name, species_id);
    if (!breed) {
      breed = await this.create({ name, species_id });
    }
    return breed;
  }

  static async findById(id) {
    const sql = 'SELECT * FROM breeds WHERE id = ?';
    const row = await db.get(sql, [id]);
    return row ? new Breed(row) : null;
  }

  static async getBySpeciesId(species_id) {
    const sql = 'SELECT * FROM breeds WHERE species_id = ?';
    const rows = await db.all(sql, [species_id]);
    return rows.map(row => new Breed(row));
  }
}

module.exports = Breed;
