import React, { useMemo, useState } from 'react';
import ClientNavbar from '../../components/common/ClientNavbar';
import ClientFooter from '../../components/common/ClientFooter';
import TourListHero from '../../components/client/tours/TourListHero';
import TourFilterSidebar from '../../components/client/tours/TourFilterSidebar';
import TourListTopBar from '../../components/client/tours/TourListTopBar';
import TourListGrid from '../../components/client/tours/TourListGrid';
import TourListPagination from '../../components/client/tours/TourListPagination';

const mockTours = [
    {
        tour_id: 1,
        title: 'Hạ Long - Cát Bà: Khám phá Vịnh Lan Hạ',
        destination: 'Hạ Long',
        duration: '3N2Đ',
        price_adult: 3500000,
        old_price: 4200000,
        rating: 4.8,
        reviews_count: 240,
        image_url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
        badges: ['BÁN CHẠY'],
        tags: ['Du thuyền', 'Kayaking'],
    },
    {
        tour_id: 2,
        title: 'Đà Nẵng - Hội An: Hành trình di sản miền Trung',
        destination: 'Đà Nẵng',
        duration: '4N3Đ',
        price_adult: 5200000,
        old_price: 6000000,
        rating: 4.9,
        reviews_count: 185,
        image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
        badges: ['MỚI'],
        tags: ['Văn hóa', 'Ẩm thực'],
    },
    {
        tour_id: 3,
        title: 'Sapa: Săn mây trên đỉnh Fansipan',
        destination: 'Sapa',
        duration: '2N1Đ',
        price_adult: 2250000,
        old_price: 2800000,
        rating: 4.7,
        reviews_count: 112,
        image_url: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
        badges: ['ECO'],
        tags: ['Trekking', 'Thiên nhiên'],
    },
];

const ClientTourList = () => {
    const [tours] = useState(mockTours);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrigin, setSelectedOrigin] = useState('Hà Nội');
    const [selectedAreas, setSelectedAreas] = useState(['Miền Bắc']);
    const [selectedType, setSelectedType] = useState('Nghỉ dưỡng');

    const displayedTours = useMemo(() => {
        return tours.filter((tour) => {
            const matchesSearch =
                !searchQuery ||
                tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tour.destination.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesArea =
                selectedAreas.length === 0 ||
                (selectedAreas.includes('Miền Bắc') && ['Hạ Long', 'Sapa'].includes(tour.destination)) ||
                (selectedAreas.includes('Miền Trung') && ['Đà Nẵng'].includes(tour.destination)) ||
                (selectedAreas.includes('Miền Nam') && ['Phú Quốc', 'Cần Thơ'].includes(tour.destination));

            const matchesType =
                selectedType === 'Nghỉ dưỡng' ||
                selectedType === 'Khám phá' ||
                selectedType === 'Biển đảo' ||
                selectedType === 'Trekking';

            return matchesSearch && matchesArea && matchesType;
        });
    }, [selectedAreas, selectedType, searchQuery, tours]);

    const toggleArea = (area) => {
        setSelectedAreas((current) =>
            current.includes(area) ? current.filter((item) => item !== area) : [...current, area],
        );
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedOrigin('Hà Nội');
        setSelectedAreas(['Miền Bắc']);
        setSelectedType('Nghỉ dưỡng');
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
                            selectedType={selectedType}
                            onTypeChange={setSelectedType}
                            onClearFilters={handleClearFilters}
                        />

                        <div className="lg:col-span-3">
                            <TourListTopBar />

                            <TourListGrid tours={displayedTours} />

                            <TourListPagination />
                        </div>
                    </div>
                </section>
            </main>

            <ClientFooter />
        </div>
    );
};

export default ClientTourList;