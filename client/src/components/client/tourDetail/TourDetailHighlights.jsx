import React from 'react';
import { Check } from 'lucide-react';

const TourDetailHighlights = ({ highlights }) => (
    <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 md:p-6">
        <h2 className="text-2xl font-bold text-gray-900">Điểm nhấn hành trình</h2>
        <p className="mt-2 text-gray-600">
            Khám phá vẻ đẹp di sản miền Trung trong hành trình 4 ngày 3 đêm đầy thú vị.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
            {highlights.map((highlight) => (
                <article key={highlight.title} className="rounded-lg bg-[#FAF8F8] p-4 ring-1 ring-gray-100">
                    <div className="flex items-start gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#8B1A1A]/10 text-[#8B1A1A]">
                            <Check className="h-4.5 w-4.5" />
                        </span>
                        <div>
                            <h3 className="font-semibold text-gray-900">{highlight.title}</h3>
                            <p className="mt-1 text-sm text-gray-600">{highlight.desc}</p>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    </section>
);

export default TourDetailHighlights;