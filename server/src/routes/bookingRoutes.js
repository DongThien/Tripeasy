import express from "express";
import * as bookingController from "../controllers/bookingController.js";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// --- LUỒNG KHÁCH HÀNG (Đã đăng nhập) ---
router.post("/", verifyToken, bookingController.createBooking);
router.get("/user/:user_id", verifyToken, bookingController.getUserBookings);
router.put("/:id/cancel", verifyToken, bookingController.cancelUserBooking);

// --- LUỒNG WEBHOOK THANH TOÁN (Không qua verifyToken vì là cổng thanh toán tự động gọi) ---
router.post("/webhook/casso", bookingController.handleCassoWebhook);

// --- LUỒNG QUẢN TRỊ VIÊN ---
router.get("/stats", verifyAdmin, bookingController.getBookingStats);
router.get("/", verifyAdmin, bookingController.getAllBookings);
router.get("/:id", verifyAdmin, bookingController.getBookingById);
router.put("/:id/status", verifyAdmin, bookingController.updateBookingStatus);

export default router;