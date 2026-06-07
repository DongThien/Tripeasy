import React from "react";

const RevenueAnalytics = ({ children, startDate, endDate, onDateChange }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="font-semibold text-gray-900">Revenue Analytics</div>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-gray-400 font-medium">Từ</span>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => onDateChange && onDateChange(e.target.value, endDate)}
                        className="bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg text-xs font-semibold text-gray-700 outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] transition-colors"
                    />
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-gray-400 font-medium">Đến</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => onDateChange && onDateChange(startDate, e.target.value)}
                        className="bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg text-xs font-semibold text-gray-700 outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] transition-colors"
                    />
                </div>
            </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
            {children}
        </div>
    </div>
);

export default RevenueAnalytics;
