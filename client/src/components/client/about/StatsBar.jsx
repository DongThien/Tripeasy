import React from 'react';
import { MapPin, Star, Users } from 'lucide-react';

const STATS = [
    { icon: <MapPin className="w-8 h-8" />, value: '1,000+', label: 'Tour đa dạng' },
    { icon: <Star className="w-8 h-8" />, value: '50+', label: 'Điểm đến' },
    { icon: <Users className="w-8 h-8" />, value: '99%', label: 'Khách hàng hài lòng' },
];

const StatsBar = () => (
    <section className="bg-[#8B1A1A]">
        <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {STATS.map(({ icon, value, label }) => (
                <div key={label} className="flex flex-col items-center text-white text-center gap-2">
                    {icon}
                    <p className="text-5xl font-extrabold tracking-tight">{value}</p>
                    <p className="text-lg font-medium text-red-200">{label}</p>
                </div>
            ))}
        </div>
    </section>
);

export default StatsBar;
