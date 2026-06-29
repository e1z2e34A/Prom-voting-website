const express = require("express");
const router = express.Router();

const Vote = require("../models/vote");

// Cast Vote
router.post("/", async (req, res) => {
  try {
    const { category, candidate } = req.body;

    const vote = new Vote({
      category,
      candidate,
    });

    await vote.save();

    res.json({
      success: true,
      message: "Vote recorded successfully!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ==========================
// Get Election Results
// ==========================
router.get("/results", async (req, res) => {
  try {
    const results = await Vote.aggregate([
      {
        $group: {
          _id: {
            category: "$category",
            candidate: "$candidate",
          },
          votes: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.category": 1,
          votes: -1,
        },
      },
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
