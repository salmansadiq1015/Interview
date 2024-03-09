import express from "express";
import {
  createComment,
  getChannelComments,
  getComments,
} from "../controller/commentController.js";

const router = express.Router();

// Create Comment
router.post("/create-comment", createComment);
// Get Comment
router.get("/get-all-comment", getComments);
// Get Channel Comment
router.get("/get-channel-comment/:id", getChannelComments);

export default router;
