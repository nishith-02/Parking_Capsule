const User = require("../models/users.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const sendEmail = require("../config/email.js");
dotenv.config();
const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const password = req.body.password;
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.secret
    );
    res.status(200).json({
      success: true,
      userInfo: user,
      token: token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};

const signup = async (req, res, next) => {
  try {
    let { name, phoneNumber, email, password } = req.body;
    password = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      phoneNumber,
      password,
    });
    const token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.secret
    );
    res.status(201).json({ success: true, userInfo: user, token: token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};

const getUser = async (req, res, next) => {
  try {
    let userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No user with that id" });
    }
    res.status(200).json({ success: true, userInfo: user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No user with that id" });
    }
    const link = `http://localhost:3000/password-reset/${user._id}`;
    await sendEmail(user.email, link);
    res.status(200).json({
      success: true,
      userId: user._id,
      message: "Sent mail successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No user with that id" });
    }
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 12);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      {
        new: true,
      }
    );
    res.status(200).json({ success: true, userInfo: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No user with that id" });
    }
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12);
    }
    // console.log(req.body);
    const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
      new: true,
    });
    res.status(200).json({ success: true, userInfo: updatedUser });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};

module.exports = {
  signin,
  signup,
  getUser,
  forgotPassword,
  resetPassword,
  updateUser,
};
