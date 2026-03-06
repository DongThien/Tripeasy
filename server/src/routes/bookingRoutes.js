import express from "express";
import * as bookingController from "../controllers/bookingController.js";

const router = express.Router();
router.post("/", bookingController.createBooking);
router.get("/stats", bookingController.getBookingStats);
router.get("/user/:user_id", bookingController.getUserBookings);
router.get("/:id", bookingController.getBookingById);
router.get("/", bookingController.getAllBookings);
router.put("/:id/status", bookingController.updateBookingStatus);

export default router;