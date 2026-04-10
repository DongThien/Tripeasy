import React, { useEffect, useMemo, useState } from 'react';
import ClientNavbar from '../../components/common/ClientNavbar';
import ClientFooter from '../../components/common/ClientFooter';
import TourDetailHeaderGallery from '../../components/client/tourDetail/TourDetailHeaderGallery';
import TourDetailTabs from '../../components/client/tourDetail/TourDetailTabs';
import TourDetailHighlights from '../../components/client/tourDetail/TourDetailHighlights';
import TourDetailItinerary from '../../components/client/tourDetail/TourDetailItinerary';
import TourDetailServices from '../../components/client/tourDetail/TourDetailServices';
import TourDetailReviews from '../../components/client/tourDetail/TourDetailReviews';
import TourDetailBookingSidebar from '../../components/client/tourDetail/TourDetailBookingSidebar';
import TourDetailRelated from '../../components/client/tourDetail/TourDetailRelated';

const mockTourDetail = {
    id: 1,
    title: 'Hành trình Di sản: Đà Nẵng - Hội An - Bà Nà Hills',
    rating: 4.8,
    reviews_count: 342,
    duration: '4 Ngày 3 Đêm',
    start_location: 'Hà Nội',
    transport: 'Máy bay',
    images: [
        'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?auto=format&fit=crop&w=900&q=80',
    ],
    highlights: [
        {
            icon: 'CheckCircle',
            title: 'Check-in Cầu Vàng',
            desc: 'Chiêm ngưỡng tuyệt tác kiến trúc giữa lưng chừng mây núi.',
        },
        {
            icon: 'CheckCircle',
            title: 'Ẩm thực đặc sắc',
            desc: 'Thưởng thức Bánh tráng cuốn thịt heo, Mì Quảng, Cao lầu.',
        },
        {
            icon: 'CheckCircle',
            title: 'Khách sạn 4 sao',
            desc: 'Nghỉ dưỡng tại khách sạn ven biển tiện nghi, sang trọng.',
        },
        {
            icon: 'CheckCircle',
            title: 'Thuyền thả hoa đăng',
            desc: 'Trải nghiệm đêm lãng mạn dọc sông Hoài thơ mộng.',
        },
    ],
    itinerary: [
        {
            day: 1,
            title: 'Đón sân bay - Bán đảo Sơn Trà',
            content:
                'Xe và HDV đón quý khách tại sân bay Đà Nẵng. Khởi hành đi Bán đảo Sơn Trà, viếng Linh Ứng Tự, ngắm toàn cảnh thành phố và biển Mỹ Khê.',
            images: [
                'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=500&q=80',
            ],
        },
        {
            day: 2,
            title: 'Bà Nà Hills - Cầu Vàng - Phố cổ Hội An',
            content:
                'Khởi hành đi khu du lịch Bà Nà - Núi Chúa. Ngồi cáp treo đạt 2 kỷ lục thế giới. Chiêm ngưỡng Cầu Vàng và buổi tối khám phá phố cổ Hội An.',
            images: [
                'https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=500&q=80',
            ],
        },
        {
            day: 3,
            title: 'Cù Lao Chàm - Lặn ngắm san hô',
            content:
                'Lên cano cao tốc đi Cù Lao Chàm. Tham quan khu bảo tồn biển, giếng cổ Chăm, chùa Hải Tạng. Tự do tắm biển và lặn ngắm san hô.',
            images: [
                'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=500&q=80',
            ],
        },
        {
            day: 4,
            title: 'Mua sắm đặc sản - Tiễn sân bay',
            content:
                'Dùng điểm tâm sáng, tham quan và mua sắm đặc sản Đà Nẵng tại chợ Hàn. Xe đưa quý khách ra sân bay, kết thúc chương trình.',
            images: [
                'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=500&q=80',
            ],
        },
    ],
    included: [
        'Vé máy bay khứ hồi Hà Nội - Đà Nẵng',
        'Xe du lịch đời mới đưa đón theo lịch trình',
        'Khách sạn 4 sao (2 người/phòng)',
        'Các bữa ăn theo chương trình',
        'Vé tham quan các điểm trong lịch trình',
        'Hướng dẫn viên nhiệt tình, kinh nghiệm',
    ],
    excluded: ['Chi phí cá nhân (giặt ủi, điện thoại...)', 'Thuế VAT 8%'],
    price_adult: 5990000,
    price_child: 4500000,
    old_price: 6500000,
};

