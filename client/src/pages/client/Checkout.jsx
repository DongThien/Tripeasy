import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Users, FileText, MapPin, CreditCard, Landmark, CheckCircle, ArrowLeft, Loader2, Phone, Mail } from 'lucide-react';
import axiosClient from '../../services/axiosClient';
import bookingService from '../../services/bookingService';
import ClientNavbar from '../../components/common/ClientNavbar';
import ClientFooter from '../../components/common/ClientFooter';
import { formatVND } from '../../utils/formatHelper';
import toast from 'react-hot-toast';
import settingService from '../../services/settingService';

const Checkout = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Query params
    const adults = parseInt(searchParams.get('adults')) || 1;
    const children = parseInt(searchParams.get('children')) || 0;
    const departureId = searchParams.get('departureId') || '';

    // States
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER'); // BANK_TRANSFER or OFFICE
    const [sysSettings, setSysSettings] = useState(null);
    const [bookingResult, setBookingResult] = useState(null); // stores result after successful booking
    const [zoomQR, setZoomQR] = useState(false);

    // User session
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    });

    const [formData, setFormData] = useState({
        fullName: user?.username || user?.name || '',
        phone: user?.phone_number || '',
        email: user?.email || '',
        address: user?.address || '',
        specialRequests: ''
    });

    useEffect(() => {
        // Cuộn đầu trang
        window.scrollTo(0, 0);

        // Kiểm tra đăng nhập
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Vui lòng đăng nhập để tiến hành đặt tour!");
            navigate(`/login?redirect=/client/tours/${id}`);
            return;
        }

        const fetchData = async () => {
            try {
                const [tourRes, settingsRes] = await Promise.all([
                    axiosClient.get(`/tours/${id}`),
                    settingService.getSettings().catch(err => {
                        console.error('Failed to load settings:', err);
                        return null;
                    })
                ]);

                if (tourRes.data.success) {
                    setTour(tourRes.data.data);
                } else {
                    toast.error("Không tìm thấy thông tin tour");
                    navigate('/client/tours');
                    return;
                }

                if (settingsRes && settingsRes.success) {
                    setSysSettings(settingsRes.data);
                }
            } catch (err) {
                console.error(err);
                toast.error("Đã xảy ra lỗi khi tải thông tin tour");
                navigate('/client/tours');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    // Parse departures
    const validDepartures = useMemo(() => {
        if (!tour?.departures) return [];
        if (Array.isArray(tour.departures)) return tour.departures;
        try { return JSON.parse(tour.departures); } catch { return []; }
    }, [tour?.departures]);

    const selectedDeparture = useMemo(() => {
        return validDepartures.find(d => d.departure_id === parseInt(departureId));
    }, [validDepartures, departureId]);

    useEffect(() => {
        if (!loading && tour) {
            if (!selectedDeparture) {
                toast.error("Không tìm thấy thông tin ngày khởi hành hợp lệ!");
                navigate(`/client/tours/${id}`);
                return;
            }
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const depDate = new Date(selectedDeparture.start_date);
            depDate.setHours(0, 0, 0, 0);
            if (depDate < today) {
                toast.error("Ngày khởi hành đã qua, không thể đặt tour!");
                navigate(`/client/tours/${id}`);
                return;
            }
            if (selectedDeparture.status !== 'AVAILABLE') {
                toast.error("Ngày khởi hành này hiện không khả dụng để đặt!");
                navigate(`/client/tours/${id}`);
                return;
            }
        }
    }, [loading, tour, selectedDeparture, navigate, id]);

    const totalPrice = useMemo(() => {
        if (!tour) return 0;
        return (adults * (tour.price_adult || 0)) + (children * (tour.price_child || 0));
    }, [tour, adults, children]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!formData.fullName.trim() || !formData.phone.trim() || !formData.email.trim()) {
            toast.error("Vui lòng điền đầy đủ các trường thông tin bắt buộc!");
            return;
        }

        if (!selectedDeparture) {
            toast.error("Không tìm thấy thông tin ngày khởi hành hợp lệ!");
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const depDate = new Date(selectedDeparture.start_date);
        depDate.setHours(0, 0, 0, 0);
        if (depDate < today) {
            toast.error("Ngày khởi hành ở quá khứ, không thể đặt tour!");
            return;
        }
        if (selectedDeparture.status !== 'AVAILABLE') {
            toast.error("Ngày khởi hành này hiện không khả dụng để đặt!");
            return;
        }

        try {
            setSubmitting(true);
            const bookingData = {
                tour_id: parseInt(id),
                num_adults: adults,
                num_children: children,
                special_requests: formData.specialRequests,
                departure_id: parseInt(departureId),
                payment_method: paymentMethod
            };

            const response = await bookingService.createBooking(bookingData);
            if (response.success) {
                setBookingResult(response.data);
                toast.success("Đặt tour thành công!");
                window.scrollTo(0, 0);
            } else {
                toast.error(response.message || "Đặt tour không thành công.");
            }
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "Lỗi hệ thống khi tạo đơn đặt tour. Vui lòng thử lại!";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    // Render loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-[#8B1A1A]" />
                    <p className="text-gray-500 font-semibold text-sm">Đang chuẩn bị trang thanh toán...</p>
                </div>
            </div>
        );
    }

    // Render booking success screen
    if (bookingResult) {
        const bankCode = sysSettings?.payment?.bankCode || 'mb';
        const accountNumber = sysSettings?.payment?.accountNumber || '0869688128';
        const accountName = encodeURIComponent(sysSettings?.payment?.accountName || 'NGUYEN DONG THIEN');
        const siteName = sysSettings?.general?.siteName || 'TRIPEASY';
        const addInfo = encodeURIComponent(`${siteName.toUpperCase()} BK ${bookingResult.booking_id}`);
        const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${totalPrice}&addInfo=${addInfo}&accountName=${accountName}`;

        return (
            <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-16">
                <ClientNavbar />
                <main className="max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 text-center relative overflow-hidden">
                        {/* Success banner style */}
                        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-green-400 to-emerald-500" />

                        <div className="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
                            <CheckCircle className="w-10 h-10" />
                        </div>

                        <h1 className="text-3xl font-extrabold text-gray-900">Đặt Tour Thành Công!</h1>
                        <p className="text-gray-500 mt-2 font-medium">Mã đặt chỗ của bạn: <span className="text-[#8B1A1A] font-bold">#BK-{bookingResult.booking_id}</span></p>

                        <div className="mt-8 text-left border-t border-dashed border-gray-100 pt-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Chi tiết chuyến đi</h3>
                            <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Tour du lịch:</span>
                                    <span className="text-gray-900 font-bold text-right max-w-[200px] truncate">{tour.title}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Ngày khởi hành:</span>
                                    <span className="text-gray-900 font-bold">{new Date(selectedDeparture.start_date).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Số khách:</span>
                                    <span className="text-gray-900 font-bold">{adults} người lớn {children > 0 ? `, ${children} trẻ em` : ''}</span>
                                </div>
                                <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
                                    <span className="text-gray-800 font-bold text-base">Tổng số tiền:</span>
                                    <span className="text-[#8B1A1A] font-extrabold text-lg">{formatVND(totalPrice)}</span>
                                </div>
                            </div>
                        </div>

                        {paymentMethod === 'BANK_TRANSFER' ? (
                            <div className="mt-8 border-t border-gray-100 pt-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Hướng dẫn thanh toán chuyển khoản VietQR</h3>
                                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                    Bạn vui lòng mở ứng dụng ngân hàng di động của mình và quét mã QR Code dưới đây để tiến hành chuyển khoản tự động. Nội dung chuyển khoản đã được điền sẵn mã booking. (Nhấp vào hình QR để phóng to).
                                </p>

                                <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                    {/* QR container */}
                                    <div
                                        onClick={() => setZoomQR(true)}
                                        className="bg-white p-3 rounded-2xl shadow-md border border-gray-100 max-w-[200px] relative group overflow-hidden cursor-zoom-in"
                                        title="Nhấp để xem ảnh lớn hơn"
                                    >
                                        <img
                                            src={qrUrl}
                                            alt="VietQR Chuyển Khoản"
                                            className="w-full h-auto object-contain rounded-xl"
                                        />
                                        <div className="absolute inset-0 bg-red-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center border-2 border-[#8B1A1A] rounded-2xl" />
                                    </div>

                                    {/* Transfer info */}
                                    <div className="text-left space-y-2 text-sm flex-1">
                                        <div className="flex justify-between border-b border-gray-100 pb-2">
                                            <span className="text-gray-500 font-medium">Ngân hàng:</span>
                                            <span className="text-gray-800 font-bold">{(sysSettings?.payment?.bankCode || 'MB').toUpperCase()}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-100 pb-2">
                                            <span className="text-gray-500 font-medium">Số tài khoản:</span>
                                            <span className="text-gray-800 font-extrabold">{sysSettings?.payment?.accountNumber || '0869688128'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-100 pb-2">
                                            <span className="text-gray-500 font-medium">Chủ tài khoản:</span>
                                            <span className="text-gray-800 font-bold">{sysSettings?.payment?.accountName || 'NGUYEN DONG THIEN'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-100 pb-2">
                                            <span className="text-gray-500 font-medium">Số tiền:</span>
                                            <span className="text-[#8B1A1A] font-extrabold">{formatVND(totalPrice)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 font-medium">Nội dung CK:</span>
                                            <span className="text-[#8B1A1A] font-extrabold bg-red-50 px-2 py-0.5 rounded border border-red-200">TRIPEASY BK {bookingResult.booking_id}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-8 border-t border-gray-100 pt-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Hướng dẫn thanh toán tại văn phòng</h3>
                                <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100 text-left space-y-4">
                                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                        Quý khách vui lòng qua văn phòng đại diện của {sysSettings?.general?.siteName || 'Tripeasy'} để hoàn tất thủ tục đóng tiền và nhận vé tour chính thức trong vòng 24 giờ.
                                    </p>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-[#8B1A1A] mt-0.5 flex-shrink-0" />
                                            <span><strong>Địa chỉ:</strong> {sysSettings?.general?.address || 'Số 3 đường Cầu Giấy, phường Láng Thượng, quận Đống Đa, Hà Nội'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-[#8B1A1A] flex-shrink-0" />
                                            <span><strong>Điện thoại:</strong> {sysSettings?.general?.hotline || '1900 1234'} (Hỗ trợ 24/7)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold rounded-2xl p-4 flex items-center justify-center gap-2">
                            <Mail className="w-4 h-4 flex-shrink-0 text-blue-500" />
                            <span>Chúng tôi đã gửi email xác nhận đặt chỗ và thông tin thanh toán chi tiết tới hòm thư <strong>{formData.email}</strong> của bạn.</span>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <Link
                                to="/client/my-bookings"
                                className="flex-1 bg-[#8B1A1A] text-white py-3.5 rounded-xl font-bold hover:bg-[#6e1414] transition shadow-lg shadow-red-950/10"
                            >
                                Xem lịch sử đặt chỗ
                            </Link>
                            <Link
                                to="/client/tours"
                                className="flex-1 bg-white border border-gray-200 text-gray-600 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition"
                            >
                                Tiếp tục xem tour
                            </Link>
                        </div>
                    </div>
                </main>

                {zoomQR && (
                    <div
                        onClick={() => setZoomQR(false)}
                        className="fixed inset-0 z-[10000] w-screen h-screen bg-black/80 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
                    >
                        <div className="relative max-w-sm w-full bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                            <h4 className="text-gray-900 font-bold text-sm mb-3">Quét mã QR thanh toán</h4>
                            <img
                                src={qrUrl}
                                alt="VietQR Chuyển Khoản Phóng To"
                                className="w-full h-auto rounded-2xl border"
                            />
                            <p className="text-xs text-gray-400 mt-4">Nhấp bất kỳ đâu bên ngoài để đóng</p>
                        </div>
                    </div>
                )}

                <ClientFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-16">
            <ClientNavbar />

            <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                {/* Back Link */}
                <Link to={`/client/tours/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#8B1A1A] transition mb-6">
                    <ArrowLeft className="w-4 h-4" /> Quay lại chi tiết tour
                </Link>

                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Thanh Toán & Xác Nhận Đặt Chỗ</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Form Column */}
                    <form onSubmit={handleFormSubmit} className="lg:col-span-8 space-y-6">
                        {/* Section 1: Customer Details */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-[#8B1A1A]" /> Thông tin liên hệ
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Họ và tên *</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        required
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Ví dụ: Nguyễn Văn An"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] bg-gray-50/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Số điện thoại *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Ví dụ: 0912345678"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] bg-gray-50/50"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Địa chỉ email nhận vé *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Ví dụ: an.nguyen@gmail.com"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] bg-gray-50/50"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Địa chỉ liên hệ</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Cầu Giấy, Hà Nội..."
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] bg-gray-50/50"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Yêu cầu đặc biệt (Không bắt buộc)</label>
                                    <textarea
                                        rows="3"
                                        name="specialRequests"
                                        value={formData.specialRequests}
                                        onChange={handleInputChange}
                                        placeholder="Ghi chú về ăn kiêng, xe đưa đón, khách sạn..."
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] bg-gray-50/50 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Payment Methods */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-[#8B1A1A]" /> Chọn phương thức thanh toán
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div
                                    onClick={() => setPaymentMethod('BANK_TRANSFER')}
                                    className={`border-2 rounded-2xl p-5 flex items-start gap-4 cursor-pointer transition ${paymentMethod === 'BANK_TRANSFER' ? 'border-[#8B1A1A] bg-red-50/10' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                >
                                    <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${paymentMethod === 'BANK_TRANSFER' ? 'border-[#8B1A1A] text-[#8B1A1A]' : 'border-gray-300'}`}>
                                        {paymentMethod === 'BANK_TRANSFER' && <div className="w-2.5 h-2.5 rounded-full bg-[#8B1A1A]" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5"><Landmark className="w-4 h-4 text-gray-500" /> Chuyển khoản ngân hàng (VietQR)</h3>
                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                            Chuyển khoản tiện lợi qua mã QR động tự động điền sẵn số tiền và nội dung đơn.
                                        </p>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setPaymentMethod('OFFICE')}
                                    className={`border-2 rounded-2xl p-5 flex items-start gap-4 cursor-pointer transition ${paymentMethod === 'OFFICE' ? 'border-[#8B1A1A] bg-red-50/10' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                >
                                    <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${paymentMethod === 'OFFICE' ? 'border-[#8B1A1A] text-[#8B1A1A]' : 'border-gray-300'}`}>
                                        {paymentMethod === 'OFFICE' && <div className="w-2.5 h-2.5 rounded-full bg-[#8B1A1A]" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-500" /> Thanh toán tại văn phòng</h3>
                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                            Đóng tiền trực tiếp tại văn phòng của Tripeasy tại Số 3 đường Cầu Giấy trong 24 giờ.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-[#8B1A1A] text-white py-4 rounded-2xl font-bold hover:bg-[#6e1414] transition-all shadow-lg shadow-red-950/10 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.99]"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Đang tạo đơn đặt tour...
                                </>
                            ) : (
                                "HOÀN TẤT & ĐẶT TOUR NGAY"
                            )}
                        </button>
                    </form>

                    {/* Right Summary Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Chi tiết đặt tour</h2>

                            {/* Tour mini info */}
                            <div className="space-y-3">
                                <h3 className="font-extrabold text-gray-800 text-base leading-snug">{tour.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>{tour.destination}</span>
                                </div>
                            </div>

                            {/* Departure details */}
                            {selectedDeparture && (
                                <div className="bg-gray-50 rounded-2xl p-4 space-y-2 border border-gray-100 text-sm">
                                    <div className="flex items-center gap-2 text-gray-700 font-semibold">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span>Ngày đi: {new Date(selectedDeparture.start_date).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 font-medium pl-6">
                                        Chỗ trống còn lại trên hệ thống: {selectedDeparture.stock} chỗ
                                    </div>
                                </div>
                            )}

                            {/* Price breakdowns */}
                            <div className="space-y-2 border-t border-dashed border-gray-100 pt-4 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Người lớn ({adults} x {formatVND(tour.price_adult)})</span>
                                    <span className="font-semibold text-gray-800">{formatVND(adults * (tour.price_adult || 0))}</span>
                                </div>
                                {children > 0 && (
                                    <div className="flex justify-between">
                                        <span>Trẻ em ({children} x {formatVND(tour.price_child)})</span>
                                        <span className="font-semibold text-gray-800">{formatVND(children * (tour.price_child || 0))}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-3">
                                    <span>Tổng số tiền:</span>
                                    <span className="text-[#8B1A1A] font-extrabold text-lg">{formatVND(totalPrice)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Booking Trust Card */}
                        <div className="bg-red-50/30 border border-red-100/50 rounded-3xl p-5 space-y-3">
                            <h4 className="font-bold text-[#8B1A1A] text-sm">Cam kết bảo mật & Hỗ trợ</h4>
                            <ul className="text-xs text-gray-600 space-y-2 leading-relaxed">
                                <li className="flex gap-2">🔹 <span>Giá tour hiển thị là giá trọn gói, không phụ thu ẩn.</span></li>
                                <li className="flex gap-2">🔹 <span>Tripeasy mã hóa dữ liệu cá nhân của bạn chuẩn SSL.</span></li>
                                <li className="flex gap-2">🔹 <span>Chính sách hỗ trợ hoàn hủy nhanh chóng trong trường hợp bất khả kháng.</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <ClientFooter />
        </div>
    );
};

export default Checkout;
