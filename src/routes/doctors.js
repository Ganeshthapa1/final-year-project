const express = require('express');
const {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorStats,
  searchDoctors,
  getDoctorsBySpecialization,
  getDoctorStatuses
} = require('../controllers/doctorController');

const router = express.Router();

router.route('/')
  .get(getAllDoctors)
  .post(createDoctor);

router.route('/stats')
  .get(getDoctorStats);

router.route('/search')
  .get(searchDoctors);

router.route('/specialization/:specialization')
  .get(getDoctorsBySpecialization);

router.route('/statuses')
  .get(getDoctorStatuses);

router.route('/:id')
  .get(getDoctorById)
  .put(updateDoctor)
  .delete(deleteDoctor);

module.exports = router;
