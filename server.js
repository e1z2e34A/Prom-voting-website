// Load variables from .env
require("dotenv").config();
const candidateRoutes = require("./routes/candidateRoutes");
const voteRoutes = require("./routes/voteRoutes");
const Category = require("./models/Category");
const Candidate = require("./models/Candidate");
const Vote = require("./models/Vote");

// Import packages
const express = require("express");
const cors = require("cors");

// Import database connection
const connectDB = require("./config/database");
const categoryRoutes = require("./routes/categoryRoutes");

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/categories", categoryRoutes);
app.use("/candidates", candidateRoutes);
app.use("/vote", voteRoutes);

// Home page
app.get("/", (req, res) => {
  res.send("🎉 Welcome to the 2K26 PDSSA Voting System!");
});

// =======================
// Dashboard Statistics
// =======================

app.get("/dashboard/stats", async (req, res) => {
  try {
    const totalCategories = await Category.countDocuments();

    const totalCandidates = await Candidate.countDocuments();

    const totalVotes = await Vote.countDocuments();

    res.json({
      totalCategories,

      totalCandidates,

      totalVotes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,

      message: err.message,
    });
  }
});

// =======================
// Election Results
// =======================

app.get("/dashboard/results", async (req, res) => {
  try {
    const results = await Vote.aggregate([
      {
        $group: {
          _id: {
            category: "$category",

            candidate: "$candidate",
          },

          votes: {
            $sum: 1,
          },
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

// =======================
// Dashboard Chart Data
// =======================

app.get("/dashboard/chart", async (req, res) => {
  try {
    const chart = await Vote.aggregate([
      {
        $group: {
          _id: "$category",
          votes: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          votes: -1,
        },
      },
    ]);

    res.json(chart);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
