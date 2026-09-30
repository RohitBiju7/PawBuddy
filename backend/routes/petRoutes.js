const express = require("express");
const { addPet, 
        getAllPets, 
        getPetById,
        updatePet,
        deletePet 
      } = require("../controllers/petController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("admin", "staff"),
  addPet
);

router.get("/", getAllPets);

router.get("/:id", getPetById);

router.patch(
  "/:id",
  protect,
  authorizeRoles("admin", "staff"),
  updatePet
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "staff"),
  deletePet
);

module.exports = router;