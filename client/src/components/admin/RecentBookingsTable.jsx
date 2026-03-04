import React from "react";



function formatDateVN(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function getStatusStyle(status) {
    switch ((status || "").toUpperCase()) {
        case "COMPLETED":
            return "bg-green-100 text-green-700";
        case "FAILED":
            return "bg-red-100 text-red-700";
        case "PENDING":
            return "bg-yellow-100 text-yellow-700";
        default:
            return "bg-gray-100 text-gray-500";
    }
}

const RecentBookingsTable = ({ bookings, formatVND }) => (
    <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
            <div className="font-semibold text-gray-900">Recent Bookings</div>
            <button className="bg-[#8B1A1A] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#a83232] transition">
                Download Report
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="text-xs text-gray-400 uppercase">
                        <th className="py-3 px-3 text-left">Booking ID</th>
                        <th className="py-3 px-3 text-left">Customer Name</th>
                        <th className="py-3 px-3 text-left">Tour Destination</th>
                        <th className="py-3 px-3 text-left">Date</th>
                        <th className="py-3 px-3 text-right">Amount</th>
                        <th className="py-3 px-3 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((b, idx) => (
                        <tr key={b.id || b.booking_id} className={"border-t last:border-b" + (idx % 2 === 1 ? " bg-gray-50" : "")}>
                            <td className="py-3 px-3 whitespace-nowrap">{b.id || b.booking_id}</td>
                            <td className="py-3 px-3 flex items-center gap-2 whitespace-nowrap">
                                <img src={b.customer?.avatar || b.avatar} alt={b.customer?.name || b.customer_name} className="w-7 h-7 rounded-full object-cover" />
                                <span className="font-medium text-gray-900">{b.customer?.name || b.customer_name}</span>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">{b.tour || b.tour_name}</td>
                            <td className="py-3 px-3 whitespace-nowrap">{formatDateVN(b.date || b.created_at)}</td>
                            <td className="py-3 px-3 text-right font-bold text-gray-900 whitespace-nowrap">{formatVND(b.amount || b.total_price)}</td>
                            <td className="py-3 px-3 text-center whitespace-nowrap">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(b.status)}`}>{(b.status || "").charAt(0).toUpperCase() + (b.status || "").slice(1).toLowerCase()}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default RecentBookingsTable;
