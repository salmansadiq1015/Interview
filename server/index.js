import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoute from "./routes/userRoutes.js";
import carRoute from "./routes/carRoutes.js";

// Dotenv Config
dotenv.config();

// Middleware
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// DataBase
connectDB();

// APIs
app.use("/api/v1/user", userRoute);
app.use("/api/v1/car", carRoute);

// Rest API's
app.use("/", (req, res) => {
  res.send("Server is running...");
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
