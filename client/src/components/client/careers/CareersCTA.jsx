import React from 'react';

const CareersCTA = () => (
    <section className="bg-[#111827] py-14">
        <div className="mx-auto max-w-6xl px-6 text-white">
            <div className="grid gap-6 rounded-3xl bg-gradient-to-r from-[#8B1A1A] via-[#a32626] to-[#7A1414] p-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
                <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide">
                        Tuyển dụng 2026
                    </span>
                    <h2 className="mt-4 text-3xl font-bold md:text-4xl">Sẵn sàng gia nhập Tripeasy?</h2>
                    <p className="mt-3 text-white/85">
                        Gửi CV hoặc kết nối để được tư vấn vị trí phù hợp nhất cùng đội ngũ nhân sự.
                    </p>
                </div>
                <div className="flex flex-col gap-3 md:items-end">
                    <a
                        href="mailto:talent@tripeasy.vn"
                        className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#8B1A1A] shadow transition hover:bg-[#FDF0F0] md:w-auto"
                    >
                        Liên hệ tuyển dụng
                    </a>
                    <a
                        href="#open-roles"
                        className="inline-flex w-full items-center justify-center rounded-full border border-white/70 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 md:w-auto"
                    >
                        Xem vị trí
                    </a>
                </div>
            </div>
        </div>
    </section>
);

export default CareersCTA;
