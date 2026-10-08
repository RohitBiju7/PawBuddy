const Adoption = require("../models/adoptionModel");
const Pet = require("../models/petModel");

const applyForAdoption = async (req, res) => {
  try {
    const { petId, message } = req.body;

    if (!petId) {
      return res.status(400).json({
        message: "Pet ID is required",
      });
    }

    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({
        message: "Pet not found",
      });
    }

    if (pet.status !== "available") {
      return res.status(400).json({
        message: "This pet is not currently available for adoption",
      });
    }

    const existingApplication = await Adoption.findOne({
      pet: petId,
      adopter: req.user._id,
      status: "pending",
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You already have a pending application for this pet",
      });
    }

    const adoption = await Adoption.create({
      pet: petId,
      adopter: req.user._id,
      message,
    });

    res.status(201).json({
      message: "Adoption application submitted successfully",
      adoption,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Adoption.find({
      adopter: req.user._id,
    })
      .populate("pet")
      .sort({ createdAt: -1 });

    res.status(200).json({
      applications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const applications = await Adoption.find()
      .populate("pet")
      .populate("adopter", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      applications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be approved or rejected",
      });
    }

    const adoption = await Adoption.findById(req.params.id);

    if (!adoption) {
      return res.status(404).json({
        message: "Adoption application not found",
      });
    }

    adoption.status = status;
    await adoption.save();

    if (status === "approved") {
      await Pet.findByIdAndUpdate(adoption.pet, {
        status: "pending",
      });

      await Adoption.updateMany(
        {
          pet: adoption.pet,
          _id: { $ne: adoption._id },
          status: "pending",
        },
        {
          status: "rejected",
        },
      );
    }

    res.status(200).json({
      message: `Application ${status} successfully`,
      adoption,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const cancelApplication = async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id);

    if (!adoption) {
      return res.status(404).json({
        message: "Adoption application not found",
      });
    }

    if (adoption.adopter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to cancel this application",
      });
    }

    if (adoption.status !== "pending") {
      return res.status(400).json({
        message: "Only pending applications can be cancelled",
      });
    }

    await adoption.deleteOne();

    res.status(200).json({
      message: "Adoption application cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  applyForAdoption,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  cancelApplication,
};
