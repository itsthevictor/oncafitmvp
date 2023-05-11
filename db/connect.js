const mongoose = require('mongoose');

mongoose.set('strictQuery', false)

const connectDB = (url) => {
  return mongoose.connect(process.env.MONGO_URI);
};

module.exports = connectDB;
