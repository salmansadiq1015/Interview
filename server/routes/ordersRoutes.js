import express from "express";
import { createOrder } from "../controller/ordersController.js";

const router = express.Router();

// Buy Channel
router.post("/channel/payment", createOrder);

// Get All Payments
// router.get("/all/payments");

// Get User Payment
// router.get("/user/channel/payments");

export default router;
