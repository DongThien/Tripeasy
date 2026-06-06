import express from "express";
import tourRoutes from "./tourRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import userRoutes from "./userRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import contactRoutes from "./contactRoutes.js";
import chatRoutes from "./chatRoutes.js";
import settingRoutes from "./settingRoutes.js";
import reviewRoutes from "./reviewRoutes.js";

const router = express.Router();
router.use("/tours", tourRoutes);
router.use("/bookings", bookingRoutes);
router.use("/users", userRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/contacts", contactRoutes);
router.use("/chat", chatRoutes);
router.use("/settings", settingRoutes);
router.use("/reviews", reviewRoutes);

export default router;