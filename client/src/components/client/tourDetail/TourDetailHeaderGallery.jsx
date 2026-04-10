import React from 'react';
import {
    ChevronRight,
    Clock,
    Heart,
    MapPin,
    Plane,
    Share2,
    Star,
} from 'lucide-react';

const TourDetailHeaderGallery = ({ tour }) => (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 md:p-6">
        <nav className="mb-4 flex items-center gap-2 text-sm text-gray-500">
            <span>Trang chủ</span>
            <ChevronRight className="h-4 w-4" />
            <span>Tour Miền Trung</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-700">Đà Nẵng - Hội An</span>
        </nav>

        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                    {tour.title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1.5">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {tour.rating} ({tour.reviews_count} đánh giá)
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-[#8B1A1A]" />
                        {tour.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-[#8B1A1A]" />
                        Khởi hành: {tour.start_location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <Plane className="h-4 w-4 text-[#8B1A1A]" />
                        Phương tiện: {tour.transport}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-[#8B1A1A] hover:text-[#8B1A1A]">
                    <Heart className="h-4 w-4" />
                    Yêu thích
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-[#8B1A1A] hover:text-[#8B1A1A]">
                    <Share2 className="h-4 w-4" />
                    Chia sẻ
                </button>
            </div>
        </div>

        <div className="grid gap-3 md:h-[420px] md:grid-cols-2">
            <div className="h-64 overflow-hidden rounded-xl md:h-full">
                <img
                    src={tour.images[0]}
                    alt="Ảnh tour chính"
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="grid h-64 grid-cols-2 gap-3 sm:h-80 md:h-full md:grid-rows-2">
                {tour.images.slice(1, 5).map((image, index) => {
                    const isLast = index === 3;

                    return (
                        <div key={image} className="relative h-full min-h-0 overflow-hidden rounded-xl">
                            <img
                                src={image}
                                alt={`Ảnh tour ${index + 2}`}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            {isLast ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                                    <button className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-800 backdrop-blur-sm transition hover:bg-white">
                                        Xem tất cả ảnh
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </div>
    </section>
);

export default TourDetailHeaderGallery;