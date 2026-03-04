import React, { useEffect, useState } from "react";
import { Map, CheckCircle2, Inbox, Search, Eye, Edit, Trash2 } from "lucide-react";
import tourService from "../../services/tourService";
import { formatVND } from "../../utils/formatHelper";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200";

const TourList = () => {
    const [tours, setTours] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Filter state
    const [search, setSearch] = useState("");
    const [region, setRegion] = useState("Tất cả");
    const [status, setStatus] = useState("Tất cả");
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchTours = async () => {
            setIsLoading(true);
            try {
                console.log("🚀 Fetching tours from API...");
                const response = await tourService.getAllTours();
                console.log("📊 Data from API:", response);

                // Data đã được xử lý trong tourService - đảm bảo là array
                const finalArray = Array.isArray(response) ? response : [];
                console.log("✅ Final tours array:", finalArray);
                console.log("📈 Total tours found:", finalArray.length);

                setTours(finalArray);
            } catch (err) {
                console.error("❌ Error fetching tours:", err);
                setTours([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTours();
    }, []);

    // Computed values for stats
    const activeTours = tours.filter(t => t.availability === true).length;
    const draftTours = tours.length - activeTours;

    // Optional: Filter logic (if needed)
    const filteredTours = Array.isArray(tours) ? tours.filter(tour => {
        const matchSearch = tour.title?.toLowerCase().includes(search.toLowerCase());
        const matchRegion = region === "Tất cả" || tour.destination === region;
        const matchStatus = status === "Tất cả" || (status === "Đang hoạt động" ? tour.availability === true : tour.availability === false);
        return matchSearch && matchRegion && matchStatus;
    }) : [];

    // Pagination calculations
    const totalPages = Math.ceil(filteredTours.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTours = filteredTours.slice(startIndex, endIndex);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, region, status]);

    // Pagination handlers
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++) {
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

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-[#8B1A1A]">Danh sách Tour</h1>
                <button className="bg-[#8B1A1A] text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#a83232] transition">
                    + Thêm Tour mới
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm">
                    <Inbox className="w-8 h-8 text-[#8B1A1A]" />
                    <div>
                        <div className="text-lg font-bold">{tours.length}</div>
                        <div className="text-gray-500 text-sm">Tổng số Tour</div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                    <div>
                        <div className="text-lg font-bold">{activeTours}</div>
                        <div className="text-gray-500 text-sm">Đang hoạt động</div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm">
                    <Map className="w-8 h-8 text-gray-400" />
                    <div>
                        <div className="text-lg font-bold">{draftTours}</div>
                        <div className="text-gray-500 text-sm">Bản nháp</div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 mb-6 shadow-sm">
                <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 w-full md:w-1/3">
                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                        className="bg-transparent outline-none w-full"
                        placeholder="Tìm kiếm tour..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 w-full md:w-1/4"
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                >
                    <option>Tất cả</option>
                    <option>Miền Bắc</option>
                    <option>Miền Trung</option>
                    <option>Miền Nam</option>
                </select>
                <select
                    className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 w-full md:w-1/4"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                >
                    <option>Tất cả</option>
                    <option>Đang hoạt động</option>
                    <option>Bản nháp</option>
                </select>
            </div>

            {/* Data Table */}
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
                                    {filteredTours.length === 0 ? "Không có tour nào." : "Không có dữ liệu cho trang này."}
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
                                    <td className="py-3 px-3 text-right font-bold text-gray-900 whitespace-nowrap">{formatVND(tour.price_adult)}</td>
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
                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-500 border-t">
                    <div>
                        Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredTours.length)} trong số {filteredTours.length} tour
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center gap-1">
                            {/* Previous button */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded transition ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                            >
                                Trước
                            </button>

                            {/* Page numbers */}
                            {getVisiblePages().map((page, index) => (
                                page === '...' ? (
                                    <span key={`dots-${index}`} className="px-2 py-1">...</span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 rounded transition ${currentPage === page
                                                ? 'bg-[#8B1A1A] text-white'
                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                )
                            ))}

                            {/* Next button */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded transition ${currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                            >
                                Tiếp
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TourList;