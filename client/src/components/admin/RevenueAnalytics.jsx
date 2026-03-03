import React from "react";
import { ChevronDown, LineChart } from "lucide-react";

const RevenueAnalytics = () => (
    <div className="col-span-2 bg-white rounded-xl shadow-sm p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
            <div className="font-semibold text-gray-900">Revenue Analytics</div>
            <button className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded text-sm text-gray-700 font-medium">
                Last 6 Months
                <ChevronDown className="w-4 h-4" />
            </button>
        </div>
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl h-64">
            <div className="flex flex-col items-center gap-2">
                <LineChart className="w-10 h-10 text-gray-300" />
                <span className="text-gray-400 text-sm">Interactive Revenue Line Chart Placeholder</span>
            </div>
        </div>
    </div>
);

export default RevenueAnalytics;
