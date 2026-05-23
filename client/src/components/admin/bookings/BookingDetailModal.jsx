import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Users, FileText, Landmark, ShieldCheck, Mail, Phone, MapPin, DollarSign, CheckCircle2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import bookingService from '../../../services/bookingService';
import { formatVND } from '../../../utils/formatHelper';

const BookingDetailModal = ({ booking, onClose, onUpdateBooking }) => {
    const [updating, setUpdating] = useState(false);

    if (!booking) return null;

    const handleStatusChange = async (newPaymentStatus, newBookingStatus) => {
        const confirmMsg = newBookingStatus === 'CANCELLED' 
            ? 'Bạn có chắc chắn muốn HỦY đơn đặt tour này? Chỗ trống sẽ được hoàn lại.' 
            : `Xác nhận chuyển trạng thái đơn hàng sang: ${newBookingStatus === 'COMPLETED' ? 'Hoàn thành' : 'Đã xác nhận'}?`;
        
        const confirmAction = window.confirm(confirmMsg);
        if (!confirmAction) return;

        try {
            setUpdating(true);
            const res = await bookingService.updateBookingStatus(booking.booking_id, {
                payment_status: newPaymentStatus,
                booking_status: newBookingStatus
            });
            if (res.success) {
                toast.success('Cập nhật trạng thái đặt tour thành công!');
                onUpdateBooking({
                    ...booking,
                    booking_status: newBookingStatus,
                    payment_status: newPaymentStatus,
                    status: newBookingStatus === 'COMPLETED' ? 'Đã hoàn thành' : (newBookingStatus === 'CONFIRMED' ? 'Đã xác nhận' : 'Đã hủy'),
                    payment: newPaymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'
                });
                onClose();
            } else {
                toast.error(res.message || 'Cập nhật thất bại.');
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
        } finally {
            setUpdating(false);
        }
    };

    const isPending = booking.booking_status === 'PENDING';
    const isCompleted = booking.booking_status === 'COMPLETED';
    const isCancelled = booking.booking_status === 'CANCELLED';

    const formattedBookedDate = new Date(booking.booked_at).toLocaleString('vi-VN');
    const formattedStartDate = new Date(booking.start_date).toLocaleDateString('vi-VN');

    return createPortal(
        <div className="fixed inset-0 z-[9999] w-screen h-screen bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-[#8B1A1A] px-6 py-4 flex items-center justify-between text-white flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Chi tiết Đơn đặt tour #BK-{booking.booking_id}</h3>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-full hover:bg-white/10 transition text-white/80 hover:text-white"
                        title="Đóng"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Body */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-gray-700">
                    {/* General Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Customer Information */}
                        <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 space-y-3">
                            <h4 className="font-bold text-[#8B1A1A] text-sm flex items-center gap-2 border-b border-gray-200 pb-2">
                                <Users className="w-4 h-4 text-gray-500" /> Thông tin khách hàng
                            </h4>
                            <div className="space-y-2">
                                <p className="flex items-center gap-2.5">
                                    <span className="font-semibold text-gray-800">{booking.customer_name}</span>
                                </p>
                                <p className="flex items-center gap-2.5 text-gray-600">
                                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span>{booking.customer_phone}</span>
                                </p>
                                <p className="flex items-center gap-2.5 text-gray-600">
                                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="truncate">{booking.customer_email}</span>
                                </p>
                            </div>
                        </div>

                        {/* Booking Overview */}
                        <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 space-y-3">
                            <h4 className="font-bold text-[#8B1A1A] text-sm flex items-center gap-2 border-b border-gray-200 pb-2">
                                <FileText className="w-4 h-4 text-gray-500" /> Tổng quan đơn đặt
                            </h4>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-400 font-medium">Thời gian đặt:</span>
                                    <span className="text-gray-800 font-semibold">{formattedBookedDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400 font-medium">Hình thức trả:</span>
                                    <span className="text-gray-800 font-bold bg-[#8B1A1A]/5 px-2 py-0.5 rounded text-[10px]">
                                        {booking.payment_method === 'OFFICE' ? 'Tại văn phòng' : 'Chuyển khoản VietQR'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tour details */}
                    <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 space-y-3">
                        <h4 className="font-bold text-[#8B1A1A] text-sm flex items-center gap-2 border-b border-gray-200 pb-2">
                            <Calendar className="w-4 h-4 text-gray-500" /> Chi tiết Tour du lịch
                        </h4>
                        <div className="space-y-2">
                            <p className="font-bold text-gray-900 text-base leading-snug">{booking.tour_name}</p>
                            <div className="grid grid-cols-2 gap-4 pt-1 text-sm">
                                <div>
                                    <span className="text-gray-400">Ngày khởi hành:</span>
                                    <p className="font-bold text-gray-800 mt-0.5">{formattedStartDate}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400">Số lượng khách:</span>
                                    <p className="font-bold text-gray-800 mt-0.5">
                                        {booking.num_adults} người lớn {booking.num_children > 0 ? `, ${booking.num_children} trẻ em` : ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Special requests if any */}
                    {booking.special_requests && (
                        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h5 className="font-bold text-orange-800 text-xs uppercase tracking-wider">Yêu cầu đặc biệt</h5>
                                <p className="text-sm text-orange-700 mt-1 leading-relaxed">{booking.special_requests}</p>
                            </div>
                        </div>
                    )}

                    {/* Price breakdown */}
                    <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-150 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-medium">Tổng hóa đơn:</span>
                            <span className="text-[#8B1A1A] font-extrabold text-xl">{formatVND(booking.total_price)}</span>
                        </div>
                        <div className="flex gap-3 pt-2 border-t border-gray-200 text-xs">
                            <div className="flex items-center gap-1.5">
                                <span className="text-gray-400">Đơn đặt:</span>
                                <span className={`px-2.5 py-0.5 rounded-full font-bold
                                    ${isCancelled ? 'bg-gray-100 text-gray-500' : isCompleted ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {booking.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-gray-400">Thanh toán:</span>
                                <span className={`px-2.5 py-0.5 rounded-full font-bold
                                    ${booking.payment_status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                    {booking.payment}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action buttons */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between gap-3 flex-shrink-0 flex-wrap">
                    <div>
                        {isPending && (
                            <button
                                onClick={() => handleStatusChange('PENDING', 'CANCELLED')}
                                disabled={updating}
                                className="bg-white border border-red-200 hover:bg-red-50 text-red-500 px-4 py-2.5 rounded-xl text-sm font-bold transition disabled:opacity-50"
                            >
                                Hủy đơn đặt
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 px-4 py-2.5 rounded-xl text-sm font-semibold transition"
                        >
                            Đóng
                        </button>
                        {isPending && (
                            <button
                                onClick={() => handleStatusChange('PAID', 'COMPLETED')}
                                disabled={updating}
                                className="bg-[#8B1A1A] hover:bg-[#6e1414] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-red-950/10 transition flex items-center gap-1.5 disabled:opacity-50"
                            >
                                <CheckCircle2 className="w-4 h-4" /> Xác nhận đã thanh toán
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailModal;
