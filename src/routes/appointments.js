const express = require("express");
const {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  searchAppointments,
  getTodaysAppointments,
  getUpcomingAppointments,
  createPublicAppointment,
} = require("../controllers/appointmentController");

const router = express.Router();

// Appointment routes
router.route("/").get(getAppointments).post(createAppointment);

router.route("/search").get(searchAppointments);

router.route("/today").get(getTodaysAppointments);

router.route("/upcoming").get(getUpcomingAppointments);

router
  .route("/:id")
  .get(getAppointment)
  .put(updateAppointment)
  .delete(deleteAppointment);

// Public appointment booking route
router.route("/public").post(createPublicAppointment);

module.exports = router;
