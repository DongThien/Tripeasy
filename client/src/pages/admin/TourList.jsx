import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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