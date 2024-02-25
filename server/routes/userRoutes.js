import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";

const router = express.Router();

// Register User
router.post("/register-user", registerUser);

// Login User
router.post("/login-user", loginUser);

export default router;
