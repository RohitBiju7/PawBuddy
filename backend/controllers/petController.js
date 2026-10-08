const Pet = require("../models/petModel");
const Adoption = require("../models/adoptionModel");

const fs = require("fs");
const path = require("path");

const removeUploadedFile = (file) => {
  if (!file) {
    return;
  }

  const filePath = path.join(
    __dirname,
    "..",
    "uploads",
    file.filename,
  );

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const addPet = async (req, res) => {
  try {
    const {
      name,
      species,
      breed,
      age,
      gender,
      description,
      healthStatus,
      vaccinationStatus,
      adoptionFee,
    } = req.body;

    if (
      !name ||
      !species ||
      !breed ||
      age === undefined ||
      !gender ||
      !description ||
      !healthStatus ||
      adoptionFee === undefined
    ) {
      removeUploadedFile(req.file);

      return res.status(400).json({
        message: "Please provide all required pet details",
      });
    }

    const pet = await Pet.create({
      name,
      species,
      breed,
      age,
      gender,
      description,
      healthStatus,
      vaccinationStatus,
      adoptionFee,
      image: req.file ? req.file.filename : null,
      createdBy: req.user._id,
      status: "available",
    });

    res.status(201).json({
      message: "Pet added successfully",
      pet,
    });
  } catch (error) {
    removeUploadedFile(req.file);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all pets with optional filters and search
const getAllPets = async (req, res) => {
  try {
    const { species, gender, status, search } = req.query;

    const filter = {};

    if (species) {
      filter.species = species;
    }

    if (gender) {
      filter.gender = gender;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          breed: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const pets = await Pet.find(filter);

    res.status(200).json({
      pets,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get a single pet by ID
const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        message: "Pet not found",
      });
    }

    res.status(200).json({
      pet,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update a pet by ID
const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      removeUploadedFile(req.file);

      return res.status(404).json({
        message: "Pet not found",
      });
    }

    /*
      Once a pet enters the adoption process, its details
      should no longer be editable.

      available = editable
      pending   = locked
      adopted   = locked
    */
    if (pet.status !== "available") {
      removeUploadedFile(req.file);

      return res.status(400).json({
        message:
          "This pet cannot be edited because its adoption process has already started.",
      });
    }

    /*
      Status itself can never be manually changed through
      the normal pet update endpoint.
    */
    if (
      req.body.status !== undefined &&
      req.body.status !== pet.status
    ) {
      removeUploadedFile(req.file);

      return res.status(400).json({
        message:
          "Pet adoption status cannot be changed manually. It is controlled by the adoption process.",
      });
    }

    const allowedFields = [
      "name",
      "species",
      "breed",
      "age",
      "gender",
      "description",
      "healthStatus",
      "vaccinationStatus",
      "adoptionFee",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        pet[field] = req.body[field];
      }
    });

    if (req.file) {
      const newImageFilename = req.file.filename;

      if (pet.image) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "uploads",
          pet.image,
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      pet.image = newImageFilename;
    }

    await pet.save();

    res.status(200).json({
      message: "Pet updated successfully",
      pet,
    });
  } catch (error) {
    removeUploadedFile(req.file);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete a pet by ID
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        message: "Pet not found",
      });
    }

    /*
      A pet with any adoption history should not be deleted.

      This prevents adoption records from pointing
      to a deleted pet.
    */
    const adoptionExists = await Adoption.exists({
      pet: pet._id,
    });

    if (adoptionExists) {
      return res.status(400).json({
        message:
          "This pet cannot be deleted because it has adoption applications associated with it.",
      });
    }

    if (pet.image) {
      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        pet.image,
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await pet.deleteOne();

    res.status(200).json({
      message: "Pet deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  addPet,
  getAllPets,
  getPetById,
  updatePet,
  deletePet,
};