import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const CareersCulture = ({ benefits }) => (
    <section id="culture" className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
                <h2 className="text-3xl font-bold text-[#111827] md:text-4xl">Văn hóa làm việc tại Tripeasy</h2>
                <p className="mt-4 text-base text-gray-600 md:text-lg">
                    Chúng tôi tin vào sự minh bạch, hợp tác và đặt khách hàng làm trung tâm. Mỗi thành viên đều có quyền
                    đóng góp ý tưởng, tham gia vào quy trình phát triển sản phẩm và được trao quyền để tạo ra giải pháp
                    mới.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {benefits.map((benefit) => {
                        const Icon = benefit.icon;
                        return (
                            <div
                                key={benefit.title}
                                className="rounded-2xl border border-[#F2E9E4] bg-white p-4 shadow-sm"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDF0F0] text-[#8B1A1A]">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="mt-4 text-base font-semibold text-gray-900">{benefit.title}</h3>
                                <p className="mt-2 text-sm text-gray-600">{benefit.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="rounded-3xl bg-[#111827] p-8 text-white shadow-xl">
                <h3 className="text-2xl font-semibold">Giá trị chung</h3>
                <ul className="mt-6 space-y-4 text-sm text-white/80 md:text-base">
                    {[
                        'Chủ động giải quyết vấn đề thay vì chờ đợi',
                        'Tinh thần hỗ trợ và phối hợp liên phòng ban',
                        'Tập trung vào chất lượng dịch vụ và trải nghiệm người dùng',
                        'Luôn học hỏi để mở rộng góc nhìn và khả năng',
                    ].map((item) => (
                        <li key={item} className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#F8B4B4]" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-8 rounded-2xl bg-white/10 p-4 text-sm">
                    <p className="font-semibold">"Mỗi chuyến đi là một dự án, mỗi đồng đội là một người kể chuyện"</p>
                    <p className="mt-2 text-white/70">Trần Minh, COO</p>
                </div>
            </div>
        </div>
    </section>
);

export default CareersCulture;
