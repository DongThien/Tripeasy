import React, { useEffect } from 'react';
import {
    X, MapPin, Clock, Users, DollarSign,
    FileText, Map, CalendarDays, Hash, Globe
} from 'lucide-react';
import { formatVND } from '../../../utils/formatHelper';

const FALLBACK_IMG = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800";

const InfoCard = ({ icon: Icon, label, value, iconColor = "text-[#8B1A1A]" }) => (
    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
        <div className={`mt-0.5 ${iconColor}`}>
            <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-gray-800 break-words">{value || '—'}</p>
        </div>
    </div>
);

const TourDetailModal = ({ tourData, onClose }) => {
    // Đóng modal khi nhấn ESC
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        // Khóa scroll body khi modal mở
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    if (!tourData) return null;

    // Parse itinerary (có thể là string JSON hoặc array)
    let itineraryList = [];
    try {
        itineraryList = typeof tourData.itinerary === 'string'
            ? JSON.parse(tourData.itinerary)
            : (Array.isArray(tourData.itinerary) ? tourData.itinerary : []);
    } catch {
        itineraryList = [];
    }

    return (
        // Backdrop – nhấn ra ngoài để đóng
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Modal container – ngăn sự kiện bubble */}
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── NÚT X GÓC TRÊN ── */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition"
                    aria-label="Đóng"
                >
                    <X className="w-5 h-5 text-gray-700" />
                </button>

                {/* ── HEADER ẢNH ── */}
                <div className="relative w-full aspect-video rounded-t-2xl overflow-hidden">
                    <img
                        src={tourData.image_url || FALLBACK_IMG}
                        alt={tourData.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-5">
                        <p className="text-white/70 text-xs font-medium mb-1">
                            Mã: TRP-{tourData.tour_id}
                        </p>
                        <h2 className="text-white text-xl md:text-2xl font-bold leading-snug drop-shadow">
                            {tourData.title}
                        </h2>
                    </div>
                    {/* Badge trạng thái */}
                    <div className="absolute top-4 left-4">
                        {tourData.availability ? (
                            <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow">
                                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                                Đang hoạt động
                            </span>
                        ) : (
                            <span className="bg-gray-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow">
                                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                                Bản nháp
                            </span>
                        )}
                    </div>
                </div>

                {/* ── BODY ── */}
                <div className="p-6 space-y-6">

                    {/* ── KHU VỰC 1: Thông tin chung (3 cột) ── */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <Hash className="w-4 h-4" /> Thông tin chung
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <InfoCard icon={Globe} label="Khu vực" value={tourData.region} />
                            <InfoCard icon={MapPin} label="Điểm đến" value={tourData.destination} />
                            <InfoCard icon={Clock} label="Thời gian" value={tourData.duration} />
                        </div>
                        {tourData.departure_point && (
                            <div className="mt-3">
                                <InfoCard icon={CalendarDays} label="Điểm khởi hành" value={tourData.departure_point} />
                            </div>
                        )}
                    </div>

                    {/* ── KHU VỰC 2: Kinh doanh (4 ô) ── */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" /> Giá & Số lượng
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-red-50 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-500 mb-1">Giá người lớn</p>
                                <p className="text-sm font-bold text-[#8B1A1A]">{formatVND(tourData.price_adult)}</p>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-500 mb-1">Giá trẻ em</p>
                                <p className="text-sm font-bold text-orange-600">
                                    {tourData.price_child ? formatVND(tourData.price_child) : 'Miễn phí'}
                                </p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-500 mb-1">Số lượng</p>
                                <p className="text-sm font-bold text-blue-600 flex items-center justify-center gap-1">
                                    <Users className="w-3.5 h-3.5" />
                                    {tourData.quantity ?? '—'}
                                </p>
                            </div>
                            <div className={`rounded-lg p-3 text-center ${tourData.availability ? 'bg-green-50' : 'bg-gray-100'}`}>
                                <p className="text-xs text-gray-500 mb-1">Trạng thái</p>
                                {tourData.availability ? (
                                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                        Đang hoạt động
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                        Bản nháp
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── KHU VỰC 3: Mô tả & Lịch trình ── */}
                    {(tourData.description || itineraryList.length > 0) && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Nội dung chi tiết
                            </h3>
                            <div className="max-h-60 overflow-y-auto pr-1 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
                                {/* Mô tả */}
                                {tourData.description && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Mô tả</p>
                                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                            {tourData.description}
                                        </p>
                                    </div>
                                )}
                                {/* Lịch trình */}
                                {itineraryList.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
                                            <Map className="w-3.5 h-3.5" /> Lịch trình
                                        </p>
                                        <ol className="space-y-3">
                                            {itineraryList.map((item, idx) => (
                                                <li key={idx} className="flex gap-3">
                                                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#8B1A1A] text-white text-xs font-bold flex items-center justify-center">
                                                        {item.day ?? idx + 1}
                                                    </div>
                                                    <div>
                                                        {item.title && (
                                                            <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                                                        )}
                                                        {item.content && (
                                                            <p className="text-sm text-gray-600 mt-0.5 whitespace-pre-line">
                                                                {item.content}
                                                            </p>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── FOOTER: NÚT ĐÓNG ── */}
                <div className="px-6 pb-6">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition text-sm"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TourDetailModal;
