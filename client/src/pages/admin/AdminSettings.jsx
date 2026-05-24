import React, { useState, useEffect } from 'react';
import { Settings, CreditCard, ShieldAlert, Bot, Save, Loader2, Globe, Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react';
import settingService from '../../services/settingService';
import toast from 'react-hot-toast';

const VIETQR_BANKS = [
    { value: 'mb', label: 'MB Bank (Ngân hàng Quân Đội)' },
    { value: 'vietcombank', label: 'Vietcombank (Ngoại thương Việt Nam)' },
    { value: 'techcombank', label: 'Techcombank (Kỹ thương Việt Nam)' },
    { value: 'bidv', label: 'BIDV (Đầu tư và Phát triển Việt Nam)' },
    { value: 'vietinbank', label: 'VietinBank (Công thương Việt Nam)' },
    { value: 'acb', label: 'ACB (Á Châu)' },
    { value: 'tpb', label: 'TPBank (Tiên Phong)' },
    { value: 'vpbank', label: 'VPBank (Việt Nam Thịnh Vượng)' },
    { value: 'sacombank', label: 'Sacombank (Sài Gòn Thương Tín)' },
];

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Settings State matching JSON structure
    const [settings, setSettings] = useState({
        general: {
            siteName: '',
            hotline: '',
            email: '',
            address: '',
            facebook: '',
            instagram: ''
        },
        payment: {
            bankCode: 'mb',
            accountNumber: '',
            accountName: '',
            qrTemplate: 'TRIPEASY BK {booking_id}'
        },
        policy: {
            depositRatio: 100,
            freeCancellationDays: 5,
            defaultVat: 10
        },
        chatbot: {
            quickQuestions: ['', '', '', '']
        }
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const res = await settingService.getSettings();
            if (res.success && res.data) {
                // Đảm bảo quickQuestions luôn có ít nhất 4 phần tử
                const qq = res.data.chatbot?.quickQuestions || [];
                const quickQuestions = [...qq, '', '', '', ''].slice(0, 4);
                
                setSettings({
                    general: {
                        siteName: res.data.general?.siteName || '',
                        hotline: res.data.general?.hotline || '',
                        email: res.data.general?.email || '',
                        address: res.data.general?.address || '',
                        facebook: res.data.general?.facebook || '',
                        instagram: res.data.general?.instagram || ''
                    },
                    payment: {
                        bankCode: res.data.payment?.bankCode || 'mb',
                        accountNumber: res.data.payment?.accountNumber || '',
                        accountName: res.data.payment?.accountName || '',
                        qrTemplate: res.data.payment?.qrTemplate || 'TRIPEASY BK {booking_id}'
                    },
                    policy: {
                        depositRatio: res.data.policy?.depositRatio ?? 100,
                        freeCancellationDays: res.data.policy?.freeCancellationDays ?? 5,
                        defaultVat: res.data.policy?.defaultVat ?? 10
                    },
                    chatbot: { quickQuestions }
                });
            }
        } catch (err) {
            console.error(err);
            toast.error('Không thể tải cấu hình hệ thống');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (section, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleQuickQuestionChange = (index, value) => {
        setSettings(prev => {
            const newQQ = [...prev.chatbot.quickQuestions];
            newQQ[index] = value;
            return {
                ...prev,
                chatbot: {
                    ...prev.chatbot,
                    quickQuestions: newQQ
                }
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Loại bỏ các câu hỏi trống trước khi gửi đi
            const filteredQQ = settings.chatbot.quickQuestions.filter(q => q.trim() !== '');
            const payload = {
                ...settings,
                chatbot: {
                    quickQuestions: filteredQQ
                }
            };

            const res = await settingService.updateSettings(payload);
            if (res.success) {
                toast.success('Cập nhật cấu hình hệ thống thành công!');
                // Nạp lại cấu hình để đảm bảo đồng bộ
                fetchSettings();
            } else {
                toast.error(res.message || 'Cập nhật cấu hình thất bại');
            }
        } catch (err) {
            console.error(err);
            toast.error('Có lỗi xảy ra khi lưu cấu hình');
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'Thông tin chung', icon: <Globe size={18} /> },
        { id: 'payment', label: 'Tài khoản VietQR', icon: <CreditCard size={18} /> },
        { id: 'policy', label: 'Quy định & Chính sách', icon: <ShieldAlert size={18} /> },
        { id: 'chatbot', label: 'Gợi ý Chatbot', icon: <Bot size={18} /> },
    ];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 font-sans">
                <Loader2 className="w-10 h-10 animate-spin text-[#8B1A1A]" />
                <p className="text-gray-500 text-sm">Đang tải cấu hình hệ thống Tripeasy...</p>
            </div>
        );
    }

    return (
        <div className="font-sans max-w-4xl">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#8B1A1A]">Cài đặt Hệ thống</h1>
                <p className="text-sm text-gray-500 mt-1">Cấu hình các tham số vận hành, tài khoản ngân hàng VietQR, chính sách tour và chatbot của Tripeasy.</p>
            </div>

            {/* Main Layout Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                {/* Tabs Sidebar */}
                <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-4 space-y-1 flex-shrink-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                                ${activeTab === tab.id
                                    ? 'bg-[#8B1A1A] text-white shadow-md shadow-red-950/10'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Form Content Area */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
                    <div className="p-6 md:p-8 space-y-6">
                        {/* 1. General Tab */}
                        {activeTab === 'general' && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Thông tin doanh nghiệp & Liên hệ</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5 col-span-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tên Website / Thương hiệu</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={settings.general.siteName}
                                                onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                                                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 text-gray-800"
                                                placeholder="Ví dụ: Tripeasy"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hotline hỗ trợ</label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Phone size={15} /></span>
                                            <input
                                                type="text"
                                                value={settings.general.hotline}
                                                onChange={(e) => handleInputChange('general', 'hotline', e.target.value)}
                                                className="w-full pl-10 pr-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 text-gray-800"
                                                placeholder="Ví dụ: 1900 1234"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email liên hệ</label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={15} /></span>
                                            <input
                                                type="email"
                                                value={settings.general.email}
                                                onChange={(e) => handleInputChange('general', 'email', e.target.value)}
                                                className="w-full pl-10 pr-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 text-gray-800"
                                                placeholder="Ví dụ: info@tripeasy.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 col-span-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Địa chỉ văn phòng</label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><MapPin size={15} /></span>
                                            <input
                                                type="text"
                                                value={settings.general.address}
                                                onChange={(e) => handleInputChange('general', 'address', e.target.value)}
                                                className="w-full pl-10 pr-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 text-gray-800"
                                                placeholder="Số nhà, Tên đường, Quận/Huyện, Tỉnh/Thành phố..."
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trang Facebook (URL)</label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Facebook size={15} /></span>
                                            <input
                                                type="text"
                                                value={settings.general.facebook}
                                                onChange={(e) => handleInputChange('general', 'facebook', e.target.value)}
                                                className="w-full pl-10 pr-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 text-gray-800"
                                                placeholder="https://facebook.com/..."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tài khoản Instagram (URL)</label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Instagram size={15} /></span>
                                            <input
                                                type="text"
                                                value={settings.general.instagram}
                                                onChange={(e) => handleInputChange('general', 'instagram', e.target.value)}
                                                className="w-full pl-10 pr-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 text-gray-800"
                                                placeholder="https://instagram.com/..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. Payment Tab */}
                        {activeTab === 'payment' && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Tài khoản Ngân hàng nhận thanh toán (VietQR)</h3>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ngân hàng thụ hưởng</label>
                                        <select
                                            value={settings.payment.bankCode}
                                            onChange={(e) => handleInputChange('payment', 'bankCode', e.target.value)}
                                            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 text-gray-800 bg-white cursor-pointer"
                                            required
                                        >
                                            {VIETQR_BANKS.map(bank => (
                                                <option key={bank.value} value={bank.value}>{bank.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Số tài khoản ngân hàng</label>
                                        <input
                                            type="text"
                                            value={settings.payment.accountNumber}
                                            onChange={(e) => handleInputChange('payment', 'accountNumber', e.target.value)}
                                            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 text-gray-800"
                                            placeholder="Nhập số tài khoản thụ hưởng..."
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tên chủ tài khoản (Viết hoa không dấu)</label>
                                        <input
                                            type="text"
                                            value={settings.payment.accountName}
                                            onChange={(e) => handleInputChange('payment', 'accountName', e.target.value.toUpperCase())}
                                            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 text-gray-800 uppercase"
                                            placeholder="Ví dụ: NGUYEN DONG THIEN"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mẫu nội dung chuyển khoản mặc định</label>
                                        <input
                                            type="text"
                                            value={settings.payment.qrTemplate}
                                            onChange={(e) => handleInputChange('payment', 'qrTemplate', e.target.value)}
                                            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 text-gray-800"
                                            placeholder="Ví dụ: TRIPEASY BK {booking_id}"
                                            required
                                        />
                                        <p className="text-[10px] text-gray-400">* Ghi chú: Chuỗi `{'{booking_id}'}` sẽ tự động được thay thế bằng mã đơn đặt tour tương ứng khi sinh mã VietQR.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. Policy Tab */}
                        {activeTab === 'policy' && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Quy định đặt chỗ & Chính sách hoàn hủy</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tỷ lệ đặt cọc tối thiểu (%)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="10"
                                                max="100"
                                                value={settings.policy.depositRatio}
                                                onChange={(e) => handleInputChange('policy', 'depositRatio', parseInt(e.target.value) || 100)}
                                                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 text-gray-800"
                                                required
                                            />
                                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">%</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Thuế VAT mặc định (%)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="0"
                                                max="20"
                                                value={settings.policy.defaultVat}
                                                onChange={(e) => handleInputChange('policy', 'defaultVat', parseInt(e.target.value) || 0)}
                                                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 text-gray-800"
                                                required
                                            />
                                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">%</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 col-span-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hạn hủy tour miễn phí (Số ngày trước khởi hành)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="1"
                                                max="30"
                                                value={settings.policy.freeCancellationDays}
                                                onChange={(e) => handleInputChange('policy', 'freeCancellationDays', parseInt(e.target.value) || 5)}
                                                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 text-gray-800"
                                                required
                                            />
                                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">ngày</span>
                                        </div>
                                        <p className="text-[10px] text-gray-400">* Lưu ý: Khách hàng được phép hủy đơn đặt chỗ và nhận hoàn cọc miễn phí 100% nếu thực hiện trước ngày khởi hành tối thiểu là số ngày cấu hình trên.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 4. Chatbot Tab */}
                        {activeTab === 'chatbot' && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Câu hỏi nhanh gợi ý cho Chatbot AI</h3>
                                <p className="text-xs text-gray-500">Nhập tối đa 4 câu hỏi/nhu cầu phổ biến để hiển thị dưới dạng bong bóng nút nhấn khi khách hàng mở khung Chatbot, giúp khách bắt đầu cuộc trò chuyện dễ dàng hơn.</p>
                                <div className="space-y-3.5 mt-2">
                                    {settings.chatbot.quickQuestions.map((q, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Câu hỏi gợi ý {idx + 1}</label>
                                            <input
                                                type="text"
                                                value={q}
                                                onChange={(e) => handleQuickQuestionChange(idx, e.target.value)}
                                                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 text-gray-800 text-sm"
                                                placeholder={`Nhập nội dung câu gợi ý thứ ${idx + 1}...`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Bar */}
                    <div className="px-6 py-4 md:px-8 bg-gray-50 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#8B1A1A] hover:bg-[#7a1616] text-white text-sm font-semibold rounded-xl transition shadow-md shadow-red-900/10 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Lưu cấu hình
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminSettings;