const relatedTours = [
    {
        tour_id: 101,
        title: 'Du thuyền Hạ Long: Khám phá kỳ quan thiên nhiên',
        destination: 'Hạ Long',
        duration: '2N1Đ',
        price_adult: 2990000,
        old_price: 3500000,
        rating: 4.8,
        reviews_count: 220,
        image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
        badges: ['-15%'],
        tags: ['Du thuyền', 'Hạ Long'],
    },
    {
        tour_id: 102,
        title: 'Sapa: Chinh phục đỉnh Fansipan - Thành phố trong sương',
        destination: 'Sapa',
        duration: '3N2Đ',
        price_adult: 3250000,
        old_price: null,
        rating: 4.7,
        reviews_count: 96,
        image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80',
        badges: ['MỚI'],
        tags: ['Trekking', 'Núi rừng'],
    },
    {
        tour_id: 103,
        title: 'Ninh Bình: Tràng An - Bái Đính - Tuyệt tình cốc',
        destination: 'Ninh Bình',
        duration: '1 Ngày',
        price_adult: 790000,
        old_price: null,
        rating: 4.9,
        reviews_count: 210,
        image_url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80',
        badges: [],
        tags: ['Tâm linh', 'Hang động'],
    },
];

const TourDetail = () => {
    const [tour, setTour] = useState(mockTourDetail);
    const [adultCount, setAdultCount] = useState(2);
    const [childCount, setChildCount] = useState(0);
    const [departureDate, setDepartureDate] = useState('2026-11-11');
    const [activeTab, setActiveTab] = useState('Tổng quan');

    const totalPrice = useMemo(
        () => adultCount * tour.price_adult + childCount * tour.price_child,
        [adultCount, childCount, tour.price_adult, tour.price_child],
    );

    useEffect(() => {
        setTour(mockTourDetail);
    }, [setTour]);

    const decreaseAdult = () => setAdultCount((prev) => Math.max(1, prev - 1));
    const increaseAdult = () => setAdultCount((prev) => prev + 1);
    const decreaseChild = () => setChildCount((prev) => Math.max(0, prev - 1));
    const increaseChild = () => setChildCount((prev) => prev + 1);

    return (
        <div className="min-h-screen bg-[#F5F3F2]">
            <ClientNavbar />

            <main className="mx-auto max-w-7xl px-4 pb-16 pt-20 md:px-6 lg:px-8">
                <TourDetailHeaderGallery tour={tour} />

                <section className="mt-8 grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <TourDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
                        <TourDetailHighlights highlights={tour.highlights} />
                        <TourDetailItinerary itinerary={tour.itinerary} />
                        <TourDetailServices included={tour.included} excluded={tour.excluded} />
                        <TourDetailReviews />
                    </div>

                    <TourDetailBookingSidebar
                        tour={tour}
                        departureDate={departureDate}
                        onDepartureDateChange={setDepartureDate}
                        adultCount={adultCount}
                        childCount={childCount}
                        onDecreaseAdult={decreaseAdult}
                        onIncreaseAdult={increaseAdult}
                        onDecreaseChild={decreaseChild}
                        onIncreaseChild={increaseChild}
                        totalPrice={totalPrice}
                    />
                </section>

                <TourDetailRelated tours={relatedTours} />
            </main>

            <ClientFooter />
        </div>
    );
};

export default TourDetail;