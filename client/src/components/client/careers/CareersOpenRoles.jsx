import React from 'react';
import { ArrowRight } from 'lucide-react';

const CareersOpenRoles = ({ roles }) => (
    <section id="open-roles" className="bg-white/60 py-14">
        <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-[#111827] md:text-4xl">Vị trí đang mở</h2>
                    <p className="mt-2 text-base text-gray-600 md:text-lg">
                        Lựa chọn vị trí phù hợp và bắt đầu hành trình cùng Tripeasy.
                    </p>
                </div>
                <a
                    href="mailto:talent@tripeasy.vn"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#8B1A1A]"
                >
                    Gửi CV về talent@tripeasy.vn
                    <ArrowRight className="h-4 w-4" />
                </a>
            </div>

            <div className="mt-8 grid gap-4">
                {roles.map((role) => (
                    <div
                        key={role.title}
                        className="flex flex-col gap-4 rounded-2xl border border-[#F2E9E4] bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between"
                    >
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{role.title}</h3>
                            <p className="mt-2 text-sm text-gray-600">{role.description}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                            <span className="rounded-full bg-[#FDF0F0] px-3 py-1 font-semibold text-[#8B1A1A]">
                                {role.location}
                            </span>
                            <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-600">
                                {role.type}
                            </span>
                            <button
                                type="button"
                                className="rounded-full border border-[#8B1A1A] px-4 py-1.5 text-sm font-semibold text-[#8B1A1A] transition hover:bg-[#8B1A1A] hover:text-white"
                            >
                                Ứng tuyển ngay
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default CareersOpenRoles;
