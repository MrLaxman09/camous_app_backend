const express = require("express");
const {
  addPlacement,
  getAllPlacements,
  getPlacementCount,
  getAveragePackage,
  updatePlacement,
  deletePlacement,
} = require("../controllers/placementController");

const router = express.Router();

router.post("/", addPlacement);
router.get("/", getAllPlacements);
router.get("/count", getPlacementCount);
router.get("/average-package", getAveragePackage);

router.put("/update/:id", updatePlacement);   // ✅ NEW
router.delete("/delete/:id", deletePlacement); // ✅ NEW

module.exports = router;
