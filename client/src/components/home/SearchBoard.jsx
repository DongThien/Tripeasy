import React from 'react';
import { MapPin, Calendar, Wallet } from "lucide-react";

const SearchBoard = () => (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-[-40px] w-full max-w-4xl z-20">
        <div className="bg-white rounded-xl shadow-xl flex divide-x divide-gray-200">
            {/* Điểm đến */}
            <div className="flex-1 flex items-center gap-2 px-5 py-4">
                <MapPin className="w-5 h-5 text-[#8B1A1A]" />
                <input
                    type="text"
                    placeholder="Bạn muốn đi đâu?"
                    className="outline-none w-full bg-transparent text-gray-900 placeholder-gray-400"
                />
            </div>
            {/* Ngày đi */}
            <div className="flex-1 flex items-center gap-2 px-5 py-4">
                <Calendar className="w-5 h-5 text-[#8B1A1A]" />
                <input
                    type="date"
                    className="outline-none w-full bg-transparent text-gray-900"
                />
            </div>
            {/* Ngân sách */}
            <div className="flex-1 flex items-center gap-2 px-5 py-4">
                <Wallet className="w-5 h-5 text-[#8B1A1A]" />
                <select className="outline-none w-full bg-transparent text-gray-900">
                    <option>Tất cả mức giá</option>
                    <option>Dưới 2 triệu</option>
                    <option>2-5 triệu</option>
                    <option>Trên 5 triệu</option>
                </select>
            </div>
            {/* Nút tìm kiếm */}
            <div className="flex items-center justify-center px-5 py-4">
                <button className="bg-[#8B1A1A] hover:bg-[#a83232] text-white font-bold px-7 py-3 rounded-lg text-lg shadow transition">
                    Tìm kiếm
                </button>
            </div>
        </div>
    </div>
);

export default SearchBoard;
