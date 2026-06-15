import React, { useEffect, useMemo, useState } from 'react';
import TourCard from './TourCard';
import tourService from '../../../services/tourService';

const FeaturedTours = () => {
    const [tours, setTours] = useState([]);

    useEffect(() => {
        const fetchFeaturedTours = async () => {
            try {
                const data = await tourService.getAllTours({ availability: true });
                const list = Array.isArray(data) ? data : [];
                setTours(list);
            } catch {
                setTours([]);
            }
        };

        fetchFeaturedTours();
    }, []);

    const featuredTours = useMemo(() => {
        return tours
            .filter((tour) => tour.availability === true || tour.status === 'active')
            .slice(0, 4);
    }, [tours]);

    if (featuredTours.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto mt-20 px-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Tour Nổi Bật</h2>
                <a href="/client/tours" className="text-[#8B1A1A] font-semibold hover:underline">
                    Xem tất cả &rarr;
                </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {featuredTours.map((tour) => (
                    <TourCard key={tour.tour_id || tour.id} tour={tour} />
                ))}
            </div>
        </section>
    );
};

export default FeaturedTours;
