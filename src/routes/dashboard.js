const express = require("express");
const {
  getDashboardStats,
  getRecentActivities,
  getTodaysSchedule,
  getDashboardOverview,
} = require("../controllers/dashboardController");

const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Dashboard routes (protected)
router.route("/stats").get(authenticateToken, getDashboardStats);

router.route("/recent").get(authenticateToken, getRecentActivities);

router.route("/schedule").get(authenticateToken, getTodaysSchedule);

router.route("/overview").get(authenticateToken, getDashboardOverview);

module.exports = router;
