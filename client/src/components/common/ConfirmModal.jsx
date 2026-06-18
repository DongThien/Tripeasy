import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, HelpCircle, X } from 'lucide-react';

const ConfirmModal = ({ 
    isOpen, 
    title, 
    message, 
    confirmText = 'Xác nhận', 
    cancelText = 'Hủy bỏ', 
    onConfirm, 
    onCancel, 
    type = 'danger' // 'danger' | 'warning' | 'info'
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const getIcon = () => {
        switch (type) {
            case 'danger':
                return (
                    <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                        <AlertTriangle className="w-7 h-7" />
                    </div>
                );
            case 'warning':
                return (
                    <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
                        <HelpCircle className="w-7 h-7" />
                    </div>
                );
            default:
                return (
                    <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                        <HelpCircle className="w-7 h-7" />
                    </div>
                );
        }
    };

    const getConfirmBtnClass = () => {
        if (type === 'danger') {
            return 'bg-red-600 hover:bg-red-700 shadow-red-100 focus:ring-red-500';
        }
        return 'bg-[#8B1A1A] hover:bg-[#721515] shadow-red-150 focus:ring-red-900';
    };

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">
            {/* Modal Box */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100 flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button 
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                    title="Đóng"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Icon Section */}
                <div className="flex justify-center mb-4">
                    {getIcon()}
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">{title}</h3>
                <p className="text-sm text-gray-500 text-center leading-relaxed whitespace-pre-line px-2">
                    {message}
                </p>

                {/* Footer Buttons */}
                <div className="flex gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-750 text-xs font-semibold rounded-xl transition focus:outline-none"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`flex-1 py-2.5 text-white text-xs font-semibold rounded-xl shadow-md transition focus:outline-none ${getConfirmBtnClass()}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmModal;
