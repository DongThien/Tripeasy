import React from 'react';
import { Eye, Edit, Trash2 } from "lucide-react";
import { formatVND } from "../../../utils/formatHelper";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200";

const TourTable = ({ isLoading, currentTours, filteredLength }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="bg-red-50 text-[#8B1A1A] uppercase text-xs">
                        <th className="py-3 px-3 text-left">Tour</th>
                        <th className="py-3 px-3 text-left">Khu vực</th>
                        <th className="py-3 px-3 text-left">Thời gian</th>
                        <th className="py-3 px-3 text-center">Số lượng</th>
                        <th className="py-3 px-3 text-right">Giá (Người lớn)</th>
                        <th className="py-3 px-3 text-center">Trạng thái</th>
                        <th className="py-3 px-3 text-center">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={7} className="text-center py-10 text-gray-500">Đang tải dữ liệu...</td>
                        </tr>
                    ) : currentTours.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center py-10 text-gray-500">
                                {filteredLength === 0 ? "Không có tour nào." : "Không có dữ liệu cho trang này."}
                            </td>
                        </tr>
                    ) : (
                        currentTours.map(tour => (
                            <tr key={tour.tour_id} className="border-t last:border-b hover:bg-gray-50">
                                <td className="py-3 px-3 flex items-center gap-3 whitespace-nowrap">
                                    <img
                                        src={tour.image_url || FALLBACK_IMG}
                                        alt={tour.title}
                                        className="w-12 h-12 rounded-lg object-cover"
                                        onError={e => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-900">{tour.title}</div>
                                        <div className="text-xs text-gray-500">Mã: TRP-{tour.tour_id}</div>
                                    </div>
                                </td>
                                <td className="py-3 px-3 whitespace-nowrap">{tour.destination}</td>
                                <td className="py-3 px-3 whitespace-nowrap">{tour.duration}</td>
                                <td className="py-3 px-3 text-center whitespace-nowrap">{tour.quantity}</td>
                                <td className="py-3 px-3 text-right font-bold text-gray-900 whitespace-nowrap">
                                    {formatVND(tour.price_adult)}
                                </td>
                                <td className="py-3 px-3 text-center whitespace-nowrap">
                                    {tour.availability ? (
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center justify-center gap-1">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            Đang hoạt động
                                        </span>
                                    ) : (
                                        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-semibold flex items-center justify-center gap-1">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                            Bản nháp
                                        </span>
                                    )}
                                </td>
                                <td className="py-3 px-3 text-center whitespace-nowrap flex items-center gap-3 justify-center">
                                    <Eye className="w-5 h-5 text-blue-500 cursor-pointer hover:scale-110 transition" />
                                    <Edit className="w-5 h-5 text-orange-500 cursor-pointer hover:scale-110 transition" />
                                    <Trash2 className="w-5 h-5 text-red-500 cursor-pointer hover:scale-110 transition" />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TourTable;