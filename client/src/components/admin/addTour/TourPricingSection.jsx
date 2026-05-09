import React from 'react';
import { DollarSign } from 'lucide-react';

const TourPricingSection = ({ formData, handleInputChange }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-[#8B1A1A]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Giá tour (VND)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giá gốc (Giá cũ)</label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#8B1A1A] transition-colors">
                        <input
                            type="text"
                            placeholder="3,000,000"
                            className="w-full px-3 py-2 outline-none border-none text-gray-500 line-through"
                            value={formData.old_price}
                            onChange={(e) => handleInputChange('old_price', e.target.value)}
                        />
                        <span className="px-3 py-2 bg-gray-50 text-gray-500 text-sm border-l border-gray-200">VND</span>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giá người lớn (Bán ra)</label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#8B1A1A] transition-colors">
                        <input
                            type="text"
                            placeholder="2,500,000"
                            className="w-full px-3 py-2 outline-none border-none font-bold text-[#8B1A1A]"
                            value={formData.price_adult}
                            onChange={(e) => handleInputChange('price_adult', e.target.value)}
                        />
                        <span className="px-3 py-2 bg-gray-50 text-gray-500 text-sm border-l border-gray-200">VND</span>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giá trẻ em</label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#8B1A1A] transition-colors">
                        <input
                            type="text"
                            placeholder="1,800,000"
                            className="w-full px-3 py-2 outline-none border-none"
                            value={formData.price_child}
                            onChange={(e) => handleInputChange('price_child', e.target.value)}
                        />
                        <span className="px-3 py-2 bg-gray-50 text-gray-500 text-sm border-l border-gray-200">VND</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourPricingSection;