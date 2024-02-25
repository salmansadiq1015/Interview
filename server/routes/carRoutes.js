import express from "express";
import {
  createNewRecord,
  getAllRecords,
} from "../controllers/carController.js";

const router = express.Router();

// Create new card
router.post("/create-card", createNewRecord);

// Get All Card
router.get("/get-cards", getAllRecords);

export default router;
