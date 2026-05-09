import React from 'react';
import { MapPin, Clock, Star, Tag } from 'lucide-react';

const TourDetailHeaderGallery = ({ tour }) => {
    const images = Array.isArray(tour.images) ? tour.images : [tour.image_url];

    return (
        <div className="bg-white border-b border-gray-100 pb-10 pt-6">
            {/* FIX MỞ RỘNG: max-w-[1440px] */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-[#8B1A1A] rounded-lg text-xs font-black uppercase tracking-tighter mb-4">
                        <Tag className="w-3.5 h-3.5" />
                        Mã Tour: TRP-{tour.tour_id}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-5">{tour.title}</h1>

                    <div className="flex flex-wrap items-center gap-6 text-base font-bold text-gray-500">
                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl">
                            <MapPin className="w-5 h-5 text-[#8B1A1A]" /> {tour.destination}
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl">
                            <Clock className="w-5 h-5 text-[#8B1A1A]" /> {tour.duration}
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl">
                            <Star className="w-5 h-5 text-yellow-500 fill-current" /> {tour.rating_avg || 5.0}
                        </div>
                    </div>
                </div>

                {/* Tăng chiều cao ảnh lên h-[550px] hoặc lg:h-[600px] để cân xứng với độ rộng mới */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-xl">
                    <div className="md:col-span-2 md:row-span-2 h-full group relative">
                        <img src={images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Main" />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all" />
                    </div>
                    {images.slice(1, 5).map((img, i) => (
                        <div key={i} className="hidden md:block h-full group relative">
                            <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Sub" />
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TourDetailHeaderGallery;