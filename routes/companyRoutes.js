const express = require("express");
const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController");

const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

// ====== CLEAN REST ROUTES ======

// CREATE (ADMIN ONLY)
router.post("/", protect, authorize("admin"), createCompany);

// READ ALL
router.get("/", getAllCompanies);

// READ SINGLE
router.get("/:id", getCompanyById);

// UPDATE (ADMIN ONLY)
router.put("/:id", protect, authorize("admin"), updateCompany);

// DELETE (ADMIN ONLY)
router.delete("/:id", protect, authorize("admin"), deleteCompany);

module.exports = router;
