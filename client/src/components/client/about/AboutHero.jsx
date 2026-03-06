import React from 'react';

const AboutHero = () => (
    <section
        className="relative h-[500px] flex items-center justify-center text-white"
        style={{
            backgroundImage:
                "url('https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&w=1920&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
    >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 text-center px-4 max-w-3xl">
            <p className="uppercase tracking-widest text-sm text-orange-300 font-semibold mb-4">
                Khám phá Việt Nam cùng chúng tôi
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
                Về Tripeasy — Người bạn đồng hành tin cậy
            </h1>
            <p className="text-lg text-gray-200 max-w-xl mx-auto">
                Hơn 10 năm đồng hành cùng hàng nghìn du khách, Tripeasy mang đến những
                hành trình đáng nhớ với dịch vụ tận tâm và trải nghiệm văn hóa sâu sắc.
            </p>
        </div>
    </section>
);

export default AboutHero;
