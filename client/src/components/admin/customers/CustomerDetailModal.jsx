import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Mail, Phone, Calendar, Shield, BadgeCheck, Loader2, DollarSign, Briefcase } from 'lucide-react';
import bookingService from '../../../services/bookingService';
import { formatVND } from '../../../utils/formatHelper';

const CustomerDetailModal = ({ customer, onClose }) => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!customer?.id) return;
        const fetchUserBookings = async () => {
            setIsLoading(true);
            try {
                const res = await bookingService.getUserBookings(customer.id);
                if (res.success) {
                    setBookings(res.data || []);
                }
            } catch (err) {
                console.error('Error fetching user bookings:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserBookings();
    }, [customer?.id]);

    if (!customer || !mounted) return null;

    // Booking calculations
    const totalBookings = bookings.length;
    const completedBookings = bookings.filter(b => b.booking_status === 'COMPLETED').length;
    const cancelledBookings = bookings.filter(b => b.booking_status === 'CANCELLED').length;
    const activeBookings = totalBookings - cancelledBookings;

    // Status helpers
    const getBookingStatusBadge = (status) => {
        const maps = {
            'COMPLETED': 'bg-green-100 text-green-700',
            'CONFIRMED': 'bg-blue-100 text-blue-700',
            'PENDING': 'bg-orange-100 text-orange-600',
            'CANCELLED': 'bg-gray-100 text-gray-500',
        };
        const labelMaps = {
            'COMPLETED': 'Đã hoàn thành',
            'CONFIRMED': 'Đã xác nhận',
            'PENDING': 'Chờ xử lý',
            'CANCELLED': 'Đã hủy',
        };
        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${maps[status] || 'bg-gray-100 text-gray-500'}`}>
                {labelMaps[status] || status}
            </span>
        );
    };

    const getPaymentStatusBadge = (status) => {
        const maps = {
            'PAID': 'bg-emerald-100 text-emerald-700',
            'PENDING': 'bg-red-100 text-red-600',
            'UNPAID': 'bg-red-100 text-red-600',
        };
        const labelMaps = {
            'PAID': 'Đã thanh toán',
            'PENDING': 'Chưa thanh toán',
            'UNPAID': 'Chưa thanh toán',
        };
        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${maps[status] || 'bg-gray-100 text-gray-500'}`}>
                {labelMaps[status] || status}
            </span>
        );
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        if (isNaN(d)) return dateStr;
        return d.toLocaleDateString('vi-VN');
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] w-screen h-screen bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="bg-[#8B1A1A] px-6 py-4 flex items-center justify-between text-white flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Chi tiết khách hàng</h3>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-1.5 rounded-full hover:bg-white/10 transition text-white/80 hover:text-white"
                        title="Đóng"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Body */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-gray-700">
                    
                    {/* Customer Info Card */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                        <img
                            src={customer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=8B1A1A&color=ffffff&size=100`}
                            alt={customer.name}
                            className="w-24 h-24 rounded-full object-cover shadow-sm border-2 border-white flex-shrink-0"
                        />
                        <div className="flex-1 space-y-3 min-w-0 text-center md:text-left">
                            <div>
                                <h4 className="text-xl font-bold text-gray-800 truncate">{customer.name}</h4>
                                <p className="text-xs text-gray-400 mt-0.5">Mã tài khoản: #{customer.id}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 text-left">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="truncate">{customer.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span>{customer.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span>Ngày đăng ký: {customer.registeredAt}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="capitalize">Vai trò: {customer.role}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1.5">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${customer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                    {customer.status === 'active' ? 'HOẠT ĐỘNG' : 'BỊ KHÓA'}
                                </span>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1`}>
                                    <BadgeCheck className="w-3.5 h-3.5" />
                                    HẠNG {customer.tier.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white border border-gray-150 p-4 rounded-2xl text-center shadow-sm">
                            <span className="text-gray-400 text-xs font-semibold block uppercase">Tổng Đơn Đặt</span>
                            <span className="text-2xl font-bold text-gray-800 mt-1 block">{totalBookings}</span>
                        </div>
                        <div className="bg-white border border-gray-150 p-4 rounded-2xl text-center shadow-sm">
                            <span className="text-gray-400 text-xs font-semibold block uppercase">Đơn Hiệu Lực</span>
                            <span className="text-2xl font-bold text-blue-600 mt-1 block">{activeBookings}</span>
                        </div>
                        <div className="bg-white border border-gray-150 p-4 rounded-2xl text-center shadow-sm">
                            <span className="text-gray-400 text-xs font-semibold block uppercase">Đã Hoàn Thành</span>
                            <span className="text-2xl font-bold text-green-600 mt-1 block">{completedBookings}</span>
                        </div>
                        <div className="bg-white border border-gray-150 p-4 rounded-2xl text-center shadow-sm">
                            <span className="text-gray-400 text-xs font-semibold block uppercase font-sans">Tổng Chi Tiêu</span>
                            <span className="text-lg font-bold text-[#8B1A1A] mt-1.5 block truncate" title={customer.totalSpent}>
                                {customer.totalSpent}
                            </span>
                        </div>
                    </div>

                    {/* Bookings List Section */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2 border-b border-gray-100 pb-2">
                            <Briefcase className="w-4.5 h-4.5 text-gray-500" />
                            Lịch sử đặt tour ({totalBookings} đơn)
                        </h4>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <Loader2 className="w-8 h-8 animate-spin text-[#8B1A1A] mb-2" />
                                <span className="text-xs">Đang tải lịch sử đặt tour...</span>
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                                Khách hàng chưa thực hiện đơn đặt tour nào trên hệ thống.
                            </div>
                        ) : (
                            <div className="border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="min-w-[650px] w-full text-xs text-left">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-600 uppercase text-[10px] font-bold border-b border-gray-150">
                                                <th className="py-2.5 px-3 w-[12%]">Mã Đơn</th>
                                                <th className="py-2.5 px-3 w-[38%]">Tên Tour</th>
                                                <th className="py-2.5 px-3 w-[15%]">Khởi hành</th>
                                                <th className="py-2.5 px-3 text-right w-[15%]">Tổng tiền</th>
                                                <th className="py-2.5 px-3 text-center w-[10%]">Trạng thái</th>
                                                <th className="py-2.5 px-3 text-center w-[10%]">Thanh toán</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 bg-white">
                                            {bookings.map((b) => (
                                                <tr key={b.booking_id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-3 px-3 font-bold text-[#8B1A1A]">
                                                        #BK-{b.booking_id}
                                                    </td>
                                                    <td className="py-3 px-3">
                                                        <p className="line-clamp-2 text-gray-800 font-medium">{b.tour_title || b.title}</p>
                                                        <p className="text-[10px] text-gray-400 mt-0.5">Số khách: {b.quantity || (b.num_adults + b.num_children)} khách</p>
                                                    </td>
                                                    <td className="py-3 px-3 text-gray-600">
                                                        {formatDate(b.start_date)}
                                                    </td>
                                                    <td className="py-3 px-3 text-right font-bold text-gray-900 whitespace-nowrap">
                                                        {formatVND(b.total_price)}
                                                    </td>
                                                    <td className="py-3 px-3 text-center">
                                                        {getBookingStatusBadge(b.booking_status)}
                                                    </td>
                                                    <td className="py-3 px-3 text-center">
                                                        {getPaymentStatusBadge(b.payment_status)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl transition"
                    >
                        Đóng lại
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
};

export default CustomerDetailModal;
