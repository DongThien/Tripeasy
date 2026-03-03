import React from "react";


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
                        <th className="py-2 px-3 text-left">Booking ID</th>
                        <th className="py-2 px-3 text-left">Customer Name</th>
                        <th className="py-2 px-3 text-left">Tour Destination</th>
                        <th className="py-2 px-3 text-left">Date</th>
                        <th className="py-2 px-3 text-right">Amount</th>
                        <th className="py-2 px-3 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((b) => (
                        <tr key={b.id || b.booking_id} className="border-t last:border-b">
                            <td className="py-2 px-3">{b.id || b.booking_id}</td>
                            <td className="py-2 px-3 flex items-center gap-2">
                                <img src={b.customer?.avatar || b.avatar} alt={b.customer?.name || b.customer_name} className="w-7 h-7 rounded-full object-cover" />
                                <span className="font-medium text-gray-900">{b.customer?.name || b.customer_name}</span>
                            </td>
                            <td className="py-2 px-3">{b.tour || b.tour_name}</td>
                            <td className="py-2 px-3">{b.date || b.created_at?.slice(0, 10)}</td>
                            <td className="py-2 px-3 text-right font-bold text-gray-900">{formatVND(b.amount || b.total_price)}</td>
                            <td className="py-2 px-3 text-center">
                                {b.status === "Paid" || b.status === "PAID" ? (
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Paid</span>
                                ) : (
                                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">{b.status}</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default RecentBookingsTable;
