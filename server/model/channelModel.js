import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: Object,
    rating: {
      type: Number,
      default: 0,
    },
    comment: String,
    commentReplies: [Object],
  },
  { timestamps: true }
);

const replySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Reference to the User model
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    content: {
      type: String,
      required: true,
    },
    replies: [replySchema], // Array of replies
  },
  { timestamps: true }
);

const channelSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    channelLink: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subscriber: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    monotization: {
      type: Boolean,
      default: false,
    },
    allowComment: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
    },
    contentType: {
      type: String,
      default: "unique",
    },
    income: {
      type: String,
      default: 0,
    },
    expense: {
      type: String,
      default: 0,
    },
    incomeSource: {
      type: String,
    },
    expenseDetail: {
      type: String,
    },
    permotionMethod: {
      type: String,
    },
    support: {
      type: String,
    },
    images: [],
    agree: {
      type: Boolean,
      default: false,
    },
    // code: {
    //   type: String,
    //   required: true,
    // },
    condition: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "Processing",
    },
    views: {
      type: Number,
      default: 0,
    },
    comments: [commentSchema],
    review: [reviewSchema],
  },
  { timestamps: true }
);

export default mongoose.model("channels", channelSchema);
