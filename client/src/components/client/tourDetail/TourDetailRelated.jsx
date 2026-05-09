import React, { useState, useEffect } from 'react';
import axiosClient from '../../../services/axiosClient';
import TourCard from '../../client/home/TourCard';

const TourDetailRelated = ({ currentTourId, category }) => {
    const [relatedTours, setRelatedTours] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelatedTours = async () => {
            try {
                // Gọi API lấy tour theo category, giới hạn 4 tour
                const response = await axiosClient.get(`/tours?category=${category}&limit=4`);
                if (response.data.success) {
                    // Lọc bỏ tour hiện tại khỏi danh sách liên quan
                    const filtered = response.data.data.filter(t => t.tour_id !== parseInt(currentTourId));
                    setRelatedTours(filtered);
                }
            } catch (error) {
                console.error("Lỗi lấy tour liên quan:", error);
            } finally {
                setLoading(false);
            }
        };

        if (category) fetchRelatedTours();
    }, [currentTourId, category]);

    if (loading || relatedTours.length === 0) return null;

    return (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-900">Có thể bạn sẽ thích</h2>
                    <div className="h-1.5 w-24 bg-[#8B1A1A] mt-3 rounded-full"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
                {relatedTours.map((tour) => (
                    <TourCard key={tour.tour_id} tour={tour} />
                ))}
            </div>
        </div>
    );
};

export default TourDetailRelated;