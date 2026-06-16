import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, Printer } from "lucide-react";
import toast from "react-hot-toast";
import tourService from "../../services/tourService";
import TourStats from "../../components/admin/tours/TourStats";
import TourFilters from "../../components/admin/tours/TourFilters";
import TourTable from "../../components/admin/tours/TourTable";
import AdminPagination from "../../components/admin/common/AdminPagination";

const TourList = () => {
    const [tours, setTours] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Filter state
    const [search, setSearch] = useState("");
    const [region, setRegion] = useState("Tất cả");
    const [status, setStatus] = useState("Tất cả");
    const [duration, setDuration] = useState("Tất cả");
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [isImporting, setIsImporting] = useState(false);

    const fetchTours = async () => {
        setIsLoading(true);
        try {
            console.log("🚀 Fetching tours from API...");
            const response = await tourService.getAllTours();
            console.log("📊 Data from API:", response);

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

    useEffect(() => {
        fetchTours();
    }, []);

    const handleImportExcel = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        const toastId = toast.loading("Đang import tour...");

        try {
            const res = await tourService.importToursFromExcel(file);
            if (res?.success) {
                toast.success(`Đã import ${res.imported || 0} tour`, { id: toastId });
                await fetchTours();
            } else {
                toast.error(res?.message || "Import thất bại", { id: toastId });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Import thất bại", { id: toastId });
        } finally {
            setIsImporting(false);
            e.target.value = "";
        }
    };

    const handleExportCSV = () => {
        if (filteredTours.length === 0) {
            toast.error("Không có dữ liệu để xuất!");
            return;
        }

        const headers = [
            "Mã Tour",
            "Tên Tour",
            "Điểm Khởi Hành",
            "Điểm Đến",
            "Thời Lượng",
            "Giá Người Lớn (VND)",
            "Giá Trẻ Em (VND)",
            "Đánh Giá",
            "Số Lượt Đánh Giá",
            "Trạng Thái"
        ];

        const rows = filteredTours.map(t => [
            `TRP-${t.tour_id}`,
            t.title || '',
            t.start_location || '',
            t.destination || '',
            t.duration || '',
            t.price_adult || 0,
            t.price_child || 0,
            t.rating_avg || 0,
            t.review_count || 0,
            t.availability ? 'Đang hoạt động' : 'Bản nháp'
        ]);

        const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Tripeasy_Tours_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Xuất file Excel thành công!");
    };

    const handlePrintList = (titlePrefix = "Báo Cáo") => {
        if (filteredTours.length === 0) {
            toast.error("Không có dữ liệu để in!");
            return;
        }

        const printWindow = window.open('', '_blank', 'width=1100,height=850');
        
        let rowsHtml = '';
        filteredTours.forEach((t, index) => {
            rowsHtml += `
                <tr>
                    <td style="text-align: center;">${index + 1}</td>
                    <td style="font-weight: bold; color: #8B1A1A;">TRP-${t.tour_id}</td>
                    <td style="font-weight: bold;">${t.title || ''}</td>
                    <td>${t.start_location || ''}</td>
                    <td>${t.destination || ''}</td>
                    <td style="text-align: center;">${t.duration || ''}</td>
                    <td style="text-align: right; font-weight: bold; color: #8B1A1A;">${(t.price_adult || 0).toLocaleString('vi-VN')}đ</td>
                    <td style="text-align: center;">${t.rating_avg || '0.0'} (${t.review_count || 0})</td>
                    <td style="text-align: center;">${t.availability ? 'Đang hoạt động' : 'Bản nháp'}</td>
                </tr>
            `;
        });

        const printHtml = `
            <html>
            <head>
                <title>${titlePrefix} Danh Sách Tour Tripeasy</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 25px; color: #333; }
                    .header { border-bottom: 2px solid #8B1A1A; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
                    .logo { font-size: 24px; font-weight: 800; color: #8B1A1A; letter-spacing: 0.5px; }
                    .title { font-size: 20px; font-weight: bold; text-transform: uppercase; color: #111; margin-bottom: 5px; }
                    .meta-info { font-size: 12px; color: #666; }
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    th { background-color: #f7f7f7; border: 1px solid #ddd; padding: 10px; font-size: 12px; font-weight: bold; color: #444; }
                    td { border: 1px solid #ddd; padding: 10px; font-size: 12px; color: #333; }
                    tr:nth-child(even) { background-color: #fafafa; }
                    .footer { margin-top: 40px; text-align: right; font-size: 12px; color: #888; }
                    @media print {
                        body { padding: 10px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="no-print" style="text-align: right; margin-bottom: 15px;">
                    <button onclick="window.print()" style="background: #8B1A1A; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 13px;">In danh sách (Print)</button>
                </div>
                <div class="header">
                    <div>
                        <div class="title">${titlePrefix} Danh Sách Tour Du Lịch</div>
                        <div class="meta-info">Số lượng tour: <strong>${filteredTours.length}</strong> &nbsp;|&nbsp; Ngày lập: <strong>${new Date().toLocaleDateString('vi-VN')}</strong></div>
                    </div>
                    <div class="logo">TRIPEASY</div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 40px;">STT</th>
                            <th style="width: 80px;">Mã Tour</th>
                            <th>Tên Tour</th>
                            <th style="width: 100px;">Khởi Hành</th>
                            <th>Điểm Đến</th>
                            <th style="width: 90px;">Thời Lượng</th>
                            <th style="width: 110px; text-align: right;">Giá Người Lớn</th>
                            <th style="width: 100px;">Đánh Giá</th>
                            <th style="width: 110px;">Trạng Thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
                <div class="footer">
                    Ban Quản trị Tripeasy
                </div>
                <script>
                    window.onload = () => {
                        setTimeout(() => { window.print(); }, 300);
                    };
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(printHtml);
        printWindow.document.close();
    };

    // Computed values for stats
    const activeTours = tours.filter(t => t.availability === true).length;
    const draftTours = tours.length - activeTours;

    // Optional: Filter logic (if needed)
    const filteredTours = Array.isArray(tours) ? tours.filter(tour => {
        const matchSearch = tour.title?.toLowerCase().includes(search.toLowerCase());
        const matchRegion = region === "Tất cả" || tour.region === region;
        const matchStatus = status === "Tất cả" || (status === "Đang hoạt động" ? tour.availability === true : tour.availability === false);
        const matchDuration = duration === "Tất cả" || tour.duration === duration;
        return matchSearch && matchRegion && matchStatus && matchDuration;
    }) : [];

    // Pagination calculations
    const totalPages = Math.ceil(filteredTours.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTours = filteredTours.slice(startIndex, endIndex);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, region, status, duration]);

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
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors shadow-sm hover:text-[#8B1A1A] font-semibold"
                    >
                        <Sheet size={15} />
                        Excel
                    </button>
                    <button
                        onClick={() => handlePrintList("Danh Sách")}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors shadow-sm hover:text-[#8B1A1A] font-semibold"
                    >
                        <Printer size={15} />
                        In
                    </button>
                    <label
                        htmlFor="tour-import-input"
                        className="bg-white text-[#8B1A1A] border border-[#8B1A1A] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-red-50 transition cursor-pointer"
                    >
                        {isImporting ? "Đang import..." : "Import Excel"}
                    </label>
                    <input
                        id="tour-import-input"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleImportExcel}
                        className="hidden"
                        disabled={isImporting}
                    />
                    <Link
                        to="/admin/tours/add"
                        className="bg-[#8B1A1A] text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#a83232] transition"
                    >
                        + Thêm Tour mới
                    </Link>
                </div>
            </div>

            {/* Tour Stats */}
            <TourStats
                totalTours={tours.length}
                activeTours={activeTours}
                draftTours={draftTours}
            />

            {/* Tour Filters */}
            <TourFilters
                search={search}
                setSearch={setSearch}
                region={region}
                setRegion={setRegion}
                duration={duration}
                setDuration={setDuration}
                status={status}
                setStatus={setStatus}
            />

            {/* Tour Table */}
            <TourTable
                isLoading={isLoading}
                currentTours={currentTours}
                filteredLength={filteredTours.length}
                onTourUpdated={(updated) =>
                    setTours(prev => prev.map(t => t.tour_id === updated.tour_id ? updated : t))
                }
                onTourDeleted={(deletedId) =>
                    setTours(prev => prev.filter(t => t.tour_id !== deletedId))
                }
            />

            {/* Tour Pagination */}
            <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                startIndex={startIndex}
                endIndex={endIndex}
                filteredLength={filteredTours.length}
                onPageChange={handlePageChange}
                getVisiblePages={getVisiblePages}
                itemLabel="tour"
            />
        </div>
    );
};

export default TourList;