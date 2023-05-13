const User = require("../models/User");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const jwt = require("jsonwebtoken");
const {
  attachCookiesToResponse,
  createTokenUser,
  isSubscribed,
  sendVerificationEmail,
  sendResetPasswordEmail,
  hashString,
} = require("../utils");
const crypto = require("crypto");

// Controllers functionality
const register = async (req, res) => {
  console.log("request got");
  const { email, name, password, weight, unit } = req.body;
  const emailAlready = await User.findOne({ email });
  if (emailAlready) {
    throw new CustomError.BadRequestError("email already exists");
  }
  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const verificationToken = crypto.randomBytes(40).toString("hex");
  const user = await User.create({
    name,
    email,
    password,
    role,
    weight,
    unit,
    verificationToken,
  });
  const origin = "http://localhost:3000";
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });

  //   send verificatoin token back only while testing in postman
  res.status(StatusCodes.CREATED).json({
    msg: "successfully created! please check your email to verify the account",
    verificationToken: user.verificationToken,
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError(`verification failed`);
  }
  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError(`verification failed`);
  }
  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "email verified!" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("please provide email and password ");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid credentials");
  }
  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError("Please verify your Email");
  }

  const tokenUser = createTokenUser(user);

  // create refresh token
  let refreshToken = "";
  // check for existing token
  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError("Invalid credentials");
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
  // res.status(StatusCodes.OK).redirect("/");
  next();
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });
  console.log("token succesfully deleted ");
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("subscriptionStatus", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError("please provide your email");
  }

  const user = await User.findOne({ email });

  if (user) {
    const origin = "http://localhost:3000";
    const passwordToken = crypto.randomBytes(70).toString("hex");
    // send email
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });
    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
    user.passwordToken = hashString(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for reset password link" });
};

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  if (!email || !token || !password) {
    throw new CustomError.BadRequestError("please provide all values");
  }
  const user = await User.findOne({ email });

  if (user) {
    const currentDate = new Date();
    if (
      user.passwordToken === hashString(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = "";
      user.passwordTokenExpirationDate = "";

      await user.save();
    }
  }

  res.send("resetPassword");
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
