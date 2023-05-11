const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide company name"],
    maxlength: 50,
  },
  type: {
    type: String,
    enum: ["push", "pull", "legs", "core"],
  },
  branch: {
    type: String,
    required: false,
    maxlength: 50,
  },
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced", "expert"],
  },
  instructions: {
    type: String,
    required: [true, "please provide instructions"],
    maxlength: 1500,
  },
});

module.exports = mongoose.model("Exercise", ExerciseSchema);
