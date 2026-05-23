import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, ChevronDown, Info } from 'lucide-react';
import { formatVND } from '../../../utils/formatHelper';

const TourDetailBookingSidebar = ({ tour }) => {
    const navigate = useNavigate();
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);

    // Chống sập nếu departures từ DB trả về chưa được parse
    const validDepartures = useMemo(() => {
        if (!tour.departures) return [];
        if (Array.isArray(tour.departures)) return tour.departures;
        try { return JSON.parse(tour.departures); } catch { return []; }
    }, [tour.departures]);

    const [selectedDepId, setSelectedDepId] = useState(validDepartures[0]?.departure_id || '');

    const selectedDeparture = useMemo(() =>
        validDepartures.find(d => d.departure_id === parseInt(selectedDepId)),
        [validDepartures, selectedDepId]
    );

    const totalPrice = useMemo(() => {
        return (adults * (tour.price_adult || 0)) + (children * (tour.price_child || 0));
    }, [adults, children, tour.price_adult, tour.price_child]);

    const handleBooking = () => {
        if (!selectedDepId && validDepartures.length > 0) {
            alert("Vui lòng chọn ngày khởi hành!");
            return;
        }
        
        const token = localStorage.getItem('token');
        if (!token) {
            navigate(`/login?redirect=/client/tours/${tour.tour_id}`);
            return;
        }

        navigate(`/client/tours/${tour.tour_id}/checkout?adults=${adults}&children=${children}&departureId=${selectedDepId}`);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
            <div className="flex items-baseline gap-2 mb-6">
                <span className="text-2xl font-bold text-[#8B1A1A]">{formatVND(tour.price_adult)}</span>
                <span className="text-gray-500 text-sm">/ khách</span>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Calendar className="w-4 h-4" /> Ngày khởi hành
                    </label>
                    <div className="relative">
                        <select
                            value={selectedDepId}
                            onChange={(e) => setSelectedDepId(e.target.value)}
                            className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] outline-none transition-all text-sm"
                        >
                            {validDepartures.length > 0 ? (
                                validDepartures.map(dep => (
                                    <option key={dep.departure_id} value={dep.departure_id}>
                                        {new Date(dep.start_date).toLocaleDateString('vi-VN')} - Còn {dep.stock} chỗ
                                    </option>
                                ))
                            ) : (
                                <option value="">Liên hệ để biết lịch</option>
                            )}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Người lớn</label>
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                            <Users className="w-4 h-4 text-gray-400 mr-2" />
                            <input
                                type="number" min="1"
                                value={adults}
                                onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                                className="bg-transparent w-full outline-none text-sm font-semibold"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Trẻ em</label>
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                            <Users className="w-4 h-4 text-gray-400 mr-2" />
                            <input
                                type="number" min="0"
                                value={children}
                                onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                                className="bg-transparent w-full outline-none text-sm font-semibold"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-dashed border-gray-200 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Người lớn ({adults} x {formatVND(tour.price_adult)})</span>
                        <span>{formatVND(adults * (tour.price_adult || 0))}</span>
                    </div>
                    {children > 0 && (
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Trẻ em ({children} x {formatVND(tour.price_child)})</span>
                            <span>{formatVND(children * (tour.price_child || 0))}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-base font-bold text-gray-900">Tổng cộng</span>
                        <span className="text-xl font-bold text-[#8B1A1A]">{formatVND(totalPrice)}</span>
                    </div>
                </div>

                <button
                    onClick={handleBooking}
                    className="w-full bg-[#8B1A1A] text-white py-4 rounded-xl font-bold hover:bg-[#6e1414] transition-colors shadow-lg shadow-red-900/10 active:scale-[0.98]"
                >
                    ĐẶT TOUR NGAY
                </button>

                <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1">
                    <Info className="w-3 h-3" /> Đảm bảo giá tốt nhất & Thanh toán an toàn
                </p>
            </div>
        </div>
    );
};

export default TourDetailBookingSidebar;