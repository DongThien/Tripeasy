import express from "express";
import * as dashboardController from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/revenue-chart", dashboardController.getRevenueChart);
router.get("/stats", dashboardController.getDashboardStats);
router.get("/top-tours", dashboardController.getTopTours);
router.get("/recent-bookings", dashboardController.getRecentBookings);
router.get("/search", dashboardController.getGlobalSearch);
router.get("/notifications", dashboardController.getNotifications);

export default router;
