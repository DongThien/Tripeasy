import express from "express";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.js";
import {
    submitReview,
    checkReviewEligibility,
    getAllReviews,
    replyToReview,
    deleteReview,
    getMyReviews
} from "../controllers/reviewController.js";

const router = express.Router();

// Khách hàng lấy danh sách đánh giá của chính mình
router.get("/me", verifyToken, getMyReviews);

// Khách hàng gửi đánh giá mới
router.post("/tours/:tourId", verifyToken, submitReview);

// Khách hàng kiểm tra điều kiện đánh giá
router.get("/tours/:tourId/eligibility", verifyToken, checkReviewEligibility);

// Admin lấy danh sách đánh giá (phân trang, bộ lọc)
router.get("/", verifyAdmin, getAllReviews);

// Admin phản hồi đánh giá
router.put("/:id/reply", verifyAdmin, replyToReview);

// Admin xóa đánh giá
router.delete("/:id", verifyAdmin, deleteReview);

export default router;
