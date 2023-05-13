// const { json } = require("body-parser");
// const { object, string } = require("joi");
const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema(
  {
    exercise: {
      type: String,
      required: [true, "please provide company name"],
    },
    reps: {
      type: String,
      required: [true, "please provide position"],
      maxlength: 100,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide user"],
    },
    reportsAvaliable: {
      type: Boolean,
      default: false,
    },
    workouts: [],
    weightDist: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Challenge", ChallengeSchema);
