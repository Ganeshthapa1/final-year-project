const Appointment = require("../models/Appointment");
const Pet = require("../models/Pet");
const Client = require("../models/Client");
const { Species, Breed } = require("../models/species");
const { asyncHandler } = require("../middleware/errorHandler");
const Joi = require("joi");
const { db } = require("../utils/database"); // Import database for availability check

// Validation schemas
const appointmentSchema = Joi.object({
  pet_id: Joi.number().integer().positive().required(),
  client_id: Joi.number().integer().positive().required(),
  doctor_id: Joi.number().integer().positive().required(), // Added doctor_id
  appointment_date: Joi.date().iso().required(),
  appointment_time: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required(),
  reason: Joi.string().required().trim().min(1).max(500),
  status: Joi.string()
    .valid("scheduled", "completed", "cancelled", "no-show")
    .default("scheduled"),
  notes: Joi.string().allow("").max(1000),
});

const updateAppointmentSchema = Joi.object({
  pet_id: Joi.number().integer().positive(),
  client_id: Joi.number().integer().positive(),
  doctor_id: Joi.number().integer().positive(), // Added doctor_id
  appointment_date: Joi.date().iso(),
  appointment_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  reason: Joi.string().trim().min(1).max(500),
  status: Joi.string().valid("scheduled", "completed", "cancelled", "no-show"),
  notes: Joi.string().allow("").max(1000),
});

const appointmentBookingSchema = Joi.object({
  client_name: Joi.string().required().trim().min(1).max(255),
  client_phone: Joi.string().required().trim().min(10).max(20),
  client_email: Joi.string().email().allow("").max(255),
  pet_name: Joi.string().required().trim().min(1).max(255),
  pet_type: Joi.string()
    .required()
    .valid("dog", "cat", "bird", "rabbit", "hamster", "guinea-pig", "other"),
  doctor_id: Joi.number().integer().positive().required(), // Added doctor_id
  appointment_date: Joi.date().iso().required(),
  appointment_time: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required(),
  service_type: Joi.string()
    .required()
    .valid(
      "checkup",
      "vaccination",
      "surgery",
      "dental",
      "grooming",
      "emergency",
      "consultation"
    ),
  notes: Joi.string().allow("").max(1000),
  status: Joi.string()
    .valid("scheduled", "completed", "cancelled", "no-show")
    .default("scheduled"),
});

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private (Admin)
const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.findAll();

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments,
  });
});

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private (Admin)
const getAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({
      success: false,
      error: "Appointment not found",
    });
  }

  res.status(200).json({
    success: true,
    data: appointment,
  });
});

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private (Admin)

const createAppointment = asyncHandler(async (req, res) => {
  try {
    const { error, value } = appointmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    const appointmentData = value;

    // Check availability for the doctor
    const existingAppointments = await db.all(
      `SELECT id FROM appointments 
      WHERE doctor_id = ? 
      AND appointment_date = ? 
      AND appointment_time = ? 
      AND status = 'scheduled'`,
      [
        appointmentData.doctor_id,
        appointmentData.appointment_date,
        appointmentData.appointment_time,
      ]
    );

    if (existingAppointments.length > 0) {
      return res.status(400).json({
        success: false,
        error: "The selected doctor is not available at this date and time",
      });
    }

    const pet = await Pet.findById(appointmentData.pet_id);
    if (!pet) {
      return res.status(400).json({
        success: false,
        error: "Pet not found",
      });
    }

    const client = await Client.findById(appointmentData.client_id);
    if (!client) {
      return res.status(400).json({
        success: false,
        error: "Client not found",
      });
    }

    const appointment = await Appointment.create(appointmentData);

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (err) {
    console.error("Error in createAppointment:", err);
    res.status(500).json({
      success: false,
      error: err.message,
      stack: err.stack,
    });
  }
});

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private (Admin)
const updateAppointment = asyncHandler(async (req, res) => {
  let appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({
      success: false,
      error: "Appointment not found",
    });
  }

  const { error, value } = updateAppointmentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message,
    });
  }

  const appointmentData = value;

  // Check availability if doctor_id, date, or time is updated
  if (
    appointmentData.doctor_id ||
    appointmentData.appointment_date ||
    appointmentData.appointment_time
  ) {
    const checkDoctorId = appointmentData.doctor_id || appointment.doctor_id;
    const checkDate =
      appointmentData.appointment_date || appointment.appointment_date;
    const checkTime =
      appointmentData.appointment_time || appointment.appointment_time;

    const existingAppointments = await db.all(
      `SELECT id FROM appointments 
      WHERE doctor_id = ? 
      AND appointment_date = ? 
      AND appointment_time = ? 
      AND status = 'scheduled' 
      AND id != ?`,
      [checkDoctorId, checkDate, checkTime, req.params.id]
    );

    if (existingAppointments.length > 0) {
      return res.status(400).json({
        success: false,
        error: "The selected doctor is not available at this date and time",
      });
    }
  }

  if (appointmentData.pet_id) {
    const pet = await Pet.findById(appointmentData.pet_id);
    if (!pet) {
      return res.status(400).json({
        success: false,
        error: "Pet not found",
      });
    }
  }

  if (appointmentData.client_id) {
    const client = await Client.findById(appointmentData.client_id);
    if (!client) {
      return res.status(400).json({
        success: false,
        error: "Client not found",
      });
    }
  }

  const updatedAppointment = await Appointment.update(
    req.params.id,
    appointmentData
  );

  res.status(200).json({
    success: true,
    data: updatedAppointment,
  });
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private (Admin)
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({
      success: false,
      error: "Appointment not found",
    });
  }

  const deleted = await Appointment.delete(req.params.id);

  if (!deleted) {
    return res.status(500).json({
      success: false,
      error: "Failed to delete appointment",
    });
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Search appointments
// @route   GET /api/appointments/search?q=query
// @access  Private (Admin)
const searchAppointments = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      error: "Search query is required",
    });
  }

  const appointments = await Appointment.search(q);

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments,
  });
});

