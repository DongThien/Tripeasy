import React from 'react';

const BrandStory = () => (
    <section className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        {/* Left – Text */}
        <div>
            <span className="inline-block bg-red-50 text-[#8B1A1A] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Câu chuyện của chúng tôi
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-6">
                Từ niềm đam mê du lịch <br />
                <span className="text-[#8B1A1A]">đến thương hiệu tin cậy</span>
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
                Tripeasy được thành lập năm 2013 bởi một nhóm người trẻ đam mê khám phá
                vẻ đẹp Việt Nam. Khởi đầu chỉ với vài tour nhỏ tại miền Trung, chúng tôi
                dần mở rộng ra khắp 63 tỉnh thành với hàng trăm hành trình độc đáo.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
                Triết lý của chúng tôi đơn giản: mỗi chuyến đi là một câu chuyện. Chúng
                tôi không chỉ bán tour — chúng tôi kiến tạo những kỷ niệm sẽ theo bạn
                suốt cuộc đời.
            </p>
            <div className="flex items-center gap-6">
                <div>
                    <p className="text-3xl font-bold text-[#8B1A1A]">10+</p>
                    <p className="text-sm text-gray-500">Năm kinh nghiệm</p>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div>
                    <p className="text-3xl font-bold text-[#8B1A1A]">120K+</p>
                    <p className="text-sm text-gray-500">Khách hàng hài lòng</p>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div>
                    <p className="text-3xl font-bold text-[#8B1A1A]">1,000+</p>
                    <p className="text-sm text-gray-500">Tour đã thực hiện</p>
                </div>
            </div>
        </div>

        {/* Right – Overlapping Images */}
        <div className="relative h-[380px] md:h-[440px]">
            <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&w=800&q=80"
                alt="Phong cảnh núi non"
                className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-lg"
            />
            <img
                src="https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&w=420&q=80"
                alt="Thuyền buồm"
                className="absolute -bottom-8 -left-6 w-52 md:w-64 h-44 md:h-52 object-cover rounded-xl shadow-2xl border-4 border-white"
            />
            <div
                className="absolute -top-4 -right-4 w-24 h-24 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, #8B1A1A 1.5px, transparent 1.5px)',
                    backgroundSize: '10px 10px',
                }}
            />
        </div>
    </section>
);

export default BrandStory;
