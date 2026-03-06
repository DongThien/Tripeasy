import React from 'react';
import { Link } from 'react-router-dom';
import { PlaneTakeoff } from 'lucide-react';

const AboutCTA = () => (
    <section className="bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Sẵn sàng bắt đầu hành trình?
            </h2>
            <p className="text-gray-500 mb-8 text-lg">
                Hãy để Tripeasy đồng hành cùng bạn trong chuyến phiêu lưu tiếp theo. Hàng nghìn
                tour đang chờ bạn khám phá!
            </p>
            <Link
                to="/client/tours"
                className="inline-flex items-center gap-3 bg-[#8B1A1A] hover:bg-[#7a1616] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
                Đặt tour ngay
                <PlaneTakeoff className="w-5 h-5" />
            </Link>
        </div>
    </section>
);

export default AboutCTA;
