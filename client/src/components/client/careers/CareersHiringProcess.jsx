import React from 'react';

const CareersHiringProcess = ({ steps }) => (
    <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="rounded-3xl border border-[#F2E9E4] bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-[#111827] md:text-4xl">Quy trình tuyển dụng</h2>
                    <p className="mt-2 text-base text-gray-600 md:text-lg">
                        Quy trình rõ ràng, minh bạch và tập trung vào tiếp cận con người phù hợp nhất.
                    </p>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-[#FDF0F0] px-4 py-3 text-sm font-semibold text-[#8B1A1A]">
                    Thời gian trung bình: 10-14 ngày
                </div>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-5">
                {steps.map((step, index) => (
                    <div key={step} className="rounded-2xl bg-[#FDFBF7] p-4 text-center shadow-sm">
                        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#8B1A1A] text-sm font-semibold text-white">
                            {index + 1}
                        </div>
                        <p className="mt-3 text-sm font-medium text-gray-700">{step}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default CareersHiringProcess;
