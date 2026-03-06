import React from 'react';
import { Eye, Edit, Trash2 } from "lucide-react";
import { formatVND } from "../../../utils/formatHelper";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200";

const TourTable = ({ isLoading, currentTours, filteredLength }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="min-w-full table-fixed text-sm">
                <thead>
                    <tr className="bg-red-50 text-[#8B1A1A] uppercase text-xs">
                        <th className="py-3 px-3 text-left w-[35%]">Tour</th>
                        <th className="py-3 px-3 text-left w-[12%]">Khu vực</th>
                        <th className="py-3 px-3 text-left w-[12%]">Thời gian</th>
                        <th className="py-3 px-3 text-center w-[9%]">Số lượng</th>
                        <th className="py-3 px-3 text-right w-[13%]">Giá (Người lớn)</th>
                        <th className="py-3 px-3 text-center w-[13%]">Trạng thái</th>
                        <th className="py-3 px-3 text-center w-[6%]">Thao tác</th>
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
                                <td className="py-3 px-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <img
                                            src={tour.image_url || FALLBACK_IMG}
                                            alt={tour.title}
                                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                            onError={e => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="font-semibold text-gray-900 line-clamp-2">{tour.title}</div>
                                            <div className="text-xs text-gray-500 truncate">Mã: TRP-{tour.tour_id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-3">
                                    <div className="min-w-0">
                                        <div className="text-left truncate">{tour.region || tour.destination}</div>
                                    </div>
                                </td>
                                <td className="py-3 px-3">
                                    <div className="text-left">{tour.duration}</div>
                                </td>
                                <td className="py-3 px-3 text-center">{tour.quantity}</td>
                                <td className="py-3 px-3 text-right font-bold text-gray-900 whitespace-nowrap">
                                    {formatVND(tour.price_adult)}
                                </td>
                                <td className="py-3 px-3 text-center">
                                    <div className="min-w-[100px]">
                                        {tour.availability ? (
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center justify-center gap-1 whitespace-nowrap">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                Đang hoạt động
                                            </span>
                                        ) : (
                                            <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-semibold flex items-center justify-center gap-1 whitespace-nowrap">
                                                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                                Bản nháp
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-3 text-center">
                                    <div className="flex items-center gap-2 justify-center">
                                        <Eye className="w-4 h-4 text-blue-500 cursor-pointer hover:scale-110 transition" />
                                        <Edit className="w-4 h-4 text-orange-500 cursor-pointer hover:scale-110 transition" />
                                        <Trash2 className="w-4 h-4 text-red-500 cursor-pointer hover:scale-110 transition" />
                                    </div>
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