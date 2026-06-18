import React, { useState, useEffect } from 'react';
import { Calendar, Users, FileText, Landmark, Clock, CheckCircle, XCircle, ArrowLeft, Loader2, RefreshCw, Star, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import reviewService from '../../services/reviewService';
import ClientNavbar from '../../components/common/ClientNavbar';
import ClientFooter from '../../components/common/ClientFooter';
import { formatVND } from '../../utils/formatHelper';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/common/ConfirmModal';

const STATUS_BADGE = {
    'Chờ xử lý': 'bg-orange-50 text-orange-600 border border-orange-150',
    'Đã xác nhận': 'bg-blue-50 text-blue-600 border border-blue-150',
    'Đã hoàn thành': 'bg-green-50 text-green-600 border border-green-150',
    'Đã hủy': 'bg-gray-50 text-gray-500 border border-gray-150'
};

const PAYMENT_BADGE = {
    'Đã thanh toán': 'bg-green-50 text-green-700 border border-green-150',
    'Chưa thanh toán': 'bg-red-50 text-red-600 border border-red-150'
};

const MyBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [activeQRBookingId, setActiveQRBookingId] = useState(null);
    const [zoomQRUrl, setZoomQRUrl] = useState('');
    
    // Custom Confirm Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null
    });

    // Tab and reviews states
    const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'reviews'
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    const fetchReviews = async () => {
        try {
            setLoadingReviews(true);
            const res = await reviewService.getMyReviews();
            if (res.success) {
                setReviews(res.data);
            } else {
                toast.error("Không thể tải danh sách đánh giá");
            }
        } catch (err) {
            console.error(err);
            toast.error("Đã xảy ra lỗi khi tải đánh giá của bạn");
        } finally {
            setLoadingReviews(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'reviews' && reviews.length === 0) {
            fetchReviews();
        }
    }, [activeTab]);

    // Current user session
    const [user] = useState(() => {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    });

    const fetchBookings = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const res = await bookingService.getUserBookings(user.user_id || user.id);
            if (res.success) {
                setBookings(res.data);
            } else {
                toast.error("Không thể tải danh sách đặt tour");
            }
        } catch (err) {
            console.error(err);
            toast.error("Đã xảy ra lỗi khi tải lịch sử đặt chỗ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        const token = localStorage.getItem('token');
        if (!token || !user) {
            toast.error("Vui lòng đăng nhập để xem lịch sử đặt tour!");
            navigate('/login?redirect=/client/my-bookings');
            return;
        }

        fetchBookings();
    }, [navigate]);

    const triggerCancelConfirm = (bookingId) => {
        setConfirmModal({
            isOpen: true,
            title: 'Xác nhận hủy đặt tour',
            message: 'Bạn có chắc chắn muốn hủy đơn đặt tour này? Hành động này sẽ giải phóng chỗ trống trên chuyến đi.',
            onConfirm: () => {
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                executeCancelBooking(bookingId);
            }
        });
    };

    const executeCancelBooking = async (bookingId) => {
        try {
            setCancellingId(bookingId);
            const res = await bookingService.cancelUserBooking(bookingId);
            if (res.success) {
                toast.success("Hủy đơn đặt tour thành công!");
                // Reload list
                fetchBookings();
            } else {
                toast.error(res.message || "Hủy đơn không thành công");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Lỗi hệ thống khi hủy đơn");
        } finally {
            setCancellingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-[#8B1A1A]" />
                    <p className="text-gray-500 font-semibold text-sm">Đang tải lịch sử đặt tour của bạn...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] pt-24">
            <ClientNavbar />
            
            <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tài Khoản Của Tôi</h1>
                        <p className="text-sm text-gray-500 mt-1">Quản lý lịch sử đặt tour và đánh giá của bạn trên Tripeasy</p>
                    </div>
                    <button 
                        onClick={activeTab === 'bookings' ? fetchBookings : fetchReviews}
                        className="flex items-center justify-center gap-2 self-start md:self-auto bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition active:scale-[0.98]"
                    >
                        <RefreshCw className="w-4 h-4" /> Tải lại danh sách
                    </button>
                </div>

                {/* Tab buttons layout */}
                <div className="flex gap-6 border-b border-gray-200 mb-8">
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`pb-3 text-base font-bold transition-all border-b-2 ${activeTab === 'bookings' ? 'border-[#8B1A1A] text-[#8B1A1A]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                    >
                        Lịch sử đặt tour ({bookings.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`pb-3 text-base font-bold transition-all border-b-2 ${activeTab === 'reviews' ? 'border-[#8B1A1A] text-[#8B1A1A]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                    >
                        Đánh giá của tôi ({reviews.length})
                    </button>
                </div>

                {activeTab === 'bookings' ? (
                    bookings.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-150 max-w-lg mx-auto mt-10">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-800">Bạn chưa đặt tour du lịch nào</h3>
                            <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                                Hãy lên kế hoạch khám phá thế giới ngay hôm nay với hàng ngàn tour du lịch giá cực ưu đãi từ Tripeasy!
                            </p>
                            <Link 
                                to="/client/tours" 
                                className="inline-block bg-[#8B1A1A] text-white px-8 py-3.5 rounded-xl font-bold mt-6 hover:bg-[#6e1414] transition shadow-lg shadow-red-950/10"
                            >
                                Khám phá danh sách Tour
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {bookings.map((booking) => {
                                const isPending = booking.booking_status === 'PENDING';
                                const isCancelled = booking.booking_status === 'CANCELLED';
                                const formattedStartDate = new Date(booking.start_date).toLocaleDateString('vi-VN');
                                
                                return (
                                    <article 
                                        key={booking.booking_id}
                                        className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden"
                                    >
                                        {/* Sidebar Status Highlight */}
                                        <div className={`absolute left-0 inset-y-0 w-1.5 ${isCancelled ? 'bg-gray-300' : isPending ? 'bg-orange-400' : 'bg-green-500'}`} />

                                        {/* Tour Image */}
                                        <Link 
                                            to={`/client/tours/${booking.tour_id}`}
                                            className="w-full md:w-44 h-28 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 block hover:opacity-90 transition-opacity"
                                        >
                                            {booking.image ? (
                                                <img 
                                                    src={booking.image} 
                                                    alt={booking.tour_name} 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[#8B1A1A] bg-[#8B1A1A]/5 font-bold text-lg">
                                                    Tripeasy
                                                </div>
                                            )}
                                        </Link>

                                        {/* Information breakdown */}
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                                <div>
                                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mã đặt chỗ: #BK-{booking.booking_id}</span>
                                                    <h3 className="font-extrabold text-gray-800 text-lg leading-snug hover:text-[#8B1A1A] transition mt-0.5">
                                                        <Link to={`/client/tours/${booking.tour_id}`} className="hover:underline">
                                                            {booking.tour_name}
                                                        </Link>
                                                    </h3>
                                                </div>
                                                
                                                {/* Badges container */}
                                                <div className="flex gap-2">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${STATUS_BADGE[booking.status] ?? 'bg-gray-100 text-gray-500'}`}>
                                                        {booking.status}
                                                    </span>
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${PAYMENT_BADGE[booking.payment] ?? 'bg-gray-100 text-gray-500'}`}>
                                                        {booking.payment}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    <span>Khởi hành: <strong>{formattedStartDate}</strong></span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    <span>Số khách: <strong>{booking.num_adults} người lớn {booking.num_children > 0 ? `, ${booking.num_children} trẻ em` : ''}</strong></span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Landmark className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    <span>Hình thức: <strong>{booking.payment_method === 'OFFICE' ? 'Tại văn phòng' : 'Chuyển khoản VietQR'}</strong></span>
                                                </div>
                                            </div>

                                            {/* Total price & note */}
                                            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2 flex-wrap gap-4">
                                                <div className="text-sm">
                                                    <span className="text-gray-500">Tổng thanh toán: </span>
                                                    <strong className="text-[#8B1A1A] font-extrabold text-base">{formatVND(booking.total_price)}</strong>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {booking.payment_status === 'PENDING' && booking.payment_method === 'BANK_TRANSFER' && booking.booking_status !== 'CANCELLED' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setActiveQRBookingId(prev => prev === booking.booking_id ? null : booking.booking_id)}
                                                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border
                                                                ${activeQRBookingId === booking.booking_id 
                                                                    ? 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200' 
                                                                    : 'border-[#8B1A1A] text-[#8B1A1A] hover:bg-[#8B1A1A] hover:text-white bg-red-50/5'}`}
                                                        >
                                                            <Landmark className="w-3.5 h-3.5" />
                                                            {activeQRBookingId === booking.booking_id ? 'Đóng QR' : 'Thanh toán VietQR'}
                                                        </button>
                                                    )}

                                                    {/* Action cancel button */}
                                                    {isPending && (
                                                        <button
                                                            onClick={() => triggerCancelConfirm(booking.booking_id)}
                                                            disabled={cancellingId === booking.booking_id}
                                                            className="border border-red-200 text-red-500 bg-red-50/10 px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                                                        >
                                                            {cancellingId === booking.booking_id ? (
                                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                            ) : (
                                                                <XCircle className="w-3.5 h-3.5" />
                                                            )}
                                                            Hủy đặt tour
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Expandable VietQR payment info */}
                                            {activeQRBookingId === booking.booking_id && (
                                                <div className="border-t border-gray-100 pt-4 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    <div className="flex flex-col sm:flex-row items-center gap-6 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                                        {/* QR container */}
                                                        <div 
                                                            onClick={() => setZoomQRUrl(`https://img.vietqr.io/image/mb-0869688128-compact2.png?amount=${booking.total_price}&addInfo=TRIPEASY%20BK%20${booking.booking_id}&accountName=NGUYEN%20DONG%20THIEN`)}
                                                            className="bg-white p-2.5 rounded-2xl shadow border border-gray-200 max-w-[160px] relative group overflow-hidden cursor-zoom-in flex-shrink-0"
                                                            title="Nhấp để phóng to QR"
                                                        >
                                                            <img 
                                                                src={`https://img.vietqr.io/image/mb-0869688128-compact2.png?amount=${booking.total_price}&addInfo=TRIPEASY%20BK%20${booking.booking_id}&accountName=NGUYEN%20DONG%20THIEN`} 
                                                                alt="VietQR Chuyển Khoản"
                                                                className="w-full h-auto object-contain rounded-xl"
                                                            />
                                                            <div className="absolute inset-0 bg-red-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center border-2 border-[#8B1A1A] rounded-2xl" />
                                                        </div>
                                                        
                                                        {/* Bank details */}
                                                        <div className="text-left space-y-2 text-sm flex-1 w-full">
                                                            <h4 className="font-bold text-gray-800 text-sm">Chuyển khoản thanh toán VietQR</h4>
                                                            <div className="flex justify-between border-b border-gray-200/50 pb-1.5 text-xs">
                                                                <span className="text-gray-400">Ngân hàng:</span>
                                                                <span className="text-gray-700 font-semibold">MB Bank (Ngân hàng Quân Đội)</span>
                                                            </div>
                                                            <div className="flex justify-between border-b border-gray-200/50 pb-1.5 text-xs">
                                                                <span className="text-gray-400">Số tài khoản:</span>
                                                                <span className="text-gray-800 font-extrabold">0869688128</span>
                                                            </div>
                                                            <div className="flex justify-between border-b border-gray-200/50 pb-1.5 text-xs">
                                                                <span className="text-gray-400">Chủ tài khoản:</span>
                                                                <span className="text-gray-700 font-semibold">NGUYEN DONG THIEN</span>
                                                            </div>
                                                            <div className="flex justify-between border-b border-gray-200/50 pb-1.5 text-xs">
                                                                <span className="text-gray-400">Số tiền:</span>
                                                                <span className="text-[#8B1A1A] font-extrabold">{formatVND(booking.total_price)}</span>
                                                            </div>
                                                            <div className="flex justify-between text-xs">
                                                                <span className="text-gray-400">Nội dung CK:</span>
                                                                <span className="text-[#8B1A1A] font-extrabold bg-red-50 px-2 py-0.5 rounded border border-red-200">TRIPEASY BK {booking.booking_id}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )
                ) : (
                    loadingReviews ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-10 h-10 animate-spin text-[#8B1A1A] mb-3" />
                            <p className="text-sm text-gray-500 font-semibold">Đang tải danh sách đánh giá...</p>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-150 max-w-lg mx-auto mt-10 animate-in fade-in duration-300">
                            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-800">Bạn chưa gửi đánh giá nào</h3>
                            <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                                Đánh giá các chuyến đi bạn đã hoàn thành để chia sẻ trải nghiệm thực tế với cộng đồng Tripeasy nhé!
                            </p>
                            <Link 
                                to="/client/tours" 
                                className="inline-block bg-[#8B1A1A] text-white px-8 py-3.5 rounded-xl font-bold mt-6 hover:bg-[#6e1414] transition shadow-lg shadow-red-950/10"
                            >
                                Khám phá các Tour ngay
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            {reviews.map((rev) => (
                                <article 
                                    key={rev.review_id}
                                    className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden"
                                >
                                    <div className="absolute left-0 inset-y-0 w-1.5 bg-yellow-400" />
                                    
                                    {/* Tour Image */}
                                    <Link 
                                        to={`/client/tours/${rev.tour_id}`}
                                        className="w-full md:w-40 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 block hover:opacity-90 transition-opacity"
                                    >
                                        {rev.tour_image ? (
                                            <img 
                                                src={rev.tour_image} 
                                                alt={rev.tour_title} 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[#8B1A1A] bg-[#8B1A1A]/5 font-bold text-sm">
                                                Tripeasy
                                            </div>
                                        )}
                                    </Link>

                                    {/* Content */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between gap-4 flex-wrap">
                                            <div>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mã tour: #TRP-{rev.tour_id}</span>
                                                <h3 className="font-extrabold text-gray-800 text-base leading-snug hover:text-[#8B1A1A] transition mt-0.5">
                                                    <Link to={`/client/tours/${rev.tour_id}`} className="hover:underline">
                                                        {rev.tour_title}
                                                    </Link>
                                                </h3>
                                            </div>
                                            
                                            {/* Stars display */}
                                            <div className="flex gap-0.5 bg-amber-50/50 px-2.5 py-1 rounded-xl border border-amber-100">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'text-yellow-400 fill-current' : 'text-gray-250'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-gray-600 text-sm leading-relaxed bg-gray-50/60 px-4 py-3 rounded-2xl border border-gray-100/50 italic">
                                            "{rev.comment}"
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                                            <span>Ngày đánh giá: <strong>{new Date(rev.timestamp).toLocaleDateString('vi-VN')}</strong></span>
                                        </div>

                                        {/* Phản hồi từ Ban quản trị */}
                                        {rev.admin_reply && (
                                            <div className="mt-3 bg-red-50/5 p-4 rounded-2xl border-l-4 border-[#8B1A1A] flex flex-col gap-1.5 animate-in fade-in duration-200">
                                                <div className="flex justify-between items-center text-[10px]">
                                                    <span className="font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5">
                                                        <MessageSquare className="w-3.5 h-3.5 text-[#8B1A1A] fill-current" />
                                                        Phản hồi từ Ban quản trị
                                                    </span>
                                                    <span className="text-gray-400 font-semibold">{new Date(rev.replied_at).toLocaleDateString('vi-VN')}</span>
                                                </div>
                                                <p className="text-gray-700 text-sm italic pl-1 leading-relaxed">
                                                    "{rev.admin_reply}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    ))
                }
            </main>

            {zoomQRUrl && (
                <div 
                    onClick={() => setZoomQRUrl('')} 
                    className="fixed inset-0 z-[10000] w-screen h-screen bg-black/80 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
                >
                    <div className="relative max-w-sm w-full bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <h4 className="text-gray-900 font-bold text-sm mb-3">Quét mã QR thanh toán</h4>
                        <img 
                            src={zoomQRUrl} 
                            alt="VietQR Chuyển Khoản Phóng To"
                            className="w-full h-auto rounded-2xl border"
                        />
                        <p className="text-xs text-gray-400 mt-4">Nhấp bất kỳ đâu bên ngoài để đóng</p>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                type="danger"
            />
            
            <ClientFooter />
        </div>
    );
};

export default MyBookings;
