const { asyncHandler } = require("../middleware/errorHandler");
const Pet = require("../models/Pet");
const Client = require("../models/Client");
const Appointment = require("../models/Appointment");
const Inventory = require("../models/Inventory");
const { db } = require("../utils/database");

// Helper function to get dashboard stats data
async function getDashboardStatsData() {
  const [
    totalPets,
    totalClients,
    totalAppointments,
    todaysAppointments,
    totalInventory,
    lowStockInventory,
    totalDoctors,
    appointmentsByDoctor,
  ] = await Promise.all([
    Pet.count(),
    Client.count(),
    Appointment.count(),
    Appointment.getTodaysAppointments(),
    Inventory.count(),
    Inventory.countLowStock(10),
    db.get(`SELECT COUNT(*) as total_doctors FROM doctors`),
    db.all(
      `SELECT 
         CONCAT(d.first_name, ' ', d.last_name) AS doctor_name,
         COUNT(a.id) AS appointment_count
       FROM doctors d
       LEFT JOIN appointments a ON d.id = a.doctor_id
       GROUP BY d.id, d.first_name, d.last_name
       ORDER BY doctor_name`
    ),
  ]);

  return {
    stats: {
      total_pets: totalPets,
      total_clients: totalClients,
      total_appointments: totalAppointments,
      todays_appointments: todaysAppointments.length,
      appointments_today: todaysAppointments, // For backward compatibility
      total_inventory: totalInventory,
      low_stock_inventory: lowStockInventory,
      total_doctors: totalDoctors ? totalDoctors.total_doctors : 0,
    },
    appointments_by_doctor: appointmentsByDoctor,
  };
}

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private (Admin)
const getDashboardStats = asyncHandler(async (req, res) => {
  const data = await getDashboardStatsData();

  res.status(200).json({
    success: true,
    data,
  });
});

// @desc    Get recent activities
// @route   GET /api/dashboard/recent
// @access  Private (Admin)
const getRecentActivities = asyncHandler(async (req, res) => {
  const [recentPets, recentAppointments, upcomingAppointments] =
    await Promise.all([
      Pet.findAll().then((pets) => pets.slice(0, 5)),
      Appointment.findAll().then((appointments) => appointments.slice(0, 5)),
      Appointment.getUpcomingAppointments(7),
    ]);

  const activities = {
    recent_pets: recentPets,
    recent_appointments: recentAppointments,
    upcoming_appointments: upcomingAppointments,
  };

  res.status(200).json({
    success: true,
    data: activities,
  });
});

// @desc    Get today's schedule
// @route   GET /api/dashboard/schedule
// @access  Private (Admin)
const getTodaysSchedule = asyncHandler(async (req, res) => {
  const todaysAppointments = await Appointment.getTodaysAppointments();

  res.status(200).json({
    success: true,
    count: todaysAppointments.length,
    data: todaysAppointments,
  });
});

// @desc    Get dashboard overview
// @route   GET /api/dashboard/overview
// @access  Private (Admin)
const getDashboardOverview = asyncHandler(async (req, res) => {
  const filter = req.query.filter || "status"; // Default to status
  const [
    statsData,
    recentPets,
    todaysAppointments,
    upcomingAppointments,
    appointmentsByStatus,
    pendingAppointments,
  ] = await Promise.all([
    getDashboardStatsData(),
    Pet.findAll().then((pets) => pets.slice(0, 5)),
    Appointment.getTodaysAppointments(),
    Appointment.getUpcomingAppointments(7),
    filter === "status"
      ? db.all(
          `SELECT 
             status AS label,
             COUNT(*) AS count
           FROM appointments
           GROUP BY status
           ORDER BY status`
        )
      : db.all(
          `SELECT 
             appointment_date AS label,
             COUNT(*) AS count
           FROM appointments
           WHERE appointment_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
           GROUP BY appointment_date
           ORDER BY appointment_date`
        ),
    db.all(
      `SELECT 
         a.id,
         a.pet_id,
         a.appointment_time,
         p.name AS pet_name
       FROM appointments a
       JOIN pets p ON a.pet_id = p.id
       WHERE a.status = 'scheduled'
       ORDER BY a.appointment_date, a.appointment_time
       LIMIT 5`
    ),
  ]);

  const overview = {
    statistics: statsData.stats,
    appointments_by_doctor: statsData.appointments_by_doctor,
    recent_pets: recentPets,
    todays_appointments: todaysAppointments,
    upcoming_appointments: upcomingAppointments.slice(0, 10),
    appointments_by_status: appointmentsByStatus,
    pending_appointments: pendingAppointments,
  };

  res.status(200).json({
    success: true,
    data: overview,
  });
});

module.exports = {
  getDashboardStats,
  getRecentActivities,
  getTodaysSchedule,
  getDashboardOverview,
};
