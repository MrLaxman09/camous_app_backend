const Placement = require("../models/Placement");

// ✅ ADD PLACEMENT
exports.addPlacement = async (req, res) => {
  try {
    const placement = await Placement.create(req.body);

    res.status(201).json({
      success: true,
      placement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ✅ GET ALL PLACEMENTS
exports.getAllPlacements = async (req, res) => {
  try {
    const placements = await Placement.find()
      .populate("student")   // only populate student (correct)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: placements.length,
      placements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ✅ GET PLACEMENT COUNT
exports.getPlacementCount = async (req, res) => {
  try {
    const count = await Placement.countDocuments();

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ✅ GET AVERAGE PACKAGE
exports.getAveragePackage = async (req, res) => {
  try {
    const result = await Placement.aggregate([
      { $match: { status: "Confirmed" } },
      { $group: { _id: null, avgPackage: { $avg: "$package" } } },
    ]);

    const avg = result.length ? result[0].avgPackage : 0;

    res.status(200).json({
      success: true,
      avgPackage: avg,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ✅ UPDATE PLACEMENT (NEW)
exports.updatePlacement = async (req, res) => {
  try {
    const placement = await Placement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!placement) {
      return res.status(404).json({
        success: false,
        error: "Placement not found",
      });
    }

    res.status(200).json({
      success: true,
      placement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ✅ DELETE PLACEMENT (NEW)
exports.deletePlacement = async (req, res) => {
  try {
    const placement = await Placement.findByIdAndDelete(req.params.id);

    if (!placement) {
      return res.status(404).json({
        success: false,
        error: "Placement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Placement deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
