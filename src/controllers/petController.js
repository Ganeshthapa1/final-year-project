const Pet = require('../models/Pet');
const Client = require('../models/Client');
const { Species, Breed } = require('../models/Species');
const { asyncHandler } = require('../middleware/errorHandler');
const Joi = require('joi');

// Validation schemas
const petSchema = Joi.object({
  name: Joi.string().required().trim().min(1).max(100),
  species: Joi.string().required().trim().min(1).max(50),
  breed: Joi.string().required().trim().min(1).max(100),
  age: Joi.number().integer().min(0).max(50),
  weight: Joi.number().positive().max(1000),
  color: Joi.string().allow('').max(50),
  gender: Joi.string().valid('Male', 'Female').allow(''),
  microchip_id: Joi.string().allow('').max(50),
  medical_notes: Joi.string().allow('').max(1000),
  last_visit: Joi.date().iso().allow(''),
  next_appointment: Joi.date().iso().allow(''),
  owner_name: Joi.string().required().trim().min(1).max(100),
  owner_email: Joi.string().email().required(),
  owner_phone: Joi.string().allow('').max(20),
  owner_address: Joi.string().allow('').max(500)
});

const updatePetSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100),
  species: Joi.string().trim().min(1).max(50),
  breed: Joi.string().trim().min(1).max(100),
  age: Joi.number().integer().min(0).max(50),
  weight: Joi.number().positive().max(1000),
  color: Joi.string().allow('').max(50),
  gender: Joi.string().valid('Male', 'Female').allow(''),
  microchip_id: Joi.string().allow('').max(50),
  medical_notes: Joi.string().allow('').max(1000),
  last_visit: Joi.date().iso().allow(''),
  next_appointment: Joi.date().iso().allow(''),
  owner_name: Joi.string().trim().min(1).max(100),
  owner_email: Joi.string().email(),
  owner_phone: Joi.string().allow('').max(20),
  owner_address: Joi.string().allow('').max(500)
});

// @desc    Get all pets
// @route   GET /api/pets
// @access  Public
const getPets = asyncHandler(async (req, res) => {
  const pets = await Pet.findAll();
  
  res.status(200).json({
    success: true,
    count: pets.length,
    data: pets
  });
});

// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Public
const getPet = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  
  if (!pet) {
    return res.status(404).json({
      success: false,
      error: 'Pet not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: pet
  });
});

// @desc    Create new pet
// @route   POST /api/pets
// @access  Public
const createPet = asyncHandler(async (req, res) => {
  // Validate input
  const { error, value } = petSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  const petData = value;

  // Create or find client
  const client = await Client.findOrCreate({
    name: petData.owner_name,
    email: petData.owner_email,
    phone: petData.owner_phone,
    address: petData.owner_address
  });

  // Create or find species
  const species = await Species.findOrCreate(petData.species);

  // Create or find breed
  const breed = await Breed.findOrCreate(petData.breed, species.id);

  // Create pet
  const pet = await Pet.create({
    name: petData.name,
    species_id: species.id,
    breed_id: breed.id,
    client_id: client.id,
    age: petData.age,
    weight: petData.weight,
    color: petData.color,
    gender: petData.gender,
    microchip_id: petData.microchip_id,
    medical_notes: petData.medical_notes,
    last_visit: petData.last_visit,
    next_appointment: petData.next_appointment
  });

  res.status(201).json({
    success: true,
    data: pet
  });
});

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Public
const updatePet = asyncHandler(async (req, res) => {
  let pet = await Pet.findById(req.params.id);
  
  if (!pet) {
    return res.status(404).json({
      success: false,
      error: 'Pet not found'
    });
  }

  // Validate input
  const { error, value } = updatePetSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  const petData = value;
  let speciesId = null;
  let breedId = null;
  let clientId = null;

  // Handle species update
  if (petData.species) {
    const species = await Species.findOrCreate(petData.species);
    speciesId = species.id;
  }

  // Handle breed update
  if (petData.breed && speciesId) {
    const breed = await Breed.findOrCreate(petData.breed, speciesId);
    breedId = breed.id;
  }

  // Handle client update
  if (petData.owner_email) {
    const client = await Client.findOrCreate({
      name: petData.owner_name,
      email: petData.owner_email,
      phone: petData.owner_phone,
      address: petData.owner_address
    });
    clientId = client.id;
  }

  // Update pet
  const updatedPet = await Pet.update(req.params.id, {
    name: petData.name,
    species_id: speciesId,
    breed_id: breedId,
    client_id: clientId,
    age: petData.age,
    weight: petData.weight,
    color: petData.color,
    gender: petData.gender,
    microchip_id: petData.microchip_id,
    medical_notes: petData.medical_notes,
    last_visit: petData.last_visit,
    next_appointment: petData.next_appointment
  });

  res.status(200).json({
    success: true,
    data: updatedPet
  });
});

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Public
const deletePet = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  
  if (!pet) {
    return res.status(404).json({
      success: false,
      error: 'Pet not found'
    });
  }

  const deleted = await Pet.delete(req.params.id);
  
  if (!deleted) {
    return res.status(500).json({
      success: false,
      error: 'Failed to delete pet'
    });
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Search pets
// @route   GET /api/pets/search?q=query
// @access  Public
const searchPets = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      error: 'Search query is required'
    });
  }

  const pets = await Pet.search(q);
  
  res.status(200).json({
    success: true,
    count: pets.length,
    data: pets
  });
});

module.exports = {
  getPets,
  getPet,
  createPet,
  updatePet,
  deletePet,
  searchPets
};
