import React, { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import axiosClient from '../../../services/axiosClient';

const TourDetailReviews = ({ tourId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // Giả định bạn đã có endpoint /api/tours/:id/reviews
                const response = await axiosClient.get(`/tours/${tourId}/reviews`);
                if (response.data.success) {
                    setReviews(response.data.data);
                }
            } catch (error) {
                console.error("Lỗi lấy đánh giá:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [tourId]);

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));
    };

    if (loading) return <p>Đang tải đánh giá...</p>;

    return (
        <div className="space-y-8 animate-fadeIn">
            {reviews.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500">Chưa có đánh giá nào cho tour này. Hãy là người đầu tiên trải nghiệm!</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {reviews.map((review) => (
                        <div key={review.review_id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#8B1A1A]">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{review.username}</h4>
                                        <div className="flex mt-1">{renderStars(review.rating)}</div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(review.timestamp).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed italic">
                                "{review.comment}"
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TourDetailReviews;