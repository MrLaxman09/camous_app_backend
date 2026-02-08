const User = require("../models/User");

// ================= CREATE STUDENT (ADMIN CAN ADD) =================
exports.createStudent = async (req, res) => {
  try {
    const { name, email, enrollmentNo, course, password } = req.body;

    // Check if already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        error: "Student already exists with this email",
      });
    }

    const student = await User.create({
      name,
      email,
      enrollmentNo,
      course,
      password,
      role: "user",
    });

    res.status(201).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Create student error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ================= GET ALL STUDENTS =================
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "user" })
      .select("name email enrollmentNo course createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ================= GET TOTAL STUDENT COUNT =================
exports.getStudentCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "user" });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Count students error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ================= UPDATE STUDENT =================
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await User.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        email: req.body.email,
        enrollmentNo: req.body.enrollmentNo,
        course: req.body.course,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student: updated,
    });
  } catch (error) {
    console.error("Update student error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ================= DELETE STUDENT =================
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Delete student error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
