import { comparePassword, handPassword } from "../helper/encryption.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

// Register user
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email) {
      return res
        .status(400)
        .send({ success: false, message: "Email is required" });
    }
    if (!password) {
      return res
        .status(400)
        .send({ success: false, message: "Password is required" });
    }
    // Check Existing User
    const isExisting = await userModel.findOne({ email });
    if (isExisting) {
      return res.status(201).send({
        success: false,
        message: "User already exist with this email!",
      });
    }
    // Hash Password
    const hashedPassword = await handPassword(password);

    const user = await userModel.create({ email, password: hashedPassword });

    res.status(200).send({
      success: true,
      message: "Register successfully!",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in register user controller",
      error,
    });
  }
};

// Login User Controller

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email) {
      return res
        .status(400)
        .send({ success: false, message: "Email is required" });
    }
    if (!password) {
      return res
        .status(400)
        .send({ success: false, message: "Password is required" });
    }
    // Check Existing User
    const isExistingUser = await userModel.findOne({ email });
    if (!isExistingUser) {
      return res.status(400).send({
        success: false,
        message: "User does not exist!",
      });
    }
    // Hash Password
    const compasedPassord = await comparePassword(
      password,
      isExistingUser.password
    );
    if (!compasedPassord) {
      return res.status(400).send({
        success: false,
        message: "Invalid Password!",
      });
    }

    // Token
    const token = await jwt.sign(
      { id: isExistingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).send({
      success: true,
      message: "Login successfully!",
      user: {
        id: isExistingUser._id,
        email: isExistingUser.email,
      },
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login controller",
      error,
    });
  }
};
