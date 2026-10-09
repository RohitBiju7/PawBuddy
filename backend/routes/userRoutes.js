const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  createStaff,
  getAllUsers,
  updateUserStatus,
} = require("../controllers/userController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorizeRoles,
} = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Get logged-in user's profile
router.get(
  "/profile",
  protect,
  getProfile,
);

// Update own profile - Adopter and Staff only
router.patch(
  "/profile",
  protect,
  authorizeRoles("adopter", "staff"),
  updateProfile,
);

// Create Staff - Admin only
router.post(
  "/staff",
  protect,
  authorizeRoles("admin"),
  createStaff,
);

// Get All Users - Admin only
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllUsers,
);

// Update User Status - Admin only
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  updateUserStatus,
);

module.exports = router;