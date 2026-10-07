const Pet = require("../models/petModel");

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
      adoptionFee
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
      return res.status(400).json({
        message: "Please provide all required pet details"
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
      createdBy: req.user._id
    });

    res.status(201).json({
      message: "Pet added successfully",
      pet
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
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
        { name: { $regex: search, $options: "i" } },
        { breed: { $regex: search, $options: "i" } }
      ];
    }

    const pets = await Pet.find(filter);

    res.status(200).json({
      pets
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Get a single pet by ID
const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        message: "Pet not found"
      });
    }

    res.status(200).json({
      pet
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Update a pet by ID
const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        message: "Pet not found"
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
      "status"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        pet[field] = req.body[field];
      }
    });

    await pet.save();

    res.status(200).json({
      message: "Pet updated successfully",
      pet
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Delete a pet by ID
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        message: "Pet not found"
      });
    }

    await pet.deleteOne();

    res.status(200).json({
      message: "Pet deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  addPet,
  getAllPets,
  getPetById,
  updatePet,
  deletePet
};