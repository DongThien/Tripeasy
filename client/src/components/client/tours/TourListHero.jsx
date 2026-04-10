import React from 'react';

const TourListHero = () => (
    <section className="relative h-[320px] overflow-hidden md:h-[360px]">
        <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
            alt="Khám phá Việt Nam"
            className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
            <div>
                <h1 className="text-4xl font-bold text-white md:text-5xl">
                    Khám phá Việt Nam
                </h1>
                <p className="mt-3 inline-flex items-center rounded-full border border-white/20 bg-black/20 px-4 py-2 text-sm text-white/90 backdrop-blur-sm">
                    Trang chủ <span className="mx-2 text-white/60">/</span> Danh sách Tour
                </p>
            </div>
        </div>
    </section>
);

export default TourListHero;