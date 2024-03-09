import express from "express";

import {
  createLayout,
  editLayout,
  getLayout,
} from "../controller/layoutController.js";

const router = express.Router();

// Create Layout
router.post("/create-layouts", createLayout);

// Update Layout
router.put("/update-layouts", editLayout);
// Get Layout
router.get("/get-layouts/:type", getLayout);

export default router;
