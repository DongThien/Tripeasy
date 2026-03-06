import React from 'react';
import { Search } from "lucide-react";

const TourFilters = ({
    search,
    setSearch,
    region,
    setRegion,
    duration,
    setDuration,
    status,
    setStatus
}) => {
    return (
        <div className="bg-white rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 mb-6 shadow-sm">
            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 w-full md:w-1/4">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                    className="bg-transparent outline-none w-full"
                    placeholder="Tìm kiếm tour..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            <select
                className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 w-full md:w-1/4"
                value={region}
                onChange={e => setRegion(e.target.value)}
            >
                <option value="Tất cả">🗺️ Tất cả khu vực</option>
                <option value="Miền Bắc">Miền Bắc</option>
                <option value="Miền Trung">Miền Trung</option>
                <option value="Miền Nam">Miền Nam</option>
            </select>
            <select
                className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 w-full md:w-1/4"
                value={duration}
                onChange={e => setDuration(e.target.value)}
            >
                <option value="Tất cả">⏰ Tất cả thời gian</option>
                <option>1 Ngày</option>
                <option>2 Ngày 1 Đêm</option>
                <option>3 Ngày 2 Đêm</option>
                <option>4 Ngày 3 Đêm</option>
                <option>5 Ngày 4 Đêm</option>
                <option>6 Ngày 5 Đêm</option>
                <option>7 Ngày 6 Đêm</option>
            </select>
            <select
                className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 w-full md:w-1/4"
                value={status}
                onChange={e => setStatus(e.target.value)}
            >
                <option value="Tất cả">📊 Tất cả trạng thái</option>
                <option>Đang hoạt động</option>
                <option>Bản nháp</option>
            </select>
        </div>
    );
};

export default TourFilters;