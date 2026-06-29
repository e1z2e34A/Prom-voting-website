const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },

    candidate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Vote", voteSchema);
