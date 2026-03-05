import React from "react";
import { ChevronDown, LineChart } from "lucide-react";


const RevenueAnalytics = ({ children }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
            <div className="font-semibold text-gray-900">Revenue Analytics</div>
            <button className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded text-sm text-gray-700 font-medium">
                Last 6 Months
                <ChevronDown className="w-4 h-4" />
            </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
            {children}
        </div>
    </div>
);

export default RevenueAnalytics;
