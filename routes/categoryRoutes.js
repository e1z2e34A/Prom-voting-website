const express = require("express");
const router = express.Router();

const Category = require("../models/Category");

// ==========================
// Get all categories
// ==========================
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.json(categories);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ==========================
// Add Category
// ==========================
router.post("/add", async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = new Category({
      name,
      description,
    });

    await category.save();

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
// Add Category
// ==========================
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    const exists = await Category.findOne({ name });

    if (exists) {
      return res.json({
        success: false,
        message: "Category already exists.",
      });
    }

    const category = new Category({
      name,
    });

    await category.save();

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
