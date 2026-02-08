const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    enrollmentNo: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    department: {
      type: String,
      required: false
    },
    course: {
      type: String,
      required: true,
      trim: true,
    },
    cgpa: {
      type: Number,
      required: false,
      min: 0,
      max: 10,
    },
    year: {
      type: String,
      required: false,
    },
    resumeUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
