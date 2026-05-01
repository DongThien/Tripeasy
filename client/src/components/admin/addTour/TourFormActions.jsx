import React from 'react';
import { Loader } from 'lucide-react';

const TourFormActions = ({ handleCancel, handleSubmit, isLoading = false }) => {
    return (
        <div className="flex justify-end gap-4 pt-6 pb-8">
            <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
                Hủy
            </button>
            <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-3 bg-[#8B1A1A] text-white font-medium rounded-lg hover:bg-[#a83232] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={isLoading}
            >
                {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                {isLoading ? 'Đang lưu...' : 'Lưu Tour'}
            </button>
        </div>
    );
};

export default TourFormActions;