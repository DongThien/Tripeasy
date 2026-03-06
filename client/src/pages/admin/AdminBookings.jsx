import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Table2, Sheet, Printer, CalendarCheck, Clock, TrendingUp, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import BookingTable from '../../components/admin/bookings/BookingTable';
import bookingService from '../../services/bookingService';

const EXPORT_BUTTONS = [
    { icon: <FileText size={15} />, label: 'PDF' },
    { icon: <Table2 size={15} />, label: 'CSV' },
    { icon: <Sheet size={15} />, label: 'Excel' },
    { icon: <Printer size={15} />, label: 'In' },
];

const formatRevenue = (amount) => {
    if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)}B đ`;
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M đ`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K đ`;
    return `${amount}đ`;
};

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, monthly_revenue: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [bookingsRes, statsRes] = await Promise.all([
                    bookingService.getAllBookings(),
                    bookingService.getBookingStats(),
                ]);
                if (bookingsRes.success) setBookings(bookingsRes.data);
                if (statsRes.success) setStats(statsRes.data);
            } catch {
                toast.error('Không thể tải dữ liệu đặt chỗ');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const filtered = useMemo(() => {
        return bookings.filter((bk) => {
            const matchSearch =
                !search ||
                bk.tour_name?.toLowerCase().includes(search.toLowerCase()) ||
                bk.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
                bk.customer_phone?.includes(search);
            const matchBooking = bookingStatusFilter === 'all' || bk.booking_status === bookingStatusFilter;
            const matchPayment = paymentStatusFilter === 'all' || bk.payment_status === paymentStatusFilter;
            return matchSearch && matchBooking && matchPayment;
        });
    }, [bookings, search, bookingStatusFilter, paymentStatusFilter]);

    const handleConfirm = async (bk) => {
        try {
            const res = await bookingService.updateBookingStatus(bk.booking_id, {
                booking_status: 'CONFIRMED',
                payment_status: bk.payment_status,
            });
            if (res.success) {
                setBookings((prev) =>
                    prev.map((b) =>
                        b.booking_id === bk.booking_id
                            ? { ...b, status: 'Đã xác nhận', booking_status: 'CONFIRMED' }
                            : b
                    )
                );
                setStats((prev) => ({ ...prev, pending: Math.max(0, prev.pending - 1) }));
                toast.success('Đã xác nhận đơn đặt chỗ');
            }
        } catch {
            toast.error('Không thể xác nhận đơn');
        }
    };

    const handleView = (bk) => console.log('Xem chi tiết booking:', bk);

    const STAT_CARDS = [
        {
            icon: <CalendarCheck size={22} />,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            label: 'Tổng Booking',
            value: stats.total.toLocaleString('vi-VN'),
        },
        {
            icon: <Clock size={22} />,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-500',
            label: 'Đang chờ xử lý',
            value: stats.pending.toString(),
        },
        {
            icon: <TrendingUp size={22} />,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            label: 'Doanh thu tháng',
            value: formatRevenue(stats.monthly_revenue),
        },
    ];

    return (
        <div>
            {/* Top Section */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#8B1A1A]">Quản lý Đặt chỗ</h1>
                    <p className="text-sm text-gray-500 mt-1">Theo dõi và quản lý danh sách đặt tour của hệ thống</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {EXPORT_BUTTONS.map(({ icon, label }) => (
                        <button
                            key={label}
                            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            {icon}
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {STAT_CARDS.map(({ icon, iconBg, iconColor, label, value }) => (
                    <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor}`}>
                            {icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{label}</p>
                            <p className="text-xl font-bold text-gray-800 mt-0.5">
                                {isLoading ? '...' : value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[220px]">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm tour, tên khách, SĐT..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40"
                        />
                    </div>
                    <select
                        value={bookingStatusFilter}
                        onChange={(e) => setBookingStatusFilter(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 bg-white"
                    >
                        <option value="all">Trạng thái booking</option>
                        <option value="PENDING">Chờ xử lý</option>
                        <option value="CONFIRMED">Đã xác nhận</option>
                        <option value="CANCELLED">Đã hủy</option>
                    </select>
                    <select
                        value={paymentStatusFilter}
                        onChange={(e) => setPaymentStatusFilter(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 bg-white"
                    >
                        <option value="all">Trạng thái thanh toán</option>
                        <option value="PAID">Đã thanh toán</option>
                        <option value="PENDING">Chưa thanh toán</option>
                    </select>
                </div>
            </div>

            <BookingTable
                bookings={filtered}
                isLoading={isLoading}
                onView={handleView}
                onConfirm={handleConfirm}
            />
        </div>
    );
};

export default AdminBookings;
