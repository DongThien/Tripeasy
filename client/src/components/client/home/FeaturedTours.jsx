import React from 'react';
import TourCard from './TourCard';

const TOURS = [
    {
        id: 1,
        region: 'Miền Trung',
        regionColor: 'bg-red-100 text-[#8B1A1A]',
        name: 'Đà Nẵng - Hội An: Phố Cổ Tình Yêu',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        duration: '4N3Đ',
        oldPrice: '7.050.000đ',
        price: '5.990.000đ',
        badge: { text: '-15%', color: 'bg-[#8B1A1A]' },
    },
    {
        id: 2,
        region: 'Miền Bắc',
        regionColor: 'bg-green-100 text-green-700',
        name: 'Sapa: Chinh Phục Đỉnh Fansipan',
        image: 'https://images.unsplash.com/photo-1465447142348-e9952c393450?auto=format&fit=crop&w=600&q=80',
        duration: '3N2Đ',
        oldPrice: '4.500.000đ',
        price: '3.290.000đ',
        badge: { text: '-27%', color: 'bg-[#8B1A1A]' },
    },
    {
        id: 3,
        region: 'Miền Tây',
        regionColor: 'bg-yellow-100 text-yellow-700',
        name: 'Cần Thơ - Chợ Nổi Cái Răng',
        image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
        duration: '2N1Đ',
        oldPrice: '',
        price: '1.890.000đ',
        badge: { text: 'Hot', color: 'bg-orange-500' },
    },
    {
        id: 4,
        region: 'Miền Nam',
        regionColor: 'bg-blue-100 text-blue-700',
        name: 'Phú Quốc: Thiên Đường Đảo Ngọc',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        duration: '3N2Đ',
        oldPrice: '4.200.000đ',
        price: '3.990.000đ',
        badge: { text: '', color: '' },
    },
];

const FeaturedTours = () => (
    <section className="max-w-7xl mx-auto mt-20 px-4">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Tour Nổi Bật</h2>
            <a href="#" className="text-[#8B1A1A] font-semibold hover:underline">
                Xem tất cả &rarr;
            </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {TOURS.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
            ))}
        </div>
    </section>
);

export default FeaturedTours;
