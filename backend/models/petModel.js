const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    species: {
      type: String,
      required: true,
      enum: ["dog", "cat", "other"],
      lowercase: true
    },

    breed: {
      type: String,
      required: true,
      trim: true
    },

    age: {
      type: Number,
      required: true,
      min: 0
    },

    gender: {
      type: String,
      required: true,
      enum: ["male", "female"]
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    healthStatus: {
      type: String,
      required: true,
      trim: true
    },

    vaccinationStatus: {
      type: String,
      enum: ["vaccinated", "not vaccinated", "partial"],
      default: "not vaccinated"
    },

    adoptionFee: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ["available", "pending", "adopted"],
      default: "available"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;