import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    channelId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
    },
    userName: {
      type: String,
    },
    userEmail: {
      type: String,
    },

    rating: {
      type: Number,
      default: 0,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("comment", commentSchema);
