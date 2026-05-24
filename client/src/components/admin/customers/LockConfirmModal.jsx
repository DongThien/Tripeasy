import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X, ShieldAlert, Loader2 } from 'lucide-react';

const LockConfirmModal = ({ customer, onClose, onConfirm }) => {
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!customer || !mounted) return null;

    const isLocked = customer.status === 'locked';

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] w-screen h-screen bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className={`px-6 py-4 flex items-center gap-2 text-white flex-shrink-0
                    ${isLocked ? 'bg-green-600' : 'bg-red-600'}`}>
                    <ShieldAlert className="w-5 h-5" />
                    <h3 className="font-bold text-lg">
                        {isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                    </h3>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 text-sm text-gray-700">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className={`w-8 h-8 flex-shrink-0 mt-0.5
                            ${isLocked ? 'text-green-500' : 'text-red-500'}`} />
                        <div className="space-y-1">
                            <p className="font-bold text-gray-800">
                                {isLocked 
                                    ? `Xác nhận mở khóa tài khoản của khách hàng "${customer.name}"?`
                                    : `Xác nhận khóa tài khoản của khách hàng "${customer.name}"?`}
                            </p>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                {isLocked
                                    ? 'Sau khi mở khóa, người dùng này có thể đăng nhập, đặt tour và sử dụng toàn bộ chức năng của hệ thống Tripeasy bình thường.'
                                    : 'Khi tài khoản bị khóa, khách hàng này sẽ lập tức bị đăng xuất và không thể đăng nhập hoặc thực hiện bất kỳ giao dịch nào trên hệ thống.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl transition"
                        disabled={loading}
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`px-4 py-2 text-white text-xs font-semibold rounded-xl shadow-md transition flex items-center gap-1.5
                            ${isLocked 
                                ? 'bg-green-600 hover:bg-green-700 shadow-green-200' 
                                : 'bg-red-600 hover:bg-red-700 shadow-red-200'}`}
                        disabled={loading}
                    >
                        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Xác nhận
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
};

export default LockConfirmModal;
