const express = require("express");

const {
  applyForAdoption,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  cancelApplication,
} = require("../controllers/adoptionController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("adopter"),
  applyForAdoption,
);

router.get(
  "/my",
  protect,
  authorizeRoles("adopter"),
  getMyApplications,
);

router.get(
  "/",
  protect,
  authorizeRoles("admin", "staff"),
  getAllApplications,
);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin", "staff"),
  updateApplicationStatus,
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("adopter"),
  cancelApplication,
);

module.exports = router;