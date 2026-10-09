const express = require("express");

const {
  getAdminDashboardStats,
} = require("../controllers/dashboardController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorizeRoles,
} = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin Dashboard statistics
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  getAdminDashboardStats,
);

module.exports = router;