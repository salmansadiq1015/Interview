import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    carModel: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    images: [{ imageURL: { type: String, required: true } }],
  },
  { timestamps: true }
);

export default mongoose.model("Cars", carSchema);
