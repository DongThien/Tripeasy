import React from 'react';
import { Info } from 'lucide-react';

const TourBasicInfoSection = ({ formData, handleInputChange }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-50 rounded-lg">
                    <Info className="w-5 h-5 text-[#8B1A1A]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên tour</label>
                    <input
                        type="text"
                        placeholder="Nhập tên tour"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent outline-none"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Điểm đến</label>
                        <input
                            type="text"
                            placeholder="Ví dụ: Đà Nẵng, Phú Quốc..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent outline-none"
                            value={formData.destination}
                            onChange={(e) => handleInputChange('destination', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
                        <input
                            type="text"
                            placeholder="Ví dụ: 3N2Đ"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent outline-none"
                            value={formData.duration}
                            onChange={(e) => handleInputChange('duration', e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Khu vực</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent outline-none"
                            value={formData.region}
                            onChange={(e) => handleInputChange('region', e.target.value)}
                        >
                            <option value="">Chọn khu vực</option>
                            <option value="Miền Bắc">Miền Bắc</option>
                            <option value="Miền Trung">Miền Trung</option>
                            <option value="Miền Nam">Miền Nam</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
                        <input
                            type="number"
                            min="1"
                            placeholder="Ví dụ: 20"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent outline-none"
                            value={formData.max_guests}
                            onChange={(e) => handleInputChange('max_guests', e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ngày khởi hành</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent outline-none"
                            value={formData.start_date}
                            onChange={(e) => handleInputChange('start_date', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent outline-none"
                            value={formData.end_date}
                            onChange={(e) => handleInputChange('end_date', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourBasicInfoSection;