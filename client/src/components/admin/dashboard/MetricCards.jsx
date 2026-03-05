import React from "react";
import { DollarSign, MapPin, ShoppingCart, Users, ArrowUpRight } from "lucide-react";


const MetricCards = ({ stats, formatVND }) => {
    const metrics = [
        {
            label: "Total Revenue",
            value: formatVND(stats.totalRevenue),
            icon: <DollarSign className="w-6 h-6 text-green-600" />, iconBg: "bg-green-100",
            trend: "", trendColor: "text-green-500",
        },
        {
            label: "Total Tours",
            value: stats.totalTours,
            icon: <MapPin className="w-6 h-6 text-blue-600" />, iconBg: "bg-blue-100",
            trend: "", trendColor: "text-blue-500",
        },
        {
            label: "New Bookings",
            value: stats.newBookings,
            icon: <ShoppingCart className="w-6 h-6 text-orange-500" />, iconBg: "bg-orange-100",
            trend: "", trendColor: "text-orange-500",
        },
        {
            label: "Total Users",
            value: stats.totalUsers,
            icon: <Users className="w-6 h-6 text-purple-600" />, iconBg: "bg-purple-100",
            trend: "", trendColor: "text-purple-500",
        },
    ];
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((m) => (
                <div key={m.label} className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-2">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full ${m.iconBg} mb-2`}>{m.icon}</div>
                    <div className="text-xs text-gray-500 font-medium">{m.label}</div>
                    <div className="text-2xl font-bold text-gray-900">{m.value}</div>
                </div>
            ))}
        </div>
    );
};

export default MetricCards;
