import React from "react";

const RevenueAnalytics = ({ children, selectedRange = 6, onRangeChange }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
            <div className="font-semibold text-gray-900">Revenue Analytics</div>
            <div className="relative">
                <select
                    value={selectedRange}
                    onChange={(e) => onRangeChange && onRangeChange(Number(e.target.value))}
                    className="appearance-none bg-gray-100 px-3 py-1.5 pr-8 rounded-lg text-sm text-gray-700 font-medium cursor-pointer border border-transparent outline-none hover:bg-gray-200 transition-colors"
                    style={{
                        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundSize: '1em 1em',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <option value={3}>Last 3 Months</option>
                    <option value={6}>Last 6 Months</option>
                    <option value={12}>Last 12 Months</option>
                </select>
            </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
            {children}
        </div>
    </div>
);

export default RevenueAnalytics;
