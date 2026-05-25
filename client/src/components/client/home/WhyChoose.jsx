import React from 'react';
import { Headphones, BadgeDollarSign, ShieldCheck, Sparkles, MapPinned, Star } from 'lucide-react';

const WHY_ITEMS = [
    {
        icon: <Headphones className="w-7 h-7 text-white" />,
        title: 'Hỗ trợ 24/7',
        desc: 'Đội ngũ đồng hành tận tâm trước, trong và sau chuyến đi.',
        accent: 'from-[#8B1A1A] to-[#c13f3f]'
    },
    {
        icon: <BadgeDollarSign className="w-7 h-7 text-white" />,
        title: 'Giá trị minh bạch',
        desc: 'Chi phí rõ ràng, chất lượng tương xứng, tối ưu ngân sách.',
        accent: 'from-[#b83a3a] to-[#ef6a4a]'
    },
    {
        icon: <ShieldCheck className="w-7 h-7 text-white" />,
        title: 'An tâm chuẩn mực',
        desc: 'Đối tác chọn lọc, tiêu chuẩn dịch vụ nhất quán.',
        accent: 'from-[#1f6feb] to-[#4fa3ff]'
    },
];

const WhyChoose = () => (
    <section className="relative max-w-7xl mx-auto mt-32 px-4">
        <div className="absolute inset-x-6 -top-10 h-40 rounded-[32px] bg-gradient-to-r from-[#fdf2f2] via-[#fff7f0] to-[#f3f7ff] blur-2xl opacity-70" />
        <div className="relative flex flex-col items-center mb-12">
            <div className="flex items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900">
                    Vì sao nên chọn Tripeasy
                </h2>
            </div>
            <span className="block h-1 w-16 bg-[#8B1A1A] rounded mt-4" />
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-gray-500">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm">
                    <MapPinned className="h-4 w-4 text-[#8B1A1A]" />
                    50+ điểm đến
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm">
                    <Star className="h-4 w-4 text-[#8B1A1A]" />
                    98% hài lòng
                </span>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY_ITEMS.map((item, idx) => (
                <div
                    key={idx}
                    className="group relative overflow-hidden rounded-2xl bg-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                    <div className={`absolute right-0 top-0 h-24 w-24 rounded-bl-[48px] bg-gradient-to-br ${item.accent} opacity-20`} />
                    <div className="relative z-10 flex flex-col gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} shadow-lg`}>
                            {item.icon}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                            <p className="mt-2 text-base text-gray-600">{item.desc}</p>
                        </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#8B1A1A]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
            ))}
        </div>
    </section>
);

export default WhyChoose;
