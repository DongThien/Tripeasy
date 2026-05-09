import React, { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';

const TourDetailItinerary = ({ itinerary }) => {
    const [openDay, setOpenDay] = useState(0); // Mặc định mở ngày đầu tiên

    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tight border-l-4 border-[#8B1A1A] pl-4">Lịch trình chi tiết</h3>
            <div className="space-y-4">
                {itinerary.map((day, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden">
                        <button
                            onClick={() => setOpenDay(openDay === idx ? null : idx)}
                            className={`w-full flex items-center justify-between p-5 text-left transition-colors ${openDay === idx ? 'bg-red-50' : 'bg-white'}`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="w-12 h-12 rounded-xl bg-[#8B1A1A] text-white flex flex-col items-center justify-center shrink-0">
                                    <span className="text-[10px] font-bold uppercase opacity-80">Ngày</span>
                                    <span className="text-lg font-black">{day.day}</span>
                                </span>
                                <span className="font-bold text-gray-900">{day.title}</span>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openDay === idx ? 'rotate-180' : ''}`} />
                        </button>
                        {openDay === idx && (
                            <div className="p-6 bg-white border-t border-gray-50 text-gray-600 leading-relaxed text-sm whitespace-pre-line animate-fadeIn">
                                {day.content}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TourDetailItinerary;