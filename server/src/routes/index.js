import express from "express";
import tourRoutes from "./tourRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import userRoutes from "./userRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import contactRoutes from "./contactRoutes.js";
import chatRoutes from "./chatRoutes.js";

const router = express.Router();
router.use("/tours", tourRoutes);
router.use("/bookings", bookingRoutes);
router.use("/users", userRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/contacts", contactRoutes);
router.use("/chat", chatRoutes);

export default router;