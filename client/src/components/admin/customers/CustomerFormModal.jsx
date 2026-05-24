import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, UserPlus, Pencil, Loader2 } from 'lucide-react';
import userService from '../../../services/userService';
import toast from 'react-hot-toast';

const CustomerFormModal = ({ customer, onClose, onSaved }) => {
    const isEditMode = !!customer;
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Form states
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (customer) {
            setUsername(customer.name || '');
            setEmail(customer.email || '');
            setPhone(customer.phone === '—' ? '' : customer.phone);
        } else {
            setUsername('');
            setEmail('');
            setPhone('');
            setPassword('');
        }
    }, [customer]);

    if (!mounted) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!username.trim()) {
            return toast.error('Vui lòng nhập họ và tên');
        }
        if (!isEditMode && !email.trim()) {
            return toast.error('Vui lòng nhập email');
        }
        if (!isEditMode && !password.trim()) {
            return toast.error('Vui lòng nhập mật khẩu');
        }
        if (!isEditMode && password.length < 6) {
            return toast.error('Mật khẩu phải có tối thiểu 6 ký tự');
        }

        // Email validation regex
        if (!isEditMode) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.trim())) {
                return toast.error('Định dạng email không hợp lệ');
            }
        }

        // Phone validation (simple)
        if (phone.trim()) {
            const phoneRegex = /^[0-9+()#.\s-]{8,20}$/;
            if (!phoneRegex.test(phone.trim())) {
                return toast.error('Số điện thoại không hợp lệ');
            }
        }

        setLoading(true);
        try {
            if (isEditMode) {
                // Edit Mode
                const res = await userService.updateUser(customer.id, {
                    username: username.trim(),
                    phone_number: phone.trim() || null,
                    address: null
                });
                if (res.success || res.user_id || res.id) {
                    toast.success('Cập nhật thông tin khách hàng thành công!');
                    onSaved({
                        ...customer,
                        name: username.trim(),
                        phone: phone.trim() || '—'
                    });
                    onClose();
                } else {
                    toast.error(res.message || 'Cập nhật thất bại');
                }
            } else {
                // Add Mode
                const res = await userService.createUser({
                    username: username.trim(),
                    email: email.trim().toLowerCase(),
                    password: password.trim(),
                    phone_number: phone.trim() || null
                });
                toast.success('Thêm tài khoản khách hàng thành công!');
                onSaved(); // trigger refetch in parent
                onClose();
            }
        } catch (err) {
            console.error('Error submitting customer form:', err);
            toast.error(err.response?.data?.message || err.message || 'Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] w-screen h-screen bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="bg-[#8B1A1A] px-6 py-4 flex items-center justify-between text-white flex-shrink-0">
                    <div className="flex items-center gap-2">
                        {isEditMode ? <Pencil className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                        <h3 className="font-bold text-lg">
                            {isEditMode ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}
                        </h3>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-1.5 rounded-full hover:bg-white/10 transition text-white/80 hover:text-white"
                        title="Đóng"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="p-6 overflow-y-auto space-y-4 flex-1 text-sm text-gray-700">
                        {/* Name Field */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Họ và tên <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                placeholder="Ví dụ: Nguyễn Văn A"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 transition text-gray-800"
                                disabled={loading}
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Địa chỉ Email {!isEditMode && <span className="text-red-500">*</span>}</label>
                            <input
                                type="email"
                                placeholder="Ví dụ: nva@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none transition text-gray-800
                                    ${isEditMode ? 'bg-gray-100 cursor-not-allowed border-gray-200 text-gray-400' : 'focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40'}`}
                                disabled={isEditMode || loading}
                            />
                            {isEditMode && <p className="text-[10px] text-gray-400">Không cho phép thay đổi email tài khoản.</p>}
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Số điện thoại</label>
                            <input
                                type="text"
                                placeholder="Ví dụ: 0912345678"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 transition text-gray-800"
                                disabled={loading}
                            />
                        </div>

                        {/* Password Field (Only for Add Mode) */}
                        {!isEditMode && (
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Mật khẩu khởi tạo <span className="text-red-500">*</span></label>
                                <input
                                    type="password"
                                    placeholder="Tối thiểu 6 ký tự"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 transition text-gray-800"
                                    disabled={loading}
                                />
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2 flex-shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl transition"
                            disabled={loading}
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#8B1A1A] hover:bg-[#701313] text-white text-xs font-semibold rounded-xl shadow-md transition flex items-center gap-1.5"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            {isEditMode ? 'Lưu thay đổi' : 'Thêm mới'}
                        </button>
                    </div>
                </form>

            </div>
        </div>,
        document.body
    );
};

export default CustomerFormModal;
