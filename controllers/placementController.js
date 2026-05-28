const Placement = require("../models/Placement");
const Company = require("../models/Company");
const Application = require("../models/Application")

// ADD PLACEMENT
exports.addPlacement = async (req, res) => {
  try {
    const placement = await Placement.create(req.body);
    res.status(201).json({ success: true, placement });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET ALL PLACEMENTS
exports.getAllPlacements = async (req, res) => {
  try {
    const placements = await Placement.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: placements.length,
      placements,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE PLACEMENT (NEW)
exports.updatePlacement = async (req, res) => {
  try {
    const placement = await Placement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!placement) {
      return res.status(404).json({ success: false, message: "Placement not found" });
    }

    res.status(200).json({ success: true, placement });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE PLACEMENT (NEW)
exports.deletePlacement = async (req, res) => {
  try {
    const placement = await Placement.findByIdAndDelete(req.params.id);

    if (!placement) {
      return res.status(404).json({ success: false, message: "Placement not found" });
    }

    res.status(200).json({ success: true, message: "Placement deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// COUNT
exports.getPlacementCount = async (req, res) => {
  const count = await Placement.countDocuments();
  res.status(200).json({ success: true, count });
};

// AVERAGE PACKAGE
exports.getAveragePackage = async (req, res) => {
  const result = await Placement.aggregate([
    { $match: { status: "Confirmed" } },
    { $group: { _id: null, avgPackage: { $avg: "$package" } } },
  ]);

  const avg = result.length ? result[0].avgPackage : 0;

  res.status(200).json({ success: true, avgPackage: avg });
};

//HIGHEST PACKAGE

exports.getHighestPackage = async (req, res) => {
  const result = await Placement.aggregate([
    { $match: { status: "Confirmed" } },
    { $group: { _id: null, highestPackage: { $max: "$package" } } },
  ]);

  const highest = result.length ? result[0].highestPackage : 0;

  res.status(200).json({ success: true, highestPackage: highest });
};


exports.getAnalytics = async (req, res) => {
  try {
    // ✅ Consistent status
    const STATUS = "Confirmed";

    // 📊 Totals
    const totalCompanies = await Company.countDocuments();
    const totalApplied = await Application.countDocuments();

    const totalSelected = await Placement.countDocuments({
      status: STATUS,
    });

    const placementPercentage =
      totalApplied === 0
        ? 0
        : Math.round((totalSelected / totalApplied) * 100);

    // 📊 Branch-wise stats (using course)
    const branchStats = await Placement.aggregate([
      { $match: { status: STATUS } },
      {
        $group: {
          _id: { $ifNull: ["$course", "Unknown"] }, // ✅ change here
          selected: { $sum: 1 },
        },
      },
      { $sort: { selected: -1 } },
      {
        $project: {
          branch: "$_id", // name same rehne de (frontend use kar raha hai)
          selected: 1,
          _id: 0,
        },
      },
    ]);


    // 📊 Applied per month
    const appliedMonthly = await Application.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          applied: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 📊 Selected per month
    const selectedMonthly = await Placement.aggregate([
      { $match: { status: STATUS } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          selected: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 📅 Month names
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // 🔥 Combine monthly data
    const formattedMonthly = months.map((month, index) => {
      const appliedData = appliedMonthly.find(
        (item) => item._id === index + 1
      );

      const selectedData = selectedMonthly.find(
        (item) => item._id === index + 1
      );

      return {
        month,
        applied: appliedData?.applied || 0,
        selected: selectedData?.selected || 0,
      };
    });

    // 🏆 Top Branch (bonus)
    const topBranch =
      branchStats.length > 0 ? branchStats[0] : null;

    // ✅ Final Response
    res.json({
      totalCompanies,
      totalApplied,
      totalSelected,
      placementPercentage,
      branchStats,
      monthlyStats: formattedMonthly,
      topBranch,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `${error} Analytics error` });
  }
};
