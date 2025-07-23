// src/models/species.js
const { db } = require("../utils/database");

class Species {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll() {
    const sql = "SELECT * FROM species ORDER BY name";
    const rows = await db.all(sql);
    return rows.map((row) => new Species(row));
  }

  static async findById(id) {
    const sql = "SELECT * FROM species WHERE id = ?";
    const row = await db.get(sql, [id]);
    return row ? new Species(row) : null;
  }

  static async findByName(name) {
    const sql = "SELECT * FROM species WHERE name = ?";
    const row = await db.get(sql, [name]);
    return row ? new Species(row) : null;
  }

  static async create(speciesData) {
    const sql = "INSERT INTO species (name) VALUES (?)";
    const result = await db.run(sql, [speciesData.name]);
    return this.findById(result.id);
  }

  static async findOrCreate(name) {
    let species = await this.findByName(name);

    if (!species) {
      species = await this.create({ name });
    }

    return species;
  }

  async getBreeds() {
    const Breed = require("./Breed");
    return Breed.getBySpeciesId(this.id);
  }
}

class Breed {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.species_id = data.species_id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll() {
    const sql = `
      SELECT 
        b.*,
        s.name as species_name
      FROM breeds b
      JOIN species s ON b.species_id = s.id
      ORDER BY s.name, b.name
    `;
    const rows = await db.all(sql);
    return rows.map((row) => ({
      ...new Breed(row),
      species_name: row.species_name,
    }));
  }

  static async findById(id) {
    const sql = "SELECT * FROM breeds WHERE id = ?";
    const row = await db.get(sql, [id]);
    return row ? new Breed(row) : null;
  }

  static async findByNameAndSpecies(name, speciesId) {
    const sql = "SELECT * FROM breeds WHERE name = ? AND species_id = ?";
    const row = await db.get(sql, [name, speciesId]);
    return row ? new Breed(row) : null;
  }

  static async create(breedData) {
    const sql = "INSERT INTO breeds (name, species_id) VALUES (?, ?)";
    const result = await db.run(sql, [breedData.name, breedData.species_id]);
    return this.findById(result.id);
  }

  static async findOrCreate(name, speciesId) {
    let breed = await this.findByNameAndSpecies(name, speciesId);

    if (!breed) {
      breed = await this.create({ name, species_id: speciesId });
    }

    return breed;
  }

  static async getBySpeciesId(speciesId) {
    const sql = "SELECT * FROM breeds WHERE species_id = ? ORDER BY name";
    const rows = await db.all(sql, [speciesId]);
    return rows.map((row) => new Breed(row));
  }
}

module.exports = { Species, Breed };
