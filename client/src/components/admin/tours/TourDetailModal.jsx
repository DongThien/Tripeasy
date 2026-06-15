import React, { useEffect, useState, useMemo } from 'react';
import {
    X, MapPin, Clock, Users, DollarSign,
    FileText, Map, CalendarDays, Hash, Globe,
    Bus, Compass, CheckCircle2, AlertTriangle,
    Layers, HelpCircle, ShieldCheck, XCircle, Info
} from 'lucide-react';
import { formatVND } from '../../../utils/formatHelper';

const FALLBACK_IMG = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800";

const InfoItem = ({ icon: Icon, label, value, iconColor = "text-[#8B1A1A]" }) => (
    <div className="flex items-center gap-2.5 bg-gray-50/70 border border-gray-100 rounded-xl p-2.5 hover:bg-gray-50 transition-colors">
        <div className={`flex-shrink-0 p-1.5 bg-white rounded-lg shadow-sm ${iconColor}`}>
            <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-0.5">{label}</p>
            <p className="text-xs font-bold text-gray-800 truncate">{value || '—'}</p>
        </div>
    </div>
);

const TourDetailModal = ({ tourData, onClose }) => {
    const [activeTab, setActiveTab] = useState('itinerary'); // 'itinerary', 'departures', 'services', 'highlights'
    const [activeImage, setActiveImage] = useState(FALLBACK_IMG);

    // ESC close & lock scroll
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    // Parse image list
    const imagesList = useMemo(() => {
        if (!tourData) return [];
        let list = [];
        if (tourData.images) {
            if (Array.isArray(tourData.images)) {
                list = tourData.images;
            } else if (typeof tourData.images === 'string') {
                try {
                    if (tourData.images.startsWith('{') && tourData.images.endsWith('}')) {
                        list = tourData.images.substring(1, tourData.images.length - 1).split(',');
                    } else {
                        list = JSON.parse(tourData.images);
                    }
                } catch {
                    list = [tourData.images];
                }
            }
        }
        if (list.length === 0 && tourData.image_url) {
            list = [tourData.image_url];
        }
        return list.map(img => img.trim().replace(/^"|"$/g, '')).filter(Boolean);
    }, [tourData]);

    // Set initial active image
    useEffect(() => {
        if (imagesList.length > 0) {
            setActiveImage(imagesList[0]);
        } else {
            setActiveImage(FALLBACK_IMG);
        }
    }, [imagesList]);

    if (!tourData) return null;

    // Parse structures
    const parseJSONList = (field, fallback = []) => {
        if (!field) return fallback;
        if (Array.isArray(field)) return field;
        try {
            return typeof field === 'string' ? JSON.parse(field) : field;
        } catch {
            return fallback;
        }
    };

    const itineraryList = parseJSONList(tourData.itinerary);
    const departuresList = parseJSONList(tourData.departures);
    const highlightsList = parseJSONList(tourData.highlights);
    const includedList = parseJSONList(tourData.included);
    const excludedList = parseJSONList(tourData.excluded);
    const policyChild = parseJSONList(tourData.policy_child);
    const policyCancel = parseJSONList(tourData.policy_cancel);
    const policyOther = parseJSONList(tourData.policy_other);

    const isAvailable = tourData.availability;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="relative bg-[#FDFBF7] rounded-3xl shadow-2xl w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden border border-gray-100/50"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── HEADER ── */}
                <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 flex-shrink-0">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-400">TRP-{tourData.tour_id}</span>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${isAvailable ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-gray-400'}`} />
                                {isAvailable ? 'Đang hoạt động' : 'Bản nháp'}
                            </span>
                            <span className="bg-red-50 text-[#8B1A1A] text-[10px] uppercase font-bold tracking-wide px-2 py-0.5 rounded-md">
                                {tourData.category || 'Mặc định'}
                            </span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 mt-1 max-w-[650px] truncate" title={tourData.title}>
                            {tourData.title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                        aria-label="Đóng"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ── SCROLLABLE WORKSPACE ── */}
                <div className="overflow-y-auto flex-1 p-6 space-y-6">
                    {/* Top Section: Split Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        {/* Left Column: Media Gallery */}
                        <div className="md:col-span-5 space-y-3">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100 shadow-md bg-gray-100">
                                <img
                                    src={activeImage}
                                    alt={tourData.title}
                                    className="w-full h-full object-cover transition-all duration-300"
                                    onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                                />
                            </div>
                            {/* Thumbnails list */}
                            {imagesList.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar">
                                    {imagesList.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(img)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shadow-sm ${activeImage === img ? 'border-[#8B1A1A] scale-95' : 'border-transparent hover:border-gray-300'}`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Column: Key Specifications & Pricing */}
                        <div className="md:col-span-7 space-y-4">
                            {/* Spec Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <InfoItem icon={Globe} label="Vùng miền" value={tourData.region} />
                                <InfoItem icon={MapPin} label="Điểm đến" value={tourData.destination} />
                                <InfoItem icon={Clock} label="Thời lượng" value={tourData.duration} />
                                <InfoItem icon={Bus} label="Vận chuyển" value={tourData.transport} />
                                <InfoItem icon={MapPin} label="Khởi hành từ" value={tourData.start_location} />
                                <InfoItem icon={Users} label="Tổng số chỗ" value={tourData.quantity ? `${tourData.quantity} chỗ` : '0 chỗ'} />
                            </div>

                            {/* Pricing Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                                    <DollarSign className="w-3.5 h-3.5 text-gray-500" /> Bảng giá Tour
                                </p>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-2 bg-red-50/50 rounded-xl border border-red-100/30 text-center">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Người lớn</p>
                                        <p className="text-sm font-extrabold text-[#8B1A1A]">{formatVND(tourData.price_adult)}</p>
                                    </div>
                                    <div className="p-2 bg-orange-50/50 rounded-xl border border-orange-100/30 text-center">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Trẻ em</p>
                                        <p className="text-sm font-extrabold text-orange-700">
                                            {tourData.price_child ? formatVND(tourData.price_child) : 'Miễn phí'}
                                        </p>
                                    </div>
                                    <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 text-center">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Giá gốc (Gạch)</p>
                                        <p className="text-sm font-bold text-gray-400 line-through">
                                            {tourData.old_price ? formatVND(tourData.old_price) : '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="border-b border-gray-200 flex gap-1 overflow-x-auto no-scrollbar bg-white rounded-xl p-1 shadow-sm">
                        <button
                            onClick={() => setActiveTab('itinerary')}
                            className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${activeTab === 'itinerary' ? 'bg-[#8B1A1A] text-white' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                        >
                            <Map className="w-4 h-4" /> Lịch trình ({itineraryList.length} ngày)
                        </button>
                        <button
                            onClick={() => setActiveTab('departures')}
                            className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${activeTab === 'departures' ? 'bg-[#8B1A1A] text-white' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                        >
                            <CalendarDays className="w-4 h-4" /> Ngày khởi hành ({departuresList.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('services')}
                            className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${activeTab === 'services' ? 'bg-[#8B1A1A] text-white' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                        >
                            <Layers className="w-4 h-4" /> Dịch vụ & Chính sách
                        </button>
                        <button
                            onClick={() => setActiveTab('highlights')}
                            className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${activeTab === 'highlights' ? 'bg-[#8B1A1A] text-white' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                        >
                            <Compass className="w-4 h-4" /> Điểm nhấn & Mô tả
                        </button>
                    </div>

                    {/* Tab Contents */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm min-h-[260px]">
                        {/* TAB 1: ITINERARY */}
                        {activeTab === 'itinerary' && (
                            <div className="space-y-6">
                                {itineraryList.length > 0 ? (
                                    <div className="relative border-l-2 border-dashed border-red-200 ml-4 pl-6 space-y-6 py-2">
                                        {itineraryList.map((item, idx) => (
                                            <div key={idx} className="relative">
                                                {/* Timeline node */}
                                                <div className="absolute -left-[35px] top-0.5 w-6 h-6 rounded-full bg-[#8B1A1A] text-white font-extrabold text-[10px] flex items-center justify-center border-4 border-white shadow-md">
                                                    {item.day || idx + 1}
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-bold text-gray-800">
                                                        {item.title || `Ngày ${item.day || idx + 1}`}
                                                    </h4>
                                                    <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                                                        {item.content || 'Chưa cập nhật chi tiết hoạt động'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-gray-400">
                                        <Map className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-xs font-medium">Chưa có thông tin lịch trình chi tiết</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 2: DEPARTURES */}
                        {activeTab === 'departures' && (
                            <div className="space-y-4">
                                {departuresList.length > 0 ? (
                                    <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-inner">
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase font-bold tracking-wider">
                                                    <th className="px-4 py-3">Ngày khởi hành</th>
                                                    <th className="px-4 py-3">Ngày về</th>
                                                    <th className="px-4 py-3">Số chỗ trống</th>
                                                    <th className="px-4 py-3">Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                                                {departuresList.map((dep, idx) => {
                                                    const isPast = new Date(dep.start_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
                                                    const isAvailable = dep.status === 'AVAILABLE' && dep.stock > 0;
                                                    
                                                    return (
                                                        <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                                                            <td className="px-4 py-3 text-gray-900">
                                                                {dep.start_date ? new Date(dep.start_date).toLocaleDateString('vi-VN') : '—'}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                {dep.end_date ? new Date(dep.end_date).toLocaleDateString('vi-VN') : '—'}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={dep.stock <= 5 ? 'text-red-500 font-bold' : 'text-gray-700'}>
                                                                    {dep.stock} chỗ
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                {isPast ? (
                                                                    <span className="bg-gray-100 text-gray-400 px-2 py-0.5 rounded-md text-[10px]">Đã diễn ra</span>
                                                                ) : isAvailable ? (
                                                                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-md text-[10px]">Có sẵn</span>
                                                                ) : (
                                                                    <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-md text-[10px]">Đã khoá / Hết chỗ</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-gray-400">
                                        <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-xs font-medium">Chưa thiết lập ngày khởi hành cho tour này</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 3: SERVICES & POLICIES */}
                        {activeTab === 'services' && (
                            <div className="space-y-6">
                                {/* Services Split */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-green-50/20 border border-green-100/30 rounded-2xl p-4 space-y-2">
                                        <h4 className="text-xs font-bold text-green-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-600" /> Dịch vụ bao gồm
                                        </h4>
                                        {includedList.length > 0 ? (
                                            <ul className="space-y-1.5 text-xs text-gray-600">
                                                {includedList.map((inc, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <span className="text-green-500 mt-0.5">✓</span>
                                                        <span>{inc}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic">Chưa có thông tin</p>
                                        )}
                                    </div>

                                    <div className="bg-red-50/20 border border-red-100/30 rounded-2xl p-4 space-y-2">
                                        <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                            <XCircle className="w-4 h-4 text-red-600" /> Dịch vụ KHÔNG bao gồm
                                        </h4>
                                        {excludedList.length > 0 ? (
                                            <ul className="space-y-1.5 text-xs text-gray-600">
                                                {excludedList.map((exc, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <span className="text-red-500 mt-0.5">✕</span>
                                                        <span>{exc}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic">Chưa có thông tin</p>
                                        )}
                                    </div>
                                </div>

                                {/* Policies Section */}
                                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-4">
                                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-200 pb-2">
                                        <ShieldCheck className="w-4 h-4 text-[#8B1A1A]" /> Quy định & Chính sách Tour
                                    </h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                                        {/* Child Policy */}
                                        <div className="space-y-1">
                                            <h5 className="font-bold text-gray-700 flex items-center gap-1">👶 Khách trẻ em</h5>
                                            {policyChild.length > 0 ? (
                                                <ul className="list-disc list-inside space-y-1 text-gray-500">
                                                    {policyChild.map((p, i) => <li key={i}>{p}</li>)}
                                                </ul>
                                            ) : <p className="text-gray-400 italic">Chưa thiết lập</p>}
                                        </div>

                                        {/* Cancel Policy */}
                                        <div className="space-y-1">
                                            <h5 className="font-bold text-gray-700 flex items-center gap-1">❌ Hoàn hủy tour</h5>
                                            {policyCancel.length > 0 ? (
                                                <ul className="list-disc list-inside space-y-1 text-gray-500">
                                                    {policyCancel.map((p, i) => <li key={i}>{p}</li>)}
                                                </ul>
                                            ) : <p className="text-gray-400 italic">Chưa thiết lập</p>}
                                        </div>

                                        {/* Other Policy */}
                                        <div className="space-y-1">
                                            <h5 className="font-bold text-gray-700 flex items-center gap-1">📝 Lưu ý khác</h5>
                                            {policyOther.length > 0 ? (
                                                <ul className="list-disc list-inside space-y-1 text-gray-500">
                                                    {policyOther.map((p, i) => <li key={i}>{p}</li>)}
                                                </ul>
                                            ) : <p className="text-gray-400 italic">Chưa thiết lập</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: HIGHLIGHTS & DESCRIPTION */}
                        {activeTab === 'highlights' && (
                            <div className="space-y-6">
                                {/* Highlights Grid */}
                                {highlightsList.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                                            <Compass className="w-4 h-4 text-[#8B1A1A]" /> Điểm nhấn nổi bật của Tour
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {highlightsList.map((item, idx) => (
                                                <div key={idx} className="bg-red-50/10 border border-red-100/20 rounded-xl p-3.5 space-y-1">
                                                    <p className="font-bold text-xs text-[#8B1A1A] flex items-center gap-1.5">
                                                        🌟 {item.title || `Điểm nhấn ${idx + 1}`}
                                                    </p>
                                                    <p className="text-[11px] text-gray-600 leading-relaxed pl-5">
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Description Box */}
                                {tourData.description ? (
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                                            <FileText className="w-4 h-4 text-gray-500" /> Mô tả khái quát
                                        </h4>
                                        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                                            {tourData.description}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-gray-400">
                                        <Info className="w-8 h-8 mx-auto mb-1 opacity-50" />
                                        <p className="text-[11px]">Không có phần mô tả khái quát bổ sung</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── FOOTER BUTTONS ── */}
                <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition text-xs"
                    >
                        Đóng chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TourDetailModal;
