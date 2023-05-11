const Exercise = require("../models/Exercise");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createExercise = async (req, res) => {
  res.send("create exercise");
};

const getAllExercises = async (req, res) => {
  const { type } = req.body;
  if (type) {
    const exercises = await Exercise.find({ type: type });
    res.status(StatusCodes.OK).json({ exercises });
  } else {
    const exercises = await Exercise.find();
    res.status(StatusCodes.OK).json({ exercises });
  }
};

const getSingleExercise = async (req, res) => {
  res.send("get single exercise");
};

const deleteExercise = async (req, res) => {
  res.send("delete exercise");
};

module.exports = {
  createExercise,
  getAllExercises,
  getSingleExercise,
  deleteExercise,
};
