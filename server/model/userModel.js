import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    isSaler: {
      type: Boolean,
      default: false,
    },
    avatar: {
      data: Buffer,
      contentType: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpire: {
      type: Date,
    },
    code: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
