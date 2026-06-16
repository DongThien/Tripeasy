import axiosClient from './axiosClient';

// Lấy danh sách đánh giá của một tour
export const getTourReviews = (tourId) =>
    axiosClient.get(`/tours/${tourId}/reviews`).then((r) => r.data);

// Khách hàng gửi đánh giá mới
export const submitReview = (tourId, data) =>
    axiosClient.post(`/reviews/tours/${tourId}`, data).then((r) => r.data);

// Kiểm tra quyền được viết đánh giá cho tour
export const checkReviewEligibility = (tourId) =>
    axiosClient.get(`/reviews/tours/${tourId}/eligibility`).then((r) => r.data);

// Admin lấy danh sách toàn bộ đánh giá (phân trang & bộ lọc)
export const getAllReviews = (params = {}) =>
    axiosClient.get('/reviews', { params }).then((r) => r.data);

// Admin phản hồi đánh giá
export const replyToReview = (id, admin_reply) =>
    axiosClient.put(`/reviews/${id}/reply`, { admin_reply }).then((r) => r.data);

// Admin xóa đánh giá
export const deleteReview = (id) =>
    axiosClient.delete(`/reviews/${id}`).then((r) => r.data);

// Khách hàng lấy danh sách đánh giá của chính mình
export const getMyReviews = () =>
    axiosClient.get('/reviews/me').then((r) => r.data);

const reviewService = {
    getTourReviews,
    submitReview,
    checkReviewEligibility,
    getAllReviews,
    replyToReview,
    deleteReview,
    getMyReviews
};

export default reviewService;
