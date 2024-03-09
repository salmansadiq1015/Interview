import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    sellerId: {
      type: String,
      required: true,
    },
    sellerName: {
      type: String,
      required: true,
    },
    sellerEmail: {
      type: String,
      required: true,
    },
    buyerEmail: {
      type: String,
    },
    channelId: {
      type: String,
      required: true,
    },
    channelName: {
      type: String,
      required: true,
    },
    channelLink: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Orders", orderSchema);
