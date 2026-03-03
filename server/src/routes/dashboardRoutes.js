import express from "express";
import * as dashboardController from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", dashboardController.getDashboardStats);
router.get("/top-tours", dashboardController.getTopTours);
router.get("/recent-bookings", dashboardController.getRecentBookings);

export default router;
