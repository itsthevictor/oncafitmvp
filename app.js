require("dotenv").config();
require("express-async-errors");

// express
const express = require("express");
const app = express();

// rest of the packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// connect to DB
const connectDB = require("./db/connect");

// import routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const exercisesRouter = require("./routes/exerciseRoutes");
const challengesRouter = require("./routes/challengeRoutes");

// middleware
const notFoundError = require("./middleware/not-found");
const errorHandlerError = require("./middleware/error-handler");

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static(__dirname + "/public"));
app.use(express.static("/public/css"));
app.use(express.static("/public/img"));

// routes

// app.get('/', (req, res) => {
//      res.send(public, '/public/index.html');
// })

app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);
  res.send("onca fit api");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/exercises", exercisesRouter);
app.use("/api/v1/challenges", challengesRouter);

app.use(notFoundError);
app.use(errorHandlerError);

// start server
const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
