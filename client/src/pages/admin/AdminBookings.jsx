import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Table2, Sheet, Printer, CalendarCheck, Clock, TrendingUp, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import BookingTable from '../../components/admin/bookings/BookingTable';
import AdminPagination from '../../components/admin/common/AdminPagination';
import bookingService from '../../services/bookingService';
import BookingDetailModal from '../../components/admin/bookings/BookingDetailModal';

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
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

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

    useEffect(() => {
        setCurrentPage(1);
    }, [search, bookingStatusFilter, paymentStatusFilter]);

    const totalPages = Math.ceil(filtered.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pagedBookings = useMemo(() => {
        return filtered.slice(startIndex, endIndex);
    }, [filtered, startIndex, endIndex]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots.filter((v, i, a) => a.indexOf(v) === i && totalPages > 1);
    };

    const handleConfirm = async (bk) => {
        const confirmAction = window.confirm("Bạn có chắc chắn muốn xác nhận đã thanh toán cho đơn đặt tour này? Trạng thái sẽ chuyển sang Hoàn thành.");
        if (!confirmAction) return;

        try {
            const res = await bookingService.updateBookingStatus(bk.booking_id, {
                booking_status: 'COMPLETED',
                payment_status: 'PAID',
            });
            if (res.success) {
                setBookings((prev) =>
                    prev.map((b) =>
                        b.booking_id === bk.booking_id
                            ? { 
                                ...b, 
                                status: 'Đã hoàn thành', 
                                booking_status: 'COMPLETED',
                                payment: 'Đã thanh toán',
                                payment_status: 'PAID'
                              }
                            : b
                    )
                );
                setStats((prev) => ({ 
                    ...prev, 
                    pending: Math.max(0, prev.pending - 1),
                    monthly_revenue: prev.monthly_revenue + bk.total_price 
                }));
                toast.success('Xác nhận đã thanh toán thành công!');
            }
        } catch {
            toast.error('Không thể xác nhận thanh toán');
        }
    };

    const handleCancel = async (bk) => {
        const confirmCancel = window.confirm("Bạn có chắc chắn muốn HỦY đơn đặt tour này? Chỗ trống sẽ được hoàn trả lại hệ thống.");
        if (!confirmCancel) return;

        try {
            const res = await bookingService.updateBookingStatus(bk.booking_id, {
                booking_status: 'CANCELLED',
                payment_status: bk.payment_status,
            });
            if (res.success) {
                setBookings((prev) =>
                    prev.map((b) =>
                        b.booking_id === bk.booking_id
                            ? { ...b, status: 'Đã hủy', booking_status: 'CANCELLED' }
                            : b
                    )
                );
                if (bk.booking_status === 'PENDING') {
                    setStats((prev) => ({ ...prev, pending: Math.max(0, prev.pending - 1) }));
                }
                toast.success('Đã hủy đơn đặt chỗ thành công');
            }
        } catch {
            toast.error('Không thể hủy đơn');
        }
    };

    const handleView = (bk) => setSelectedBooking(bk);

    const handleExportCSV = () => {
        if (filtered.length === 0) {
            toast.error("Không có dữ liệu để xuất!");
            return;
        }

        const headers = [
            "Mã Đặt Chỗ",
            "Tên Khách Hàng",
            "Số Điện Thoại",
            "Email",
            "Tên Tour",
            "Ngày Khởi Hành",
            "Số Người Lớn",
            "Số Trẻ Em",
            "Tổng Tiền (VND)",
            "Phương Thức Thanh Toán",
            "Trạng Thái Booking",
            "Trạng Thái Thanh Toán",
            "Ngày Đặt"
        ];

        const rows = filtered.map(bk => [
            `#BK-${bk.booking_id}`,
            bk.customer_name || '',
            bk.customer_phone || '',
            bk.customer_email || '',
            bk.tour_name || '',
            new Date(bk.start_date).toLocaleDateString('vi-VN'),
            bk.num_adults,
            bk.num_children,
            bk.total_price,
            bk.payment_method === 'OFFICE' ? 'Tại văn phòng' : 'Chuyển khoản VietQR',
            bk.status || bk.booking_status,
            bk.payment || bk.payment_status,
            new Date(bk.booked_at).toLocaleString('vi-VN')
        ]);

        const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Tripeasy_Bookings_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Xuất file Excel thành công!");
    };


    const handlePrintList = (titlePrefix = "Báo Cáo") => {
        if (filtered.length === 0) {
            toast.error("Không có dữ liệu để in!");
            return;
        }

        const printWindow = window.open('', '_blank', 'width=1100,height=850');
        
        let rowsHtml = '';
        filtered.forEach((bk, index) => {
            rowsHtml += `
                <tr>
                    <td style="text-align: center;">${index + 1}</td>
                    <td style="font-weight: bold; color: #8B1A1A;">#BK-${bk.booking_id}</td>
                    <td>
                        <strong>${bk.customer_name || ''}</strong><br/>
                        <span style="font-size: 11px; color: #666;">${bk.customer_phone || ''}</span>
                    </td>
                    <td>${bk.tour_name || ''}</td>
                    <td style="text-align: center;">${new Date(bk.start_date).toLocaleDateString('vi-VN')}</td>
                    <td style="text-align: center;">${bk.num_adults} NL ${bk.num_children > 0 ? `, ${bk.num_children} TE` : ''}</td>
                    <td style="text-align: right; font-weight: bold; color: #8B1A1A;">${bk.total_price.toLocaleString('vi-VN')}đ</td>
                    <td style="text-align: center;">${bk.status || bk.booking_status}</td>
                    <td style="text-align: center;">${bk.payment || bk.payment_status}</td>
                </tr>
            `;
        });

        const printHtml = `
            <html>
            <head>
                <title>${titlePrefix} Đặt Tour Tripeasy</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 25px; color: #333; }
                    .header { border-bottom: 2px solid #8B1A1A; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
                    .logo { font-size: 24px; font-weight: 800; color: #8B1A1A; letter-spacing: 0.5px; }
                    .title { font-size: 20px; font-weight: bold; text-transform: uppercase; color: #111; margin-bottom: 5px; }
                    .meta-info { font-size: 12px; color: #666; }
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    th { background-color: #f7f7f7; border: 1px solid #ddd; padding: 10px; font-size: 12px; font-weight: bold; color: #444; }
                    td { border: 1px solid #ddd; padding: 10px; font-size: 12px; color: #333; }
                    tr:nth-child(even) { background-color: #fafafa; }
                    .footer { margin-top: 40px; text-align: right; font-size: 12px; color: #888; }
                    @media print {
                        body { padding: 10px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="no-print" style="text-align: right; margin-bottom: 15px;">
                    <button onclick="window.print()" style="background: #8B1A1A; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 13px;">In báo cáo (Print)</button>
                </div>
                <div class="header">
                    <div>
                        <div class="title">${titlePrefix} Đặt Tour Du Lịch</div>
                        <div class="meta-info">Số lượng đơn hàng: <strong>${filtered.length}</strong> &nbsp;|&nbsp; Ngày lập báo cáo: <strong>${new Date().toLocaleDateString('vi-VN')}</strong></div>
                    </div>
                    <div class="logo">TRIPEASY</div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 40px;">STT</th>
                            <th style="width: 80px;">Mã Đơn</th>
                            <th>Khách Hàng</th>
                            <th>Tour Du Lịch</th>
                            <th style="width: 90px;">Khởi Hành</th>
                            <th style="width: 100px;">Khách</th>
                            <th style="width: 110px; text-align: right;">Tổng Tiền</th>
                            <th style="width: 100px;">Trạng Thái</th>
                            <th style="width: 105px;">Thanh Toán</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
                <div class="footer">
                    Người lập báo cáo: Ban Quản trị Tripeasy
                </div>
                <script>
                    window.onload = () => {
                        setTimeout(() => { window.print(); }, 300);
                    };
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(printHtml);
        printWindow.document.close();
    };

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
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors shadow-sm hover:text-[#8B1A1A]"
                    >
                        <Sheet size={15} />
                        Excel
                    </button>
                    <button
                        onClick={() => handlePrintList("Báo Cáo")}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors shadow-sm hover:text-[#8B1A1A]"
                    >
                        <Printer size={15} />
                        In
                    </button>
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
                bookings={pagedBookings}
                isLoading={isLoading}
                onView={handleView}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />

            <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                startIndex={startIndex}
                endIndex={endIndex}
                filteredLength={filtered.length}
                onPageChange={handlePageChange}
                getVisiblePages={getVisiblePages}
                itemLabel="đơn"
                className="mt-5"
            />

            {selectedBooking && (
                <BookingDetailModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    onUpdateBooking={(updated) => {
                        setBookings((prev) =>
                            prev.map((b) => (b.booking_id === updated.booking_id ? updated : b))
                        );
                    }}
                />
            )}
        </div>
    );
};

export default AdminBookings;
