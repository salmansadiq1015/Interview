import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      default: "Amjad@desolint.com",
    },
    password: {
      type: String,
      required: true,
      default: "123456abc",
    },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
