import React from 'react';
import { Heart, ShieldCheck, Smile } from 'lucide-react';

const VALUES = [
    {
        icon: <Heart className="w-8 h-8 text-[#8B1A1A]" />,
        title: 'Tận tâm phục vụ',
        desc: 'Chúng tôi đặt sự hài lòng của khách hàng lên hàng đầu, luôn sẵn sàng hỗ trợ 24/7 trong suốt hành trình của bạn.',
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-[#8B1A1A]" />,
        title: 'An toàn & Tin cậy',
        desc: 'Mọi tour đều được lên kế hoạch kỹ càng với lịch trình rõ ràng, hướng dẫn viên có kinh nghiệm và bảo hiểm đầy đủ.',
    },
    {
        icon: <Smile className="w-8 h-8 text-[#8B1A1A]" />,
        title: 'Trải nghiệm đích thực',
        desc: 'Khám phá văn hóa bản địa qua những hoạt động trải nghiệm thực tế, không chỉ đơn thuần là ngắm cảnh.',
    },
];

const CoreValues = () => (
    <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
                <span className="inline-block bg-red-50 text-[#8B1A1A] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                    Giá trị cốt lõi
                </span>
                <h2 className="text-3xl font-bold text-gray-800">Chúng tôi tin vào điều gì?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                {VALUES.map(({ icon, title, desc }) => (
                    <div
                        key={title}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-start gap-4 hover:shadow-md transition-shadow"
                    >
                        <div className="w-16 h-16 rounded-xl bg-red-50 flex items-center justify-center">
                            {icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                        <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default CoreValues;
