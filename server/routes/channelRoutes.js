import express from "express";
import {
  SingleChannel,
  UpdateSingleChannel,
  createSellChannel,
  deleteSingleChannel,
  getAllChannels,
  getSingleChannel,
} from "../controller/channelController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Sell Channel
router.post("/create-sell-channel", requireSignIn, createSellChannel);

// Get All Sell Channel
router.get("/get-channels", getAllChannels);

// Get User Single Sell Channel
router.get("/users-channels/:id", requireSignIn, getSingleChannel);

// Update Sell Channel
router.put("/update/channel/:id", requireSignIn, UpdateSingleChannel);

// Delete Sell Channel
router.delete(
  "/delete/channels/:id",
  requireSignIn,
  isAdmin,
  deleteSingleChannel
);

// Get All Sell Channel By User
router.get("/getSingle-channel/:id", SingleChannel);

export default router;
