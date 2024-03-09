import mongoose from "mongoose";

// FAQ Schema
const faqSchema = new mongoose.Schema({
  question: {
    type: String,
  },
  answer: {
    type: String,
  },
});

const layoutSchema = new mongoose.Schema(
  {
    type: {
      type: String,
    },
    logo: {
      logoImage: {
        type: String,
      },
      title: {
        type: String,
      },
    },
    faq: [faqSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Layout", layoutSchema);
