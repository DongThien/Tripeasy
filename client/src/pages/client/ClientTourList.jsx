import React, { useMemo, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import ClientNavbar from '../../components/common/ClientNavbar';
import ClientFooter from '../../components/common/ClientFooter';
import TourListHero from '../../components/client/tours/TourListHero';
import TourFilterSidebar from '../../components/client/tours/TourFilterSidebar';
import TourListTopBar from '../../components/client/tours/TourListTopBar';
import TourListGrid from '../../components/client/tours/TourListGrid';
import TourListPagination from '../../components/client/tours/TourListPagination';
import tourService from '../../services/tourService';
import TourListSkeleton from '../../components/client/tours/TourListSkeleton';

const ClientTourList = () => {
    // State Management
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrigin, setSelectedOrigin] = useState(''); // Empty by default to show all tours
    const [selectedAreas, setSelectedAreas] = useState([]); // Empty by default to show all tours
    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const [selectedType, setSelectedType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSort, setSelectedSort] = useState('Phổ biến nhất');

    // Fetch tours from API
    useEffect(() => {
        const fetchTours = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await tourService.getAllTours();
                console.log('Fetched tours:', data);

                // Đảm bảo là mảng
                const toursArray = Array.isArray(data) ? data : [];
                setTours(toursArray);
            } catch (err) {
                console.error('Error fetching tours:', err);
                setError('Không thể tải danh sách tour. Vui lòng thử lại sau.');
                toast.error('❌ Lỗi tải tour: ' + (err.message || 'Không xác định'));
            } finally {
                setLoading(false);
            }
        };

        fetchTours();
    }, []);

    // Filter tours based on user selections
    const filteredTours = useMemo(() => {
        return tours.filter((tour) => {
            // Search filter
            const matchesSearch =
                !searchQuery ||
                tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tour.destination.toLowerCase().includes(searchQuery.toLowerCase());

            // Price filter
            const matchesPrice =
                tour.price_adult >= priceRange[0] && tour.price_adult <= priceRange[1];

            // Area filter (nếu có region từ backend)
            const matchesArea =
                selectedAreas.length === 0 ||
                selectedAreas.some((area) => {
                    // Map region từ DB với khu vực hiển thị
                    if (area === 'Miền Bắc') return ['Hạ Long', 'Sapa', 'Hà Nội', 'Quảng Ninh', 'Lào Cai'].includes(tour.destination);
                    if (area === 'Miền Trung') return ['Đà Nẵng', 'Huế', 'Hội An', 'Quảng Nam'].includes(tour.destination);
                    if (area === 'Miền Nam') return ['Phú Quốc', 'Cần Thơ', 'TP. Hồ Chí Minh', 'Kiên Giang'].includes(tour.destination);
                    return true;
                });

            // Origin filter - map origin to regions
            const matchesOrigin = (() => {
                if (!selectedOrigin) return true; // No filter if origin not selected
                if (selectedOrigin === 'Hà Nội') {
                    return ['Hạ Long', 'Sapa', 'Hà Nội', 'Quảng Ninh', 'Lào Cai', 'Đà Nẵng', 'Huế'].includes(tour.destination);
                }
                if (selectedOrigin === 'TP. Hồ Chí Minh') {
                    return ['Phú Quốc', 'Cần Thơ', 'TP. Hồ Chí Minh', 'Kiên Giang', 'Đà Nẵng'].includes(tour.destination);
                }
                if (selectedOrigin === 'Đà Nẵng') {
                    return ['Đà Nẵng', 'Huế', 'Hội An', 'Quảng Nam', 'Sapa', 'Hạ Long'].includes(tour.destination);
                }
                if (selectedOrigin === 'Hải Phòng') {
                    return ['Hạ Long', 'Hà Nội', 'Quảng Ninh', 'Lào Cai', 'Sapa'].includes(tour.destination);
                }
                return true;
            })();

            return matchesSearch && matchesPrice && matchesArea && matchesOrigin;
        });
    }, [selectedAreas, selectedOrigin, selectedType, searchQuery, tours, priceRange]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredTours.length]);

    // Sort filtered tours
    const sortedTours = useMemo(() => {
        const sorted = [...filteredTours];
        if (selectedSort === 'Giá thấp đến cao') {
            return sorted.sort((a, b) => a.price_adult - b.price_adult);
        } else if (selectedSort === 'Giá cao đến thấp') {
            return sorted.sort((a, b) => b.price_adult - a.price_adult);
        } else if (selectedSort === 'Đánh giá cao nhất') {
            return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }
        // Default: Phổ biến nhất (keep original order)
        return sorted;
    }, [filteredTours, selectedSort]);

    // Paginate sorted tours
    const ITEMS_PER_PAGE = 9;
    const totalPages = Math.ceil(sortedTours.length / ITEMS_PER_PAGE);
    const displayedTours = useMemo(() => {
        const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedTours.slice(startIdx, startIdx + ITEMS_PER_PAGE);
    }, [sortedTours, currentPage]);

    // Filter handlers
    const toggleArea = (area) => {
        setSelectedAreas((current) =>
            current.includes(area) ? current.filter((item) => item !== area) : [...current, area]
        );
    };

    const handlePriceChange = (min, max) => {
        setPriceRange([min, max]);
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedOrigin(''); // Clear to show all tours
        setSelectedAreas([]); // Clear areas filter to show all tours
        setPriceRange([0, 10000000]);
        setSelectedType('');
        setSelectedSort('Phổ biến nhất'); // Reset sort to default
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <ClientNavbar />

            <main className="pt-16">
                <TourListHero />

                <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
                    <div className="grid gap-6 lg:grid-cols-4">
                        <TourFilterSidebar
                            searchQuery={searchQuery}
                            onSearchQueryChange={setSearchQuery}
                            selectedOrigin={selectedOrigin}
                            onOriginChange={setSelectedOrigin}
                            selectedAreas={selectedAreas}
                            onToggleArea={toggleArea}
                            priceRange={priceRange}
                            onPriceChange={handlePriceChange}
                            selectedType={selectedType}
                            onTypeChange={setSelectedType}
                            onClearFilters={handleClearFilters}
                        />

                        <div className="lg:col-span-3">
                            <TourListTopBar
                                totalTours={filteredTours.length}
                                selectedSort={selectedSort}
                                onSortChange={setSelectedSort}
                            />

                            {/* Loading State */}
                            {loading ? (
                                <TourListSkeleton />
                            ) : error ? (
                                // Error State
                                <div className="rounded-lg bg-red-50 p-8 text-center">
                                    <p className="text-lg font-semibold text-red-700">❌ {error}</p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="mt-4 rounded-lg bg-red-600 px-6 py-2 text-white transition hover:bg-red-700"
                                    >
                                        Thử lại
                                    </button>
                                </div>
                            ) : displayedTours.length === 0 ? (
                                // Empty State
                                <div className="rounded-lg bg-gray-50 p-12 text-center">
                                    <svg
                                        className="mx-auto h-16 w-16 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                        />
                                    </svg>
                                    <p className="mt-4 text-lg font-semibold text-gray-900">
                                        Hiện chưa có tour nào phù hợp
                                    </p>
                                    <p className="mt-2 text-sm text-gray-600">
                                        Hãy thử thay đổi các bộ lọc để tìm tour yêu thích của bạn
                                    </p>
                                    <button
                                        onClick={handleClearFilters}
                                        className="mt-4 rounded-lg bg-[#8B1A1A] px-6 py-2 text-white transition hover:bg-[#a62a2a]"
                                    >
                                        Xóa bộ lọc
                                    </button>
                                </div>
                            ) : (
                                // Tour Grid
                                <>
                                    <TourListGrid tours={displayedTours} />
                                    <TourListPagination
                                        totalTours={filteredTours.length}
                                        currentPage={currentPage}
                                        onPageChange={setCurrentPage}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <ClientFooter />
        </div>
    );
};

export default ClientTourList;