// @desc    Get today's appointments
// @route   GET /api/appointments/today
// @access  Private (Admin)
const getTodaysAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.getTodaysAppointments();

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments,
  });
});

// @desc    Get upcoming appointments
// @route   GET /api/appointments/upcoming
// @access  Private (Admin)
const getUpcomingAppointments = asyncHandler(async (req, res) => {
  const { days = 7 } = req.query;
  const appointments = await Appointment.getUpcomingAppointments(
    parseInt(days)
  );

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments,
  });
});

// @desc    Check doctor availability
// @route   POST /api/appointments/check-availability
// @access  Public
const checkAvailability = asyncHandler(async (req, res) => {
  const { error, value } = Joi.object({
    doctor_id: Joi.number().integer().positive().required(),
    appointment_date: Joi.date().iso().required(),
    appointment_time: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .required(),
  }).validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message,
    });
  }

  const { doctor_id, appointment_date, appointment_time } = value;

  try {
    const isAvailable = await Appointment.checkAvailability(
      doctor_id,
      appointment_date,
      appointment_time
    );

    res.json({
      success: true,
      available: isAvailable,
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({
      success: false,
      error: "Failed to check availability",
    });
  }
});
// @desc    Create new appointment from public form
// @route   POST /api/appointments/public
// @access  Public
const createPublicAppointment = asyncHandler(async (req, res) => {
  try {
    // Validate input
    const { error, value } = appointmentBookingSchema.validate(req.body);
    if (error) {
      console.error("Validation error:", error.details);
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    const {
      client_name,
      client_phone,
      client_email,
      pet_name,
      pet_type,
      doctor_id,
      appointment_date,
      appointment_time,
      service_type,
      notes,
      status,
    } = value;

    // Check doctor availability
    const isAvailable = await Appointment.checkAvailability(
      doctor_id,
      appointment_date,
      appointment_time
    );

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        error: "The selected doctor is not available at this date and time",
      });
    }

    // Check if client exists or create new client
    let client = await Client.findByPhone(client_phone);
    if (!client) {
      client = await Client.create({
        name: client_name,
        phone: client_phone,
        email: client_email || null,
      });
    }

    // Check or create species
    let species = await Species.findOrCreate(pet_type);
    if (!species) {
      console.error("Failed to find or create species:", pet_type);
      return res.status(500).json({
        success: false,
        error: "Failed to process pet species",
      });
    }

    // Check or create breed (use 'Unknown' as default)
    let breed = await Breed.findOrCreate("Unknown", species.id);
    if (!breed) {
      console.error("Failed to find or create breed: Unknown");
      return res.status(500).json({
        success: false,
        error: "Failed to process pet breed",
      });
    }

    // Check if pet exists or create new pet
    let pet = await Pet.findByNameAndClientId(pet_name, client.id);
    if (!pet) {
      pet = await Pet.create({
        name: pet_name,
        species_id: species.id,
        breed_id: breed.id,
        client_id: client.id,
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      pet_id: pet.id,
      client_id: client.id,
      doctor_id,
      appointment_date,
      appointment_time,
      reason: service_type,
      notes,
      status,
    });

    // Update pet's next_appointment
    await Pet.update(pet.id, {
      name: pet.name,
      species_id: pet.species_id,
      breed_id: pet.breed_id,
      client_id: pet.client_id,
      age: pet.age || null,
      weight: pet.weight || null,
      color: pet.color || null,
      gender: pet.gender || null,
      microchip_id: pet.microchip_id || null,
      medical_notes: pet.medical_notes || null,
      last_visit: pet.last_visit || null,
      next_appointment: appointment_date,
    });

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (err) {
    console.error("Error in createPublicAppointment:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to create appointment",
    });
  }
});
module.exports = {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  searchAppointments,
  getTodaysAppointments,
  getUpcomingAppointments,
  checkAvailability,
  createPublicAppointment,
};
