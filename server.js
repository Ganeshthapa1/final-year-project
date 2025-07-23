const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const petRoutes = require("./src/routes/pets");
const appointmentRoutes = require("./src/routes/appointments");
const appointmentPublicRoutes = require("./src/routes/appointment");
const clientRoutes = require("./src/routes/clients");
const dashboardRoutes = require("./src/routes/dashboard");
const inventoryRoutes = require("./src/routes/inventory");
const doctorRoutes = require("./src/routes/doctors");
const loginRoutes = require("./src/routes/login");
const settingsRouter = require("./src/routes/settings");
const gettingSettingsRoutes = require("./src/routes/gettingSettingsRoutes");
const doctorPublicRoutes = require("./src/routes/doctorPublicRoutes");
const inquiryRoutes = require("./src/routes/inquiries");
const authRoutes = require("./src/routes/auth");
const { initDatabase } = require("./src/utils/database");
const { errorHandler } = require("./src/middleware/errorHandler");
const { authenticateToken } = require("./src/middleware/auth");

const app = express();
const PORT = process.env.PORT || 8000;

// Initialize database
initDatabase();

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
});
app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Create a protected router for admin routes
const adminRouter = express.Router();
adminRouter.use(authenticateToken); // Apply authentication middleware to admin routes

// Health check endpoint (public)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "VetPro Backend API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API routes
const apiPrefix = process.env.API_PREFIX || "/api";
// Public routes
app.use(`${apiPrefix}/login`, loginRoutes);
app.use(`${apiPrefix}/appointment`, appointmentPublicRoutes);
app.use(`${apiPrefix}/setting`, gettingSettingsRoutes);
app.use(`${apiPrefix}/doctor`, doctorPublicRoutes);
// Protected admin routes
app.use(`${apiPrefix}/pets`, adminRouter, petRoutes);
app.use(`${apiPrefix}/appointments`, adminRouter, appointmentRoutes);
app.use(`${apiPrefix}/clients`, adminRouter, clientRoutes);
app.use(`${apiPrefix}/dashboard`, adminRouter, dashboardRoutes);
app.use(`${apiPrefix}/inventory`, adminRouter, inventoryRoutes);
app.use(`${apiPrefix}/doctors`, adminRouter, doctorRoutes);
app.use(`${apiPrefix}/settings`, adminRouter, settingsRouter);
app.use(`${apiPrefix}/inquiries`, adminRouter, inquiryRoutes.router);
app.use(`${apiPrefix}/auth`, authRoutes);

app.post(`${apiPrefix}/frontend/inquiries`, inquiryRoutes.createInquiry);
// Welcome endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to VetPro Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      pets: `${apiPrefix}/pets`,
      appointments: `${apiPrefix}/appointments`,
      appointment: `${apiPrefix}/appointment`,
      clients: `${apiPrefix}/clients`,
      dashboard: `${apiPrefix}/dashboard`,
      inventory: `${apiPrefix}/inventory`,
      doctors: `${apiPrefix}/doctors`,
      login: `${apiPrefix}/login`,
      settings: `${apiPrefix}/settings`,
      inquiries: `${apiPrefix}/inquiries`,
      auth: `${apiPrefix}/auth`,
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    message: `The requested endpoint ${req.method} ${req.path} does not exist.`,
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 VetPro Backend API Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🐾 API Base URL: http://localhost:${PORT}${apiPrefix}`);
  console.log(
    `📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3001"}`
  );
});

module.exports = app;
