// src/controllers/clientController.js
const { asyncHandler } = require("../middleware/errorHandler");
const Joi = require("joi");
const Client = require("../models/Client");
const { db } = require("../utils/database");

// Validation schemas
const clientSchema = Joi.object({
  name: Joi.string().required().trim().min(1).max(100),
  email: Joi.string().email().required(),
  phone: Joi.string().allow("").max(20),
  address: Joi.string().allow("").max(500),
});

const updateClientSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100),
  email: Joi.string().email(),
  phone: Joi.string().allow("").max(20),
  address: Joi.string().allow("").max(500),
});

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private (Admin)
const getClients = asyncHandler(async (req, res) => {
  // Fetch clients with pet names, last visit, total visits, and next appointment
  const sql = `
    SELECT 
      c.id,
      c.name,
      c.email,
      c.phone,
      c.address,
      c.created_at,
      c.updated_at,
      GROUP_CONCAT(p.name) as pet_names,
      MAX(a.appointment_date) as last_visit,
      COUNT(a.id) as total_visits,
      MAX(p.next_appointment) as next_appointment
    FROM clients c
    LEFT JOIN pets p ON c.id = p.client_id
    LEFT JOIN appointments a ON c.id = a.client_id
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `;

  const rows = await db.all(sql);

  // Map rows to include pets array
  const clients = rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    pets: row.pet_names ? row.pet_names.split(",") : [],
    last_visit: row.last_visit || "N/A",
    total_visits: row.total_visits || 0,
    next_appointment: row.next_appointment || "N/A",
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));

  res.status(200).json({
    success: true,
    count: clients.length,
    data: clients,
  });
});

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private (Admin)
const getClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return res.status(404).json({
      success: false,
      error: "Client not found",
    });
  }

  // Fetch pets and appointments
  const pets = await client.getPets();
  const appointments = await client.getAppointments();

  const clientData = {
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    address: client.address,
    created_at: client.created_at,
    updated_at: client.updated_at,
    pets: pets.map((pet) => pet.name),
    last_visit: appointments.length ? appointments[0].appointment_date : "N/A",
    total_visits: appointments.length,
    next_appointment: pets.length ? pets[0].next_appointment : "N/A",
  };

  res.status(200).json({
    success: true,
    data: clientData,
  });
});

// @desc    Create new client
// @route   POST /api/clients
// @access  Private (Admin)
const createClient = asyncHandler(async (req, res) => {
  const { error, value } = clientSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message,
    });
  }

  const clientData = value;
  const existingClient = await Client.findByEmail(clientData.email);
  if (existingClient) {
    return res.status(400).json({
      success: false,
      error: "Client with this email already exists",
    });
  }

  const client = await Client.create(clientData);

  res.status(201).json({
    success: true,
    data: client,
  });
});

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private (Admin)
const updateClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return res.status(404).json({
      success: false,
      error: "Client not found",
    });
  }

  const { error, value } = updateClientSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message,
    });
  }

  const clientData = value;
  if (clientData.email && clientData.email !== client.email) {
    const existingClient = await Client.findByEmail(clientData.email);
    if (existingClient) {
      return res.status(400).json({
        success: false,
        error: "Client with this email already exists",
      });
    }
  }

  const updatedClient = await Client.update(req.params.id, clientData);

  res.status(200).json({
    success: true,
    data: updatedClient,
  });
});

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private (Admin)
const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return res.status(404).json({
      success: false,
      error: "Client not found",
    });
  }

  const deleted = await Client.delete(req.params.id);

  if (!deleted) {
    return res.status(500).json({
      success: false,
      error: "Failed to delete client",
    });
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Search clients
// @route   GET /api/clients/search?q=query
// @access  Private (Admin)
const searchClients = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      error: "Search query is required",
    });
  }

  const clients = await Client.search(q);

  // Fetch pets and appointments for each client
  const formattedClients = await Promise.all(
    clients.map(async (client) => {
      const pets = await client.getPets();
      const appointments = await client.getAppointments();
      return {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        pets: pets.map((pet) => pet.name),
        last_visit: appointments.length
          ? appointments[0].appointment_date
          : "N/A",
        total_visits: appointments.length,
        next_appointment: pets.length ? pets[0].next_appointment : "N/A",
        pet_count: client.pet_count,
        created_at: client.created_at,
        updated_at: client.updated_at,
      };
    })
  );

  res.status(200).json({
    success: true,
    count: formattedClients.length,
    data: formattedClients,
  });
});

// @desc    Get client's pets
// @route   GET /api/clients/:id/pets
// @access  Private (Admin)
const getClientPets = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return res.status(404).json({
      success: false,
      error: "Client not found",
    });
  }

  const pets = await client.getPets();

  res.status(200).json({
    success: true,
    count: pets.length,
    data: pets,
  });
});

// @desc    Get client's appointments
// @route   GET /api/clients/:id/appointments
// @access  Private (Admin)
const getClientAppointments = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return res.status(404).json({
      success: false,
      error: "Client not found",
    });
  }

  const appointments = await client.getAppointments();

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments,
  });
});

module.exports = {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  searchClients,
  getClientPets,
  getClientAppointments,
};
