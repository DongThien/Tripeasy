import React from 'react';
import { FileText, Bold, Italic, List, Link } from 'lucide-react';

const TourDescriptionSection = ({ formData, handleInputChange }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-50 rounded-lg">
                    <FileText className="w-5 h-5 text-[#8B1A1A]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Mô tả chi tiết</h3>
            </div>

            <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg mb-4">
                <button type="button" className="p-2 hover:bg-gray-100 rounded">
                    <Bold className="w-4 h-4 text-gray-600" />
                </button>
                <button type="button" className="p-2 hover:bg-gray-100 rounded">
                    <Italic className="w-4 h-4 text-gray-600" />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button type="button" className="p-2 hover:bg-gray-100 rounded">
                    <List className="w-4 h-4 text-gray-600" />
                </button>
                <button type="button" className="p-2 hover:bg-gray-100 rounded">
                    <Link className="w-4 h-4 text-gray-600" />
                </button>
            </div>

            <textarea
                rows={10}
                placeholder="Nhập mô tả chi tiết về tour du lịch..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent outline-none resize-none"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
            />
        </div>
    );
};

export default TourDescriptionSection;