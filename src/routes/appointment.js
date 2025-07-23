const express = require("express");
const {
  createPublicAppointment,
} = require("../controllers/appointmentController");
const { db } = require("../utils/database");

const router = express.Router();

// Public route for booking an appointment
router.route("/").post(createPublicAppointment);
router.post("/check-availability", async (req, res) => {
  const { doctor_id, appointment_date, appointment_time } = req.body;

  // Validate input
  if (!doctor_id || !appointment_date || !appointment_time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check for existing appointments for the doctor at the specified date and time
    const existingAppointments = await db.all(
      `SELECT id FROM appointments 
       WHERE doctor_id = ? 
       AND appointment_date = ? 
       AND appointment_time = ? 
       AND status = 'scheduled'`,
      [doctor_id, appointment_date, appointment_time]
    );

    // If no appointments exist, the slot is available
    const available = existingAppointments.length === 0;

    res.json({ available });
  } catch (error) {
    console.error("Error checking availability:", error.message);
    res.status(500).json({ error: "Failed to check availability" });
  }
});
module.exports = router;
