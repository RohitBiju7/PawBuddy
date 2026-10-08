const express = require("express");

const {
  requestAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  completeAppointment,
  deleteCompletedAppointment,
  cancelAppointment,
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// Adopter requests an appointment
router.post(
  "/",
  protect,
  authorizeRoles("adopter"),
  requestAppointment,
);

// Adopter views own appointments
router.get(
  "/my",
  protect,
  authorizeRoles("adopter"),
  getMyAppointments,
);

// Admin/Staff views all appointments
router.get(
  "/",
  protect,
  authorizeRoles("admin", "staff"),
  getAllAppointments,
);

// Admin/Staff approves or rejects appointment
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin", "staff"),
  updateAppointmentStatus,
);

// Admin/Staff marks appointment as completed
router.patch(
  "/:id/complete",
  protect,
  authorizeRoles("admin", "staff"),
  completeAppointment,
);

// Admin/Staff deletes a completed appointment
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "staff"),
  deleteCompletedAppointment,
);

// Adopter cancels own pending appointment
router.patch(
  "/:id/cancel",
  protect,
  authorizeRoles("adopter"),
  cancelAppointment,
);

module.exports = router;