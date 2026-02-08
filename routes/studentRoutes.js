const express = require("express");
const {
  createStudent,
  getAllStudents,
  getStudentCount,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const router = express.Router();

// CREATE (Admin add student manually)
router.post("/", createStudent);

// READ ALL STUDENTS
router.get("/", getAllStudents);

// GET TOTAL STUDENT COUNT
router.get("/count", getStudentCount);

// UPDATE STUDENT
router.put("/:id", updateStudent);

// DELETE STUDENT
router.delete("/:id", deleteStudent);

module.exports = router;
