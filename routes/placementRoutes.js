const express = require("express");
const {
  addPlacement,
  getAllPlacements,
  updatePlacement,
  deletePlacement,
  getPlacementCount,
  getAveragePackage,
  getHighestPackage,
  getAnalytics,
} = require("../controllers/placementController");

const router = express.Router();

router.post("/", addPlacement);
router.get("/", getAllPlacements);
router.put("/update/:id", updatePlacement);
router.delete("/delete/:id", deletePlacement);
router.get("/count", getPlacementCount);
router.get("/average-package", getAveragePackage);
router.get("/highest-package", getHighestPackage);
router.get("/analytics", getAnalytics);

module.exports = router;
