import React from 'react';
import { MapPin, ArrowRight } from "lucide-react";

const TourCard = ({ tour }) => (
    <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
        <div className="relative">
            <img
                src={tour.image}
                alt={tour.name}
                className="w-full aspect-[4/3] object-cover"
            />
            {/* Badge top left */}
            {tour.badge.text && (
                <span
                    className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold text-white rounded-full ${tour.badge.color} shadow`}
                >
                    {tour.badge.text}
                </span>
            )}
            {/* Duration badge bottom left */}
            <span className="absolute bottom-3 left-3 px-2 py-1 text-xs font-semibold bg-black/70 text-white rounded">
                {tour.duration}
            </span>
        </div>
        <div className="flex-1 flex flex-col p-4">
            <div className="flex items-center gap-1 text-sm mb-1">
                <MapPin className="w-4 h-4 text-[#8B1A1A]" />
                <span className="font-medium text-gray-700">{tour.region}</span>
            </div>
            <div className="font-bold text-gray-900 text-base mb-2 line-clamp-2">
                {tour.name}
            </div>
            <div className="mt-auto flex items-center justify-between">
                <div>
                    {tour.oldPrice && (
                        <span className="text-gray-400 text-sm line-through mr-1">
                            {tour.oldPrice}
                        </span>
                    )}
                    <span className="text-[#8B1A1A] font-bold text-lg">{tour.price}</span>
                </div>
                <button className="bg-red-100 p-2 rounded-full hover:bg-red-200 transition">
                    <ArrowRight className="w-5 h-5 text-[#8B1A1A]" />
                </button>
            </div>
        </div>
    </div>
);

export default TourCard;
