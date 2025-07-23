const Doctor = require('../models/Doctor');
const { asyncHandler } = require('../middleware/errorHandler');
const { uploadDoctorPhoto } = require('../middleware/cloudinary');

// Get all doctors
const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.findAll();
  res.json({ success: true, data: doctors });
});

// Get single doctor
const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
  res.json({ success: true, data: doctor });
});

// Create new doctor
const createDoctor = asyncHandler(async (req, res) => {
  // Sanitize input to avoid undefined values
  const safeValue = v => v === undefined ? null : v;
  const body = {
    first_name: safeValue(req.body.first_name),
    last_name: safeValue(req.body.last_name),
    email: safeValue(req.body.email),
    phone: safeValue(req.body.phone),
    specialization: safeValue(req.body.specialization),
    experience_years: safeValue(req.body.experience_years),
    status: safeValue(req.body.status),
    profile_image: req.body.profile_image // will be set below if needed
  };

  // Validate required fields
  if (!body.first_name || !body.last_name || !body.email) {
    return res.status(400).json({ success: false, message: 'First name, last name, and email are required.' });
  }

  // Check if email already exists
  const existingEmail = await Doctor.findByEmail(body.email);
  if (existingEmail) {
    return res.status(400).json({ success: false, message: 'Email already exists' });
  }

  let profile_image_url = '';
  if (body.profile_image && body.profile_image.startsWith('data:image')) {
    // Upload to Cloudinary
    const uploadResult = await uploadDoctorPhoto(body.profile_image);
    profile_image_url = uploadResult.secure_url;
  }

  const result = await Doctor.create({ ...body, profile_image: profile_image_url });
  res.status(201).json({ success: true, id: result.id });
});

// Update doctor
const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

  // Check if email already exists (exclude current doctor)
  if (req.body.email && req.body.email !== doctor.email) {
    const existingEmail = await Doctor.findByEmail(req.body.email);
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
  }

  let profile_image_url = doctor.profile_image;
  if (req.body.profile_image && req.body.profile_image.startsWith('data:image')) {
    // Upload to Cloudinary
    const uploadResult = await uploadDoctorPhoto(req.body.profile_image);
    profile_image_url = uploadResult.secure_url;
  }

  await Doctor.update(req.params.id, { ...req.body, profile_image: profile_image_url });
  res.json({ success: true });
});

// Delete doctor
const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

  await Doctor.delete(req.params.id);
  res.json({ success: true });
});

// Get doctor stats
const getDoctorStats = asyncHandler(async (req, res) => {
  const stats = await Doctor.getStats();
  res.json({ success: true, data: stats });
});

// Search doctors
const searchDoctors = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ success: false, message: 'Search query is required' });
  }
  
  const doctors = await Doctor.searchDoctors(q);
  res.json({ success: true, data: doctors });
});

// Get doctors by specialization
const getDoctorsBySpecialization = asyncHandler(async (req, res) => {
  const { specialization } = req.params;
  const doctors = await Doctor.getBySpecialization(specialization);
  res.json({ success: true, data: doctors });
});

// Get all doctor statuses
const getDoctorStatuses = asyncHandler(async (req, res) => {
  const statuses = await Doctor.getAllStatuses();
  res.json({ success: true, data: statuses });
});

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorStats,
  searchDoctors,
  getDoctorsBySpecialization,
  getDoctorStatuses
};
