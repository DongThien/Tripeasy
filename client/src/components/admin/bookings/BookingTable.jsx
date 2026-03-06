import React from 'react';
import { Eye, CheckCircle } from 'lucide-react';
import { formatVND } from '../../../utils/formatHelper';

// ── Badge helpers ──────────────────────────────────────────
const STATUS_MAP = {
    'Đã xác nhận': 'bg-green-100 text-green-700',
    'Chờ xử lý': 'bg-orange-100 text-orange-600',
    'Đã hủy': 'bg-gray-100 text-gray-500',
};

const PAYMENT_MAP = {
    'Đã thanh toán': 'bg-blue-100 text-blue-700',
    'Chưa thanh toán': 'bg-red-100 text-red-600',
};

const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${STATUS_MAP[status] ?? 'bg-gray-100 text-gray-500'}`}>
        {status}
    </span>
);

const PaymentBadge = ({ payment }) => (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${PAYMENT_MAP[payment] ?? 'bg-gray-100 text-gray-500'}`}>
        {payment}
    </span>
);

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// ── Mock data ──────────────────────────────────────────────
const MOCK_BOOKINGS = [
    {
        booking_id: 8429,
        tour_name: 'Hà Nội – Lào Cai – Sa Pa',
        customer_name: 'Nguyễn Văn An',
        customer_phone: '0912 345 678',
        booked_at: '2026-03-01',
        total_price: 3450000,
        status: 'Đã xác nhận',
        payment: 'Đã thanh toán',
    },
    {
        booking_id: 8430,
        tour_name: 'Hà Nội – Ninh Bình – Hạ Long – Yên Tử',
        customer_name: 'Trần Thị Bình',
        customer_phone: '0987 654 321',
        booked_at: '2026-03-02',
        total_price: 5200000,
        status: 'Chờ xử lý',
        payment: 'Chưa thanh toán',
    },
    {
        booking_id: 8431,
        tour_name: 'Sapa – Tà Xùa',
        customer_name: 'Lê Minh Tuấn',
        customer_phone: '0903 111 222',
        booked_at: '2026-03-03',
        total_price: 2800000,
        status: 'Đã hủy',
        payment: 'Chưa thanh toán',
    },
    {
        booking_id: 8432,
        tour_name: 'Mai Châu – Hòa Bình',
        customer_name: 'Phạm Thu Hương',
        customer_phone: '0978 333 444',
        booked_at: '2026-03-04',
        total_price: 1900000,
        status: 'Chờ xử lý',
        payment: 'Chưa thanh toán',
    },
    {
        booking_id: 8433,
        tour_name: 'Tam Đảo – Vĩnh Phúc',
        customer_name: 'Hoàng Đức Long',
        customer_phone: '0965 777 888',
        booked_at: '2026-03-05',
        total_price: 1200000,
        status: 'Đã xác nhận',
        payment: 'Đã thanh toán',
    },
];

// ── Component ──────────────────────────────────────────────
const BookingTable = ({ bookings = [], isLoading = false, onView, onConfirm }) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center text-gray-400">
                <div className="animate-pulse text-sm">Đang tải dữ liệu...</div>
            </div>
        );
    }
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="min-w-full table-fixed text-sm">
                <thead>
                    <tr className="bg-red-50 text-[#8B1A1A] uppercase text-xs">
                        <th className="py-3 px-3 text-left w-[10%] whitespace-nowrap">Mã Booking</th>
                        <th className="py-3 px-3 text-left w-[25%] whitespace-nowrap">Tour</th>
                        <th className="py-3 px-3 text-left w-[15%] whitespace-nowrap">Khách hàng</th>
                        <th className="py-3 px-3 text-left w-[10%] whitespace-nowrap">Ngày đặt</th>
                        <th className="py-3 px-3 text-right w-[12%] whitespace-nowrap">Tổng tiền</th>
                        <th className="py-3 px-3 text-center w-[10%] whitespace-nowrap">Trạng thái</th>
                        <th className="py-3 px-3 text-center w-[10%] whitespace-nowrap">Thanh toán</th>
                        <th className="py-3 px-3 text-center w-[8%] whitespace-nowrap">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="text-center py-10 text-gray-400">
                                Không có đơn đặt chỗ nào.
                            </td>
                        </tr>
                    ) : (
                        bookings.map((bk) => (
                            <tr key={bk.booking_id} className="border-t last:border-b hover:bg-gray-50 transition-colors">
                                {/* Mã Booking */}
                                <td className="py-3 px-3">
                                    <span className="font-bold text-[#8B1A1A] whitespace-nowrap">
                                        #BK-{bk.booking_id}
                                    </span>
                                </td>

                                {/* Tour */}
                                <td className="py-3 px-3">
                                    <p className="line-clamp-2 text-gray-800">{bk.tour_name}</p>
                                </td>

                                {/* Khách hàng */}
                                <td className="py-3 px-3">
                                    <p className="font-semibold text-gray-900 truncate">{bk.customer_name}</p>
                                    <p className="text-xs text-gray-400 truncate">{bk.customer_phone}</p>
                                </td>

                                {/* Ngày đặt */}
                                <td className="py-3 px-3 text-gray-700 whitespace-nowrap">
                                    {formatDate(bk.booked_at)}
                                </td>

                                {/* Tổng tiền */}
                                <td className="py-3 px-3 text-right font-bold text-gray-900 whitespace-nowrap">
                                    {formatVND(bk.total_price)}
                                </td>

                                {/* Trạng thái */}
                                <td className="py-3 px-3 text-center">
                                    <StatusBadge status={bk.status} />
                                </td>

                                {/* Thanh toán */}
                                <td className="py-3 px-3 text-center">
                                    <PaymentBadge payment={bk.payment} />
                                </td>

                                {/* Thao tác */}
                                <td className="py-3 px-3 text-center">
                                    <div className="flex items-center justify-center gap-3">
                                        {bk.status === 'Chờ xử lý' && (
                                            <CheckCircle
                                                className="w-4 h-4 text-green-500 cursor-pointer hover:scale-110 transition"
                                                title="Xác nhận đặt chỗ"
                                                onClick={() => onConfirm?.(bk)}
                                            />
                                        )}
                                        <Eye
                                            className="w-4 h-4 text-blue-500 cursor-pointer hover:scale-110 transition"
                                            title="Xem chi tiết"
                                            onClick={() => onView?.(bk)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BookingTable;
