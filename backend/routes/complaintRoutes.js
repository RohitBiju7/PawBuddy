const express = require("express");

const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  deleteOwnComplaint,
  deleteComplaintByAdmin,
} = require("../controllers/complaintController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorizeRoles,
} = require("../middleware/roleMiddleware");

const router = express.Router();

// Adopter submits feedback
router.post(
  "/",
  protect,
  authorizeRoles("adopter"),
  createComplaint,
);

// Adopter views own feedback
router.get(
  "/my",
  protect,
  authorizeRoles("adopter"),
  getMyComplaints,
);

// Admin views all feedback
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllComplaints,
);

// Adopter deletes own feedback
router.delete(
  "/:id",
  protect,
  authorizeRoles("adopter"),
  deleteOwnComplaint,
);

// Admin clears feedback
router.delete(
  "/:id/admin",
  protect,
  authorizeRoles("admin"),
  deleteComplaintByAdmin,
);

module.exports = router;