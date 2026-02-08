const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    logoUrl: {
      type: String,
    },
    arrivalDate: {
      type: Date,
      required: true,
    },
    cgpaRequired: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    role: {
      type: String,
      required: true,
    },
    openings: {
      type: Number,
      required: true,
      min: 1,
    },
    location: {
      type: String,
      required: true,
    },
    jdUrl: {
      type: String,
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
