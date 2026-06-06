import {
    checkUserCompletedBooking,
    checkUserHasReviewed,
    createReviewRow,
    updateTourRatingStats,
    fetchAllReviewsRows,
    countAllReviewsRows,
    updateAdminReplyRow,
    deleteReviewRow
} from '../models/reviewModel.js';

/**
 * POST /api/reviews/tours/:tourId
 * Khách hàng gửi đánh giá mới cho tour (Đã hoàn thành chuyến đi)
 */
export const submitReview = async (req, res) => {
    try {
        const { tourId } = req.params;
        const userId = req.user.id;
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Số sao đánh giá phải từ 1 đến 5 sao!"
            });
        }

        // 1. Kiểm tra điều kiện khách hàng đã đi tour chưa (hoàn thành đặt tour)
        const hasCompleted = await checkUserCompletedBooking(userId, tourId);
        if (!hasCompleted) {
            return res.status(403).json({
                success: false,
                message: "Bạn chỉ có thể đánh giá tour sau khi đã đặt và hoàn thành chuyến đi này!"
            });
        }

        // 2. Kiểm tra khách hàng đã đánh giá tour này chưa (chỉ được đánh giá 1 lần)
        const hasReviewed = await checkUserHasReviewed(userId, tourId);
        if (hasReviewed) {
            return res.status(400).json({
                success: false,
                message: "Bạn đã gửi đánh giá cho tour này rồi!"
            });
        }

        // 3. Tiến hành tạo đánh giá mới
        const newReview = await createReviewRow(tourId, userId, rating, comment || '');

        // 4. Cập nhật lại số sao trung bình và số lượng đánh giá của tour
        await updateTourRatingStats(tourId);

        return res.status(201).json({
            success: true,
            data: newReview,
            message: "Gửi đánh giá thành công!"
        });
    } catch (error) {
        console.error("Error in submitReview:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống khi gửi đánh giá: " + error.message
        });
    }
};

/**
 * GET /api/reviews/tours/:tourId/eligibility
 * Kiểm tra người dùng hiện tại có đủ điều kiện đánh giá tour này không
 */
export const checkReviewEligibility = async (req, res) => {
    try {
        const { tourId } = req.params;
        const userId = req.user.id;

        const hasCompleted = await checkUserCompletedBooking(userId, tourId);
        const hasReviewed = await checkUserHasReviewed(userId, tourId);

        return res.status(200).json({
            success: true,
            data: {
                eligible: hasCompleted && !hasReviewed,
                hasCompleted,
                hasReviewed
            },
            message: "Kiểm tra quyền viết đánh giá thành công!"
        });
    } catch (error) {
        console.error("Error in checkReviewEligibility:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống khi kiểm tra quyền đánh giá: " + error.message
        });
    }
};

/**
 * GET /api/reviews
 * Admin lấy danh sách toàn bộ đánh giá (Có phân trang, bộ lọc)
 */
export const getAllReviews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const rating = req.query.rating ? parseInt(req.query.rating) : null;
        const search = req.query.search || "";

        const reviews = await fetchAllReviewsRows({ page, limit, rating, search });
        const total = await countAllReviewsRows({ rating, search });
        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            success: true,
            data: {
                reviews,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages
                }
            },
            message: "Lấy danh sách đánh giá thành công!"
        });
    } catch (error) {
        console.error("Error in getAllReviews:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống khi tải danh sách đánh giá: " + error.message
        });
    }
};

/**
 * PUT /api/reviews/:id/reply
 * Admin phản hồi đánh giá của khách hàng
 */
export const replyToReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { admin_reply } = req.body;

        if (admin_reply === undefined) {
            return res.status(400).json({
                success: false,
                message: "Nội dung phản hồi không được để trống!"
            });
        }

        const updatedReview = await updateAdminReplyRow(id, admin_reply);
        
        if (!updatedReview) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đánh giá tương ứng!"
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedReview,
            message: "Gửi phản hồi cho đánh giá thành công!"
        });
    } catch (error) {
        console.error("Error in replyToReview:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống khi phản hồi đánh giá: " + error.message
        });
    }
};

/**
 * DELETE /api/reviews/:id
 * Admin xóa đánh giá không phù hợp
 */
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedReview = await deleteReviewRow(id);
        
        if (!deletedReview) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đánh giá để xóa!"
            });
        }

        // Cập nhật lại thống kê trung bình sao và lượt đánh giá của tour
        await updateTourRatingStats(deletedReview.tour_id);

        return res.status(200).json({
            success: true,
            message: "Xóa đánh giá thành công!"
        });
    } catch (error) {
        console.error("Error in deleteReview:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống khi xóa đánh giá: " + error.message
        });
    }
};
