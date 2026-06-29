const express = require("express");
const router = express.Router();

const Candidate = require("../models/Candidate");

// =======================
// Get Candidates by Category
// =======================
router.get("/:category", async (req, res) => {
  try {
    const candidates = await Candidate.find({
      category: req.params.category,
    });

    res.json(candidates);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// =======================
// Add Candidate
// =======================
router.post("/add", async (req, res) => {
  try {
    const candidate = new Candidate(req.body);

    await candidate.save();

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ==========================
// Add Candidate
// ==========================
router.post("/", async (req, res) => {
  try {
    const { name, class: studentClass, category } = req.body;

    const exists = await Candidate.findOne({
      name,
      category,
    });

    if (exists) {
      return res.json({
        success: false,
        message: "Candidate already exists in this category.",
      });
    }

    const candidate = new Candidate({
      name,
      class: studentClass,
      category,
    });

    await candidate.save();

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// =======================
// Get All Candidates
// =======================
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({
      category: 1,
      name: 1,
    });

    res.json(candidates);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// =======================
// Delete Candidate
// =======================
router.delete("/:id", async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Candidate deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
// =======================
// Update Candidate
// =======================
router.put("/:id", async (req, res) => {
  try {
    const { name, class: studentClass, category } = req.body;

    await Candidate.findByIdAndUpdate(
      req.params.id,

      {
        name,
        class: studentClass,
        category,
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,

      message: err.message,
    });
  }
});

module.exports = router;
