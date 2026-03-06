import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmDeleteModal = ({ tour, onConfirm, onCancel, isDeleting }) => {
    if (!tour) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onCancel}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
                onClick={e => e.stopPropagation()}
            >
                {/* Icon cảnh báo */}
                <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-7 h-7 text-[#8B1A1A]" />
                    </div>
                </div>

                {/* Nội dung */}
                <h2 className="text-lg font-bold text-gray-900 text-center mb-2">Xác nhận xóa</h2>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                    Bạn có chắc chắn muốn xóa tour{' '}
                    <span className="font-semibold text-gray-900">"{tour.title}"</span> không?
                    <br />
                    <span className="text-red-500 font-medium">Hành động này không thể hoàn tác.</span>
                </p>

                {/* Nút bấm */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="flex-1 py-2.5 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#8B1A1A] rounded-lg hover:bg-[#a83232] transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? (
                            <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Đang xóa...
                            </>
                        ) : (
                            'Xác nhận xóa'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
