import React from 'react';
import { ChevronDown } from 'lucide-react';

const TourListTopBar = () => (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 md:flex-row md:items-center md:justify-between">
        <div>
            <h2 className="text-lg font-bold text-gray-900 md:text-xl">
                Tìm thấy <span className="text-[#8B1A1A]">124</span> tour phù hợp
            </h2>
            <p className="mt-1 text-sm text-gray-500">
                Kết quả gợi ý theo điểm đến, ngân sách và phong cách du lịch.
            </p>
        </div>

        <div className="relative w-full md:w-64">
            <select className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-sm text-gray-700 outline-none transition focus:border-[#8B1A1A]">
                <option>Sắp xếp theo: Phổ biến nhất</option>
                <option>Giá thấp đến cao</option>
                <option>Giá cao đến thấp</option>
                <option>Đánh giá cao nhất</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
    </div>
);

export default TourListTopBar;