import {
  comparePassword,
  createRandomToken,
  hashPassword,
} from "../helper/encryption.js";
import userModel from "../model/userModel.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import sendMail from "../helper/mail.js";
import dotenv from "dotenv";

// Config Dotenv
dotenv.config();

// Register User
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.fields;
    const { avatar } = req.files;
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is required",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }
    if (!password) {
      return res.status(400).send({
        success: false,
        message: "Password is required",
      });
    }
    if (!avatar) {
      return res.status(400).send({
        success: false,
        message: "Avatar is required",
      });
    }

    // Existing User
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "This email is already registered!",
      });
    }

    const user = { name, email, password, avatar };

    const activationToken = await createActivationToken(user);
    const activationCode = activationToken.activationCode;

    // Send Email to user
    const data = { user: { name: user.name }, activationCode };

    await sendMail({
      email: user.email,
      subject: "Varification Email!",
      template: "verification-mail.ejs",
      data,
    });

    res.status(200).send({
      success: true,
      message: `Please cheak your email: ${user.email} to activate your account`,
      activationToken: activationToken.token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in register controller.",
    });
  }
};

// Create Activation Token
export const createActivationToken = async (user) => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.JWT_SECRET,
    { expiresIn: "5m" }
  );

  return { token, activationCode };
};

// Verification User
export const verificationUser = async (req, res) => {
  try {
    const { activation_token, activation_code } = req.body;
    console.log(activation_code, activation_token);
    if (!activation_token || !activation_code) {
      return res.status(400).send({
        success: false,
        message: "Activation_code is required! ",
      });
    }

    const newUser = jwt.verify(activation_token, process.env.JWT_SECRET);

    if (newUser.activationCode !== activation_code) {
      return res.status(400).send({
        success: false,
        message: "Invalid activation code",
      });
    }

    const { name, email, password, avatar } = newUser.user;

    // Existing User
    const isExisting = await userModel.findOne({ email });
    if (isExisting) {
      return res.status(400).send({
        success: false,
        message: "Email already exists",
      });
    }

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    const tokenLength = Math.floor(Math.random() * 6) + 15; // Random length between 15 and 20
    let token = "";
    for (let i = 0; i < tokenLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters.charAt(randomIndex);
    }

    // Hashed Password
    const handedPassword = await hashPassword(password);

    const user = new userModel({
      name,
      email,
      password: handedPassword,
      code: token,
    });
    if (avatar) {
      user.avatar.data = fs.readFileSync(avatar.path);
      user.avatar.contentType = avatar.type;
    }
    await user.save();

    res.status(200).send({
      success: true,
      message: "Register successfully!",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in verification controller.",
    });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res
        .status(201)
        .send({ success: false, message: "Email is required!" });
    }
    if (!password) {
      return res
        .status(201)
        .send({ success: false, message: "Password is required!" });
    }

    const user = await userModel.findOne({ email: email }).select("-avatar");

    if (!user) {
      return res
        .status(201)
        .send({ success: false, message: "Invalid email or password!" });
    }

    const isPassword = await comparePassword(password, user.password);
    if (!isPassword) {
      return res
        .status(201)
        .send({ success: false, message: "Invaild password!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "29d",
    });

    res.status(200).send({
      success: true,
      message: "Login successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isSaler: user.isSaler,
        code: user.code,
      },
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login controller.",
    });
  }
};

// Update User
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.fields;
    const { avatar } = req.files;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found!",
      });
    }

    const updateUser = await userModel.findByIdAndUpdate(
      user._id,
      { name: name || user.name, email: email || user.email },
      { new: true }
    );
    if (avatar) {
      updateUser.avatar.data = fs.readFileSync(avatar.path);
      updateUser.avatar.contentType = avatar.type;
    }
    updateUser.save();

    res.status(200).send({
      success: true,
      message: "Profile updated successfully!.",
      updateProfile,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update profile controller.",
    });
  }
};

// All User
export const allUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-avatar");
    res.status(200).send({
      total: users.lenght,
      success: true,
      message: "Users lists!.",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in all users controller.",
    });
  }
};

// Single User
export const singleUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).send({
        success: true,
        message: "User_id is required!.",
      });
    }
    const user = await userModel.findById({ _id: userId }).select("-avatar");
    if (!user) {
      return res.status(400).send({
        success: true,
        message: "User not found!.",
      });
    }

    res.status(200).send({
      success: true,
      message: "User info",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in single user controller.",
    });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).send({
        success: true,
        message: "User_id is required!.",
      });
    }
    const user = await userModel
      .findByIdAndDelete({ _id: userId })
      .select("-avatar");

    res.status(200).send({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in delete user controller.",
    });
  }
};

// Profile image

export const profileImage = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).send({
        success: true,
        message: "User_id is required!.",
      });
    }
    const user = await userModel.findById({ _id: userId }).select("avatar");
    if (!user) {
      return res.status(400).send({
        success: true,
        message: "User not found!.",
      });
    }

    if (user.avatar.data) {
      res.set("Content-Type", user.avatar.contentType);
      res.status(200).send(user.avatar.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in user avatar controller.",
    });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required!",
      });
    }
    const user = await userModel
      .findOne({ email })
      .select("name email passwordResetToken passwordResetTokenExpire");
    if (!user) {
      return res.status(201).send({
        success: false,
        message: "User does not exist!",
      });
    }
    // Generate a random token
    const token = await createRandomToken();
    const expireIn = Date.now() + 10 * 60 * 1000;
    await userModel.findByIdAndUpdate(user._id, {
      passwordResetToken: token,
      passwordResetTokenExpire: expireIn,
    });

    // Send email to user
    const data = { user: { name: user.name, token: token } };

    await sendMail({
      email: user.email,
      subject: "Reset Password",
      template: "reset-password.ejs",
      data,
    });

    res.status(200).send({
      success: true,
      message: "Reset password link send to your email!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error in reset password!",
    });
  }
};

// Update Password
export const updatePassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token) {
      return res.status(201).send({
        success: false,
        message: "Reset token is required!",
      });
    }
    if (!newPassword) {
      return res.status(201).send({
        success: false,
        message: "New password is required!",
      });
    }
    // Check User
    const user = await userModel.findOne({
      passwordResetToken: token,
      passwordResetTokenExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(201).send({
        success: false,
        message: "Token is invalid or has expired!",
      });
    }

    // Hashed Password
    const hashedPassword = await hashPassword(newPassword);
    // Update password
    const updatePassword = await userModel.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword,
        passwordResetToken: "",
        passwordResetTokenExpire: "",
      },
      { new: true }
    );

    await updatePassword.save();

    res.status(200).send({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update password!",
    });
  }
};

// Update User Role

export const userRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    const user = await userModel.findById(userId).select("-password -avatar");
    if (!user) {
      return res.status(201).send({
        success: false,
        message: "User not found!",
      });
    }

    const updateUserRole = await userModel.findByIdAndUpdate(
      user._id,
      {
        $set: { role: role },
      },
      { new: true }
    );
    await updateUserRole.save();
    res.status(200).send({
      success: true,
      message: "User role updated successfully!",
      updateUserRole,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error in single user controller!",
      error,
    });
  }
};
