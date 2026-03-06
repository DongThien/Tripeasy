import React from 'react';
import SearchBoard from './SearchBoard';

const HeroSection = () => (
    <section className="relative h-[500px] w-full">
        <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')",
            }}
        >
            <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 text-center drop-shadow-lg">
                Khám phá vẻ đẹp Việt Nam
            </h1>
            <p className="text-white text-lg md:text-xl font-medium text-center drop-shadow">
                Trải nghiệm những hành trình tuyệt vời nhất cùng Tripeasy – Nơi cảm xúc thăng hoa.
            </p>
        </div>
        <SearchBoard />
    </section>
);

export default HeroSection;
