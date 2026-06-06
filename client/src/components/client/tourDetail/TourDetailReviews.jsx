import React, { useState, useEffect } from 'react';
import { Star, User, CheckCircle, MessageSquare, AlertCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTourReviews, submitReview, checkReviewEligibility } from '../../../services/reviewService';

const TourDetailReviews = ({ tourId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEligible, setIsEligible] = useState(false);
    const [eligibilityChecked, setEligibilityChecked] = useState(false);
    const [eligibilityReason, setEligibilityReason] = useState("");

    // Form state
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Load data: reviews and user eligibility
    const loadReviewsAndEligibility = async () => {
        try {
            const reviewsRes = await getTourReviews(tourId);
            if (reviewsRes.success) {
                setReviews(reviewsRes.data);
            }

            const token = localStorage.getItem('token');
            if (token) {
                const eligibilityRes = await checkReviewEligibility(tourId);
                if (eligibilityRes.success) {
                    setIsEligible(eligibilityRes.data.eligible);
                    const { hasCompleted, hasReviewed } = eligibilityRes.data;
                    if (hasReviewed) {
                        setEligibilityReason("Bạn đã gửi đánh giá cho tour này rồi.");
                    } else if (!hasCompleted) {
                        setEligibilityReason("Bạn chỉ có thể đánh giá sau khi đã hoàn thành chuyến đi này.");
                    }
                }
            } else {
                setIsEligible(false);
                setEligibilityReason("Vui lòng đăng nhập để gửi đánh giá cho tour này.");
            }
        } catch (error) {
            console.error("Lỗi khi tải đánh giá:", error);
        } finally {
            setLoading(false);
            setEligibilityChecked(true);
        }
    };

    useEffect(() => {
        loadReviewsAndEligibility();
    }, [tourId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating < 1 || rating > 5) {
            toast.error("Vui lòng chọn số sao đánh giá!");
            return;
        }

        setSubmitting(true);
        try {
            const res = await submitReview(tourId, { rating, comment });
            if (res.success) {
                toast.success("Gửi đánh giá thành công!");
                setComment("");
                setRating(5);
                // Reload data
                await loadReviewsAndEligibility();
            } else {
                toast.error(res.message || "Gửi đánh giá thất bại.");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi gửi đánh giá.");
        } finally {
            setSubmitting(false);
        }
    };

    // Calculate rating summary stats
    const total = reviews.length;
    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
        if (starCounts[r.rating] !== undefined) {
            starCounts[r.rating]++;
        }
    });

    const avgRating = total > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) 
        : "0.0";

    const renderStars = (ratingCount, sizeClass = "w-4 h-4") => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`${sizeClass} ${i < ratingCount ? 'text-yellow-400 fill-current' : 'text-gray-200'}`}
            />
        ));
    };

    if (loading && !eligibilityChecked) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
                <span className="ml-3 text-gray-500 font-medium">Đang tải đánh giá...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* 1. Thống kê điểm số (Breakdown Summary) */}
            <div className="bg-gradient-to-br from-white to-gray-50/50 p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="flex flex-col items-center justify-center text-center md:border-r border-gray-100 md:pr-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Đánh Giá Trung Bình</h3>
                    <div className="text-6xl font-extrabold text-gray-900 mb-2">{avgRating}</div>
                    <div className="flex gap-1 mb-2">{renderStars(Math.round(avgRating), "w-5 h-5")}</div>
                    <p className="text-xs text-gray-400 font-medium">({total} lượt đánh giá thực tế)</p>
                </div>
                
                <div className="col-span-1 md:col-span-2 space-y-2.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = starCounts[star] || 0;
                        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                        return (
                            <div key={star} className="flex items-center gap-4 text-xs md:text-sm">
                                <span className="w-12 text-gray-600 font-semibold flex items-center justify-end gap-1">
                                    {star} <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                                </span>
                                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full transition-all duration-1000" 
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <span className="w-12 text-gray-500 font-medium text-right">
                                    {percentage}% ({count})
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 2. Đăng ký & Viết đánh giá (Nếu đủ điều kiện) */}
            {isEligible ? (
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-md space-y-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-700 to-amber-500"></div>
                    <div>
                        <h4 className="text-lg font-bold text-gray-900">Chia sẻ trải nghiệm của bạn</h4>
                        <p className="text-xs text-gray-500">Hãy giúp cộng đồng Tripeasy hiểu rõ hơn về tour du lịch này nhé.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Interactive Star Selection */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">Đánh giá của bạn về chuyến đi:</label>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex gap-1.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setRating(s)}
                                            onMouseEnter={() => setHoverRating(s)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="focus:outline-none transition-transform active:scale-95"
                                        >
                                            <Star
                                                className={`w-8 h-8 cursor-pointer transition-colors ${
                                                    s <= (hoverRating || rating)
                                                        ? 'text-yellow-400 fill-current'
                                                        : 'text-gray-200'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-amber-600 ml-2">
                                    {rating === 5 && "Tuyệt vời (5/5)"}
                                    {rating === 4 && "Rất tốt (4/5)"}
                                    {rating === 3 && "Bình thường (3/5)"}
                                    {rating === 2 && "Kém (2/5)"}
                                    {rating === 1 && "Rất tệ (1/5)"}
                                </span>
                            </div>
                        </div>

                        {/* Comment textarea */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700" htmlFor="comment">Nhận xét chi tiết:</label>
                            <textarea
                                id="comment"
                                rows="4"
                                required
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Viết nhận xét của bạn về hướng dẫn viên, khách sạn, ẩm thực, phương tiện vận chuyển..."
                                className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 text-sm transition-all resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow active:scale-98 disabled:opacity-50 text-sm"
                        >
                            {submitting ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            Gửi đánh giá của tôi
                        </button>
                    </form>
                </div>
            ) : (
                <div className="bg-gray-50 border border-gray-200/60 p-4 rounded-2xl flex items-center gap-3 text-xs md:text-sm text-gray-600">
                    <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span>
                        {eligibilityReason || "Bạn cần hoàn thành chuyến đi này để viết đánh giá."}
                    </span>
                </div>
            )}

            {/* 3. Danh sách đánh giá của khách hàng */}
            <div>
                <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                    Nhận xét từ du khách <span className="bg-red-50 text-red-800 text-xs px-2.5 py-0.5 rounded-full font-bold">{total}</span>
                </h4>

                {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center">
                        <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium text-sm">Chưa có đánh giá nào cho tour này.</p>
                        <p className="text-gray-400 text-xs mt-1">Hãy là du khách đầu tiên chia sẻ cảm nhận về chuyến đi!</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {reviews.map((review) => (
                            <div 
                                key={review.review_id} 
                                className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col gap-4"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-red-800 font-bold border border-red-200">
                                            {review.username ? review.username.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h5 className="font-bold text-gray-800 text-sm md:text-base leading-none">{review.username}</h5>
                                                {review.is_verified && (
                                                    <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-[10px] md:text-xs px-2 py-0.5 rounded-full font-semibold border border-emerald-100">
                                                        <CheckCircle className="w-3 h-3 fill-emerald-100 text-emerald-600" />
                                                        Đã đi tour
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-0.5 mt-1">{renderStars(review.rating, "w-3.5 h-3.5")}</div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400 whitespace-nowrap font-medium">
                                        {new Date(review.timestamp).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                                
                                <p className="text-gray-600 text-sm leading-relaxed pl-1">
                                    {review.comment}
                                </p>

                                {/* Phản hồi từ Ban quản trị */}
                                {review.admin_reply && (
                                    <div className="ml-4 md:ml-12 bg-gray-50/80 p-4 rounded-2xl border-l-4 border-red-700 shadow-xs flex flex-col gap-1.5 animate-fadeIn">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-[11px] md:text-xs text-red-900 uppercase tracking-wider flex items-center gap-1.5">
                                                <MessageSquare className="w-3.5 h-3.5 text-red-700 fill-current" />
                                                Phản hồi từ Ban quản trị
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                {new Date(review.replied_at).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm italic pl-1 leading-relaxed">
                                            "{review.admin_reply}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TourDetailReviews;