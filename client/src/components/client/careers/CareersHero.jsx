import React from 'react';
import { Briefcase, MapPin } from 'lucide-react';

const CareersHero = () => (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#8B1A1A] via-[#a32626] to-[#7A1414] text-white">
        <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-24 -right-10 h-60 w-60 rounded-full bg-white/30" />
            <div className="absolute bottom-0 left-10 h-40 w-40 rounded-full bg-white/20" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                    <Briefcase className="h-4 w-4" />
                    Tuyển dụng Tripeasy
                </span>
                <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
                    Cùng nhau tạo ra những hành trình đáng nhớ
                </h1>
                <p className="mt-4 text-xl text-white/90">
                    Tripeasy tìm kiếm những đồng đội đam mê du lịch, yêu công nghệ và muốn tạo giá trị lâu dài cho cộng đồng.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                    <a
                        href="#open-roles"
                        className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#8B1A1A] shadow transition hover:bg-[#FDF0F0]"
                    >
                        Xem vị trí đang mở
                    </a>
                    <a
                        href="#culture"
                        className="rounded-full border border-white/70 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                        Văn hóa làm việc
                    </a>
                </div>
            </div>
            <div className="w-full max-w-sm rounded-3xl bg-white/10 p-6 shadow-xl backdrop-blur">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                        <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-white/70">Văn phòng chính</p>
                        <p className="text-lg font-semibold">Hanoi City</p>
                    </div>
                </div>
                <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-white/80">Nhân sự</span>
                        <span className="font-semibold">120+</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-white/80">Tour đối tác</span>
                        <span className="font-semibold">550+</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-white/80">Chi nhánh</span>
                        <span className="font-semibold">3 thành phố</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default CareersHero;
