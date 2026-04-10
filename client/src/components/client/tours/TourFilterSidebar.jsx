import React from 'react';
import { ChevronDown, Filter, Search, Star } from 'lucide-react';

const TourFilterSidebar = ({
    searchQuery,
    onSearchQueryChange,
    selectedOrigin,
    onOriginChange,
    selectedAreas,
    onToggleArea,
    selectedType,
    onTypeChange,
    onClearFilters,
}) => (
    <aside className="lg:col-span-1">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                    <Filter className="h-4.5 w-4.5 text-[#8B1A1A]" />
                    Bộ lọc tìm kiếm
                </div>
                <button
                    type="button"
                    onClick={onClearFilters}
                    className="text-sm text-gray-500 transition hover:text-[#8B1A1A]"
                >
                    Xóa lọc
                </button>
            </div>

            <div className="space-y-5">
                <div>
                    <h3 className="mb-3 font-semibold text-gray-900">Tìm nhanh</h3>
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) => onSearchQueryChange(event.target.value)}
                            placeholder="Tìm theo tour hoặc điểm đến"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#8B1A1A]"
                        />
                    </div>
                </div>

                <div>
                    <h3 className="mb-4 font-semibold text-gray-900">Khoảng giá</h3>
                    <div className="space-y-3">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            defaultValue="35"
                            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[#8B1A1A]"
                        />
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>0đ</span>
                            <span className="font-medium text-[#8B1A1A]">3.500.000đ</span>
                            <span>10tr+</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="mb-3 font-semibold text-gray-900">Điểm khởi hành</h3>
                    <div className="relative">
                        <select
                            value={selectedOrigin}
                            onChange={(event) => onOriginChange(event.target.value)}
                            className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-sm text-gray-700 outline-none transition focus:border-[#8B1A1A]"
                        >
                            <option>Hà Nội</option>
                            <option>TP. Hồ Chí Minh</option>
                            <option>Đà Nẵng</option>
                            <option>Hải Phòng</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                <div>
                    <h3 className="mb-3 font-semibold text-gray-900">Khu vực</h3>
                    <div className="space-y-3 text-sm text-gray-600">
                        {['Miền Bắc', 'Miền Trung', 'Miền Nam'].map((area) => (
                            <label key={area} className="flex cursor-pointer items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={selectedAreas.includes(area)}
                                    onChange={() => onToggleArea(area)}
                                    className="h-4 w-4 rounded border-gray-300 text-[#8B1A1A] focus:ring-[#8B1A1A]"
                                />
                                <span>{area}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="mb-3 font-semibold text-gray-900">Loại hình</h3>
                    <div className="flex flex-wrap gap-2">
                        {['Nghỉ dưỡng', 'Khám phá', 'Biển đảo', 'Trekking'].map((type) => {
                            const active = selectedType === type;

                            return (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => onTypeChange(type)}
                                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${active
                                        ? 'bg-[#8B1A1A] text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {type}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <h3 className="mb-3 font-semibold text-gray-900">Đánh giá</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        {['5 sao', '4 sao trở lên', '3 sao trở lên'].map((label, index) => (
                            <label key={label} className="flex cursor-pointer items-center gap-3">
                                <input
                                    type="radio"
                                    name="rating"
                                    defaultChecked={index === 0}
                                    className="h-4 w-4 border-gray-300 text-[#8B1A1A] focus:ring-[#8B1A1A]"
                                />
                                <span className="inline-flex items-center gap-1">
                                    <span className="inline-flex text-yellow-400">
                                        <Star className="h-4 w-4 fill-current" />
                                        <Star className="h-4 w-4 fill-current" />
                                        <Star className="h-4 w-4 fill-current" />
                                        <Star className="h-4 w-4 fill-current" />
                                        <Star className="h-4 w-4 fill-current" />
                                    </span>
                                    {label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </aside>
);

export default TourFilterSidebar;