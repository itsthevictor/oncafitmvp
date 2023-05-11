require("dotenv").config();

const connectDB = require("./db/connect");
const User = require("./models/User.js");
// const jsonExercises = require("./data/exercises.json");

// const start = async () => {
//   try {
//     await connectDB(process.env.MONGO_URI);
//     await Exercise.deleteMany();
//     await Exercise.create(jsonExercises);
//     console.log("success");
//   } catch (error) {
//     console.log(error);
//   }
// };

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await User.deleteMany();
    // await Exercise.create(jsonExercises);
    console.log("success");
  } catch (error) {
    console.log(error);
  }
};

start();
