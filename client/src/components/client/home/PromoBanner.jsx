import React from 'react';

const PromoBanner = () => (
    <section className="max-w-7xl mx-auto mt-20 px-4">
        <div
            className="relative rounded-2xl overflow-hidden h-56 md:h-64 flex items-center justify-center"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80')",
            }}
        >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center">
                <span className="inline-block bg-[#8B1A1A] text-white text-xs font-bold px-4 py-1 rounded-full mb-3">
                    KHUYẾN MÃI ĐẶC BIỆT
                </span>
                <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
                    Hè rực rỡ - Giảm tới 30%
                </h2>
                <p className="text-white mb-4">
                    Đặt tour trước 30 ngày để nhận ưu đãi đặc biệt cho mùa hè này. Số lượng có hạn.
                </p>
                <button className="bg-white text-[#1a1a1a] font-bold px-6 py-2 rounded-full shadow hover:bg-gray-100 transition">
                    Săn Deal Ngay
                </button>
            </div>
        </div>
    </section>
);

export default PromoBanner;
