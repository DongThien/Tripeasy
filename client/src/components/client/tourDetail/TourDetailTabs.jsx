import React from 'react';

const TourDetailTabs = ({ activeTab, onTabChange }) => (
    <div className="sticky top-20 z-20 rounded-xl border border-gray-200 bg-white px-4 shadow-sm">
        <div className="flex items-center gap-6 overflow-x-auto py-3 text-sm font-medium whitespace-nowrap">
            {['Tổng quan', 'Lịch trình', 'Dịch vụ', 'Đánh giá'].map((tab) => (
                <button
                    key={tab}
                    type="button"
                    onClick={() => onTabChange(tab)}
                    className={`border-b-2 pb-2 transition ${activeTab === tab
                        ? 'border-[#8B1A1A] text-[#8B1A1A]'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    </div>
);

export default TourDetailTabs;