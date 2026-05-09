import React, { useState } from 'react';
import { Sparkles, Map, ShieldCheck, Star, CheckCircle2 } from 'lucide-react';
import TourDetailHighlights from './TourDetailHighlights';
import TourDetailItinerary from './TourDetailItinerary';
import TourDetailServices from './TourDetailServices';
import TourDetailReviews from './TourDetailReviews';

const TourDetailTabs = ({ tour }) => {
    const [activeTab, setActiveTab] = useState('highlights');

    // Hàm helper an toàn: Chuyển đổi dữ liệu từ DB (chuỗi hoặc mảng) thành Mảng chuẩn
    const ensureArray = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (typeof data === 'string') {
            try { return JSON.parse(data); } catch { return [data]; }
        }
        return [];
    };

    const tabs = [
        { id: 'highlights', label: 'Điểm nhấn', icon: Sparkles },
        { id: 'itinerary', label: 'Chương trình', icon: Map },
        { id: 'services', label: 'Dịch vụ', icon: CheckCircle2 },
        { id: 'policies', label: 'Chính sách', icon: ShieldCheck },
        { id: 'reviews', label: 'Đánh giá', icon: Star }
    ];

    const PolicyList = ({ title, items, isRed = false }) => {
        const validItems = ensureArray(items);
        if (validItems.length === 0) return null;

        return (
            <div className="mb-6 last:mb-0">
                <h4 className={`font-bold mb-3 ${isRed ? 'text-[#8B1A1A]' : 'text-gray-900'}`}>{title}</h4>
                <ul className="space-y-2">
                    {validItems.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${isRed ? 'bg-[#8B1A1A]' : 'bg-gray-400'}`} />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex overflow-x-auto border-b border-gray-100 no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${activeTab === tab.id
                                ? 'text-[#8B1A1A] border-[#8B1A1A] bg-red-50/30'
                                : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#8B1A1A]' : 'text-gray-400'}`} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="p-6 md:p-8">
                {activeTab === 'highlights' && (
                    <TourDetailHighlights highlights={ensureArray(tour.highlights)} />
                )}

                {activeTab === 'itinerary' && (
                    <TourDetailItinerary itinerary={ensureArray(tour.itinerary)} />
                )}

                {activeTab === 'services' && (
                    <TourDetailServices included={ensureArray(tour.included)} excluded={ensureArray(tour.excluded)} />
                )}

                {activeTab === 'policies' && (
                    <div className="animate-fadeIn">
                        <PolicyList title="CHÍNH SÁCH TRẺ EM" items={tour.policy_child} />
                        <div className="h-px bg-gray-100 my-6" />
                        <PolicyList title="QUY ĐỊNH HOÀN HỦY" items={tour.policy_cancel} isRed={true} />
                        <div className="h-px bg-gray-100 my-6" />
                        <PolicyList title="LƯU Ý QUAN TRỌNG" items={tour.policy_other} />
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <TourDetailReviews tourId={tour.tour_id} />
                )}
            </div>
        </div>
    );
};

export default TourDetailTabs;