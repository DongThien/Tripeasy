import React from 'react';
import { Map, Plus, Trash2 } from 'lucide-react';

const TourItinerarySection = ({
    itinerary,
    addItineraryDay,
    removeItineraryDay,
    updateItinerary
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                        <Map className="w-5 h-5 text-[#8B1A1A]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Lịch trình</h3>
                </div>
                <button
                    type="button"
                    onClick={addItineraryDay}
                    className="flex items-center gap-2 px-4 py-2 text-[#8B1A1A] hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span className="font-medium">Thêm ngày</span>
                </button>
            </div>

            <div className="space-y-4">
                {itinerary.map((day, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <span className="bg-[#8B1A1A] text-white px-3 py-1 rounded-full text-sm font-medium">
                                Ngày {day.day}
                            </span>
                            {itinerary.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeItineraryDay(index)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Tiêu đề ngày (VD: Đón khách - Tham quan Sơn Trà)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent outline-none"
                                value={day.title}
                                onChange={(e) => updateItinerary(index, 'title', e.target.value)}
                            />
                            <textarea
                                rows={4}
                                placeholder="Chi tiết các hoạt động trong ngày..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent outline-none resize-none"
                                value={day.content}
                                onChange={(e) => updateItinerary(index, 'content', e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TourItinerarySection;