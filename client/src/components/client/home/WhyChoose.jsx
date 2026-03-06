import React from 'react';
import { Headphones, BadgeDollarSign, ShieldCheck } from 'lucide-react';

const WHY_ITEMS = [
    {
        icon: <Headphones className="w-7 h-7 text-[#8B1A1A]" />,
        title: 'Hỗ trợ 24/7',
        desc: 'Đội ngũ tư vấn nhiệt tình, sẵn sàng hỗ trợ bạn mọi lúc mọi nơi trong suốt hành trình.',
    },
    {
        icon: <BadgeDollarSign className="w-7 h-7 text-[#8B1A1A]" />,
        title: 'Giá tốt nhất',
        desc: 'Cam kết giá cạnh tranh nhất thị trường cùng nhiều ưu đãi hấp dẫn dành riêng cho thành viên.',
    },
    {
        icon: <ShieldCheck className="w-7 h-7 text-[#8B1A1A]" />,
        title: 'Thanh toán an toàn',
        desc: 'Hệ thống thanh toán bảo mật tuyệt đối, đa dạng phương thức thanh toán tiện lợi.',
    },
];

const WhyChoose = () => (
    <section className="max-w-7xl mx-auto mt-32 px-4">
        <div className="flex flex-col items-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
                Vì sao chọn Tripeasy?
            </h2>
            <span className="block h-1 w-16 bg-[#8B1A1A] rounded mt-4 mb-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHY_ITEMS.map((item, idx) => (
                <div
                    key={idx}
                    className="bg-white rounded-xl shadow p-8 flex flex-col items-center text-center"
                >
                    <div className="bg-red-100 rounded-full p-4 mb-4 flex items-center justify-center">
                        {item.icon}
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-500 line-clamp-2">{item.desc}</p>
                </div>
            ))}
        </div>
    </section>
);

export default WhyChoose;
