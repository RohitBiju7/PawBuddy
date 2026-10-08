const Pet = require("../models/petModel");
const Adoption = require("../models/adoptionModel");
const sendEmail = require("../utils/sendEmail");

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
      Find all adoption applications before deletion so
      affected adopters can be notified.
    */
    const relatedApplications = await Adoption.find({
      pet: pet._id,
    }).populate("adopter", "name email");

    /*
      Only pending and approved applications need a deletion notice.

      Rejected applications are already closed.
      Completed applications are historical and the adoption
      has already finished.
    */
    const applicationsToNotify = relatedApplications.filter(
      (application) =>
        ["pending", "approved"].includes(application.status),
    );

    let emailsSent = 0;

    /*
      Send notifications before deleting the records.

      Email failures do not prevent pet deletion.
    */
    for (const application of applicationsToNotify) {
      if (!application.adopter?.email) {
        continue;
      }

      const isApproved = application.status === "approved";

      const subject = isApproved
        ? `Important update about your adoption of ${pet.name}`
        : `Update about your adoption application for ${pet.name}`;

      const text = isApproved
        ? `Hello ${application.adopter.name},\n\n` +
          `We are sorry to inform you that ${pet.name}, who had been reserved for you, is no longer available through PawBuddy.\n\n` +
          `Your approved adoption process has therefore been cancelled.\n\n` +
          `Please contact the shelter if you need any further information.\n\n` +
          `PawBuddy`
        : `Hello ${application.adopter.name},\n\n` +
          `We are sorry to inform you that ${pet.name}, the pet you applied to adopt, is no longer available through PawBuddy.\n\n` +
          `Your adoption application will therefore be removed.\n\n` +
          `Thank you for your understanding.\n\n` +
          `PawBuddy`;

      const html = isApproved
        ? `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #2F7D6D;">
              Important Adoption Update
            </h2>

            <p>Hello ${application.adopter.name},</p>

            <p>
              We are sorry to inform you that
              <strong>${pet.name}</strong>, who had been reserved for you,
              is no longer available through PawBuddy.
            </p>

            <p>
              Your approved adoption process has therefore been cancelled.
            </p>

            <p>
              Please contact the shelter if you need any further information.
            </p>

            <p style="color: #2F7D6D; font-weight: bold;">
              PawBuddy
            </p>
          </div>
        `
        : `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #2F7D6D;">
              Adoption Application Update
            </h2>

            <p>Hello ${application.adopter.name},</p>

            <p>
              We are sorry to inform you that
              <strong>${pet.name}</strong>, the pet you applied to adopt,
              is no longer available through PawBuddy.
            </p>

            <p>
              Your adoption application will therefore be removed.
            </p>

            <p>
              Thank you for your understanding.
            </p>

            <p style="color: #2F7D6D; font-weight: bold;">
              PawBuddy
            </p>
          </div>
        `;

      try {
        await sendEmail({
          to: application.adopter.email,
          subject,
          text,
          html,
        });

        emailsSent += 1;
      } catch (emailError) {
        console.error(
          `Failed to send deletion email to ${application.adopter.email}:`,
          emailError.message,
        );
      }
    }

    // Delete all adoption records linked to this pet.
    await Adoption.deleteMany({
      pet: pet._id,
    });

    // Delete the pet image from the uploads folder.
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

    // Permanently delete the pet from MongoDB.
    await pet.deleteOne();

    res.status(200).json({
      message: "Pet deleted successfully",
      affectedApplications: relatedApplications.length,
      notifiedApplications: applicationsToNotify.length,
      emailsSent,
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