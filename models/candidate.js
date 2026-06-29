const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  class: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Candidate", candidateSchema);
