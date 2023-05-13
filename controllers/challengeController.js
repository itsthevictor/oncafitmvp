const Challenge = require("../models/Challenge");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createChallenge = async (req, res) => {
  const user = req.user;
  const { exercise, reps, weightDist } = req.body;
  if (!exercise || !reps) {
    throw new CustomError("please provide exercise and reps targeted");
  }
  const challenge = await Challenge.create({
    exercise: exercise,
    reps: reps,
    weightDist: weightDist,
    user: user.userId,
  });
  res.status(StatusCodes.CREATED).json(challenge);
};

const getAllChallenges = async (req, res) => {
  res.send("get all challenges");
};

const getMyChallenges = async (req, res) => {
  const challenges = await Challenge.find({ user: req.user.userId });

  res.status(StatusCodes.OK).json({ challenges });
};

const getSingleChallenge = async (req, res) => {
  const { id: challengeId } = req.params;
  // console.log(req);
  // console.log(challengeId);
  const challenge = await Challenge.findOne({ _id: challengeId });
  if (!challenge) {
    throw new CustomError.NotFoundError(
      `no challenge with id: ${challengeId} `
    );
  }
  res.status(StatusCodes.OK).json({ challenge });
};

const updateChallenge = async (req, res) => {
  const { id: challengeId } = req.params;
  console.log(req.body);
  const workout = req.body;
  console.log(workout);
  const challenge = await Challenge.findOne({ _id: challengeId });
  console.log(challenge);
  if (!challenge) {
    throw new CustomError.NotFoundError(
      `no challenge with id: ${challengeId} `
    );
  }
  const { workouts } = challenge;
  workouts.push(workout);
  console.log(workouts.length);
  if (workouts.length >= 10) {
    challenge.reportsAvaliable = true;
  }

  // const today = new Date();
  // if (today.toDateString() === challenge.updatedAt.toDateString()) {
  //   console.log("true");
  // } else console.log("false");

  challenge.save();

  res.status(StatusCodes.OK).json({ challenge });
};

const deleteChallenge = async (req, res) => {
  res.send("delete challenge");
};

module.exports = {
  createChallenge,
  getAllChallenges,
  getMyChallenges,
  getSingleChallenge,
  updateChallenge,
  deleteChallenge,
};
