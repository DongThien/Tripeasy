import React from "react";


const TopSellingTours = ({ tours }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col">
        <div className="font-semibold text-gray-900 mb-4">Top Selling Tours</div>
        <div className="flex flex-col gap-4">
            {tours.map((tour) => (
                <div key={tour.id || tour.name} className="flex items-center gap-3">
                    <img src={tour.img || tour.image} alt={tour.name} className="w-12 h-12 rounded-lg object-cover" onError={e => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1542001476-eb34bfeb2412?w=150"; }} />
                    <div className="flex-1">
                        <div className="font-semibold text-gray-900">{tour.name}</div>
                        <div className="text-xs text-gray-500">{tour.subtitle}</div>
                    </div>
                    <div className="text-sm text-gray-700 font-medium">{tour.sold} <span className="text-xs text-gray-400">Sold</span></div>
                </div>
            ))}
        </div>
        <button className="mt-6 bg-[#8B1A1A] text-white font-semibold rounded-full py-2 w-full hover:bg-[#a83232] transition">
            View All Tours
        </button>
    </div>
);

export default TopSellingTours;
