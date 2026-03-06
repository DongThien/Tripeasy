import React, { useState, useEffect } from 'react';
import { X, Save, Info, DollarSign, FileText, ToggleLeft, ToggleRight, Map, Plus, Trash2 } from 'lucide-react';
import axiosClient from '../../../services/axiosClient';

const FALLBACK_IMG = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400";

const FIELD_LABEL = {
    title: 'Tên tour',
    region: 'Khu vực',
    price_adult: 'Giá người lớn',
};

const SectionHeader = ({ icon: Icon, label }) => (
    <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-red-50 rounded-lg">
            <Icon className="w-4 h-4 text-[#8B1A1A]" />
        </div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{label}</h3>
    </div>
);

const Field = ({ label, required, error, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {children}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

const inputCls = (error) =>
    `w-full px-3 py-2 text-sm border rounded-lg outline-none transition focus:ring-2 focus:ring-[#8B1A1A]/30 focus:border-[#8B1A1A] ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`;

const EditTourForm = ({ tourData, onClose, onSaved }) => {
    const [form, setForm] = useState({
        title: '',
        region: '',
        destination: '',
        duration: '',
        quantity: '',
        price_adult: '',
        price_child: '',
        availability: true,
        description: '',
    });
    const [itinerary, setItinerary] = useState([{ day: 1, title: '', content: '' }]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Đổ dữ liệu tourData vào form khi mở
    useEffect(() => {
        if (!tourData) return;

        // Parse itinerary thành array
        let parsedItinerary = [{ day: 1, title: '', content: '' }];
        if (tourData.itinerary) {
            try {
                const parsed = typeof tourData.itinerary === 'string'
                    ? JSON.parse(tourData.itinerary)
                    : tourData.itinerary;
                if (Array.isArray(parsed) && parsed.length > 0) {
                    parsedItinerary = parsed.map((d, i) => ({
                        day: d.day ?? i + 1,
                        title: d.title || '',
                        content: d.content || '',
                    }));
                }
            } catch {
                parsedItinerary = [{ day: 1, title: '', content: '' }];
            }
        }

        setItinerary(parsedItinerary);
        setForm({
            title: tourData.title || '',
            region: tourData.region || '',
            destination: tourData.destination || '',
            duration: tourData.duration || '',
            quantity: tourData.quantity ?? '',
            price_adult: tourData.price_adult ?? '',
            price_child: tourData.price_child ?? '',
            availability: tourData.availability ?? true,
            description: tourData.description || '',
        });
        setErrors({});
    }, [tourData]);

    // Đóng khi bấm ESC
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    const set = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const addItineraryDay = () =>
        setItinerary(prev => [...prev, { day: prev.length + 1, title: '', content: '' }]);

    const removeItineraryDay = (index) => {
        if (itinerary.length > 1)
            setItinerary(prev => prev.filter((_, i) => i !== index));
    };

    const updateItinerary = (index, field, value) =>
        setItinerary(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));

    const validate = () => {
        const errs = {};
        if (!form.title.trim()) errs.title = 'Tên tour không được để trống.';
        if (!form.region) errs.region = 'Vui lòng chọn khu vực.';
        if (!form.price_adult || isNaN(parseFloat(String(form.price_adult).replace(/[^\d.]/g, ''))))
            errs.price_adult = 'Giá người lớn không hợp lệ.';
        return errs;
    };

    const handleSubmit = async () => {
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }

        setIsSubmitting(true);
        try {
            const payload = {
                title: form.title.trim(),
                region: form.region,
                destination: form.destination.trim(),
                duration: form.duration.trim(),
                quantity: Number(form.quantity) || 0,
                price_adult: Math.round(parseFloat(String(form.price_adult).replace(/[^\d.]/g, '')) || 0),
                price_child: Math.round(parseFloat(String(form.price_child).replace(/[^\d.]/g, '')) || 0),
                availability: form.availability,
                description: form.description.trim(),
                itinerary: JSON.stringify(itinerary),
            };

            const res = await axiosClient.put(`/tours/${tourData.tour_id}`, payload);
            if (res.data.success) {
                onSaved?.(res.data.data);
                onClose();
            } else {
                alert('Lỗi: ' + res.data.message);
            }
        } catch (err) {
            alert('Lỗi server: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!tourData) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* ── HEADER ── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Chỉnh sửa Tour</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Mã: TRP-{tourData.tour_id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition"
                        aria-label="Đóng"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* ── BODY (scrollable) ── */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

                    {/* NHÓM 1: Thông tin cơ bản */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <SectionHeader icon={Info} label="Thông tin cơ bản" />
                        <div className="space-y-4">
                            <Field label="Tên tour" required error={errors.title}>
                                <input
                                    type="text"
                                    className={inputCls(errors.title)}
                                    value={form.title}
                                    onChange={e => set('title', e.target.value)}
                                    placeholder="Nhập tên tour..."
                                />
                            </Field>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Khu vực" required error={errors.region}>
                                    <select
                                        className={inputCls(errors.region)}
                                        value={form.region}
                                        onChange={e => set('region', e.target.value)}
                                    >
                                        <option value="">-- Chọn khu vực --</option>
                                        <option value="Miền Bắc">Miền Bắc</option>
                                        <option value="Miền Trung">Miền Trung</option>
                                        <option value="Miền Nam">Miền Nam</option>
                                    </select>
                                </Field>
                                <Field label="Điểm đến cụ thể">
                                    <input
                                        type="text"
                                        className={inputCls(false)}
                                        value={form.destination}
                                        onChange={e => set('destination', e.target.value)}
                                        placeholder="VD: Đà Nẵng, Phú Quốc..."
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>

                    {/* NHÓM 2: Thông số */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <SectionHeader icon={DollarSign} label="Thông số & Giá" />
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <Field label="Thời gian">
                                <input
                                    type="text"
                                    className={inputCls(false)}
                                    value={form.duration}
                                    onChange={e => set('duration', e.target.value)}
                                    placeholder="VD: 3N2Đ"
                                />
                            </Field>
                            <Field label="Số lượng chỗ">
                                <input
                                    type="number"
                                    min="1"
                                    className={inputCls(false)}
                                    value={form.quantity}
                                    onChange={e => set('quantity', e.target.value)}
                                    placeholder="20"
                                />
                            </Field>
                            <Field label="Giá người lớn" required error={errors.price_adult}>
                                <input
                                    type="text"
                                    className={inputCls(errors.price_adult)}
                                    value={form.price_adult}
                                    onChange={e => set('price_adult', e.target.value)}
                                    placeholder="VD: 3500000"
                                />
                            </Field>
                            <Field label="Giá trẻ em">
                                <input
                                    type="text"
                                    className={inputCls(false)}
                                    value={form.price_child}
                                    onChange={e => set('price_child', e.target.value)}
                                    placeholder="VD: 1800000"
                                />
                            </Field>
                        </div>
                    </div>

                    {/* NHÓM 3: Mô tả */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <SectionHeader icon={FileText} label="Nội dung chi tiết" />
                        <Field label="Mô tả">
                            <textarea
                                rows={4}
                                className={inputCls(false) + ' resize-y'}
                                value={form.description}
                                onChange={e => set('description', e.target.value)}
                                placeholder="Mô tả ngắn về tour..."
                            />
                        </Field>
                    </div>

                    {/* NHÓM LỊCH TRÌNH */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-red-50 rounded-lg">
                                    <Map className="w-4 h-4 text-[#8B1A1A]" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Lịch trình</h3>
                            </div>
                            <button
                                type="button"
                                onClick={addItineraryDay}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#8B1A1A] hover:bg-red-50 rounded-lg transition font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Thêm ngày
                            </button>
                        </div>

                        <div className="space-y-3">
                            {itinerary.map((day, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="bg-[#8B1A1A] text-white px-3 py-1 rounded-full text-sm font-medium">
                                            Ngày {day.day}
                                        </span>
                                        {itinerary.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItineraryDay(index)}
                                                className="text-gray-400 hover:text-red-500 transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Tiêu đề ngày (VD: Đón khách - Tham quan Sơn Trà)"
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A1A]/30 focus:border-[#8B1A1A] outline-none"
                                            value={day.title}
                                            onChange={e => updateItinerary(index, 'title', e.target.value)}
                                        />
                                        <textarea
                                            rows={4}
                                            placeholder="Chi tiết các hoạt động trong ngày..."
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A1A]/30 focus:border-[#8B1A1A] outline-none resize-none"
                                            value={day.content}
                                            onChange={e => updateItinerary(index, 'content', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* NHÓM 4: Trạng thái */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 bg-red-50 rounded-lg">
                                <ToggleRight className="w-4 h-4 text-[#8B1A1A]" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Trạng thái</h3>
                        </div>
                        <div className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-200">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Trạng thái tour</p>
                                <p className="text-xs text-gray-500">
                                    {form.availability ? 'Tour đang được hiển thị với khách hàng' : 'Tour đang ở trạng thái bản nháp'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => set('availability', !form.availability)}
                                className="flex items-center gap-2 focus:outline-none"
                                aria-label="Toggle availability"
                            >
                                {form.availability ? (
                                    <>
                                        <span className="text-xs font-semibold text-green-600">Hoạt động</span>
                                        <ToggleRight className="w-9 h-9 text-green-500" />
                                    </>
                                ) : (
                                    <>
                                        <span className="text-xs font-semibold text-gray-400">Bản nháp</span>
                                        <ToggleLeft className="w-9 h-9 text-gray-400" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── FOOTER ── */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-5 py-2 text-sm font-semibold text-white bg-[#8B1A1A] rounded-lg hover:bg-[#a83232] transition flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Lưu thay đổi
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTourForm;
